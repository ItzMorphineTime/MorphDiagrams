import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ObjectColors } from '../config/ConnectionTypes.js';

/**
 * Server shape representing a network server with multiple port types.
 * Supports video, SDI, network, and USB connections.
 * Renders as a rectangle with horizontal rack lines.
 * @class Server
 * @extends BaseShape
 */
export class Server extends BaseShape {
    /**
     * Creates a new Server instance.
     * @param {number} x - X-coordinate of top-left corner
     * @param {number} y - Y-coordinate of top-left corner
     * @param {number} width - Width in pixels
     * @param {number} height - Height in pixels
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        /** @type {string} Shape type identifier */
        this.type = 'server';
        /** @type {string} Fill color from ObjectColors config */
        this.fill = ObjectColors.SERVER;

        /**
         * Port configuration defining input/output ports for each connection type.
         * Inputs appear on left side, outputs on right side.
         * @type {Object<string, {input: number, output: number}>}
         */
        this.ports = {
            video: { input: 2, output: 2 },
            sdi: { input: 1, output: 1 },
            network: { input: 2, output: 0 },
            usb: { input: 4, output: 0 }
        };
    }

    /**
     * Gets anchor points for connections based on port configuration.
     * Distributes input ports evenly along left edge, output ports along right edge.
     * Each anchor includes connectionType and portType for connection validation.
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

    /**
     * Draws the server shape as a rectangle with horizontal rack lines.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
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

        // Draw server rack lines
        const rackCount = 4;
        const rackSpacing = this.height / rackCount;
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 1;
        for (let i = 1; i < rackCount; i++) {
            const y = this.y + i * rackSpacing;
            ctx.beginPath();
            ctx.moveTo(this.x, y);
            ctx.lineTo(this.x + this.width, y);
            ctx.stroke();
        }

        this.clearShadow(ctx);
        ctx.restore();
    }

    /**
     * Serializes the server to JSON, including port configuration.
     * @returns {Object} JSON representation with ports
     */
    toJSON() {
        return {
            ...super.toJSON(),
            ports: this.ports
        };
    }
}
