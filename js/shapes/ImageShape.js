/**
 * @module shapes/ImageShape
 * @description Diagram shape implementation for `ImageShape`.
 *
 * @see module:core/BaseShape
 * @see module:core/Connector
 *
 * @example
 * import { ImageShape } from './shapes/ImageShape.js';
 */

import { BaseShape } from '../core/BaseShape.js';
/**
 * `ImageShape` shape for MorphDiagrams.
 *
 * @class ImageShape
 * @extends BaseShape
 *
 * @example
 * const instance = new ImageShape(10, 20, 30, 40, 50);
 */

export class ImageShape extends BaseShape {
    /**
     * Creates a new `ImageShape` instance.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @param {number} width Width in pixels.
     * @param {number} height Height in pixels.
     * @param {*} imageData imageData value.
     */
    constructor(x, y, width, height, imageData) {
        super(x, y, width, height);
        this.type = 'image';
        this.imageData = imageData;
        this.image = null;
        this.loaded = false;
        this.opacity = 1.0;

        if (imageData) {
            this.loadImage(imageData);
        }
    }

    /**
     * Performs `loadImage`.
     * @param {*} imageData imageData value.
     */
    loadImage(imageData) {
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
        };
        this.image.src = imageData;
    }

    /**
     * Draws the object using the provided canvas context.
     * @param {number} ctx ctx value.
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

    /**
     * Serializes the object to a JSON-compatible structure.
     * @returns {*} Result value.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            imageData: this.imageData,
            opacity: this.opacity
        };
    }
}
