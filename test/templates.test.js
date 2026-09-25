import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Templates } from '../js/utils/Templates.js';
import { Diagram } from '../js/core/Diagram.js';
import { diagramToSvg } from '../js/core/SvgExporter.js';

test('XL virtual production volume template is complete and valid', () => {
    const def = Templates.getAllTemplates().find(t => t.id === 'vp-volume');
    assert.ok(def, 'template is registered');
    const { name, objects } = def.create();
    assert.match(name, /Virtual Production/);
    const d = new Diagram({ objects });
    const byType = {};
    d.shapes.forEach(s => { byType[s.type] = (byType[s.type] || 0) + 1; });

    assert.equal(d.shapes.filter(s => /^Render \d+$/.test(s.label)).length, 10, '10 render servers');
    d.shapes.filter(s => /^Render \d+$/.test(s.label)).forEach(s => assert.equal(s.ports.video.output, 2, 'two outputs each'));
    assert.equal(d.shapes.filter(s => /^Control \d$/.test(s.label)).length, 4, '4 control machines');
    assert.equal(d.shapes.filter(s => /^VLAN \d+/.test(s.label)).length, 4, '4 VLAN switches');
    assert.equal(d.shapes.filter(s => /^Comfort Monitor/.test(s.label)).length, 2);
    assert.equal(byType.kvm, 2);
    assert.equal(d.shapes.filter(s => /^Tracking Cam/.test(s.label)).length, 10);
    assert.equal(d.shapes.filter(s => /^Show Camera/.test(s.label)).length, 1);
    assert.equal(byType.led_processor, 4);
    assert.equal(byType.led_distro, 4);
    assert.equal(byType.power_supply, 4);
    assert.ok(d.connectors.length > 150, `dense wiring (${d.connectors.length} links)`);

    const v = d.validate();
    assert.deepEqual(v.errors, []);
    assert.ok(!v.warnings.some(w => w.includes('overlaps')), 'no overlapping devices');
    assert.ok(!v.warnings.some(w => w.includes('has no label')), 'every device is labelled');
    assert.ok(!v.warnings.some(w => /has \d+ connections/.test(w)), 'no port is used twice');

    // Every render server feeds the matrix, and the show camera reaches the comfort monitors.
    const fromRender1 = d.tracePath(['vp_render_1'], 'downstream', { connectionTypes: ['video'] });
    assert.ok(fromRender1.shapes.some(s => s.id === 'vp_matrix'));
    assert.ok(fromRender1.shapes.some(s => s.id === 'vp_wall_1'), 'video path reaches the LED wall');
    const fromCam = d.tracePath(['vp_show_cam'], 'downstream', { connectionTypes: ['sdi'] });
    assert.ok(fromCam.shapes.some(s => s.id === 'vp_monitor_1') && fromCam.shapes.some(s => s.id === 'vp_monitor_2'));
    const tracking = d.computeFilter({ shapeTypes: ['camera'] });
    assert.equal(tracking.shapes, 11, '10 tracking cameras + show camera');
    const power = d.computeFilter({ connectionTypes: ['power'] });
    assert.ok(power.shapes >= 30, 'power filter keeps every powered device');

    const svg = diagramToSvg(objects);
    assert.ok(svg.includes('VLAN 20'));
    const doc = d.toJSON();
    assert.equal(doc.objects.length, objects.length);
});
