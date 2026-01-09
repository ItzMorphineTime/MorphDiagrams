import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ObjectColors } from '../config/ConnectionTypes.js';

export class NetworkSwitch extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'network_switch';
        this.fill = ObjectColors.NETWORK_SWITCH;

        // Port configuration
        this.ports = {
            network: { input: 6, output: 6 }
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
        const networkInputs = this.ports.network.input || 0;
        const networkOutputs = this.ports.network.output || 0;

        const points = this.getPoints();

        // Hexagon has 6 points starting from top, going clockwise
        // Points: [0=top, 1=top-right, 2=bottom-right, 3=bottom, 4=bottom-left, 5=top-left]
        // Left edge: from point 5 to point 4 (for inputs)
        // Right edge: from point 1 to point 2 (for outputs)
        const leftEdge = { start: points[5], end: points[4] };
        const rightEdge = { start: points[1], end: points[2] };

        // Add network inputs on the left edge
        for (let i = 0; i < networkInputs; i++) {
            const t = (i + 1) / (networkInputs + 1);
            const x = leftEdge.start.x + (leftEdge.end.x - leftEdge.start.x) * t;
            const y = leftEdge.start.y + (leftEdge.end.y - leftEdge.start.y) * t;

            const key = `network_input_${i}`;
            const anchor = { x, y, connectionType: 'network', portType: 'input' };

            // Rotate if shape is rotated
            if (this.rotation && this.rotation !== 0) {
                const rotated = this.rotatePoint(anchor.x, anchor.y);
                anchor.x = rotated.x;
                anchor.y = rotated.y;
            }

            anchors[key] = anchor;
        }

        // Add network outputs on the right edge
        for (let i = 0; i < networkOutputs; i++) {
            const t = (i + 1) / (networkOutputs + 1);
            const x = rightEdge.start.x + (rightEdge.end.x - rightEdge.start.x) * t;
            const y = rightEdge.start.y + (rightEdge.end.y - rightEdge.start.y) * t;

            const key = `network_output_${i}`;
            const anchor = { x, y, connectionType: 'network', portType: 'output' };

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

        // Draw 'N' shape in the center
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const nWidth = Math.min(this.width, this.height) * 0.3;
        const nHeight = Math.min(this.width, this.height) * 0.35;

        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = Math.max(2, this.strokeWidth);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        // Left vertical line (bottom to top)
        ctx.moveTo(centerX - nWidth / 2, centerY + nHeight / 2);
        ctx.lineTo(centerX - nWidth / 2, centerY - nHeight / 2);
        // Diagonal to bottom right
        ctx.lineTo(centerX + nWidth / 2, centerY + nHeight / 2);
        // Up to top right
        ctx.lineTo(centerX + nWidth / 2, centerY - nHeight / 2);
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
