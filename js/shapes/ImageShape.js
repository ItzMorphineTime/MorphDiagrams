/**
 * @module shapes/ImageShape
 * @description Raster image (data URL) drawn into its bounds.
 *
 * @remarks
 * The image element is only created in a browser; in Node (MCP server, tests) the shape keeps the
 * data URL and simply does not decode it.
 *
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

export class ImageShape extends BaseShape {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {string} [imageData] Data URL or image URL.
     */
    constructor(x, y, width, height, imageData) {
        super(x, y, width, height);
        this.type = 'image';
        /** @type {string|undefined} Data URL */
        this.imageData = imageData;
        /** @type {HTMLImageElement|null} Decoded image (browser only, not serialised) */
        this.image = null;
        /** @type {boolean} */
        this.loaded = false;
        /** @type {number} 0..1 */
        this.opacity = 1.0;
        this.labelPosition = 'below';
        if (imageData) this.loadImage(imageData);
    }

    /**
     * Starts decoding the image (no-op outside a browser).
     * @param {string} imageData
     */
    loadImage(imageData) {
        this.imageData = imageData;
        if (typeof Image === 'undefined') return;
        this.image = new Image();
        this.image.onload = () => { this.loaded = true; };
        this.image.src = imageData;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        if (!this.visible) return;
        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);
        const b = this.getBounds();
        ctx.globalAlpha = this.opacity;

        if (this.loaded && this.image) {
            ctx.drawImage(this.image, b.x, b.y, b.width, b.height);
        } else {
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(b.x, b.y, b.width, b.height);
        }

        if (this.stroke && this.stroke !== 'transparent') {
            ctx.strokeStyle = this.stroke;
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeRect(b.x, b.y, b.width, b.height);
        }

        ctx.globalAlpha = 1.0;
        this.clearShadow(ctx);
        this.drawLabel(ctx);
        ctx.restore();
    }

    /** @returns {Object} */
    toJSON() {
        return { ...super.toJSON(), imageData: this.imageData, opacity: this.opacity };
    }
}
