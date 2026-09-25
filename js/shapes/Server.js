/**
 * @module shapes/Server
 * @description Rack server system object with video, SDI, network and USB ports.
 * Renders as a rectangle with horizontal rack lines.
 *
 * @example
 * const srv = new Server(100, 100, 120, 180);
 * srv.ports.video.output = 4;
 *
 * @see module:core/SystemObject
 */

import { SystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class Server extends SystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height, {
            type: 'server',
            fill: ObjectColors.SERVER,
            ports: Server.defaultPorts()
        });
    }

    /** @returns {PortConfig} */
    static defaultPorts() {
        return {
            video: { input: 2, output: 2 },
            sdi: { input: 1, output: 1 },
            network: { input: 2, output: 0 },
            usb: { input: 4, output: 0 }
        };
    }

    /**
     * Draws the rack lines.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawIcon(ctx) {
        const b = this.getBounds();
        const rackCount = 4;
        const rackSpacing = b.height / rackCount;
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 1;
        for (let i = 1; i < rackCount; i++) {
            const y = b.y + i * rackSpacing;
            ctx.beginPath();
            ctx.moveTo(b.x, y);
            ctx.lineTo(b.x + b.width, y);
            ctx.stroke();
        }
    }
}
