import { BaseShape } from '../core/BaseShape.js';

export class Rectangle extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'rectangle';
        this.cornerRadius = 0;
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);

        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;

        if (this.cornerRadius > 0) {
            this.drawRoundedRect(ctx);
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        this.clearShadow(ctx);
        ctx.restore();
    }

    drawRoundedRect(ctx) {
        const r = Math.min(this.cornerRadius, this.width / 2, this.height / 2);

        ctx.beginPath();
        ctx.moveTo(this.x + r, this.y);
        ctx.lineTo(this.x + this.width - r, this.y);
        ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + r);
        ctx.lineTo(this.x + this.width, this.y + this.height - r);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - r, this.y + this.height);
        ctx.lineTo(this.x + r, this.y + this.height);
        ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - r);
        ctx.lineTo(this.x, this.y + r);
        ctx.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    toJSON() {
        return {
            ...super.toJSON(),
            cornerRadius: this.cornerRadius
        };
    }
}
