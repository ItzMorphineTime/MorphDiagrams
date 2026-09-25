/**
 * @module main
 * @description Browser entry point: the `CanvasApp` editor. Handles the canvas, mouse/keyboard input,
 * selection and transforms, inline editing, the tool palette / status bar, templates, file operations,
 * autosave and live sync with the MCP server. Diagram semantics (objects, ports, connections,
 * validation, layout, serialisation) live in the headless {@link module:core/Diagram} model.
 *
 * @see module:core/Diagram
 * @see module:ui/PropertiesPanel
 */

import { Connector } from './core/Connector.js';
import { Diagram } from './core/Diagram.js';
import { ShapeRegistry } from './core/ShapeRegistry.js';
import { serializeObjects, deserializeObjects, createDocument, parseDocument } from './core/Serialization.js';
import { diagramToSvg } from './core/SvgExporter.js';
import { expectedCounterpartPortType, portLabel } from './core/Ports.js';
import { computeSmartGuides } from './core/SmartGuides.js';
import { ContextMenu } from './ui/ContextMenu.js';
import { LiveSync } from './ui/LiveSync.js';
import { PropertiesPanel } from './ui/PropertiesPanel.js';
import { showToast, confirmDialog } from './ui/Dialogs.js';
import { installTooltips } from './ui/Tooltip.js';
import { IconLibrary } from './utils/IconLibrary.js';
import { Templates } from './utils/Templates.js';
import { contrastColor } from './utils/Color.js';
import { escapeHtml, newId, downloadBlob, debounce } from './utils/Dom.js';
import {
    ConnectionTypeRegistry, ObjectColors, DEFAULT_OBJECT_COLORS, DEFAULT_CONNECTION_COLORS
} from './config/ConnectionTypes.js';

/** Maps system object types to their key in {@link ObjectColors}. */
const OBJECT_COLOR_KEYS = {
    server: 'SERVER',
    network_switch: 'NETWORK_SWITCH',
    video_matrix: 'VIDEO_MATRIX',
    led_processor: 'LED_PROCESSOR',
    sync_generator: 'SYNC_GENERATOR',
    device: 'DEVICE'
};

const AUTOSAVE_KEY = 'morph:autosave';

const TOOL_HINTS = {
    select: 'Drag to move · Shift+click adds to the selection · Double-click renames · Right-click for actions',
    connector: 'Press on a port and release on a compatible port of another object · Esc cancels',
    polyline: 'Click a port to start, click to add corners, click a port to finish · Esc cancels',
    text: 'Click on the canvas to place a text block',
    shape: 'Click to place at the default size, or drag to size it'
};

/**
 * Main application class that manages the canvas-based diagramming tool.
 * @class CanvasApp
 */
class CanvasApp {
    constructor() {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.getElementById('canvas');
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('canvas-container');

        /** @type {Diagram} Headless document model (objects live in `diagram.objects`) */
        this.diagram = new Diagram();
        /** @type {Array} Currently selected objects */
        this.selectedObjects = [];
        /** @type {string} Current tool */
        this.currentTool = 'select';
        /** @type {Array} Serialised objects for paste operations */
        this.clipboard = [];
        /** @type {string} Path style for new connectors */
        this.defaultConnectorStyle = 'orthogonal';

        this.dpr = 1;
        this.viewWidth = 0;
        this.viewHeight = 0;

        this.isDrawing = false;
        this.isDragging = false;
        this.dragMoved = false;
        this.dragStart = null;
        this.dragOrigin = null;
        this.dragPrimary = null;
        this.activeGuides = [];
        this.tempObject = null;

        this.isResizing = false;
        this.isRotating = false;
        this.resizeHandle = null;
        this.rotateCenter = null;
        this.initialBounds = null;
        this.initialRotation = 0;

        this.isDraggingWaypoint = false;
        this.isDraggingControlPoint = false;
        this.waypointConnector = null;
        this.waypointIndex = -1;
        this.controlPointConnector = null;
        this.controlPointType = null;

        this.connectorStart = null;
        this.isDrawingPolyline = false;
        this.polylineWaypoints = [];

        this.hoverObject = null;

        this.gridSize = 20;
        this.showGrid = true;
        this.snapToGrid = true;
        this.showShadows = false;
        /** @type {boolean} Draw port names next to port dots on every device */
        this.showPortLabels = false;

        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.isPanning = false;
        this.panStartX = 0;
        this.panStartY = 0;
        this.spacePressed = false;

        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;

        /** @type {LiveSync|null} Live connection to the MCP server / bridge (when served by it) */
        this.liveSync = null;
        this.applyingRemote = false;
        this.inlineTarget = null;

        this.contextMenu = new ContextMenu(this.canvas);
        this.propertiesPanel = new PropertiesPanel(this);
        this.tooltips = installTooltips();
        this.scheduleAutosave = debounce(() => this.autosave(), 800);

        this.resizeCanvas();
        this.setupEventListeners();
        this.setTool('select');
        this.updatePropertiesPanel();
        this.saveState();

        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(() => this.resizeCanvas()).observe(this.container);
        } else {
            window.addEventListener('resize', () => this.resizeCanvas());
        }
        this.initLiveSync();
    }

    /** @returns {Array} All objects (shapes and connectors) */
    get objects() {
        return this.diagram.objects;
    }

    set objects(value) {
        this.diagram.objects = value;
    }

    /** @returns {number} */
    get nextGroupId() {
        return this.diagram.nextGroupId;
    }

    set nextGroupId(value) {
        this.diagram.nextGroupId = value;
    }

    resizeCanvas() {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        if (!w || !h) return;
        this.dpr = window.devicePixelRatio || 1;
        this.viewWidth = w;
        this.viewHeight = h;
        this.canvas.width = Math.round(w * this.dpr);
        this.canvas.height = Math.round(h * this.dpr);
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        this.render();
    }

    // ------------------------------------------------------------------
    // Event wiring
    // ------------------------------------------------------------------
    setupEventListeners() {
        const on = (id, event, handler) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(event, handler);
        };

        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => this.setTool(e.currentTarget.dataset.tool));
        });

        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => {
            this.hidePortTooltip();
            if (this.isDragging || this.isDrawing || this.isResizing || this.isRotating) this.handleMouseUp(e);
        });
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        on('undo-btn', 'click', () => this.undo());
        on('redo-btn', 'click', () => this.redo());

        on('grid-toggle', 'change', (e) => { this.showGrid = e.target.checked; this.render(); });
        on('snap-toggle', 'change', (e) => { this.snapToGrid = e.target.checked; });
        on('shadow-toggle', 'change', (e) => {
            this.showShadows = e.target.checked;
            this.selectedObjects.forEach(obj => { if (obj.shadow !== undefined) obj.shadow = this.showShadows; });
            this.render();
        });
        on('port-labels-toggle', 'change', (e) => { this.showPortLabels = e.target.checked; this.render(); });
        on('connector-style', 'change', (e) => { this.defaultConnectorStyle = e.target.value; });
        on('status-validation', 'click', () => { this.selectedObjects = []; this.updatePropertiesPanel(); this.render(); });

        on('zoom-in', 'click', () => this.zoomAt(this.viewWidth / 2, this.viewHeight / 2, this.zoom * 1.2));
        on('zoom-out', 'click', () => this.zoomAt(this.viewWidth / 2, this.viewHeight / 2, this.zoom / 1.2));
        on('zoom-fit', 'click', () => this.zoomToFit());
        on('zoom-level', 'click', () => this.setZoom(1));

        on('diagram-name', 'input', (e) => {
            this.diagram.metadata.name = e.target.value.trim();
            if (this.liveSync) this.liveSync.push();
            this.scheduleAutosave();
        });

        on('new-btn', 'click', () => this.new());
        on('load-btn', 'click', () => this.load());
        on('save-btn', 'click', () => this.save());
        on('export-png-btn', 'click', () => { this.closeDropdowns(); this.exportPNG(); });
        on('export-svg-btn', 'click', () => { this.closeDropdowns(); this.exportSVG(); });
        on('export-pdf-btn', 'click', () => { this.closeDropdowns(); this.exportPDF(); });
        on('export-btn', 'click', (e) => {
            e.stopPropagation();
            e.currentTarget.parentElement.classList.toggle('open');
        });
        document.addEventListener('click', () => this.closeDropdowns());

        on('templates-btn', 'click', () => this.showTemplates());
        on('hint-template-btn', 'click', () => this.showTemplates());
        on('hint-open-btn', 'click', () => this.load());
        on('icons-btn', 'click', () => this.showIcons());
        on('image-btn', 'click', () => this.addImage());
        on('settings-btn', 'click', () => this.showSettings());
        on('help-btn', 'click', () => this.toggleHelp());
        on('toggle-panel-btn', 'click', () => {
            document.querySelector('.app').classList.toggle('panel-collapsed');
            requestAnimationFrame(() => this.resizeCanvas());
        });
        on('live-status', 'click', () => { if (this.liveSync) this.liveSync.pull(); });

        on('file-input', 'change', (e) => this.handleFileLoad(e));
        on('image-input', 'change', (e) => this.handleImageLoad(e));

        document.querySelectorAll('.modal .close').forEach(btn => {
            btn.addEventListener('click', (e) => { e.target.closest('.modal').style.display = 'none'; });
        });
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
        });

        on('reset-colors-btn', 'click', () => this.resetColors());
        on('apply-colors-btn', 'click', () => this.applyColors());
        on('add-connection-type-btn', 'click', () => this.addConnectionType());

        const editor = document.getElementById('inline-editor');
        if (editor) {
            editor.addEventListener('keydown', (e) => {
                e.stopPropagation();
                if (e.key === 'Escape') { e.preventDefault(); this.cancelInlineEdit(); }
                else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.commitInlineEdit(); }
            });
            editor.addEventListener('blur', () => this.commitInlineEdit());
            editor.addEventListener('input', () => this.autosizeInlineEditor());
        }
    }

    closeDropdowns() {
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }

    setTool(tool) {
        if (this.isDrawingPolyline && tool !== 'polyline') this.cancelPolyline();
        this.currentTool = tool;
        document.querySelectorAll('[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === tool));
        this.canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
        this.updateStatusHint();
        this.render();
    }

    // ------------------------------------------------------------------
    // Status bar / chrome
    // ------------------------------------------------------------------
    updateStatusHint(text) {
        const el = document.getElementById('status-hint');
        if (!el) return;
        if (text) { el.textContent = text; return; }
        if (this.isDrawingPolyline) { el.textContent = 'Click to add a corner · click a compatible port to finish · Esc cancels'; return; }
        el.textContent = TOOL_HINTS[this.currentTool] || TOOL_HINTS.shape;
    }

    updateStatusSelection() {
        const el = document.getElementById('status-selection');
        if (!el) return;
        const n = this.selectedObjects.length;
        el.textContent = n ? `${n} selected` : '';
    }

    updateStatusCoords(pos) {
        const el = document.getElementById('status-coords');
        if (el) el.textContent = `${Math.round(pos.x)}, ${Math.round(pos.y)}`;
    }

    updateValidationChip() {
        const el = document.getElementById('status-validation');
        if (!el) return;
        const { errors, warnings } = this.diagram.validate();
        if (!errors.length && !warnings.length) { el.style.display = 'none'; return; }
        el.style.display = 'inline-block';
        el.className = `status-chip ${errors.length ? 'error' : ''}`;
        const parts = [];
        if (errors.length) parts.push(`${errors.length} error${errors.length === 1 ? '' : 's'}`);
        if (warnings.length) parts.push(`${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
        el.textContent = parts.join(' · ');
    }

    updateEmptyState() {
        const el = document.getElementById('canvas-hint');
        if (el) el.style.display = this.objects.length === 0 ? 'flex' : 'none';
    }

    toggleHelp() {
        const modal = document.getElementById('help-modal');
        if (!modal) return;
        modal.style.display = modal.style.display === 'none' || !modal.style.display ? 'block' : 'none';
    }

    /**
     * Mouse position in world coordinates. Snapping only applies to shape-drawing tools; the select and
     * connector tools need the exact position so that closely spaced ports can be picked.
     * @param {MouseEvent} e
     * @param {{snap: boolean}} [options]
     * @returns {{x:number,y:number}}
     */
    getMousePos(e, options = {}) {
        const rect = this.canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left - this.panX) / this.zoom;
        let y = (e.clientY - rect.top - this.panY) / this.zoom;
        const snapTools = !['select', 'connector', 'polyline'].includes(this.currentTool);
        const snap = options.snap !== undefined ? options.snap : (this.snapToGrid && snapTools);
        if (snap) {
            x = Math.round(x / this.gridSize) * this.gridSize;
            y = Math.round(y / this.gridSize) * this.gridSize;
        }
        return { x, y };
    }

    toScreen(x, y) {
        return { x: x * this.zoom + this.panX, y: y * this.zoom + this.panY };
    }

    // ------------------------------------------------------------------
    // Mouse handling
    // ------------------------------------------------------------------
    handleMouseDown(e) {
        this.commitInlineEdit();
        if (e.button === 1 || (e.button === 0 && this.spacePressed)) {
            e.preventDefault();
            this.isPanning = true;
            this.panStartX = e.clientX - this.panX;
            this.panStartY = e.clientY - this.panY;
            this.canvas.style.cursor = 'grabbing';
            return;
        }
        if (e.button !== 0) return;

        const pos = this.getMousePos(e);
        if (this.currentTool === 'select') {
            this.handleSelectMouseDown(pos, e);
        } else if (this.currentTool === 'connector') {
            this.handleConnectorMouseDown(pos);
        } else if (this.currentTool === 'polyline') {
            this.handlePolylineClick(pos);
        } else if (this.currentTool === 'text') {
            this.createTextShape(pos);
        } else {
            this.handleShapeMouseDown(pos);
        }
        this.render();
    }

    handleSelectMouseDown(pos, e) {
        const waypoint = this.findWaypointAtPoint(pos.x, pos.y);
        if (waypoint) {
            if (e.altKey) {
                waypoint.connector.waypoints.splice(waypoint.index, 1);
                this.saveState();
                this.updatePropertiesPanel();
                return;
            }
            this.isDraggingWaypoint = true;
            this.waypointConnector = waypoint.connector;
            this.waypointIndex = waypoint.index;
            this.dragStart = pos;
            return;
        }

        const controlPoint = this.findControlPointAtPoint(pos.x, pos.y);
        if (controlPoint) {
            this.isDraggingControlPoint = true;
            this.controlPointConnector = controlPoint.connector;
            this.controlPointType = controlPoint.type;
            this.dragStart = pos;
            return;
        }

        const handle = this.findHandleAtPoint(pos.x, pos.y);
        if (handle) {
            if (handle.type === 'resize') {
                this.isResizing = true;
                this.resizeHandle = handle.handle;
                this.dragStart = pos;
                this.initialBounds = { x: handle.obj.x, y: handle.obj.y, width: handle.obj.width, height: handle.obj.height };
            } else if (handle.type === 'rotate') {
                this.isRotating = true;
                this.rotateCenter = handle.center;
                this.dragStart = pos;
                this.initialRotation = this.selectedObjects[0].rotation || 0;
            }
            return;
        }

        const clicked = this.findObjectAtPoint(pos.x, pos.y);
        if (clicked) {
            let toSelect = [clicked];
            if (clicked.groupId) toSelect = this.getGroupMembers(clicked.groupId);

            if (!e.shiftKey) {
                if (!this.selectedObjects.includes(clicked)) this.selectedObjects = toSelect;
            } else {
                const alreadySelected = this.selectedObjects.includes(clicked);
                if (alreadySelected) {
                    toSelect.forEach(obj => {
                        const idx = this.selectedObjects.indexOf(obj);
                        if (idx >= 0) this.selectedObjects.splice(idx, 1);
                    });
                } else {
                    toSelect.forEach(obj => { if (!this.selectedObjects.includes(obj)) this.selectedObjects.push(obj); });
                }
            }
            this.startDrag(pos, clicked);
        } else {
            if (!e.shiftKey) this.selectedObjects = [];
            this.isDrawing = true;
            this.tempObject = { type: 'selection', x: pos.x, y: pos.y, width: 0, height: 0 };
        }
        this.updatePropertiesPanel();
    }

    /**
     * Objects that move with the current selection (selected shapes plus their group members).
     * @returns {Array}
     */
    getMovingObjects() {
        const moving = new Set();
        this.selectedObjects.forEach(obj => {
            if (obj.type === 'connector') return;
            moving.add(obj);
            if (obj.groupId) this.getGroupMembers(obj.groupId).forEach(m => { if (m.type !== 'connector') moving.add(m); });
        });
        return [...moving].filter(o => !o.locked);
    }

    startDrag(pos, primary) {
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStart = pos;
        this.dragOrigin = new Map();
        this.getMovingObjects().forEach(obj => this.dragOrigin.set(obj, { x: obj.x, y: obj.y }));
        this.dragPrimary = primary && primary.type !== 'connector' && !primary.locked ? primary : null;
        this.activeGuides = [];
    }

    handleDragMove(pos) {
        if (!this.dragOrigin || this.dragOrigin.size === 0) return;
        let dx = pos.x - this.dragStart.x;
        let dy = pos.y - this.dragStart.y;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) this.dragMoved = true;

        if (this.snapToGrid && this.dragPrimary && this.dragOrigin.has(this.dragPrimary)) {
            const o = this.dragOrigin.get(this.dragPrimary);
            dx = Math.round((o.x + dx) / this.gridSize) * this.gridSize - o.x;
            dy = Math.round((o.y + dy) / this.gridSize) * this.gridSize - o.y;
        }

        // Smart guides against the shapes that are not moving.
        const moving = [...this.dragOrigin.keys()];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const obj of moving) {
            const o = this.dragOrigin.get(obj);
            const b = obj.getBounds();
            const bx = o.x + dx + (b.x - obj.x);
            const by = o.y + dy + (b.y - obj.y);
            minX = Math.min(minX, bx);
            minY = Math.min(minY, by);
            maxX = Math.max(maxX, bx + b.width);
            maxY = Math.max(maxY, by + b.height);
        }
        const movingBounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
        const others = this.objects
            .filter(o => o.type !== 'connector' && o.visible !== false && !this.dragOrigin.has(o))
            .map(o => o.getBounds());
        const guides = computeSmartGuides(movingBounds, others, { threshold: 6 / this.zoom });
        dx += guides.dx;
        dy += guides.dy;
        this.activeGuides = guides.guides;

        for (const obj of moving) {
            const o = this.dragOrigin.get(obj);
            obj.x = o.x + dx;
            obj.y = o.y + dy;
        }
    }

    handleShapeMouseDown(pos) {
        this.isDrawing = true;
        this.tempObject = this.createShape(this.currentTool, pos.x, pos.y, 0, 0);
        const def = ShapeRegistry.get(this.currentTool);
        this.tempObject.fixedSize = !!(def && def.fixedSize);
    }

    handleConnectorMouseDown(pos) {
        const anchor = this.findNearestAnchor(pos.x, pos.y);
        if (!anchor) return;
        this.connectorStart = anchor;
        this.isDrawing = true;
        const connectionType = anchor.connectionType || null;
        this.tempObject = new Connector(anchor.object, anchor.side, null, null, connectionType);
        this.tempObject.style = this.defaultConnectorStyle;
        this.tempObject.endX = pos.x;
        this.tempObject.endY = pos.y;
        this.applyConnectionType(this.tempObject, connectionType);
        this.showAnchorIndicator(anchor);
        this.updateStatusHint('Release on a highlighted compatible port · Esc cancels');
    }

    /**
     * Applies the colour/width convention for a typed connection.
     * @param {Connector} conn
     * @param {string|null} type
     */
    applyConnectionType(conn, type) {
        conn.connectionType = type || null;
        if (type) {
            conn.stroke = ConnectionTypeRegistry.colorFor(type);
            conn.strokeWidth = 3;
        }
    }

    findCompatibleEndAnchor(pos) {
        const requiredConnectionType = this.connectorStart.connectionType || null;
        const requiredPortType = expectedCounterpartPortType(this.connectorStart);
        const anchor = this.findNearestAnchor(pos.x, pos.y, 15, requiredConnectionType, requiredPortType);
        return anchor && anchor.object !== this.connectorStart.object ? anchor : null;
    }

    finalizeConnector(conn) {
        if (!conn.connectionType) {
            const endInfo = conn.getEndAnchorInfo();
            if (endInfo && endInfo.connectionType) this.applyConnectionType(conn, endInfo.connectionType);
        }
        delete conn.endX;
        delete conn.endY;
    }

    handlePolylineClick(pos) {
        if (!this.isDrawingPolyline) {
            const anchor = this.findNearestAnchor(pos.x, pos.y);
            if (!anchor) return;
            this.isDrawingPolyline = true;
            this.connectorStart = anchor;
            this.polylineWaypoints = [];
            this.tempObject = new Connector(anchor.object, anchor.side, null, null, anchor.connectionType || null);
            this.tempObject.style = 'polyline';
            this.tempObject.endX = pos.x;
            this.tempObject.endY = pos.y;
            this.applyConnectionType(this.tempObject, anchor.connectionType || null);
            this.showAnchorIndicator(anchor);
            this.updateStatusHint();
            return;
        }

        const anchor = this.findCompatibleEndAnchor(pos);
        if (anchor) {
            this.tempObject.endObject = anchor.object;
            this.tempObject.endAnchor = anchor.side;
            this.tempObject.waypoints = [...this.polylineWaypoints];
            this.finalizeConnector(this.tempObject);
            this.objects.push(this.tempObject);
            this.cancelPolyline();
            this.saveState();
        } else {
            const wp = this.snapToGrid ? { x: Math.round(pos.x / this.gridSize) * this.gridSize, y: Math.round(pos.y / this.gridSize) * this.gridSize } : pos;
            this.polylineWaypoints.push(wp);
            if (this.tempObject) this.tempObject.waypoints = [...this.polylineWaypoints];
        }
    }

    cancelPolyline() {
        this.isDrawingPolyline = false;
        this.connectorStart = null;
        this.polylineWaypoints = [];
        this.tempObject = null;
        this.hideAnchorIndicator();
        this.updateStatusHint();
    }

    handleMouseMove(e) {
        if (this.isPanning) {
            this.panX = e.clientX - this.panStartX;
            this.panY = e.clientY - this.panStartY;
            this.render();
            return;
        }

        const pos = this.getMousePos(e);
        this.updateStatusCoords(pos);

        if ((this.currentTool === 'connector' || this.currentTool === 'polyline') && !this.isDrawing && !this.isDrawingPolyline) {
            const anchor = this.findNearestAnchor(pos.x, pos.y);
            if (anchor) { this.showAnchorIndicator(anchor); this.showPortTooltip(anchor); }
            else { this.hideAnchorIndicator(); this.hidePortTooltip(); }
        }

        if (this.isDraggingWaypoint) {
            this.handleWaypointDrag(pos);
            this.render();
        } else if (this.isDraggingControlPoint) {
            this.handleControlPointDrag(pos);
            this.render();
        } else if (this.isResizing && this.selectedObjects.length === 1) {
            this.handleResize(pos);
            this.render();
        } else if (this.isRotating && this.selectedObjects.length === 1) {
            this.handleRotate(pos);
            this.render();
        } else if (this.isDrawing && this.tempObject) {
            if (this.tempObject.type === 'connector') {
                this.updateTempConnector(pos);
            } else if (!this.tempObject.fixedSize) {
                this.tempObject.width = pos.x - this.tempObject.x;
                this.tempObject.height = pos.y - this.tempObject.y;
            }
            this.render();
        } else if (this.isDragging && this.selectedObjects.length > 0) {
            this.handleDragMove(pos);
            this.render();
        } else if (this.currentTool === 'select') {
            this.updateHover(pos);
        } else if (this.isDrawingPolyline && this.tempObject) {
            const anchor = this.findCompatibleEndAnchor(pos);
            if (anchor) {
                this.tempObject.endObject = anchor.object;
                this.tempObject.endAnchor = anchor.side;
                this.showAnchorIndicator(anchor);
            } else {
                this.tempObject.endObject = null;
                this.tempObject.endX = pos.x;
                this.tempObject.endY = pos.y;
                this.hideAnchorIndicator();
            }
            this.render();
        }
    }

    /**
     * Hover feedback in select mode: cursor, hovered object outline and port tooltips.
     * @param {{x:number,y:number}} pos
     */
    updateHover(pos) {
        const waypoint = this.findWaypointAtPoint(pos.x, pos.y);
        const controlPoint = this.findControlPointAtPoint(pos.x, pos.y);
        let cursor = 'default';
        let hovered = null;
        if (waypoint || controlPoint) {
            cursor = 'pointer';
        } else {
            const handle = this.findHandleAtPoint(pos.x, pos.y);
            if (handle) {
                const cursors = { nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize', e: 'e-resize', se: 'se-resize', s: 's-resize', sw: 'sw-resize', w: 'w-resize' };
                cursor = handle.type === 'rotate' ? 'crosshair' : (cursors[handle.handle] || 'default');
            } else {
                hovered = this.findObjectAtPoint(pos.x, pos.y);
                cursor = hovered ? 'move' : 'default';
            }
        }
        this.canvas.style.cursor = cursor;

        const anchor = this.findNearestAnchor(pos.x, pos.y, 10);
        const typedAnchor = anchor && anchor.connectionType ? anchor : null;
        if (typedAnchor) this.showPortTooltip(typedAnchor); else this.hidePortTooltip();

        if (hovered !== this.hoverObject) {
            this.hoverObject = hovered;
            this.render();
        }
    }

    showPortTooltip(anchor) {
        const el = document.getElementById('port-tooltip');
        if (!el) return;
        const key = `${anchor.object.id}|${anchor.side}`;
        const used = this.getUsedPortKeys().has(key);
        const conn = used ? this.objects.find(c => c.type === 'connector' &&
            ((c.startObject === anchor.object && c.startAnchor === anchor.side) || (c.endObject === anchor.object && c.endAnchor === anchor.side))) : null;
        let other = '';
        if (conn) {
            const o = conn.startObject === anchor.object ? conn.endObject : conn.startObject;
            const oAnchor = conn.startObject === anchor.object ? conn.endAnchor : conn.startAnchor;
            other = o ? ` → ${o.label || ShapeRegistry.displayName(o.type)} · ${portLabel(oAnchor)}` : '';
        }
        const label = anchor.position.label || portLabel(anchor.side);
        el.innerHTML = `<b>${escapeHtml(label)}</b> <span class="muted">${used ? escapeHtml(other) : '· free'}</span>`;
        const s = this.toScreen(anchor.position.x, anchor.position.y);
        el.style.left = `${s.x}px`;
        el.style.top = `${s.y}px`;
        el.style.display = 'block';
    }

    hidePortTooltip() {
        const el = document.getElementById('port-tooltip');
        if (el) el.style.display = 'none';
    }

    updateTempConnector(pos) {
        const anchor = this.findCompatibleEndAnchor(pos);
        if (anchor) {
            this.tempObject.endObject = anchor.object;
            this.tempObject.endAnchor = anchor.side;
            this.showAnchorIndicator(anchor);
            this.showPortTooltip(anchor);
        } else {
            this.tempObject.endObject = null;
            this.tempObject.endX = pos.x;
            this.tempObject.endY = pos.y;
            this.hideAnchorIndicator();
            this.hidePortTooltip();
        }
    }

    handleMouseUp(e) {
        if (this.isPanning) {
            this.isPanning = false;
            this.canvas.style.cursor = this.spacePressed ? 'grab' : 'default';
            return;
        }

        if (this.isDrawing && this.tempObject) {
            if (this.tempObject.type === 'connector') {
                if (this.tempObject.endObject && this.tempObject.startObject !== this.tempObject.endObject) {
                    this.finalizeConnector(this.tempObject);
                    this.objects.push(this.tempObject);
                    this.selectedObjects = [this.tempObject];
                    this.updatePropertiesPanel();
                    this.saveState();
                }
                this.updateStatusHint();
            } else if (this.tempObject.type === 'selection') {
                this.selectInBox(this.tempObject, !!(e && e.altKey));
            } else {
                const shape = this.tempObject;
                delete shape.fixedSize;
                const tiny = Math.abs(shape.width) <= 5 && Math.abs(shape.height) <= 5;
                if (tiny) {
                    const def = ShapeRegistry.get(shape.type);
                    if (def && !def.fixedSize) {
                        shape.width = def.defaultSize.width;
                        shape.height = def.defaultSize.height;
                    }
                }
                this.normalizeShape(shape);
                this.objects.push(shape);
                this.selectedObjects = [shape];
                this.updatePropertiesPanel();
                this.saveState();
                if (shape.type !== 'connector_anchor' && !(e && e.shiftKey)) this.setTool('select');
            }
            if (this.currentTool !== 'polyline') {
                this.tempObject = null;
                this.connectorStart = null;
            }
        }

        if (this.isDragging && this.selectedObjects.length > 0 && this.dragMoved) {
            this.saveState();
            this.updatePropertiesPanel();
        }

        if (this.isResizing || this.isRotating || this.isDraggingWaypoint || this.isDraggingControlPoint) {
            this.saveState();
            if (this.isResizing || this.isRotating) this.updatePropertiesPanel();
        }

        this.isDrawing = false;
        this.isDragging = false;
        this.dragMoved = false;
        this.dragOrigin = null;
        this.dragPrimary = null;
        this.activeGuides = [];
        this.isResizing = false;
        this.isRotating = false;
        this.resizeHandle = null;
        this.rotateCenter = null;
        this.initialBounds = null;

        this.isDraggingWaypoint = false;
        this.isDraggingControlPoint = false;
        this.waypointConnector = null;
        this.waypointIndex = -1;
        this.controlPointConnector = null;
        this.controlPointType = null;

        if (!this.isDrawingPolyline) this.hideAnchorIndicator();
        this.render();
    }

    handleDoubleClick(e) {
        if (this.currentTool !== 'select') return;
        const pos = this.getMousePos(e);
        const obj = this.findObjectAtPoint(pos.x, pos.y);
        if (!obj) return;
        this.selectedObjects = [obj];
        this.updatePropertiesPanel();
        this.render();
        this.startInlineEdit(obj);
    }

    /**
     * Selects shapes inside (or, with `intersect`, touching) a marquee box.
     * @param {{x:number,y:number,width:number,height:number}} box
     * @param {boolean} [intersect=false]
     */
    selectInBox(box, intersect = false) {
        const minX = Math.min(box.x, box.x + box.width);
        const maxX = Math.max(box.x, box.x + box.width);
        const minY = Math.min(box.y, box.y + box.height);
        const maxY = Math.max(box.y, box.y + box.height);
        const hits = this.objects.filter(obj => {
            if (obj.type === 'connector' || obj.visible === false) return false;
            const b = obj.getBounds();
            if (intersect) return b.x < maxX && b.x + b.width > minX && b.y < maxY && b.y + b.height > minY;
            return b.x >= minX && b.x + b.width <= maxX && b.y >= minY && b.y + b.height <= maxY;
        });
        const groups = new Set(hits.map(h => h.groupId).filter(g => g !== null && g !== undefined));
        const withGroups = new Set(hits);
        groups.forEach(g => this.getGroupMembers(g).forEach(m => { if (m.type !== 'connector') withGroups.add(m); }));
        this.selectedObjects = [...withGroups];
        this.updatePropertiesPanel();
    }

    normalizeShape(shape) {
        if (shape.width < 0) {
            shape.x += shape.width;
            shape.width = Math.abs(shape.width);
        }
        if (shape.height < 0) {
            shape.y += shape.height;
            shape.height = Math.abs(shape.height);
        }
    }

    handleResize(pos) {
        if (!this.selectedObjects.length || !this.resizeHandle || !this.initialBounds) return;
        const obj = this.selectedObjects[0];
        let dx = pos.x - this.dragStart.x;
        let dy = pos.y - this.dragStart.y;
        if (this.snapToGrid) {
            dx = Math.round(dx / this.gridSize) * this.gridSize;
            dy = Math.round(dy / this.gridSize) * this.gridSize;
        }
        const bounds = { ...this.initialBounds };

        switch (this.resizeHandle) {
            case 'nw': obj.x = bounds.x + dx; obj.y = bounds.y + dy; obj.width = bounds.width - dx; obj.height = bounds.height - dy; break;
            case 'n': obj.y = bounds.y + dy; obj.height = bounds.height - dy; break;
            case 'ne': obj.y = bounds.y + dy; obj.width = bounds.width + dx; obj.height = bounds.height - dy; break;
            case 'e': obj.width = bounds.width + dx; break;
            case 'se': obj.width = bounds.width + dx; obj.height = bounds.height + dy; break;
            case 's': obj.height = bounds.height + dy; break;
            case 'sw': obj.x = bounds.x + dx; obj.width = bounds.width - dx; obj.height = bounds.height + dy; break;
            case 'w': obj.x = bounds.x + dx; obj.width = bounds.width - dx; break;
        }

        const minSize = 10;
        if (Math.abs(obj.width) < minSize) obj.width = obj.width < 0 ? -minSize : minSize;
        if (Math.abs(obj.height) < minSize) obj.height = obj.height < 0 ? -minSize : minSize;
    }

    handleRotate(pos) {
        if (!this.selectedObjects.length || !this.rotateCenter) return;
        const obj = this.selectedObjects[0];
        const angle = Math.atan2(pos.y - this.rotateCenter.y, pos.x - this.rotateCenter.x);
        const startAngle = Math.atan2(this.dragStart.y - this.rotateCenter.y, this.dragStart.x - this.rotateCenter.x);
        let rotation = this.initialRotation + (angle - startAngle);
        if (this.snapToGrid) {
            const step = Math.PI / 12; // 15 degrees
            rotation = Math.round(rotation / step) * step;
        }
        obj.rotation = rotation;
    }

    handleWaypointDrag(pos) {
        if (!this.waypointConnector || this.waypointIndex < 0) return;
        const p = this.snapToGrid
            ? { x: Math.round(pos.x / this.gridSize) * this.gridSize, y: Math.round(pos.y / this.gridSize) * this.gridSize }
            : { x: pos.x, y: pos.y };
        this.waypointConnector.waypoints[this.waypointIndex] = p;
    }

    handleControlPointDrag(pos) {
        if (!this.controlPointConnector || !this.controlPointType) return;
        if (this.controlPointType === 'cp1') this.controlPointConnector.controlPoint1 = { x: pos.x, y: pos.y };
        else if (this.controlPointType === 'cp2') this.controlPointConnector.controlPoint2 = { x: pos.x, y: pos.y };
    }

    handleWheel(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const factor = e.deltaY > 0 ? 1 / 1.1 : 1.1;
        this.zoomAt(mx, my, this.zoom * factor);
    }

    zoomAt(sx, sy, newZoom) {
        const clamped = Math.max(0.1, Math.min(4, newZoom));
        const worldX = (sx - this.panX) / this.zoom;
        const worldY = (sy - this.panY) / this.zoom;
        this.zoom = clamped;
        this.panX = sx - worldX * clamped;
        this.panY = sy - worldY * clamped;
        this.updateZoomLabel();
        this.render();
    }

    // ------------------------------------------------------------------
    // Context menu
    // ------------------------------------------------------------------
    handleContextMenu(e) {
        e.preventDefault();
        this.commitInlineEdit();
        const pos = this.getMousePos(e);
        const waypointHit = this.findWaypointAtPoint(pos.x, pos.y, true);
        const obj = waypointHit ? waypointHit.connector : this.findObjectAtPoint(pos.x, pos.y);
        if (obj && !this.selectedObjects.includes(obj)) {
            this.selectedObjects = obj.groupId ? this.getGroupMembers(obj.groupId) : [obj];
            this.updatePropertiesPanel();
            this.render();
        }
        this.contextMenu.show(e.clientX, e.clientY, this.buildContextMenu(obj, pos, waypointHit));
    }

    /**
     * Builds the context menu for a target.
     * @param {Object|null} obj
     * @param {{x:number,y:number}} pos World position of the click.
     * @param {{connector:Connector,index:number}|null} waypointHit
     * @returns {Array}
     */
    buildContextMenu(obj, pos, waypointHit) {
        const items = [];
        const commit = () => { this.saveState(); this.updatePropertiesPanel(); this.render(); };

        if (!obj) {
            items.push(
                { label: 'Paste', shortcut: 'Ctrl+V', icon: 'i-paste', disabled: !this.clipboard.length, action: () => this.pasteAt(pos) },
                { label: 'Select all', shortcut: 'Ctrl+A', icon: 'i-select-all', action: () => this.selectAll() },
                { separator: true },
                { label: 'Add device here', shortcut: 'E', icon: 'i-device', action: () => this.placeShapeAt('device', pos) },
                { label: 'Add text here', shortcut: 'T', icon: 'i-text', action: () => this.placeShapeAt('text', pos) },
                { label: 'Insert template…', icon: 'i-template', action: () => this.showTemplates() },
                { label: 'Insert icon…', icon: 'i-icons', action: () => this.showIcons() },
                { label: 'Add image…', icon: 'i-image', action: () => this.addImage() },
                { separator: true },
                { label: 'Auto layout', icon: 'i-layout', disabled: !this.objects.length, action: () => this.autoLayout() },
                { label: 'Zoom to fit', shortcut: 'Shift+1', icon: 'i-fit', disabled: !this.objects.length, action: () => this.zoomToFit() }
            );
            return items;
        }

        if (obj.type === 'connector') {
            if (waypointHit) {
                items.push({ label: 'Remove waypoint', icon: 'i-waypoint-remove', shortcut: 'Alt+click', action: () => {
                    obj.waypoints.splice(waypointHit.index, 1);
                    commit();
                } });
            }
            items.push({ label: 'Add waypoint here', icon: 'i-waypoint', action: () => {
                obj.insertWaypoint(pos.x, pos.y);
                this.selectedObjects = [obj];
                commit();
            } });
            items.push({ label: 'Straighten (remove waypoints)', icon: 'i-straighten', disabled: !obj.waypoints.length, action: () => {
                obj.waypoints = [];
                commit();
            } });
            items.push({ separator: true });
            for (const style of ['orthogonal', 'straight', 'bezier']) {
                items.push({ label: `${style[0].toUpperCase() + style.slice(1)} path`, checked: obj.style === style, action: () => {
                    obj.style = style;
                    obj.waypoints = [];
                    commit();
                } });
            }
            items.push({ separator: true });
            items.push({ label: 'Reverse direction', icon: 'i-reverse', action: () => { obj.reverse(); commit(); } });
            items.push({ label: obj.arrowEnd || obj.arrowStart ? 'Hide arrows' : 'Show arrow', action: () => {
                const show = !(obj.arrowEnd || obj.arrowStart);
                obj.arrowEnd = show;
                obj.arrowStart = false;
                commit();
            } });
            items.push({ label: 'Edit label…', shortcut: 'F2', icon: 'i-label', action: () => this.startInlineEdit(obj) });
            items.push({ separator: true });
            items.push({ label: 'Delete', shortcut: 'Del', icon: 'i-trash', danger: true, action: () => this.deleteSelected() });
            return items;
        }

        const shapes = this.selectedObjects.filter(o => o.type !== 'connector');
        const grouped = shapes.some(s => s.groupId !== null && s.groupId !== undefined);
        items.push(
            { label: obj.type === 'text' ? 'Edit text…' : 'Rename…', shortcut: 'F2', icon: 'i-edit', action: () => this.startInlineEdit(obj) },
            { label: 'Duplicate', shortcut: 'Ctrl+D', icon: 'i-duplicate', action: () => this.duplicate() },
            { label: 'Copy', shortcut: 'Ctrl+C', icon: 'i-copy', action: () => this.copy() },
            { label: 'Cut', shortcut: 'Ctrl+X', action: () => { this.copy(); this.deleteSelected(); } },
            { separator: true },
            { label: 'Bring to front', shortcut: 'Shift+]', icon: 'i-front', action: () => this.bringToFront() },
            { label: 'Send to back', shortcut: 'Shift+[', icon: 'i-back', action: () => this.sendToBack() },
            { separator: true }
        );
        if (shapes.length >= 2) items.push({ label: 'Group', shortcut: 'Ctrl+G', icon: 'i-group', action: () => this.groupSelected() });
        if (grouped) items.push({ label: 'Ungroup', shortcut: 'Ctrl+Shift+G', icon: 'i-ungroup', action: () => this.ungroupSelected() });
        if (obj.ports) {
            items.push({ label: 'Select connected objects', icon: 'i-select-all', action: () => this.selectConnected(obj) });
        }
        items.push({ label: obj.locked ? 'Unlock' : 'Lock', icon: 'i-lock', action: () => {
            shapes.forEach(s => { s.locked = !obj.locked; });
            commit();
        } });
        items.push({ separator: true });
        items.push({ label: 'Delete', shortcut: 'Del', icon: 'i-trash', danger: true, action: () => this.deleteSelected() });
        return items;
    }

    selectConnected(obj) {
        const set = new Set([obj]);
        for (const c of this.diagram.connectors) {
            if (c.startObject === obj && c.endObject) set.add(c.endObject);
            if (c.endObject === obj && c.startObject) set.add(c.startObject);
        }
        this.selectedObjects = [...set];
        this.updatePropertiesPanel();
        this.render();
    }

    placeShapeAt(type, pos) {
        const shape = this.createShape(type, pos.x, pos.y, undefined, undefined);
        if (this.snapToGrid) {
            shape.x = Math.round(shape.x / this.gridSize) * this.gridSize;
            shape.y = Math.round(shape.y / this.gridSize) * this.gridSize;
        }
        this.objects.push(shape);
        this.selectedObjects = [shape];
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
        if (type === 'text' || type === 'device') this.startInlineEdit(shape);
    }

    // ------------------------------------------------------------------
    // Inline editing
    // ------------------------------------------------------------------
    startInlineEdit(obj) {
        const editor = document.getElementById('inline-editor');
        if (!editor || !obj) return;
        this.commitInlineEdit();
        this.inlineTarget = obj;
        let value;
        let screen;
        let width;
        if (obj.type === 'connector') {
            value = obj.label || '';
            const mid = obj.getMidpoint();
            if (!mid) return;
            screen = this.toScreen(mid.x, mid.y);
            width = 160;
        } else if (obj.type === 'text') {
            value = obj.text || '';
            const b = obj.getBounds();
            screen = this.toScreen(b.x + b.width / 2, b.y + b.height / 2);
            width = Math.max(140, b.width * this.zoom + 12);
        } else {
            value = obj.label || '';
            const b = obj.getBounds();
            screen = this.toScreen(b.x + b.width / 2, b.y + b.height / 2);
            width = Math.max(150, Math.min(360, b.width * this.zoom + 12));
        }
        editor.value = value;
        editor.style.display = 'block';
        editor.style.width = `${width}px`;
        editor.style.left = `${screen.x - width / 2}px`;
        editor.style.fontSize = `${Math.max(12, Math.min(22, (obj.type === 'text' ? obj.fontSize : 14) * this.zoom))}px`;
        this.autosizeInlineEditor();
        editor.style.top = `${screen.y - editor.offsetHeight / 2}px`;
        editor.placeholder = obj.type === 'connector' ? 'Label' : obj.type === 'text' ? 'Text' : 'Name';
        editor.focus();
        editor.select();
    }

    autosizeInlineEditor() {
        const editor = document.getElementById('inline-editor');
        if (!editor) return;
        editor.style.height = 'auto';
        editor.style.height = `${Math.max(28, editor.scrollHeight)}px`;
    }

    commitInlineEdit() {
        const editor = document.getElementById('inline-editor');
        const obj = this.inlineTarget;
        if (!editor || !obj || editor.style.display === 'none') return;
        const value = editor.value;
        this.inlineTarget = null;
        editor.style.display = 'none';
        let changed = false;
        if (obj.type === 'text') {
            const next = value.trim() ? value : 'Text';
            changed = next !== obj.text;
            obj.text = next;
        } else {
            const next = value.replace(/\n/g, ' ').trim();
            changed = next !== (obj.label || '');
            obj.label = next;
        }
        if (changed) this.saveState();
        this.updatePropertiesPanel();
        this.render();
    }

    cancelInlineEdit() {
        const editor = document.getElementById('inline-editor');
        this.inlineTarget = null;
        if (editor) editor.style.display = 'none';
    }

    // ------------------------------------------------------------------
    // Keyboard
    // ------------------------------------------------------------------
    handleKeyDown(e) {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;
        const anyModalOpen = [...document.querySelectorAll('.modal')].some(m => m.style.display === 'block');
        if (anyModalOpen) {
            if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => { m.style.display = 'none'; });
            return;
        }

        if (e.key === ' ' && !this.spacePressed) {
            e.preventDefault();
            this.spacePressed = true;
            if (!this.isPanning) this.canvas.style.cursor = 'grab';
            return;
        }

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            const dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
            const movable = this.getMovingObjects();
            if (movable.length) {
                const step = e.shiftKey ? this.gridSize : 1;
                movable.forEach(o => { o.x += dir[0] * step; o.y += dir[1] * step; });
                this.saveState();
                this.updatePropertiesPanel();
            } else {
                const panAmount = e.shiftKey ? 50 : 20;
                this.panX -= dir[0] * panAmount;
                this.panY -= dir[1] * panAmount;
            }
            this.render();
            return;
        }

        if (e.key === 'Home') {
            e.preventDefault();
            this.panX = 0;
            this.panY = 0;
            this.setZoom(1);
            return;
        }

        if (e.key === 'Escape') {
            if (this.isDrawingPolyline) {
                this.cancelPolyline();
            } else if (this.isDrawing && this.tempObject && this.tempObject.type === 'connector') {
                this.isDrawing = false;
                this.tempObject = null;
                this.connectorStart = null;
                this.hideAnchorIndicator();
                this.updateStatusHint();
            } else if (this.selectedObjects.length) {
                this.selectedObjects = [];
                this.updatePropertiesPanel();
            } else if (this.currentTool !== 'select') {
                this.setTool('select');
            }
            this.render();
            return;
        }

        if ((e.key === 'F2' || e.key === 'Enter') && this.selectedObjects.length === 1) {
            e.preventDefault();
            this.startInlineEdit(this.selectedObjects[0]);
            return;
        }

        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            e.preventDefault();
            this.toggleHelp();
            return;
        }

        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z': e.preventDefault(); if (e.shiftKey) this.redo(); else this.undo(); break;
                case 'y': e.preventDefault(); this.redo(); break;
                case 'c': e.preventDefault(); this.copy(); break;
                case 'v': e.preventDefault(); this.paste(); break;
                case 'x': e.preventDefault(); this.copy(); this.deleteSelected(); break;
                case 'd': e.preventDefault(); this.duplicate(); break;
                case 'a': e.preventDefault(); this.selectAll(); break;
                case 'g': e.preventDefault(); if (e.shiftKey) this.ungroupSelected(); else this.groupSelected(); break;
                case 's': e.preventDefault(); this.save(); break;
                case 'o': e.preventDefault(); this.load(); break;
                case '=':
                case '+': e.preventDefault(); this.zoomAt(this.viewWidth / 2, this.viewHeight / 2, this.zoom * 1.2); break;
                case '-': e.preventDefault(); this.zoomAt(this.viewWidth / 2, this.viewHeight / 2, this.zoom / 1.2); break;
                case '0': e.preventDefault(); this.setZoom(1); break;
            }
            return;
        }

        if (e.shiftKey) {
            switch (e.key) {
                case ']': e.preventDefault(); this.bringToFront(); break;
                case '[': e.preventDefault(); this.sendToBack(); break;
                case '!': e.preventDefault(); this.zoomToFit(); break;
            }
            return;
        }

        switch (e.key) {
            case 'Delete':
            case 'Backspace': e.preventDefault(); this.deleteSelected(); break;
            case ']': e.preventDefault(); this.bringForward(); break;
            case '[': e.preventDefault(); this.sendBackward(); break;
            case 'v': this.setTool('select'); break;
            case 'r': this.setTool('rectangle'); break;
            case 'c': this.setTool('circle'); break;
            case 'd': this.setTool('diamond'); break;
            case 'h': this.setTool('hexagon'); break;
            case 't': this.setTool('text'); break;
            case 'l': this.setTool('connector'); break;
            case 'p': this.setTool('polyline'); break;
            case 'e': this.setTool('device'); break;
        }
    }

    handleKeyUp(e) {
        if (e.key === ' ') {
            this.spacePressed = false;
            if (!this.isPanning) this.canvas.style.cursor = this.currentTool === 'select' ? 'default' : 'crosshair';
        }
    }

    // ------------------------------------------------------------------
    // Object creation and lookup
    // ------------------------------------------------------------------
    createShape(type, x, y, width, height) {
        let shape;
        try {
            shape = ShapeRegistry.create(type, x, y, width, height);
        } catch {
            shape = ShapeRegistry.create('rectangle', x, y, width, height);
        }
        shape.shadow = this.showShadows;
        return shape;
    }

    createTextShape(pos) {
        const textShape = ShapeRegistry.create('text', pos.x, pos.y, undefined, undefined, { text: 'Text' });
        this.objects.push(textShape);
        this.selectedObjects = [textShape];
        this.updatePropertiesPanel();
        this.saveState();
        this.setTool('select');
        this.render();
        this.startInlineEdit(textShape);
    }

    findObjectAtPoint(x, y) {
        const sorted = [...this.objects].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
        for (const obj of sorted) {
            if (obj.type === 'connector' || obj.visible === false) continue;
            if (obj.containsPoint && obj.containsPoint(x, y)) return obj;
        }
        for (const obj of sorted) {
            if (obj.type === 'connector' && obj.visible !== false && obj.containsPoint(x, y, 6 / this.zoom)) return obj;
        }
        return null;
    }

    findNearestAnchor(x, y, threshold = 15, requiredConnectionType = null, requiredPortType = null) {
        let nearest = null;
        let minDist = threshold / this.zoom;

        for (const obj of this.objects) {
            if (obj.type === 'connector' || !obj.getAnchorPoints || obj.visible === false) continue;
            const anchors = obj.getAnchorPoints();
            for (const [side, pos] of Object.entries(anchors)) {
                if (side === 'center') continue;
                if (requiredConnectionType && pos.connectionType && pos.connectionType !== requiredConnectionType) continue;
                if (requiredPortType && pos.portType && pos.portType !== 'both' && pos.portType !== requiredPortType) continue;
                const dist = Math.hypot(x - pos.x, y - pos.y);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = { object: obj, side, position: pos, connectionType: pos.connectionType || null, portType: pos.portType || 'both' };
                }
            }
        }
        return nearest;
    }

    showAnchorIndicator(anchor) {
        const indicator = document.getElementById('anchor-indicator');
        if (!indicator) return;
        const s = this.toScreen(anchor.position.x, anchor.position.y);
        indicator.style.left = `${s.x}px`;
        indicator.style.top = `${s.y}px`;
        indicator.style.display = 'block';
    }

    hideAnchorIndicator() {
        const indicator = document.getElementById('anchor-indicator');
        if (indicator) indicator.style.display = 'none';
    }

    // ------------------------------------------------------------------
    // Object manipulation
    // ------------------------------------------------------------------
    deleteSelected() {
        if (this.selectedObjects.length === 0) return;
        const selectedIds = new Set(this.selectedObjects.map(obj => obj.id));
        this.objects = this.objects.filter(obj => {
            if (selectedIds.has(obj.id)) return false;
            if (obj.type === 'connector') {
                if (obj.startObject && selectedIds.has(obj.startObject.id)) return false;
                if (obj.endObject && selectedIds.has(obj.endObject.id)) return false;
            }
            return true;
        });
        this.selectedObjects = [];
        this.hoverObject = null;
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
    }

    copy() {
        if (this.selectedObjects.length === 0) return;
        const shapes = this.selectedObjects.filter(o => o.type !== 'connector');
        const ids = new Set(shapes.map(o => o.id));
        const connectors = this.objects.filter(o => o.type === 'connector' && o.startObject && o.endObject &&
            ids.has(o.startObject.id) && ids.has(o.endObject.id));
        this.clipboard = serializeObjects([...shapes, ...connectors]);
        if (shapes.length) showToast(`Copied ${shapes.length} object${shapes.length === 1 ? '' : 's'}${connectors.length ? ` and ${connectors.length} link${connectors.length === 1 ? '' : 's'}` : ''}`, { timeout: 1500 });
    }

    paste() {
        this.pasteAt(null);
    }

    /**
     * Pastes the clipboard with fresh ids and group ids.
     * @param {{x:number,y:number}|null} at World position for the top-left of the pasted content (null = offset by 20px).
     */
    pasteAt(at) {
        if (this.clipboard.length === 0) return;
        const data = JSON.parse(JSON.stringify(this.clipboard));
        const shapesData = data.filter(d => d.type !== 'connector');
        let offsetX = 20;
        let offsetY = 20;
        if (at && shapesData.length) {
            const minX = Math.min(...shapesData.map(d => d.x));
            const minY = Math.min(...shapesData.map(d => d.y));
            offsetX = at.x - minX;
            offsetY = at.y - minY;
        }
        const idMap = {};
        data.forEach(item => { if (item.type !== 'connector') idMap[item.id] = newId('shape'); });
        const groupMap = {};
        data.forEach(item => {
            if (item.type === 'connector') {
                item.id = newId('conn');
                item.startObject = idMap[item.startObject];
                item.endObject = idMap[item.endObject];
                if (Array.isArray(item.waypoints)) item.waypoints = item.waypoints.map(w => ({ x: w.x + offsetX, y: w.y + offsetY }));
                if (item.controlPoint1) item.controlPoint1 = { x: item.controlPoint1.x + offsetX, y: item.controlPoint1.y + offsetY };
                if (item.controlPoint2) item.controlPoint2 = { x: item.controlPoint2.x + offsetX, y: item.controlPoint2.y + offsetY };
            } else {
                item.id = idMap[item.id];
                item.x += offsetX;
                item.y += offsetY;
                if (item.groupId !== null && item.groupId !== undefined) {
                    if (!(item.groupId in groupMap)) groupMap[item.groupId] = this.nextGroupId++;
                    item.groupId = groupMap[item.groupId];
                }
            }
        });
        const newObjects = deserializeObjects(data, { onWarning: w => console.warn(w) });
        this.objects.push(...newObjects);
        this.selectedObjects = newObjects.filter(obj => obj.type !== 'connector');
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
    }

    duplicate() {
        if (this.selectedObjects.length === 0) return;
        this.copy();
        this.pasteAt(null);
    }

    selectAll() {
        this.selectedObjects = this.objects.filter(obj => obj.type !== 'connector' && obj.visible !== false);
        this.updatePropertiesPanel();
        this.render();
    }

    /**
     * Selects objects by id and scrolls them into view.
     * @param {string[]} ids
     */
    revealObjects(ids) {
        const objs = this.objects.filter(o => ids.includes(o.id));
        if (!objs.length) return;
        this.selectedObjects = objs;
        const bounds = new Diagram({ objects: objs }).getBounds(20);
        if (bounds) {
            const tl = this.toScreen(bounds.x, bounds.y);
            const br = this.toScreen(bounds.x + bounds.width, bounds.y + bounds.height);
            const visible = tl.x >= 0 && tl.y >= 0 && br.x <= this.viewWidth && br.y <= this.viewHeight;
            if (!visible) {
                this.panX = this.viewWidth / 2 - (bounds.x + bounds.width / 2) * this.zoom;
                this.panY = this.viewHeight / 2 - (bounds.y + bounds.height / 2) * this.zoom;
            }
        }
        this.updatePropertiesPanel();
        this.render();
    }

    groupSelected() {
        const shapes = this.selectedObjects.filter(obj => obj.type !== 'connector');
        if (shapes.length < 2) return;
        const groupId = this.nextGroupId++;
        shapes.forEach(shape => { shape.groupId = groupId; });
        this.saveState();
        this.updatePropertiesPanel();
        this.render();
    }

    ungroupSelected() {
        if (this.selectedObjects.length === 0) return;
        this.selectedObjects.forEach(obj => { if (obj.type !== 'connector') obj.groupId = null; });
        this.saveState();
        this.updatePropertiesPanel();
        this.render();
    }

    getGroupMembers(groupId) {
        if (groupId === null || groupId === undefined) return [];
        return this.objects.filter(obj => obj.groupId === groupId);
    }

    bringToFront() {
        if (this.selectedObjects.length === 0) return;
        const maxZ = Math.max(...this.objects.map(obj => obj.zIndex || 0), 0);
        this.selectedObjects.forEach(obj => { obj.zIndex = maxZ + 1; });
        this.saveState();
        this.render();
    }

    sendToBack() {
        if (this.selectedObjects.length === 0) return;
        const minZ = Math.min(...this.objects.map(obj => obj.zIndex || 0), 0);
        this.selectedObjects.forEach(obj => { obj.zIndex = minZ - 1; });
        this.saveState();
        this.render();
    }

    bringForward() {
        if (this.selectedObjects.length === 0) return;
        this.selectedObjects.forEach(obj => { obj.zIndex = (obj.zIndex || 0) + 1; });
        this.saveState();
        this.render();
    }

    sendBackward() {
        if (this.selectedObjects.length === 0) return;
        this.selectedObjects.forEach(obj => { obj.zIndex = (obj.zIndex || 0) - 1; });
        this.saveState();
        this.render();
    }

    align(direction) {
        const shapes = this.selectedObjects.filter(obj => obj.type !== 'connector' && !obj.locked);
        if (shapes.length < 2) return;
        const bounds = shapes.map(s => s.getBounds());
        switch (direction) {
            case 'left': { const v = Math.min(...bounds.map(b => b.x)); shapes.forEach((s, i) => { s.x += v - bounds[i].x; }); break; }
            case 'right': { const v = Math.max(...bounds.map(b => b.x + b.width)); shapes.forEach((s, i) => { s.x += v - (bounds[i].x + bounds[i].width); }); break; }
            case 'center': { const v = bounds.reduce((sum, b) => sum + b.x + b.width / 2, 0) / bounds.length; shapes.forEach((s, i) => { s.x += v - (bounds[i].x + bounds[i].width / 2); }); break; }
            case 'top': { const v = Math.min(...bounds.map(b => b.y)); shapes.forEach((s, i) => { s.y += v - bounds[i].y; }); break; }
            case 'bottom': { const v = Math.max(...bounds.map(b => b.y + b.height)); shapes.forEach((s, i) => { s.y += v - (bounds[i].y + bounds[i].height); }); break; }
            case 'middle': { const v = bounds.reduce((sum, b) => sum + b.y + b.height / 2, 0) / bounds.length; shapes.forEach((s, i) => { s.y += v - (bounds[i].y + bounds[i].height / 2); }); break; }
        }
        this.saveState();
        this.updatePropertiesPanel();
        this.render();
    }

    distribute(axis) {
        const shapes = this.selectedObjects.filter(obj => obj.type !== 'connector' && !obj.locked);
        if (shapes.length < 3) return;
        const key = axis === 'horizontal' ? 'x' : 'y';
        const size = axis === 'horizontal' ? 'width' : 'height';
        const sorted = [...shapes].sort((a, b) => a.getBounds()[key] - b.getBounds()[key]);
        const first = sorted[0].getBounds();
        const last = sorted[sorted.length - 1].getBounds();
        const total = sorted.reduce((sum, s) => sum + s.getBounds()[size], 0);
        const gap = ((last[key] + last[size]) - first[key] - total) / (sorted.length - 1);
        let cursor = first[key];
        sorted.forEach(s => {
            const b = s.getBounds();
            s[key] += cursor - b[key];
            cursor += b[size] + gap;
        });
        this.saveState();
        this.render();
    }

    autoLayout() {
        if (this.objects.length === 0) return;
        this.diagram.autoLayout({ direction: 'LR' });
        this.saveState();
        this.updatePropertiesPanel();
        this.zoomToFit();
        showToast('Objects arranged along the signal flow', { type: 'success', timeout: 2000 });
    }

    setZoom(newZoom) {
        this.zoom = Math.max(0.1, Math.min(4, newZoom));
        this.updateZoomLabel();
        this.render();
    }

    updateZoomLabel() {
        const el = document.getElementById('zoom-level');
        if (el) el.textContent = Math.round(this.zoom * 100) + '%';
    }

    zoomToFit() {
        const bounds = this.diagram.getBounds(40);
        if (!bounds || !this.viewWidth) return;
        const zoom = Math.max(0.1, Math.min(2, Math.min(this.viewWidth / bounds.width, this.viewHeight / bounds.height)));
        this.zoom = zoom;
        this.panX = (this.viewWidth - bounds.width * zoom) / 2 - bounds.x * zoom;
        this.panY = (this.viewHeight - bounds.height * zoom) / 2 - bounds.y * zoom;
        this.updateZoomLabel();
        this.render();
    }

    // ------------------------------------------------------------------
    // Templates, icons, images
    // ------------------------------------------------------------------
    thumbnail(objects) {
        const svg = diagramToSvg(objects, { padding: 16, showPorts: true, background: null });
        return svg.replace(/<svg ([^>]*?)width="[^"]*" height="[^"]*"/, '<svg $1 preserveAspectRatio="xMidYMid meet"');
    }

    showTemplates() {
        const modal = document.getElementById('templates-modal');
        const grid = document.getElementById('templates-grid');
        grid.innerHTML = '';
        Templates.getAllTemplates().forEach(template => {
            const preview = template.create().objects;
            const card = document.createElement('button');
            card.className = 'template-card';
            card.innerHTML = `<div class="thumb">${this.thumbnail(preview)}</div><h4>${escapeHtml(template.name)}</h4><p>${preview.filter(o => o.type !== 'connector').length} shapes · ${preview.filter(o => o.type === 'connector').length} links</p>`;
            card.addEventListener('click', () => {
                this.insertTemplate(template);
                modal.style.display = 'none';
            });
            grid.appendChild(card);
        });
        modal.style.display = 'block';
    }

    insertTemplate(template) {
        const result = template.create();
        const newObjects = result.objects.map(obj => (typeof obj.draw === 'function' ? obj : ShapeRegistry.fromJSON(obj)));
        const groupId = this.nextGroupId++;
        const shapesToGroup = newObjects.filter(obj => obj.type !== 'connector');
        shapesToGroup.forEach(shape => { shape.groupId = groupId; });
        this.objects.push(...newObjects);
        this.selectedObjects = shapesToGroup;
        this.updatePropertiesPanel();
        this.saveState();
        this.zoomToFit();
    }

    showIcons() {
        const modal = document.getElementById('icons-modal');
        const grid = document.getElementById('icons-grid');
        grid.innerHTML = '';
        for (const iconDef of Object.values(IconLibrary.getAllIcons())) {
            const preview = iconDef.create(0, 0);
            const card = document.createElement('button');
            card.className = 'icon-card';
            card.innerHTML = `<div class="thumb">${this.thumbnail(preview)}</div><h4>${escapeHtml(iconDef.name)}</h4><p>Click to add</p>`;
            card.addEventListener('click', () => {
                const center = { x: (this.viewWidth / 2 - this.panX) / this.zoom, y: (this.viewHeight / 2 - this.panY) / this.zoom };
                this.insertIcon(iconDef, Math.round(center.x / this.gridSize) * this.gridSize, Math.round(center.y / this.gridSize) * this.gridSize);
                modal.style.display = 'none';
            });
            grid.appendChild(card);
        }
        modal.style.display = 'block';
    }

    insertIcon(iconDef, x, y) {
        const objects = iconDef.create(x, y);
        const groupId = this.nextGroupId++;
        const shapesToGroup = objects.filter(obj => obj.type !== 'connector');
        shapesToGroup.forEach(shape => { shape.groupId = groupId; });
        this.objects.push(...objects);
        this.selectedObjects = shapesToGroup;
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
    }

    addImage() {
        document.getElementById('image-input').click();
    }

    handleImageLoad(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const center = { x: (this.viewWidth / 2 - this.panX) / this.zoom, y: (this.viewHeight / 2 - this.panY) / this.zoom };
            const img = ShapeRegistry.create('image', center.x - 100, center.y - 75, 200, 150, { imageData: event.target.result });
            this.objects.push(img);
            this.selectedObjects = [img];
            this.updatePropertiesPanel();
            this.saveState();
            this.render();
            if (img.image) img.image.addEventListener('load', () => this.render());
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    // ------------------------------------------------------------------
    // Settings (colours, connection types)
    // ------------------------------------------------------------------
    showSettings() {
        this.renderSettingsRows();
        document.getElementById('settings-modal').style.display = 'block';
    }

    renderSettingsRows() {
        const connBox = document.getElementById('connection-colors');
        const objBox = document.getElementById('object-colors');
        if (connBox) {
            connBox.innerHTML = ConnectionTypeRegistry.list().map(t => `
                <div class="setting-group" data-type-id="${escapeHtml(t.id)}">
                    <label>${escapeHtml(t.label)} <span class="setting-meta">${escapeHtml(t.id)}${t.bidirectional ? ' · bidirectional' : ''}</span></label>
                    <input type="color" id="color-conn-${escapeHtml(t.id)}" value="${escapeHtml(t.color)}">
                    ${t.builtin ? '' : `<button class="mini-btn" data-remove-type="${escapeHtml(t.id)}" title="Remove type">×</button>`}
                </div>`).join('');
            connBox.querySelectorAll('[data-remove-type]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.removeType;
                    const inUse = this.objects.some(o => (o.ports && o.ports[id]) || o.connectionType === id);
                    if (inUse) {
                        showToast(`Connection type "${id}" is still used by objects in this diagram`, { type: 'error' });
                        return;
                    }
                    ConnectionTypeRegistry.unregister(id);
                    this.renderSettingsRows();
                });
            });
        }
        if (objBox) {
            objBox.innerHTML = Object.entries(OBJECT_COLOR_KEYS).map(([type, key]) => `
                <div class="setting-group">
                    <label>${escapeHtml(ShapeRegistry.displayName(type))}</label>
                    <input type="color" id="color-obj-${type}" value="${escapeHtml(ObjectColors[key])}">
                </div>`).join('');
        }
    }

    addConnectionType() {
        const idEl = document.getElementById('new-type-id');
        const labelEl = document.getElementById('new-type-label');
        const colorEl = document.getElementById('new-type-color');
        const bidiEl = document.getElementById('new-type-bidirectional');
        const id = ConnectionTypeRegistry.normalizeId(idEl ? idEl.value : '');
        if (!id) {
            showToast('Enter an id for the new connection type (e.g. hdmi)', { type: 'error' });
            return;
        }
        ConnectionTypeRegistry.register({
            id,
            label: labelEl && labelEl.value.trim() ? labelEl.value.trim() : undefined,
            color: colorEl ? colorEl.value : undefined,
            bidirectional: bidiEl ? bidiEl.checked : false
        });
        if (idEl) idEl.value = '';
        if (labelEl) labelEl.value = '';
        this.renderSettingsRows();
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
        showToast(`Connection type "${id}" added`, { type: 'success', timeout: 2000 });
    }

    resetColors() {
        for (const [id, color] of Object.entries(DEFAULT_CONNECTION_COLORS)) ConnectionTypeRegistry.setColor(id, color);
        Object.assign(ObjectColors, DEFAULT_OBJECT_COLORS);
        this.renderSettingsRows();
        this.applyPaletteToObjects();
        this.render();
    }

    applyColors() {
        for (const t of ConnectionTypeRegistry.list()) {
            const input = document.getElementById(`color-conn-${t.id}`);
            if (input) ConnectionTypeRegistry.setColor(t.id, input.value);
        }
        for (const [type, key] of Object.entries(OBJECT_COLOR_KEYS)) {
            const input = document.getElementById(`color-obj-${type}`);
            if (input) ObjectColors[key] = input.value;
        }
        this.applyPaletteToObjects();
        document.getElementById('settings-modal').style.display = 'none';
        this.saveState();
        this.updatePropertiesPanel();
        this.render();
    }

    applyPaletteToObjects() {
        this.objects.forEach(obj => {
            if (obj.type === 'connector') {
                if (obj.connectionType) obj.stroke = ConnectionTypeRegistry.colorFor(obj.connectionType);
            } else if (OBJECT_COLOR_KEYS[obj.type]) {
                obj.fill = ObjectColors[OBJECT_COLOR_KEYS[obj.type]];
            }
        });
    }

    // ------------------------------------------------------------------
    // Documents: save / load / export / autosave / live sync
    // ------------------------------------------------------------------
    buildDocument() {
        if (!this.diagram.metadata.created) this.diagram.metadata.created = new Date().toISOString();
        return createDocument({
            objects: this.objects,
            metadata: {
                ...this.diagram.metadata,
                zoom: this.zoom,
                panX: this.panX,
                panY: this.panY,
                nextGroupId: this.nextGroupId
            }
        });
    }

    loadDocument(doc, options = {}) {
        const parsed = parseDocument(doc);
        this.cancelInlineEdit();
        this.objects = parsed.objects;
        this.diagram.metadata = parsed.metadata;
        this.nextGroupId = this.diagram.computeNextGroupId(parsed.metadata.nextGroupId);
        this.selectedObjects = [];
        this.hoverObject = null;
        const nameInput = document.getElementById('diagram-name');
        if (nameInput) nameInput.value = parsed.metadata.name || '';
        if (options.resetView) {
            if (typeof parsed.metadata.zoom === 'number') {
                this.zoom = Math.max(0.1, Math.min(4, parsed.metadata.zoom));
                this.panX = Number(parsed.metadata.panX) || 0;
                this.panY = Number(parsed.metadata.panY) || 0;
                this.updateZoomLabel();
            } else {
                this.zoomToFit();
            }
        }
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
        this.objects.forEach(o => { if (o.image) o.image.addEventListener('load', () => this.render()); });
        return parsed.warnings;
    }

    save() {
        const doc = this.buildDocument();
        const name = (this.diagram.metadata.name || '').replace(/[^\w.-]+/g, '_');
        const filename = name ? `${name}.json` : `diagram-${Date.now()}.json`;
        downloadBlob(new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' }), filename);
        showToast(`Saved ${filename}`, { type: 'success', timeout: 2000 });
    }

    load() {
        document.getElementById('file-input').click();
    }

    handleFileLoad(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const warnings = this.loadDocument(event.target.result, { resetView: true });
                if (warnings.length) showToast(`Loaded with ${warnings.length} warning(s): ${warnings[0]}`, { type: 'error', timeout: 6000 });
                else showToast(`Loaded ${file.name}`, { type: 'success', timeout: 2000 });
            } catch (error) {
                showToast('Error loading file: ' + error.message, { type: 'error', timeout: 6000 });
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    async new() {
        if (this.objects.length > 0) {
            const ok = await confirmDialog('Start a new diagram? Unsaved changes to the current one will be lost.', { title: 'New diagram', okLabel: 'Start new', danger: true });
            if (!ok) return;
        }
        this.cancelInlineEdit();
        this.objects = [];
        this.diagram.metadata = {};
        this.selectedObjects = [];
        this.hoverObject = null;
        this.history = [];
        this.historyIndex = -1;
        this.nextGroupId = 1;
        const nameInput = document.getElementById('diagram-name');
        if (nameInput) nameInput.value = '';
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
    }

    exportBaseName() {
        const name = (this.diagram.metadata.name || '').replace(/[^\w.-]+/g, '_');
        return name || `diagram-${Date.now()}`;
    }

    renderScene(ctx, { bounds, scale = 1, background = '#ffffff' }) {
        ctx.save();
        if (background) {
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, bounds.width * scale, bounds.height * scale);
        }
        ctx.scale(scale, scale);
        ctx.translate(-bounds.x, -bounds.y);
        const used = this.getUsedPortKeys();
        const sorted = [...this.objects].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        for (const obj of sorted) {
            if (obj.type === 'connector') obj.selected = false;
            if (obj.draw) obj.draw(ctx);
        }
        for (const obj of this.objects) {
            if (obj.type !== 'connector' && ShapeRegistry.alwaysShowPorts(obj.type)) {
                this.drawPortDots(ctx, obj, used, 1, false);
                if (this.showPortLabels) this.drawPortLabels(ctx, obj, 1);
            }
        }
        ctx.restore();
    }

    exportBounds() {
        return this.diagram.getBounds(40) || { x: 0, y: 0, width: 800, height: 600 };
    }

    exportPNG() {
        if (!this.objects.length) { showToast('Nothing to export yet', { type: 'error' }); return; }
        const bounds = this.exportBounds();
        const scale = 2;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.ceil(bounds.width * scale);
        tempCanvas.height = Math.ceil(bounds.height * scale);
        this.renderScene(tempCanvas.getContext('2d'), { bounds, scale });
        tempCanvas.toBlob((blob) => downloadBlob(blob, `${this.exportBaseName()}.png`));
    }

    exportSVG() {
        if (!this.objects.length) { showToast('Nothing to export yet', { type: 'error' }); return; }
        const svg = diagramToSvg(this.objects, { showPortLabels: this.showPortLabels });
        downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `${this.exportBaseName()}.svg`);
    }

    exportPDF() {
        if (!this.objects.length) { showToast('Nothing to export yet', { type: 'error' }); return; }
        if (!window.jspdf || !window.jspdf.jsPDF) {
            showToast('PDF export needs the jsPDF library (offline?). Use SVG export instead.', { type: 'error' });
            return;
        }
        const { jsPDF } = window.jspdf;
        const bounds = this.exportBounds();
        const scale = 2;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.ceil(bounds.width * scale);
        tempCanvas.height = Math.ceil(bounds.height * scale);
        this.renderScene(tempCanvas.getContext('2d'), { bounds, scale });
        const pdf = new jsPDF({
            orientation: bounds.width > bounds.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [bounds.width, bounds.height]
        });
        pdf.addImage(tempCanvas.toDataURL('image/png'), 'PNG', 0, 0, bounds.width, bounds.height);
        pdf.save(`${this.exportBaseName()}.pdf`);
    }

    autosave() {
        if (this.liveSync) return;
        try {
            localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ savedAt: Date.now(), document: this.buildDocument() }));
        } catch { /* storage may be unavailable */ }
    }

    offerAutosaveRestore() {
        let draft = null;
        try {
            draft = JSON.parse(localStorage.getItem(AUTOSAVE_KEY) || 'null');
        } catch { return; }
        if (!draft || !draft.document || !Array.isArray(draft.document.objects) || !draft.document.objects.length) return;
        if (this.objects.length) return;
        const when = new Date(draft.savedAt || Date.now());
        const name = draft.document.metadata && draft.document.metadata.name ? `"${draft.document.metadata.name}"` : 'an unsaved diagram';
        showToast(`Found ${name} from ${when.toLocaleString()} in this browser.`, {
            timeout: 15000,
            action: { label: 'Restore', onClick: () => {
                try {
                    this.loadDocument(draft.document, { resetView: true });
                } catch (err) {
                    showToast('Could not restore: ' + err.message, { type: 'error' });
                }
            } }
        });
    }

    async initLiveSync() {
        let available = false;
        try {
            available = await LiveSync.detect();
        } catch {
            available = false;
        }
        if (!available) {
            this.offerAutosaveRestore();
            return;
        }
        this.liveSync = new LiveSync({
            getDocument: () => this.buildDocument(),
            applyDocument: (doc) => this.applyRemoteDocument(doc),
            onStatus: (status, info) => this.updateLiveStatus(status, info)
        });
        await this.liveSync.start();
    }

    applyRemoteDocument(doc) {
        const selectedIds = this.selectedObjects.map(o => o.id);
        this.applyingRemote = true;
        try {
            this.loadDocument(doc, { resetView: false });
        } finally {
            this.applyingRemote = false;
        }
        this.selectedObjects = this.objects.filter(o => selectedIds.includes(o.id));
        this.updatePropertiesPanel();
        this.render();
    }

    updateLiveStatus(status, info = {}) {
        const el = document.getElementById('live-status');
        if (!el) return;
        el.style.display = 'inline-flex';
        el.className = `live-status ${status}`;
        const labels = {
            connected: '● Live (MCP)',
            pushed: '● Live (MCP)',
            syncing: '● Syncing…',
            disconnected: '○ Live view offline',
            error: `● Sync error${info.message ? ': ' + info.message : ''}`
        };
        el.textContent = labels[status] || status;
        el.title = 'Served by the Morph MCP server / bridge. Agent changes appear here; your edits are sent back. Click to reload.';
    }

    /**
     * Legacy helper kept for modules that still call it.
     * @param {string} textContent
     * @param {("info"|"error")} [type='info']
     */
    showMessage(textContent, type = 'info') {
        showToast(textContent, { type: type === 'error' ? 'error' : 'info' });
    }

    reportDanglingConnectors(obj) {
        const dangling = this.objects.filter(c => c.type === 'connector' && (c.startObject === obj || c.endObject === obj) && c.isDangling());
        if (dangling.length) {
            showToast(`${dangling.length} connector(s) lost their port on this object (shown in red). Restore the port count or reconnect them.`, { type: 'error', timeout: 6000 });
        }
    }

    // ------------------------------------------------------------------
    // History
    // ------------------------------------------------------------------
    saveState() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(serializeObjects(this.objects));
        if (this.history.length > this.maxHistory) this.history.shift();
        else this.historyIndex++;
        this.updateUndoRedoButtons();
        this.updateValidationChip();
        this.updateEmptyState();
        if (this.selectedObjects.length === 0) this.propertiesPanel.render();
        if (this.liveSync && !this.applyingRemote) this.liveSync.push();
        this.scheduleAutosave();
    }

    restoreHistory(index) {
        const selectedIds = this.selectedObjects.map(o => o.id);
        this.cancelInlineEdit();
        this.objects = deserializeObjects(JSON.parse(JSON.stringify(this.history[index])), { onWarning: w => console.warn(w) });
        this.selectedObjects = this.objects.filter(o => selectedIds.includes(o.id));
        this.hoverObject = null;
        this.updatePropertiesPanel();
        this.updateUndoRedoButtons();
        this.updateValidationChip();
        this.updateEmptyState();
        if (this.liveSync) this.liveSync.push();
        this.scheduleAutosave();
        this.render();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreHistory(this.historyIndex);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreHistory(this.historyIndex);
        }
    }

    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
        if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }

    updatePropertiesPanel() {
        this.propertiesPanel.render();
        this.updateStatusSelection();
    }

    // ------------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------------
    getUsedPortKeys() {
        const used = new Set();
        for (const c of this.objects) {
            if (c.type !== 'connector') continue;
            if (c.startObject) used.add(`${c.startObject.id}|${c.startAnchor}`);
            if (c.endObject) used.add(`${c.endObject.id}|${c.endAnchor}`);
        }
        return used;
    }

    render() {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
        ctx.save();
        ctx.translate(this.panX, this.panY);
        ctx.scale(this.zoom, this.zoom);

        if (this.showGrid) this.drawGrid();

        const sorted = [...this.objects].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        for (const obj of sorted) {
            if (!obj.draw) continue;
            if (obj.type === 'connector') obj.selected = this.selectedObjects.includes(obj);
            obj.draw(ctx);
            if (obj.type === 'connector' && obj.isDangling()) this.drawDanglingMarkers(obj);
        }

        if (this.hoverObject && !this.selectedObjects.includes(this.hoverObject) && !this.isDragging && !this.isDrawing) {
            this.drawHover(this.hoverObject);
        }

        if (this.tempObject) {
            if (this.tempObject.type === 'connector') this.drawTempConnector();
            else if (this.tempObject.type === 'selection') this.drawSelectionBox(this.tempObject);
            else if (this.tempObject.draw) this.tempObject.draw(ctx);
        }

        const used = this.getUsedPortKeys();
        const scale = 1 / this.zoom;
        const connectorToolActive = (this.currentTool === 'connector' || this.currentTool === 'polyline') && !this.isDrawing;

        for (const obj of this.objects) {
            if (obj.type === 'connector' || !obj.getAnchorPoints || obj.visible === false) continue;
            const selected = this.selectedObjects.includes(obj);
            const showTyped = ShapeRegistry.alwaysShowPorts(obj.type) || selected || connectorToolActive;
            if (!showTyped) continue;
            this.drawPortDots(ctx, obj, used, scale, selected || connectorToolActive);
            if (this.showPortLabels || selected) this.drawPortLabels(ctx, obj, scale);
        }

        this.selectedObjects.forEach(obj => {
            if (obj.type !== 'connector' && obj.getBounds) this.drawSelection(obj);
        });

        if (this.activeGuides.length) this.drawGuides();

        ctx.restore();
    }

    drawGrid() {
        const ctx = this.ctx;
        const left = -this.panX / this.zoom;
        const top = -this.panY / this.zoom;
        const right = left + this.viewWidth / this.zoom;
        const bottom = top + this.viewHeight / this.zoom;
        const step = this.zoom < 0.5 ? this.gridSize * 5 : this.gridSize;
        const startX = Math.floor(left / step) * step;
        const startY = Math.floor(top / step) * step;
        ctx.strokeStyle = '#e6e6e6';
        ctx.lineWidth = 1 / this.zoom;
        ctx.beginPath();
        for (let x = startX; x <= right; x += step) {
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
        }
        for (let y = startY; y <= bottom; y += step) {
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
        }
        ctx.stroke();
    }

    drawGuides() {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = '#e91e63';
        ctx.lineWidth = 1 / this.zoom;
        ctx.setLineDash([6 / this.zoom, 4 / this.zoom]);
        for (const g of this.activeGuides) {
            ctx.beginPath();
            if (g.axis === 'x') { ctx.moveTo(g.pos, g.from); ctx.lineTo(g.pos, g.to); }
            else { ctx.moveTo(g.from, g.pos); ctx.lineTo(g.to, g.pos); }
            ctx.stroke();
        }
        ctx.restore();
    }

    drawHover(obj) {
        const ctx = this.ctx;
        ctx.save();
        if (obj.type === 'connector') {
            const pts = obj.getPathPoints();
            if (pts.length > 1) {
                ctx.strokeStyle = 'rgba(59,130,246,0.35)';
                ctx.lineWidth = (obj.strokeWidth || 2) + 8 / this.zoom;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.beginPath();
                if (obj.style === 'bezier') {
                    const s = obj.getStartPoint();
                    const e = obj.getEndPoint();
                    const cp1 = obj.controlPoint1 || obj.getDefaultControlPoint1();
                    const cp2 = obj.controlPoint2 || obj.getDefaultControlPoint2();
                    ctx.moveTo(s.x, s.y);
                    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, e.x, e.y);
                } else {
                    ctx.moveTo(pts[0].x, pts[0].y);
                    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
                }
                ctx.stroke();
            }
        } else {
            const corners = obj.getRotatedBounds();
            ctx.strokeStyle = 'rgba(59,130,246,0.7)';
            ctx.lineWidth = 1.5 / this.zoom;
            ctx.beginPath();
            ctx.moveTo(corners[0].x, corners[0].y);
            for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i].x, corners[i].y);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();
    }

    drawPortDots(ctx, obj, used, scale, includeGeneric) {
        const anchors = obj.getAnchorPoints();
        for (const [key, pos] of Object.entries(anchors)) {
            if (!pos || key === 'center') continue;
            if (!pos.connectionType && !includeGeneric && obj.type !== 'connector_anchor') continue;
            if (obj.type === 'connector_anchor') continue;
            const color = ConnectionTypeRegistry.colorFor(pos.connectionType, '#3b82f6');
            const isUsed = used.has(`${obj.id}|${key}`);
            ctx.fillStyle = isUsed ? color : '#ffffff';
            ctx.strokeStyle = isUsed ? 'rgba(255,255,255,0.9)' : color;
            ctx.lineWidth = 1.5 * scale;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 4 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    /**
     * Draws port names just inside the shape edge. Sides whose ports are packed too tightly for the text
     * are skipped (the hover tooltip still shows their names).
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} obj
     * @param {number} scale Size multiplier (1/zoom on screen).
     */
    drawPortLabels(ctx, obj, scale) {
        const anchors = Object.entries(obj.getAnchorPoints()).filter(([, pos]) => pos && pos.connectionType && pos.normal);
        if (!anchors.length) return;
        const fontSize = 9 * scale;
        const minGap = fontSize + 2 * scale;
        const bySide = {};
        for (const entry of anchors) (bySide[entry[1].side || 'free'] ||= []).push(entry);
        const b = obj.getBounds();
        const maxWidth = Math.max(20, b.width / 2 - 12 * scale);

        ctx.save();
        ctx.font = `${fontSize}px Arial`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = contrastColor(obj.fill);
        for (const entries of Object.values(bySide)) {
            const coords = entries.map(([, p]) => (Math.abs(p.normal.x) >= Math.abs(p.normal.y) ? p.y : p.x)).sort((u, v) => u - v);
            let gap = Infinity;
            for (let i = 1; i < coords.length; i++) gap = Math.min(gap, coords[i] - coords[i - 1]);
            if (gap < minGap) continue;
            for (const [key, pos] of entries) {
                const inward = { x: -pos.normal.x, y: -pos.normal.y };
                const tx = pos.x + inward.x * 8 * scale;
                const ty = pos.y + inward.y * 8 * scale;
                ctx.textAlign = Math.abs(inward.x) < 0.5 ? 'center' : (inward.x > 0 ? 'left' : 'right');
                ctx.fillText(pos.label || portLabel(key), tx, ty, maxWidth);
            }
        }
        ctx.restore();
    }

    drawDanglingMarkers(conn) {
        const ctx = this.ctx;
        const r = 6 / this.zoom;
        ctx.save();
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2 / this.zoom;
        for (const info of [conn.getStartAnchorInfo(), conn.getEndAnchorInfo()]) {
            if (!info || !info.missing) continue;
            ctx.beginPath();
            ctx.arc(info.x, info.y, r, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawTempConnector() {
        if (!this.tempObject || !this.connectorStart) return;
        const ctx = this.ctx;
        const start = this.tempObject.getStartPoint();
        const end = this.tempObject.getEndPoint();
        if (!start || !end) return;

        ctx.save();
        ctx.strokeStyle = this.tempObject.connectionType ? this.tempObject.stroke : '#3b82f6';
        ctx.lineWidth = 2 / this.zoom;
        ctx.setLineDash([5 / this.zoom, 5 / this.zoom]);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        if (this.isDrawingPolyline && this.polylineWaypoints.length > 0) {
            for (const wp of this.polylineWaypoints) ctx.lineTo(wp.x, wp.y);
        }
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.setLineDash([]);
        if (this.isDrawingPolyline) {
            ctx.fillStyle = '#3b82f6';
            this.polylineWaypoints.forEach(wp => {
                ctx.beginPath();
                ctx.arc(wp.x, wp.y, 4 / this.zoom, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        ctx.restore();
    }

    drawSelection(obj) {
        const ctx = this.ctx;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5 / this.zoom;
        ctx.setLineDash([5 / this.zoom, 4 / this.zoom]);

        if (obj.rotation) {
            const corners = obj.getRotatedBounds();
            ctx.beginPath();
            ctx.moveTo(corners[0].x, corners[0].y);
            for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i].x, corners[i].y);
            ctx.closePath();
            ctx.stroke();
        } else {
            const bounds = obj.getBounds();
            ctx.strokeRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4);
        }
        ctx.setLineDash([]);

        if (this.selectedObjects.length === 1 && !obj.locked && obj.resizable !== false) {
            this.drawResizeHandles(obj);
            this.drawRotateHandle(obj);
        }
    }

    drawResizeHandles(obj) {
        const ctx = this.ctx;
        const handleSize = 8 / this.zoom;
        const handles = this.getHandlePositions(obj);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5 / this.zoom;
        ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(handle => {
            const pos = handles[handle];
            ctx.fillRect(pos.x - handleSize / 2, pos.y - handleSize / 2, handleSize, handleSize);
            ctx.strokeRect(pos.x - handleSize / 2, pos.y - handleSize / 2, handleSize, handleSize);
        });
    }

    drawRotateHandle(obj) {
        const ctx = this.ctx;
        const handleSize = 8 / this.zoom;
        const top = obj.rotatePoint(obj.x + obj.width / 2, obj.y);
        const handle = this.getRotateHandlePosition(obj);

        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5 / this.zoom;
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(handle.x, handle.y);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(handle.x, handle.y, handleSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    getHandlePositions(obj) {
        const positions = {
            nw: { x: obj.x, y: obj.y },
            n: { x: obj.x + obj.width / 2, y: obj.y },
            ne: { x: obj.x + obj.width, y: obj.y },
            e: { x: obj.x + obj.width, y: obj.y + obj.height / 2 },
            se: { x: obj.x + obj.width, y: obj.y + obj.height },
            s: { x: obj.x + obj.width / 2, y: obj.y + obj.height },
            sw: { x: obj.x, y: obj.y + obj.height },
            w: { x: obj.x, y: obj.y + obj.height / 2 }
        };
        if (obj.rotation) {
            Object.keys(positions).forEach(key => { positions[key] = obj.rotatePoint(positions[key].x, positions[key].y); });
        }
        return positions;
    }

    getRotateHandlePosition(obj) {
        const rotateDistance = 30 / this.zoom;
        return obj.rotatePoint(obj.x + obj.width / 2, obj.y - rotateDistance);
    }

    findHandleAtPoint(x, y) {
        if (this.selectedObjects.length !== 1) return null;
        const obj = this.selectedObjects[0];
        if (obj.locked || obj.type === 'connector' || obj.resizable === false) return null;

        const threshold = 8 / this.zoom;
        const rotatePos = this.getRotateHandlePosition(obj);
        if (Math.hypot(x - rotatePos.x, y - rotatePos.y) <= threshold) {
            return { type: 'rotate', obj, center: obj.getCenter() };
        }
        const handles = this.getHandlePositions(obj);
        for (const [name, pos] of Object.entries(handles)) {
            if (Math.hypot(x - pos.x, y - pos.y) <= threshold) return { type: 'resize', handle: name, obj };
        }
        return null;
    }

    /**
     * Finds a polyline waypoint under the cursor.
     * @param {number} x
     * @param {number} y
     * @param {boolean} [anyConnector=false] Search all connectors instead of only the selected ones.
     * @returns {{connector:Connector,index:number}|null}
     */
    findWaypointAtPoint(x, y, anyConnector = false) {
        const threshold = 8 / this.zoom;
        const pool = anyConnector ? this.objects : this.selectedObjects;
        for (const obj of pool) {
            if (obj.type === 'connector' && obj.style === 'polyline' && obj.waypoints) {
                const index = obj.findWaypointNear(x, y, threshold);
                if (index >= 0) return { connector: obj, index };
            }
        }
        return null;
    }

    findControlPointAtPoint(x, y) {
        const threshold = 8 / this.zoom;
        for (const obj of this.selectedObjects) {
            if (obj.type === 'connector' && obj.style === 'bezier') {
                const cp1 = obj.controlPoint1 || obj.getDefaultControlPoint1();
                const cp2 = obj.controlPoint2 || obj.getDefaultControlPoint2();
                if (Math.hypot(x - cp1.x, y - cp1.y) <= threshold) return { connector: obj, type: 'cp1' };
                if (Math.hypot(x - cp2.x, y - cp2.y) <= threshold) return { connector: obj, type: 'cp2' };
            }
        }
        return null;
    }

    drawSelectionBox(box) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1 / this.zoom;
        ctx.setLineDash([5 / this.zoom, 4 / this.zoom]);
        ctx.fillRect(box.x, box.y, box.width, box.height);
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.setLineDash([]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new CanvasApp();
});

export { CanvasApp };
