/**
 * @module core/Serialization
 * @description Converts between live shape/connector instances and the JSON diagram file format,
 * independent of the DOM so the editor, the tests and the MCP server all share one implementation.
 *
 * File format (version 2.1):
 *
 * ```json
 * {
 *   "version": "2.1",
 *   "objects": [ { "id": "...", "type": "server", ... }, { "id": "...", "type": "connector", ... } ],
 *   "connectionTypes": { "hdmi": { "label": "HDMI", "color": "#ff00aa", "bidirectional": false } },
 *   "metadata": { "name": "Stage A", "created": "...", "modified": "...", "zoom": 1, "panX": 0, "panY": 0, "nextGroupId": 1 }
 * }
 * ```
 *
 * Older files (versions 1.0 and 2.0) load unchanged.
 *
 * @see module:core/ShapeRegistry
 * @see module:core/Diagram
 */

import { ShapeRegistry } from './ShapeRegistry.js';
import { Connector } from './Connector.js';
import { ConnectionTypeRegistry } from '../config/ConnectionTypes.js';

/** Current file format version. */
export const FORMAT_VERSION = '2.1';

/**
 * Serialises objects (shapes and connectors) to plain JSON.
 * @param {Array} objects
 * @returns {Array<Object>}
 */
export function serializeObjects(objects) {
    return objects.map(obj => (typeof obj.toJSON === 'function' ? obj.toJSON() : { ...obj }));
}

/**
 * Restores objects from their JSON form. Shapes are created first, then connectors are re-linked by id.
 * Connectors whose endpoints are missing are dropped with a warning.
 * @param {Array<Object>|string} data Array of serialised objects (or its JSON string).
 * @param {{onWarning: function(string): void}} [options]
 * @returns {Array} Live instances (shapes first, connectors after).
 */
export function deserializeObjects(data, options = {}) {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const warn = options.onWarning || (() => {});
    const items = Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object') : [];
    const byId = new Map();

    // First pass: shapes (so connectors can be re-linked whatever the file order is).
    const shapes = new Map();
    for (const item of items) {
        if (item.type === 'connector') continue;
        const shape = ShapeRegistry.fromJSON(item, { onWarning: warn });
        shapes.set(item, shape);
        byId.set(shape.id, shape);
    }

    // Second pass: rebuild in the original order to keep z-order and stable files.
    const objects = [];
    for (const item of items) {
        if (item.type !== 'connector') {
            objects.push(shapes.get(item));
            continue;
        }
        const startObj = byId.get(item.startObject);
        const endObj = byId.get(item.endObject);
        if (!startObj || !endObj) {
            warn(`Connector ${item.id || '(no id)'} dropped: missing ${!startObj ? 'start' : 'end'} object`);
            continue;
        }
        const conn = new Connector(startObj, item.startAnchor, endObj, item.endAnchor, item.connectionType || null);
        const copy = { ...item };
        delete copy.startObject;
        delete copy.endObject;
        delete copy.type;
        delete copy.selected;
        Object.assign(conn, copy);
        conn.waypoints = Array.isArray(conn.waypoints) ? conn.waypoints.map(w => ({ x: Number(w.x), y: Number(w.y) })) : [];
        objects.push(conn);
    }

    return objects;
}

/**
 * Builds a complete diagram document.
 * @param {Object} parts
 * @param {Array} parts.objects Live objects.
 * @param {Object} [parts.metadata] Extra metadata (zoom, pan, name, ...).
 * @param {Object} [parts.connectionTypes] Connection types to embed; defaults to the custom (non built-in)
 *   types in the registry.
 * @returns {Object} Plain document ready for `JSON.stringify`.
 */
export function createDocument({ objects, metadata = {}, connectionTypes } = {}) {
    const now = new Date().toISOString();
    const types = connectionTypes !== undefined ? connectionTypes : ConnectionTypeRegistry.toJSON({ customOnly: true });
    const doc = {
        version: FORMAT_VERSION,
        objects: serializeObjects(objects || []),
        metadata: {
            ...metadata,
            created: metadata.created || now,
            modified: now
        }
    };
    if (types && Object.keys(types).length > 0) doc.connectionTypes = types;
    return doc;
}

/**
 * Structural validation of a document (no instantiation). Semantic checks (port existence, type
 * compatibility) live in {@link module:core/Diagram~Diagram#validate}.
 * @param {Object|string} doc
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
export function validateDocument(doc) {
    const errors = [];
    const warnings = [];
    let data = doc;
    if (typeof doc === 'string') {
        try {
            data = JSON.parse(doc);
        } catch (err) {
            return { valid: false, errors: [`Invalid JSON: ${err.message}`], warnings };
        }
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { valid: false, errors: ['Document must be a JSON object'], warnings };
    }
    if (data.version !== undefined && !['1.0', '2.0', FORMAT_VERSION].includes(String(data.version))) {
        warnings.push(`Unknown format version "${data.version}" (expected ${FORMAT_VERSION})`);
    }
    if (!Array.isArray(data.objects)) {
        errors.push('"objects" must be an array');
        return { valid: false, errors, warnings };
    }
    const ids = new Set();
    const shapeIds = new Set();
    data.objects.forEach((obj, i) => {
        const where = `objects[${i}]`;
        if (!obj || typeof obj !== 'object') { errors.push(`${where}: not an object`); return; }
        if (typeof obj.type !== 'string') { errors.push(`${where}: missing "type"`); return; }
        if (typeof obj.id !== 'string' || !obj.id) { errors.push(`${where}: missing "id"`); return; }
        if (ids.has(obj.id)) errors.push(`${where}: duplicate id "${obj.id}"`);
        ids.add(obj.id);
        if (obj.type === 'connector') return;
        shapeIds.add(obj.id);
        if (!ShapeRegistry.has(obj.type)) warnings.push(`${where}: unknown shape type "${obj.type}"`);
        for (const key of ['x', 'y', 'width', 'height']) {
            if (typeof obj[key] !== 'number' || !Number.isFinite(obj[key])) {
                errors.push(`${where} (${obj.id}): "${key}" must be a finite number`);
            }
        }
        if (obj.ports !== undefined && (obj.ports === null || typeof obj.ports !== 'object' || Array.isArray(obj.ports))) {
            errors.push(`${where} (${obj.id}): "ports" must be an object`);
        }
    });
    data.objects.forEach((obj, i) => {
        if (!obj || obj.type !== 'connector' || typeof obj.id !== 'string') return;
        const where = `objects[${i}] (${obj.id})`;
        if (!shapeIds.has(obj.startObject)) errors.push(`${where}: startObject "${obj.startObject}" does not exist`);
        if (!shapeIds.has(obj.endObject)) errors.push(`${where}: endObject "${obj.endObject}" does not exist`);
        if (obj.style !== undefined && !['straight', 'orthogonal', 'bezier', 'polyline'].includes(obj.style)) {
            errors.push(`${where}: invalid style "${obj.style}"`);
        }
        if (obj.lineStyle !== undefined && !['solid', 'dashed', 'dotted'].includes(obj.lineStyle)) {
            errors.push(`${where}: invalid lineStyle "${obj.lineStyle}"`);
        }
    });
    if (data.connectionTypes !== undefined && (data.connectionTypes === null || typeof data.connectionTypes !== 'object')) {
        errors.push('"connectionTypes" must be an object');
    }
    return { valid: errors.length === 0, errors, warnings };
}

/**
 * Parses a document: registers embedded connection types and restores live objects.
 * @param {Object|string} doc
 * @returns {{objects: Array, metadata: Object, connectionTypes: Object, warnings: string[]}}
 * @throws {Error} If the document is structurally invalid.
 */
export function parseDocument(doc) {
    const data = typeof doc === 'string' ? JSON.parse(doc) : doc;
    const check = validateDocument(data);
    if (!check.valid) throw new Error('Invalid diagram file: ' + check.errors.join('; '));
    const warnings = [...check.warnings];
    if (data.connectionTypes) ConnectionTypeRegistry.fromJSON(data.connectionTypes);
    const objects = deserializeObjects(data.objects, { onWarning: w => warnings.push(w) });
    return {
        objects,
        metadata: { ...(data.metadata || {}) },
        connectionTypes: data.connectionTypes || {},
        warnings
    };
}
