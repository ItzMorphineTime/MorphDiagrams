/**
 * @module shapes/LEDProcessor
 * @description LED wall processor system object (video + SDI inputs, video outputs). Renders as a rectangle
 * with three LED dots.
 *
 * @see module:core/SystemObject
 */

import { SystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class LEDProcessor extends SystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'led_processor',
            fill: ObjectColors.LED_PROCESSOR,
            ports: LEDProcessor.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return {
            video: { input: 2, output: 4 },
            sdi: { input: 1, output: 0 }
        };
    }

    /**
     * Draws the LED dots.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const ledSize = Math.min(b.width, b.height) * 0.1;
        const ledSpacing = ledSize * 1.5;
        const startX = b.x + b.width / 2 - ledSpacing;
        const centerY = b.y + b.height / 2;

        ctx.fillStyle = '#FF6B6B';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(startX + i * ledSpacing, centerY, ledSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
