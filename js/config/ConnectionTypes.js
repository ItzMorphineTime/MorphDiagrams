/**
 * @module config/ConnectionTypes
 * @description Connection-type registry (video, SDI, network, USB, ... plus user-defined types),
 * their colours, default system-object colours and port direction constants.
 *
 * The registry is the single source of truth for which typed connections exist. The legacy
 * `ConnectionColors` map is kept as a live view of the registry so older code (and the settings
 * panel) can keep reading `ConnectionColors[type]`.
 *
 * @example
 * import { ConnectionTypeRegistry } from './config/ConnectionTypes.js';
 * ConnectionTypeRegistry.register({ id: 'hdmi', label: 'HDMI', color: '#FF00AA' });
 * ConnectionTypeRegistry.colorFor('hdmi'); // '#FF00AA'
 */

import { paletteColorFor } from '../utils/Color.js';

/**
 * Built-in connection type identifiers.
 * @readonly
 * @enum {string}
 */
export const ConnectionTypes = {
    VIDEO: 'video',
    SDI: 'sdi',
    NETWORK: 'network',
    USB: 'usb'
};

/**
 * Port direction identifiers.
 * @readonly
 * @enum {string}
 */
export const PortTypes = {
    INPUT: 'input',
    OUTPUT: 'output',
    /** Accepts connections in either direction (used by connector anchors and bidirectional types). */
    BOTH: 'both'
};

/**
 * Default fill colours for the built-in system object types.
 * Mutated at runtime by the settings panel.
 * @type {Object<string, string>}
 */
export const ObjectColors = {
    SERVER: '#2C3E50',
    NETWORK_SWITCH: '#27AE60',
    VIDEO_MATRIX: '#E74C3C',
    LED_PROCESSOR: '#F39C12',
    SYNC_GENERATOR: '#8E44AD',
    DEVICE: '#455A64',
    MONITOR: '#1B6CA8',
    CAMERA: '#5D6D7E',
    POWER_SUPPLY: '#922B21',
    LED_DISTRO: '#B9770E',
    KVM: '#117A65'
};

/** Factory defaults for {@link ObjectColors}, used by "Reset to defaults". */
export const DEFAULT_OBJECT_COLORS = Object.freeze({ ...ObjectColors });

/**
 * Live map of connection type id -> colour. Kept in sync with the registry.
 * @type {Object<string, string>}
 */
export const ConnectionColors = {};

/**
 * @typedef {Object} ConnectionTypeDef
 * @property {string} id Machine identifier (lowercase, used in port keys such as `video_input_0`).
 * @property {string} label Human readable name.
 * @property {string} color Hex colour used for ports and connectors of this type.
 * @property {boolean} bidirectional When true, ports of this type may connect input-to-input or output-to-output
 *   (e.g. network links). When false, connections must run from an output to an input.
 * @property {string} [description] Free-form description shown to users and agents.
 * @property {("solid"|"dashed"|"dotted")} [lineStyle] Default line style for new connectors of this type.
 * @property {boolean} [builtin] True for the factory types.
 */

const BUILTIN_TYPES = [
    { id: 'video', label: 'Video', color: '#FFD700', bidirectional: false, description: 'Baseband/digital video feed (HDMI, DisplayPort, DVI, ...)' },
    { id: 'sdi', label: 'SDI', color: '#FF4500', bidirectional: false, description: 'Serial digital interface video / sync' },
    { id: 'network', label: 'Network', color: '#00CED1', bidirectional: true, description: 'Ethernet / IP link (bidirectional)' },
    { id: 'usb', label: 'USB', color: '#9370DB', bidirectional: false, description: 'USB peripheral link' },
    { id: 'fibre', label: 'Fibre', color: '#D81B60', bidirectional: true, description: 'Fibre optic network link (bidirectional)' },
    { id: 'power', label: 'Power', color: '#B71C1C', bidirectional: false, description: 'Mains / DC power feed (from a supply output to a device input)' },
    { id: 'wifi', label: 'Wi-Fi', color: '#43A047', bidirectional: true, lineStyle: 'dashed', description: 'Wireless network link (bidirectional, drawn dashed)' }
];

/** Factory colours of the built-in connection types, used by "Reset to defaults". */
export const DEFAULT_CONNECTION_COLORS = Object.freeze(Object.fromEntries(BUILTIN_TYPES.map(t => [t.id, t.color])));

const registry = new Map();

function normalizeId(id) {
    return String(id || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/**
 * Registry of connection types.
 * @namespace ConnectionTypeRegistry
 */
export const ConnectionTypeRegistry = {
    /**
     * Registers (or updates) a connection type.
     * @param {Object} def
     * @returns {ConnectionTypeDef} The stored definition.
     * @throws {Error} If the id is empty after normalisation.
     */
    register(def) {
        const id = normalizeId(def.id);
        if (!id) throw new Error('Connection type id must contain letters or digits');
        const existing = registry.get(id) || {};
        const lineStyle = def.lineStyle !== undefined ? def.lineStyle : existing.lineStyle;
        const entry = {
            id,
            label: def.label || existing.label || id.toUpperCase(),
            color: def.color || existing.color || paletteColorFor(id),
            bidirectional: def.bidirectional !== undefined ? !!def.bidirectional : !!existing.bidirectional,
            description: def.description !== undefined ? def.description : (existing.description || ''),
            lineStyle: ['solid', 'dashed', 'dotted'].includes(lineStyle) ? lineStyle : 'solid',
            builtin: existing.builtin || !!def.builtin
        };
        registry.set(id, entry);
        ConnectionColors[id] = entry.color;
        return entry;
    },

    /** @param {string} id @returns {ConnectionTypeDef|undefined} */
    get(id) {
        return registry.get(normalizeId(id));
    },

    /** @param {string} id @returns {boolean} */
    has(id) {
        return registry.has(normalizeId(id));
    },

    /** @returns {ConnectionTypeDef[]} All registered types in registration order. */
    list() {
        return [...registry.values()].map(e => ({ ...e }));
    },

    /** @returns {string[]} */
    ids() {
        return [...registry.keys()];
    },

    /**
     * Normalises an id the same way {@link ConnectionTypeRegistry.register} does.
     * @param {string} id
     * @returns {string}
     */
    normalizeId,

    /**
     * Colour for a connection type. Unknown types get a stable palette colour so they still render distinctly.
     * @param {string|null|undefined} id
     * @param {string} [fallback='#0066cc'] Colour for null/undefined (untyped) connections.
     * @returns {string}
     */
    colorFor(id, fallback = '#0066cc') {
        if (!id) return fallback;
        const entry = registry.get(normalizeId(id));
        return entry ? entry.color : paletteColorFor(normalizeId(id));
    },

    /**
     * Changes the colour of an existing type (also updates `ConnectionColors`).
     * @param {string} id
     * @param {string} color
     */
    setColor(id, color) {
        const entry = registry.get(normalizeId(id));
        if (entry) {
            entry.color = color;
            ConnectionColors[entry.id] = color;
        }
    },

    /**
     * Default line style for connectors of a type (`solid` unless the type says otherwise).
     * @param {string|null|undefined} id
     * @returns {("solid"|"dashed"|"dotted")}
     */
    lineStyleFor(id) {
        if (!id) return 'solid';
        const entry = registry.get(normalizeId(id));
        return entry && entry.lineStyle ? entry.lineStyle : 'solid';
    },

    /**
     * Whether ports of this type can connect regardless of input/output direction.
     * @param {string|null} id
     * @returns {boolean}
     */
    isBidirectional(id) {
        if (!id) return false;
        const entry = registry.get(normalizeId(id));
        return entry ? entry.bidirectional : false;
    },

    /**
     * Removes a user-defined type. Built-in types cannot be removed.
     * @param {string} id
     * @returns {boolean} True if removed.
     */
    unregister(id) {
        const key = normalizeId(id);
        const entry = registry.get(key);
        if (!entry || entry.builtin) return false;
        registry.delete(key);
        delete ConnectionColors[key];
        return true;
    },

    /**
     * Restores factory colours for built-in types and removes user-defined types.
     */
    reset() {
        for (const key of [...registry.keys()]) {
            if (!registry.get(key).builtin) {
                registry.delete(key);
                delete ConnectionColors[key];
            }
        }
        for (const t of BUILTIN_TYPES) this.register({ ...t, builtin: true });
    },

    /**
     * Serialisable snapshot of the registry (used in the diagram file's `connectionTypes` block).
     * @param {{customOnly: boolean}} [options]
     * @returns {Object<string, {label:string,color:string,bidirectional:boolean,description:string}>}
     */
    toJSON(options = {}) {
        const out = {};
        for (const entry of registry.values()) {
            if (options.customOnly && entry.builtin) continue;
            out[entry.id] = {
                label: entry.label,
                color: entry.color,
                bidirectional: entry.bidirectional,
                ...(entry.lineStyle && entry.lineStyle !== 'solid' ? { lineStyle: entry.lineStyle } : {}),
                ...(entry.description ? { description: entry.description } : {})
            };
        }
        return out;
    },

    /**
     * Registers every type found in a `connectionTypes` block from a diagram file.
     * @param {Object<string, Partial<ConnectionTypeDef>>|null|undefined} json
     */
    fromJSON(json) {
        if (!json || typeof json !== 'object') return;
        for (const [id, def] of Object.entries(json)) {
            this.register({ ...(def || {}), id });
        }
    }
};

ConnectionTypeRegistry.reset();
