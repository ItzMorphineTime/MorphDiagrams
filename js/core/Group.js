/**
 * @module core/Group
 * @description Group class for managing multiple shapes together. Enables moving, selecting, and transforming multiple shapes as a unit.
 *
 * @remarks
 * - Groups are used to treat multiple shapes as a single unit.
 * - Groups maintain bounds that encompass all member shapes.
 * - Shapes can be added or removed from groups dynamically.
 *
 * @example
 * const group = new Group([shape1, shape2, shape3]);
 * group.move(10, 20); // Moves all shapes in the group
 *
 * @see module:core/BaseShape
 */

/**
 * Group class for managing multiple shapes together.
 *
 * @class
 */
export class Group {
    /**
     * Creates a new Group instance.
     *
     * @param {Array<Object>} [shapes=[]] Array of shape objects to include in the group.
     *
     * @example
     * const group = new Group([rect1, circle1, text1]);
     */
    constructor(shapes = []) {
        this.id = this.generateId();
        this.type = 'group';
        this.shapes = shapes;
        this.locked = false;
    }

    /**
     * Generates a unique identifier for the group.
     *
     * @returns {string} Unique ID combining timestamp and random string.
     *
     * @private
     */
    generateId() {
        return 'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Adds a shape to the group.
     *
     * @param {Object} shape Shape object to add to the group.
     *
     * @example
     * group.addShape(newShape);
     */
    addShape(shape) {
        if (!this.shapes.includes(shape)) {
            this.shapes.push(shape);
        }
    }

    /**
     * Removes a shape from the group.
     *
     * @param {Object} shape Shape object to remove from the group.
     *
     * @example
     * group.removeShape(shapeToRemove);
     */
    removeShape(shape) {
        this.shapes = this.shapes.filter(s => s !== shape);
    }

    /**
     * Gets the bounding box that encompasses all shapes in the group.
     *
     * @returns {{x:number, y:number, width:number, height:number}|null} Bounding box or null if group is empty.
     *
     * @example
     * const bounds = group.getBounds();
     * if (bounds) console.log(`Group bounds: ${bounds.width}x${bounds.height}`);
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
     * Moves all shapes in the group by a delta amount.
     *
     * Movement is prevented if the group is locked.
     *
     * @param {number} dx Change in x position.
     * @param {number} dy Change in y position.
     *
     * @example
     * group.move(10, 20); // Moves all shapes 10px right, 20px down
     */
    move(dx, dy) {
        if (!this.locked) {
            for (const shape of this.shapes) {
                shape.move(dx, dy);
            }
        }
    }

    /**
     * Checks if a point is inside any shape in the group.
     *
     * @param {number} x X-coordinate of the point to test.
     * @param {number} y Y-coordinate of the point to test.
     * @returns {boolean} True if point is inside any shape in the group.
     *
     * @example
     * if (group.containsPoint(50, 30)) {
     *   console.log('Point is inside group');
     * }
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
     * Draws all shapes in the group on the canvas.
     *
     * Optionally draws a group outline if `showOutline` is enabled.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     *
     * @example
     * group.draw(ctx);
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
     * Serializes the group to a JSON-compatible object for saving.
     *
     * Stores shape IDs instead of shape references for proper serialization.
     *
     * @returns {Object} JSON representation of the group.
     *
     * @example
     * const json = group.toJSON();
     * // json.shapes contains array of shape IDs
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
