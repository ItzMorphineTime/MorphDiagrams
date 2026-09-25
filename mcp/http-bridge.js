#!/usr/bin/env node
/**
 * @module mcp/http-bridge
 * @description Small HTTP + Server-Sent-Events bridge that lets the browser editor follow a diagram that is
 * being edited elsewhere (by the MCP server / an LLM agent, or by anything that writes the JSON file).
 *
 * Endpoints (all JSON, same origin as the static app):
 * - `GET  /api/status`  -> `{ ok, revision, path, mode }`
 * - `GET  /api/diagram` -> `{ revision, document }`
 * - `PUT  /api/diagram` <- `{ document, clientId }` (the browser pushes its edits back)
 * - `GET  /api/events`  -> SSE stream; `change` events carry `{ revision, source }`
 * - `GET  /*`           -> static files of the app (index.html, js/, styles2.css, ...)
 *
 * Standalone usage (serves the app and keeps a JSON file in sync, watching it for external edits):
 *
 * ```bash
 * node mcp/http-bridge.js diagrams/stage.json --port 8765
 * ```
 */

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(HERE, '..');

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown; charset=utf-8',
    '.map': 'application/json; charset=utf-8'
};

function sendJson(res, status, body) {
    const data = JSON.stringify(body);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Content-Length': Buffer.byteLength(data)
    });
    res.end(data);
}

function readBody(req, limit = 64 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on('data', chunk => {
            size += chunk.length;
            if (size > limit) {
                reject(new Error('request body too large'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
    });
}

/**
 * Starts the bridge.
 * @param {Object} options
 * @param {number} [options.port=8765] Port to listen on (0 = random free port).
 * @param {string} [options.host='127.0.0.1']
 * @param {string} [options.staticRoot] Directory of the web app to serve (defaults to the repo root).
 * @param {function(): Object} options.getDocument Returns the current diagram document (plain object).
 * @param {function(Object, string): void} [options.setDocument] Receives documents pushed by browsers.
 * @param {function(string): void} [options.log] Logger (defaults to stderr).
 * @param {function(): string|null} [options.getPath] Returns the current file path for `/api/status`.
 * @returns {Promise<{port:number, url:string, notifyChange:function(string=):void, close:function():Promise<void>}>}
 */
export function startBridge(options) {
    const {
        port = 8765,
        host = '127.0.0.1',
        staticRoot = REPO_ROOT,
        getDocument,
        setDocument,
        log = msg => process.stderr.write(msg + '\n'),
        getPath = () => null
    } = options;

    let revision = 1;
    const clients = new Set();

    const broadcast = (event, payload) => {
        const frame = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
        for (const res of clients) {
            try { res.write(frame); } catch { clients.delete(res); }
        }
    };

    const notifyChange = (source = 'server') => {
        revision += 1;
        broadcast('change', { revision, source });
    };

    const serveStatic = async (req, res, urlPath) => {
        let rel = decodeURIComponent(urlPath.split('?')[0]);
        if (rel === '/' || rel === '') rel = '/index.html';
        const abs = path.normalize(path.join(staticRoot, rel));
        if (!abs.startsWith(path.normalize(staticRoot + path.sep)) && abs !== path.normalize(staticRoot)) {
            res.writeHead(403); res.end('Forbidden'); return;
        }
        try {
            const stat = await fsp.stat(abs);
            if (!stat.isFile()) throw new Error('not a file');
            const ext = path.extname(abs).toLowerCase();
            res.writeHead(200, {
                'Content-Type': MIME[ext] || 'application/octet-stream',
                'Cache-Control': 'no-cache',
                'Content-Length': stat.size
            });
            fs.createReadStream(abs).pipe(res);
        } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
        }
    };

    const server = http.createServer(async (req, res) => {
        const url = req.url || '/';
        try {
            if (url.startsWith('/api/status')) {
                sendJson(res, 200, { ok: true, revision, path: getPath(), mode: 'live', app: 'morph-diagrams' });
            } else if (url.startsWith('/api/diagram')) {
                if (req.method === 'GET') {
                    sendJson(res, 200, { revision, document: getDocument() });
                } else if (req.method === 'PUT' || req.method === 'POST') {
                    if (!setDocument) { sendJson(res, 405, { error: 'read-only bridge' }); return; }
                    const body = JSON.parse(await readBody(req));
                    const doc = body && body.document ? body.document : body;
                    const clientId = (body && body.clientId) || req.headers['x-morph-client'] || 'browser';
                    await setDocument(doc, clientId);
                    revision += 1;
                    broadcast('change', { revision, source: clientId });
                    sendJson(res, 200, { ok: true, revision });
                } else {
                    sendJson(res, 405, { error: 'method not allowed' });
                }
            } else if (url.startsWith('/api/events')) {
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    Connection: 'keep-alive'
                });
                res.write(`event: hello\ndata: ${JSON.stringify({ revision })}\n\n`);
                clients.add(res);
                req.on('close', () => clients.delete(res));
            } else if (req.method === 'GET' || req.method === 'HEAD') {
                await serveStatic(req, res, url);
            } else {
                sendJson(res, 404, { error: 'not found' });
            }
        } catch (err) {
            log(`[bridge] ${req.method} ${url} failed: ${err.message}`);
            if (!res.headersSent) sendJson(res, 500, { error: err.message });
        }
    });

    const heartbeat = setInterval(() => {
        for (const res of clients) {
            try { res.write(': ping\n\n'); } catch { clients.delete(res); }
        }
    }, 25000);
    heartbeat.unref();

    return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, host, () => {
            const actual = server.address().port;
            const url = `http://${host}:${actual}/`;
            log(`[bridge] Morph Diagrams live view: ${url}`);
            resolve({
                port: actual,
                url,
                notifyChange,
                close: () => new Promise(r => {
                    clearInterval(heartbeat);
                    for (const c of clients) c.end();
                    server.close(() => r());
                })
            });
        });
    });
}

// ---------------------------------------------------------------------------
// Standalone mode: node mcp/http-bridge.js [diagram.json] [--port N]
// ---------------------------------------------------------------------------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
    const args = process.argv.slice(2);
    let port = Number(process.env.MORPH_HTTP_PORT) || 8765;
    let file = null;
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--port') port = Number(args[++i]);
        else if (!file) file = args[i];
    }
    const filePath = file ? path.resolve(file) : null;
    let document = { version: '2.1', objects: [], metadata: {} };
    if (filePath && fs.existsSync(filePath)) {
        document = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    let lastWritten = '';
    const bridge = await startBridge({
        port,
        getDocument: () => document,
        getPath: () => filePath,
        setDocument: async (doc) => {
            document = doc;
            if (filePath) {
                lastWritten = JSON.stringify(doc, null, 2);
                await fsp.mkdir(path.dirname(filePath), { recursive: true });
                await fsp.writeFile(filePath, lastWritten, 'utf8');
            }
        }
    });
    if (filePath) {
        let timer = null;
        const reload = () => {
            clearTimeout(timer);
            timer = setTimeout(async () => {
                try {
                    const text = await fsp.readFile(filePath, 'utf8');
                    if (text === lastWritten) return;
                    document = JSON.parse(text);
                    bridge.notifyChange('file');
                    process.stderr.write(`[bridge] reloaded ${filePath}\n`);
                } catch (err) {
                    process.stderr.write(`[bridge] could not reload ${filePath}: ${err.message}\n`);
                }
            }, 150);
        };
        try {
            fs.watch(path.dirname(filePath), (_event, name) => {
                if (!name || path.resolve(path.dirname(filePath), name) === filePath) reload();
            });
            process.stderr.write(`[bridge] watching ${filePath}\n`);
        } catch (err) {
            process.stderr.write(`[bridge] file watching unavailable: ${err.message}\n`);
        }
    }
}
