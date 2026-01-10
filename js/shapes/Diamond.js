/**
 * @module shapes/Diamond
 * @description Diamond (rhombus) diagram shape. Extends BaseShape to provide diamond geometry and rendering.
 *
 * @remarks
 * - Uses cross-product test for accurate point-in-diamond detection.
 * - Rotation is supported via BaseShape rotation.
 *
 * @example
 * const diamond = new Diamond(10, 20, 100, 80);
 * diamond.draw(ctx);
 *
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

/**
 * Represents a diamond (rhombus) diagram shape.
 *
 * @class
 * @extends BaseShape
 */
export class Diamond extends BaseShape {
    /**
     * Creates a new Diamond instance.
     *
     * @param {number} x X-coordinate of top-left corner of bounding box.
     * @param {number} y Y-coordinate of top-left corner of bounding box.
     * @param {number} width Width of bounding box.
     * @param {number} height Height of bounding box.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'diamond';
    }

    /**
     * Checks if a point is inside the diamond using cross-product test.
     *
     * @param {number} x X-coordinate of the point to test.
     * @param {number} y Y-coordinate of the point to test.
     * @returns {boolean} True if point is inside the diamond.
     */
    containsPoint(x, y) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Point-in-diamond test using cross product
        const dx = Math.abs(x - cx) / (this.width / 2);
        const dy = Math.abs(y - cy) / (this.height / 2);

        return dx + dy <= 1;
    }

    /**
     * Draws the diamond shape on the canvas.
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
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        ctx.restore();
    }
}
