/**
 * @module shapes/Parallelogram
 * @description Diagram shape implementation for `Parallelogram`.
 *
 * @see module:core/BaseShape
 * @see module:core/Connector
 *
 * @example
 * import { Parallelogram } from './shapes/Parallelogram.js';
 */

import { BaseShape } from '../core/BaseShape.js';
/**
 * `Parallelogram` shape for MorphDiagrams.
 *
 * @class Parallelogram
 * @extends BaseShape
 *
 * @example
 * const instance = new Parallelogram(10, 20, 30, 40);
 */

export class Parallelogram extends BaseShape {
    /**
     * Creates a new `Parallelogram` instance.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'parallelogram';
        this.skew = 0.2; // Skew factor (0-1)
    }

    /**
     * Returns the `Points` value.
     * @returns {*} Result value.
     */
    getPoints() {
        const skewOffset = Math.abs(this.width) * this.skew;
        const w = this.width;
        const h = this.height;

        // Handle negative widths/heights during drawing
        if (w >= 0 && h >= 0) {
            return [
                { x: this.x + skewOffset, y: this.y },
                { x: this.x + w, y: this.y },
                { x: this.x + w - skewOffset, y: this.y + h },
                { x: this.x, y: this.y + h }
            ];
        } else if (w < 0 && h >= 0) {
            return [
                { x: this.x, y: this.y },
                { x: this.x + w + skewOffset, y: this.y },
                { x: this.x + w, y: this.y + h },
                { x: this.x - skewOffset, y: this.y + h }
            ];
        } else if (w >= 0 && h < 0) {
            return [
                { x: this.x, y: this.y },
                { x: this.x + skewOffset, y: this.y + h },
                { x: this.x + w - skewOffset, y: this.y + h },
                { x: this.x + w, y: this.y }
            ];
        } else {
            return [
                { x: this.x - skewOffset, y: this.y },
                { x: this.x, y: this.y },
                { x: this.x + w + skewOffset, y: this.y + h },
                { x: this.x + w, y: this.y + h }
            ];
        }
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

    /**
     * Serializes the object to a JSON-compatible structure.
     * @returns {*} Result value.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            skew: this.skew
        };
    }
}
