import { BaseShape } from '../core/BaseShape.js';

export class Hexagon extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'hexagon';
    }

    getPoints() {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const w = this.width / 2;
        const h = this.height / 2;

        return [
            { x: cx, y: this.y },
            { x: this.x + this.width, y: cy - h / 2 },
            { x: this.x + this.width, y: cy + h / 2 },
            { x: cx, y: this.y + this.height },
            { x: this.x, y: cy + h / 2 },
            { x: this.x, y: cy - h / 2 }
        ];
    }

    containsPoint(x, y) {
        // Simple bounding box check for now
        return super.containsPoint(x, y);
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
}
