import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ConnectionColors } from '../config/ConnectionTypes.js';

/**
 * ConnectorAnchor shape representing a universal connection point.
 * Acts as a waypoint or junction for connectors, allowing any connection type.
 * Renders as a small circle with an inner dot.
 * @class ConnectorAnchor
 * @extends BaseShape
 */
export class ConnectorAnchor extends BaseShape {
    /**
     * Creates a new ConnectorAnchor instance.
     * @param {number} x - X-coordinate of top-left corner
     * @param {number} y - Y-coordinate of top-left corner
     */
    constructor(x, y) {
        super(x, y, 16, 16); // Small circle
        /** @type {string} Shape type identifier */
        this.type = 'connector_anchor';
        /** @type {string} Fill color (white) */
        this.fill = '#ffffff';
        /** @type {string} Stroke color */
        this.stroke = '#2c3e50';
        /** @type {number} Stroke width */
        this.strokeWidth = 2;
        /** @type {boolean} Shape cannot be resized */
        this.resizable = false;

        /** @type {string|null} Connection type - null allows any connection type */
        this.connectionType = null;
        /** @type {string} Port type - 'both' allows input and output connections */
        this.portType = 'both';
        /** @type {string} Display label */
        this.label = 'Anchor';
    }

    /**
     * Gets the anchor point at the center of the shape.
     * Returns a single universal anchor that accepts any connection type.
     * @returns {Object<string, {x: number, y: number, connectionType: null, portType: string}>}
     */
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

    /**
     * Draws the connector anchor as a circle with an inner dot.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
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
    }

    /**
     * Serializes the connector anchor to JSON, including connection properties.
     * @returns {Object} JSON representation with connectionType, portType, and label
     */
    toJSON() {
        return {
            ...super.toJSON(),
            connectionType: this.connectionType,
            portType: this.portType,
            label: this.label
        };
    }
}
