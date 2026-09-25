/**
 * @module shapes/VideoMatrix
 * @description Video routing matrix system object (video + SDI ports). Renders as a rectangle with an "M" glyph.
 *
 * @see module:core/SystemObject
 */

import { SystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class VideoMatrix extends SystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'video_matrix',
            fill: ObjectColors.VIDEO_MATRIX,
            ports: VideoMatrix.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return {
            video: { input: 4, output: 4 },
            sdi: { input: 2, output: 2 }
        };
    }

    /**
     * Draws the "M" glyph.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const centerX = b.x + b.width / 2;
        const centerY = b.y + b.height / 2;
        const size = Math.min(b.width, b.height) * 0.4;

        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = Math.max(2, this.strokeWidth);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(centerX - size / 2, centerY + size / 2);
        ctx.lineTo(centerX - size / 2, centerY - size / 2);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(centerX + size / 2, centerY - size / 2);
        ctx.lineTo(centerX + size / 2, centerY + size / 2);
        ctx.stroke();
    }
}
