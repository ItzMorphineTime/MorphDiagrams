import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Diagram } from '../js/core/Diagram.js';
import { computeSmartGuides } from '../js/core/SmartGuides.js';

test('insertWaypoint converts to a polyline and projects the point onto the nearest segment', () => {
    const d = new Diagram();
    d.createShape('rectangle', { id: 'a', x: 0, y: 0, width: 100, height: 50 });
    d.createShape('rectangle', { id: 'b', x: 400, y: 0, width: 100, height: 50 });
    const c = d.connect({ from: 'a', to: 'b', fromPort: 'right', toPort: 'left', style: 'straight' });
    assert.equal(c.style, 'straight');
    const idx = c.insertWaypoint(250, 40);
    assert.equal(c.style, 'polyline');
    assert.equal(idx, 0);
    assert.deepEqual(c.waypoints, [{ x: 250, y: 25 }], 'projected onto the straight segment');
    const idx2 = c.insertWaypoint(330, 10);
    assert.equal(idx2, 1);
    assert.equal(c.waypoints.length, 2);
    assert.ok(c.waypoints[1].x > c.waypoints[0].x, 'inserted in path order');
    assert.equal(c.findWaypointNear(252, 27, 5), 0);
    assert.equal(c.findWaypointNear(0, 0, 5), -1);
});

test('toPolyline keeps the orthogonal route and bezier approximation', () => {
    const d = new Diagram();
    d.createShape('server', { id: 's', x: 0, y: 0, ports: { video: { input: 0, output: 1 } } });
    d.createShape('led_processor', { id: 'l', x: 400, y: 300, ports: { video: { input: 1, output: 0 } } });
    const c = d.connect({ from: 's', to: 'l' });
    const before = c.getPathPoints();
    c.toPolyline();
    assert.equal(c.style, 'polyline');
    assert.deepEqual(c.getPathPoints(), before, 'same visible path after conversion');
    assert.equal(c.toPolyline(), false);

    const bez = d.connect({ from: 's', to: 'l', style: 'bezier', allowOccupied: true });
    bez.toPolyline();
    assert.equal(bez.waypoints.length, 6);
});

test('reverse swaps ends, arrows and waypoint order', () => {
    const d = new Diagram();
    d.createShape('rectangle', { id: 'a', x: 0, y: 0 });
    d.createShape('rectangle', { id: 'b', x: 400, y: 0 });
    const c = d.connect({ from: 'a', to: 'b', fromPort: 'right', toPort: 'left', waypoints: [{ x: 200, y: 0 }, { x: 300, y: 50 }] });
    c.reverse();
    assert.equal(c.startObject.id, 'b');
    assert.equal(c.startAnchor, 'left');
    assert.equal(c.endAnchor, 'right');
    assert.equal(c.arrowStart, true);
    assert.equal(c.arrowEnd, false);
    assert.deepEqual(c.waypoints, [{ x: 300, y: 50 }, { x: 200, y: 0 }]);
});

test('smart guides snap edges and centres within the threshold', () => {
    const others = [{ x: 100, y: 100, width: 120, height: 80 }];
    const near = computeSmartGuides({ x: 224, y: 300, width: 50, height: 50 }, others, { threshold: 6 });
    assert.equal(near.dx, -4, 'left edge 224 snaps to the other right edge at 220');
    assert.equal(near.dy, 0);
    assert.equal(near.guides.length, 1);
    assert.equal(near.guides[0].axis, 'x');
    assert.equal(near.guides[0].pos, 220);

    const centre = computeSmartGuides({ x: 500, y: 137, width: 20, height: 10 }, others, { threshold: 6 });
    assert.equal(centre.dy, -2, 'vertical centre 142 snaps to 140');
    const far = computeSmartGuides({ x: 900, y: 900, width: 20, height: 10 }, others, { threshold: 6 });
    assert.deepEqual(far, { dx: 0, dy: 0, guides: [] });
});

test('validate returns structured issues with object ids', () => {
    const d = new Diagram();
    d.createShape('device', { id: 'a', x: 0, y: 0, ports: { video: { input: 0, output: 1 } } });
    d.createShape('device', { id: 'b', x: 5, y: 5, ports: { video: { input: 1, output: 0 } } });
    d.connect({ from: 'a', to: 'b' });
    const v = d.validate();
    assert.ok(Array.isArray(v.issues));
    const overlap = v.issues.find(i => i.message.includes('overlaps'));
    assert.deepEqual(overlap.objectIds, ['a', 'b']);
    assert.equal(overlap.level, 'warning');
    assert.equal(v.warnings.length, v.issues.filter(i => i.level === 'warning').length);
});
