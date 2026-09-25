/**
 * @module shapes/PowerSupply
 * @description Power supply / power distribution unit: one mains input feeding several power outputs,
 * with an optional management network port. Renders as a box with a lightning bolt.
 *
 * @see module:core/SystemObject
 */

import { SystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class PowerSupply extends SystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'power_supply',
            fill: ObjectColors.POWER_SUPPLY,
            ports: PowerSupply.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return {
            power: { input: 1, output: 8 },
            network: { input: 1, output: 0 }
        };
    }

    /**
     * Draws the lightning bolt.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2 - (this.label ? b.height * 0.06 : 0);
        const s = Math.min(b.width, b.height) * 0.22;
        ctx.fillStyle = '#FFD54F';
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + s * 0.25, cy - s);
        ctx.lineTo(cx - s * 0.45, cy + s * 0.15);
        ctx.lineTo(cx + s * 0.02, cy + s * 0.15);
        ctx.lineTo(cx - s * 0.25, cy + s);
        ctx.lineTo(cx + s * 0.45, cy - s * 0.15);
        ctx.lineTo(cx - s * 0.02, cy - s * 0.15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
