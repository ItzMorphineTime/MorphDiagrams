/**
 * @module shapes/SyncGenerator
 * @description Sync / reference generator system object distributing SDI timing. Renders as a hexagon with a clock glyph.
 *
 * @see module:core/SystemObject
 */

import { HexSystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class SyncGenerator extends HexSystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'sync_generator',
            fill: ObjectColors.SYNC_GENERATOR,
            ports: SyncGenerator.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return { sdi: { input: 2, output: 4 } };
    }

    /**
     * Draws the clock glyph.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        const radius = Math.min(b.width, b.height) * 0.2;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - radius * 0.6);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * 0.4, cy);
        ctx.stroke();
    }
}
