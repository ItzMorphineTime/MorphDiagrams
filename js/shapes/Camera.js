/**
 * @module shapes/Camera
 * @description Camera system object: SDI outputs, a reference (genlock) input, network control and power.
 * Renders as a camera body with a lens.
 *
 * @see module:core/SystemObject
 */

import { SystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class Camera extends SystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'camera',
            fill: ObjectColors.CAMERA,
            ports: Camera.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return {
            sdi: { input: 1, output: 2 },
            network: { input: 1, output: 0 },
            power: { input: 1, output: 0 }
        };
    }

    /**
     * Draws the lens and viewfinder.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2 - (this.label ? b.height * 0.06 : 0);
        const r = Math.min(b.width, b.height) * 0.22;

        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
        ctx.stroke();

        // viewfinder bump
        ctx.beginPath();
        ctx.rect(cx + r * 0.6, cy - r * 1.35, r * 0.9, r * 0.5);
        ctx.stroke();
    }
}
