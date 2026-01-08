import { BaseShape } from '../core/BaseShape.js';

export class ImageShape extends BaseShape {
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

    loadImage(imageData) {
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
        };
        this.image.src = imageData;
    }

    draw(ctx) {
        if (!this.visible || !this.loaded || !this.image) return;

        ctx.save();
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
