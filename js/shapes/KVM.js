/**
 * @module shapes/KVM
 * @description KVM switch / extender: video and USB from several computers in, one console (video + USB)
 * out, optional network for IP KVM. Renders as a box with a keyboard-and-screen glyph.
 *
 * @see module:core/SystemObject
 */

import { SystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class KVM extends SystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'kvm',
            fill: ObjectColors.KVM,
            ports: KVM.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return {
            video: { input: 4, output: 1 },
            usb: { input: 1, output: 4 },
            network: { input: 1, output: 0 }
        };
    }

    /**
     * Draws the screen-and-keyboard glyph.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2 - (this.label ? b.height * 0.06 : 0);
        const s = Math.min(b.width, b.height) * 0.24;
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.rect(cx - s, cy - s, s * 2, s * 1.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(cx - s * 0.9, cy + s * 0.45, s * 1.8, s * 0.5);
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
            const kx = cx - s * 0.65 + i * s * 0.43;
            ctx.beginPath();
            ctx.moveTo(kx, cy + s * 0.6);
            ctx.lineTo(kx + s * 0.2, cy + s * 0.6);
            ctx.stroke();
        }
    }
}
