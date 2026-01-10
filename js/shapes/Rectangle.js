/**
 * @module shapes/Rectangle
 * @description Diagram shape implementation for `Rectangle`.
 *
 * @see module:core/BaseShape
 * @see module:core/Connector
 *
 * @example
 * import { Rectangle } from './shapes/Rectangle.js';
 */

import { BaseShape } from '../core/BaseShape.js';
/**
 * `Rectangle` shape for MorphDiagrams.
 *
 * @class Rectangle
 * @extends BaseShape
 *
 * @example
 * const instance = new Rectangle(10, 20, 30, 40);
 */

export class Rectangle extends BaseShape {
    /**
     * Creates a new `Rectangle` instance.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'rectangle';
        this.cornerRadius = 0;
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
     * Performs `drawRoundedRect`.
     * @param {number} ctx ctx value.
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
     * Serializes the object to a JSON-compatible structure.
     * @returns {*} Result value.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            cornerRadius: this.cornerRadius
        };
    }
}
