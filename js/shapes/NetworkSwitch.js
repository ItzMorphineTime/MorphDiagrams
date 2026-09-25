/**
 * @module shapes/NetworkSwitch
 * @description Network switch system object with bidirectional network ports. Renders as a hexagon with an "N" glyph.
 *
 * @see module:core/SystemObject
 */

import { HexSystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class NetworkSwitch extends HexSystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'network_switch',
            fill: ObjectColors.NETWORK_SWITCH,
            ports: NetworkSwitch.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return { network: { input: 6, output: 6 } };
    }

    /**
     * Draws the "N" glyph.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const centerX = b.x + b.width / 2;
        const centerY = b.y + b.height / 2;
        const nWidth = Math.min(b.width, b.height) * 0.3;
        const nHeight = Math.min(b.width, b.height) * 0.35;

        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = Math.max(2, this.strokeWidth);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(centerX - nWidth / 2, centerY + nHeight / 2);
        ctx.lineTo(centerX - nWidth / 2, centerY - nHeight / 2);
        ctx.lineTo(centerX + nWidth / 2, centerY + nHeight / 2);
        ctx.lineTo(centerX + nWidth / 2, centerY - nHeight / 2);
        ctx.stroke();
    }
}
