/**
 * @module shapes/TextShape
 * @description Text diagram shape for rendering labels and annotations. Extends BaseShape to provide text rendering capabilities.
 *
 * @remarks
 * - Supports multi-line text via newline characters.
 * - Text alignment (left, center, right) and baseline positioning are configurable.
 * - Font family, size, weight, and style are customizable.
 *
 * @example
 * const text = new TextShape(10, 20, 'Hello World');
 * text.fontSize = 20;
 * text.textAlign = 'center';
 * text.draw(ctx);
 *
 * @see module:core/BaseShape
 */

import { BaseShape } from '../core/BaseShape.js';

/**
 * Represents a text diagram shape.
 *
 * @class
 * @extends BaseShape
 */
export class TextShape extends BaseShape {
    /**
     * Creates a new TextShape instance.
     *
     * @param {number} x X-coordinate of top-left corner.
     * @param {number} y Y-coordinate of top-left corner.
     * @param {string} [text='Text'] Text content to display.
     *
     * @example
     * const text = new TextShape(10, 20, 'Label');
     */
    constructor(x, y, text = 'Text') {
        super(x, y, 100, 30);
        this.type = 'text';
        /** @type {string} Text content to display. Supports multi-line via newlines. */
        this.text = text;
        /** @type {number} Font size in pixels. */
        this.fontSize = 16;
        /** @type {string} Font family name. */
        this.fontFamily = 'Arial';
        /** @type {string} Font weight: 'normal' or 'bold'. */
        this.fontWeight = 'normal';
        /** @type {string} Font style: 'normal' or 'italic'. */
        this.fontStyle = 'normal';
        /** @type {string} Text alignment: 'left', 'center', or 'right'. */
        this.textAlign = 'center';
        /** @type {string} Text baseline: 'top', 'middle', or 'bottom'. */
        this.textBaseline = 'middle';
        /** @type {string} Text color in hex format. */
        this.fill = '#000000';
        /** @type {string} Stroke color (usually transparent for text). */
        this.stroke = 'transparent';
    }

    /**
     * Draws the text shape on the canvas.
     *
     * Supports multi-line text by splitting on newline characters. Centers all lines vertically within the shape bounds.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     */
    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
        this.applyRotation(ctx);

        ctx.fillStyle = this.fill;
        ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;

        // Apply shadow to text
        if (this.shadow) {
            this.applyShadow(ctx);
        }

        // Split text by newlines for multi-line support
        const lines = this.text.split('\n');
        const lineHeight = this.fontSize * 1.2;

        // Calculate starting Y position to center all lines
        const totalHeight = lines.length * lineHeight;
        let startY = this.y + this.height / 2 - totalHeight / 2 + lineHeight / 2;

        lines.forEach((line, index) => {
            const textX = this.textAlign === 'center' ? this.x + this.width / 2 :
                         this.textAlign === 'right' ? this.x + this.width : this.x;
            const textY = startY + index * lineHeight;

            ctx.fillText(line, textX, textY);
        });

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
