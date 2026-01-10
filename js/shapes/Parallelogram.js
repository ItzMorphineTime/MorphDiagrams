/**
 * @module shapes/Parallelogram
 * @description Parallelogram diagram shape with configurable skew. Extends BaseShape to provide parallelogram geometry and rendering.
 *
 * @remarks
 * - Supports configurable skew factor for different parallelogram angles.
 * - Handles negative dimensions during drag operations.
 *
 * @example
 * const para = new Parallelogram(10, 20, 120, 60);
 * para.skew = 0.3; // Increase skew angle
 * para.draw(ctx);
 *
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

/**
 * Represents a parallelogram diagram shape.
 *
 * @class
 * @extends BaseShape
 */
export class Parallelogram extends BaseShape {
    /**
     * Creates a new Parallelogram instance.
     *
     * @param {number} x X-coordinate of top-left corner of bounding box.
     * @param {number} y Y-coordinate of top-left corner of bounding box.
     * @param {number} width Width of bounding box.
     * @param {number} height Height of bounding box.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'parallelogram';
        /** @type {number} Skew factor (0-1) controlling the horizontal offset of top/bottom edges. */
        this.skew = 0.2;
    }

    /**
     * Gets the four vertex points of the parallelogram.
     *
     * Handles negative widths/heights during drag operations.
     *
     * @returns {Array<{x:number, y:number}>} Array of four vertex coordinates.
     * @private
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
     * Draws the parallelogram shape on the canvas.
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

    toJSON() {
        return {
            ...super.toJSON(),
            skew: this.skew
        };
    }
}
