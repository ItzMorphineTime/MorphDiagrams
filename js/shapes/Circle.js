/**
 * @module shapes/Circle
 * @description Diagram shape implementation for `Circle`.
 *
 * @see module:core/BaseShape
 * @see module:core/Connector
 *
 * @example
 * import { Circle } from './shapes/Circle.js';
 */

import { BaseShape } from '../core/BaseShape.js';
/**
 * `Circle` shape for MorphDiagrams.
 *
 * @class Circle
 * @extends BaseShape
 *
 * @example
 * const instance = new Circle(10, 20, 30, 40);
 */

export class Circle extends BaseShape {
    /**
     * Creates a new `Circle` instance.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'circle';
    }

    /**
     * Checks whether a point lies within the object's bounds.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @returns {*} Result value.
     */
    containsPoint(x, y) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const rx = Math.abs(this.width / 2);
        const ry = Math.abs(this.height / 2);

        if (rx === 0 || ry === 0) return false;

        return ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2) <= 1;
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

        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.abs(this.width / 2),
            Math.abs(this.height / 2),
            0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        ctx.restore();
    }
}
