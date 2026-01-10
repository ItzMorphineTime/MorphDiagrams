/**
 * @module shapes/Hexagon
 * @description Diagram shape implementation for `Hexagon`.
 *
 * @see module:core/BaseShape
 * @see module:core/Connector
 *
 * @example
 * import { Hexagon } from './shapes/Hexagon.js';
 */

import { BaseShape } from '../core/BaseShape.js';
/**
 * `Hexagon` shape for MorphDiagrams.
 *
 * @class Hexagon
 * @extends BaseShape
 *
 * @example
 * const instance = new Hexagon(10, 20, 30, 40);
 */

export class Hexagon extends BaseShape {
    /**
     * Creates a new `Hexagon` instance.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'hexagon';
    }

    /**
     * Returns the `Points` value.
     * @returns {*} Result value.
     */
    getPoints() {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const w = this.width / 2;
        const h = this.height / 2;

        return [
            { x: cx, y: this.y },
            { x: this.x + this.width, y: cy - h / 2 },
            { x: this.x + this.width, y: cy + h / 2 },
            { x: cx, y: this.y + this.height },
            { x: this.x, y: cy + h / 2 },
            { x: this.x, y: cy - h / 2 }
        ];
    }

    /**
     * Checks whether a point lies within the object's bounds.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @returns {*} Result value.
     */
    containsPoint(x, y) {
        // Simple bounding box check for now
        return super.containsPoint(x, y);
    }

    /**
     * Draws the object using the provided canvas context.
     * @param {number} ctx ctx value.
     */
    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);

        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;

        const points = this.getPoints();

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        ctx.restore();
    }
}
