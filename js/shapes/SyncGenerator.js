/**
 * @module shapes/SyncGenerator
 * @description Diagram shape implementation for `SyncGenerator`.
 *
 * @see module:core/BaseShape
 * @see module:core/Connector
 *
 * @example
 * import { SyncGenerator } from './shapes/SyncGenerator.js';
 */

import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ObjectColors } from '../config/ConnectionTypes.js';

/**
 * SyncGenerator shape representing a video sync generation device.
 * Provides SDI timing signals to other devices in the system.
 * Renders as a hexagon shape.
 * @class SyncGenerator
 * @extends BaseShape
 */
export class SyncGenerator extends BaseShape {
    /**
     * Creates a new SyncGenerator instance.
     * @param {number} x - X-coordinate of top-left corner
     * @param {number} y - Y-coordinate of top-left corner
     * @param {number} width - Width in pixels
     * @param {number} height - Height in pixels
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'sync_generator';
        this.fill = ObjectColors.SYNC_GENERATOR;

        /** @type {Object<string, {input: number, output: number}>} Port configuration - SDI only */
        this.ports = {
            sdi: { input: 2, output: 4 }
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
        const sdiInputs = this.ports.sdi.input || 0;
        const sdiOutputs = this.ports.sdi.output || 0;

        const points = this.getPoints();

        // Hexagon has 6 points starting from top, going clockwise
        // Points: [0=top, 1=top-right, 2=bottom-right, 3=bottom, 4=bottom-left, 5=top-left]
        // Left edge: from point 5 to point 4 (for inputs)
        // Right edge: from point 1 to point 2 (for outputs)
        const leftEdge = { start: points[5], end: points[4] };
        const rightEdge = { start: points[1], end: points[2] };

        // Add SDI inputs on the left edge
        for (let i = 0; i < sdiInputs; i++) {
            const t = (i + 1) / (sdiInputs + 1);
            const x = leftEdge.start.x + (leftEdge.end.x - leftEdge.start.x) * t;
            const y = leftEdge.start.y + (leftEdge.end.y - leftEdge.start.y) * t;

            const key = `sdi_input_${i}`;
            const anchor = { x, y, connectionType: 'sdi', portType: 'input' };

            // Rotate if shape is rotated
            if (this.rotation && this.rotation !== 0) {
                const rotated = this.rotatePoint(anchor.x, anchor.y);
                anchor.x = rotated.x;
                anchor.y = rotated.y;
            }

            anchors[key] = anchor;
        }

        // Add SDI outputs on the right edge
        for (let i = 0; i < sdiOutputs; i++) {
            const t = (i + 1) / (sdiOutputs + 1);
            const x = rightEdge.start.x + (rightEdge.end.x - rightEdge.start.x) * t;
            const y = rightEdge.start.y + (rightEdge.end.y - rightEdge.start.y) * t;

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
