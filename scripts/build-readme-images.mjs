#!/usr/bin/env node
/**
 * Builds the images used by README.md (and the example diagram files):
 *
 * - docs/images/*.svg   vector exports produced headlessly from the model (templates, device catalogue,
 *                       connection-type legend, filtered views)
 * - examples/*.json     the template diagrams as loadable files
 * - docs/images/*.png   editor screenshots captured with a headless Chromium browser (Chrome or Edge)
 *                       driven over the DevTools protocol and served by the live bridge; skipped when no
 *                       browser is found
 *
 * Usage: node scripts/build-readme-images.mjs [--no-screenshots]
 *        MORPH_BROWSER=/path/to/chrome node scripts/build-readme-images.mjs
 */

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { Templates } from '../js/utils/Templates.js';
import { Diagram } from '../js/core/Diagram.js';
import { ShapeRegistry } from '../js/core/ShapeRegistry.js';
import { ConnectionTypeRegistry } from '../js/config/ConnectionTypes.js';
import { diagramToSvg, escapeXml } from '../js/core/SvgExporter.js';
import { createDocument } from '../js/core/Serialization.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = path.join(ROOT, 'docs', 'images');
const EXAMPLES = path.join(ROOT, 'examples');
const noScreenshots = process.argv.includes('--no-screenshots');

await fs.mkdir(IMAGES, { recursive: true });
await fs.mkdir(EXAMPLES, { recursive: true });

const log = msg => process.stdout.write(msg + '\n');

// ---------------------------------------------------------------------------
// Templates → example files + SVGs
// ---------------------------------------------------------------------------
const templates = {
    'vp-volume': { file: 'vp-volume', name: 'XL Virtual Production LED Volume' },
    'system-diagram': { file: 'system-diagram', name: 'System Diagram' }
};
const documents = {};
for (const [id, meta] of Object.entries(templates)) {
    const def = Templates.getAllTemplates().find(t => t.id === id);
    const { objects } = def.create();
    if (id === 'system-diagram') {
        // stable id for the server so the README screenshot can pre-select it
        const server = objects.find(o => o.type === 'server');
        if (server) server.id = 'shape_sys_server';
    }
    const doc = createDocument({ objects, metadata: { name: meta.name, created: '2026-01-01T00:00:00.000Z' } });
    doc.metadata.modified = doc.metadata.created;
    documents[id] = doc;
    await fs.writeFile(path.join(EXAMPLES, `${meta.file}.json`), JSON.stringify(doc, null, 2), 'utf8');
    await fs.writeFile(path.join(IMAGES, `${meta.file}.svg`), diagramToSvg(objects, { padding: 40 }), 'utf8');
    log(`wrote examples/${meta.file}.json and docs/images/${meta.file}.svg (${objects.length} objects)`);
}

// Filtered views of the VP volume
{
    const def = Templates.getAllTemplates().find(t => t.id === 'vp-volume');
    const { objects } = def.create();
    const d = new Diagram({ objects });
    const power = d.computeFilter({ connectionTypes: ['power'] });
    await fs.writeFile(path.join(IMAGES, 'vp-volume-power-filter.svg'), diagramToSvg(objects, { padding: 40, highlight: { ids: power.ids, mode: 'dim' } }), 'utf8');
    const trace = d.computeFilter({ trace: { from: ['vp_show_cam'], direction: 'downstream' }, connectionTypes: ['sdi', 'video'] });
    await fs.writeFile(path.join(IMAGES, 'vp-volume-camera-trace.svg'), diagramToSvg(objects, { padding: 40, highlight: { ids: trace.ids, mode: 'dim' } }), 'utf8');
    log('wrote docs/images/vp-volume-power-filter.svg and vp-volume-camera-trace.svg');
}

// ---------------------------------------------------------------------------
// Device catalogue
// ---------------------------------------------------------------------------
{
    const d = new Diagram();
    const types = ShapeRegistry.list('system').filter(def => def.hasPorts);
    const perRow = 6;
    types.forEach((def, i) => {
        const col = i % perRow;
        const row = Math.floor(i / perRow);
        // a little wider than the defaults so both port columns have room for their labels
        const size = { width: Math.max(def.defaultSize.width, 180), height: Math.max(def.defaultSize.height, 120) };
        d.createShape(def.type, {
            id: `cat_${def.type}`,
            label: def.name,
            x: 40 + col * 260 + (220 - size.width) / 2,
            y: 40 + row * 300 + (220 - size.height) / 2,
            width: size.width,
            height: size.height
        });
    });
    await fs.writeFile(path.join(IMAGES, 'devices.svg'), diagramToSvg(d.objects, { padding: 20, showPortLabels: true }), 'utf8');
    log(`wrote docs/images/devices.svg (${types.length} device types)`);
}

// ---------------------------------------------------------------------------
// Connection type legend
// ---------------------------------------------------------------------------
{
    const types = ConnectionTypeRegistry.list();
    const rowH = 30;
    const width = 440;
    const height = 20 + types.length * rowH;
    const rows = types.map((t, i) => {
        const y = 20 + i * rowH + rowH / 2;
        const dash = t.lineStyle === 'dashed' ? ' stroke-dasharray="10 5"' : t.lineStyle === 'dotted' ? ' stroke-dasharray="2 4"' : '';
        const arrow = t.bidirectional
            ? `<path d="M22,${y} l8,-6 v12 z M148,${y} l-8,-6 v12 z" fill="${t.color}"/>`
            : `<path d="M148,${y} l-10,-6 v12 z" fill="${t.color}"/>`;
        return `<line x1="20" y1="${y}" x2="150" y2="${y}" stroke="${t.color}" stroke-width="3"${dash}/>${arrow}` +
            `<text x="165" y="${y + 1}" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#1f2937" dominant-baseline="middle">${escapeXml(t.label)}</text>` +
            `<text x="240" y="${y + 1}" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" dominant-baseline="middle">${escapeXml(t.bidirectional ? 'bidirectional' : 'output → input')}${t.lineStyle && t.lineStyle !== 'solid' ? `, ${t.lineStyle}` : ''} · ${escapeXml(t.color)}</text>`;
    }).join('\n');
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n<rect width="${width}" height="${height}" fill="#ffffff" rx="8"/>\n${rows}\n</svg>\n`;
    await fs.writeFile(path.join(IMAGES, 'connection-types.svg'), svg, 'utf8');
    log(`wrote docs/images/connection-types.svg (${types.length} types)`);
}

// ---------------------------------------------------------------------------
// Editor screenshots: headless Chromium driven over the DevTools protocol
// ---------------------------------------------------------------------------
function findBrowser() {
    // Chrome first: Edge's headless mode has been seen to exit without writing anything.
    const candidates = [
        process.env.MORPH_BROWSER,
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    ].filter(Boolean);
    return candidates.find(p => fsSync.existsSync(p)) || null;
}

/** Starts the live bridge for a diagram file and resolves when it is listening. */
async function startBridge(file, port) {
    const child = spawn(process.execPath, [path.join(ROOT, 'mcp', 'http-bridge.js'), file, '--port', String(port)], { stdio: ['ignore', 'ignore', 'pipe'] });
    await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('bridge did not start')), 8000);
        child.stderr.on('data', chunk => {
            if (String(chunk).includes('live view')) { clearTimeout(timer); resolve(); }
        });
        child.on('exit', code => { clearTimeout(timer); reject(new Error(`bridge exited with ${code}`)); });
    });
    return child;
}

/** Minimal DevTools-protocol client on top of Node's built-in WebSocket. */
class Cdp {
    constructor(ws) {
        this.ws = ws;
        this.id = 0;
        this.pending = new Map();
        ws.addEventListener('message', (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.id && this.pending.has(msg.id)) {
                const { resolve, reject } = this.pending.get(msg.id);
                this.pending.delete(msg.id);
                if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
            }
        });
    }

    send(method, params = {}, sessionId) {
        const id = ++this.id;
        return new Promise((resolve, reject) => {
            this.pending.set(id, { resolve, reject });
            this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
        });
    }
}

async function launchBrowser(browser) {
    const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'morph-shot-'));
    const args = [
        '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
        '--proxy-server=direct://', '--proxy-bypass-list=*', `--user-data-dir=${profile}`,
        '--remote-debugging-port=0', '--window-size=1440,900', 'about:blank'
    ];
    const proc = spawn(browser, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    const wsUrl = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('browser did not expose DevTools')), 20000);
        let buffer = '';
        proc.stderr.on('data', chunk => {
            buffer += String(chunk);
            const m = /DevTools listening on (ws:\/\/\S+)/.exec(buffer);
            if (m) { clearTimeout(timer); resolve(m[1]); }
        });
        proc.on('exit', () => { clearTimeout(timer); reject(new Error('browser exited early')); });
    });
    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => { ws.addEventListener('open', resolve); ws.addEventListener('error', reject); });
    const cdp = new Cdp(ws);
    return {
        cdp,
        async close() {
            try { await cdp.send('Browser.close'); } catch { /* already gone */ }
            proc.kill();
            await fs.rm(profile, { recursive: true, force: true }).catch(() => {});
        }
    };
}

async function capture(cdp, url, out, { width = 1440, height = 900, ready = 'window.app && window.app.objects.length > 0', settle = 400 } = {}) {
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }, sessionId);
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Page.navigate', { url }, sessionId);
    const deadline = Date.now() + 30000;
    for (;;) {
        const { result } = await cdp.send('Runtime.evaluate', { expression: `document.readyState === 'complete' && !!(${ready})`, returnByValue: true }, sessionId);
        if (result.value === true) break;
        if (Date.now() > deadline) throw new Error(`page did not become ready: ${url}`);
        await new Promise(r => setTimeout(r, 200));
    }
    await new Promise(r => setTimeout(r, settle));
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' }, sessionId);
    await fs.writeFile(out, Buffer.from(data, 'base64'));
    await cdp.send('Target.closeTarget', { targetId });
}

if (!noScreenshots) {
    const browser = findBrowser();
    if (!browser) {
        log('no Chromium-based browser found; skipping PNG screenshots (set MORPH_BROWSER to a chrome/edge executable)');
    } else {
        const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'morph-readme-'));
        const shots = [
            { doc: 'system-diagram', query: 'view=fit&select=shape_sys_server', out: 'editor.png' },
            { doc: 'vp-volume', query: 'view=fit', out: 'vp-volume-editor.png' },
            { doc: 'vp-volume', query: 'view=fit&trace=vp_show_cam:downstream&filter=sdi,video', out: 'filter-trace.png' },
            { doc: 'vp-volume', query: 'view=fit&filter=network,fibre&hide=1', out: 'filter-network.png' }
        ];
        const port = 8790;
        const bridgeFile = path.join(tmp, 'live.json');
        await fs.writeFile(bridgeFile, JSON.stringify(documents['system-diagram']), 'utf8');
        const bridge = await startBridge(bridgeFile, port);
        const chrome = await launchBrowser(browser);
        try {
            for (const shot of shots) {
                const docFile = `${shot.doc}.json`;
                const url = `http://127.0.0.1:${port}/?load=examples/${docFile}&${shot.query}`;
                const out = path.join(IMAGES, shot.out);
                await capture(chrome.cdp, url, out, {
                    ready: `window.app && window.app.diagram.metadata.name === ${JSON.stringify(documents[shot.doc].metadata.name)} && window.app.objects.length === ${documents[shot.doc].objects.length}`
                });
                const size = (await fs.stat(out)).size;
                log(`captured docs/images/${shot.out} (${Math.round(size / 1024)} KB)`);
            }
        } finally {
            await chrome.close();
            bridge.kill();
            await fs.rm(tmp, { recursive: true, force: true }).catch(() => {});
        }
    }
}

log('done');
