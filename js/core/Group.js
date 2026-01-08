// Group class for managing multiple shapes together
export class Group {
    constructor(shapes = []) {
        this.id = this.generateId();
        this.type = 'group';
        this.shapes = shapes;
        this.locked = false;
    }

    generateId() {
        return 'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    addShape(shape) {
        if (!this.shapes.includes(shape)) {
            this.shapes.push(shape);
        }
    }

    removeShape(shape) {
        this.shapes = this.shapes.filter(s => s !== shape);
    }

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

    move(dx, dy) {
        if (!this.locked) {
            for (const shape of this.shapes) {
                shape.move(dx, dy);
            }
        }
    }

    containsPoint(x, y) {
        for (const shape of this.shapes) {
            if (shape.containsPoint(x, y)) {
                return true;
            }
        }
        return false;
    }

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

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            shapes: this.shapes.map(s => s.id),
            locked: this.locked
        };
    }
}
