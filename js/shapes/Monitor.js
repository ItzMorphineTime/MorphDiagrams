/**
 * @module shapes/Monitor
 * @description Display / monitor system object: video and SDI inputs with a loop-through output.
 * Renders as a screen with a bezel and a stand.
 *
 * @see module:core/SystemObject
 */

import { SystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class Monitor extends SystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'monitor',
            fill: ObjectColors.MONITOR,
            ports: Monitor.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return {
            video: { input: 2, output: 1 },
            sdi: { input: 1, output: 0 },
            power: { input: 1, output: 0 }
        };
    }

    /**
     * Draws the screen inset and the stand.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const inset = Math.min(b.width, b.height) * 0.12;
        const screenH = b.height * 0.62;
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.rect(b.x + inset, b.y + inset, b.width - inset * 2, screenH);
        ctx.fill();
        ctx.stroke();

        const cx = b.x + b.width / 2;
        const standTop = b.y + inset + screenH;
        const standH = Math.min(14, b.height - inset - screenH - 4);
        ctx.beginPath();
        ctx.moveTo(cx, standTop);
        ctx.lineTo(cx, standTop + standH * 0.6);
        ctx.moveTo(cx - b.width * 0.15, standTop + standH);
        ctx.lineTo(cx + b.width * 0.15, standTop + standH);
        ctx.stroke();
    }
}
