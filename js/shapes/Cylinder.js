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
        this.applyRotation(ctx);
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

        // Start at top left
        ctx.moveTo(this.x, topY);

        // Draw left side down
        ctx.lineTo(this.x, bottomY);

        // Draw bottom arc (left to right)
        ctx.arc(cx, bottomY, rx, Math.PI, 0, false);

        // Draw right side up
        ctx.lineTo(this.x + this.width, topY);

        // Draw top arc back (right to left, counterclockwise)
        ctx.arc(cx, topY, rx, 0, Math.PI, true);

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
