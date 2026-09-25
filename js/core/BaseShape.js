/**
 * @module core/BaseShape
 * @description Base class for all drawable shapes. Provides geometry (bounds, rotation, hit testing),
 * generic anchor points, label rendering and JSON serialisation. Every concrete shape
 * (Rectangle, Server, Device, ...) extends this class.
 *
 * @remarks
 * - Coordinates are canvas ("world") coordinates; `x`/`y` is the unrotated top-left corner.
 * - `rotation` is in radians and is applied around the shape centre.
 * - Shapes never touch the DOM, so this module also runs headless in Node (MCP server, tests).
 *
 * @example
 * const rect = new Rectangle(10, 10, 120, 60);
 * rect.label = 'Ingest';
 * rect.containsPoint(20, 20); // true
 *
 * @see module:core/Connector
 * @see module:core/SystemObject
 */

import { contrastColor } from '../utils/Color.js';
import { sideNormal } from './Ports.js';

/**
 * @typedef {Object} AnchorPoint
 * @property {number} x
 * @property {number} y
 * @property {string} [side] `top` | `right` | `bottom` | `left` (absent for centre / free anchors).
 * @property {{x:number,y:number}|null} [normal] Unit vector pointing away from the shape (rotated).
 * @property {string|null} [connectionType] Connection type for typed ports, null for wildcard anchors.
 * @property {("input"|"output"|"both")} [portType]
 * @property {string} [label] Human readable port name.
 */

export class BaseShape {
    /**
     * @param {number} x Top-left x.
     * @param {number} y Top-left y.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     */
    constructor(x, y, width, height) {
        /** @type {string} Unique identifier */
        this.id = this.generateId();
        /** @type {string} Type identifier (overridden by subclasses) */
        this.type = 'base';
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
        /** @type {number} */
        this.width = width;
        /** @type {number} */
        this.height = height;
        /** @type {string} Fill colour */
        this.fill = '#3498db';
        /** @type {string} Stroke colour */
        this.stroke = '#2c3e50';
        /** @type {number} Stroke width in pixels */
        this.strokeWidth = 2;
        /** @type {number} Rotation in radians */
        this.rotation = 0;
        /** @type {boolean} */
        this.shadow = false;
        /** @type {number} */
        this.shadowBlur = 10;
        /** @type {string} */
        this.shadowColor = 'rgba(0, 0, 0, 0.3)';
        /** @type {number} */
        this.shadowOffsetX = 3;
        /** @type {number} */
        this.shadowOffsetY = 3;
        /** @type {number} Render order (higher on top) */
        this.zIndex = 0;
        /** @type {boolean} Locked shapes cannot be moved or resized */
        this.locked = false;
        /** @type {boolean} */
        this.visible = true;
        /** @type {(number|string|null)} Group identifier shared by grouped shapes */
        this.groupId = null;
        /** @type {string} Display label (device name, node title, ...). Empty string = no label. */
        this.label = '';
        /** @type {("inside"|"bottom"|"below"|"above")} Where the label is drawn relative to the shape. */
        this.labelPosition = 'inside';
        /** @type {number} Label font size in pixels */
        this.labelFontSize = 12;
        /** @type {string} Free-form notes (IP address, model number, ...). Not rendered. */
        this.description = '';
    }

    /**
     * Generates a unique identifier.
     * @returns {string}
     */
    generateId() {
        return 'shape_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
    }

    /**
     * Axis-aligned bounds of the unrotated shape. Negative sizes (while dragging) are normalised.
     * @returns {{x:number, y:number, width:number, height:number}}
     */
    getBounds() {
        return {
            x: Math.min(this.x, this.x + this.width),
            y: Math.min(this.y, this.y + this.height),
            width: Math.abs(this.width),
            height: Math.abs(this.height)
        };
    }

    /**
     * Centre point of the shape.
     * @returns {{x:number, y:number}}
     */
    getCenter() {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }

    /**
     * Converts a world point into the shape's unrotated local frame (inverse rotation about the centre).
     * @param {number} x
     * @param {number} y
     * @returns {{x:number, y:number}}
     */
    toLocalPoint(x, y) {
        if (!this.rotation) return { x, y };
        const c = this.getCenter();
        const cos = Math.cos(-this.rotation);
        const sin = Math.sin(-this.rotation);
        const tx = x - c.x;
        const ty = y - c.y;
        return { x: tx * cos - ty * sin + c.x, y: tx * sin + ty * cos + c.y };
    }

    /**
     * Hit test against the (rotation-aware) bounding box. Subclasses refine this for their geometry.
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    containsPoint(x, y) {
        const p = this.toLocalPoint(x, y);
        const b = this.getBounds();
        return p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height;
    }

    /**
     * Rotates a point around the shape's centre by the shape's rotation.
     * @param {number} x
     * @param {number} y
     * @returns {{x:number, y:number}}
     */
    rotatePoint(x, y) {
        if (!this.rotation) return { x, y };
        const c = this.getCenter();
        const tx = x - c.x;
        const ty = y - c.y;
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        return { x: tx * cos - ty * sin + c.x, y: tx * sin + ty * cos + c.y };
    }

    /**
     * Rotates a direction vector by the shape's rotation.
     * @param {{x:number,y:number}|null} v
     * @returns {{x:number,y:number}|null}
     */
    rotateVector(v) {
        if (!v) return null;
        if (!this.rotation) return { x: v.x, y: v.y };
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        return { x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos };
    }

    /**
     * The four corners of the bounding box after rotation.
     * @returns {Array<{x:number, y:number}>}
     */
    getRotatedBounds() {
        const b = this.getBounds();
        const corners = [
            { x: b.x, y: b.y },
            { x: b.x + b.width, y: b.y },
            { x: b.x + b.width, y: b.y + b.height },
            { x: b.x, y: b.y + b.height }
        ];
        return this.rotation ? corners.map(c => this.rotatePoint(c.x, c.y)) : corners;
    }

    /**
     * Generic anchor points (`top`, `right`, `bottom`, `left`, `center`) for connectors.
     * Subclasses with ports override this.
     * @returns {Object<string, AnchorPoint>}
     */
    getAnchorPoints() {
        const b = this.getBounds();
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        const raw = {
            top: { x: cx, y: b.y, side: 'top' },
            right: { x: b.x + b.width, y: cy, side: 'right' },
            bottom: { x: cx, y: b.y + b.height, side: 'bottom' },
            left: { x: b.x, y: cy, side: 'left' },
            center: { x: cx, y: cy }
        };
        const anchors = {};
        for (const [key, a] of Object.entries(raw)) {
            const p = this.rotatePoint(a.x, a.y);
            anchors[key] = {
                x: p.x,
                y: p.y,
                side: a.side,
                normal: this.rotateVector(sideNormal(a.side)),
                connectionType: null,
                portType: 'both'
            };
        }
        return anchors;
    }

    /**
     * Moves the shape unless it is locked.
     * @param {number} dx
     * @param {number} dy
     */
    move(dx, dy) {
        if (!this.locked) {
            this.x += dx;
            this.y += dy;
        }
    }

    /**
     * Resizes the shape unless it is locked.
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        if (!this.locked) {
            this.width = width;
            this.height = height;
        }
    }

    /**
     * Applies the shape's rotation to a canvas context (rotates about the centre).
     * @param {CanvasRenderingContext2D} ctx
     */
    applyRotation(ctx) {
        if (this.rotation) {
            const c = this.getCenter();
            ctx.translate(c.x, c.y);
            ctx.rotate(this.rotation);
            ctx.translate(-c.x, -c.y);
        }
    }

    /**
     * Enables the drop shadow on a canvas context when `shadow` is set.
     * @param {CanvasRenderingContext2D} ctx
     */
    applyShadow(ctx) {
        if (this.shadow) {
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowColor = this.shadowColor;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }
    }

    /**
     * Disables the drop shadow.
     * @param {CanvasRenderingContext2D} ctx
     */
    clearShadow(ctx) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the shape. Must be implemented by subclasses.
     * @abstract
     * @param {CanvasRenderingContext2D} ctx
     * @throws {Error} Always, unless overridden.
     */
    draw(ctx) {
        throw new Error('draw() must be implemented by subclass');
    }

    /**
     * Computes where and how the label should be drawn. Shared by the canvas renderer and the SVG exporter.
     * @param {function(string, string): number} [measure] Text measurer `(text, cssFont) => width`; when omitted an
     *   approximation is used.
     * @returns {{lines:string[], x:number, y:number, fontSize:number, lineHeight:number, color:string, position:string}|null}
     *   `y` is the vertical centre of the text block. Null when there is no label.
     */
    getLabelLayout(measure) {
        const text = (this.label || '').trim();
        if (!text) return null;
        const lines = text.split('\n');
        const b = this.getBounds();
        const position = this.labelPosition || 'inside';
        let fontSize = this.labelFontSize || 12;
        const measureFn = measure || ((t, font) => {
            const size = parseFloat(font) || fontSize;
            return t.length * size * 0.58;
        });
        const insideLike = position === 'inside' || position === 'bottom';
        if (insideLike) {
            const maxWidth = Math.max(16, b.width - 8);
            const widest = Math.max(...lines.map(l => measureFn(l, `${fontSize}px Arial`)));
            if (widest > maxWidth) {
                fontSize = Math.max(8, Math.floor(fontSize * maxWidth / widest));
            }
        }
        const lineHeight = fontSize * 1.2;
        const blockHeight = lineHeight * lines.length;
        const cx = b.x + b.width / 2;
        let y;
        switch (position) {
            case 'bottom':
                y = b.y + b.height - blockHeight / 2 - 4;
                break;
            case 'below':
                y = b.y + b.height + 4 + blockHeight / 2;
                break;
            case 'above':
                y = b.y - 4 - blockHeight / 2;
                break;
            default:
                y = b.y + b.height / 2;
        }
        const color = insideLike ? contrastColor(this.fill) : '#2c3e50';
        return { lines, x: cx, y, fontSize, lineHeight, color, position };
    }

    /**
     * Draws the label (if any). Call inside the rotated context, after the body has been drawn.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawLabel(ctx) {
        const layout = this.getLabelLayout((t, font) => {
            ctx.font = font;
            return ctx.measureText(t).width;
        });
        if (!layout) return;
        ctx.save();
        this.clearShadow(ctx);
        ctx.font = `${layout.fontSize}px Arial`;
        ctx.fillStyle = layout.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const n = layout.lines.length;
        layout.lines.forEach((line, i) => {
            ctx.fillText(line, layout.x, layout.y + (i - (n - 1) / 2) * layout.lineHeight);
        });
        ctx.restore();
    }

    /**
     * Deep copy with a fresh id.
     * @returns {BaseShape}
     */
    clone() {
        const cloned = Object.create(Object.getPrototypeOf(this));
        Object.assign(cloned, JSON.parse(JSON.stringify(this.toJSON())));
        cloned.id = this.generateId();
        return cloned;
    }

    /**
     * Serialises the shape.
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fill: this.fill,
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            rotation: this.rotation,
            shadow: this.shadow,
            shadowBlur: this.shadowBlur,
            shadowColor: this.shadowColor,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            zIndex: this.zIndex,
            locked: this.locked,
            visible: this.visible,
            groupId: this.groupId,
            label: this.label,
            labelPosition: this.labelPosition,
            labelFontSize: this.labelFontSize,
            description: this.description
        };
    }

    /**
     * Restores a shape of this class from JSON.
     * @param {Object} data
     * @returns {BaseShape}
     */
    static fromJSON(data) {
        const shape = new this(data.x, data.y, data.width, data.height);
        Object.assign(shape, data);
        return shape;
    }
}
