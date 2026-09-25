/**
 * @module core/Diagram
 * @description Headless diagram document: the objects plus the operations that keep them consistent
 * (adding/removing objects, connecting ports with validation, port usage, semantic validation,
 * automatic layout, bounds). It has no DOM dependency and is used by the editor, the MCP server
 * and the tests.
 *
 * @example
 * const d = new Diagram();
 * const srv = d.createShape('server', { label: 'Media Server', ports: { video: { input: 0, output: 2 } } });
 * const led = d.createShape('led_processor', { label: 'LED Proc' });
 * d.connect({ from: srv, fromPort: 'video_output', to: led, toPort: 'video_input' });
 * d.autoLayout();
 * d.validate(); // { errors: [], warnings: [] }
 *
 * @see module:core/Serialization
 * @see module:core/Ports
 */

import { ShapeRegistry } from './ShapeRegistry.js';
import { Connector } from './Connector.js';
import { ConnectionTypeRegistry } from '../config/ConnectionTypes.js';
import { anchorsCompatible, parsePortKey, portLabel } from './Ports.js';
import { serializeObjects, deserializeObjects, createDocument, parseDocument } from './Serialization.js';

/**
 * Error raised for invalid diagram operations. `details` carries machine-readable hints
 * (e.g. the list of free ports) so agents can recover.
 */
export class DiagramError extends Error {
    /**
     * @param {string} message
     * @param {Object} [details]
     */
    constructor(message, details = {}) {
        super(message);
        this.name = 'DiagramError';
        this.details = details;
    }
}

export class Diagram {
    /**
     * @param {Object} [init]
     * @param {Array} [init.objects] Live objects.
     * @param {Object} [init.metadata]
     */
    constructor(init = {}) {
        /** @type {Array} Shapes and connectors, in insertion (z) order */
        this.objects = init.objects || [];
        /** @type {Object} */
        this.metadata = init.metadata || {};
        /** @type {number} */
        this.nextGroupId = this.computeNextGroupId(this.metadata.nextGroupId);
    }

    /**
     * Loads a diagram from a document (object or JSON string).
     * @param {Object|string} doc
     * @returns {{diagram: Diagram, warnings: string[]}}
     */
    static fromJSON(doc) {
        const parsed = parseDocument(doc);
        const diagram = new Diagram({ objects: parsed.objects, metadata: parsed.metadata });
        return { diagram, warnings: parsed.warnings };
    }

    /**
     * Serialises the diagram to a document.
     * @param {Object} [extraMetadata]
     * @returns {Object}
     */
    toJSON(extraMetadata = {}) {
        return createDocument({
            objects: this.objects,
            metadata: { ...this.metadata, ...extraMetadata, nextGroupId: this.nextGroupId }
        });
    }

    /**
     * Deep copy of the diagram.
     * @returns {Diagram}
     */
    clone() {
        const objects = deserializeObjects(JSON.parse(JSON.stringify(serializeObjects(this.objects))));
        return new Diagram({ objects, metadata: JSON.parse(JSON.stringify(this.metadata)) });
    }

    /** @private */
    computeNextGroupId(hint) {
        let max = 0;
        for (const obj of this.objects) {
            const g = Number(obj.groupId);
            if (Number.isFinite(g) && g > max) max = g;
        }
        return Math.max(Number(hint) || 1, max + 1);
    }

    /** @returns {Array} Non-connector objects */
    get shapes() {
        return this.objects.filter(o => o.type !== 'connector');
    }

    /** @returns {Connector[]} */
    get connectors() {
        return this.objects.filter(o => o.type === 'connector');
    }

    /**
     * @param {string} id
     * @returns {Object|undefined}
     */
    getById(id) {
        return this.objects.find(o => o.id === id);
    }

    /**
     * Case-insensitive label lookup among shapes.
     * @param {string} label
     * @returns {Array}
     */
    findByLabel(label) {
        const needle = String(label).trim().toLowerCase();
        return this.shapes.filter(s => String(s.label || '').trim().toLowerCase() === needle);
    }

    /**
     * Resolves an object reference: an instance, an id, or a unique label.
     * @param {Object|string} ref
     * @param {{shapesOnly: boolean}} [options]
     * @returns {Object}
     * @throws {DiagramError} When nothing (or more than one label match) is found.
     */
    resolve(ref, options = {}) {
        if (ref && typeof ref === 'object') {
            if (this.objects.includes(ref)) return ref;
            throw new DiagramError('Object is not part of this diagram');
        }
        const key = String(ref);
        const byId = this.getById(key);
        if (byId && (!options.shapesOnly || byId.type !== 'connector')) return byId;
        const matches = this.findByLabel(key);
        if (matches.length === 1) return matches[0];
        if (matches.length > 1) {
            throw new DiagramError(`Label "${key}" is ambiguous (${matches.length} objects); use an id instead`, {
                candidates: matches.map(m => ({ id: m.id, type: m.type }))
            });
        }
        throw new DiagramError(`No object with id or label "${key}"`, {
            available: this.shapes.map(s => ({ id: s.id, type: s.type, label: s.label || '' }))
        });
    }

    /**
     * Adds an object, ensuring its id is unique.
     * @param {Object} obj
     * @returns {Object} The same object.
     * @throws {DiagramError} On duplicate ids.
     */
    add(obj) {
        if (this.getById(obj.id)) throw new DiagramError(`An object with id "${obj.id}" already exists`);
        this.objects.push(obj);
        return obj;
    }

    /**
     * Creates a shape through the registry and adds it.
     * @param {string} type
     * @param {Object} [props] Position, size, label, ports, ... (see ShapeRegistry.applyProps).
     * @returns {Object} The new shape.
     * @throws {DiagramError}
     */
    createShape(type, props = {}) {
        const { x = 0, y = 0, width, height, ...rest } = props;
        let shape;
        try {
            shape = ShapeRegistry.create(type, x, y, width, height, rest);
        } catch (err) {
            throw new DiagramError(err.message);
        }
        if (rest.id && this.getById(rest.id)) throw new DiagramError(`An object with id "${rest.id}" already exists`);
        return this.add(shape);
    }

    /**
     * Applies a property patch to an object. Reducing port counts that would orphan connectors is
     * refused unless `options.detachConnectors` is true (those connectors are then removed).
     * @param {Object|string} ref
     * @param {Object} patch
     * @param {{detachConnectors: boolean}} [options]
     * @returns {{object: Object, applied: string[], ignored: string[], removedConnectors: string[]}}
     * @throws {DiagramError}
     */
    updateObject(ref, patch, options = {}) {
        const obj = this.resolve(ref);
        if (obj.type === 'connector') return this.updateConnector(obj, patch);
        const removedConnectors = [];
        if (patch.ports !== undefined) {
            if (typeof obj.setPorts !== 'function') throw new DiagramError(`"${obj.type}" shapes have no ports`);
            const probe = ShapeRegistry.create(obj.type, obj.x, obj.y, obj.width, obj.height);
            try {
                probe.setPorts(patch.ports);
            } catch (err) {
                throw new DiagramError(err.message);
            }
            const newKeys = new Set(Object.keys(probe.getAnchorPoints()));
            const orphaned = this.connectors.filter(c =>
                (c.startObject === obj && !newKeys.has(c.startAnchor)) ||
                (c.endObject === obj && !newKeys.has(c.endAnchor)));
            if (orphaned.length && !options.detachConnectors) {
                throw new DiagramError(`Changing ports would orphan ${orphaned.length} connector(s); pass detachConnectors=true to remove them`, {
                    connectors: orphaned.map(c => ({ id: c.id, startAnchor: c.startAnchor, endAnchor: c.endAnchor }))
                });
            }
            for (const c of orphaned) {
                this.objects = this.objects.filter(o => o !== c);
                removedConnectors.push(c.id);
            }
        }
        if (patch.id && patch.id !== obj.id && this.getById(patch.id)) {
            throw new DiagramError(`An object with id "${patch.id}" already exists`);
        }
        let result;
        try {
            result = ShapeRegistry.applyProps(obj, patch);
        } catch (err) {
            throw new DiagramError(err.message);
        }
        return { object: obj, applied: result.applied, ignored: result.ignored, removedConnectors };
    }

    /**
     * Updates connector styling / label / waypoints.
     * @param {Connector|string} ref
     * @param {Object} patch
     * @returns {{object: Connector, applied: string[], ignored: string[], removedConnectors: string[]}}
     */
    updateConnector(ref, patch) {
        const conn = this.resolve(ref);
        if (conn.type !== 'connector') throw new DiagramError(`"${conn.id}" is not a connector`);
        const applied = [];
        const ignored = [];
        for (const [key, value] of Object.entries(patch || {})) {
            if (value === undefined) continue;
            switch (key) {
                case 'style':
                    if (!['straight', 'orthogonal', 'bezier', 'polyline'].includes(value)) throw new DiagramError(`Invalid style "${value}"`);
                    conn.style = value; break;
                case 'lineStyle':
                    if (!['solid', 'dashed', 'dotted'].includes(value)) throw new DiagramError(`Invalid lineStyle "${value}"`);
                    conn.lineStyle = value; break;
                case 'label': conn.label = String(value); break;
                case 'stroke': conn.stroke = String(value); break;
                case 'strokeWidth': conn.strokeWidth = Number(value) || 2; break;
                case 'arrowStart': conn.arrowStart = !!value; break;
                case 'arrowEnd': conn.arrowEnd = !!value; break;
                case 'visible': conn.visible = !!value; break;
                case 'zIndex': conn.zIndex = Number(value) || 0; break;
                case 'waypoints':
                    if (!Array.isArray(value)) throw new DiagramError('waypoints must be an array of {x, y}');
                    conn.waypoints = value.map(w => ({ x: Number(w.x), y: Number(w.y) }));
                    if (conn.waypoints.length && conn.style !== 'polyline') conn.style = 'polyline';
                    break;
                case 'controlPoint1':
                case 'controlPoint2':
                    conn[key] = value ? { x: Number(value.x), y: Number(value.y) } : null; break;
                case 'connectionType':
                    conn.connectionType = value || null;
                    if (value) conn.stroke = ConnectionTypeRegistry.colorFor(value);
                    break;
                default:
                    ignored.push(key); continue;
            }
            applied.push(key);
        }
        return { object: conn, applied, ignored, removedConnectors: [] };
    }

    /**
     * Removes an object; removing a shape also removes its connectors.
     * @param {Object|string} ref
     * @returns {string[]} Ids of all removed objects.
     */
    remove(ref) {
        const obj = this.resolve(ref);
        const removed = [obj.id];
        this.objects = this.objects.filter(o => {
            if (o === obj) return false;
            if (o.type === 'connector' && (o.startObject === obj || o.endObject === obj)) {
                removed.push(o.id);
                return false;
            }
            return true;
        });
        return removed;
    }

    /**
     * Connectors attached to each anchor of a shape.
     * @param {Object} shape
     * @returns {Map<string, Connector[]>}
     */
    getPortUsage(shape) {
        const usage = new Map();
        for (const c of this.connectors) {
            if (c.startObject === shape) usage.set(c.startAnchor, [...(usage.get(c.startAnchor) || []), c]);
            if (c.endObject === shape) usage.set(c.endAnchor, [...(usage.get(c.endAnchor) || []), c]);
        }
        return usage;
    }

    /**
     * Describes every anchor of a shape with its usage.
     * @param {Object|string} ref
     * @returns {Array<{key:string, label:string, type:(string|null), direction:string, x:number, y:number, connections:Array<{connectorId:string, otherObject:string, otherAnchor:string}>}>}
     */
    listPorts(ref) {
        const shape = this.resolve(ref, { shapesOnly: true });
        const usage = this.getPortUsage(shape);
        const anchors = shape.getAnchorPoints ? shape.getAnchorPoints() : {};
        return Object.entries(anchors).map(([key, a]) => ({
            key,
            label: a.label || portLabel(key),
            type: a.connectionType || null,
            direction: a.portType || 'both',
            x: Math.round(a.x * 100) / 100,
            y: Math.round(a.y * 100) / 100,
            connections: (usage.get(key) || []).map(c => ({
                connectorId: c.id,
                otherObject: c.startObject === shape ? (c.endObject ? c.endObject.id : null) : c.startObject.id,
                otherAnchor: c.startObject === shape ? c.endAnchor : c.startAnchor
            }))
        }));
    }

    /**
     * Picks a concrete anchor key on a shape from a loose port specification.
     * Accepts an exact key (`video_output_1`), a type+direction (`video_output`), a type (`video`),
     * a generic side (`left`, `right`, ...), or nothing (auto).
     * @private
     */
    resolvePortKey(shape, spec, preferredDirection, requiredType, allowOccupied) {
        const anchors = shape.getAnchorPoints ? shape.getAnchorPoints() : {};
        const keys = Object.keys(anchors);
        const usage = this.getPortUsage(shape);
        const isFree = k => !(usage.get(k) || []).length;
        const spec$ = spec === undefined || spec === null ? '' : String(spec).trim();

        if (spec$ && anchors[spec$]) {
            if (!allowOccupied && parsePortKey(spec$) && !isFree(spec$)) {
                const free = keys.filter(k => {
                    const p = parsePortKey(k);
                    const q = parsePortKey(spec$);
                    return p && q && p.type === q.type && p.direction === q.direction && isFree(k);
                });
                throw new DiagramError(`Port ${spec$} on "${shape.label || shape.id}" is already connected`, {
                    object: shape.id, port: spec$, freePorts: free, hint: 'pass allowOccupied=true to share the port'
                });
            }
            return spec$;
        }

        const candidates = keys.filter(k => {
            const a = anchors[k];
            const parsed = parsePortKey(k);
            if (spec$) {
                if (parsed) {
                    const typeDir = `${parsed.type}_${parsed.direction}`;
                    if (spec$ !== typeDir && spec$ !== parsed.type) return false;
                } else if (k !== spec$) {
                    return false;
                }
            } else if (requiredType && parsed && parsed.type !== requiredType) {
                return false;
            }
            if (preferredDirection && a.portType && a.portType !== 'both' && a.portType !== preferredDirection) return false;
            return true;
        });

        if (!candidates.length) {
            throw new DiagramError(`No port matching "${spec$ || (requiredType ? requiredType + ' ' + (preferredDirection || '') : preferredDirection || 'any')}" on "${shape.label || shape.id}" (${shape.type})`, {
                object: shape.id, availablePorts: keys
            });
        }
        const typed = candidates.filter(k => parsePortKey(k));
        const pool = typed.length ? typed : candidates;
        const free = pool.filter(k => isFree(k) || !parsePortKey(k));
        if (free.length) return free[0];
        if (allowOccupied) return pool[0];
        throw new DiagramError(`All ${pool.length} matching port(s) on "${shape.label || shape.id}" are already connected (${pool.join(', ')})`, {
            object: shape.id, matchingPorts: pool, hint: 'increase the port count with update_object, or pass allowOccupied=true'
        });
    }

    /**
     * Creates a validated connector between two shapes.
     * @param {Object} spec
     * @param {Object|string} spec.from Shape (instance, id or unique label).
     * @param {Object|string} spec.to
     * @param {string} [spec.fromPort] Port key, `type_direction`, type, side, or omitted for auto.
     * @param {string} [spec.toPort]
     * @param {string} [spec.connectionType] Force a connection type (defaults to the ports' type).
     * @param {("straight"|"orthogonal"|"bezier"|"polyline")} [spec.style='orthogonal']
     * @param {("solid"|"dashed"|"dotted")} [spec.lineStyle='solid']
     * @param {string} [spec.label]
     * @param {boolean} [spec.arrowStart=false]
     * @param {boolean} [spec.arrowEnd=true]
     * @param {Array<{x:number,y:number}>} [spec.waypoints]
     * @param {string} [spec.id]
     * @param {string} [spec.stroke] Override colour.
     * @param {number} [spec.strokeWidth]
     * @param {boolean} [spec.allowOccupied=false] Allow sharing an already connected port.
     * @returns {Connector}
     * @throws {DiagramError}
     */
    connect(spec) {
        const from = this.resolve(spec.from, { shapesOnly: true });
        const to = this.resolve(spec.to, { shapesOnly: true });
        if (from === to) throw new DiagramError('Cannot connect an object to itself');
        const forcedType = spec.connectionType ? ConnectionTypeRegistry.normalizeId(spec.connectionType) : null;

        const fromKey = this.resolvePortKey(from, spec.fromPort, 'output', forcedType, spec.allowOccupied);
        const fromAnchor = from.getAnchorPoints()[fromKey];
        const bidirectional = ConnectionTypeRegistry.isBidirectional(fromAnchor.connectionType || forcedType);
        const wantDir = bidirectional ? null : (fromAnchor.portType === 'input' ? 'output' : 'input');
        const toKey = this.resolvePortKey(to, spec.toPort, wantDir, forcedType || fromAnchor.connectionType || null, spec.allowOccupied);
        const toAnchor = to.getAnchorPoints()[toKey];

        const compat = anchorsCompatible(fromAnchor, toAnchor);
        if (!compat.ok) {
            throw new DiagramError(`Cannot connect ${from.label || from.id}.${fromKey} to ${to.label || to.id}.${toKey}: ${compat.reason}`, {
                fromPorts: Object.keys(from.getAnchorPoints()), toPorts: Object.keys(to.getAnchorPoints())
            });
        }
        const type = forcedType || compat.connectionType || null;
        if (forcedType && compat.connectionType && compat.connectionType !== forcedType) {
            throw new DiagramError(`connectionType "${forcedType}" does not match the ports' type "${compat.connectionType}"`);
        }

        const conn = new Connector(from, fromKey, to, toKey, type);
        if (spec.id) {
            if (this.getById(spec.id)) throw new DiagramError(`An object with id "${spec.id}" already exists`);
            conn.id = String(spec.id);
        }
        conn.style = spec.style || 'orthogonal';
        conn.lineStyle = spec.lineStyle || 'solid';
        conn.label = spec.label ? String(spec.label) : '';
        conn.arrowStart = !!spec.arrowStart;
        conn.arrowEnd = spec.arrowEnd === undefined ? true : !!spec.arrowEnd;
        if (Array.isArray(spec.waypoints) && spec.waypoints.length) {
            conn.waypoints = spec.waypoints.map(w => ({ x: Number(w.x), y: Number(w.y) }));
            conn.style = 'polyline';
        }
        conn.stroke = spec.stroke || (type ? ConnectionTypeRegistry.colorFor(type) : '#2c3e50');
        conn.strokeWidth = spec.strokeWidth || (type ? 3 : 2);
        this.objects.push(conn);
        return conn;
    }

    /**
     * Removes a connector by id, or every connector between two shapes.
     * @param {Object} spec
     * @param {string} [spec.id]
     * @param {Object|string} [spec.from]
     * @param {Object|string} [spec.to]
     * @returns {string[]} Removed connector ids.
     */
    disconnect(spec) {
        if (spec.id) {
            const conn = this.getById(spec.id);
            if (!conn || conn.type !== 'connector') throw new DiagramError(`No connector with id "${spec.id}"`);
            this.objects = this.objects.filter(o => o !== conn);
            return [conn.id];
        }
        const from = this.resolve(spec.from, { shapesOnly: true });
        const to = this.resolve(spec.to, { shapesOnly: true });
        const removed = [];
        this.objects = this.objects.filter(o => {
            if (o.type !== 'connector') return true;
            const between = (o.startObject === from && o.endObject === to) || (o.startObject === to && o.endObject === from);
            if (between) removed.push(o.id);
            return !between;
        });
        return removed;
    }

    /**
     * Groups shapes together (they move as a unit in the editor).
     * @param {Array<Object|string>} refs
     * @returns {number} The group id.
     */
    group(refs) {
        const shapes = refs.map(r => this.resolve(r, { shapesOnly: true }));
        if (shapes.length < 2) throw new DiagramError('A group needs at least two shapes');
        const groupId = this.nextGroupId++;
        shapes.forEach(s => { s.groupId = groupId; });
        return groupId;
    }

    /**
     * Removes shapes from their groups.
     * @param {Array<Object|string>} refs
     */
    ungroup(refs) {
        refs.map(r => this.resolve(r, { shapesOnly: true })).forEach(s => { s.groupId = null; });
    }

    /**
     * Semantic validation: dangling ports, incompatible or duplicated connections, unknown types,
     * overlapping devices, unlabeled devices.
     * @returns {{errors: string[], warnings: string[]}}
     */
    validate() {
        const errors = [];
        const warnings = [];
        const name = o => (o.label ? `"${o.label}" (${o.id})` : o.id);

        for (const s of this.shapes) {
            if (!ShapeRegistry.has(s.type)) errors.push(`${name(s)}: unknown shape type "${s.type}"`);
            if (s.ports && ShapeRegistry.get(s.type)?.hasPorts && !s.label) warnings.push(`${name(s)}: device has no label`);
            if (s.ports) {
                for (const type of Object.keys(s.ports)) {
                    if (!ConnectionTypeRegistry.has(type)) {
                        warnings.push(`${name(s)}: port type "${type}" is not a registered connection type (define it with define_connection_type for a proper colour/label)`);
                    }
                }
            }
        }

        const seenPairs = new Map();
        for (const c of this.connectors) {
            if (!c.startObject || !c.endObject) { errors.push(`connector ${c.id}: missing endpoint`); continue; }
            const sa = c.startObject.getAnchorPoints()[c.startAnchor];
            const ea = c.endObject.getAnchorPoints()[c.endAnchor];
            if (!sa) errors.push(`connector ${c.id}: port "${c.startAnchor}" no longer exists on ${name(c.startObject)}`);
            if (!ea) errors.push(`connector ${c.id}: port "${c.endAnchor}" no longer exists on ${name(c.endObject)}`);
            if (sa && ea) {
                const compat = anchorsCompatible(sa, ea);
                if (!compat.ok) errors.push(`connector ${c.id} (${name(c.startObject)} -> ${name(c.endObject)}): ${compat.reason}`);
                if (c.connectionType && compat.connectionType && c.connectionType !== compat.connectionType) {
                    warnings.push(`connector ${c.id}: connectionType "${c.connectionType}" differs from its ports' type "${compat.connectionType}"`);
                }
            }
            const pairKey = `${c.startObject.id}|${c.startAnchor}|${c.endObject.id}|${c.endAnchor}`;
            if (seenPairs.has(pairKey)) warnings.push(`connector ${c.id} duplicates connector ${seenPairs.get(pairKey)}`);
            seenPairs.set(pairKey, c.id);
        }

        for (const s of this.shapes) {
            const usage = this.getPortUsage(s);
            for (const [key, list] of usage) {
                if (parsePortKey(key) && list.length > 1) {
                    warnings.push(`${name(s)}: port ${key} has ${list.length} connections (${list.map(c => c.id).join(', ')})`);
                }
            }
        }

        const devices = this.shapes.filter(s => s.ports && s.visible !== false);
        for (let i = 0; i < devices.length; i++) {
            for (let j = i + 1; j < devices.length; j++) {
                const a = devices[i].getBounds();
                const b = devices[j].getBounds();
                const overlap = a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
                if (overlap) warnings.push(`${name(devices[i])} overlaps ${name(devices[j])}`);
            }
        }
        return { errors, warnings };
    }

    /**
     * Union of all shape bounds (and connector waypoints).
     * @param {number} [padding=0]
     * @returns {{x:number,y:number,width:number,height:number}|null} Null for an empty diagram.
     */
    getBounds(padding = 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const include = (x, y) => {
            minX = Math.min(minX, x); minY = Math.min(minY, y);
            maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
        };
        for (const s of this.shapes) {
            if (s.visible === false) continue;
            const corners = s.getRotatedBounds ? s.getRotatedBounds() : [];
            if (corners.length) corners.forEach(c => include(c.x, c.y));
            else {
                const b = s.getBounds();
                include(b.x, b.y);
                include(b.x + b.width, b.y + b.height);
            }
            const layout = s.getLabelLayout ? s.getLabelLayout() : null;
            if (layout && (layout.position === 'below' || layout.position === 'above')) {
                include(layout.x, layout.y - layout.lineHeight * layout.lines.length / 2);
                include(layout.x, layout.y + layout.lineHeight * layout.lines.length / 2);
            }
        }
        for (const c of this.connectors) {
            for (const p of c.getPathPoints()) include(p.x, p.y);
        }
        if (!Number.isFinite(minX)) return null;
        return { x: minX - padding, y: minY - padding, width: maxX - minX + padding * 2, height: maxY - minY + padding * 2 };
    }

    /**
     * Layered automatic layout following the connection flow (sources on the left / top).
     * Grouped shapes move as one unit. Waypoints and bezier control points of moved connectors are reset.
     * @param {Object} [options]
     * @param {("LR"|"TB")} [options.direction='LR']
     * @param {number} [options.columnGap=140] Gap between layers.
     * @param {number} [options.rowGap=50] Gap between nodes in a layer.
     * @param {number} [options.marginX=60]
     * @param {number} [options.marginY=60]
     * @param {boolean} [options.includeUnconnected=true] Place unconnected shapes in a final layer.
     * @returns {{layers: string[][], moved: number}}
     */
    autoLayout(options = {}) {
        const {
            direction = 'LR', columnGap = 140, rowGap = 50, marginX = 60, marginY = 60, includeUnconnected = true
        } = options;

        // Build layout units (a group is one unit).
        const unitOf = new Map();
        const units = [];
        for (const s of this.shapes) {
            if (s.visible === false) continue;
            const gid = s.groupId !== null && s.groupId !== undefined && s.groupId !== '' ? `g:${s.groupId}` : `s:${s.id}`;
            let unit = units.find(u => u.key === gid);
            if (!unit) {
                unit = { key: gid, members: [], ins: new Set(), outs: new Set(), layer: -1 };
                units.push(unit);
            }
            unit.members.push(s);
            unitOf.set(s, unit);
        }
        const edges = [];
        for (const c of this.connectors) {
            const a = unitOf.get(c.startObject);
            const b = unitOf.get(c.endObject);
            if (!a || !b || a === b) continue;
            edges.push([a, b]);
            a.outs.add(b);
            b.ins.add(a);
        }
        const connected = units.filter(u => u.ins.size || u.outs.size);
        const isolated = units.filter(u => !u.ins.size && !u.outs.size);

        // Longest-path layering; cycles are broken by DFS order.
        const state = new Map();
        const order = [];
        const visit = u => {
            state.set(u, 1);
            for (const v of u.outs) {
                if (!state.has(v)) visit(v);
            }
            state.set(u, 2);
            order.push(u);
        };
        for (const u of connected) if (!state.has(u)) visit(u);
        order.reverse();
        for (const u of order) u.layer = 0;
        for (const u of order) {
            for (const v of u.outs) {
                if (order.indexOf(v) > order.indexOf(u)) v.layer = Math.max(v.layer, u.layer + 1);
            }
        }
        const layerCount = connected.length ? Math.max(...connected.map(u => u.layer)) + 1 : 0;
        const layers = Array.from({ length: layerCount }, () => []);
        for (const u of connected) layers[u.layer].push(u);
        if (includeUnconnected && isolated.length) layers.push(isolated);

        // Order inside layers by barycenter of predecessors, stable by current position.
        const cross = direction === 'LR' ? 'y' : 'x';
        const unitBounds = u => {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const m of u.members) {
                const b = m.getBounds();
                minX = Math.min(minX, b.x); minY = Math.min(minY, b.y);
                maxX = Math.max(maxX, b.x + b.width); maxY = Math.max(maxY, b.y + b.height);
            }
            return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
        };
        const pos = new Map();
        layers.forEach((layer, li) => {
            layer.sort((a, b) => unitBounds(a)[cross] - unitBounds(b)[cross]);
            if (li > 0) {
                const bary = u => {
                    const preds = [...u.ins].filter(p => pos.has(p));
                    if (!preds.length) return Number.POSITIVE_INFINITY;
                    return preds.reduce((s, p) => s + pos.get(p), 0) / preds.length;
                };
                layer.sort((a, b) => bary(a) - bary(b));
            }
            layer.forEach((u, i) => pos.set(u, i));
        });

        // Assign coordinates.
        const sizes = layers.map(layer => layer.map(u => unitBounds(u)));
        const along = direction === 'LR' ? 'width' : 'height';
        const across = direction === 'LR' ? 'height' : 'width';
        const layerExtent = sizes.map(list => Math.max(0, ...list.map(b => b[along])));
        const layerCross = sizes.map(list => list.reduce((s, b) => s + b[across], 0) + Math.max(0, list.length - 1) * rowGap);
        const maxCross = Math.max(0, ...layerCross);
        let moved = 0;
        let cursorAlong = direction === 'LR' ? marginX : marginY;
        layers.forEach((layer, li) => {
            let cursorCross = (direction === 'LR' ? marginY : marginX) + (maxCross - layerCross[li]) / 2;
            layer.forEach((u, i) => {
                const b = sizes[li][i];
                const targetX = direction === 'LR' ? cursorAlong : cursorCross;
                const targetY = direction === 'LR' ? cursorCross : cursorAlong;
                const dx = targetX - b.x;
                const dy = targetY - b.y;
                if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
                    for (const m of u.members) { m.x += dx; m.y += dy; }
                    moved += u.members.length;
                }
                cursorCross += b[across] + rowGap;
            });
            cursorAlong += layerExtent[li] + columnGap;
        });

        const movedShapes = new Set(units.flatMap(u => u.members));
        for (const c of this.connectors) {
            if (movedShapes.has(c.startObject) || movedShapes.has(c.endObject)) {
                c.waypoints = [];
                c.controlPoint1 = null;
                c.controlPoint2 = null;
                if (c.style === 'polyline') c.style = 'orthogonal';
            }
        }
        return { layers: layers.map(layer => layer.flatMap(u => u.members.map(m => m.id))), moved };
    }

    /**
     * Human readable summary of the diagram (devices, ports, connections, issues).
     * @returns {string}
     */
    summary() {
        const lines = [];
        const shapes = this.shapes;
        const conns = this.connectors;
        lines.push(`${shapes.length} shape(s), ${conns.length} connector(s)`);
        for (const s of shapes) {
            const usage = this.getPortUsage(s);
            const portsDesc = s.ports
                ? Object.entries(s.ports).map(([t, c]) => `${t} ${c.input}in/${c.output}out`).join(', ')
                : '';
            const used = [...usage.values()].reduce((n, l) => n + l.length, 0);
            lines.push(`- ${s.id} [${s.type}] ${s.label ? `"${s.label}"` : '(no label)'} @(${Math.round(s.x)},${Math.round(s.y)}) ${Math.round(s.width)}x${Math.round(s.height)}${portsDesc ? ` ports: ${portsDesc}` : ''}${used ? ` (${used} connected)` : ''}`);
        }
        for (const c of conns) {
            lines.push(`- ${c.id}: ${c.startObject.label || c.startObject.id}.${c.startAnchor} -> ${c.endObject.label || c.endObject.id}.${c.endAnchor}${c.connectionType ? ` [${c.connectionType}]` : ''}${c.label ? ` "${c.label}"` : ''} (${c.style})`);
        }
        const v = this.validate();
        if (v.errors.length) lines.push(`Errors: ${v.errors.join(' | ')}`);
        if (v.warnings.length) lines.push(`Warnings: ${v.warnings.join(' | ')}`);
        return lines.join('\n');
    }
}
