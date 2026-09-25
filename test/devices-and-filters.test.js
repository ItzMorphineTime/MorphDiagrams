import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Diagram } from '../js/core/Diagram.js';
import { ShapeRegistry } from '../js/core/ShapeRegistry.js';
import { ConnectionTypeRegistry } from '../js/config/ConnectionTypes.js';
import { diagramToSvg } from '../js/core/SvgExporter.js';

test('new device types register with sensible default ports', () => {
    const expectations = {
        monitor: ['video_input_0', 'sdi_input_0', 'power_input_0', 'video_output_0'],
        camera: ['sdi_input_0', 'network_input_0', 'power_input_0', 'sdi_output_0', 'sdi_output_1'],
        power_supply: ['power_input_0', 'network_input_0', 'power_output_0', 'power_output_7'],
        led_distro: ['video_input_0', 'fibre_input_0', 'power_input_0', 'video_output_7', 'power_output_7'],
        kvm: ['video_input_3', 'usb_input_0', 'network_input_0', 'video_output_0', 'usb_output_3']
    };
    for (const [type, keys] of Object.entries(expectations)) {
        const def = ShapeRegistry.get(type);
        assert.ok(def && def.category === 'system' && def.hasPorts, type);
        const shape = ShapeRegistry.create(type, 0, 0);
        const anchors = shape.getAnchorPoints();
        for (const key of keys) assert.ok(anchors[key], `${type} should expose ${key}`);
        assert.ok(shape.toJSON().ports, `${type} serialises ports`);
        assert.ok(diagramToSvg([shape]).includes(`data-type="${type}"`), `${type} renders to SVG`);
    }
});

test('fibre, power and wifi are built-in connection types', () => {
    ConnectionTypeRegistry.reset();
    const fibre = ConnectionTypeRegistry.get('fibre');
    const power = ConnectionTypeRegistry.get('power');
    const wifi = ConnectionTypeRegistry.get('wifi');
    assert.ok(fibre && fibre.builtin && fibre.bidirectional);
    assert.ok(power && power.builtin && !power.bidirectional);
    assert.ok(wifi && wifi.builtin && wifi.bidirectional);
    assert.equal(ConnectionTypeRegistry.lineStyleFor('wifi'), 'dashed');
    assert.equal(ConnectionTypeRegistry.lineStyleFor('video'), 'solid');
    assert.equal(ConnectionTypeRegistry.toJSON().wifi.lineStyle, 'dashed');
    assert.equal(ConnectionTypeRegistry.toJSON().video.lineStyle, undefined);

    const d = new Diagram();
    d.createShape('power_supply', { id: 'psu', label: 'PDU' });
    d.createShape('camera', { id: 'cam', label: 'Cam 1' });
    d.createShape('device', { id: 'ap', label: 'Access point', ports: { wifi: { input: 1, output: 1 }, network: { input: 1, output: 0 } } });
    d.createShape('device', { id: 'tablet', label: 'Tablet', ports: { wifi: { input: 1, output: 1 } } });
    const pwr = d.connect({ from: 'psu', to: 'cam', connectionType: 'power' });
    assert.equal(pwr.startAnchor, 'power_output_0');
    assert.equal(pwr.endAnchor, 'power_input_0');
    assert.equal(pwr.lineStyle, 'solid');
    const wl = d.connect({ from: 'ap', to: 'tablet', connectionType: 'wifi' });
    assert.equal(wl.lineStyle, 'dashed', 'wifi links default to dashed');
    assert.throws(() => d.connect({ from: 'cam', to: 'psu', fromPort: 'power_input_0', toPort: 'power_input_0', allowOccupied: true }), /inputs/);
});

function rig() {
    const d = new Diagram();
    d.createShape('sync_generator', { id: 'sync', label: 'Sync' });
    d.createShape('camera', { id: 'cam', label: 'Camera' });
    d.createShape('video_matrix', { id: 'mtx', label: 'Matrix' });
    d.createShape('led_processor', { id: 'proc', label: 'Processor' });
    d.createShape('led_distro', { id: 'xd', label: 'XD' });
    d.createShape('network_switch', { id: 'sw', label: 'Switch' });
    d.createShape('power_supply', { id: 'psu', label: 'PDU' });
    d.createShape('text', { id: 'note', text: 'Stage left' });
    d.connect({ from: 'sync', to: 'cam', fromPort: 'sdi' });
    d.connect({ from: 'cam', to: 'mtx', fromPort: 'sdi' });
    d.connect({ from: 'mtx', to: 'proc', fromPort: 'video' });
    d.connect({ from: 'proc', to: 'xd', fromPort: 'video' });
    d.connect({ from: 'sw', to: 'cam', connectionType: 'network' });
    d.connect({ from: 'psu', to: 'xd', connectionType: 'power' });
    return d;
}

test('tracePath follows signal direction and treats network links as undirected', () => {
    const d = rig();
    const down = d.tracePath(['cam'], 'downstream');
    assert.deepEqual(down.shapes.map(s => s.id), ['cam', 'mtx', 'sw', 'proc', 'xd']);
    assert.equal(down.shapes.find(s => s.id === 'xd').depth, 3);
    assert.equal(down.connectors.length, 4);

    const up = d.tracePath(['cam'], 'upstream');
    assert.deepEqual(up.shapes.map(s => s.id).sort(), ['cam', 'sw', 'sync']);

    const videoOnly = d.tracePath(['cam'], 'downstream', { connectionTypes: ['sdi', 'video'] });
    assert.deepEqual(videoOnly.shapes.map(s => s.id), ['cam', 'mtx', 'proc', 'xd']);

    const limited = d.tracePath('cam', 'downstream', { maxDepth: 1 });
    assert.deepEqual(limited.shapes.map(s => s.id).sort(), ['cam', 'mtx', 'sw']);

    const both = d.tracePath(['mtx'], 'both');
    assert.equal(both.shapes.length, 7, 'everything except the text note is connected');
});

test('tracePath does not transit through network switches unless asked', () => {
    const d = new Diagram();
    d.createShape('camera', { id: 'cam', label: 'Cam' });
    d.createShape('network_switch', { id: 'sw', label: 'Switch' });
    d.createShape('server', { id: 'srv', label: 'Server', ports: { network: { input: 1, output: 0 }, video: { input: 0, output: 1 } } });
    d.createShape('monitor', { id: 'mon', label: 'Monitor' });
    d.connect({ from: 'sw', to: 'cam', connectionType: 'network' });
    d.connect({ from: 'sw', to: 'srv', connectionType: 'network' });
    d.connect({ from: 'srv', to: 'mon', fromPort: 'video' });

    const hop = d.tracePath(['cam'], 'downstream');
    assert.deepEqual(hop.shapes.map(s => s.id), ['cam', 'sw'], 'the switch is reached but not transited');
    const full = d.tracePath(['cam'], 'downstream', { bidirectional: 'full' });
    assert.deepEqual(full.shapes.map(s => s.id), ['cam', 'sw', 'srv', 'mon']);
    const none = d.tracePath(['cam'], 'downstream', { bidirectional: 'none' });
    assert.deepEqual(none.shapes.map(s => s.id), ['cam']);
    const fromSwitch = d.tracePath(['sw'], 'both');
    assert.deepEqual(fromSwitch.shapes.map(s => s.id).sort(), ['cam', 'srv', 'sw'], 'a switch still lists its neighbours');
    const filtered = d.computeFilter({ trace: { from: ['cam'], direction: 'downstream', bidirectional: 'full' } });
    assert.equal(filtered.shapes, 4);
});

test('computeFilter narrows by connection type, shape type and trace', () => {
    const d = rig();
    const none = d.computeFilter({});
    assert.equal(none.active, false);
    assert.equal(none.ids.size, d.objects.length);

    const power = d.computeFilter({ connectionTypes: ['power'] });
    assert.equal(power.active, true);
    assert.ok(power.ids.has('psu') && power.ids.has('xd'), 'devices carrying power ports are kept');
    assert.ok(!power.ids.has('sw') && !power.ids.has('note'), 'unrelated objects are dropped');
    assert.equal(power.connectors, 1);

    const cams = d.computeFilter({ shapeTypes: ['camera', 'video_matrix'] });
    assert.deepEqual([...cams.ids].filter(id => !id.startsWith('conn')).sort(), ['cam', 'mtx']);
    assert.equal(cams.connectors, 1, 'only the link between kept shapes survives');

    const path = d.computeFilter({ trace: { from: ['sync'], direction: 'downstream' }, connectionTypes: ['sdi', 'video'] });
    assert.deepEqual([...path.ids].filter(id => !id.startsWith('conn')).sort(), ['cam', 'mtx', 'proc', 'sync', 'xd']);
    assert.equal(path.connectors, 4);

    const svg = diagramToSvg(d.objects, { highlight: { ids: path.ids, mode: 'dim' } });
    assert.ok(svg.includes('opacity="0.12"'), 'non-matching objects are faded');
    const hidden = diagramToSvg(d.objects, { highlight: { ids: path.ids, mode: 'hide' } });
    assert.ok(!hidden.includes('data-id="psu"'));
    assert.ok(hidden.includes('data-id="cam"'));
});
