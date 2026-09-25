/**
 * @module core/Ports
 * @description Port key helpers and the rules that decide whether two anchors may be connected.
 *
 * Port keys have the shape `<type>_<direction>_<index>`, e.g. `video_input_0` or `sdi_output_3`.
 * Basic shapes expose the generic anchors `top`, `right`, `bottom`, `left` and `center`;
 * connector anchors expose a single `anchor_point`.
 *
 * @see module:core/SystemObject
 * @see module:core/Connector
 */

import { ConnectionTypeRegistry, PortTypes } from '../config/ConnectionTypes.js';

/**
 * Builds a port key.
 * @param {string} type Connection type id.
 * @param {("input"|"output")} direction
 * @param {number} index Zero-based index within the type/direction.
 * @returns {string}
 */
export function portKey(type, direction, index) {
    return `${type}_${direction}_${index}`;
}

/**
 * Parses a port key.
 * @param {string} key
 * @returns {{type:string, direction:("input"|"output"), index:number}|null} Null when the key is not a typed port key.
 */
export function parsePortKey(key) {
    const m = /^(.+)_(input|output)_(\d+)$/.exec(String(key || ''));
    if (!m) return null;
    return { type: m[1], direction: m[2], index: parseInt(m[3], 10) };
}

/**
 * Human readable name for a port key, e.g. `Video In 1`.
 * @param {string} key
 * @returns {string}
 */
export function portLabel(key) {
    const parsed = parsePortKey(key);
    if (!parsed) return key;
    const def = ConnectionTypeRegistry.get(parsed.type);
    const typeLabel = def ? def.label : parsed.type.toUpperCase();
    return `${typeLabel} ${parsed.direction === 'input' ? 'In' : 'Out'} ${parsed.index + 1}`;
}

/**
 * Given the anchor a connection starts from, returns the port direction the other end must have,
 * or `null` when any direction is acceptable (untyped anchors, bidirectional types).
 * @param {{connectionType: string|null, portType: string|null}} startAnchor
 * @returns {("input"|"output"|null)}
 */
export function expectedCounterpartPortType(startAnchor) {
    if (!startAnchor) return null;
    const type = startAnchor.connectionType || null;
    if (ConnectionTypeRegistry.isBidirectional(type)) return null;
    if (startAnchor.portType === PortTypes.OUTPUT) return PortTypes.INPUT;
    if (startAnchor.portType === PortTypes.INPUT) return PortTypes.OUTPUT;
    return null;
}

/**
 * Checks whether two anchors are allowed to be connected.
 *
 * Rules:
 * - Untyped anchors (`connectionType` null) are wildcards and accept any type.
 * - Typed anchors must have the same connection type.
 * - Unless the type is bidirectional, one side must be an output and the other an input
 *   (`both` matches anything).
 *
 * @param {{connectionType: string|null, portType: string|null}} a
 * @param {{connectionType: string|null, portType: string|null}} b
 * @returns {{ok: boolean, reason: string, connectionType: string|null}} The resolved connection type is the
 *   typed side's type (or null when both are untyped).
 */
export function anchorsCompatible(a, b) {
    const ta = a && a.connectionType ? a.connectionType : null;
    const tb = b && b.connectionType ? b.connectionType : null;
    if (ta && tb && ta !== tb) {
        return { ok: false, reason: `connection types differ (${ta} vs ${tb})`, connectionType: null };
    }
    const type = ta || tb || null;
    const pa = a && a.portType ? a.portType : PortTypes.BOTH;
    const pb = b && b.portType ? b.portType : PortTypes.BOTH;
    if (!ConnectionTypeRegistry.isBidirectional(type) && pa !== PortTypes.BOTH && pb !== PortTypes.BOTH && pa === pb) {
        return { ok: false, reason: `both ports are ${pa}s; ${type || 'typed'} links must run from an output to an input`, connectionType: type };
    }
    return { ok: true, connectionType: type };
}

/**
 * Unit normal vector pointing away from a shape for a given anchor side.
 * @param {string|undefined} side One of `top`, `right`, `bottom`, `left`.
 * @returns {{x:number, y:number}|null}
 */
export function sideNormal(side) {
    switch (side) {
        case 'top': return { x: 0, y: -1 };
        case 'right': return { x: 1, y: 0 };
        case 'bottom': return { x: 0, y: 1 };
        case 'left': return { x: -1, y: 0 };
        default: return null;
    }
}
