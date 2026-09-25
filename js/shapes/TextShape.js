/**
 * @module shapes/TextShape
 * @description Free-standing (multi-line) text block.
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

export class TextShape extends BaseShape {
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} [text='Text']
     */
    constructor(x, y, text = 'Text') {
        super(x, y, 100, 30);
        this.type = 'text';
        /** @type {string} Text content; `\n` starts a new line */
        this.text = text;
        this.fontSize = 16;
        this.fontFamily = 'Arial';
        this.fontWeight = 'normal';
        this.fontStyle = 'normal';
        /** @type {("left"|"center"|"right")} */
        this.textAlign = 'center';
        this.textBaseline = 'middle';
        /** Text colour (fill) */
        this.fill = '#000000';
        this.stroke = 'transparent';
    }

    /**
     * CSS font shorthand for this text.
     * @returns {string}
     */
    getFont() {
        return `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    }

    /**
     * Lines and their positions (shared with the SVG exporter).
     * @returns {{lines:string[], x:number, firstY:number, lineHeight:number}}
     */
    getTextLayout() {
        const b = this.getBounds();
        const lines = String(this.text ?? '').split('\n');
        const lineHeight = this.fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const firstY = b.y + b.height / 2 - totalHeight / 2 + lineHeight / 2;
        const x = this.textAlign === 'center' ? b.x + b.width / 2 :
            this.textAlign === 'right' ? b.x + b.width : b.x;
        return { lines, x, firstY, lineHeight };
    }

    /** Text shapes have no separate label. @returns {null} */
    getLabelLayout() {
        return null;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        if (!this.visible) return;
        ctx.save();
        this.applyRotation(ctx);
        ctx.fillStyle = this.fill;
        ctx.font = this.getFont();
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        if (this.shadow) this.applyShadow(ctx);

        const layout = this.getTextLayout();
        layout.lines.forEach((line, index) => {
            ctx.fillText(line, layout.x, layout.firstY + index * layout.lineHeight);
        });

        this.clearShadow(ctx);
        ctx.restore();
    }

    /** @returns {Object} */
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
