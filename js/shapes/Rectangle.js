/**
 * @module shapes/Rectangle
 * @description Rectangular diagram shape with optional rounded corners. Extends BaseShape to provide rectangular geometry and rendering.
 *
 * @remarks
 * - Supports corner radius for rounded rectangles.
 * - All rectangular properties (x, y, width, height) are inherited from BaseShape.
 *
 * @example
 * const rect = new Rectangle(10, 20, 120, 60);
 * rect.cornerRadius = 5;
 * rect.draw(ctx);
 *
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

/**
 * Represents a rectangular diagram shape.
 *
 * @class
 * @extends BaseShape
 */
export class Rectangle extends BaseShape {
    /**
     * Creates a new Rectangle instance.
     *
     * @param {number} x X-coordinate of top-left corner.
     * @param {number} y Y-coordinate of top-left corner.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     *
     * @example
     * const rect = new Rectangle(10, 20, 120, 60);
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'rectangle';
        /** @type {number} Corner radius for rounded rectangles (0 = sharp corners). */
        this.cornerRadius = 0;
    }

    /**
     * Draws the rectangle on the canvas.
     *
     * Uses rounded rectangle rendering if cornerRadius > 0, otherwise draws a standard rectangle.
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

        if (this.cornerRadius > 0) {
            this.drawRoundedRect(ctx);
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        this.clearShadow(ctx);
        ctx.restore();
    }

    /**
     * Draws a rounded rectangle using quadratic curves.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @private
     */
    drawRoundedRect(ctx) {
        const r = Math.min(this.cornerRadius, this.width / 2, this.height / 2);

        ctx.beginPath();
        ctx.moveTo(this.x + r, this.y);
        ctx.lineTo(this.x + this.width - r, this.y);
        ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + r);
        ctx.lineTo(this.x + this.width, this.y + this.height - r);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - r, this.y + this.height);
        ctx.lineTo(this.x + r, this.y + this.height);
        ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - r);
        ctx.lineTo(this.x, this.y + r);
        ctx.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Serializes the rectangle to JSON, including cornerRadius.
     *
     * @returns {Object} JSON representation with all properties.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            cornerRadius: this.cornerRadius
        };
    }
}
