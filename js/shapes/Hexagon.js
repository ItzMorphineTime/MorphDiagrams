/**
 * @module shapes/Hexagon
 * @description Flat-sided hexagon (pointy top and bottom).
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

export class Hexagon extends BaseShape {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'hexagon';
    }

    /**
     * The six vertices starting at the top, clockwise.
     * @returns {Array<{x:number,y:number}>}
     */
    getPoints() {
        const b = this.getBounds();
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        const h = b.height / 2;
        return [
            { x: cx, y: b.y },
            { x: b.x + b.width, y: cy - h / 2 },
            { x: b.x + b.width, y: cy + h / 2 },
            { x: cx, y: b.y + b.height },
            { x: b.x, y: cy + h / 2 },
            { x: b.x, y: cy - h / 2 }
        ];
    }

    /**
     * Point-in-polygon hit test (rotation aware).
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    containsPoint(x, y) {
        const p = this.toLocalPoint(x, y);
        const pts = this.getPoints();
        let inside = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const xi = pts[i].x, yi = pts[i].y, xj = pts[j].x, yj = pts[j].y;
            if (((yi > p.y) !== (yj > p.y)) && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi)) inside = !inside;
        }
        return inside;
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
