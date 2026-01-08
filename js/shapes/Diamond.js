import { BaseShape } from '../core/BaseShape.js';

export class Diamond extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'diamond';
    }

    containsPoint(x, y) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Point-in-diamond test using cross product
        const dx = Math.abs(x - cx) / (this.width / 2);
        const dy = Math.abs(y - cy) / (this.height / 2);

        return dx + dy <= 1;
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
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
