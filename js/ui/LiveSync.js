/**
 * @module ui/LiveSync
 * @description Keeps the editor in sync with the MCP server / HTTP bridge when the app is served by it
 * (`node mcp/http-bridge.js` or the MCP server's live view). Detection is automatic: when
 * `/api/status` answers, the editor loads the server's diagram, follows `change` events over SSE and
 * pushes its own edits back with `PUT /api/diagram`.
 *
 * On static hosting (GitHub Pages, file://) detection fails silently and the editor works as usual.
 *
 * @example
 * const sync = new LiveSync({
 *     getDocument: () => app.buildDocument(),
 *     applyDocument: doc => app.loadDocument(doc, { resetView: false }),
 *     onStatus: status => console.log(status)
 * });
 * if (await LiveSync.detect()) sync.start();
 */

export class LiveSync {
    /**
     * @param {Object} options
     * @param {function(): Object} options.getDocument Returns the editor's current document.
     * @param {function(Object): void} options.applyDocument Replaces the editor's content with a document.
     * @param {function(string, Object=): void} [options.onStatus] Status callback: `connected`, `syncing`, `pushed`, `disconnected`, `error`.
     * @param {number} [options.debounceMs=400] Delay before pushing local edits.
     */
    constructor({ getDocument, applyDocument, onStatus, debounceMs = 400 }) {
        this.getDocument = getDocument;
        this.applyDocument = applyDocument;
        this.onStatus = onStatus || (() => {});
        this.debounceMs = debounceMs;
        /** @type {string} Identifies this browser tab so its own pushes are not re-applied */
        this.clientId = 'browser_' + Math.random().toString(36).slice(2, 10);
        this.revision = 0;
        this.source = null;
        this.pushTimer = null;
        this.pushing = false;
        this.pendingPush = false;
        this.active = false;
    }

    /**
     * Checks whether the page is served by the bridge.
     * @returns {Promise<boolean>}
     */
    static async detect() {
        if (typeof fetch !== 'function' || typeof window === 'undefined' || !/^https?:/.test(window.location.protocol)) return false;
        try {
            const res = await fetch('/api/status', { cache: 'no-store' });
            if (!res.ok) return false;
            const json = await res.json();
            return json && json.app === 'morph-diagrams';
        } catch {
            return false;
        }
    }

    /**
     * Loads the server's diagram and starts following changes.
     * @returns {Promise<void>}
     */
    async start() {
        this.active = true;
        await this.pull();
        this.source = new EventSource('/api/events');
        this.source.addEventListener('hello', () => this.onStatus('connected', { revision: this.revision }));
        this.source.addEventListener('change', evt => {
            try {
                const data = JSON.parse(evt.data);
                if (data.source === this.clientId) { this.revision = data.revision; return; }
                this.pull();
            } catch { /* ignore malformed events */ }
        });
        this.source.onerror = () => this.onStatus('disconnected');
        this.source.onopen = () => this.onStatus('connected', { revision: this.revision });
    }

    /**
     * Fetches the server document and applies it.
     * @returns {Promise<void>}
     */
    async pull() {
        if (!this.active) return;
        try {
            this.onStatus('syncing');
            const res = await fetch('/api/diagram', { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            this.revision = json.revision;
            this.applyDocument(json.document);
            this.onStatus('connected', { revision: this.revision });
        } catch (err) {
            this.onStatus('error', { message: err.message });
        }
    }

    /**
     * Schedules a push of the local document (debounced).
     */
    push() {
        if (!this.active) return;
        clearTimeout(this.pushTimer);
        this.pushTimer = setTimeout(() => this.flush(), this.debounceMs);
    }

    /**
     * Pushes immediately.
     * @returns {Promise<void>}
     */
    async flush() {
        if (!this.active) return;
        if (this.pushing) { this.pendingPush = true; return; }
        this.pushing = true;
        try {
            const res = await fetch('/api/diagram', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Morph-Client': this.clientId },
                body: JSON.stringify({ document: this.getDocument(), clientId: this.clientId })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            this.revision = json.revision;
            this.onStatus('pushed', { revision: this.revision });
        } catch (err) {
            this.onStatus('error', { message: err.message });
        } finally {
            this.pushing = false;
            if (this.pendingPush) {
                this.pendingPush = false;
                this.push();
            }
        }
    }

    /**
     * Stops following the server.
     */
    stop() {
        this.active = false;
        clearTimeout(this.pushTimer);
        if (this.source) this.source.close();
        this.source = null;
        this.onStatus('disconnected');
    }
}
