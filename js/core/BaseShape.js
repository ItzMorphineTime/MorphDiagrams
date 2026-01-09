/**
 * Base class for all drawable shapes in the canvas.
 * Provides common properties and methods for shape management, rendering, and interaction.
 * All specific shape classes (Rectangle, Server, NetworkSwitch, etc.) extend this base class.
 * @class BaseShape
 */
export class BaseShape {
    /**
     * Creates a new BaseShape instance.
     * @param {number} x - The x-coordinate of the shape's top-left corner
     * @param {number} y - The y-coordinate of the shape's top-left corner
     * @param {number} width - The width of the shape in pixels
     * @param {number} height - The height of the shape in pixels
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
     * @returns {string} Unique ID combining timestamp and random string
     */
    generateId() {
        return 'shape_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Gets the bounding box of the shape for hit detection.
     * @returns {{x: number, y: number, width: number, height: number}} Bounding box coordinates and dimensions
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
     * @param {number} x - X-coordinate of the point to test
     * @param {number} y - Y-coordinate of the point to test
     * @returns {boolean} True if point is inside shape bounds
     */
    containsPoint(x, y) {
        const bounds = this.getBounds();
        return x >= bounds.x && x <= bounds.x + bounds.width &&
               y >= bounds.y && y <= bounds.y + bounds.height;
    }

    /**
     * Rotates a point around the shape's center based on the shape's rotation.
     * Uses standard 2D rotation matrix transformation.
     * @param {number} x - X-coordinate of the point to rotate
     * @param {number} y - Y-coordinate of the point to rotate
     * @returns {{x: number, y: number}} Rotated point coordinates
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
     * @returns {Array<{x: number, y: number}>} Array of four corner points
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
     * Returns points at top, right, bottom, left edges and center.
     * Anchor points are automatically rotated if the shape is rotated.
     * Subclasses override this to provide port-specific anchor points.
     * @returns {Object<string, {x: number, y: number}>} Dictionary of anchor points keyed by position name
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
     * Movement is prevented if the shape is locked.
     * @param {number} dx - Change in x position
     * @param {number} dy - Change in y position
     */
    move(dx, dy) {
        if (!this.locked) {
            this.x += dx;
            this.y += dy;
        }
    }

    /**
     * Resizes the shape to new dimensions.
     * Resizing is prevented if the shape is locked.
     * @param {number} width - New width in pixels
     * @param {number} height - New height in pixels
     */
    resize(width, height) {
        if (!this.locked) {
            this.width = width;
            this.height = height;
        }
    }

    /**
     * Applies rotation transformation to the canvas context.
     * Rotates around the shape's center point.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
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
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
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
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    clearShadow(ctx) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the shape on the canvas. Must be overridden by subclasses.
     * @abstract
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @throws {Error} If not implemented by subclass
     */
    draw(ctx) {
        throw new Error('draw() must be implemented by subclass');
    }

    /**
     * Creates a deep copy of the shape with a new unique ID.
     * @returns {BaseShape} Cloned shape instance
     */
    clone() {
        const cloned = Object.create(Object.getPrototypeOf(this));
        Object.assign(cloned, JSON.parse(JSON.stringify(this)));
        cloned.id = this.generateId();
        return cloned;
    }

    /**
     * Serializes the shape to a JSON-compatible object for saving.
     * @returns {Object} JSON representation of the shape
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
     * @static
     * @param {Object} data - JSON data containing shape properties
     * @returns {BaseShape} Restored shape instance
     */
    static fromJSON(data) {
        const shape = new this(data.x, data.y, data.width, data.height);
        Object.assign(shape, data);
        return shape;
    }
}
