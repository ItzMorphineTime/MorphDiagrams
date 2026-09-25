/**
 * @module core/SmartGuides
 * @description Alignment guides for dragging: snaps a moving box to the edges and centres of the other
 * shapes when they are within a small distance, and returns the guide lines to draw.
 *
 * @example
 * const result = computeSmartGuides(movingBounds, otherBounds, { threshold: 6 });
 * moving.x += result.dx; moving.y += result.dy; drawGuides(result.guides);
 */

/**
 * @typedef {Object} Guide
 * @property {("x"|"y")} axis `x` for a vertical guide line at `pos`, `y` for a horizontal one.
 * @property {number} pos World coordinate of the line.
 * @property {number} from Start of the line along the other axis.
 * @property {number} to End of the line along the other axis.
 */

function edgesOf(b) {
    return {
        x: [b.x, b.x + b.width / 2, b.x + b.width],
        y: [b.y, b.y + b.height / 2, b.y + b.height]
    };
}

/**
 * Computes the snap offset and guide lines for a moving box.
 * @param {{x:number,y:number,width:number,height:number}} moving Bounds of the dragged selection at its intended position.
 * @param {Array<{x:number,y:number,width:number,height:number}>} others Bounds of the static shapes.
 * @param {{threshold: number}} [options] Snap distance in world units (default 6).
 * @returns {{dx:number, dy:number, guides: Guide[]}}
 */
export function computeSmartGuides(moving, others, options = {}) {
    const threshold = options.threshold ?? 6;
    const me = edgesOf(moving);
    let best = { x: null, y: null };

    for (const other of others) {
        const o = edgesOf(other);
        for (const axis of ['x', 'y']) {
            for (const mine of me[axis]) {
                for (const theirs of o[axis]) {
                    const delta = theirs - mine;
                    const dist = Math.abs(delta);
                    if (dist > threshold) continue;
                    if (!best[axis] || dist < best[axis].dist) {
                        best[axis] = { dist, delta, pos: theirs, other };
                    }
                }
            }
        }
    }

    const dx = best.x ? best.x.delta : 0;
    const dy = best.y ? best.y.delta : 0;
    const snapped = { x: moving.x + dx, y: moving.y + dy, width: moving.width, height: moving.height };
    const guides = [];
    if (best.x) {
        const o = best.x.other;
        guides.push({
            axis: 'x',
            pos: best.x.pos,
            from: Math.min(snapped.y, o.y) - 10,
            to: Math.max(snapped.y + snapped.height, o.y + o.height) + 10
        });
    }
    if (best.y) {
        const o = best.y.other;
        guides.push({
            axis: 'y',
            pos: best.y.pos,
            from: Math.min(snapped.x, o.x) - 10,
            to: Math.max(snapped.x + snapped.width, o.x + o.width) + 10
        });
    }
    return { dx, dy, guides };
}
