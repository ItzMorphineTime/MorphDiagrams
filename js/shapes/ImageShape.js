/**
 * @module shapes/ImageShape
 * @description Image diagram shape for embedding images in diagrams. Extends BaseShape to provide image rendering capabilities.
 *
 * @remarks
 * - Images are loaded asynchronously; shape only renders when loaded.
 * - Supports opacity control for image transparency.
 * - Image data can be a URL or data URI.
 *
 * @example
 * const img = new ImageShape(10, 20, 200, 150, 'https://example.com/image.png');
 * img.opacity = 0.8; // 80% opacity
 * img.draw(ctx);
 *
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

/**
 * Represents an image diagram shape.
 *
 * @class
 * @extends BaseShape
 */
export class ImageShape extends BaseShape {
    /**
     * Creates a new ImageShape instance.
     *
     * @param {number} x X-coordinate of top-left corner.
     * @param {number} y Y-coordinate of top-left corner.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     * @param {string} imageData Image URL or data URI string.
     *
     * @example
     * const img = new ImageShape(10, 20, 200, 150, 'data:image/png;base64,...');
     */
    constructor(x, y, width, height, imageData) {
        super(x, y, width, height);
        this.type = 'image';
        /** @type {string} Image URL or data URI. */
        this.imageData = imageData;
        /** @type {Image|null} Loaded image object. */
        this.image = null;
        /** @type {boolean} Whether the image has finished loading. */
        this.loaded = false;
        /** @type {number} Opacity value between 0 and 1. */
        this.opacity = 1.0;

        if (imageData) {
            this.loadImage(imageData);
        }
    }

    /**
     * Loads an image from a URL or data URI.
     *
     * Sets the `loaded` flag to true when the image finishes loading.
     *
     * @param {string} imageData Image URL or data URI string.
     * @private
     */
    loadImage(imageData) {
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
        };
        this.image.src = imageData;
    }

    /**
     * Draws the image shape on the canvas.
     *
     * Only renders if the image has finished loading. Applies opacity and optional border.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     */
    draw(ctx) {
        if (!this.visible || !this.loaded || !this.image) return;

        ctx.save();
        this.applyRotation(ctx);
        this.applyShadow(ctx);

        ctx.globalAlpha = this.opacity;

        // Draw image
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        // Draw border if stroke is set
        if (this.stroke && this.stroke !== 'transparent') {
            ctx.strokeStyle = this.stroke;
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        ctx.globalAlpha = 1.0;
        this.clearShadow(ctx);
        ctx.restore();
    }

    toJSON() {
        return {
            ...super.toJSON(),
            imageData: this.imageData,
            opacity: this.opacity
        };
    }
}
