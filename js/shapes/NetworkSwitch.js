import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ObjectColors } from '../config/ConnectionTypes.js';

export class NetworkSwitch extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'network_switch';
        this.fill = ObjectColors.NETWORK_SWITCH;

        // Port configuration
        this.ports = {
            network: { input: 8 }
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
        const networkInputs = this.ports.network.input;

        // Distribute network inputs around the bottom half of hexagon
        const points = this.getPoints();

        // Use bottom 3 edges for ports (indices 2, 3, 4)
        const bottomEdges = [
            { start: points[2], end: points[3] },
            { start: points[3], end: points[4] },
            { start: points[4], end: points[5] }
        ];

        // Distribute ports evenly across bottom edges
        for (let i = 0; i < networkInputs; i++) {
            const t = i / (networkInputs - 1 || 1); // 0 to 1
            const edgeIndex = Math.floor(t * 2.99); // 0, 1, or 2
            const edgeT = (t * 3) % 1;

            const edge = bottomEdges[edgeIndex];
            const x = edge.start.x + (edge.end.x - edge.start.x) * edgeT;
            const y = edge.start.y + (edge.end.y - edge.start.y) * edgeT;

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
