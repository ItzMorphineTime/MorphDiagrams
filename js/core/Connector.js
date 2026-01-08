// Base connector class
export class Connector {
    constructor(startObject, startAnchor, endObject, endAnchor, connectionType = null) {
        this.id = this.generateId();
        this.type = 'connector';
        this.startObject = startObject;
        this.startAnchor = startAnchor || 'center';
        this.endObject = endObject;
        this.endAnchor = endAnchor || 'center';
        this.stroke = '#2c3e50';
        this.strokeWidth = 2;
        this.arrowStart = false;
        this.arrowEnd = true;
        this.style = 'straight'; // straight, orthogonal, bezier, polyline
        this.zIndex = -1; // Connectors below shapes by default
        this.visible = true;
        this.selected = false;

        // Connection type for custom network objects (video, sdi, network, usb)
        this.connectionType = connectionType;

        // For polyline connectors
        this.waypoints = [];

        // For bezier connectors
        this.controlPoint1 = null;
        this.controlPoint2 = null;
    }

    generateId() {
        return 'conn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getStartPoint() {
        if (!this.startObject) return null;
        const anchors = this.startObject.getAnchorPoints();
        return anchors[this.startAnchor] || anchors.center;
    }

    getEndPoint() {
        if (!this.endObject) return null;
        const anchors = this.endObject.getAnchorPoints();
        return anchors[this.endAnchor] || anchors.center;
    }

    // Check if point is near the connector line
    containsPoint(x, y, threshold = 5) {
        const start = this.getStartPoint();
        const end = this.getEndPoint();

        if (!start || !end) return false;

        if (this.style === 'polyline' && this.waypoints.length > 0) {
            return this.isNearPolyline(x, y, threshold);
        } else if (this.style === 'bezier') {
            return this.isNearBezier(x, y, threshold);
        } else if (this.style === 'orthogonal') {
            return this.isNearOrthogonal(x, y, threshold);
        } else {
            return this.isNearLine(start, end, x, y, threshold);
        }
    }

    isNearLine(p1, p2, x, y, threshold) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length === 0) return Math.sqrt((x - p1.x) ** 2 + (y - p1.y) ** 2) <= threshold;

        const t = Math.max(0, Math.min(1, ((x - p1.x) * dx + (y - p1.y) * dy) / (length * length)));
        const projX = p1.x + t * dx;
        const projY = p1.y + t * dy;

        const distance = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);
        return distance <= threshold;
    }

    isNearPolyline(x, y, threshold) {
        const start = this.getStartPoint();
        const end = this.getEndPoint();

        const points = [start, ...this.waypoints, end];

        for (let i = 0; i < points.length - 1; i++) {
            if (this.isNearLine(points[i], points[i + 1], x, y, threshold)) {
                return true;
            }
        }

        return false;
    }

    isNearOrthogonal(x, y, threshold) {
        const start = this.getStartPoint();
        const end = this.getEndPoint();

        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        let points;
        if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
            points = [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
        } else {
            points = [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end];
        }

        for (let i = 0; i < points.length - 1; i++) {
            if (this.isNearLine(points[i], points[i + 1], x, y, threshold)) {
                return true;
            }
        }

        return false;
    }

    isNearBezier(x, y, threshold) {
        const start = this.getStartPoint();
        const end = this.getEndPoint();

        // Sample points along bezier curve
        const samples = 20;
        for (let i = 0; i < samples; i++) {
            const t = i / samples;
            const point = this.getBezierPoint(t);
            const nextPoint = this.getBezierPoint((i + 1) / samples);

            if (this.isNearLine(point, nextPoint, x, y, threshold)) {
                return true;
            }
        }

        return false;
    }

    getBezierPoint(t) {
        const start = this.getStartPoint();
        const end = this.getEndPoint();

        const cp1 = this.controlPoint1 || this.getDefaultControlPoint1();
        const cp2 = this.controlPoint2 || this.getDefaultControlPoint2();

        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
        const t2 = t * t;
        const t3 = t2 * t;

        return {
            x: start.x * mt3 + 3 * cp1.x * mt2 * t + 3 * cp2.x * mt * t2 + end.x * t3,
            y: start.y * mt3 + 3 * cp1.y * mt2 * t + 3 * cp2.y * mt * t2 + end.y * t3
        };
    }

    getDefaultControlPoint1() {
        const start = this.getStartPoint();
        const end = this.getEndPoint();
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        return {
            x: start.x + dx * 0.25,
            y: start.y + dy * 0.25 - Math.abs(dx) * 0.2
        };
    }

    getDefaultControlPoint2() {
        const start = this.getStartPoint();
        const end = this.getEndPoint();
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        return {
            x: start.x + dx * 0.75,
            y: start.y + dy * 0.75 + Math.abs(dx) * 0.2
        };
    }

    draw(ctx) {
        if (!this.visible) return;

        const start = this.getStartPoint();
        const end = this.getEndPoint();

        if (!start || !end) return;

        ctx.save();
        ctx.strokeStyle = this.selected ? '#0066cc' : this.stroke;
        ctx.lineWidth = this.selected ? this.strokeWidth + 1 : this.strokeWidth;
        ctx.fillStyle = this.stroke;

        // Draw based on style
        switch (this.style) {
            case 'polyline':
                this.drawPolyline(ctx, start, end);
                break;
            case 'orthogonal':
                this.drawOrthogonal(ctx, start, end);
                break;
            case 'bezier':
                this.drawBezier(ctx, start, end);
                break;
            default:
                this.drawStraight(ctx, start, end);
        }

        // Draw arrows
        if (this.arrowStart) {
            if (this.style === 'bezier') {
                const tangent = this.getBezierTangentAtStart();
                this.drawArrowWithAngle(ctx, start, tangent);
            } else {
                this.drawArrow(ctx, this.getArrowStartPoint(), start, true);
            }
        }
        if (this.arrowEnd) {
            if (this.style === 'bezier') {
                const tangent = this.getBezierTangentAtEnd();
                this.drawArrowWithAngle(ctx, end, tangent);
            } else {
                this.drawArrow(ctx, this.getArrowEndPoint(), end, false);
            }
        }

        // Draw waypoints if selected
        if (this.selected && this.style === 'polyline') {
            this.drawWaypoints(ctx);
        }

        // Draw control points if bezier and selected
        if (this.selected && this.style === 'bezier') {
            this.drawControlPoints(ctx);
        }

        ctx.restore();
    }

    drawStraight(ctx, start, end) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    drawPolyline(ctx, start, end) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        for (const waypoint of this.waypoints) {
            ctx.lineTo(waypoint.x, waypoint.y);
        }

        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    drawOrthogonal(ctx, start, end) {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
            ctx.lineTo(midX, start.y);
            ctx.lineTo(midX, end.y);
        } else {
            ctx.lineTo(start.x, midY);
            ctx.lineTo(end.x, midY);
        }

        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    drawBezier(ctx, start, end) {
        const cp1 = this.controlPoint1 || this.getDefaultControlPoint1();
        const cp2 = this.controlPoint2 || this.getDefaultControlPoint2();

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
        ctx.stroke();
    }

    getArrowStartPoint() {
        if (this.style === 'polyline' && this.waypoints.length > 0) {
            return this.waypoints[0];
        } else if (this.style === 'orthogonal') {
            return this.getOrthogonalStartArrowPoint();
        }
        return this.getEndPoint();
    }

    getArrowEndPoint() {
        if (this.style === 'polyline' && this.waypoints.length > 0) {
            return this.waypoints[this.waypoints.length - 1];
        } else if (this.style === 'orthogonal') {
            return this.getOrthogonalEndArrowPoint();
        }
        return this.getStartPoint();
    }

    getOrthogonalStartArrowPoint() {
        const start = this.getStartPoint();
        const end = this.getEndPoint();
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        // Return the second point in the orthogonal path
        if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
            return { x: midX, y: start.y };
        } else {
            return { x: start.x, y: midY };
        }
    }

    getOrthogonalEndArrowPoint() {
        const start = this.getStartPoint();
        const end = this.getEndPoint();
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        // Return the second-to-last point in the orthogonal path
        if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
            return { x: midX, y: end.y };
        } else {
            return { x: end.x, y: midY };
        }
    }

    drawArrow(ctx, from, to, atStart) {
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        this.drawArrowWithAngle(ctx, to, angle);
    }

    drawArrowWithAngle(ctx, point, angle) {
        // Scale arrow size with stroke width
        const scale = Math.max(1, this.strokeWidth / 2);
        const arrowLength = 12 * scale;
        const arrowWidth = 6 * scale;

        ctx.save();
        ctx.fillStyle = this.stroke;

        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(
            point.x - arrowLength * Math.cos(angle) + arrowWidth * Math.cos(angle + Math.PI / 2),
            point.y - arrowLength * Math.sin(angle) + arrowWidth * Math.sin(angle + Math.PI / 2)
        );
        ctx.lineTo(
            point.x - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle + Math.PI / 2),
            point.y - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle + Math.PI / 2)
        );
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    getBezierTangentAtStart() {
        const start = this.getStartPoint();
        const cp1 = this.controlPoint1 || this.getDefaultControlPoint1();

        // Tangent at t=0 is the direction from start to first control point
        return Math.atan2(cp1.y - start.y, cp1.x - start.x);
    }

    getBezierTangentAtEnd() {
        const end = this.getEndPoint();
        const cp2 = this.controlPoint2 || this.getDefaultControlPoint2();

        // Tangent at t=1 is the direction from second control point to end
        return Math.atan2(end.y - cp2.y, end.x - cp2.x);
    }

    drawWaypoints(ctx) {
        ctx.fillStyle = '#0066cc';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        for (const waypoint of this.waypoints) {
            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    drawControlPoints(ctx) {
        const cp1 = this.controlPoint1 || this.getDefaultControlPoint1();
        const cp2 = this.controlPoint2 || this.getDefaultControlPoint2();
        const start = this.getStartPoint();
        const end = this.getEndPoint();

        // Draw control lines
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(cp1.x, cp1.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(cp2.x, cp2.y);
        ctx.stroke();

        ctx.setLineDash([]);

        // Draw control points
        ctx.fillStyle = '#ff9900';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(cp1.x, cp1.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cp2.x, cp2.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            startObject: this.startObject ? this.startObject.id : null,
            startAnchor: this.startAnchor,
            endObject: this.endObject ? this.endObject.id : null,
            endAnchor: this.endAnchor,
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            arrowStart: this.arrowStart,
            arrowEnd: this.arrowEnd,
            style: this.style,
            zIndex: this.zIndex,
            visible: this.visible,
            connectionType: this.connectionType,
            waypoints: this.waypoints,
            controlPoint1: this.controlPoint1,
            controlPoint2: this.controlPoint2
        };
    }
}
