import { BaseShape } from '../core/BaseShape.js';

export class Cylinder extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'cylinder';
        this.topHeight = Math.min(height * 0.15, 20); // Ellipse height at top
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
        this.applyShadow(ctx);

        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;

        const rx = Math.abs(this.width) / 2;
        const ry = Math.min(Math.abs(this.height) * 0.1, Math.abs(this.width) * 0.15);

        const cx = this.x + this.width / 2;
        const topY = this.y + ry;
        const bottomY = this.y + this.height - ry;

        // Draw cylinder body
        ctx.beginPath();
        ctx.moveTo(this.x, topY);
        ctx.lineTo(this.x, bottomY);

        // Bottom half-ellipse
        ctx.ellipse(cx, bottomY, rx, ry, 0, Math.PI, 0, false);

        ctx.lineTo(this.x + this.width, topY);

        // Top half-ellipse (back side, hidden)
        ctx.ellipse(cx, topY, rx, ry, 0, 0, Math.PI, true);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw top ellipse (visible front)
        ctx.beginPath();
        ctx.ellipse(cx, topY, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        ctx.restore();
    }

    toJSON() {
        return {
            ...super.toJSON(),
            topHeight: this.topHeight
        };
    }
}
