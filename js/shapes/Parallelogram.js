import { BaseShape } from '../core/BaseShape.js';

export class Parallelogram extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'parallelogram';
        this.skew = 0.2; // Skew factor (0-1)
    }

    getPoints() {
        const skewOffset = Math.abs(this.width) * this.skew;
        const w = this.width;
        const h = this.height;

        // Handle negative widths/heights during drawing
        if (w >= 0 && h >= 0) {
            return [
                { x: this.x + skewOffset, y: this.y },
                { x: this.x + w, y: this.y },
                { x: this.x + w - skewOffset, y: this.y + h },
                { x: this.x, y: this.y + h }
            ];
        } else if (w < 0 && h >= 0) {
            return [
                { x: this.x, y: this.y },
                { x: this.x + w + skewOffset, y: this.y },
                { x: this.x + w, y: this.y + h },
                { x: this.x - skewOffset, y: this.y + h }
            ];
        } else if (w >= 0 && h < 0) {
            return [
                { x: this.x, y: this.y },
                { x: this.x + skewOffset, y: this.y + h },
                { x: this.x + w - skewOffset, y: this.y + h },
                { x: this.x + w, y: this.y }
            ];
        } else {
            return [
                { x: this.x - skewOffset, y: this.y },
                { x: this.x, y: this.y },
                { x: this.x + w + skewOffset, y: this.y + h },
                { x: this.x + w, y: this.y + h }
            ];
        }
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);

        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;

        const points = this.getPoints();

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        this.clearShadow(ctx);
        ctx.restore();
    }

    toJSON() {
        return {
            ...super.toJSON(),
            skew: this.skew
        };
    }
}
