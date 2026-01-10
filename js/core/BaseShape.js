/**
 * @module core/BaseShape
 * @description Base class for all drawable shapes in the canvas. Provides common properties and methods for shape management, rendering, and interaction.
 *
 * @remarks
 * - All specific shape classes (Rectangle, Server, NetworkSwitch, etc.) extend this base class.
 * - Shapes should implement the `draw()` method to render themselves.
 * - Geometry operations (move, resize, rotate) are handled by this base class.
 *
 * @example
 * const shape = new BaseShape(10, 20, 100, 60);
 * shape.setSelected(true);
 * shape.draw(ctx);
 *
 * @see module:shapes/Rectangle
 * @see module:core/Connector
 */

/**
 * Base class for all drawable shapes in the canvas.
 *
 * @class
 * @extends Object
 */
export class BaseShape {
    /**
     * Creates a new BaseShape instance.
     *
     * @param {number} x X-coordinate of the shape's top-left corner in canvas coordinates.
     * @param {number} y Y-coordinate of the shape's top-left corner in canvas coordinates.
     * @param {number} width Width of the shape in pixels.
     * @param {number} height Height of the shape in pixels.
     *
     * @example
     * const shape = new BaseShape(10, 20, 100, 60);
     */
    constructor(x, y, width, height) {
        /** @type {string} Unique identifier for the shape */
        this.id = this.generateId();
        /** @type {string} Type identifier for the shape (overridden by subclasses) */
        this.type = 'base';
        /** @type {number} X-coordinate of the shape's top-left corner */
        this.x = x;
        /** @type {number} Y-coordinate of the shape's top-left corner */
        this.y = y;
        /** @type {number} Width of the shape in pixels */
        this.width = width;
        /** @type {number} Height of the shape in pixels */
        this.height = height;
        /** @type {string} Fill color in hex format */
        this.fill = '#3498db';
        /** @type {string} Stroke color in hex format */
        this.stroke = '#2c3e50';
        /** @type {number} Width of the stroke in pixels */
        this.strokeWidth = 2;
        /** @type {number} Rotation angle in radians */
        this.rotation = 0;
        /** @type {boolean} Whether shadow rendering is enabled */
        this.shadow = false;
        /** @type {number} Shadow blur radius in pixels */
        this.shadowBlur = 10;
        /** @type {string} Shadow color in rgba format */
        this.shadowColor = 'rgba(0, 0, 0, 0.3)';
        /** @type {number} Shadow horizontal offset in pixels */
        this.shadowOffsetX = 3;
        /** @type {number} Shadow vertical offset in pixels */
        this.shadowOffsetY = 3;
        /** @type {number} Z-index for rendering order (higher values render on top) */
        this.zIndex = 0;
        /** @type {boolean} Whether the shape is locked from editing */
        this.locked = false;
        /** @type {boolean} Whether the shape is visible on canvas */
        this.visible = true;
        /** @type {string|null} Group identifier for grouped shapes */
        this.groupId = null;
    }

    /**
     * Generates a unique identifier for the shape.
     *
     * @returns {string} Unique ID combining timestamp and random string.
     *
     * @example
     * const id = shape.generateId(); // Returns something like 'shape_1234567890_abc123xyz'
     */
    generateId() {
        return 'shape_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Gets the bounding box of the shape for hit detection.
     *
     * @returns {{x:number, y:number, width:number, height:number}} Bounding box coordinates and dimensions.
     *
     * @example
     * const bounds = shape.getBounds();
     * console.log(`Shape at (${bounds.x}, ${bounds.y}) size ${bounds.width}x${bounds.height}`);
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Checks if a point is inside the shape's bounds.
     *
     * @param {number} x X-coordinate of the point to test.
     * @param {number} y Y-coordinate of the point to test.
     * @returns {boolean} True if point is inside shape bounds.
     *
     * @example
     * if (shape.containsPoint(50, 30)) {
     *   console.log('Point is inside shape');
     * }
     */
    containsPoint(x, y) {
        const bounds = this.getBounds();
        return x >= bounds.x && x <= bounds.x + bounds.width &&
               y >= bounds.y && y <= bounds.y + bounds.height;
    }

    /**
     * Rotates a point around the shape's center based on the shape's rotation angle.
     *
     * Uses standard 2D rotation matrix transformation. If the shape has no rotation,
     * returns the original coordinates unchanged.
     *
     * @param {number} x X-coordinate of the point to rotate.
     * @param {number} y Y-coordinate of the point to rotate.
     * @returns {{x:number, y:number}} Rotated point coordinates.
     *
     * @example
     * const rotated = shape.rotatePoint(100, 50);
     */
    rotatePoint(x, y) {
        if (!this.rotation || this.rotation === 0) {
            return { x, y };
        }

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Translate point to origin
        const tx = x - cx;
        const ty = y - cy;

        // Rotate using 2D rotation matrix
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        const rx = tx * cos - ty * sin;
        const ry = tx * sin + ty * cos;

        // Translate back
        return {
            x: rx + cx,
            y: ry + cy
        };
    }

    /**
     * Gets the four corners of the shape's bounding box after rotation is applied.
     *
     * @returns {Array<{x:number, y:number}>} Array of four corner points.
     *
     * @example
     * const corners = shape.getRotatedBounds();
     * // corners = [{x:0, y:0}, {x:100, y:0}, {x:100, y:60}, {x:0, y:60}]
     */
    getRotatedBounds() {
        const corners = [
            { x: this.x, y: this.y },
            { x: this.x + this.width, y: this.y },
            { x: this.x + this.width, y: this.y + this.height },
            { x: this.x, y: this.y + this.height }
        ];

        if (this.rotation && this.rotation !== 0) {
            return corners.map(corner => this.rotatePoint(corner.x, corner.y));
        }

        return corners;
    }

    /**
     * Gets anchor points for connecting lines to this shape.
     *
     * Returns points at top, right, bottom, left edges and center. Anchor points
     * are automatically rotated if the shape is rotated. Subclasses override this
     * to provide port-specific anchor points.
     *
     * @returns {Object<string, {x:number, y:number}>} Dictionary of anchor points keyed by position name (top, right, bottom, left, center).
     *
     * @example
     * const anchors = shape.getAnchorPoints();
     * const topPoint = anchors.top; // {x: 50, y: 0}
     */
    getAnchorPoints() {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        const anchors = {
            top: { x: cx, y: this.y },
            right: { x: this.x + this.width, y: cy },
            bottom: { x: cx, y: this.y + this.height },
            left: { x: this.x, y: cy },
            center: { x: cx, y: cy }
        };

        // Rotate anchor points if shape is rotated
        if (this.rotation && this.rotation !== 0) {
            Object.keys(anchors).forEach(key => {
                const rotated = this.rotatePoint(anchors[key].x, anchors[key].y);
                anchors[key] = rotated;
            });
        }

        return anchors;
    }

    /**
     * Moves the shape by a delta amount in x and y directions.
     *
     * Movement is prevented if the shape is locked.
     *
     * @param {number} dx Change in x position.
     * @param {number} dy Change in y position.
     *
     * @example
     * shape.move(10, 20); // Moves shape 10 pixels right, 20 pixels down
     */
    move(dx, dy) {
        if (!this.locked) {
            this.x += dx;
            this.y += dy;
        }
    }

    /**
     * Resizes the shape to new dimensions.
     *
     * Resizing is prevented if the shape is locked.
     *
     * @param {number} width New width in pixels.
     * @param {number} height New height in pixels.
     *
     * @example
     * shape.resize(200, 100); // Sets shape to 200x100 pixels
     */
    resize(width, height) {
        if (!this.locked) {
            this.width = width;
            this.height = height;
        }
    }

    /**
     * Applies rotation transformation to the canvas context.
     *
     * Rotates around the shape's center point. This should be called before drawing
     * the shape to apply rotation visually.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     *
     * @example
     * ctx.save();
     * shape.applyRotation(ctx);
     * // Draw shape content here
     * ctx.restore();
     */
    applyRotation(ctx) {
        if (this.rotation && this.rotation !== 0) {
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;
            ctx.translate(cx, cy);
            ctx.rotate(this.rotation);
            ctx.translate(-cx, -cy);
        }
    }

    /**
     * Applies shadow effects to the canvas context if shadow is enabled.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     *
     * @example
     * shape.applyShadow(ctx);
     * // Subsequent drawing operations will have shadow
     */
    applyShadow(ctx) {
        if (this.shadow) {
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowColor = this.shadowColor;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }
    }

    /**
     * Clears shadow effects from the canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     */
    clearShadow(ctx) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the shape on the canvas.
     *
     * Must be overridden by subclasses to provide shape-specific rendering logic.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @throws {Error} If not implemented by subclass.
     *
     * @example
     * // In subclass:
     * draw(ctx) {
     *   ctx.fillRect(this.x, this.y, this.width, this.height);
     * }
     */
    draw(ctx) {
        throw new Error('draw() must be implemented by subclass');
    }

    /**
     * Creates a deep copy of the shape with a new unique ID.
     *
     * @returns {BaseShape} Cloned shape instance.
     *
     * @example
     * const cloned = shape.clone();
     * cloned.id !== shape.id; // true - new ID assigned
     */
    clone() {
        const cloned = Object.create(Object.getPrototypeOf(this));
        Object.assign(cloned, JSON.parse(JSON.stringify(this)));
        cloned.id = this.generateId();
        return cloned;
    }

    /**
     * Serializes the shape to a JSON-compatible object for saving.
     *
     * @returns {Object} JSON representation of the shape with all properties.
     *
     * @example
     * const json = shape.toJSON();
     * localStorage.setItem('shape', JSON.stringify(json));
     */
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fill: this.fill,
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            rotation: this.rotation,
            shadow: this.shadow,
            shadowBlur: this.shadowBlur,
            shadowColor: this.shadowColor,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            zIndex: this.zIndex,
            locked: this.locked,
            visible: this.visible,
            groupId: this.groupId
        };
    }

    /**
     * Restores a shape from a JSON object.
     *
     * @static
     * @param {Object} data JSON data containing shape properties.
     * @param {number} data.x X-coordinate.
     * @param {number} data.y Y-coordinate.
     * @param {number} data.width Width.
     * @param {number} data.height Height.
     * @returns {BaseShape} Restored shape instance.
     *
     * @example
     * const json = JSON.parse(localStorage.getItem('shape'));
     * const restored = BaseShape.fromJSON(json);
     */
    static fromJSON(data) {
        const shape = new this(data.x, data.y, data.width, data.height);
        Object.assign(shape, data);
        return shape;
    }
}
