/**
 * @module shapes/Diamond
 * @description Diagram shape implementation for `Diamond`.
 *
 * @see module:core/BaseShape
 * @see module:core/Connector
 *
 * @example
 * import { Diamond } from './shapes/Diamond.js';
 */

import { BaseShape } from '../core/BaseShape.js';
/**
 * `Diamond` shape for MorphDiagrams.
 *
 * @class Diamond
 * @extends BaseShape
 *
 * @example
 * const instance = new Diamond(10, 20, 30, 40);
 */

export class Diamond extends BaseShape {
    /**
     * Creates a new `Diamond` instance.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'diamond';
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

        // Point-in-diamond test using cross product
        const dx = Math.abs(x - cx) / (this.width / 2);
        const dy = Math.abs(y - cy) / (this.height / 2);

        return dx + dy <= 1;
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
