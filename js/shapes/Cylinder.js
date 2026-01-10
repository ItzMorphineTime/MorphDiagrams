/**
 * @module shapes/Cylinder
 * @description Cylindrical (capsule) diagram shape. Extends BaseShape to provide cylindrical geometry and rendering.
 *
 * @remarks
 * - Renders as a capsule shape (rounded rectangle with semicircular ends).
 * - Automatically adapts to horizontal or vertical orientation based on aspect ratio.
 *
 * @example
 * const cylinder = new Cylinder(10, 20, 80, 100);
 * cylinder.draw(ctx);
 *
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

/**
 * Represents a cylindrical (capsule) diagram shape.
 *
 * @class
 * @extends BaseShape
 */
export class Cylinder extends BaseShape {
    /**
     * Creates a new Cylinder instance.
     *
     * @param {number} x X-coordinate of top-left corner of bounding box.
     * @param {number} y Y-coordinate of top-left corner of bounding box.
     * @param {number} width Width of bounding box.
     * @param {number} height Height of bounding box.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'cylinder';
        /** @type {number} Ellipse height at top (for 3D effect). */
        this.topHeight = Math.min(height * 0.15, 20);
    }

    /**
     * Draws the cylinder (capsule) shape on the canvas.
     *
     * Automatically renders as horizontal or vertical capsule based on aspect ratio.
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

        // Normalize coordinates to handle all drag directions
        const x = Math.min(this.x, this.x + this.width);
        const y = Math.min(this.y, this.y + this.height);
        const width = Math.abs(this.width);
        const height = Math.abs(this.height);

        // Draw capsule (rounded rectangle with semicircular ends)
        const radius = Math.min(width, height) / 2;

        ctx.beginPath();

        if (width > height) {
            // Horizontal capsule
            ctx.arc(x + radius, y + radius, radius, Math.PI / 2, Math.PI * 1.5);
            ctx.lineTo(x + width - radius, y);
            ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI / 2);
            ctx.lineTo(x + radius, y + height);
        } else {
            // Vertical capsule
            ctx.arc(x + radius, y + radius, radius, Math.PI, 0);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arc(x + radius, y + height - radius, radius, 0, Math.PI);
            ctx.lineTo(x, y + radius);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        ctx.restore();
    }

    /**
     * Serializes the cylinder to JSON, including topHeight.
     *
     * @returns {Object} JSON representation with all properties.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            topHeight: this.topHeight
        };
    }
}
