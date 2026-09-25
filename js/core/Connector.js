/**
 * @module core/Connector
 * @description Connector (edge) between two anchors of two shapes.
 *
 * Supports four path styles (`straight`, `orthogonal`, `bezier`, `polyline`), three line styles
 * (`solid`, `dashed`, `dotted`), optional arrows at either end, a typed connection (video, sdi, ...)
 * and a text label drawn at the middle of the path.
 *
 * @remarks
 * - Endpoints are resolved lazily from the attached shapes' anchor points, so connectors follow shapes.
 * - If a referenced port no longer exists (e.g. the port count was reduced) the connector falls back to
 *   the shape centre and reports `isDangling()`; it is never silently hidden.
 * - Orthogonal routing leaves each port along its outward normal ("stub") before turning, which keeps
 *   links from crossing through the devices they connect.
 *
 * @example
 * const link = new Connector(server, 'video_output_0', matrix, 'video_input_0', 'video');
 * link.style = 'orthogonal';
 * link.label = 'Program A';
 *
 * @see module:core/Ports
 * @see module:core/BaseShape
 */

/** Length of the straight stub leaving a port before an orthogonal connector turns. */
export const ORTHOGONAL_STUB = 20;

export class Connector {
    /**
     * @param {Object} startObject Shape the connector starts at.
     * @param {string} startAnchor Anchor key on the start object.
     * @param {Object|null} endObject Shape the connector ends at (null while being drawn).
     * @param {string|null} endAnchor Anchor key on the end object.
     * @param {string|null} [connectionType=null] Connection type id or null for untyped.
     */
    constructor(startObject, startAnchor, endObject, endAnchor, connectionType = null) {
        /** @type {string} */
        this.id = this.generateId();
        /** @type {string} */
        this.type = 'connector';
        /** @type {Object} */
        this.startObject = startObject;
        /** @type {string} */
        this.startAnchor = startAnchor || 'center';
        /** @type {Object|null} */
        this.endObject = endObject;
        /** @type {string} */
        this.endAnchor = endAnchor || 'center';
        /** @type {string} Stroke colour */
        this.stroke = '#2c3e50';
        /** @type {number} */
        this.strokeWidth = 2;
        /** @type {boolean} */
        this.arrowStart = false;
        /** @type {boolean} */
        this.arrowEnd = true;
        /** @type {("straight"|"orthogonal"|"bezier"|"polyline")} */
        this.style = 'straight';
        /** @type {("solid"|"dashed"|"dotted")} */
        this.lineStyle = 'solid';
        /** @type {number} Connectors render below shapes by default */
        this.zIndex = -1;
        /** @type {boolean} */
        this.visible = true;
        /** @type {boolean} Transient selection flag (not serialised) */
        this.selected = false;
        /** @type {string|null} */
        this.connectionType = connectionType;
        /** @type {Array<{x:number,y:number}>} Intermediate points for polyline connectors */
        this.waypoints = [];
        /** @type {{x:number,y:number}|null} */
        this.controlPoint1 = null;
        /** @type {{x:number,y:number}|null} */
        this.controlPoint2 = null;
        /** @type {string} Text label drawn at the middle of the connector */
        this.label = '';
    }

    /**
     * @returns {string}
     */
    generateId() {
        return 'conn_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
    }

    /**
     * Fallback anchor at a shape's centre, used when the referenced anchor key does not exist.
     * @private
     */
    static fallbackAnchor(obj) {
        if (!obj) return null;
        let c = null;
        if (typeof obj.getCenter === 'function') c = obj.getCenter();
        else if (typeof obj.getBounds === 'function') {
            const b = obj.getBounds();
            c = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        } else if (typeof obj.x === 'number') {
            c = { x: obj.x, y: obj.y };
        }
        return c ? { x: c.x, y: c.y, normal: null, connectionType: null, portType: 'both', missing: true } : null;
    }

    /**
     * Resolves the start anchor (position, normal, type info).
     * @returns {AnchorPoint|null}
     */
    getStartAnchorInfo() {
        if (!this.startObject) return null;
        const anchors = this.startObject.getAnchorPoints ? this.startObject.getAnchorPoints() : {};
        return anchors[this.startAnchor] || anchors.center || Connector.fallbackAnchor(this.startObject);
    }

    /**
     * Resolves the end anchor. While a connector is being drawn (`endObject` null) the transient
     * `endX`/`endY` fields are used.
     * @returns {AnchorPoint|null}
     */
    getEndAnchorInfo() {
        if (!this.endObject) {
            if (typeof this.endX === 'number' && typeof this.endY === 'number') {
                return { x: this.endX, y: this.endY, normal: null, connectionType: null, portType: 'both' };
            }
            return null;
        }
        const anchors = this.endObject.getAnchorPoints ? this.endObject.getAnchorPoints() : {};
        return anchors[this.endAnchor] || anchors.center || Connector.fallbackAnchor(this.endObject);
    }

    /**
     * @returns {{x:number,y:number}|null}
     */
    getStartPoint() {
        const a = this.getStartAnchorInfo();
        return a ? { x: a.x, y: a.y } : null;
    }

    /**
     * @returns {{x:number,y:number}|null}
     */
    getEndPoint() {
        const a = this.getEndAnchorInfo();
        return a ? { x: a.x, y: a.y } : null;
    }

    /**
     * True when one of the referenced anchor keys does not exist on its shape any more.
     * @returns {boolean}
     */
    isDangling() {
        const s = this.getStartAnchorInfo();
        const e = this.endObject ? this.getEndAnchorInfo() : null;
        return !!((s && s.missing) || (e && e.missing));
    }

    /**
     * Ordered points of the connector path for straight, polyline and orthogonal styles.
     * Bezier connectors return the sampled curve (see {@link Connector#getBezierSamples}).
     * @returns {Array<{x:number,y:number}>} Empty when an endpoint is unresolved.
     */
    getPathPoints() {
        const s = this.getStartAnchorInfo();
        const e = this.getEndAnchorInfo();
        if (!s || !e) return [];
        const start = { x: s.x, y: s.y };
        const end = { x: e.x, y: e.y };
        switch (this.style) {
            case 'polyline':
                return [start, ...this.waypoints.map(w => ({ x: w.x, y: w.y })), end];
            case 'orthogonal':
                return Connector.orthogonalRoute(start, end, s.normal || null, e.normal || null);
            case 'bezier':
                return this.getBezierSamples();
            default:
                return [start, end];
        }
    }

    /**
     * Computes an orthogonal (right-angled) route between two points, leaving each endpoint along its
     * outward normal first.
     * @param {{x:number,y:number}} start
     * @param {{x:number,y:number}} end
     * @param {{x:number,y:number}|null} ns Outward unit normal at the start (null = free point).
     * @param {{x:number,y:number}|null} ne Outward unit normal at the end (null = free point).
     * @param {number} [stub=ORTHOGONAL_STUB]
     * @returns {Array<{x:number,y:number}>}
     */
    static orthogonalRoute(start, end, ns, ne, stub = ORTHOGONAL_STUB) {
        const axisOf = n => (n ? (Math.abs(n.x) >= Math.abs(n.y) ? 'h' : 'v') : null);
        const p1 = ns ? { x: start.x + ns.x * stub, y: start.y + ns.y * stub } : { ...start };
        const p2 = ne ? { x: end.x + ne.x * stub, y: end.y + ne.y * stub } : { ...end };
        const axisS = axisOf(ns);
        const axisE = axisOf(ne);
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const viaX = () => {
            const midX = p1.x + dx / 2;
            return [{ x: midX, y: p1.y }, { x: midX, y: p2.y }];
        };
        const viaY = () => {
            const midY = p1.y + dy / 2;
            return [{ x: p1.x, y: midY }, { x: p2.x, y: midY }];
        };
        let mids;
        if (axisS === 'h' && axisE === 'h') {
            const forwardS = ns.x * dx >= 0;
            const forwardE = ne.x * -dx >= 0;
            mids = (forwardS && forwardE) ? viaX() : viaY();
        } else if (axisS === 'v' && axisE === 'v') {
            const forwardS = ns.y * dy >= 0;
            const forwardE = ne.y * -dy >= 0;
            mids = (forwardS && forwardE) ? viaY() : viaX();
        } else if (axisS === 'h' && axisE === 'v') {
            mids = [{ x: p2.x, y: p1.y }];
        } else if (axisS === 'v' && axisE === 'h') {
            mids = [{ x: p1.x, y: p2.y }];
        } else if (axisS === 'h') {
            mids = [{ x: p2.x, y: p1.y }];
        } else if (axisS === 'v') {
            mids = [{ x: p1.x, y: p2.y }];
        } else if (axisE === 'h') {
            mids = [{ x: p1.x, y: p2.y }];
        } else if (axisE === 'v') {
            mids = [{ x: p2.x, y: p1.y }];
        } else {
            mids = Math.abs(dx) > Math.abs(dy) ? viaX() : viaY();
        }
        const raw = [start, p1, ...mids, p2, end];
        const points = [];
        for (const p of raw) {
            const last = points[points.length - 1];
            if (!last || Math.abs(last.x - p.x) > 0.01 || Math.abs(last.y - p.y) > 0.01) {
                points.push({ x: p.x, y: p.y });
            }
        }
        return points;
    }

    /**
     * Converts the connector to an editable polyline, seeding waypoints from the current path so the
     * shape does not visibly change (bezier curves are approximated with a few samples).
     * @returns {boolean} True if the style was changed.
     */
    toPolyline() {
        if (this.style === 'polyline') return false;
        let inner;
        if (this.style === 'bezier') {
            inner = [1, 2, 3, 4, 5, 6].map(i => this.getBezierPoint(i / 7));
        } else {
            inner = this.getPathPoints().slice(1, -1);
        }
        this.waypoints = inner.map(p => ({ x: p.x, y: p.y }));
        this.style = 'polyline';
        return true;
    }

    /**
     * Inserts a waypoint on the segment closest to (x, y), converting to a polyline first if needed.
     * The point is projected onto that segment so it sits exactly on the line.
     * @param {number} x
     * @param {number} y
     * @returns {number} Index of the new waypoint in `waypoints` (-1 when the path is unresolved).
     */
    insertWaypoint(x, y) {
        this.toPolyline();
        const points = this.getPathPoints();
        if (points.length < 2) return -1;
        let best = { index: 0, dist: Infinity, point: { x, y } };
        for (let i = 0; i < points.length - 1; i++) {
            const a = points[i];
            const b = points[i + 1];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len2 = dx * dx + dy * dy;
            const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / len2));
            const px = a.x + t * dx;
            const py = a.y + t * dy;
            const dist = Math.hypot(x - px, y - py);
            if (dist < best.dist) best = { index: i, dist, point: { x: px, y: py } };
        }
        this.waypoints.splice(best.index, 0, best.point);
        return best.index;
    }

    /**
     * Index of the waypoint within `threshold` of (x, y), or -1.
     * @param {number} x
     * @param {number} y
     * @param {number} [threshold=8]
     * @returns {number}
     */
    findWaypointNear(x, y, threshold = 8) {
        for (let i = 0; i < this.waypoints.length; i++) {
            const w = this.waypoints[i];
            if (Math.hypot(x - w.x, y - w.y) <= threshold) return i;
        }
        return -1;
    }

    /**
     * Swaps start and end (useful when a link was drawn the wrong way round).
     */
    reverse() {
        [this.startObject, this.endObject] = [this.endObject, this.startObject];
        [this.startAnchor, this.endAnchor] = [this.endAnchor, this.startAnchor];
        [this.arrowStart, this.arrowEnd] = [this.arrowEnd, this.arrowStart];
        this.waypoints.reverse();
        [this.controlPoint1, this.controlPoint2] = [this.controlPoint2, this.controlPoint1];
    }

    /**
     * Samples the bezier curve into a polyline.
     * @param {number} [samples=24]
     * @returns {Array<{x:number,y:number}>}
     */
    getBezierSamples(samples = 24) {
        const pts = [];
        for (let i = 0; i <= samples; i++) pts.push(this.getBezierPoint(i / samples));
        return pts;
    }

    /**
     * Hit test: is the point within `threshold` of the path?
     * @param {number} x
     * @param {number} y
     * @param {number} [threshold=5]
     * @returns {boolean}
     */
    containsPoint(x, y, threshold = 5) {
        const points = this.getPathPoints();
        for (let i = 0; i < points.length - 1; i++) {
            if (Connector.isNearSegment(points[i], points[i + 1], x, y, threshold)) return true;
        }
        return false;
    }

    /**
     * Distance test from a point to a segment.
     * @param {{x:number,y:number}} p1
     * @param {{x:number,y:number}} p2
     * @param {number} x
     * @param {number} y
     * @param {number} threshold
     * @returns {boolean}
     */
    static isNearSegment(p1, p2, x, y, threshold) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len2 = dx * dx + dy * dy;
        if (len2 === 0) return Math.hypot(x - p1.x, y - p1.y) <= threshold;
        const t = Math.max(0, Math.min(1, ((x - p1.x) * dx + (y - p1.y) * dy) / len2));
        return Math.hypot(x - (p1.x + t * dx), y - (p1.y + t * dy)) <= threshold;
    }

    /**
     * Kept for backwards compatibility.
     * @deprecated Use {@link Connector.isNearSegment}.
     */
    isNearLine(p1, p2, x, y, threshold) {
        return Connector.isNearSegment(p1, p2, x, y, threshold);
    }

    /**
     * Point on the cubic bezier at parameter `t`.
     * @param {number} t 0..1
     * @returns {{x:number,y:number}}
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
     * Default first control point (25% along, offset perpendicular).
     * @returns {{x:number,y:number}}
     */
    getDefaultControlPoint1() {
        const start = this.getStartPoint();
        const end = this.getEndPoint();
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        return { x: start.x + dx * 0.25, y: start.y + dy * 0.25 - Math.abs(dx) * 0.2 };
    }

    /**
     * Default second control point (75% along, offset perpendicular).
     * @returns {{x:number,y:number}}
     */
    getDefaultControlPoint2() {
        const start = this.getStartPoint();
        const end = this.getEndPoint();
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        return { x: start.x + dx * 0.75, y: start.y + dy * 0.75 + Math.abs(dx) * 0.2 };
    }

    /**
     * Point halfway along the path (by length) plus the direction angle of that segment.
     * @returns {{x:number,y:number,angle:number}|null}
     */
    getMidpoint() {
        const points = this.getPathPoints();
        if (points.length < 2) return null;
        let total = 0;
        const lengths = [];
        for (let i = 0; i < points.length - 1; i++) {
            const l = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
            lengths.push(l);
            total += l;
        }
        let remaining = total / 2;
        for (let i = 0; i < lengths.length; i++) {
            if (remaining <= lengths[i] || i === lengths.length - 1) {
                const t = lengths[i] === 0 ? 0 : remaining / lengths[i];
                const a = points[i];
                const b = points[i + 1];
                return {
                    x: a.x + (b.x - a.x) * t,
                    y: a.y + (b.y - a.y) * t,
                    angle: Math.atan2(b.y - a.y, b.x - a.x)
                };
            }
            remaining -= lengths[i];
        }
        return null;
    }

    /**
     * Arrow angles (radians) at both ends, pointing outwards along the path.
     * @returns {{start:number, end:number}|null}
     */
    getArrowAngles() {
        if (this.style === 'bezier') {
            return { start: this.getBezierTangentAtStart(), end: this.getBezierTangentAtEnd() };
        }
        const points = this.getPathPoints();
        if (points.length < 2) return null;
        const first = points[0];
        const second = points[1];
        const last = points[points.length - 1];
        const beforeLast = points[points.length - 2];
        return {
            start: Math.atan2(first.y - second.y, first.x - second.x),
            end: Math.atan2(last.y - beforeLast.y, last.x - beforeLast.x)
        };
    }

    /**
     * Draws the connector.
     * @param {CanvasRenderingContext2D} ctx
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
        ctx.lineJoin = 'round';

        switch (this.lineStyle) {
            case 'dashed': ctx.setLineDash([10, 5]); break;
            case 'dotted': ctx.setLineDash([2, 4]); break;
            default: ctx.setLineDash([]);
        }

        if (this.style === 'bezier') {
            const cp1 = this.controlPoint1 || this.getDefaultControlPoint1();
            const cp2 = this.controlPoint2 || this.getDefaultControlPoint2();
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
            ctx.stroke();
        } else {
            const points = this.getPathPoints();
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        const angles = this.getArrowAngles();
        if (angles) {
            if (this.arrowStart) this.drawArrowWithAngle(ctx, start, angles.start);
            if (this.arrowEnd) this.drawArrowWithAngle(ctx, end, angles.end);
        }

        if (this.selected && this.style === 'polyline') this.drawWaypoints(ctx);
        if (this.selected && this.style === 'bezier') this.drawControlPoints(ctx);

        this.drawLabel(ctx);
        ctx.restore();
    }

    /**
     * Draws a filled arrow head at `point` pointing in direction `angle`.
     * @param {CanvasRenderingContext2D} ctx
     * @param {{x:number,y:number}} point
     * @param {number} angle Radians.
     */
    drawArrowWithAngle(ctx, point, angle) {
        const scale = Math.max(1, this.strokeWidth / 2);
        const arrowLength = 12 * scale;
        const arrowWidth = 6 * scale;
        ctx.save();
        ctx.fillStyle = this.selected ? '#0066cc' : this.stroke;
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
     * Tangent angle at the start (pointing away from the curve).
     * @returns {number}
     */
    getBezierTangentAtStart() {
        const start = this.getStartPoint();
        const cp1 = this.controlPoint1 || this.getDefaultControlPoint1();
        return Math.atan2(start.y - cp1.y, start.x - cp1.x);
    }

    /**
     * Tangent angle at the end.
     * @returns {number}
     */
    getBezierTangentAtEnd() {
        const end = this.getEndPoint();
        const cp2 = this.controlPoint2 || this.getDefaultControlPoint2();
        return Math.atan2(end.y - cp2.y, end.x - cp2.x);
    }

    /**
     * Draws polyline waypoint handles.
     * @param {CanvasRenderingContext2D} ctx
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
     * Draws bezier control point handles and guide lines.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawControlPoints(ctx) {
        const cp1 = this.controlPoint1 || this.getDefaultControlPoint1();
        const cp2 = this.controlPoint2 || this.getDefaultControlPoint2();
        const start = this.getStartPoint();
        const end = this.getEndPoint();

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

        ctx.fillStyle = '#ff9900';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        for (const cp of [cp1, cp2]) {
            ctx.beginPath();
            ctx.arc(cp.x, cp.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    /**
     * Layout of the label box at the middle of the path.
     * @param {function(string): number} [measure] Text width measurer for the label font.
     * @returns {{x:number,y:number,width:number,height:number,text:string,fontSize:number}|null}
     */
    getLabelLayout(measure) {
        const text = (this.label || '').trim();
        if (!text) return null;
        const mid = this.getMidpoint();
        if (!mid) return null;
        const fontSize = 11;
        const width = (measure ? measure(text) : text.length * fontSize * 0.58) + 8;
        const height = fontSize + 6;
        return { x: mid.x, y: mid.y, width, height, text, fontSize };
    }

    /**
     * Draws the label with a light background so it stays readable over the line.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawLabel(ctx) {
        const font = '11px Arial';
        const layout = this.getLabelLayout(t => {
            ctx.font = font;
            return ctx.measureText(t).width;
        });
        if (!layout) return;
        ctx.save();
        ctx.setLineDash([]);
        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = 1;
        const x = layout.x - layout.width / 2;
        const y = layout.y - layout.height / 2;
        ctx.beginPath();
        ctx.rect(x, y, layout.width, layout.height);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(layout.text, layout.x, layout.y + 0.5);
        ctx.restore();
    }

    /**
     * Serialises the connector, storing object ids instead of references.
     * @returns {Object}
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
            waypoints: this.waypoints.map(w => ({ x: w.x, y: w.y })),
            controlPoint1: this.controlPoint1 ? { ...this.controlPoint1 } : null,
            controlPoint2: this.controlPoint2 ? { ...this.controlPoint2 } : null,
            label: this.label
        };
    }
}
