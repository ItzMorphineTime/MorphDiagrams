import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ConnectionColors } from '../config/ConnectionTypes.js';

export class ConnectorAnchor extends BaseShape {
    constructor(x, y) {
        super(x, y, 16, 16); // Small circle
        this.type = 'connector_anchor';
        this.fill = '#ffffff';
        this.stroke = '#2c3e50';
        this.strokeWidth = 2;
        this.resizable = false; // Make it non-resizable

        // Anchor properties
        this.connectionType = null; // Generic anchor - no specific connection type
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
                anchor_point: {
                    x: rotated.x,
                    y: rotated.y,
                    connectionType: this.connectionType,
                    portType: 'both'
                }
            };
        }

        return { anchor_point: anchor };
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const radius = this.width / 2;

        // Draw outer circle (white with dark stroke)
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw inner circle (smaller, darker)
        ctx.fillStyle = this.stroke;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2);
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
