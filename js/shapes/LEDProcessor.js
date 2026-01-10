/**
 * @module shapes/LEDProcessor
 * @description LEDProcessor shape representing an LED video processing device. Handles video and SDI inputs for LED wall output.
 *
 * @remarks
 * - Renders as a rectangle with LED pattern indicators.
 * - Port configuration defines input/output ports for video and SDI connections.
 * - Input ports appear on the left side, output ports on the right side.
 * - Anchor points are automatically generated based on port configuration.
 *
 * @example
 * const processor = new LEDProcessor(10, 20, 120, 100);
 * processor.ports = {
 *   video: { input: 4, output: 1 },
 *   sdi: { input: 1, output: 0 }
 * };
 * processor.draw(ctx);
 *
 * @see module:core/BaseShape
 * @see module:config/ConnectionTypes
 */

import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ObjectColors } from '../config/ConnectionTypes.js';

/**
 * Represents an LED video processing device.
 *
 * @class
 * @extends BaseShape
 */
export class LEDProcessor extends BaseShape {
    /**
     * Creates a new LEDProcessor instance.
     * @param {number} x - X-coordinate of top-left corner
     * @param {number} y - Y-coordinate of top-left corner
     * @param {number} width - Width in pixels
     * @param {number} height - Height in pixels
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'led_processor';
        this.fill = ObjectColors.LED_PROCESSOR;

        /** @type {Object<string, {input: number, output: number}>} Port configuration */
        this.ports = {
            video: { input: 2, output: 4 },
            sdi: { input: 1, output: 0 }
        };
    }

    /**
     * Gets anchor points for connections based on port configuration.
     * @returns {Object<string, {x: number, y: number, connectionType: string, portType: string}>}
     */
    getAnchorPoints() {
        const anchors = {};
        const leftPorts = [];
        const rightPorts = [];

        // Collect all input ports (left side)
        for (let type in this.ports) {
            const inputCount = this.ports[type].input;
            for (let i = 0; i < inputCount; i++) {
                leftPorts.push({ type, direction: 'input', index: i });
            }
        }

        // Collect all output ports (right side)
        for (let type in this.ports) {
            const outputCount = this.ports[type].output;
            for (let i = 0; i < outputCount; i++) {
                rightPorts.push({ type, direction: 'output', index: i });
            }
        }

        // Calculate positions for left side ports (inputs)
        const leftSpacing = this.height / (leftPorts.length + 1);
        leftPorts.forEach((port, idx) => {
            const y = this.y + leftSpacing * (idx + 1);
            const key = `${port.type}_${port.direction}_${port.index}`;
            const anchor = { x: this.x, y, connectionType: port.type, portType: 'input' };

            // Rotate if shape is rotated
            if (this.rotation && this.rotation !== 0) {
                const rotated = this.rotatePoint(anchor.x, anchor.y);
                anchor.x = rotated.x;
                anchor.y = rotated.y;
            }

            anchors[key] = anchor;
        });

        // Calculate positions for right side ports (outputs)
        const rightSpacing = this.height / (rightPorts.length + 1);
        rightPorts.forEach((port, idx) => {
            const y = this.y + rightSpacing * (idx + 1);
            const key = `${port.type}_${port.direction}_${port.index}`;
            const anchor = { x: this.x + this.width, y, connectionType: port.type, portType: 'output' };

            // Rotate if shape is rotated
            if (this.rotation && this.rotation !== 0) {
                const rotated = this.rotatePoint(anchor.x, anchor.y);
                anchor.x = rotated.x;
                anchor.y = rotated.y;
            }

            anchors[key] = anchor;
        });

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

        // Draw main body
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw LED pattern indicator
        const ledSize = Math.min(this.width, this.height) * 0.1;
        const ledSpacing = ledSize * 1.5;
        const startX = this.x + this.width / 2 - ledSpacing;
        const centerY = this.y + this.height / 2;

        ctx.fillStyle = '#FF6B6B';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(startX + i * ledSpacing, centerY, ledSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }

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
