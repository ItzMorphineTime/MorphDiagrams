/**
 * @module core/Connector
 * @description Connector class for drawing lines between shapes on the canvas.
 *
 * @see module:core/BaseShape
 * @see module:shapes/ConnectorAnchor
 *
 * @example
 * import { Connector } from './core/Connector.js';
 */

/**
 * Connector class for drawing lines between shapes on the canvas.
 * Supports multiple connection styles (straight, orthogonal, bezier, polyline),
 * line styles (solid, dashed, dotted), and connection types for typed network diagrams.
 * @class Connector
 */
export class Connector {
    /**
     * Creates a new Connector instance.
     * @param {Object} startObject - The shape object where the connector starts
     * @param {string} startAnchor - The anchor point key on the start object
     * @param {Object} endObject - The shape object where the connector ends
     * @param {string} endAnchor - The anchor point key on the end object
     * @param {string|null} connectionType - Type of connection (video, sdi, network, usb) or null for generic
     */
    constructor(startObject, startAnchor, endObject, endAnchor, connectionType = null) {
        /** @type {string} Unique identifier for the connector */
        this.id = this.generateId();
        /** @type {string} Type identifier */
        this.type = 'connector';
        /** @type {Object} Shape object where the connector starts */
        this.startObject = startObject;
        /** @type {string} Anchor point key on the start object */
        this.startAnchor = startAnchor || 'center';
        /** @type {Object} Shape object where the connector ends */
        this.endObject = endObject;
        /** @type {string} Anchor point key on the end object */
        this.endAnchor = endAnchor || 'center';
        /** @type {string} Stroke color in hex format */
        this.stroke = '#2c3e50';
        /** @type {number} Width of the line in pixels */
        this.strokeWidth = 2;
        /** @type {boolean} Whether to draw arrow at start point */
        this.arrowStart = false;
        /** @type {boolean} Whether to draw arrow at end point */
        this.arrowEnd = true;
        /** @type {string} Connection style: 'straight', 'orthogonal', 'bezier', or 'polyline' */
        this.style = 'straight';
        /** @type {string} Line dash style: 'solid', 'dashed', or 'dotted' */
        this.lineStyle = 'solid';
        /** @type {number} Z-index for rendering order (connectors default to -1, below shapes) */
        this.zIndex = -1;
        /** @type {boolean} Whether the connector is visible */
        this.visible = true;
        /** @type {boolean} Whether the connector is currently selected */
        this.selected = false;
        /** @type {string|null} Connection type for network objects (video, sdi, network, usb) */
        this.connectionType = connectionType;
        /** @type {Array<{x: number, y: number}>} Intermediate points for polyline connectors */
        this.waypoints = [];
        /** @type {{x: number, y: number}|null} First control point for bezier connectors */
        this.controlPoint1 = null;
        /** @type {{x: number, y: number}|null} Second control point for bezier connectors */
        this.controlPoint2 = null;
    }

    /**
     * Generates a unique identifier for the connector.
     * @returns {string} Unique ID combining timestamp and random string
     */
    generateId() {
        return 'conn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Gets the starting point of the connector from the start object's anchor points.
     * @returns {{x: number, y: number}|null} Start point coordinates or null if no start object
     */
    getStartPoint() {
        if (!this.startObject) return null;
        const anchors = this.startObject.getAnchorPoints();
        return anchors[this.startAnchor] || anchors.center;
    }

    /**
     * Gets the ending point of the connector from the end object's anchor points.
     * @returns {{x: number, y: number}|null} End point coordinates or null if no end object
     */
    getEndPoint() {
        if (!this.endObject) return null;
        const anchors = this.endObject.getAnchorPoints();
        return anchors[this.endAnchor] || anchors.center;
    }

    /**
     * Checks if a point is near the connector line for hit detection.
     * Delegates to specific methods based on connector style.
     * @param {number} x - X-coordinate of the point to test
     * @param {number} y - Y-coordinate of the point to test
     * @param {number} [threshold=5] - Maximum distance in pixels to consider "near"
     * @returns {boolean} True if point is within threshold distance of the connector
     */
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

    /**
     * Checks if a point is near a straight line segment using perpendicular distance.
     * @param {{x: number, y: number}} p1 - First endpoint of the line
     * @param {{x: number, y: number}} p2 - Second endpoint of the line
     * @param {number} x - X-coordinate of the point to test
     * @param {number} y - Y-coordinate of the point to test
     * @param {number} threshold - Maximum distance to consider "near"
     * @returns {boolean} True if point is within threshold distance of the line segment
     */
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

    /**
     * Checks if a point is near a polyline connector by testing each segment.
     * @param {number} x - X-coordinate of the point to test
     * @param {number} y - Y-coordinate of the point to test
     * @param {number} threshold - Maximum distance to consider "near"
     * @returns {boolean} True if point is near any segment of the polyline
     */
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

    /**
     * Checks if a point is near an orthogonal (right-angled) connector.
     * Orthogonal connectors use 3 segments forming right angles.
     * @param {number} x - X-coordinate of the point to test
     * @param {number} y - Y-coordinate of the point to test
     * @param {number} threshold - Maximum distance to consider "near"
     * @returns {boolean} True if point is near the orthogonal path
     */
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

    /**
     * Checks if a point is near a bezier curve connector by sampling points along the curve.
     * @param {number} x - X-coordinate of the point to test
     * @param {number} y - Y-coordinate of the point to test
     * @param {number} threshold - Maximum distance to consider "near"
     * @returns {boolean} True if point is near the bezier curve
     */
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

    /**
     * Calculates a point on the bezier curve at parameter t using cubic bezier formula.
     * @param {number} t - Parameter value between 0 and 1 (0=start, 1=end)
     * @returns {{x: number, y: number}} Point coordinates on the bezier curve
     */
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

    /**
     * Gets the default position for the first bezier control point.
     * Positioned at 25% along the line with slight curve offset.
     * @returns {{x: number, y: number}} Default first control point coordinates
     */
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

    /**
     * Gets the default position for the second bezier control point.
     * Positioned at 75% along the line with slight curve offset.
     * @returns {{x: number, y: number}} Default second control point coordinates
     */
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

    /**
     * Draws the connector on the canvas.
     * Applies appropriate styling, draws the connection line based on style,
     * and draws arrows and control points as needed.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        if (!this.visible) return;

        const start = this.getStartPoint();
        const end = this.getEndPoint();

        if (!start || !end) return;

        ctx.save();
        ctx.strokeStyle = this.selected ? '#0066cc' : this.stroke;
        ctx.lineWidth = this.selected ? this.strokeWidth + 1 : this.strokeWidth;
        ctx.fillStyle = this.stroke;

        // Apply line style (solid, dashed, dotted)
        switch (this.lineStyle) {
            case 'dashed':
                ctx.setLineDash([10, 5]);
                break;
            case 'dotted':
                ctx.setLineDash([2, 4]);
                break;
            default:
                ctx.setLineDash([]);
        }

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

    /**
     * Performs `drawStraight`.
     * @param {number} ctx ctx value.
     * @param {*} start start value.
     * @param {*} end end value.
     */
    drawStraight(ctx, start, end) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    /**
     * Performs `drawPolyline`.
     * @param {number} ctx ctx value.
     * @param {*} start start value.
     * @param {*} end end value.
     */
    drawPolyline(ctx, start, end) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        for (const waypoint of this.waypoints) {
            ctx.lineTo(waypoint.x, waypoint.y);
        }

        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    /**
     * Performs `drawOrthogonal`.
     * @param {number} ctx ctx value.
     * @param {*} start start value.
     * @param {*} end end value.
     */
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

    /**
     * Performs `drawBezier`.
     * @param {number} ctx ctx value.
     * @param {*} start start value.
     * @param {*} end end value.
     */
    drawBezier(ctx, start, end) {
        const cp1 = this.controlPoint1 || this.getDefaultControlPoint1();
        const cp2 = this.controlPoint2 || this.getDefaultControlPoint2();

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
        ctx.stroke();
    }

    /**
     * Returns the `ArrowStartPoint` value.
     * @returns {*} Result value.
     */
    getArrowStartPoint() {
        if (this.style === 'polyline' && this.waypoints.length > 0) {
            return this.waypoints[0];
        } else if (this.style === 'orthogonal') {
            return this.getOrthogonalStartArrowPoint();
        }
        return this.getEndPoint();
    }

    /**
     * Returns the `ArrowEndPoint` value.
     * @returns {*} Result value.
     */
    getArrowEndPoint() {
        if (this.style === 'polyline' && this.waypoints.length > 0) {
            return this.waypoints[this.waypoints.length - 1];
        } else if (this.style === 'orthogonal') {
            return this.getOrthogonalEndArrowPoint();
        }
        return this.getStartPoint();
    }

    /**
     * Returns the `OrthogonalStartArrowPoint` value.
     * @returns {*} Result value.
     */
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

    /**
     * Returns the `OrthogonalEndArrowPoint` value.
     * @returns {*} Result value.
     */
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

    /**
     * Performs `drawArrow`.
     * @param {number} ctx ctx value.
     * @param {*} from from value.
     * @param {*} to to value.
     * @param {*} atStart atStart value.
     */
    drawArrow(ctx, from, to, atStart) {
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        this.drawArrowWithAngle(ctx, to, angle);
    }

    /**
     * Performs `drawArrowWithAngle`.
     * @param {number} ctx ctx value.
     * @param {*} point point value.
     * @param {number} angle angle value.
     */
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

    /**
     * Returns the `BezierTangentAtStart` value.
     * @returns {*} Result value.
     */
    getBezierTangentAtStart() {
        const start = this.getStartPoint();
        const cp1 = this.controlPoint1 || this.getDefaultControlPoint1();

        // Tangent at t=0 is the direction from first control point to start (reversed for arrow pointing back)
        return Math.atan2(start.y - cp1.y, start.x - cp1.x);
    }

    /**
     * Returns the `BezierTangentAtEnd` value.
     * @returns {*} Result value.
     */
    getBezierTangentAtEnd() {
        const end = this.getEndPoint();
        const cp2 = this.controlPoint2 || this.getDefaultControlPoint2();

        // Tangent at t=1 is the direction from second control point to end
        return Math.atan2(end.y - cp2.y, end.x - cp2.x);
    }

    /**
     * Performs `drawWaypoints`.
     * @param {number} ctx ctx value.
     */
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

    /**
     * Performs `drawControlPoints`.
     * @param {number} ctx ctx value.
     */
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

    /**
     * Serializes the connector to a JSON-compatible object for saving.
     * Stores object IDs instead of object references for proper serialization.
     * @returns {Object} JSON representation of the connector with all properties
     */
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
            lineStyle: this.lineStyle,
            zIndex: this.zIndex,
            visible: this.visible,
            connectionType: this.connectionType,
            waypoints: this.waypoints,
            controlPoint1: this.controlPoint1,
            controlPoint2: this.controlPoint2
        };
    }
}
