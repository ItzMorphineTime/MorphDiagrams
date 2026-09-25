/**
 * @module shapes/Diamond
 * @description Diamond (rhombus) shape, typically used for decisions.
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

export class Diamond extends BaseShape {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'diamond';
    }

    /**
     * The four vertices (top, right, bottom, left).
     * @returns {Array<{x:number,y:number}>}
     */
    getPoints() {
        const b = this.getBounds();
        return [
            { x: b.x + b.width / 2, y: b.y },
            { x: b.x + b.width, y: b.y + b.height / 2 },
            { x: b.x + b.width / 2, y: b.y + b.height },
            { x: b.x, y: b.y + b.height / 2 }
        ];
    }

    /**
     * Diamond hit test (rotation aware).
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    containsPoint(x, y) {
        const p = this.toLocalPoint(x, y);
        const c = this.getCenter();
        const hw = Math.abs(this.width / 2);
        const hh = Math.abs(this.height / 2);
        if (hw === 0 || hh === 0) return false;
        return Math.abs(p.x - c.x) / hw + Math.abs(p.y - c.y) / hh <= 1;
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

        const pts = this.getPoints();
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        this.drawLabel(ctx);
        ctx.restore();
    }
}
