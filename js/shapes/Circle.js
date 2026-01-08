import { BaseShape } from '../core/BaseShape.js';

export class Circle extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'circle';
    }

    containsPoint(x, y) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const rx = Math.abs(this.width / 2);
        const ry = Math.abs(this.height / 2);

        if (rx === 0 || ry === 0) return false;

        return ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2) <= 1;
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);

        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;

        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.abs(this.width / 2),
            Math.abs(this.height / 2),
            0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        ctx.restore();
    }
}
