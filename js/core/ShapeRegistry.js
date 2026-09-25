/**
 * @module core/ShapeRegistry
 * @description Single catalogue of every shape type: class, display name, category, default size and
 * default ports. Used by the editor (tool palette, properties panel, file loading), the headless
 * {@link module:core/Diagram} model and the MCP server.
 *
 * @example
 * import { ShapeRegistry } from './core/ShapeRegistry.js';
 * const srv = ShapeRegistry.create('server', 100, 100);          // default size
 * const dev = ShapeRegistry.create('device', 0, 0, 140, 90, { label: 'Encoder', ports: { sdi: { input: 1, output: 0 } } });
 *
 * @see module:core/SystemObject
 * @see module:core/Serialization
 */

import { Rectangle } from '../shapes/Rectangle.js';
import { Circle } from '../shapes/Circle.js';
import { Diamond } from '../shapes/Diamond.js';
import { Hexagon } from '../shapes/Hexagon.js';
import { Cylinder } from '../shapes/Cylinder.js';
import { Parallelogram } from '../shapes/Parallelogram.js';
import { TextShape } from '../shapes/TextShape.js';
import { ImageShape } from '../shapes/ImageShape.js';
import { Server } from '../shapes/Server.js';
import { NetworkSwitch } from '../shapes/NetworkSwitch.js';
import { VideoMatrix } from '../shapes/VideoMatrix.js';
import { LEDProcessor } from '../shapes/LEDProcessor.js';
import { SyncGenerator } from '../shapes/SyncGenerator.js';
import { ConnectorAnchor } from '../shapes/ConnectorAnchor.js';
import { Device } from '../shapes/Device.js';

/**
 * @typedef {Object} ShapeTypeDef
 * @property {string} type Type id stored in files.
 * @property {string} name Display name.
 * @property {("basic"|"system")} category
 * @property {Function} cls Constructor.
 * @property {{width:number,height:number}} defaultSize
 * @property {string} description
 * @property {boolean} [hasPorts] True for system objects with a `ports` map.
 * @property {boolean} [fixedSize] True when the shape cannot be resized.
 * @property {boolean} [alwaysShowPorts] Editor draws port dots even when unselected.
 * @property {Function} [defaultPorts] Returns the default port map.
 */

/** @type {ShapeTypeDef[]} */
const DEFS = [
    { type: 'rectangle', name: 'Rectangle', category: 'basic', cls: Rectangle, defaultSize: { width: 120, height: 80 }, description: 'Rectangle with optional rounded corners (cornerRadius).' },
    { type: 'circle', name: 'Circle', category: 'basic', cls: Circle, defaultSize: { width: 100, height: 100 }, description: 'Circle or ellipse filling its bounds.' },
    { type: 'diamond', name: 'Diamond', category: 'basic', cls: Diamond, defaultSize: { width: 120, height: 80 }, description: 'Diamond / decision node.' },
    { type: 'hexagon', name: 'Hexagon', category: 'basic', cls: Hexagon, defaultSize: { width: 120, height: 100 }, description: 'Hexagon.' },
    { type: 'cylinder', name: 'Cylinder', category: 'basic', cls: Cylinder, defaultSize: { width: 80, height: 120 }, description: 'Capsule / cylinder, typically a database or storage.' },
    { type: 'parallelogram', name: 'Parallelogram', category: 'basic', cls: Parallelogram, defaultSize: { width: 140, height: 70 }, description: 'Skewed rectangle (skew 0..1).' },
    { type: 'text', name: 'Text', category: 'basic', cls: TextShape, defaultSize: { width: 100, height: 30 }, description: 'Multi-line text block (text, fontSize, fontFamily, textAlign).' },
    { type: 'image', name: 'Image', category: 'basic', cls: ImageShape, defaultSize: { width: 200, height: 150 }, description: 'Raster image from a data URL (imageData).' },
    { type: 'server', name: 'Server', category: 'system', cls: Server, defaultSize: { width: 120, height: 180 }, description: 'Rack server with video, SDI, network and USB ports.', hasPorts: true, alwaysShowPorts: true, defaultPorts: () => Server.defaultPorts() },
    { type: 'network_switch', name: 'Network Switch', category: 'system', cls: NetworkSwitch, defaultSize: { width: 100, height: 100 }, description: 'Hexagonal network switch with bidirectional network ports.', hasPorts: true, alwaysShowPorts: true, defaultPorts: () => NetworkSwitch.defaultPorts() },
    { type: 'video_matrix', name: 'Video Matrix', category: 'system', cls: VideoMatrix, defaultSize: { width: 120, height: 180 }, description: 'Video routing matrix with video and SDI ports.', hasPorts: true, alwaysShowPorts: true, defaultPorts: () => VideoMatrix.defaultPorts() },
    { type: 'led_processor', name: 'LED Processor', category: 'system', cls: LEDProcessor, defaultSize: { width: 120, height: 100 }, description: 'LED wall processor with video/SDI inputs and video outputs.', hasPorts: true, alwaysShowPorts: true, defaultPorts: () => LEDProcessor.defaultPorts() },
    { type: 'sync_generator', name: 'Sync Generator', category: 'system', cls: SyncGenerator, defaultSize: { width: 100, height: 100 }, description: 'Hexagonal sync/reference generator with SDI ports.', hasPorts: true, alwaysShowPorts: true, defaultPorts: () => SyncGenerator.defaultPorts() },
    { type: 'device', name: 'Device', category: 'system', cls: Device, defaultSize: { width: 140, height: 90 }, description: 'Generic hardware device with a fully configurable port map. Use this for any equipment without a dedicated shape.', hasPorts: true, alwaysShowPorts: true, defaultPorts: () => Device.defaultPorts() },
    { type: 'connector_anchor', name: 'Connector Anchor', category: 'system', cls: ConnectorAnchor, defaultSize: { width: 16, height: 16 }, description: 'Universal junction point accepting any connection type (optionally pinned to one type).', fixedSize: true, alwaysShowPorts: true }
];

const byType = new Map(DEFS.map(d => [d.type, d]));

/** Properties that may be set through {@link ShapeRegistry.applyProps}. */
const SETTABLE_PROPS = new Set([
    'id', 'x', 'y', 'width', 'height', 'label', 'labelPosition', 'labelFontSize', 'description',
    'fill', 'stroke', 'strokeWidth', 'rotation', 'zIndex', 'locked', 'visible', 'groupId',
    'shadow', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY',
    'cornerRadius', 'skew', 'text', 'fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'textAlign',
    'imageData', 'opacity', 'connectionType', 'ports'
]);

/**
 * @namespace ShapeRegistry
 */
export const ShapeRegistry = {
    /**
     * @param {("basic"|"system")} [category] Optional filter.
     * @returns {ShapeTypeDef[]}
     */
    list(category) {
        return DEFS.filter(d => !category || d.category === category);
    },

    /** @returns {string[]} */
    types() {
        return DEFS.map(d => d.type);
    },

    /**
     * @param {string} type
     * @returns {ShapeTypeDef|undefined}
     */
    get(type) {
        return byType.get(type);
    },

    /** @param {string} type @returns {boolean} */
    has(type) {
        return byType.has(type);
    },

    /**
     * Display name for a type id (falls back to the id).
     * @param {string} type
     * @returns {string}
     */
    displayName(type) {
        const def = byType.get(type);
        return def ? def.name : type;
    },

    /**
     * Whether the editor should always draw port dots for this type.
     * @param {string} type
     * @returns {boolean}
     */
    alwaysShowPorts(type) {
        const def = byType.get(type);
        return !!(def && def.alwaysShowPorts);
    },

    /**
     * Creates a shape instance.
     * @param {string} type
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [width] Defaults to the type's default width.
     * @param {number} [height] Defaults to the type's default height.
     * @param {Object} [props] Extra properties applied through {@link ShapeRegistry.applyProps}.
     * @returns {BaseShape}
     * @throws {Error} For unknown types or invalid props (e.g. malformed ports).
     */
    create(type, x = 0, y = 0, width, height, props = {}) {
        const def = byType.get(type);
        if (!def) throw new Error(`Unknown shape type "${type}". Known types: ${DEFS.map(d => d.type).join(', ')}`);
        const w = width === undefined || width === null ? def.defaultSize.width : width;
        const h = height === undefined || height === null ? def.defaultSize.height : height;
        let shape;
        switch (type) {
            case 'text':
                shape = new TextShape(x, y, props.text !== undefined ? String(props.text) : 'Text');
                if (width !== undefined && width !== null) shape.width = w;
                if (height !== undefined && height !== null) shape.height = h;
                break;
            case 'image':
                shape = new ImageShape(x, y, w, h, props.imageData);
                break;
            case 'connector_anchor':
                shape = new ConnectorAnchor(x, y);
                break;
            default:
                shape = new def.cls(x, y, w, h);
        }
        const rest = { ...props };
        delete rest.text;
        delete rest.imageData;
        this.applyProps(shape, rest);
        return shape;
    },

    /**
     * Applies a bag of properties to a shape, validating ports.
     * @param {BaseShape} shape
     * @param {Object} props
     * @returns {{applied: string[], ignored: string[]}} Names of properties that were applied / not recognised.
     * @throws {Error} If `ports` is malformed or given to a shape without ports.
     */
    applyProps(shape, props = {}) {
        const applied = [];
        const ignored = [];
        for (const [key, value] of Object.entries(props || {})) {
            if (value === undefined) continue;
            if (!SETTABLE_PROPS.has(key)) { ignored.push(key); continue; }
            if (key === 'ports') {
                if (typeof shape.setPorts !== 'function') throw new Error(`"${shape.type}" shapes have no ports`);
                shape.setPorts(value);
            } else if (key === 'connectionType') {
                if (!('connectionType' in shape)) { ignored.push(key); continue; }
                shape.connectionType = value || null;
            } else if (['x', 'y', 'width', 'height', 'rotation', 'strokeWidth', 'zIndex', 'cornerRadius', 'skew', 'fontSize', 'opacity', 'labelFontSize'].includes(key)) {
                const n = Number(value);
                if (!Number.isFinite(n)) throw new Error(`${key} must be a finite number`);
                shape[key] = n;
            } else if (['locked', 'visible', 'shadow'].includes(key)) {
                shape[key] = !!value;
            } else if (key === 'text') {
                if (!('text' in shape)) { ignored.push(key); continue; }
                shape.text = String(value);
            } else if (key === 'imageData') {
                if (typeof shape.loadImage === 'function') shape.loadImage(String(value));
                else { ignored.push(key); continue; }
            } else {
                shape[key] = value;
            }
            applied.push(key);
        }
        return { applied, ignored };
    },

    /**
     * Restores a shape from its JSON form. Unknown types fall back to a rectangle (a warning is returned
     * via `options.onWarning`).
     * @param {Object} data
     * @param {{onWarning: function(string): void}} [options]
     * @returns {BaseShape}
     */
    fromJSON(data, options = {}) {
        let type = data.type;
        if (!byType.has(type)) {
            if (options.onWarning) options.onWarning(`Unknown shape type "${type}" (id ${data.id}) loaded as rectangle`);
            type = 'rectangle';
        }
        const shape = this.create(type, data.x, data.y, data.width, data.height, {
            text: data.text,
            imageData: data.imageData
        });
        const copy = JSON.parse(JSON.stringify(data));
        delete copy.type;
        delete copy.image;
        delete copy.loaded;
        if (copy.ports !== undefined) {
            if (typeof shape.setPorts === 'function') {
                try {
                    shape.setPorts(copy.ports);
                } catch (err) {
                    if (options.onWarning) options.onWarning(`Invalid ports on ${data.id}: ${err.message}`);
                }
            }
            delete copy.ports;
        }
        Object.assign(shape, copy);
        if (shape.groupId === undefined) shape.groupId = null;
        return shape;
    }
};
