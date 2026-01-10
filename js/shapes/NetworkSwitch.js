/**
 * @module shapes/NetworkSwitch
 * @description Diagram shape implementation for `NetworkSwitch`.
 *
 * @see module:core/BaseShape
 * @see module:core/Connector
 *
 * @example
 * import { NetworkSwitch } from './shapes/NetworkSwitch.js';
 */

import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ObjectColors } from '../config/ConnectionTypes.js';

/**
 * NetworkSwitch shape representing a network switching device.
 * Supports bidirectional network connections.
 * Renders as a hexagon with an 'N' letter drawn in the center.
 * @class NetworkSwitch
 * @extends BaseShape
 */
export class NetworkSwitch extends BaseShape {
    /**
     * Creates a new NetworkSwitch instance.
     * @param {number} x - X-coordinate of top-left corner
     * @param {number} y - Y-coordinate of top-left corner
     * @param {number} width - Width in pixels
     * @param {number} height - Height in pixels
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'network_switch';
        this.fill = ObjectColors.NETWORK_SWITCH;

        /** @type {Object<string, {input: number, output: number}>} Port configuration */
        this.ports = {
            network: { input: 6, output: 6 }
        };
    }

    /**
     * Calculates the hexagon vertex points based on position and size.
     * @returns {Array<{x: number, y: number}>} Array of 6 hexagon vertices
     */
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
    /**
     * Returns the `AnchorPoints` value.
     * @returns {*} Result value.
     */
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

    /**
     * Draws the object using the provided canvas context.
     * @param {number} ctx ctx value.
     */
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

    /**
     * Serializes the object to a JSON-compatible structure.
     * @returns {*} Result value.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            ports: this.ports
        };
    }
}
