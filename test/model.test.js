import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Diagram, DiagramError } from '../js/core/Diagram.js';
import { ShapeRegistry } from '../js/core/ShapeRegistry.js';
import { Connector } from '../js/core/Connector.js';
import { ConnectionTypeRegistry, ConnectionColors } from '../js/config/ConnectionTypes.js';
import { anchorsCompatible, parsePortKey, portKey, expectedCounterpartPortType } from '../js/core/Ports.js';
import { validateDocument, parseDocument, createDocument, FORMAT_VERSION } from '../js/core/Serialization.js';
import { diagramToSvg } from '../js/core/SvgExporter.js';
import { SystemObject } from '../js/core/SystemObject.js';
import { Templates } from '../js/utils/Templates.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const sample = fs.readFileSync(path.join(here, '..', 'TestDiagram.json'), 'utf8');

test('registry creates every type with default sizes', () => {
    for (const def of ShapeRegistry.list()) {
        const shape = ShapeRegistry.create(def.type, 10, 20);
        assert.equal(shape.type, def.type);
        assert.equal(shape.x, 10);
        assert.equal(shape.y, 20);
        assert.ok(Math.abs(shape.width) > 0);
        assert.ok(typeof shape.getAnchorPoints === 'function');
        assert.ok(typeof shape.toJSON === 'function');
        assert.ok(shape.toJSON().type === def.type);
    }
    assert.throws(() => ShapeRegistry.create('nope', 0, 0), /Unknown shape type/);
});

test('system objects expose typed anchors on left/right edges in a stable order', () => {
    const srv = ShapeRegistry.create('server', 100, 100, 120, 180);
    const anchors = srv.getAnchorPoints();
    const keys = Object.keys(anchors);
    assert.deepEqual(keys.slice(0, 3), ['video_input_0', 'video_input_1', 'sdi_input_0']);
    assert.ok(keys.includes('video_output_1'));
    assert.equal(anchors.video_input_0.x, 100);
    assert.equal(anchors.video_output_0.x, 220);
    assert.equal(anchors.video_input_0.portType, 'input');
    assert.equal(anchors.video_input_0.connectionType, 'video');
    assert.deepEqual(anchors.video_input_0.normal, { x: -1, y: 0 });
    assert.equal(anchors.video_output_0.label, 'Video Out 1');

    const sw = ShapeRegistry.create('network_switch', 0, 0, 100, 100);
    const swAnchors = sw.getAnchorPoints();
    assert.equal(Object.keys(swAnchors).length, 12);
    for (const a of Object.values(swAnchors)) {
        assert.ok(a.y > 25 && a.y < 75, 'hex ports sit on the vertical edges');
    }
    assert.ok(sw.containsPoint(50, 50));
    assert.ok(!sw.containsPoint(2, 2), 'corners outside the hexagon are not hits');
});

test('rotation-aware anchors and hit testing', () => {
    const rect = ShapeRegistry.create('rectangle', 0, 0, 100, 50);
    rect.rotation = Math.PI / 2;
    const a = rect.getAnchorPoints();
    assert.ok(Math.abs(a.right.x - 50) < 1e-9 && Math.abs(a.right.y - 75) < 1e-9);
    assert.ok(Math.abs(a.right.normal.x) < 1e-9 && Math.abs(a.right.normal.y - 1) < 1e-9);
    assert.ok(rect.containsPoint(50, 70));
    assert.ok(!rect.containsPoint(95, 25));
    const circle = ShapeRegistry.create('circle', 0, 0, 100, 40);
    circle.rotation = Math.PI / 2;
    assert.ok(circle.containsPoint(50, 60));
    assert.ok(!circle.containsPoint(90, 20));
});

test('port helpers and compatibility rules', () => {
    assert.equal(portKey('video', 'input', 2), 'video_input_2');
    assert.deepEqual(parsePortKey('sdi_output_3'), { type: 'sdi', direction: 'output', index: 3 });
    assert.equal(parsePortKey('left'), null);
    assert.equal(expectedCounterpartPortType({ connectionType: 'video', portType: 'output' }), 'input');
    assert.equal(expectedCounterpartPortType({ connectionType: 'network', portType: 'output' }), null);
    assert.equal(anchorsCompatible({ connectionType: 'video', portType: 'output' }, { connectionType: 'video', portType: 'input' }).ok, true);
    assert.equal(anchorsCompatible({ connectionType: 'video', portType: 'output' }, { connectionType: 'sdi', portType: 'input' }).ok, false);
    assert.equal(anchorsCompatible({ connectionType: 'video', portType: 'output' }, { connectionType: 'video', portType: 'output' }).ok, false);
    assert.equal(anchorsCompatible({ connectionType: 'network', portType: 'output' }, { connectionType: 'network', portType: 'output' }).ok, true);
    const wild = anchorsCompatible({ connectionType: null, portType: 'both' }, { connectionType: 'usb', portType: 'input' });
    assert.equal(wild.ok, true);
    assert.equal(wild.connectionType, 'usb');
});

test('ports are validated and normalised', () => {
    assert.deepEqual(SystemObject.normalizePorts({ Video: { input: '2' }, sdi: { output: 1 } }), { video: { input: 2, output: 0 }, sdi: { input: 0, output: 1 } });
    assert.throws(() => SystemObject.normalizePorts({ video: { input: -1 } }), /integer/);
    assert.throws(() => SystemObject.normalizePorts({ 'bad type': { input: 1 } }), /invalid port type/);
    assert.throws(() => SystemObject.normalizePorts([]), /must be an object/);
});

test('sample diagram round-trips through the serializer', () => {
    const check = validateDocument(sample);
    assert.equal(check.valid, true, check.errors.join(';'));
    const { diagram, warnings } = Diagram.fromJSON(sample);
    assert.deepEqual(warnings, []);
    assert.equal(diagram.objects.length, 23);
    assert.equal(diagram.connectors.length, 11);
    for (const c of diagram.connectors) assert.equal(c.isDangling(), false);

    const doc = diagram.toJSON();
    assert.equal(doc.version, FORMAT_VERSION);
    const original = JSON.parse(sample);
    assert.deepEqual(doc.objects.map(o => o.id), original.objects.map(o => o.id));
    const again = Diagram.fromJSON(JSON.stringify(doc)).diagram;
    assert.equal(again.objects.length, 23);
    assert.deepEqual(again.shapes.find(s => s.type === 'server').ports, original.objects.find(o => o.type === 'server').ports);
    assert.deepEqual(diagram.validate().errors, []);
});

test('document validation reports structural problems', () => {
    const bad = validateDocument({ version: '2.1', objects: [{ id: 'a', type: 'rectangle', x: 0, y: 0, width: 'x', height: 1 }, { id: 'a', type: 'circle', x: 0, y: 0, width: 1, height: 1 }, { id: 'c', type: 'connector', startObject: 'a', endObject: 'zzz' }] });
    assert.equal(bad.valid, false);
    assert.ok(bad.errors.some(e => e.includes('duplicate id')));
    assert.ok(bad.errors.some(e => e.includes('"width" must be a finite number')));
    assert.ok(bad.errors.some(e => e.includes('endObject "zzz"')));
    assert.throws(() => parseDocument('{"objects": 5}'), /Invalid diagram file/);
    assert.equal(validateDocument('not json').valid, false);
});

test('connectors survive dangling ports and describe their path', () => {
    const d = new Diagram();
    const a = d.createShape('server', { id: 'a', x: 0, y: 0, ports: { video: { input: 0, output: 1 } } });
    const b = d.createShape('led_processor', { id: 'b', x: 400, y: 0, ports: { video: { input: 1, output: 0 } } });
    const c = d.connect({ from: 'a', to: 'b' });
    assert.equal(c.startAnchor, 'video_output_0');
    assert.equal(c.endAnchor, 'video_input_0');
    const pts = c.getPathPoints();
    assert.equal(pts[0].x, 120);
    assert.equal(pts[1].x, 140, 'orthogonal route leaves the port with a stub');
    assert.equal(pts[pts.length - 2].x, 380);
    assert.ok(c.containsPoint(260, pts[0].y, 3) || c.containsPoint(260, pts[pts.length - 1].y, 3));
    a.ports = { video: { input: 0, output: 0 } };
    assert.equal(c.isDangling(), true);
    assert.ok(c.getStartPoint(), 'falls back to the centre instead of vanishing');
    const v = d.validate();
    assert.ok(v.errors.some(e => e.includes('no longer exists')));
});

test('orthogonal routing goes around when the target is behind the port', () => {
    const route = Connector.orthogonalRoute({ x: 100, y: 100 }, { x: 0, y: 200 }, { x: 1, y: 0 }, { x: -1, y: 0 });
    assert.deepEqual(route[1], { x: 120, y: 100 });
    assert.deepEqual(route[route.length - 2], { x: -20, y: 200 });
    assert.equal(route.length, 6);
    const l = Connector.orthogonalRoute({ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 1, y: 0 }, { x: 0, y: -1 });
    assert.deepEqual(l, [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 80 }, { x: 100, y: 100 }]);
});

test('connect validates types, directions and occupancy with helpful errors', () => {
    const d = new Diagram();
    d.createShape('server', { id: 'srv', label: 'Server', ports: { video: { input: 0, output: 1 }, network: { input: 1, output: 0 } } });
    d.createShape('video_matrix', { id: 'mtx', label: 'Matrix', ports: { video: { input: 2, output: 2 } } });
    d.createShape('network_switch', { id: 'sw', label: 'Switch' });

    const c1 = d.connect({ from: 'Server', to: 'Matrix', label: 'PGM' });
    assert.equal(c1.connectionType, 'video');
    assert.equal(c1.stroke, ConnectionColors.video);
    assert.equal(c1.label, 'PGM');

    assert.throws(() => d.connect({ from: 'srv', to: 'mtx', fromPort: 'video' }), err => {
        assert.ok(err instanceof DiagramError);
        assert.match(err.message, /already connected/);
        return true;
    });
    assert.throws(() => d.connect({ from: 'srv', to: 'mtx', fromPort: 'video_output_0', toPort: 'video_input_1' }), /already connected/);
    const shared = d.connect({ from: 'srv', to: 'mtx', fromPort: 'video_output_0', toPort: 'video_input_1', allowOccupied: true });
    assert.equal(shared.endAnchor, 'video_input_1');
    assert.throws(() => d.connect({ from: 'mtx', to: 'mtx' }), /itself/);
    assert.throws(() => d.connect({ from: 'srv', to: 'sw', fromPort: 'video_output_0', toPort: 'network_input_0', allowOccupied: true }), /connection types differ/);
    assert.throws(() => d.connect({ from: 'mtx', to: 'mtx2' }), /No object with id or label/);

    const net = d.connect({ from: 'sw', to: 'srv', connectionType: 'network' });
    assert.equal(net.startAnchor, 'network_output_0');
    assert.equal(net.endAnchor, 'network_input_0');
    d.createShape('rectangle', { id: 'note', label: 'Note' });
    assert.throws(() => d.connect({ from: 'sw', to: 'mtx', fromPort: 'network_output_1', toPort: 'left' }), /No port matching "left"/);
    const net2 = d.connect({ from: 'sw', to: 'note', fromPort: 'network_output_1', toPort: 'left' });
    assert.equal(net2.connectionType, 'network', 'untyped side adopts the typed side');
    assert.equal(net2.endAnchor, 'left');

    assert.equal(d.disconnect({ id: net2.id }).length, 1);
    assert.equal(d.disconnect({ from: 'srv', to: 'mtx' }).length, 2);
    assert.equal(d.connectors.length, 1);
    const removed = d.remove('sw');
    assert.deepEqual(removed.sort(), ['sw', net.id].sort());
});

test('labels resolve objects and ambiguity is reported', () => {
    const d = new Diagram();
    d.createShape('device', { label: 'Enc' });
    d.createShape('device', { label: 'enc' });
    assert.throws(() => d.resolve('ENC'), /ambiguous/);
});

test('updateObject guards port shrinking and merges patches', () => {
    const d = new Diagram();
    const dev = d.createShape('device', { id: 'dev', ports: { hdmi: { input: 1, output: 1 } } });
    const sink = d.createShape('device', { id: 'sink', ports: { hdmi: { input: 1, output: 0 } } });
    d.connect({ from: 'dev', to: 'sink' });
    assert.throws(() => d.updateObject('dev', { ports: { hdmi: { input: 1, output: 0 } } }), /orphan/);
    const res = d.updateObject('dev', { ports: { hdmi: { input: 1, output: 0 } }, label: 'X', bogus: 1 }, { detachConnectors: true });
    assert.equal(res.removedConnectors.length, 1);
    assert.deepEqual(res.ignored, ['bogus']);
    assert.equal(dev.label, 'X');
    assert.throws(() => d.updateObject('dev', { ports: 'nope' }), DiagramError);
    assert.throws(() => d.updateObject('sink', { x: 'abc' }), /finite number/);
});

test('auto layout orders layers along the signal flow', () => {
    const d = new Diagram();
    d.createShape('sync_generator', { id: 'sync', x: 900, y: 900 });
    d.createShape('server', { id: 'srv', x: 0, y: 0, ports: { video: { input: 0, output: 2 }, sdi: { input: 1, output: 0 } } });
    d.createShape('video_matrix', { id: 'mtx', x: 5, y: 5 });
    d.createShape('led_processor', { id: 'led', x: 10, y: 10 });
    d.createShape('text', { id: 'note', text: 'Note' });
    d.connect({ from: 'sync', to: 'srv' });
    d.connect({ from: 'srv', to: 'mtx' });
    d.connect({ from: 'mtx', to: 'led' });
    const result = d.autoLayout({ direction: 'LR' });
    assert.deepEqual(result.layers, [['sync'], ['srv'], ['mtx'], ['led'], ['note']]);
    const x = id => d.getById(id).x;
    assert.ok(x('sync') < x('srv') && x('srv') < x('mtx') && x('mtx') < x('led') && x('led') < x('note'));
    assert.deepEqual(d.validate().errors, []);
    const tb = d.autoLayout({ direction: 'TB' });
    assert.equal(tb.layers.length, 5);
    const y = id => d.getById(id).y;
    assert.ok(y('sync') < y('srv') && y('srv') < y('mtx'));
});

test('grouped shapes move as a unit during layout', () => {
    const d = new Diagram();
    const box = d.createShape('rectangle', { id: 'box', x: 0, y: 0, width: 100, height: 50 });
    const txt = d.createShape('text', { id: 'txt', x: 0, y: 0, text: 'Hi' });
    const tgt = d.createShape('rectangle', { id: 'tgt', x: 500, y: 500 });
    d.group(['box', 'txt']);
    d.connect({ from: 'box', to: 'tgt' });
    d.autoLayout();
    assert.equal(box.x, txt.x);
    assert.equal(box.y, txt.y);
    assert.ok(tgt.x > box.x);
});

test('validation flags duplicates, overlaps and shared ports', () => {
    const d = new Diagram();
    d.createShape('device', { id: 'a', label: 'A', x: 0, y: 0, ports: { video: { input: 0, output: 1 } } });
    d.createShape('device', { id: 'b', label: 'B', x: 10, y: 10, ports: { video: { input: 1, output: 0 } } });
    d.connect({ from: 'a', to: 'b' });
    d.connect({ from: 'a', to: 'b', allowOccupied: true });
    const v = d.validate();
    assert.ok(v.warnings.some(w => w.includes('overlaps')));
    assert.ok(v.warnings.some(w => w.includes('duplicates')));
    assert.ok(v.warnings.some(w => w.includes('has 2 connections')));
});

test('custom connection types are registered, coloured and embedded in documents', () => {
    ConnectionTypeRegistry.register({ id: 'Fibre Channel', label: 'Fibre', bidirectional: true });
    assert.ok(ConnectionTypeRegistry.has('fibre_channel'));
    assert.equal(ConnectionTypeRegistry.isBidirectional('fibre_channel'), true);
    assert.match(ConnectionTypeRegistry.colorFor('fibre_channel'), /^#[0-9A-Fa-f]{6}$/);
    assert.equal(ConnectionColors.fibre_channel, ConnectionTypeRegistry.colorFor('fibre_channel'));
    const d = new Diagram();
    d.createShape('device', { id: 'x', ports: { fibre_channel: { input: 1, output: 1 } } });
    const doc = d.toJSON();
    assert.ok(doc.connectionTypes.fibre_channel);
    ConnectionTypeRegistry.reset();
    assert.equal(ConnectionTypeRegistry.has('fibre_channel'), false);
    parseDocument(doc);
    assert.equal(ConnectionTypeRegistry.has('fibre_channel'), true, 'loading a document re-registers its types');
    ConnectionTypeRegistry.reset();
    assert.equal(ConnectionColors.video, '#FFD700');
});

test('SVG export renders every object type and escapes text', () => {
    const { diagram } = Diagram.fromJSON(sample);
    diagram.createShape('text', { text: 'Tom & "Jerry" <3' });
    diagram.createShape('device', { label: 'Enc <1>', ports: { usb: { input: 1, output: 0 } } });
    const svg = diagramToSvg(diagram.objects, { showPortLabels: true });
    assert.ok(svg.startsWith('<?xml'));
    assert.ok(svg.includes('data-type="server"'));
    assert.ok(svg.includes('data-type="connector"'));
    assert.ok(svg.includes('Tom &amp; &quot;Jerry&quot; &lt;3'));
    assert.ok(svg.includes('Enc &lt;1&gt;'));
    assert.ok(svg.includes('USB In 1'));
    assert.ok(!/<[^>]*<3/.test(svg));
    for (const def of ShapeRegistry.list()) {
        const single = diagramToSvg([ShapeRegistry.create(def.type, 0, 0)]);
        assert.ok(single.includes(`data-type="${def.type}"`), def.type);
    }
});

test('templates build valid diagrams', () => {
    for (const t of Templates.getAllTemplates()) {
        const { objects } = t.create();
        const d = new Diagram({ objects });
        assert.deepEqual(d.validate().errors, [], t.name);
        const doc = createDocument({ objects });
        assert.equal(validateDocument(doc).valid, true, t.name);
    }
});
