/**
 * @module shapes/Circle
 * @description Circular/elliptical diagram shape. Extends BaseShape to provide elliptical geometry and rendering.
 *
 * @remarks
 * - Circles are rendered as ellipses, allowing non-square dimensions.
 * - Point-in-shape detection uses ellipse equation for accurate hit testing.
 *
 * @example
 * const circle = new Circle(10, 20, 100, 100); // Perfect circle
 * const ellipse = new Circle(10, 20, 120, 80); // Ellipse
 * circle.draw(ctx);
 *
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

/**
 * Represents a circular or elliptical diagram shape.
 *
 * @class
 * @extends BaseShape
 */
export class Circle extends BaseShape {
    /**
     * Creates a new Circle instance.
     *
     * @param {number} x X-coordinate of top-left corner of bounding box.
     * @param {number} y Y-coordinate of top-left corner of bounding box.
     * @param {number} width Width of bounding box (horizontal radius * 2).
     * @param {number} height Height of bounding box (vertical radius * 2).
     *
     * @example
     * const circle = new Circle(10, 20, 100, 100);
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'circle';
    }

    /**
     * Checks if a point is inside the ellipse using the ellipse equation.
     *
     * @param {number} x X-coordinate of the point to test.
     * @param {number} y Y-coordinate of the point to test.
     * @returns {boolean} True if point is inside the ellipse.
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
     * Draws the circle/ellipse on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
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
