/**
 * @module core/SvgExporter
 * @description Renders a set of shapes and connectors to a standalone SVG document. Runs headless
 * (no canvas needed), so the MCP server can produce previews and the editor can export true vector files.
 *
 * The exporter mirrors each shape's canvas rendering; geometry helpers (`getPoints`, `getLabelLayout`,
 * `getPathPoints`) are shared with the canvas code so both outputs stay aligned.
 *
 * @example
 * import { diagramToSvg } from './core/SvgExporter.js';
 * const svg = diagramToSvg(diagram.objects, { showPortLabels: true });
 *
 * @see module:core/Diagram
 */

import { ConnectionTypeRegistry } from '../config/ConnectionTypes.js';
import { contrastColor } from '../utils/Color.js';
import { portLabel } from './Ports.js';

/**
 * Escapes text for use inside SVG/XML.
 * @param {*} value
 * @returns {string}
 */
export function escapeXml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const num = v => Math.round(v * 100) / 100;
const pointsAttr = pts => pts.map(p => `${num(p.x)},${num(p.y)}`).join(' ');

function transformAttr(shape) {
    if (!shape.rotation) return '';
    const c = shape.getCenter();
    return ` transform="rotate(${num(shape.rotation * 180 / Math.PI)} ${num(c.x)} ${num(c.y)})"`;
}

function styleAttrs(shape) {
    const stroke = shape.stroke && shape.stroke !== 'transparent' ? shape.stroke : 'none';
    return `fill="${escapeXml(shape.fill)}" stroke="${escapeXml(stroke)}" stroke-width="${num(shape.strokeWidth || 0)}"`;
}

function roundedRectPath(b, r) {
    const rr = Math.min(r, b.width / 2, b.height / 2);
    return `M${num(b.x + rr)},${num(b.y)} H${num(b.x + b.width - rr)} Q${num(b.x + b.width)},${num(b.y)} ${num(b.x + b.width)},${num(b.y + rr)} ` +
        `V${num(b.y + b.height - rr)} Q${num(b.x + b.width)},${num(b.y + b.height)} ${num(b.x + b.width - rr)},${num(b.y + b.height)} ` +
        `H${num(b.x + rr)} Q${num(b.x)},${num(b.y + b.height)} ${num(b.x)},${num(b.y + b.height - rr)} V${num(b.y + rr)} Q${num(b.x)},${num(b.y)} ${num(b.x + rr)},${num(b.y)} Z`;
}

function capsulePath(b) {
    const { x, y, width, height } = b;
    const r = Math.min(width, height) / 2;
    if (width > height) {
        return `M${num(x + r)},${num(y)} H${num(x + width - r)} A${num(r)},${num(r)} 0 0 1 ${num(x + width - r)},${num(y + height)} H${num(x + r)} A${num(r)},${num(r)} 0 0 1 ${num(x + r)},${num(y)} Z`;
    }
    return `M${num(x)},${num(y + r)} A${num(r)},${num(r)} 0 0 1 ${num(x + width)},${num(y + r)} V${num(y + height - r)} A${num(r)},${num(r)} 0 0 1 ${num(x)},${num(y + height - r)} Z`;
}

function labelSvg(shape) {
    const layout = shape.getLabelLayout ? shape.getLabelLayout() : null;
    if (!layout) return '';
    const n = layout.lines.length;
    const tspans = layout.lines.map((line, i) =>
        `<tspan x="${num(layout.x)}" y="${num(layout.y + (i - (n - 1) / 2) * layout.lineHeight)}">${escapeXml(line)}</tspan>`).join('');
    return `<text font-family="Arial, sans-serif" font-size="${layout.fontSize}" fill="${layout.color}" text-anchor="middle" dominant-baseline="middle">${tspans}</text>`;
}

function iconSvg(shape) {
    const b = shape.getBounds();
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    switch (shape.type) {
        case 'server': {
            const parts = [];
            for (let i = 1; i < 4; i++) {
                const y = b.y + i * b.height / 4;
                parts.push(`<line x1="${num(b.x)}" y1="${num(y)}" x2="${num(b.x + b.width)}" y2="${num(y)}" stroke="#34495e" stroke-width="1"/>`);
            }
            return parts.join('');
        }
        case 'video_matrix': {
            const s = Math.min(b.width, b.height) * 0.4;
            const pts = [
                { x: cx - s / 2, y: cy + s / 2 }, { x: cx - s / 2, y: cy - s / 2 }, { x: cx, y: cy },
                { x: cx + s / 2, y: cy - s / 2 }, { x: cx + s / 2, y: cy + s / 2 }
            ];
            return `<polyline points="${pointsAttr(pts)}" fill="none" stroke="${escapeXml(shape.stroke)}" stroke-width="${Math.max(2, shape.strokeWidth)}" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        case 'led_processor': {
            const ledSize = Math.min(b.width, b.height) * 0.1;
            const spacing = ledSize * 1.5;
            const startX = cx - spacing;
            return [0, 1, 2].map(i => `<circle cx="${num(startX + i * spacing)}" cy="${num(cy)}" r="${num(ledSize / 2)}" fill="#FF6B6B"/>`).join('');
        }
        case 'network_switch': {
            const w = Math.min(b.width, b.height) * 0.3;
            const h = Math.min(b.width, b.height) * 0.35;
            const pts = [{ x: cx - w / 2, y: cy + h / 2 }, { x: cx - w / 2, y: cy - h / 2 }, { x: cx + w / 2, y: cy + h / 2 }, { x: cx + w / 2, y: cy - h / 2 }];
            return `<polyline points="${pointsAttr(pts)}" fill="none" stroke="${escapeXml(shape.stroke)}" stroke-width="${Math.max(2, shape.strokeWidth)}" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        case 'sync_generator': {
            const r = Math.min(b.width, b.height) * 0.2;
            return `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" fill="none" stroke="#ffffff" stroke-width="2"/>` +
                `<path d="M${num(cx)},${num(cy)} V${num(cy - r * 0.6)} M${num(cx)},${num(cy)} H${num(cx + r * 0.4)}" stroke="#ffffff" stroke-width="2" fill="none"/>`;
        }
        case 'monitor': {
            const inset = Math.min(b.width, b.height) * 0.12;
            const screenH = b.height * 0.62;
            const standTop = b.y + inset + screenH;
            const standH = Math.min(14, b.height - inset - screenH - 4);
            return `<rect x="${num(b.x + inset)}" y="${num(b.y + inset)}" width="${num(b.width - inset * 2)}" height="${num(screenH)}" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>` +
                `<path d="M${num(cx)},${num(standTop)} V${num(standTop + standH * 0.6)} M${num(cx - b.width * 0.15)},${num(standTop + standH)} H${num(cx + b.width * 0.15)}" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" fill="none"/>`;
        }
        case 'camera': {
            const cyy = cy - (shape.label ? b.height * 0.06 : 0);
            const r = Math.min(b.width, b.height) * 0.22;
            return `<circle cx="${num(cx)}" cy="${num(cyy)}" r="${num(r)}" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.85)" stroke-width="2"/>` +
                `<circle cx="${num(cx)}" cy="${num(cyy)}" r="${num(r * 0.45)}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2"/>` +
                `<rect x="${num(cx + r * 0.6)}" y="${num(cyy - r * 1.35)}" width="${num(r * 0.9)}" height="${num(r * 0.5)}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2"/>`;
        }
        case 'power_supply': {
            const cyy = cy - (shape.label ? b.height * 0.06 : 0);
            const s = Math.min(b.width, b.height) * 0.22;
            const pts = [
                { x: cx + s * 0.25, y: cyy - s }, { x: cx - s * 0.45, y: cyy + s * 0.15 }, { x: cx + s * 0.02, y: cyy + s * 0.15 },
                { x: cx - s * 0.25, y: cyy + s }, { x: cx + s * 0.45, y: cyy - s * 0.15 }, { x: cx - s * 0.02, y: cyy - s * 0.15 }
            ];
            return `<polygon points="${pointsAttr(pts)}" fill="#FFD54F" stroke="rgba(0,0,0,0.35)" stroke-width="1"/>`;
        }
        case 'led_distro': {
            const cyy = cy - (shape.label ? b.height * 0.08 : 0);
            const size = Math.min(b.width, b.height) * 0.28;
            const w = Math.min(b.width * 0.6, 60);
            const step = w / 4;
            const y = cyy + size * 0.65;
            let out = `<text x="${num(cx)}" y="${num(cyy - size * 0.15)}" font-family="Arial, sans-serif" font-weight="bold" font-size="${num(size)}" fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="middle">XD</text>`;
            for (let i = 0; i < 4; i++) {
                const ox = cx - w / 2 + step * i + step / 2;
                out += `<rect x="${num(ox - step * 0.3)}" y="${num(y - 3)}" width="${num(step * 0.6)}" height="6" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1"/>`;
            }
            return out;
        }
        case 'kvm': {
            const cyy = cy - (shape.label ? b.height * 0.06 : 0);
            const s = Math.min(b.width, b.height) * 0.24;
            let out = `<rect x="${num(cx - s)}" y="${num(cyy - s)}" width="${num(s * 2)}" height="${num(s * 1.2)}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.5"/>` +
                `<rect x="${num(cx - s * 0.9)}" y="${num(cyy + s * 0.45)}" width="${num(s * 1.8)}" height="${num(s * 0.5)}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.5"/>`;
            for (let i = 0; i < 4; i++) {
                const kx = cx - s * 0.65 + i * s * 0.43;
                out += `<path d="M${num(kx)},${num(cyy + s * 0.6)} H${num(kx + s * 0.2)}" stroke="rgba(255,255,255,0.85)" stroke-width="1.5"/>`;
            }
            return out;
        }
        default:
            return '';
    }
}

function shapeSvg(shape, options) {
    if (shape.visible === false) return '';
    const b = shape.getBounds();
    const attrs = styleAttrs(shape);
    const filter = shape.shadow ? ' filter="url(#morph-shadow)"' : '';
    let body = '';
    switch (shape.type) {
        case 'rectangle':
            body = shape.cornerRadius > 0
                ? `<path d="${roundedRectPath(b, shape.cornerRadius)}" ${attrs}${filter}/>`
                : `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.width)}" height="${num(b.height)}" ${attrs}${filter}/>`;
            break;
        case 'circle':
            body = `<ellipse cx="${num(b.x + b.width / 2)}" cy="${num(b.y + b.height / 2)}" rx="${num(b.width / 2)}" ry="${num(b.height / 2)}" ${attrs}${filter}/>`;
            break;
        case 'diamond':
        case 'hexagon':
        case 'parallelogram':
        case 'network_switch':
        case 'sync_generator':
            body = `<polygon points="${pointsAttr(shape.getPoints())}" ${attrs}${filter}/>`;
            break;
        case 'cylinder':
            body = `<path d="${capsulePath(b)}" ${attrs}${filter}/>`;
            break;
        case 'device':
            body = `<path d="${roundedRectPath(b, shape.cornerRadius || 0)}" ${attrs}${filter}/>`;
            break;
        case 'text': {
            const layout = shape.getTextLayout();
            const anchor = shape.textAlign === 'center' ? 'middle' : shape.textAlign === 'right' ? 'end' : 'start';
            const tspans = layout.lines.map((line, i) =>
                `<tspan x="${num(layout.x)}" y="${num(layout.firstY + i * layout.lineHeight)}">${escapeXml(line)}</tspan>`).join('');
            body = `<text font-family="${escapeXml(shape.fontFamily)}" font-size="${num(shape.fontSize)}" font-weight="${escapeXml(shape.fontWeight)}" font-style="${escapeXml(shape.fontStyle)}" fill="${escapeXml(shape.fill)}" text-anchor="${anchor}" dominant-baseline="middle">${tspans}</text>`;
            break;
        }
        case 'image': {
            const border = shape.stroke && shape.stroke !== 'transparent'
                ? `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.width)}" height="${num(b.height)}" fill="none" stroke="${escapeXml(shape.stroke)}" stroke-width="${num(shape.strokeWidth)}"/>` : '';
            body = shape.imageData
                ? `<image href="${escapeXml(shape.imageData)}" x="${num(b.x)}" y="${num(b.y)}" width="${num(b.width)}" height="${num(b.height)}" opacity="${num(shape.opacity ?? 1)}" preserveAspectRatio="none"/>${border}`
                : `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.width)}" height="${num(b.height)}" fill="#ecf0f1" stroke="#bdc3c7"/>`;
            break;
        }
        case 'connector_anchor': {
            const c = shape.getCenter();
            const r = Math.abs(shape.width) / 2;
            const tint = shape.connectionType ? ConnectionTypeRegistry.colorFor(shape.connectionType) : shape.stroke;
            body = `<circle cx="${num(c.x)}" cy="${num(c.y)}" r="${num(r)}" fill="${escapeXml(shape.fill)}" stroke="${escapeXml(tint)}" stroke-width="${num(shape.strokeWidth)}"/>` +
                `<circle cx="${num(c.x)}" cy="${num(c.y)}" r="${num(r * 0.4)}" fill="${escapeXml(tint)}"/>`;
            break;
        }
        default:
            body = `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.width)}" height="${num(b.height)}" ${attrs}${filter}/>`;
    }
    return `<g data-id="${escapeXml(shape.id)}" data-type="${escapeXml(shape.type)}"${transformAttr(shape)}>${body}${iconSvg(shape)}${labelSvg(shape)}</g>`;
}

function arrowSvg(point, angle, color, strokeWidth) {
    const scale = Math.max(1, strokeWidth / 2);
    const len = 12 * scale;
    const wid = 6 * scale;
    const pts = [
        point,
        { x: point.x - len * Math.cos(angle) + wid * Math.cos(angle + Math.PI / 2), y: point.y - len * Math.sin(angle) + wid * Math.sin(angle + Math.PI / 2) },
        { x: point.x - len * Math.cos(angle) - wid * Math.cos(angle + Math.PI / 2), y: point.y - len * Math.sin(angle) - wid * Math.sin(angle + Math.PI / 2) }
    ];
    return `<polygon points="${pointsAttr(pts)}" fill="${escapeXml(color)}"/>`;
}

function connectorSvg(conn) {
    if (conn.visible === false) return '';
    const start = conn.getStartPoint();
    const end = conn.getEndPoint();
    if (!start || !end) return '';
    const dash = conn.lineStyle === 'dashed' ? ' stroke-dasharray="10 5"' : conn.lineStyle === 'dotted' ? ' stroke-dasharray="2 4"' : '';
    let path;
    if (conn.style === 'bezier') {
        const cp1 = conn.controlPoint1 || conn.getDefaultControlPoint1();
        const cp2 = conn.controlPoint2 || conn.getDefaultControlPoint2();
        path = `M${num(start.x)},${num(start.y)} C${num(cp1.x)},${num(cp1.y)} ${num(cp2.x)},${num(cp2.y)} ${num(end.x)},${num(end.y)}`;
    } else {
        const pts = conn.getPathPoints();
        path = 'M' + pts.map(p => `${num(p.x)},${num(p.y)}`).join(' L');
    }
    let out = `<path d="${path}" fill="none" stroke="${escapeXml(conn.stroke)}" stroke-width="${num(conn.strokeWidth)}" stroke-linejoin="round"${dash}/>`;
    const angles = conn.getArrowAngles();
    if (angles) {
        if (conn.arrowStart) out += arrowSvg(start, angles.start, conn.stroke, conn.strokeWidth);
        if (conn.arrowEnd) out += arrowSvg(end, angles.end, conn.stroke, conn.strokeWidth);
    }
    const label = conn.getLabelLayout();
    if (label) {
        out += `<rect x="${num(label.x - label.width / 2)}" y="${num(label.y - label.height / 2)}" width="${num(label.width)}" height="${num(label.height)}" fill="#ffffff" fill-opacity="0.92" stroke="${escapeXml(conn.stroke)}" stroke-width="1"/>` +
            `<text x="${num(label.x)}" y="${num(label.y)}" font-family="Arial, sans-serif" font-size="${label.fontSize}" fill="#2c3e50" text-anchor="middle" dominant-baseline="middle">${escapeXml(label.text)}</text>`;
    }
    return `<g data-id="${escapeXml(conn.id)}" data-type="connector">${out}</g>`;
}

function portsSvg(shape, usage, options) {
    if (!shape.getAnchorPoints) return '';
    const anchors = shape.getAnchorPoints();
    let out = '';
    for (const [key, a] of Object.entries(anchors)) {
        if (key === 'center') continue;
        if (!a.connectionType && shape.type !== 'connector_anchor' && !options.showGenericAnchors) continue;
        if (shape.type === 'connector_anchor') continue;
        const color = ConnectionTypeRegistry.colorFor(a.connectionType);
        const used = usage.has(key);
        out += `<circle cx="${num(a.x)}" cy="${num(a.y)}" r="4" fill="${used ? color : '#ffffff'}" stroke="${used ? '#ffffff' : color}" stroke-width="1.5"/>`;
        if (options.showPortLabels && a.connectionType) {
            const inward = a.normal ? { x: -a.normal.x, y: -a.normal.y } : { x: 0, y: 0 };
            const tx = a.x + inward.x * 8;
            const ty = a.y + inward.y * 8;
            const anchor = Math.abs(inward.x) < 0.5 ? 'middle' : (inward.x > 0 ? 'start' : 'end');
            out += `<text x="${num(tx)}" y="${num(ty)}" font-family="Arial, sans-serif" font-size="8" fill="${contrastColor(shape.fill)}" text-anchor="${anchor}" dominant-baseline="middle">${escapeXml(a.label || portLabel(key))}</text>`;
        }
    }
    return out ? `<g data-ports-of="${escapeXml(shape.id)}">${out}</g>` : '';
}

/**
 * Renders objects to an SVG document string.
 * @param {Array} objects Shapes and connectors (as held by a {@link module:core/Diagram~Diagram}).
 * @param {Object} [options]
 * @param {number} [options.padding=40] Margin around the content.
 * @param {string|null} [options.background='#ffffff'] Background colour, or null for transparent.
 * @param {boolean} [options.showPorts=true] Draw port dots on system objects.
 * @param {boolean} [options.showPortLabels=false] Draw port names next to the dots.
 * @param {boolean} [options.showGenericAnchors=false] Draw the side anchors of basic shapes.
 * @param {{x:number,y:number,width:number,height:number}} [options.bounds] Explicit view box (defaults to content bounds).
 * @param {{ids: (Set<string>|string[]), mode: ("dim"|"hide")}} [options.highlight] View filter: objects whose id is not
 *   in `ids` are drawn faded (`dim`) or left out (`hide`).
 * @returns {string}
 */
export function diagramToSvg(objects, options = {}) {
    const opts = { padding: 40, background: '#ffffff', showPorts: true, showPortLabels: false, showGenericAnchors: false, ...options };
    const highlight = opts.highlight && opts.highlight.ids ? { ids: new Set(opts.highlight.ids), mode: opts.highlight.mode === 'hide' ? 'hide' : 'dim' } : null;
    if (highlight && highlight.mode === 'hide') objects = objects.filter(o => highlight.ids.has(o.id));
    const faded = obj => !!(highlight && highlight.mode === 'dim' && !highlight.ids.has(obj.id));
    const shapes = objects.filter(o => o.type !== 'connector');
    const connectors = objects.filter(o => o.type === 'connector');

    let bounds = opts.bounds;
    if (!bounds) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const include = (x, y) => { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); };
        for (const s of shapes) {
            if (s.visible === false) continue;
            (s.getRotatedBounds ? s.getRotatedBounds() : []).forEach(c => include(c.x, c.y));
            const layout = s.getLabelLayout ? s.getLabelLayout() : null;
            if (layout) {
                include(layout.x, layout.y - layout.lineHeight * layout.lines.length / 2);
                include(layout.x, layout.y + layout.lineHeight * layout.lines.length / 2);
            }
        }
        for (const c of connectors) c.getPathPoints().forEach(p => include(p.x, p.y));
        if (!Number.isFinite(minX)) { minX = 0; minY = 0; maxX = 200; maxY = 100; }
        bounds = { x: minX - opts.padding, y: minY - opts.padding, width: maxX - minX + opts.padding * 2, height: maxY - minY + opts.padding * 2 };
    }

    const usageByShape = new Map();
    for (const s of shapes) usageByShape.set(s, new Set());
    for (const c of connectors) {
        if (usageByShape.has(c.startObject)) usageByShape.get(c.startObject).add(c.startAnchor);
        if (usageByShape.has(c.endObject)) usageByShape.get(c.endObject).add(c.endAnchor);
    }

    const sorted = [...objects].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const parts = [];
    for (const obj of sorted) {
        const markup = obj.type === 'connector' ? connectorSvg(obj) : shapeSvg(obj, opts);
        parts.push(faded(obj) && markup ? `<g opacity="0.12">${markup}</g>` : markup);
    }
    if (opts.showPorts) {
        for (const s of shapes) {
            if (s.visible === false || faded(s)) continue;
            parts.push(portsSvg(s, usageByShape.get(s) || new Set(), opts));
        }
    }

    const bg = opts.background
        ? `<rect x="${num(bounds.x)}" y="${num(bounds.y)}" width="${num(bounds.width)}" height="${num(bounds.height)}" fill="${escapeXml(opts.background)}"/>` : '';
    return `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${num(bounds.width)}" height="${num(bounds.height)}" viewBox="${num(bounds.x)} ${num(bounds.y)} ${num(bounds.width)} ${num(bounds.height)}">\n` +
        `<defs><filter id="morph-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/></filter></defs>\n` +
        bg + '\n' + parts.filter(Boolean).join('\n') + '\n</svg>\n';
}
