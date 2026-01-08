// Base class for all shapes
export class BaseShape {
    constructor(x, y, width, height) {
        this.id = this.generateId();
        this.type = 'base';
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fill = '#3498db';
        this.stroke = '#2c3e50';
        this.strokeWidth = 2;
        this.rotation = 0;
        this.shadow = false;
        this.shadowBlur = 10;
        this.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.shadowOffsetX = 3;
        this.shadowOffsetY = 3;
        this.zIndex = 0;
        this.locked = false;
        this.visible = true;
        this.groupId = null;
    }

    generateId() {
        return 'shape_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get bounding box for hit detection
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    // Check if point is inside shape
    containsPoint(x, y) {
        const bounds = this.getBounds();
        return x >= bounds.x && x <= bounds.x + bounds.width &&
               y >= bounds.y && y <= bounds.y + bounds.height;
    }

    // Rotate a point around the shape's center
    rotatePoint(x, y) {
        if (!this.rotation || this.rotation === 0) {
            return { x, y };
        }

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Translate point to origin
        const tx = x - cx;
        const ty = y - cy;

        // Rotate
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

    // Get rotated bounding box corners
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

    // Get anchor points for connections
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

    // Move shape by delta
    move(dx, dy) {
        if (!this.locked) {
            this.x += dx;
            this.y += dy;
        }
    }

    // Resize shape
    resize(width, height) {
        if (!this.locked) {
            this.width = width;
            this.height = height;
        }
    }

    // Apply rotation transform around center
    applyRotation(ctx) {
        if (this.rotation && this.rotation !== 0) {
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;
            ctx.translate(cx, cy);
            ctx.rotate(this.rotation);
            ctx.translate(-cx, -cy);
        }
    }

    // Apply shadow if enabled
    applyShadow(ctx) {
        if (this.shadow) {
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowColor = this.shadowColor;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }
    }

    // Clear shadow
    clearShadow(ctx) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    // Draw shape (to be overridden by subclasses)
    draw(ctx) {
        throw new Error('draw() must be implemented by subclass');
    }

    // Clone shape
    clone() {
        const cloned = Object.create(Object.getPrototypeOf(this));
        Object.assign(cloned, JSON.parse(JSON.stringify(this)));
        cloned.id = this.generateId();
        return cloned;
    }

    // Serialize to JSON
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

    // Restore from JSON
    static fromJSON(data) {
        const shape = new this(data.x, data.y, data.width, data.height);
        Object.assign(shape, data);
        return shape;
    }
}
