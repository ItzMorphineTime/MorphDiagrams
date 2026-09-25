/**
 * @module shapes/Circle
 * @description Circle / ellipse filling its bounding box.
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

export class Circle extends BaseShape {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'circle';
    }

    /**
     * Ellipse hit test (rotation aware).
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    containsPoint(x, y) {
        const p = this.toLocalPoint(x, y);
        const c = this.getCenter();
        const rx = Math.abs(this.width / 2);
        const ry = Math.abs(this.height / 2);
        if (rx === 0 || ry === 0) return false;
        return ((p.x - c.x) ** 2) / (rx ** 2) + ((p.y - c.y) ** 2) / (ry ** 2) <= 1;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        if (!this.visible) return;
        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;

        const c = this.getCenter();
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, Math.abs(this.width / 2), Math.abs(this.height / 2), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        this.drawLabel(ctx);
        ctx.restore();
    }
}
