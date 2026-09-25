/**
 * @module shapes/Rectangle
 * @description Rectangle with optional rounded corners.
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

export class Rectangle extends BaseShape {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'rectangle';
        /** @type {number} Corner radius in pixels (0 = square corners) */
        this.cornerRadius = 0;
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

        const b = this.getBounds();
        if (this.cornerRadius > 0) {
            this.drawRoundedRect(ctx, b);
        } else {
            ctx.fillRect(b.x, b.y, b.width, b.height);
            ctx.strokeRect(b.x, b.y, b.width, b.height);
        }

        this.clearShadow(ctx);
        this.drawLabel(ctx);
        ctx.restore();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {{x:number,y:number,width:number,height:number}} [b]
     */
    drawRoundedRect(ctx, b = this.getBounds()) {
        const r = Math.min(this.cornerRadius, b.width / 2, b.height / 2);
        ctx.beginPath();
        ctx.moveTo(b.x + r, b.y);
        ctx.lineTo(b.x + b.width - r, b.y);
        ctx.quadraticCurveTo(b.x + b.width, b.y, b.x + b.width, b.y + r);
        ctx.lineTo(b.x + b.width, b.y + b.height - r);
        ctx.quadraticCurveTo(b.x + b.width, b.y + b.height, b.x + b.width - r, b.y + b.height);
        ctx.lineTo(b.x + r, b.y + b.height);
        ctx.quadraticCurveTo(b.x, b.y + b.height, b.x, b.y + b.height - r);
        ctx.lineTo(b.x, b.y + r);
        ctx.quadraticCurveTo(b.x, b.y, b.x + r, b.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /** @returns {Object} */
    toJSON() {
        return { ...super.toJSON(), cornerRadius: this.cornerRadius };
    }
}
