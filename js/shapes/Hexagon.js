/**
 * @module shapes/Hexagon
 * @description Hexagonal diagram shape. Extends BaseShape to provide hexagon geometry and rendering.
 *
 * @remarks
 * - Hexagon has 6 vertices arranged in a regular polygon.
 * - Point detection currently uses bounding box (can be enhanced for true hexagon hit testing).
 *
 * @example
 * const hexagon = new Hexagon(10, 20, 100, 100);
 * hexagon.draw(ctx);
 *
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

/**
 * Represents a hexagonal diagram shape.
 *
 * @class
 * @extends BaseShape
 */
export class Hexagon extends BaseShape {
    /**
     * Creates a new Hexagon instance.
     *
     * @param {number} x X-coordinate of top-left corner of bounding box.
     * @param {number} y Y-coordinate of top-left corner of bounding box.
     * @param {number} width Width of bounding box.
     * @param {number} height Height of bounding box.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'hexagon';
    }

    /**
     * Gets the six vertex points of the hexagon.
     *
     * @returns {Array<{x:number, y:number}>} Array of six vertex coordinates.
     *
     * @example
     * const points = hexagon.getPoints();
     * // Returns 6 points starting from top, going clockwise
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
     * Checks if a point is inside the hexagon.
     *
     * Currently uses bounding box check. Can be enhanced for true hexagon hit testing.
     *
     * @param {number} x X-coordinate of the point to test.
     * @param {number} y Y-coordinate of the point to test.
     * @returns {boolean} True if point is inside the hexagon bounding box.
     */
    containsPoint(x, y) {
        // Simple bounding box check for now
        return super.containsPoint(x, y);
    }

    /**
     * Draws the hexagon shape on the canvas.
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
}
