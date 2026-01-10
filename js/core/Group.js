/**
 * @module core/Group
 * @description Core diagram module for `Group`.
 *
 * @see module:core/BaseShape
 *
 * @example
 * import { Group } from './core/Group.js';
 */

// Group class for managing multiple shapes together
/**
 * `Group` core module for MorphDiagrams.
 *
 * @class Group
 *
 * @example
 * const instance = new Group(10);
 */
export class Group {
    /**
     * Creates a new `Group` instance.
     * @param {*} shapes shapes value.
     */
    constructor(shapes = []) {
        this.id = this.generateId();
        this.type = 'group';
        this.shapes = shapes;
        this.locked = false;
    }

    /**
     * Performs `generateId`.
     */
    generateId() {
        return 'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Performs `addShape`.
     * @param {Event} shape shape value.
     */
    addShape(shape) {
        if (!this.shapes.includes(shape)) {
            this.shapes.push(shape);
        }
    }

    /**
     * Performs `removeShape`.
     * @param {Event} shape shape value.
     */
    removeShape(shape) {
        this.shapes = this.shapes.filter(s => s !== shape);
    }

    /**
     * Returns the object's bounding box in canvas coordinates.
     * @returns {*} Result value.
     */
    getBounds() {
        if (this.shapes.length === 0) return null;

        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        for (const shape of this.shapes) {
            const bounds = shape.getBounds();
            minX = Math.min(minX, bounds.x);
            minY = Math.min(minY, bounds.y);
            maxX = Math.max(maxX, bounds.x + bounds.width);
            maxY = Math.max(maxY, bounds.y + bounds.height);
        }

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    /**
     * Performs `move`.
     * @param {number} dx dx value.
     * @param {number} dy dy value.
     */
    move(dx, dy) {
        if (!this.locked) {
            for (const shape of this.shapes) {
                shape.move(dx, dy);
            }
        }
    }

    /**
     * Checks whether a point lies within the object's bounds.
     * @param {number} x X position in canvas coordinates.
     * @param {number} y Y position in canvas coordinates.
     * @returns {*} Result value.
     */
    containsPoint(x, y) {
        for (const shape of this.shapes) {
            if (shape.containsPoint(x, y)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Draws the object using the provided canvas context.
     * @param {number} ctx ctx value.
     */
    draw(ctx) {
        for (const shape of this.shapes) {
            shape.draw(ctx);
        }

        // Draw group outline when needed
        if (this.showOutline) {
            const bounds = this.getBounds();
            if (bounds) {
                ctx.save();
                ctx.strokeStyle = '#9b59b6';
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 5]);
                ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10);
                ctx.setLineDash([]);
                ctx.restore();
            }
        }
    }

    /**
     * Serializes the object to a JSON-compatible structure.
     * @returns {*} Result value.
     */
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            shapes: this.shapes.map(s => s.id),
            locked: this.locked
        };
    }
}
