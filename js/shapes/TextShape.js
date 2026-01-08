import { BaseShape } from '../core/BaseShape.js';

export class TextShape extends BaseShape {
    constructor(x, y, text = 'Text') {
        super(x, y, 100, 30);
        this.type = 'text';
        this.text = text;
        this.fontSize = 16;
        this.fontFamily = 'Arial';
        this.fontWeight = 'normal';
        this.fontStyle = 'normal';
        this.textAlign = 'center';
        this.textBaseline = 'middle';
        this.fill = '#000000'; // Text color
        this.stroke = 'transparent';
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();

        ctx.fillStyle = this.fill;
        ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;

        const textX = this.textAlign === 'center' ? this.x + this.width / 2 :
                     this.textAlign === 'right' ? this.x + this.width : this.x;
        const textY = this.y + this.height / 2;

        // Apply shadow to text
        if (this.shadow) {
            this.applyShadow(ctx);
        }

        ctx.fillText(this.text, textX, textY);

        this.clearShadow(ctx);
        ctx.restore();
    }

    toJSON() {
        return {
            ...super.toJSON(),
            text: this.text,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            fontWeight: this.fontWeight,
            fontStyle: this.fontStyle,
            textAlign: this.textAlign,
            textBaseline: this.textBaseline
        };
    }
}
