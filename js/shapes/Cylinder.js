/**
 * @module shapes/Cylinder
 * @description Diagram shape implementation for `Cylinder`.
 *
 * @see module:core/BaseShape
 * @see module:core/Connector
 *
 * @example
 * import { Cylinder } from './shapes/Cylinder.js';
 */

import { BaseShape } from '../core/BaseShape.js';
/**
 * `Cylinder` shape for MorphDiagrams.
 *
 * @class Cylinder
 * @extends BaseShape
 *
 * @example
 * const instance = new Cylinder(10, 20, 30, 40);
 */

export class Cylinder extends BaseShape {
    /**
     * Creates a new `Cylinder` instance.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'cylinder';
        this.topHeight = Math.min(height * 0.15, 20); // Ellipse height at top
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
     * Serializes the object to a JSON-compatible structure.
     * @returns {*} Result value.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            topHeight: this.topHeight
        };
    }
}
