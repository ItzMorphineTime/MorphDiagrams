import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(here, '..', 'mcp', 'server.js');

function parse(result) {
    assert.ok(!result.isError, result.content?.[0]?.text);
    const txt = result.content[0].text;
    try { return JSON.parse(txt); } catch { return txt; }
}

test('MCP server: end-to-end diagram building over stdio', async (t) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'morph-mcp-'));
    const transport = new StdioClientTransport({
        command: process.execPath,
        args: [serverPath],
        env: { ...process.env, MORPH_DIAGRAM_DIR: dir, MORPH_HTTP_PORT: 'off' },
        stderr: 'pipe'
    });
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    await client.connect(transport);
    t.after(async () => {
        await client.close();
        fs.rmSync(dir, { recursive: true, force: true });
    });

    const tools = await client.listTools();
    const names = tools.tools.map(x => x.name);
    for (const expected of ['list_shape_types', 'add_device', 'connect', 'connect_many', 'auto_layout', 'validate_diagram', 'save_diagram', 'render_svg', 'undo']) {
        assert.ok(names.includes(expected), `missing tool ${expected}`);
    }

    const types = parse(await client.callTool({ name: 'list_shape_types', arguments: { category: 'system' } }));
    assert.ok(types.some(d => d.type === 'device' && d.hasPorts));

    parse(await client.callTool({ name: 'define_connection_type', arguments: { id: 'dante', label: 'Dante', bidirectional: true } }));
    const ctypes = parse(await client.callTool({ name: 'list_connection_types', arguments: {} }));
    assert.ok(ctypes.some(c => c.id === 'dante' && c.bidirectional));

    const created = parse(await client.callTool({ name: 'new_diagram', arguments: { name: 'Test rig', path: 'rig.json' } }));
    assert.ok(created.path.endsWith('rig.json'));

    const srv = parse(await client.callTool({ name: 'add_device', arguments: { type: 'server', label: 'Media Server', id: 'srv', ports: { video: { input: 0, output: 2 }, dante: { input: 1, output: 1 } } } }));
    assert.deepEqual(srv.ports, ['dante_input_0', 'video_output_0', 'video_output_1', 'dante_output_0']);
    parse(await client.callTool({ name: 'add_device', arguments: { type: 'led_processor', label: 'LED Wall', id: 'led' } }));
    parse(await client.callTool({ name: 'add_device', arguments: { type: 'device', label: 'Audio DSP', id: 'dsp', ports: { dante: { input: 2, output: 2 } } } }));

    const c1 = parse(await client.callTool({ name: 'connect', arguments: { from: 'Media Server', to: 'LED Wall', fromPort: 'video', label: 'PGM' } }));
    assert.equal(c1.connected.fromPort, 'video_output_0');
    assert.equal(c1.connected.toPort, 'video_input_0');

    const many = parse(await client.callTool({ name: 'connect_many', arguments: { connections: [
        { from: 'srv', to: 'led', fromPort: 'video_output_1' },
        { from: 'srv', to: 'dsp', fromPort: 'dante' },
        { from: 'srv', to: 'led', fromPort: 'video' }
    ] } }));
    assert.equal(many.created, 2);
    assert.equal(many.failed, 1);
    assert.match(many.results[2].error, /already connected/);

    const bad = await client.callTool({ name: 'connect', arguments: { from: 'srv', to: 'nope' } });
    assert.equal(bad.isError, true);
    assert.match(bad.content[0].text, /No object with id or label/);

    const layout = parse(await client.callTool({ name: 'auto_layout', arguments: { direction: 'LR' } }));
    assert.equal(layout.layers[0][0], 'srv');

    const validation = parse(await client.callTool({ name: 'validate_diagram', arguments: {} }));
    assert.equal(validation.valid, true, JSON.stringify(validation));

    const trace = parse(await client.callTool({ name: 'trace_signal_path', arguments: { from: 'Media Server', direction: 'downstream', connectionTypes: ['video'] } }));
    assert.deepEqual(trace.shapes.map(s => s.id), ['srv', 'led']);
    assert.equal(trace.shapes[1].depth, 1);
    assert.match(trace.summary, /→ LED Wall/);
    const upstream = parse(await client.callTool({ name: 'trace_signal_path', arguments: { from: ['dsp'], direction: 'upstream' } }));
    assert.deepEqual(upstream.shapes.map(s => s.id), ['dsp', 'srv']);

    const portCount = parse(await client.callTool({ name: 'set_port_count', arguments: { ref: 'led', portType: 'sdi', input: 2 } }));
    assert.ok(portCount.ports.includes('sdi_input_1'));

    const desc = parse(await client.callTool({ name: 'describe_object', arguments: { ref: 'led' } }));
    assert.equal(desc.ports.find(p => p.key === 'video_input_0').connections.length, 1);

    const saved = parse(await client.callTool({ name: 'save_diagram', arguments: {} }));
    assert.ok(fs.existsSync(saved.path));
    const doc = JSON.parse(fs.readFileSync(saved.path, 'utf8'));
    assert.equal(doc.version, '2.1');
    assert.equal(doc.metadata.name, 'Test rig');
    assert.ok(doc.connectionTypes.dante);
    assert.equal(doc.objects.filter(o => o.type === 'connector').length, 3);

    const svg = parse(await client.callTool({ name: 'render_svg', arguments: { path: 'rig.svg', showPortLabels: true } }));
    assert.ok(fs.readFileSync(svg.path, 'utf8').includes('Media Server'));
    const inline = await client.callTool({ name: 'render_svg', arguments: {} });
    assert.ok(inline.content[0].text.startsWith('<?xml'));

    parse(await client.callTool({ name: 'remove_object', arguments: { ref: 'dsp' } }));
    const undone = parse(await client.callTool({ name: 'undo', arguments: {} }));
    assert.equal(undone.ok, true);
    const found = parse(await client.callTool({ name: 'find_objects', arguments: { query: 'dsp' } }));
    assert.equal(found.length, 1);

    const reopened = parse(await client.callTool({ name: 'open_diagram', arguments: { path: 'rig.json' } }));
    assert.match(reopened.summary, /Media Server/);

    const resources = await client.listResources();
    assert.ok(resources.resources.some(r => r.uri === 'morph://schema/diagram'));
    const schema = await client.readResource({ uri: 'morph://schema/diagram' });
    assert.ok(JSON.parse(schema.contents[0].text).definitions.connector);
    const svgRes = await client.readResource({ uri: 'morph://diagram/current.svg' });
    assert.ok(svgRes.contents[0].text.includes('<svg'));

    const prompt = await client.getPrompt({ name: 'build_system_diagram', arguments: { brief: 'two cameras into a switcher' } });
    assert.match(prompt.messages[0].content.text, /two cameras into a switcher/);
});
