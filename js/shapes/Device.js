/**
 * @module shapes/Device
 * @description Generic hardware device with a fully configurable port map. This is the workhorse for
 * modelling equipment that has no dedicated shape (media servers, converters, consoles, PLCs, ...).
 *
 * @example
 * const enc = new Device(100, 100, 140, 90);
 * enc.label = 'Encoder 1';
 * enc.setPorts({ sdi: { input: 2, output: 0 }, network: { input: 0, output: 1 } });
 *
 * @see module:core/SystemObject
 */

import { SystemObject } from '../core/SystemObject.js';
import { ObjectColors } from '../config/ConnectionTypes.js';

export class Device extends SystemObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     * @param {PortConfig} [options.ports]
     */
    constructor(x, y, width, height, options = {}) {
        super(x, y, width, height, {
            type: 'device',
            fill: ObjectColors.DEVICE,
            labelPosition: 'inside',
            ports: options.ports || Device.defaultPorts()
        });
        /** @type {number} Corner radius of the body */
        this.cornerRadius = 6;
    }

    /**
     * Default port map for a freshly created device.
     * @returns {PortConfig}
     */
    static defaultPorts() {
        return { video: { input: 2, output: 2 }, network: { input: 1, output: 1 } };
    }

    /** @param {CanvasRenderingContext2D} ctx */
    drawBody(ctx) {
        const b = this.getBounds();
        const r = Math.min(this.cornerRadius || 0, b.width / 2, b.height / 2);
        ctx.beginPath();
        ctx.moveTo(b.x + r, b.y);
        ctx.lineTo(b.x + b.width - r, b.y);
        ctx.quadraticCurveTo(b.x + b.width, b.y, b.x + b.width, b.y + r);
        ctx.lineTo(b.x + b.width, b.y + b.height - r);
        ctx.quadraticCurveTo(b.x + b.width, b.y + b.height, b.x + b.width - r, b.y + b.height);
        ctx.lineTo(b.x + r, b.y + b.height);
        ctx.quadraticCurveTo(b.x, b.y + b.height, b.x, b.y + b.height - r);
        ctx.lineTo(b.x, b.y + r);
        ctx.quadraticCurveTo(b.x, b.y, b.x + r, b.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /** @returns {Object} */
    toJSON() {
        return { ...super.toJSON(), cornerRadius: this.cornerRadius };
    }
}
