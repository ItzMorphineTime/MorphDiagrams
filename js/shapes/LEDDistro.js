/**
 * @module shapes/LEDDistro
 * @description LED distribution box ("XD"): takes data from an LED processor (video / fibre) and power,
 * and fans both out to LED panels. Renders as a box with an "XD" glyph and a row of outlets.
 *
 * @see module:core/SystemObject
 */

import { SystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class LEDDistro extends SystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'led_distro',
            fill: ObjectColors.LED_DISTRO,
            ports: LEDDistro.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return {
            video: { input: 2, output: 8 },
            fibre: { input: 1, output: 0 },
            power: { input: 1, output: 8 }
        };
    }

    /**
     * Draws the "XD" glyph and outlet row.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2 - (this.label ? b.height * 0.08 : 0);
        const size = Math.min(b.width, b.height) * 0.28;

        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `bold ${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('XD', cx, cy - size * 0.15);

        const outlets = 4;
        const w = Math.min(b.width * 0.6, 60);
        const step = w / outlets;
        const y = cy + size * 0.65;
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1;
        for (let i = 0; i < outlets; i++) {
            const ox = cx - w / 2 + step * i + step / 2;
            ctx.beginPath();
            ctx.rect(ox - step * 0.3, y - 3, step * 0.6, 6);
            ctx.stroke();
        }
    }
}
