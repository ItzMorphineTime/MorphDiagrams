import { BaseShape } from '../core/BaseShape.js';
import { ConnectionTypes, ObjectColors } from '../config/ConnectionTypes.js';

export class VideoMatrix extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'video_matrix';
        this.fill = ObjectColors.VIDEO_MATRIX;
        this.topHeight = Math.min(height * 0.15, 20);

        // Port configuration
        this.ports = {
            video: { input: 4, output: 4 },
            sdi: { input: 2, output: 2 }
        };
    }

    // Get anchor points based on port configuration
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

        // Normalize coordinates to handle all drag directions
        const x = Math.min(this.x, this.x + this.width);
        const y = Math.min(this.y, this.y + this.height);
        const width = Math.abs(this.width);
        const height = Math.abs(this.height);

        // Draw rectangle
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fill();
        ctx.stroke();

        // Draw 'M' shape in the center
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const mWidth = Math.min(width, height) * 0.4;
        const mHeight = Math.min(width, height) * 0.4;

        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = Math.max(2, this.strokeWidth);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        // Left vertical line
        ctx.moveTo(centerX - mWidth / 2, centerY + mHeight / 2);
        ctx.lineTo(centerX - mWidth / 2, centerY - mHeight / 2);
        // Down to center
        ctx.lineTo(centerX, centerY);
        // Up to top right
        ctx.lineTo(centerX + mWidth / 2, centerY - mHeight / 2);
        // Down to bottom right
        ctx.lineTo(centerX + mWidth / 2, centerY + mHeight / 2);
        ctx.stroke();

        this.clearShadow(ctx);
        ctx.restore();
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ports: this.ports,
            topHeight: this.topHeight
        };
    }
}
