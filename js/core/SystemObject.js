/**
 * @module core/SystemObject
 * @description Base class for hardware/system objects that expose typed input/output ports.
 *
 * A system object owns a `ports` map:
 *
 * ```js
 * ports = {
 *   video:   { input: 2, output: 2 },
 *   network: { input: 1, output: 0 }
 * }
 * ```
 *
 * Inputs are laid out along the left edge and outputs along the right edge (rotated with the shape).
 * Each port becomes an anchor whose key is `<type>_<direction>_<index>` (see {@link module:core/Ports}).
 *
 * Subclasses customise the body (`drawBody`), the icon (`drawIcon`) and, for non-rectangular shapes,
 * the edges ports are distributed on (`getPortEdges`).
 *
 * @example
 * const dev = new SystemObject(0, 0, 120, 80, { type: 'device', ports: { hdmi: { input: 1, output: 2 } } });
 * Object.keys(dev.getAnchorPoints()); // ['hdmi_input_0', 'hdmi_output_0', 'hdmi_output_1']
 *
 * @see module:core/Ports
 * @see module:shapes/Device
 */

import { BaseShape } from './BaseShape.js';
import { ObjectColors } from '../config/ConnectionTypes.js';
import { portKey, portLabel } from './Ports.js';

/**
 * @typedef {Object<string, {input: number, output: number}>} PortConfig
 */

export class SystemObject extends BaseShape {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     * @param {string} [options.type='device'] Type identifier.
     * @param {string} [options.fill] Fill colour.
     * @param {PortConfig} [options.ports] Initial port configuration.
     * @param {string} [options.labelPosition='bottom']
     */
    constructor(x, y, width, height, options = {}) {
        super(x, y, width, height);
        this.type = options.type || 'device';
        this.fill = options.fill || ObjectColors.DEVICE;
        /** @type {PortConfig} */
        this.ports = SystemObject.normalizePorts(options.ports || {});
        this.labelPosition = options.labelPosition || 'bottom';
    }

    /**
     * Validates and normalises a port configuration (integer counts >= 0, missing directions default to 0).
     * @param {PortConfig|Object} ports
     * @returns {PortConfig} A fresh, normalised copy.
     * @throws {TypeError} If the configuration is malformed.
     */
    static normalizePorts(ports) {
        if (ports === null || typeof ports !== 'object' || Array.isArray(ports)) {
            throw new TypeError('ports must be an object like { video: { input: 2, output: 2 } }');
        }
        const out = {};
        for (const [type, cfg] of Object.entries(ports)) {
            const key = String(type).trim().toLowerCase();
            if (!/^[a-z0-9_]+$/.test(key)) {
                throw new TypeError(`invalid port type "${type}" (use lowercase letters, digits, underscores)`);
            }
            const src = (cfg && typeof cfg === 'object') ? cfg : {};
            const toCount = (v, name) => {
                if (v === undefined || v === null || v === '') return 0;
                const n = Number(v);
                if (!Number.isInteger(n) || n < 0 || n > 256) {
                    throw new TypeError(`ports.${key}.${name} must be an integer between 0 and 256`);
                }
                return n;
            };
            out[key] = { input: toCount(src.input, 'input'), output: toCount(src.output, 'output') };
        }
        return out;
    }

    /**
     * Replaces the port configuration.
     * @param {PortConfig} ports
     */
    setPorts(ports) {
        this.ports = SystemObject.normalizePorts(ports);
    }

    /**
     * Ordered list of ports: all inputs (by type order) then all outputs.
     * @returns {Array<{type:string, direction:("input"|"output"), index:number, key:string}>}
     */
    getPortEntries() {
        const entries = [];
        const ports = this.ports || {};
        for (const direction of ['input', 'output']) {
            for (const type of Object.keys(ports)) {
                const count = Number(ports[type] && ports[type][direction]) || 0;
                for (let i = 0; i < count; i++) {
                    entries.push({ type, direction, index: i, key: portKey(type, direction, i) });
                }
            }
        }
        return entries;
    }

    /**
     * Edges that input/output ports are distributed along (unrotated coordinates).
     * Rectangular objects use the full left and right edges.
     * @returns {{input: {start:{x:number,y:number}, end:{x:number,y:number}, side:string}, output: {start:{x:number,y:number}, end:{x:number,y:number}, side:string}}}
     */
    getPortEdges() {
        const b = this.getBounds();
        return {
            input: { start: { x: b.x, y: b.y }, end: { x: b.x, y: b.y + b.height }, side: 'left' },
            output: { start: { x: b.x + b.width, y: b.y }, end: { x: b.x + b.width, y: b.y + b.height }, side: 'right' }
        };
    }

    /**
     * Anchor points for every configured port, evenly spaced along the port edges and rotated with the shape.
     * @returns {Object<string, AnchorPoint>}
     */
    getAnchorPoints() {
        const anchors = {};
        const edges = this.getPortEdges();
        const entries = this.getPortEntries();
        const normals = { left: { x: -1, y: 0 }, right: { x: 1, y: 0 }, top: { x: 0, y: -1 }, bottom: { x: 0, y: 1 } };
        for (const direction of ['input', 'output']) {
            const group = entries.filter(e => e.direction === direction);
            const edge = edges[direction];
            group.forEach((port, idx) => {
                const t = (idx + 1) / (group.length + 1);
                const raw = {
                    x: edge.start.x + (edge.end.x - edge.start.x) * t,
                    y: edge.start.y + (edge.end.y - edge.start.y) * t
                };
                const p = this.rotatePoint(raw.x, raw.y);
                anchors[port.key] = {
                    x: p.x,
                    y: p.y,
                    side: edge.side,
                    normal: this.rotateVector(normals[edge.side] || null),
                    connectionType: port.type,
                    portType: direction,
                    label: portLabel(port.key)
                };
            });
        }
        return anchors;
    }

    /**
     * Draws the object: body, icon and label, with rotation and shadow applied.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.visible) return;
        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        this.drawBody(ctx);
        this.clearShadow(ctx);
        this.drawIcon(ctx);
        this.drawLabel(ctx);
        ctx.restore();
    }

    /**
     * Draws the body outline. Default: a rectangle.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBody(ctx) {
        const b = this.getBounds();
        ctx.beginPath();
        ctx.rect(b.x, b.y, b.width, b.height);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Draws a type-specific icon. Default: nothing.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) { /* no icon by default */ }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            ...super.toJSON(),
            ports: JSON.parse(JSON.stringify(this.ports))
        };
    }
}

/**
 * System object rendered as a pointy-top hexagon. Inputs sit on the left vertical edge,
 * outputs on the right vertical edge.
 * @extends SystemObject
 */
export class HexSystemObject extends SystemObject {
    /**
     * The six vertices, starting at the top and going clockwise.
     * @returns {Array<{x:number, y:number}>}
     */
    getPoints() {
        const b = this.getBounds();
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        const rx = b.width / 2;
        const ry = b.height / 2;
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            points.push({ x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) });
        }
        return points;
    }

    /**
     * Left edge (vertices 5 -> 4) for inputs, right edge (vertices 1 -> 2) for outputs.
     * @returns {{input: Object, output: Object}}
     */
    getPortEdges() {
        const p = this.getPoints();
        return {
            input: { start: p[5], end: p[4], side: 'left' },
            output: { start: p[1], end: p[2], side: 'right' }
        };
    }

    /**
     * Point-in-polygon hit test (rotation aware).
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    containsPoint(x, y) {
        const p = this.toLocalPoint(x, y);
        const pts = this.getPoints();
        let inside = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const xi = pts[i].x, yi = pts[i].y, xj = pts[j].x, yj = pts[j].y;
            const intersect = ((yi > p.y) !== (yj > p.y)) && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    drawBody(ctx) {
        const points = this.getPoints();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
