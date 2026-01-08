import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ConnectionColors } from '../config/ConnectionTypes.js';

export class ConnectorAnchor extends BaseShape {
    constructor(x, y) {
        super(x, y, 12, 12); // Small square
        this.type = 'connector_anchor';
        this.fill = '#ffffff';
        this.stroke = '#2c3e50';
        this.strokeWidth = 2;

        // Anchor properties
        this.connectionType = ConnectionTypes.NETWORK; // Default to network
        this.portType = 'both'; // Can act as both input and output
        this.label = 'Anchor';
    }

    // Get anchor points - this object provides a single connection point at its center
    getAnchorPoints() {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        const anchor = {
            x: cx,
            y: cy,
            connectionType: this.connectionType,
            portType: 'both' // Can connect to both inputs and outputs
        };

        // Rotate if shape is rotated
        if (this.rotation && this.rotation !== 0) {
            const rotated = this.rotatePoint(anchor.x, anchor.y);
            return {
                center: {
                    x: rotated.x,
                    y: rotated.y,
                    connectionType: this.connectionType,
                    portType: 'both'
                }
            };
        }

        return { center: anchor };
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const size = this.width / 2;

        // Draw outer square
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw inner colored circle
        const color = ConnectionColors[this.connectionType] || '#0066cc';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        this.clearShadow(ctx);
        ctx.restore();

        // Draw label if shape is selected (handled by main.js)
    }

    toJSON() {
        return {
            ...super.toJSON(),
            connectionType: this.connectionType,
            portType: this.portType,
            label: this.label
        };
    }
}
