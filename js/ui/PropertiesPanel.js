/**
 * @module ui/PropertiesPanel
 * @description Right-hand panel. Shows a diagram overview (stats, validation issues, quick actions) when
 * nothing is selected, the editable properties of a single object, or the shared properties of a
 * multi-selection, plus an "Arrange" section (layers, grouping, alignment, distribution).
 *
 * The panel talks to the editor through a small set of app methods (`saveState`, `render`,
 * `align`, `revealObjects`, ...), so it can be replaced or tested independently.
 */

import { ShapeRegistry } from '../core/ShapeRegistry.js';
import { ConnectionTypeRegistry } from '../config/ConnectionTypes.js';
import { portLabel } from '../core/Ports.js';
import { escapeHtml, icon } from '../utils/Dom.js';

const TYPE_ICONS = {
    rectangle: 'i-rect', circle: 'i-circle', diamond: 'i-diamond', hexagon: 'i-hexagon', cylinder: 'i-cylinder',
    parallelogram: 'i-parallelogram', text: 'i-text', image: 'i-image', server: 'i-server',
    network_switch: 'i-switch', video_matrix: 'i-matrix', led_processor: 'i-led', sync_generator: 'i-sync',
    device: 'i-device', connector_anchor: 'i-anchor', connector: 'i-connector'
};

const hex = (value, fallback) => (/^#[0-9a-fA-F]{6}$/.test(value || '') ? value : fallback);

export class PropertiesPanel {
    /**
     * @param {Object} app The editor (CanvasApp).
     */
    constructor(app) {
        this.app = app;
        this.header = document.getElementById('properties-header');
        this.content = document.getElementById('properties-content');
    }

    /** Re-renders for the current selection. */
    render() {
        if (!this.header || !this.content) return;
        const sel = this.app.selectedObjects;
        if (sel.length === 0) {
            this.header.textContent = 'Diagram';
            this.content.innerHTML = this.overviewHtml();
            this.attachOverview();
        } else if (sel.length === 1) {
            const obj = sel[0];
            this.header.textContent = obj.type === 'connector' ? 'Connector' : ShapeRegistry.displayName(obj.type);
            this.content.innerHTML = this.singleHtml(obj) + this.arrangeHtml(sel);
            this.attachSingle(obj);
            this.attachArrange(sel);
        } else {
            this.header.textContent = `${sel.length} objects`;
            this.content.innerHTML = this.multiHtml(sel) + this.arrangeHtml(sel);
            this.attachMulti(sel);
            this.attachArrange(sel);
        }
    }

    // ------------------------------------------------------------------
    // Overview (no selection)
    // ------------------------------------------------------------------
    overviewHtml() {
        const app = this.app;
        const shapes = app.diagram.shapes;
        const devices = shapes.filter(s => s.ports).length;
        const connectors = app.diagram.connectors.length;
        const validation = app.diagram.validate();
        const issues = validation.issues.slice(0, 30);
        const issuesHtml = issues.length
            ? `<div class="issue-list">${issues.map((iss, i) => `
                <button class="issue ${iss.level}" data-issue="${i}" title="Click to select">${icon('i-warning')}<span>${escapeHtml(iss.message)}</span></button>`).join('')}
               ${validation.issues.length > issues.length ? `<p class="hint">…and ${validation.issues.length - issues.length} more</p>` : ''}</div>`
            : `<div class="ok-line">${icon('i-check')}<span>No issues found</span></div>`;
        return `
            <div class="prop-section">
                <div class="prop-section-title">Overview</div>
                <div class="stat-grid">
                    <div class="stat"><b>${shapes.length}</b><span>shapes</span></div>
                    <div class="stat"><b>${devices}</b><span>devices</span></div>
                    <div class="stat"><b>${connectors}</b><span>links</span></div>
                </div>
                <p class="hint">Select an object to edit it. Right-click for actions, double-click to rename.</p>
            </div>
            <div class="prop-section">
                <div class="prop-section-title">Validation ${validation.issues.length ? `<span class="badge">${validation.issues.length}</span>` : ''}</div>
                ${issuesHtml}
            </div>
            <div class="prop-section">
                <div class="prop-section-title">Actions</div>
                <div class="action-list">
                    <button class="text-btn" id="ov-layout">${icon('i-layout')}<span>Auto layout along signal flow</span></button>
                    <button class="text-btn" id="ov-fit">${icon('i-fit')}<span>Zoom to fit</span></button>
                    <button class="text-btn" id="ov-select-all">${icon('i-select-all')}<span>Select all</span></button>
                    <button class="text-btn" id="ov-settings">${icon('i-settings')}<span>Connection types &amp; colours</span></button>
                </div>
            </div>`;
    }

    attachOverview() {
        const app = this.app;
        this.content.querySelectorAll('[data-issue]').forEach(btn => {
            btn.addEventListener('click', () => {
                const issue = app.diagram.validate().issues[Number(btn.dataset.issue)];
                if (issue) app.revealObjects(issue.objectIds);
            });
        });
        const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
        on('ov-layout', () => app.autoLayout());
        on('ov-fit', () => app.zoomToFit());
        on('ov-select-all', () => app.selectAll());
        on('ov-settings', () => app.showSettings());
    }

    // ------------------------------------------------------------------
    // Single object
    // ------------------------------------------------------------------
    connectionTypeOptions(selected) {
        return `<option value="" ${!selected ? 'selected' : ''}>Any / untyped</option>` + ConnectionTypeRegistry.list().map(t =>
            `<option value="${escapeHtml(t.id)}" ${selected === t.id ? 'selected' : ''}>${escapeHtml(t.label)}</option>`).join('');
    }

    singleHtml(obj) {
        const isConnector = obj.type === 'connector';
        const typeName = isConnector ? 'Connector' : ShapeRegistry.displayName(obj.type);
        let html = `
            <div class="prop-section">
                <span class="type-badge">${icon(TYPE_ICONS[obj.type] || 'i-rect')}${escapeHtml(typeName)}</span>`;

        if (obj.type !== 'text') {
            html += `
                <div class="field">
                    <label for="prop-label">${isConnector ? 'Label' : 'Name / label'}</label>
                    <input type="text" id="prop-label" value="${escapeHtml(obj.label || '')}" placeholder="${isConnector ? 'e.g. PGM 1' : 'e.g. Media Server 1'}">
                </div>`;
        }
        if (!isConnector && obj.type !== 'text' && obj.type !== 'connector_anchor') {
            html += `
                <div class="field">
                    <label for="prop-labelposition">Label position</label>
                    <select id="prop-labelposition">
                        ${['inside', 'bottom', 'below', 'above'].map(p => `<option value="${p}" ${obj.labelPosition === p ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                </div>`;
        }
        if (isConnector) {
            const from = obj.startObject ? (obj.startObject.label || ShapeRegistry.displayName(obj.startObject.type)) : '?';
            const to = obj.endObject ? (obj.endObject.label || ShapeRegistry.displayName(obj.endObject.type)) : '?';
            html += `<p class="hint">${escapeHtml(from)} <b>${escapeHtml(portLabel(obj.startAnchor))}</b> → ${escapeHtml(to)} <b>${escapeHtml(portLabel(obj.endAnchor))}</b>${obj.isDangling() ? '<br><span class="warn">⚠ A port no longer exists — reconnect or restore the port count.</span>' : ''}</p>`;
        }
        if (!isConnector) {
            html += `
                <div class="field">
                    <label for="prop-description">Notes</label>
                    <textarea id="prop-description" rows="2" placeholder="model, IP, rack position…">${escapeHtml(obj.description || '')}</textarea>
                </div>`;
        }
        html += `<div class="id-text">${escapeHtml(obj.id)}</div></div>`;

        if (isConnector) {
            html += `
            <div class="prop-section">
                <div class="prop-section-title">Connection</div>
                <div class="field"><label for="prop-connectiontype">Type</label><select id="prop-connectiontype">${this.connectionTypeOptions(obj.connectionType || '')}</select></div>
                <div class="prop-grid">
                    <div class="field"><label for="prop-style">Path</label>
                        <select id="prop-style">${['straight', 'orthogonal', 'bezier', 'polyline'].map(s => `<option value="${s}" ${obj.style === s ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select></div>
                    <div class="field"><label for="prop-linestyle">Line</label>
                        <select id="prop-linestyle">${['solid', 'dashed', 'dotted'].map(s => `<option value="${s}" ${obj.lineStyle === s ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select></div>
                </div>
                <div class="check-row">
                    <label><input type="checkbox" id="prop-arrowstart" ${obj.arrowStart ? 'checked' : ''}> Arrow at start</label>
                    <label><input type="checkbox" id="prop-arrowend" ${obj.arrowEnd ? 'checked' : ''}> Arrow at end</label>
                </div>
                <div class="btn-row" style="margin-top:8px">
                    <button class="mini-btn wide" id="prop-straighten" ${obj.waypoints.length ? '' : 'disabled'}>Straighten (${obj.waypoints.length} waypoint${obj.waypoints.length === 1 ? '' : 's'})</button>
                    <button class="mini-btn wide" id="prop-reverse">Reverse direction</button>
                </div>
                <p class="hint">Right-click the link on the canvas to add or remove waypoints.</p>
            </div>`;
        } else {
            html += `
            <div class="prop-section">
                <div class="prop-section-title">Position &amp; size</div>
                <div class="prop-grid">
                    <div class="field"><label for="prop-x">X</label><input type="number" id="prop-x" value="${Math.round(obj.x)}"></div>
                    <div class="field"><label for="prop-y">Y</label><input type="number" id="prop-y" value="${Math.round(obj.y)}"></div>`;
            if (obj.type !== 'connector_anchor') {
                html += `
                    <div class="field"><label for="prop-width">Width</label><input type="number" id="prop-width" value="${Math.round(obj.width)}"></div>
                    <div class="field"><label for="prop-height">Height</label><input type="number" id="prop-height" value="${Math.round(obj.height)}"></div>
                </div>
                <div class="field">
                    <label for="prop-rotation">Rotation</label>
                    <div class="range-row"><input type="range" id="prop-rotation" min="0" max="${Math.PI * 2}" step="0.01" value="${obj.rotation || 0}"><span>${Math.round((obj.rotation || 0) * 180 / Math.PI)}°</span></div>
                </div>`;
            } else {
                html += '</div>';
            }
            html += '</div>';
        }

        if (obj.ports) {
            const missing = ConnectionTypeRegistry.list().filter(t => !obj.ports[t.id]);
            html += `
            <div class="prop-section">
                <div class="prop-section-title">Ports <span class="badge">in ← · → out</span></div>
                <table class="port-table">
                    <thead><tr><th>Type</th><th>In</th><th>Out</th><th></th></tr></thead>
                    <tbody>
                    ${Object.keys(obj.ports).map(type => {
                        const cfg = obj.ports[type];
                        const def = ConnectionTypeRegistry.get(type);
                        return `<tr>
                            <td><span class="port-swatch" style="background:${escapeHtml(ConnectionTypeRegistry.colorFor(type))}"></span>${escapeHtml(def ? def.label : type)}</td>
                            <td><input type="number" id="prop-port-${escapeHtml(type)}-input" min="0" max="256" value="${cfg.input || 0}"></td>
                            <td><input type="number" id="prop-port-${escapeHtml(type)}-output" min="0" max="256" value="${cfg.output || 0}"></td>
                            <td><button class="mini-btn" data-remove-port="${escapeHtml(type)}" title="Remove port type">×</button></td>
                        </tr>`;
                    }).join('')}
                    </tbody>
                </table>
                <div class="port-add-row">
                    <select id="prop-port-add-type" aria-label="Port type to add">${missing.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.label)}</option>`).join('')}</select>
                    <button id="prop-port-add" class="mini-btn wide" ${missing.length ? '' : 'disabled'}>+ Add</button>
                </div>
            </div>`;
        }

        if (obj.type === 'connector_anchor') {
            html += `
            <div class="prop-section">
                <div class="prop-section-title">Connection</div>
                <div class="field"><label for="prop-connectiontype">Accepts</label><select id="prop-connectiontype">${this.connectionTypeOptions(obj.connectionType || '')}</select></div>
                <p class="hint">Untyped anchors accept any connection type.</p>
            </div>`;
        }

        if (obj.type === 'text') {
            html += `
            <div class="prop-section">
                <div class="prop-section-title">Text</div>
                <div class="field"><textarea id="prop-text" rows="3">${escapeHtml(obj.text || '')}</textarea></div>
                <div class="prop-grid">
                    <div class="field"><label for="prop-fontsize">Size</label><input type="number" id="prop-fontsize" value="${obj.fontSize}"></div>
                    <div class="field"><label for="prop-fontfamily">Font</label>
                        <select id="prop-fontfamily">${['Arial', 'Helvetica', 'Times New Roman', 'Courier New'].map(f => `<option value="${f}" ${obj.fontFamily === f ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
                </div>
                <div class="btn-row">
                    <button class="icon-btn ${obj.textAlign === 'left' ? 'active' : ''}" id="prop-align-left" data-tip="Align left">${icon('i-align-left')}</button>
                    <button class="icon-btn ${obj.textAlign === 'center' ? 'active' : ''}" id="prop-align-center" data-tip="Align centre">${icon('i-align-center')}</button>
                    <button class="icon-btn ${obj.textAlign === 'right' ? 'active' : ''}" id="prop-align-right" data-tip="Align right">${icon('i-align-right')}</button>
                </div>
            </div>`;
        }

        html += `
            <div class="prop-section">
                <div class="prop-section-title">Appearance</div>
                <div class="prop-grid">`;
        if (obj.fill !== undefined && !isConnector) {
            html += `<div class="field"><label for="prop-fill">${obj.type === 'text' ? 'Text colour' : 'Fill'}</label><input type="color" id="prop-fill" value="${escapeHtml(hex(obj.fill, '#3498db'))}"></div>`;
        }
        if (obj.stroke !== undefined && obj.stroke !== 'transparent') {
            html += `<div class="field"><label for="prop-stroke">${isConnector ? 'Colour' : 'Stroke'}</label><input type="color" id="prop-stroke" value="${escapeHtml(hex(obj.stroke, '#2c3e50'))}"></div>`;
        }
        html += `</div>`;
        if (obj.stroke !== undefined && obj.stroke !== 'transparent') {
            html += `<div class="field"><label for="prop-strokewidth">${isConnector ? 'Line width' : 'Stroke width'}</label>
                <div class="range-row"><input type="range" id="prop-strokewidth" min="1" max="10" value="${obj.strokeWidth || 2}"><span>${obj.strokeWidth || 2}px</span></div></div>`;
        }
        html += `<div class="check-row">`;
        if (obj.shadow !== undefined) html += `<label><input type="checkbox" id="prop-shadow" ${obj.shadow ? 'checked' : ''}> Shadow</label>`;
        if (!isConnector) html += `<label><input type="checkbox" id="prop-locked" ${obj.locked ? 'checked' : ''}> Locked</label>`;
        html += `<label><input type="checkbox" id="prop-visible" ${obj.visible !== false ? 'checked' : ''}> Visible</label>`;
        html += `</div></div>`;
        return html;
    }

    attachSingle(obj) {
        const app = this.app;
        const numeric = (setter) => (val) => {
            const n = parseFloat(val);
            if (Number.isFinite(n)) setter(n);
        };
        const props = {
            'prop-x': numeric(v => { obj.x = v; }),
            'prop-y': numeric(v => { obj.y = v; }),
            'prop-width': numeric(v => { if (Math.abs(v) >= 1) obj.width = v; }),
            'prop-height': numeric(v => { if (Math.abs(v) >= 1) obj.height = v; }),
            'prop-rotation': numeric(v => { obj.rotation = v; }),
            'prop-fill': (val) => { obj.fill = val; },
            'prop-stroke': (val) => { obj.stroke = val; },
            'prop-strokewidth': numeric(v => { obj.strokeWidth = v; }),
            'prop-text': (val) => { obj.text = val; },
            'prop-fontsize': numeric(v => { if (v > 0) obj.fontSize = v; }),
            'prop-fontfamily': (val) => { obj.fontFamily = val; },
            'prop-style': (val) => { obj.style = val; },
            'prop-linestyle': (val) => { obj.lineStyle = val; },
            'prop-arrowstart': (val) => { obj.arrowStart = val; },
            'prop-arrowend': (val) => { obj.arrowEnd = val; },
            'prop-shadow': (val) => { obj.shadow = val; },
            'prop-locked': (val) => { obj.locked = val; },
            'prop-visible': (val) => { obj.visible = val; },
            'prop-label': (val) => { obj.label = val; },
            'prop-labelposition': (val) => { obj.labelPosition = val; },
            'prop-description': (val) => { obj.description = val; },
            'prop-connectiontype': (val) => {
                obj.connectionType = val || null;
                if (obj.type === 'connector' && val) obj.stroke = ConnectionTypeRegistry.colorFor(val);
            }
        };

        Object.keys(props).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const isCheckbox = el.type === 'checkbox';
            const isSelect = el.tagName === 'SELECT';
            el.addEventListener(isCheckbox || isSelect ? 'change' : 'input', (e) => {
                const value = isCheckbox ? e.target.checked : e.target.value;
                props[id](value);
                app.render();
                if (id === 'prop-strokewidth') e.target.nextElementSibling.textContent = value + 'px';
                else if (id === 'prop-rotation') e.target.nextElementSibling.textContent = Math.round(value * 180 / Math.PI) + '°';
                if (isCheckbox || isSelect) {
                    app.saveState();
                    if (id === 'prop-style' || id === 'prop-connectiontype') this.render();
                }
            });
            if (!isCheckbox && !isSelect) el.addEventListener('change', () => app.saveState());
        });

        [['prop-align-left', 'left'], ['prop-align-center', 'center'], ['prop-align-right', 'right']].forEach(([id, align]) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => {
                obj.textAlign = align;
                app.saveState();
                app.render();
                this.render();
            });
        });

        const straighten = document.getElementById('prop-straighten');
        if (straighten) straighten.addEventListener('click', () => {
            obj.waypoints = [];
            app.saveState();
            app.render();
            this.render();
        });
        const reverse = document.getElementById('prop-reverse');
        if (reverse) reverse.addEventListener('click', () => {
            obj.reverse();
            app.saveState();
            app.render();
            this.render();
        });

        if (obj.ports) {
            for (const type of Object.keys(obj.ports)) {
                for (const direction of ['input', 'output']) {
                    const el = document.getElementById(`prop-port-${type}-${direction}`);
                    if (!el) continue;
                    el.addEventListener('input', (e) => {
                        const n = parseInt(e.target.value, 10);
                        if (!Number.isFinite(n)) return;
                        obj.ports[type][direction] = Math.max(0, Math.min(256, n));
                        app.render();
                    });
                    el.addEventListener('change', () => {
                        app.reportDanglingConnectors(obj);
                        app.saveState();
                    });
                }
            }
            this.content.querySelectorAll('[data-remove-port]').forEach(btn => {
                btn.addEventListener('click', () => {
                    delete obj.ports[btn.dataset.removePort];
                    app.reportDanglingConnectors(obj);
                    app.saveState();
                    app.render();
                    this.render();
                });
            });
            const addBtn = document.getElementById('prop-port-add');
            const addSelect = document.getElementById('prop-port-add-type');
            if (addBtn && addSelect) {
                addBtn.addEventListener('click', () => {
                    const type = addSelect.value;
                    if (!type || obj.ports[type]) return;
                    obj.ports[type] = { input: 1, output: 1 };
                    app.saveState();
                    app.render();
                    this.render();
                });
            }
        }
    }

    // ------------------------------------------------------------------
    // Multi selection
    // ------------------------------------------------------------------
    multiHtml(objs) {
        const shapes = objs.filter(o => o.type !== 'connector');
        const connectors = objs.filter(o => o.type === 'connector');
        const counts = {};
        objs.forEach(o => { counts[o.type] = (counts[o.type] || 0) + 1; });
        let html = `
            <div class="prop-section">
                <div class="prop-section-title">Selection</div>
                <p class="hint">${Object.entries(counts).map(([t, n]) => `${n} × ${escapeHtml(t === 'connector' ? 'connector' : ShapeRegistry.displayName(t))}`).join(', ')}</p>
                <p class="hint">Changes below apply to every selected object.</p>
            </div>
            <div class="prop-section">
                <div class="prop-section-title">Appearance</div>
                <div class="prop-grid">`;
        if (shapes.length) html += `<div class="field"><label for="multi-fill">Fill</label><input type="color" id="multi-fill" value="${escapeHtml(hex(shapes[0].fill, '#3498db'))}"></div>`;
        html += `<div class="field"><label for="multi-stroke">${shapes.length ? 'Stroke' : 'Colour'}</label><input type="color" id="multi-stroke" value="${escapeHtml(hex(objs[0].stroke, '#2c3e50'))}"></div>`;
        html += `</div>
                <div class="field"><label for="multi-strokewidth">Stroke width</label>
                    <div class="range-row"><input type="range" id="multi-strokewidth" min="1" max="10" value="${objs[0].strokeWidth || 2}"><span>${objs[0].strokeWidth || 2}px</span></div></div>`;
        if (shapes.length) {
            html += `<div class="field"><label for="multi-labelposition">Label position</label>
                <select id="multi-labelposition"><option value="">(keep)</option>${['inside', 'bottom', 'below', 'above'].map(p => `<option value="${p}">${p}</option>`).join('')}</select></div>`;
        }
        if (connectors.length) {
            html += `<div class="prop-grid">
                <div class="field"><label for="multi-style">Path</label><select id="multi-style"><option value="">(keep)</option>${['straight', 'orthogonal', 'bezier', 'polyline'].map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
                <div class="field"><label for="multi-linestyle">Line</label><select id="multi-linestyle"><option value="">(keep)</option>${['solid', 'dashed', 'dotted'].map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
            </div>`;
        }
        html += `<div class="check-row">
                    <label><input type="checkbox" id="multi-shadow" ${objs.every(o => o.shadow) ? 'checked' : ''}> Shadow</label>
                    ${shapes.length ? `<label><input type="checkbox" id="multi-locked" ${shapes.every(o => o.locked) ? 'checked' : ''}> Locked</label>` : ''}
                </div>
            </div>`;
        return html;
    }

    attachMulti(objs) {
        const app = this.app;
        const shapes = objs.filter(o => o.type !== 'connector');
        const connectors = objs.filter(o => o.type === 'connector');
        const bind = (id, event, fn) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener(event, (e) => {
                fn(el.type === 'checkbox' ? e.target.checked : e.target.value, e);
                app.render();
                if (event === 'change') app.saveState();
            });
            if (event === 'input') el.addEventListener('change', () => app.saveState());
        };
        bind('multi-fill', 'input', v => shapes.forEach(o => { if (o.fill !== undefined) o.fill = v; }));
        bind('multi-stroke', 'input', v => objs.forEach(o => { if (o.stroke !== 'transparent') o.stroke = v; }));
        bind('multi-strokewidth', 'input', (v, e) => {
            objs.forEach(o => { o.strokeWidth = parseFloat(v); });
            e.target.nextElementSibling.textContent = v + 'px';
        });
        bind('multi-labelposition', 'change', v => { if (v) shapes.forEach(o => { o.labelPosition = v; }); });
        bind('multi-style', 'change', v => { if (v) connectors.forEach(o => { o.style = v; }); });
        bind('multi-linestyle', 'change', v => { if (v) connectors.forEach(o => { o.lineStyle = v; }); });
        bind('multi-shadow', 'change', v => objs.forEach(o => { if (o.shadow !== undefined) o.shadow = v; }));
        bind('multi-locked', 'change', v => shapes.forEach(o => { o.locked = v; }));
    }

    // ------------------------------------------------------------------
    // Arrange section
    // ------------------------------------------------------------------
    arrangeHtml(objs) {
        const shapes = objs.filter(o => o.type !== 'connector');
        const many = shapes.length >= 2;
        const three = shapes.length >= 3;
        const grouped = shapes.some(s => s.groupId !== null && s.groupId !== undefined);
        const btn = (id, ic, tip, disabled = false, cls = '') =>
            `<button class="icon-btn ${cls}" id="${id}" data-tip="${escapeHtml(tip)}" ${disabled ? 'disabled' : ''}>${icon(ic)}</button>`;
        return `
            <div class="prop-section">
                <div class="prop-section-title">Arrange</div>
                <div class="btn-row">
                    ${btn('ar-front', 'i-front', 'Bring to front (Shift+])')}
                    ${btn('ar-forward', 'i-forward', 'Bring forward (])')}
                    ${btn('ar-backward', 'i-backward', 'Send backward ([)')}
                    ${btn('ar-back', 'i-back', 'Send to back (Shift+[)')}
                    ${btn('ar-group', 'i-group', 'Group (Ctrl+G)', !many)}
                    ${btn('ar-ungroup', 'i-ungroup', 'Ungroup (Ctrl+Shift+G)', !grouped)}
                </div>
                <div class="btn-row">
                    ${btn('ar-left', 'i-align-left', 'Align left', !many)}
                    ${btn('ar-center', 'i-align-center', 'Align centre', !many)}
                    ${btn('ar-right', 'i-align-right', 'Align right', !many)}
                    ${btn('ar-top', 'i-align-top', 'Align top', !many)}
                    ${btn('ar-middle', 'i-align-middle', 'Align middle', !many)}
                    ${btn('ar-bottom', 'i-align-bottom', 'Align bottom', !many)}
                    ${btn('ar-dist-h', 'i-dist-h', 'Distribute horizontally', !three)}
                    ${btn('ar-dist-v', 'i-dist-v', 'Distribute vertically', !three)}
                </div>
                <div class="btn-row">
                    ${btn('ar-duplicate', 'i-duplicate', 'Duplicate (Ctrl+D)')}
                    ${btn('ar-delete', 'i-trash', 'Delete (Del)', false, 'danger')}
                </div>
            </div>`;
    }

    attachArrange() {
        const app = this.app;
        const map = {
            'ar-front': () => app.bringToFront(), 'ar-forward': () => app.bringForward(),
            'ar-backward': () => app.sendBackward(), 'ar-back': () => app.sendToBack(),
            'ar-group': () => app.groupSelected(), 'ar-ungroup': () => app.ungroupSelected(),
            'ar-left': () => app.align('left'), 'ar-center': () => app.align('center'), 'ar-right': () => app.align('right'),
            'ar-top': () => app.align('top'), 'ar-middle': () => app.align('middle'), 'ar-bottom': () => app.align('bottom'),
            'ar-dist-h': () => app.distribute('horizontal'), 'ar-dist-v': () => app.distribute('vertical'),
            'ar-duplicate': () => app.duplicate(), 'ar-delete': () => app.deleteSelected()
        };
        for (const [id, fn] of Object.entries(map)) {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', fn);
        }
    }
}
