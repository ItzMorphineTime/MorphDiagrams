/**
 * @module shapes/Cylinder
 * @description Capsule ("pill") shape with semicircular ends, used for databases / storage.
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

export class Cylinder extends BaseShape {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'cylinder';
        /** @type {number} Kept for file compatibility (unused by the capsule renderer) */
        this.topHeight = Math.min(Math.abs(height) * 0.15, 20);
    }

    /**
     * Traces the capsule outline on the context (no fill/stroke).
     * @param {CanvasRenderingContext2D} ctx
     * @param {{x:number,y:number,width:number,height:number}} [b]
     */
    tracePath(ctx, b = this.getBounds()) {
        const { x, y, width, height } = b;
        const radius = Math.min(width, height) / 2;
        ctx.beginPath();
        if (width > height) {
            ctx.arc(x + radius, y + radius, radius, Math.PI / 2, Math.PI * 1.5);
            ctx.lineTo(x + width - radius, y);
            ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI / 2);
            ctx.lineTo(x + radius, y + height);
        } else {
            ctx.arc(x + radius, y + radius, radius, Math.PI, 0);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arc(x + radius, y + height - radius, radius, 0, Math.PI);
            ctx.lineTo(x, y + radius);
        }
        ctx.closePath();
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

        this.tracePath(ctx);
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        this.drawLabel(ctx);
        ctx.restore();
    }

    /** @returns {Object} */
    toJSON() {
        return { ...super.toJSON(), topHeight: this.topHeight };
    }
}
