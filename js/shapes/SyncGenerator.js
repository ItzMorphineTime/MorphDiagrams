import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ObjectColors } from '../config/ConnectionTypes.js';

export class SyncGenerator extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'sync_generator';
        this.fill = ObjectColors.SYNC_GENERATOR;

        // Port configuration - only SDI outputs
        this.ports = {
            sdi: { output: 6 }
        };
    }

    // Get hexagon points
    getPoints() {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const rx = this.width / 2;
        const ry = this.height / 2;

        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            points.push({
                x: cx + rx * Math.cos(angle),
                y: cy + ry * Math.sin(angle)
            });
        }
        return points;
    }

    // Get anchor points based on port configuration
    getAnchorPoints() {
        const anchors = {};
        const sdiOutputs = this.ports.sdi.output;

        // Distribute SDI outputs around the hexagon
        const points = this.getPoints();

        // Use all 6 edges for outputs
        const edges = [];
        for (let i = 0; i < 6; i++) {
            edges.push({
                start: points[i],
                end: points[(i + 1) % 6]
            });
        }

        // Distribute ports evenly across all edges
        for (let i = 0; i < sdiOutputs; i++) {
            const t = i / sdiOutputs; // 0 to 1
            const edgeIndex = Math.floor(t * 6);
            const edgeT = (t * 6) % 1;

            const edge = edges[edgeIndex];
            const x = edge.start.x + (edge.end.x - edge.start.x) * edgeT;
            const y = edge.start.y + (edge.end.y - edge.start.y) * edgeT;

            const key = `sdi_output_${i}`;
            const anchor = { x, y, connectionType: 'sdi', portType: 'output' };

            // Rotate if shape is rotated
            if (this.rotation && this.rotation !== 0) {
                const rotated = this.rotatePoint(anchor.x, anchor.y);
                anchor.x = rotated.x;
                anchor.y = rotated.y;
            }

            anchors[key] = anchor;
        }

        return anchors;
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

        // Draw sync icon (clock symbol)
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const radius = Math.min(this.width, this.height) * 0.2;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Clock hands
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - radius * 0.6);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * 0.4, cy);
        ctx.stroke();

        this.clearShadow(ctx);
        ctx.restore();
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ports: this.ports
        };
    }
}
