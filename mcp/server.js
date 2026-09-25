#!/usr/bin/env node
/**
 * @module mcp/server
 * @description Model Context Protocol (MCP) server that lets an LLM agent build and edit Morph Diagrams
 * system diagrams: create devices with typed ports, connect ports with validation, auto-layout,
 * validate, render SVG and save the same JSON files the web editor opens.
 *
 * Transport: stdio (launch it from Claude Desktop, Claude Code, or any MCP client).
 *
 * Environment variables:
 * - `MORPH_DIAGRAM_DIR`  directory relative paths resolve against (default `<repo>/diagrams`)
 * - `MORPH_OPEN`         diagram file to open on start (optional)
 * - `MORPH_AUTOSAVE`     `0` disables writing the current file after every change (default on)
 * - `MORPH_HTTP_PORT`    port of the live browser view (default 8765, `off` to disable)
 * - `MORPH_MAX_UNDO`     undo depth (default 50)
 */

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { Diagram, DiagramError } from '../js/core/Diagram.js';
import { ShapeRegistry } from '../js/core/ShapeRegistry.js';
import { ConnectionTypeRegistry } from '../js/config/ConnectionTypes.js';
import { diagramToSvg } from '../js/core/SvgExporter.js';
import { validateDocument, FORMAT_VERSION } from '../js/core/Serialization.js';
import { Templates } from '../js/utils/Templates.js';
import { startBridge, REPO_ROOT } from './http-bridge.js';

const log = msg => process.stderr.write(`[morph-mcp] ${msg}\n`);

const DIAGRAM_DIR = path.resolve(process.env.MORPH_DIAGRAM_DIR || path.join(REPO_ROOT, 'diagrams'));
const AUTOSAVE = process.env.MORPH_AUTOSAVE !== '0';
const MAX_UNDO = Number(process.env.MORPH_MAX_UNDO) || 50;
const HTTP_PORT = (process.env.MORPH_HTTP_PORT || '8765').toLowerCase();

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
    diagram: new Diagram(),
    path: null,
    dirty: false,
    undo: [],
    bridge: null
};

function currentDocument() {
    return state.diagram.toJSON({ name: state.diagram.metadata.name });
}

function snapshot() {
    state.undo.push(JSON.stringify(currentDocument()));
    if (state.undo.length > MAX_UNDO) state.undo.shift();
}

async function afterChange(source = 'agent') {
    state.dirty = true;
    if (AUTOSAVE && state.path) {
        await writeDiagram(state.path);
    }
    if (state.bridge) state.bridge.notifyChange(source);
}

function resolvePath(p, ext) {
    if (!p) throw new DiagramError('A file path is required');
    let abs = path.isAbsolute(p) ? p : path.join(DIAGRAM_DIR, p);
    if (ext && !abs.toLowerCase().endsWith(ext)) abs += ext;
    return path.normalize(abs);
}

async function writeDiagram(target) {
    const doc = currentDocument();
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, JSON.stringify(doc, null, 2), 'utf8');
    state.path = target;
    state.dirty = false;
    return target;
}

function shapeSummary(obj) {
    if (!obj) return null;
    if (obj.type === 'connector') {
        return {
            id: obj.id,
            type: 'connector',
            from: obj.startObject ? obj.startObject.id : null,
            fromPort: obj.startAnchor,
            to: obj.endObject ? obj.endObject.id : null,
            toPort: obj.endAnchor,
            connectionType: obj.connectionType,
            style: obj.style,
            lineStyle: obj.lineStyle,
            label: obj.label || ''
        };
    }
    const out = {
        id: obj.id,
        type: obj.type,
        label: obj.label || '',
        x: Math.round(obj.x),
        y: Math.round(obj.y),
        width: Math.round(obj.width),
        height: Math.round(obj.height)
    };
    if (obj.ports) out.ports = obj.ports;
    if (obj.text !== undefined) out.text = obj.text;
    if (obj.groupId !== null && obj.groupId !== undefined) out.groupId = obj.groupId;
    if (obj.description) out.description = obj.description;
    return out;
}

function text(value) {
    return { content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] };
}

function failure(err) {
    const details = err && err.details && Object.keys(err.details).length ? '\n' + JSON.stringify(err.details, null, 2) : '';
    return { content: [{ type: 'text', text: `Error: ${err.message || err}${details}` }], isError: true };
}

/**
 * Wraps a tool handler: catches errors, snapshots before mutations and triggers autosave/live updates after.
 */
function tool(fn, { mutates = false } = {}) {
    return async (args, extra) => {
        try {
            if (mutates) snapshot();
            const result = await fn(args || {}, extra);
            if (mutates) await afterChange();
            return typeof result === 'object' && result && Array.isArray(result.content) ? result : text(result);
        } catch (err) {
            if (mutates) state.undo.pop();
            return failure(err);
        }
    };
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
const portsSchema = z.record(
    z.string().describe('connection type id, e.g. "video", "sdi", "network", "usb" or a custom type'),
    z.object({
        input: z.number().int().min(0).max(256).optional().describe('number of input ports'),
        output: z.number().int().min(0).max(256).optional().describe('number of output ports')
    })
).describe('Port map, e.g. { "video": { "input": 2, "output": 4 }, "network": { "input": 1, "output": 0 } }');

const refSchema = z.string().describe('object id or unique label');
const systemTypes = ShapeRegistry.list('system').map(d => d.type);
const basicTypes = ShapeRegistry.list('basic').map(d => d.type);
const styleSchema = z.enum(['straight', 'orthogonal', 'bezier', 'polyline']);
const lineStyleSchema = z.enum(['solid', 'dashed', 'dotted']);
const pointSchema = z.object({ x: z.number(), y: z.number() });

const connectionSpecShape = {
    from: refSchema.describe('source object (id or unique label)'),
    to: refSchema.describe('target object (id or unique label)'),
    fromPort: z.string().optional().describe('port on the source: exact key ("video_output_1"), type+direction ("video_output"), type ("video"), a side for basic shapes ("right"), or omit to pick the first free output automatically'),
    toPort: z.string().optional().describe('port on the target, same forms as fromPort; omit to pick the first free matching input'),
    connectionType: z.string().optional().describe('force/declare the connection type (needed when both ends are untyped basic shapes and you want a colour)'),
    style: styleSchema.optional().describe('path style, default orthogonal'),
    lineStyle: lineStyleSchema.optional(),
    label: z.string().optional().describe('text drawn on the connector, e.g. signal name'),
    arrowStart: z.boolean().optional(),
    arrowEnd: z.boolean().optional().describe('default true'),
    waypoints: z.array(pointSchema).optional().describe('intermediate points (forces polyline style)'),
    allowOccupied: z.boolean().optional().describe('allow attaching to a port that already has a connection'),
    id: z.string().optional().describe('custom connector id')
};

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------
const server = new McpServer({
    name: 'morph-diagrams',
    version: '2.1.0'
}, {
    instructions: [
        'Morph Diagrams MCP server: build hardware/system diagrams with typed input/output ports.',
        'Typical flow: list_shape_types -> (define_connection_type) -> new_diagram/open_diagram -> add_device (with label + ports) ->',
        'connect / connect_many -> auto_layout -> validate_diagram -> save_diagram / render_svg.',
        'Ports are keyed "<type>_<direction>_<index>" (e.g. video_output_0). connect() picks free ports automatically when you pass',
        'only a type ("video") or type+direction ("video_output"). Inputs sit on the left of a device, outputs on the right, so',
        'signal flow reads left-to-right after auto_layout. Objects can be referenced by id or by unique label.'
    ].join(' ')
});

// ---- catalogue -------------------------------------------------------------
server.registerTool('list_shape_types', {
    title: 'List shape types',
    description: 'Lists every shape type that can be created: system objects with typed ports (server, network_switch, video_matrix, led_processor, sync_generator, device, connector_anchor) and basic shapes (rectangle, circle, text, ...). Includes default sizes and default port maps.',
    inputSchema: { category: z.enum(['basic', 'system']).optional() },
    annotations: { readOnlyHint: true }
}, tool(({ category }) => ShapeRegistry.list(category).map(d => ({
    type: d.type,
    name: d.name,
    category: d.category,
    description: d.description,
    defaultSize: d.defaultSize,
    hasPorts: !!d.hasPorts,
    defaultPorts: d.defaultPorts ? d.defaultPorts() : undefined
}))));

server.registerTool('list_connection_types', {
    title: 'List connection types',
    description: 'Lists the registered connection (signal) types with their colours and whether they are bidirectional. Port maps may use any of these ids.',
    inputSchema: {},
    annotations: { readOnlyHint: true }
}, tool(() => ConnectionTypeRegistry.list()));

server.registerTool('define_connection_type', {
    title: 'Define connection type',
    description: 'Registers a new connection type (e.g. hdmi, dante, fibre, dmx, power) or updates an existing one. Custom types are stored inside the diagram file so the web editor shows the same colours.',
    inputSchema: {
        id: z.string().describe('short id, lowercase letters/digits/underscore'),
        label: z.string().optional(),
        color: z.string().optional().describe('hex colour like #FF00AA (auto-assigned when omitted)'),
        bidirectional: z.boolean().optional().describe('true when ports of this type can connect regardless of input/output direction (like network)'),
        description: z.string().optional()
    }
}, tool(({ id, label, color, bidirectional, description }) => {
    const entry = ConnectionTypeRegistry.register({ id, label, color, bidirectional, description });
    return { registered: entry };
}, { mutates: true }));

// ---- documents -------------------------------------------------------------
server.registerTool('new_diagram', {
    title: 'New diagram',
    description: 'Starts an empty diagram. Optionally sets the file path it will be saved to (relative paths resolve inside the diagrams directory).',
    inputSchema: {
        name: z.string().optional().describe('diagram title stored in metadata'),
        path: z.string().optional().describe('file path, e.g. "stage-a.json"')
    }
}, tool(async ({ name, path: p }) => {
    state.diagram = new Diagram({ metadata: name ? { name } : {} });
    state.undo = [];
    state.path = p ? resolvePath(p, '.json') : null;
    return { ok: true, path: state.path, autosave: AUTOSAVE && !!state.path, liveView: state.bridge ? state.bridge.url : null };
}, { mutates: true }));

server.registerTool('open_diagram', {
    title: 'Open diagram',
    description: 'Loads a diagram JSON file (as saved by the web editor or this server) and makes it the current diagram.',
    inputSchema: { path: z.string() }
}, tool(async ({ path: p }) => {
    const target = resolvePath(p, '.json');
    const raw = await fs.readFile(target, 'utf8');
    const { diagram, warnings } = Diagram.fromJSON(raw);
    state.diagram = diagram;
    state.path = target;
    state.undo = [];
    state.dirty = false;
    if (state.bridge) state.bridge.notifyChange('agent');
    return { ok: true, path: target, warnings, summary: diagram.summary() };
}));

server.registerTool('save_diagram', {
    title: 'Save diagram',
    description: 'Writes the current diagram to a JSON file. Uses the current path when none is given.',
    inputSchema: { path: z.string().optional() }
}, tool(async ({ path: p }) => {
    const target = p ? resolvePath(p, '.json') : state.path;
    if (!target) throw new DiagramError('No path set; pass "path" (e.g. "my-system.json")');
    await writeDiagram(target);
    return { ok: true, path: target, objects: state.diagram.objects.length };
}));

server.registerTool('get_diagram', {
    title: 'Get diagram JSON',
    description: 'Returns the full current diagram document (JSON file format 2.1).',
    inputSchema: {},
    annotations: { readOnlyHint: true }
}, tool(() => currentDocument()));

server.registerTool('describe_diagram', {
    title: 'Describe diagram',
    description: 'Compact human-readable summary of all objects, their ports, connections and validation issues.',
    inputSchema: {},
    annotations: { readOnlyHint: true }
}, tool(() => `path: ${state.path || '(unsaved)'}${state.dirty ? ' (unsaved changes)' : ''}\n` + state.diagram.summary()));

server.registerTool('find_objects', {
    title: 'Find objects',
    description: 'Finds objects by label/id substring and/or type.',
    inputSchema: {
        query: z.string().optional().describe('case-insensitive substring of the label or id'),
        type: z.string().optional().describe('shape type or "connector"')
    },
    annotations: { readOnlyHint: true }
}, tool(({ query, type }) => {
    const q = (query || '').toLowerCase();
    return state.diagram.objects
        .filter(o => (!type || o.type === type) && (!q || o.id.toLowerCase().includes(q) || String(o.label || '').toLowerCase().includes(q)))
        .map(shapeSummary);
}));

server.registerTool('describe_object', {
    title: 'Describe object',
    description: 'Full details of one object including every port (key, type, direction, position) and what is connected to it.',
    inputSchema: { ref: refSchema },
    annotations: { readOnlyHint: true }
}, tool(({ ref }) => {
    const obj = state.diagram.resolve(ref);
    if (obj.type === 'connector') return { object: obj.toJSON(), path: obj.getPathPoints() };
    return { object: obj.toJSON(), ports: state.diagram.listPorts(obj) };
}));

// ---- objects ---------------------------------------------------------------
server.registerTool('add_device', {
    title: 'Add device',
    description: 'Adds a system object with typed ports. Use type "device" for any generic hardware and give it a label and a ports map; the other types come with sensible default ports. Position/size are optional (run auto_layout later).',
    inputSchema: {
        type: z.enum(systemTypes).describe('server | network_switch | video_matrix | led_processor | sync_generator | device | connector_anchor'),
        label: z.string().optional().describe('device name shown on the diagram'),
        id: z.string().optional().describe('custom id (must be unique)'),
        x: z.number().optional(),
        y: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        ports: portsSchema.optional(),
        fill: z.string().optional().describe('hex fill colour'),
        description: z.string().optional().describe('notes such as model, IP address, rack position'),
        labelPosition: z.enum(['inside', 'bottom', 'below', 'above']).optional(),
        connectionType: z.string().optional().describe('connector_anchor only: pin the anchor to one connection type')
    }
}, tool(({ type, ...props }) => {
    const shape = state.diagram.createShape(type, props);
    return { created: shapeSummary(shape), ports: Object.keys(shape.getAnchorPoints()) };
}, { mutates: true }));

server.registerTool('add_shape', {
    title: 'Add shape',
    description: 'Adds a basic shape (rectangle, circle, diamond, hexagon, cylinder, parallelogram, text, image). Basic shapes expose generic anchors top/right/bottom/left for untyped connections.',
    inputSchema: {
        type: z.enum(basicTypes),
        x: z.number().optional(),
        y: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        id: z.string().optional(),
        label: z.string().optional().describe('label drawn inside the shape (not for text shapes)'),
        text: z.string().optional().describe('text content for type "text"'),
        fill: z.string().optional(),
        stroke: z.string().optional(),
        strokeWidth: z.number().optional(),
        cornerRadius: z.number().optional(),
        fontSize: z.number().optional(),
        imageData: z.string().optional().describe('data URL for type "image"'),
        description: z.string().optional()
    }
}, tool(({ type, ...props }) => {
    const shape = state.diagram.createShape(type, props);
    return { created: shapeSummary(shape) };
}, { mutates: true }));

server.registerTool('update_object', {
    title: 'Update object',
    description: 'Changes properties of a shape or connector: label, x, y, width, height, fill, stroke, rotation, description, text, ports (full replacement), locked, visible, zIndex... For connectors: style, lineStyle, label, arrowStart, arrowEnd, waypoints, stroke. Reducing ports that still have connections is refused unless detachConnectors=true.',
    inputSchema: {
        ref: refSchema,
        patch: z.record(z.string(), z.any()).describe('properties to set'),
        detachConnectors: z.boolean().optional()
    }
}, tool(({ ref, patch, detachConnectors }) => {
    const res = state.diagram.updateObject(ref, patch, { detachConnectors });
    return { object: shapeSummary(res.object), applied: res.applied, ignored: res.ignored, removedConnectors: res.removedConnectors };
}, { mutates: true }));

server.registerTool('set_port_count', {
    title: 'Set port count',
    description: 'Sets the number of inputs/outputs of one connection type on a device, keeping its other port types. Omit input or output to leave it unchanged; set both to 0 to remove the type.',
    inputSchema: {
        ref: refSchema,
        portType: z.string().describe('connection type id, e.g. "sdi"'),
        input: z.number().int().min(0).max(256).optional(),
        output: z.number().int().min(0).max(256).optional(),
        detachConnectors: z.boolean().optional().describe('remove connectors attached to ports that disappear')
    }
}, tool(({ ref, portType, input, output, detachConnectors }) => {
    const obj = state.diagram.resolve(ref, { shapesOnly: true });
    if (!obj.ports) throw new DiagramError(`"${obj.type}" shapes have no ports`);
    const key = ConnectionTypeRegistry.normalizeId(portType);
    const ports = JSON.parse(JSON.stringify(obj.ports));
    const current = ports[key] || { input: 0, output: 0 };
    const next = { input: input === undefined ? current.input : input, output: output === undefined ? current.output : output };
    if (next.input === 0 && next.output === 0) delete ports[key]; else ports[key] = next;
    const res = state.diagram.updateObject(obj, { ports }, { detachConnectors });
    return { object: shapeSummary(res.object), removedConnectors: res.removedConnectors, ports: Object.keys(obj.getAnchorPoints()) };
}, { mutates: true }));

server.registerTool('move_objects', {
    title: 'Move objects',
    description: 'Moves objects by a delta or to an absolute position (grouped shapes are moved individually; pass all members).',
    inputSchema: {
        refs: z.array(refSchema).min(1),
        dx: z.number().optional(),
        dy: z.number().optional(),
        x: z.number().optional().describe('absolute x for every listed object'),
        y: z.number().optional().describe('absolute y for every listed object')
    }
}, tool(({ refs, dx, dy, x, y }) => {
    const moved = refs.map(r => {
        const s = state.diagram.resolve(r, { shapesOnly: true });
        if (x !== undefined) s.x = x;
        if (y !== undefined) s.y = y;
        if (dx) s.x += dx;
        if (dy) s.y += dy;
        return shapeSummary(s);
    });
    return { moved };
}, { mutates: true }));

server.registerTool('remove_object', {
    title: 'Remove object',
    description: 'Deletes a shape (and its connectors) or a connector.',
    inputSchema: { ref: refSchema },
    annotations: { destructiveHint: true }
}, tool(({ ref }) => ({ removed: state.diagram.remove(ref) }), { mutates: true }));

// ---- connections -----------------------------------------------------------
server.registerTool('connect', {
    title: 'Connect ports',
    description: 'Creates a validated connector between two objects. Port selection: exact key ("sdi_output_2"), type+direction ("sdi_output"), just the type ("sdi"), or omit for automatic choice of the first free compatible port. Fails with the list of free ports when a requested port is occupied, when types differ, or when direction rules are violated (outputs connect to inputs, except bidirectional types such as network).',
    inputSchema: connectionSpecShape
}, tool((spec) => {
    const conn = state.diagram.connect(spec);
    return { connected: shapeSummary(conn) };
}, { mutates: true }));

server.registerTool('connect_many', {
    title: 'Connect many',
    description: 'Creates several connections in one call. Each entry has the same fields as "connect". Failures are reported per entry and do not stop the others.',
    inputSchema: { connections: z.array(z.object(connectionSpecShape)).min(1) }
}, tool(({ connections }) => {
    const results = connections.map((spec, i) => {
        try {
            return { index: i, ok: true, connected: shapeSummary(state.diagram.connect(spec)) };
        } catch (err) {
            return { index: i, ok: false, error: err.message, details: err.details || {} };
        }
    });
    return { results, created: results.filter(r => r.ok).length, failed: results.filter(r => !r.ok).length };
}, { mutates: true }));

server.registerTool('disconnect', {
    title: 'Disconnect',
    description: 'Removes a connector by id, or every connector between two objects.',
    inputSchema: {
        id: z.string().optional().describe('connector id'),
        from: refSchema.optional(),
        to: refSchema.optional()
    },
    annotations: { destructiveHint: true }
}, tool((spec) => {
    if (!spec.id && !(spec.from && spec.to)) throw new DiagramError('Pass a connector id, or both from and to');
    return { removed: state.diagram.disconnect(spec) };
}, { mutates: true }));

server.registerTool('update_connector', {
    title: 'Update connector',
    description: 'Changes connector styling: style (straight|orthogonal|bezier|polyline), lineStyle (solid|dashed|dotted), label, stroke, strokeWidth, arrowStart, arrowEnd, waypoints, connectionType.',
    inputSchema: {
        id: z.string(),
        style: styleSchema.optional(),
        lineStyle: lineStyleSchema.optional(),
        label: z.string().optional(),
        stroke: z.string().optional(),
        strokeWidth: z.number().optional(),
        arrowStart: z.boolean().optional(),
        arrowEnd: z.boolean().optional(),
        waypoints: z.array(pointSchema).optional(),
        connectionType: z.string().optional()
    }
}, tool(({ id, ...patch }) => {
    const res = state.diagram.updateConnector(id, patch);
    return { connector: shapeSummary(res.object), applied: res.applied, ignored: res.ignored };
}, { mutates: true }));

// ---- layout / validation / output -----------------------------------------
server.registerTool('auto_layout', {
    title: 'Auto layout',
    description: 'Arranges shapes in layers following the connection flow (sources left, sinks right for direction LR). Grouped shapes move together; unconnected shapes go to a final layer.',
    inputSchema: {
        direction: z.enum(['LR', 'TB']).optional().describe('left-to-right (default) or top-to-bottom'),
        columnGap: z.number().optional().describe('gap between layers, default 140'),
        rowGap: z.number().optional().describe('gap between shapes in a layer, default 50'),
        marginX: z.number().optional(),
        marginY: z.number().optional(),
        includeUnconnected: z.boolean().optional()
    }
}, tool((opts) => {
    const result = state.diagram.autoLayout(opts);
    return { ...result, bounds: state.diagram.getBounds() };
}, { mutates: true }));

server.registerTool('trace_signal_path', {
    title: 'Trace signal path',
    description: 'Follows the connections from one or more devices and returns every device reachable downstream (what this feeds), upstream (what feeds it) or both, with the connectors used. Optionally restrict to connection types (e.g. ["sdi","video"]). Bidirectional types such as network are followed in both directions.',
    inputSchema: {
        from: z.union([refSchema, z.array(refSchema).min(1)]).describe('start object(s): id or unique label'),
        direction: z.enum(['downstream', 'upstream', 'both']).optional().describe('default downstream'),
        connectionTypes: z.array(z.string()).optional().describe('only follow these connection types'),
        maxDepth: z.number().int().min(1).optional().describe('limit the number of hops')
    },
    annotations: { readOnlyHint: true }
}, tool(({ from, direction, connectionTypes, maxDepth }) => {
    const result = state.diagram.tracePath(from, direction || 'downstream', { connectionTypes, maxDepth });
    const shapes = result.shapes.map(s => ({ ...shapeSummary(state.diagram.getById(s.id)), depth: s.depth }));
    const connectors = result.connectors.map(id => shapeSummary(state.diagram.getById(id)));
    const lines = shapes.map(s => `${'  '.repeat(s.depth)}${s.depth ? '→ ' : ''}${s.label || s.id} [${s.type}]`);
    return { direction: direction || 'downstream', shapes, connectors, summary: lines.join('\n') };
}));

server.registerTool('validate_diagram', {
    title: 'Validate diagram',
    description: 'Checks the diagram: dangling ports, incompatible or duplicated connections, shared ports, overlapping devices, unlabeled devices, unknown types.',
    inputSchema: {},
    annotations: { readOnlyHint: true }
}, tool(() => {
    const semantic = state.diagram.validate();
    const structural = validateDocument(currentDocument());
    return {
        valid: semantic.errors.length === 0 && structural.valid,
        errors: [...structural.errors, ...semantic.errors],
        warnings: [...structural.warnings, ...semantic.warnings],
        objects: state.diagram.shapes.length,
        connectors: state.diagram.connectors.length
    };
}));

server.registerTool('render_svg', {
    title: 'Render SVG',
    description: 'Renders the current diagram as SVG. With "path" the file is written (relative paths resolve inside the diagrams directory) and only the path is returned; otherwise the SVG text is returned.',
    inputSchema: {
        path: z.string().optional().describe('output file, e.g. "stage-a.svg"'),
        showPortLabels: z.boolean().optional().describe('draw port names next to the port dots'),
        showPorts: z.boolean().optional().describe('draw port dots (default true)'),
        background: z.string().optional().describe('background colour, "none" for transparent'),
        padding: z.number().optional()
    },
    annotations: { readOnlyHint: true }
}, tool(async ({ path: p, showPortLabels, showPorts, background, padding }) => {
    const svg = diagramToSvg(state.diagram.objects, {
        showPortLabels: !!showPortLabels,
        showPorts: showPorts !== false,
        background: background === 'none' ? null : (background || '#ffffff'),
        padding: padding === undefined ? 40 : padding
    });
    if (p) {
        const target = resolvePath(p, '.svg');
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, svg, 'utf8');
        return { ok: true, path: target, bytes: Buffer.byteLength(svg) };
    }
    return { content: [{ type: 'text', text: svg }] };
}));

server.registerTool('insert_template', {
    title: 'Insert template',
    description: 'Inserts one of the built-in templates (flowchart, three-tier, network, org-chart, system-diagram) into the current diagram.',
    inputSchema: {
        template: z.enum(Templates.getAllTemplates().map(t => t.id)),
        offsetX: z.number().optional(),
        offsetY: z.number().optional()
    }
}, tool(({ template, offsetX = 0, offsetY = 0 }) => {
    const def = Templates.getAllTemplates().find(t => t.id === template);
    const { objects } = def.create();
    const groupId = state.diagram.nextGroupId++;
    for (const obj of objects) {
        if (obj.type !== 'connector') {
            obj.x += offsetX;
            obj.y += offsetY;
            obj.groupId = groupId;
        }
        state.diagram.add(obj);
    }
    return { inserted: objects.map(o => o.id), groupId };
}, { mutates: true }));

server.registerTool('group_objects', {
    title: 'Group objects',
    description: 'Groups shapes so they move together in the editor and during auto_layout.',
    inputSchema: { refs: z.array(refSchema).min(2) }
}, tool(({ refs }) => ({ groupId: state.diagram.group(refs) }), { mutates: true }));

server.registerTool('ungroup_objects', {
    title: 'Ungroup objects',
    description: 'Removes shapes from their group.',
    inputSchema: { refs: z.array(refSchema).min(1) }
}, tool(({ refs }) => { state.diagram.ungroup(refs); return { ok: true }; }, { mutates: true }));

server.registerTool('undo', {
    title: 'Undo',
    description: 'Reverts the last mutating tool call (up to the configured undo depth).',
    inputSchema: {}
}, async () => {
    const last = state.undo.pop();
    if (!last) return failure(new DiagramError('Nothing to undo'));
    try {
        const { diagram } = Diagram.fromJSON(last);
        state.diagram = diagram;
        await afterChange();
        return text({ ok: true, remainingUndoSteps: state.undo.length, objects: diagram.objects.length });
    } catch (err) {
        return failure(err);
    }
});

// ---- resources -------------------------------------------------------------
const SCHEMA_PATH = path.join(REPO_ROOT, 'schema', 'diagram.schema.json');

server.registerResource('diagram-schema', 'morph://schema/diagram', {
    title: 'Diagram file JSON schema',
    description: `JSON schema of the diagram file format (version ${FORMAT_VERSION}).`,
    mimeType: 'application/schema+json'
}, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: 'application/schema+json', text: fsSync.readFileSync(SCHEMA_PATH, 'utf8') }]
}));

server.registerResource('shape-catalog', 'morph://catalog/shape-types', {
    title: 'Shape type catalogue',
    description: 'All shape types with default sizes and default ports.',
    mimeType: 'application/json'
}, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(ShapeRegistry.list().map(d => ({ type: d.type, name: d.name, category: d.category, description: d.description, defaultSize: d.defaultSize, defaultPorts: d.defaultPorts ? d.defaultPorts() : undefined })), null, 2) }]
}));

server.registerResource('connection-types', 'morph://catalog/connection-types', {
    title: 'Connection types',
    description: 'Registered connection types and colours.',
    mimeType: 'application/json'
}, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(ConnectionTypeRegistry.list(), null, 2) }]
}));

server.registerResource('current-diagram', 'morph://diagram/current', {
    title: 'Current diagram (JSON)',
    description: 'The diagram currently being edited.',
    mimeType: 'application/json'
}, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(currentDocument(), null, 2) }]
}));

server.registerResource('current-diagram-svg', 'morph://diagram/current.svg', {
    title: 'Current diagram (SVG)',
    description: 'SVG rendering of the current diagram.',
    mimeType: 'image/svg+xml'
}, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: 'image/svg+xml', text: diagramToSvg(state.diagram.objects, { showPortLabels: true }) }]
}));

server.registerResource('diagram-files', new ResourceTemplate('morph://files/{name}', {
    list: async () => {
        let names = [];
        try {
            names = (await fs.readdir(DIAGRAM_DIR)).filter(n => n.toLowerCase().endsWith('.json'));
        } catch { /* directory may not exist yet */ }
        return { resources: names.map(n => ({ uri: `morph://files/${encodeURIComponent(n)}`, name: n, mimeType: 'application/json' })) };
    }
}), {
    title: 'Saved diagram files',
    description: `Diagram JSON files inside ${DIAGRAM_DIR}.`
}, async (uri, { name }) => {
    const target = resolvePath(decodeURIComponent(String(name)), '.json');
    return { contents: [{ uri: uri.href, mimeType: 'application/json', text: await fs.readFile(target, 'utf8') }] };
});

// ---- prompts ---------------------------------------------------------------
server.registerPrompt('build_system_diagram', {
    title: 'Build a system diagram',
    description: 'Guided workflow for turning a description of a hardware setup into a validated Morph diagram.',
    argsSchema: {
        brief: z.string().describe('description of the system: devices, their ports and how they are wired'),
        fileName: z.string().optional().describe('file name to save to, e.g. "stage-a.json"')
    }
}, ({ brief, fileName }) => ({
    messages: [{
        role: 'user',
        content: {
            type: 'text',
            text: [
                'Build a Morph Diagrams system diagram from this brief:',
                '',
                brief,
                '',
                'Work step by step with the morph-diagrams tools:',
                '1. Call list_shape_types and list_connection_types. Define any missing signal types with define_connection_type.',
                `2. Call new_diagram${fileName ? ` with path "${fileName}"` : ''}.`,
                '3. Add each device with add_device: a clear label, the right type ("device" for anything generic) and a ports map that matches the real hardware (inputs on the left, outputs on the right).',
                '4. Wire everything with connect_many, letting the server pick free ports (pass types like "sdi" or "sdi_output") and labelling important signals.',
                '5. Call auto_layout, then validate_diagram and fix every error it reports.',
                '6. Finish with save_diagram and render_svg, and summarise the resulting signal flow.'
            ].join('\n')
        }
    }]
}));

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------
async function main() {
    if (process.env.MORPH_OPEN) {
        try {
            const target = resolvePath(process.env.MORPH_OPEN, '.json');
            const { diagram } = Diagram.fromJSON(await fs.readFile(target, 'utf8'));
            state.diagram = diagram;
            state.path = target;
            log(`opened ${target}`);
        } catch (err) {
            log(`could not open MORPH_OPEN: ${err.message}`);
        }
    }

    if (HTTP_PORT !== 'off' && HTTP_PORT !== '0' && HTTP_PORT !== 'false') {
        try {
            state.bridge = await startBridge({
                port: Number(HTTP_PORT) || 8765,
                getDocument: currentDocument,
                getPath: () => state.path,
                setDocument: async (doc, clientId) => {
                    snapshot();
                    const { diagram } = Diagram.fromJSON(doc);
                    state.diagram = diagram;
                    state.dirty = true;
                    if (AUTOSAVE && state.path) await writeDiagram(state.path);
                    log(`diagram updated from browser (${clientId})`);
                },
                log
            });
        } catch (err) {
            log(`live view disabled (${err.message}); file-based tools still work`);
        }
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
    log(`ready (diagram dir: ${DIAGRAM_DIR}${state.bridge ? `, live view: ${state.bridge.url}` : ''})`);
}

main().catch(err => {
    log(`fatal: ${err.stack || err.message}`);
    process.exit(1);
});
