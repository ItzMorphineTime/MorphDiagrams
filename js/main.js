/**
 * @module main
 * @description Browser entry point: the `CanvasApp` editor. Handles the canvas, mouse/keyboard input,
 * selection and transforms, the properties panel, templates, file operations and live sync with the
 * MCP server. All diagram semantics (objects, ports, connections, validation, layout, serialisation)
 * live in the headless {@link module:core/Diagram} model so the editor, the MCP server and the tests
 * share one implementation.
 *
 * @see module:core/Diagram
 * @see module:core/ShapeRegistry
 */

import { Connector } from './core/Connector.js';
import { Diagram } from './core/Diagram.js';
import { ShapeRegistry } from './core/ShapeRegistry.js';
import { serializeObjects, deserializeObjects, createDocument, parseDocument } from './core/Serialization.js';
import { diagramToSvg } from './core/SvgExporter.js';
import { expectedCounterpartPortType, portLabel } from './core/Ports.js';
import { ContextMenu } from './ui/ContextMenu.js';
import { LiveSync } from './ui/LiveSync.js';
import { IconLibrary } from './utils/IconLibrary.js';
import { Templates } from './utils/Templates.js';
import { contrastColor } from './utils/Color.js';
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

/**
 * Escapes text for safe interpolation into innerHTML.
 * @param {*} value
 * @returns {string}
 */
function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function newId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

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

        /** @type {Diagram} Headless document model (objects live in `diagram.objects`) */
        this.diagram = new Diagram();
        /** @type {Array} Currently selected objects */
        this.selectedObjects = [];
        /** @type {string} Current tool */
        this.currentTool = 'select';
        /** @type {Array} Serialised objects for paste operations */
        this.clipboard = [];

        this.isDrawing = false;
        this.isDragging = false;
        this.dragMoved = false;
        this.dragStart = null;
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

        this.contextMenu = new ContextMenu(this.canvas);

        this.resizeCanvas();
        this.setupEventListeners();
        this.render();
        this.saveState();

        window.addEventListener('resize', () => this.resizeCanvas());
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
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
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
        this.canvas.addEventListener('mouseleave', (e) => { if (this.isDragging || this.isDrawing || this.isResizing || this.isRotating) this.handleMouseUp(e); });
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        on('undo-btn', 'click', () => this.undo());
        on('redo-btn', 'click', () => this.redo());
        on('delete-btn', 'click', () => this.deleteSelected());
        on('copy-btn', 'click', () => this.copy());
        on('group-btn', 'click', () => this.groupSelected());
        on('ungroup-btn', 'click', () => this.ungroupSelected());

        on('bring-front-btn', 'click', () => this.bringToFront());
        on('bring-forward-btn', 'click', () => this.bringForward());
        on('send-backward-btn', 'click', () => this.sendBackward());
        on('send-back-btn', 'click', () => this.sendToBack());

        on('align-left', 'click', () => this.align('left'));
        on('align-center', 'click', () => this.align('center'));
        on('align-right', 'click', () => this.align('right'));
        on('align-top', 'click', () => this.align('top'));
        on('align-middle', 'click', () => this.align('middle'));
        on('align-bottom', 'click', () => this.align('bottom'));
        on('distribute-h', 'click', () => this.distribute('horizontal'));
        on('distribute-v', 'click', () => this.distribute('vertical'));
        on('auto-layout-btn', 'click', () => this.autoLayout());

        on('grid-toggle', 'change', (e) => { this.showGrid = e.target.checked; this.render(); });
        on('snap-toggle', 'change', (e) => { this.snapToGrid = e.target.checked; });
        on('shadow-toggle', 'change', (e) => {
            this.showShadows = e.target.checked;
            this.selectedObjects.forEach(obj => { if (obj.shadow !== undefined) obj.shadow = this.showShadows; });
            this.render();
        });
        on('port-labels-toggle', 'change', (e) => { this.showPortLabels = e.target.checked; this.render(); });

        on('zoom-in', 'click', () => this.setZoom(this.zoom + 0.1));
        on('zoom-out', 'click', () => this.setZoom(this.zoom - 0.1));
        on('zoom-fit', 'click', () => this.zoomToFit());

        on('connector-style', 'change', (e) => {
            this.selectedObjects.forEach(obj => { if (obj.type === 'connector') obj.style = e.target.value; });
            this.render();
        });

        on('diagram-name', 'input', (e) => {
            this.diagram.metadata.name = e.target.value.trim();
            if (this.liveSync) this.liveSync.push();
        });

        on('save-btn', 'click', () => this.save());
        on('load-btn', 'click', () => this.load());
        on('export-png-btn', 'click', () => this.exportPNG());
        on('export-svg-btn', 'click', () => this.exportSVG());
        on('export-pdf-btn', 'click', () => this.exportPDF());
        on('new-btn', 'click', () => this.new());

        on('templates-btn', 'click', () => this.showTemplates());
        on('icons-btn', 'click', () => this.showIcons());
        on('image-btn', 'click', () => this.addImage());
        on('settings-btn', 'click', () => this.showSettings());
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
    }

    setTool(tool) {
        if (this.isDrawingPolyline && tool !== 'polyline') this.cancelPolyline();
        this.currentTool = tool;
        document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`[data-tool="${tool}"]`);
        if (btn) btn.classList.add('active');
        this.canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
        this.render();
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

    // ------------------------------------------------------------------
    // Mouse handling
    // ------------------------------------------------------------------
    handleMouseDown(e) {
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
            this.isDragging = true;
            this.dragMoved = false;
            this.dragStart = pos;
        } else {
            if (!e.shiftKey) this.selectedObjects = [];
            this.isDrawing = true;
            this.tempObject = { type: 'selection', x: pos.x, y: pos.y, width: 0, height: 0 };
        }
        this.updatePropertiesPanel();
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
        this.tempObject.style = document.getElementById('connector-style').value || 'straight';
        this.tempObject.endX = pos.x;
        this.tempObject.endY = pos.y;
        this.applyConnectionType(this.tempObject, connectionType);
        this.showAnchorIndicator(anchor);
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

    /**
     * Finds the anchor under the cursor that may complete the connector being drawn.
     * @param {{x:number,y:number}} pos
     * @returns {Object|null}
     */
    findCompatibleEndAnchor(pos) {
        const requiredConnectionType = this.connectorStart.connectionType || null;
        const requiredPortType = expectedCounterpartPortType(this.connectorStart);
        const anchor = this.findNearestAnchor(pos.x, pos.y, 15, requiredConnectionType, requiredPortType);
        return anchor && anchor.object !== this.connectorStart.object ? anchor : null;
    }

    /**
     * Finalises a connector: adopts the typed end's connection type when the start was untyped.
     * @param {Connector} conn
     */
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
    }

    handleMouseMove(e) {
        if (this.isPanning) {
            this.panX = e.clientX - this.panStartX;
            this.panY = e.clientY - this.panStartY;
            this.render();
            return;
        }

        const pos = this.getMousePos(e);

        if ((this.currentTool === 'connector' || this.currentTool === 'polyline') && !this.isDrawing && !this.isDrawingPolyline) {
            const anchor = this.findNearestAnchor(pos.x, pos.y);
            if (anchor) this.showAnchorIndicator(anchor); else this.hideAnchorIndicator();
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
            const dx = pos.x - this.dragStart.x;
            const dy = pos.y - this.dragStart.y;
            if (dx !== 0 || dy !== 0) this.dragMoved = true;

            const objectsToMove = new Set();
            this.selectedObjects.forEach(obj => {
                if (obj.type === 'connector') return;
                objectsToMove.add(obj);
                if (obj.groupId) {
                    this.getGroupMembers(obj.groupId).forEach(member => { if (member.type !== 'connector') objectsToMove.add(member); });
                }
            });
            objectsToMove.forEach(obj => { if (obj.move) obj.move(dx, dy); });

            this.dragStart = pos;
            this.render();
        } else if (this.currentTool === 'select') {
            this.updateHoverCursor(pos);
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

    updateHoverCursor(pos) {
        const waypoint = this.findWaypointAtPoint(pos.x, pos.y);
        const controlPoint = this.findControlPointAtPoint(pos.x, pos.y);
        if (waypoint || controlPoint) {
            this.canvas.style.cursor = 'pointer';
            return;
        }
        const handle = this.findHandleAtPoint(pos.x, pos.y);
        if (handle) {
            if (handle.type === 'rotate') {
                this.canvas.style.cursor = 'crosshair';
            } else {
                const cursors = {
                    nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize', e: 'e-resize',
                    se: 'se-resize', s: 's-resize', sw: 'sw-resize', w: 'w-resize'
                };
                this.canvas.style.cursor = cursors[handle.handle] || 'default';
            }
            return;
        }
        const hovered = this.findObjectAtPoint(pos.x, pos.y);
        this.canvas.style.cursor = hovered ? 'move' : 'default';
    }

    updateTempConnector(pos) {
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
                    this.saveState();
                }
            } else if (this.tempObject.type === 'selection') {
                this.selectInBox(this.tempObject);
            } else {
                const shape = this.tempObject;
                delete shape.fixedSize;
                const tiny = Math.abs(shape.width) <= 5 && Math.abs(shape.height) <= 5;
                if (tiny) {
                    // A simple click places the shape at its default size.
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

    selectInBox(box) {
        const minX = Math.min(box.x, box.x + box.width);
        const maxX = Math.max(box.x, box.x + box.width);
        const minY = Math.min(box.y, box.y + box.height);
        const maxY = Math.max(box.y, box.y + box.height);

        this.selectedObjects = this.objects.filter(obj => {
            if (obj.type === 'connector') return false;
            const bounds = obj.getBounds();
            return bounds.x >= minX && bounds.x + bounds.width <= maxX &&
                bounds.y >= minY && bounds.y + bounds.height <= maxY;
        });
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
        const dx = pos.x - this.dragStart.x;
        const dy = pos.y - this.dragStart.y;
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
        obj.rotation = this.initialRotation + (angle - startAngle);
    }

    handleWaypointDrag(pos) {
        if (!this.waypointConnector || this.waypointIndex < 0) return;
        this.waypointConnector.waypoints[this.waypointIndex] = { x: pos.x, y: pos.y };
    }

    handleControlPointDrag(pos) {
        if (!this.controlPointConnector || !this.controlPointType) return;
        if (this.controlPointType === 'cp1') this.controlPointConnector.controlPoint1 = { x: pos.x, y: pos.y };
        else if (this.controlPointType === 'cp2') this.controlPointConnector.controlPoint2 = { x: pos.x, y: pos.y };
    }

    /**
     * Zooms around the cursor so the point under the mouse stays put.
     * @param {WheelEvent} e
     */
    handleWheel(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const factor = e.deltaY > 0 ? 1 / 1.1 : 1.1;
        this.zoomAt(mx, my, this.zoom * factor);
    }

    /**
     * Sets the zoom keeping the screen point (sx, sy) fixed.
     * @param {number} sx
     * @param {number} sy
     * @param {number} newZoom
     */
    zoomAt(sx, sy, newZoom) {
        const clamped = Math.max(0.1, Math.min(3, newZoom));
        const worldX = (sx - this.panX) / this.zoom;
        const worldY = (sy - this.panY) / this.zoom;
        this.zoom = clamped;
        this.panX = sx - worldX * clamped;
        this.panY = sy - worldY * clamped;
        this.updateZoomLabel();
        this.render();
    }

    handleContextMenu(e) {
        e.preventDefault();
        const pos = this.getMousePos(e);
        const obj = this.findObjectAtPoint(pos.x, pos.y);
        if (obj && !this.selectedObjects.includes(obj)) {
            this.selectedObjects = obj.groupId ? this.getGroupMembers(obj.groupId) : [obj];
            this.updatePropertiesPanel();
            this.render();
        }

        this.contextMenu.show(e.clientX, e.clientY, obj, {
            hasClipboard: this.clipboard.length > 0,
            onCopy: () => this.copy(),
            onCut: () => { this.copy(); this.deleteSelected(); },
            onPaste: () => this.paste(),
            onDuplicate: () => this.duplicate(),
            onDelete: () => this.deleteSelected(),
            onBringToFront: () => this.bringToFront(),
            onBringForward: () => this.bringForward(),
            onSendBackward: () => this.sendBackward(),
            onSendToBack: () => this.sendToBack(),
            onToggleLock: (target) => { target.locked = !target.locked; this.saveState(); this.render(); },
            onSelectAll: () => this.selectAll(),
            onAddImage: () => this.addImage(),
            onInsertIcon: () => this.showIcons(),
            onInsertTemplate: () => this.showTemplates(),
            onChangeConnectorStyle: (target) => {
                const styles = ['straight', 'orthogonal', 'bezier', 'polyline'];
                const current = target.style || 'straight';
                target.style = styles[(styles.indexOf(current) + 1) % styles.length];
                this.render();
                this.saveState();
                this.updatePropertiesPanel();
            },
            onToggleArrows: (target) => {
                if (!target.arrowStart && !target.arrowEnd) {
                    target.arrowEnd = true;
                } else if (!target.arrowStart && target.arrowEnd) {
                    target.arrowStart = true;
                } else if (target.arrowStart && target.arrowEnd) {
                    target.arrowStart = false;
                    target.arrowEnd = false;
                } else {
                    target.arrowEnd = true;
                }
                this.render();
                this.saveState();
                this.updatePropertiesPanel();
            }
        });
    }

    // ------------------------------------------------------------------
    // Keyboard
    // ------------------------------------------------------------------
    handleKeyDown(e) {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;

        if (e.key === ' ' && !this.spacePressed) {
            e.preventDefault();
            this.spacePressed = true;
            if (!this.isPanning) this.canvas.style.cursor = 'grab';
            return;
        }

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            const dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
            const movable = this.selectedObjects.filter(o => o.type !== 'connector' && !o.locked);
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
            } else if (this.selectedObjects.length) {
                this.selectedObjects = [];
                this.updatePropertiesPanel();
            } else if (this.currentTool !== 'select') {
                this.setTool('select');
            }
            this.render();
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
                case '+': e.preventDefault(); this.setZoom(this.zoom + 0.1); break;
                case '-': e.preventDefault(); this.setZoom(this.zoom - 0.1); break;
                case '0': e.preventDefault(); this.setZoom(1); break;
            }
            return;
        }

        if (e.shiftKey) {
            switch (e.key) {
                case ']': e.preventDefault(); this.bringToFront(); break;
                case '[': e.preventDefault(); this.sendToBack(); break;
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

    /**
     * Finds the closest anchor to a world point within a screen-space threshold.
     * @param {number} x
     * @param {number} y
     * @param {number} [threshold=15] Threshold in screen pixels.
     * @param {string|null} [requiredConnectionType]
     * @param {string|null} [requiredPortType]
     * @returns {{object:Object, side:string, position:Object, connectionType:(string|null), portType:string}|null}
     */
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
        indicator.style.left = (anchor.position.x * this.zoom + this.panX) + 'px';
        indicator.style.top = (anchor.position.y * this.zoom + this.panY) + 'px';
        indicator.style.display = 'block';
        indicator.title = anchor.position.label || anchor.side;
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
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
    }

    /**
     * Copies the selection plus every connector whose both ends are selected.
     */
    copy() {
        if (this.selectedObjects.length === 0) return;
        const shapes = this.selectedObjects.filter(o => o.type !== 'connector');
        const ids = new Set(shapes.map(o => o.id));
        const connectors = this.objects.filter(o => o.type === 'connector' && o.startObject && o.endObject &&
            ids.has(o.startObject.id) && ids.has(o.endObject.id));
        const explicit = this.selectedObjects.filter(o => o.type === 'connector' && !connectors.includes(o));
        this.clipboard = serializeObjects([...shapes, ...connectors, ...explicit.filter(c => ids.has(c.startObject?.id) && ids.has(c.endObject?.id))]);
    }

    /**
     * Pastes the clipboard with fresh ids and fresh group ids, offset by 20px.
     */
    paste() {
        if (this.clipboard.length === 0) return;
        const data = JSON.parse(JSON.stringify(this.clipboard));
        const idMap = {};
        data.forEach(item => { if (item.type !== 'connector') idMap[item.id] = newId('shape'); });
        const groupMap = {};
        data.forEach(item => {
            if (item.type === 'connector') {
                item.id = newId('conn');
                item.startObject = idMap[item.startObject];
                item.endObject = idMap[item.endObject];
            } else {
                item.id = idMap[item.id];
                item.x += 20;
                item.y += 20;
                if (item.groupId !== null && item.groupId !== undefined) {
                    if (!(item.groupId in groupMap)) groupMap[item.groupId] = this.nextGroupId++;
                    item.groupId = groupMap[item.groupId];
                }
            }
            if (item.type === 'connector' && Array.isArray(item.waypoints)) {
                item.waypoints = item.waypoints.map(w => ({ x: w.x + 20, y: w.y + 20 }));
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
        this.paste();
    }

    selectAll() {
        this.selectedObjects = this.objects.filter(obj => obj.type !== 'connector');
        this.updatePropertiesPanel();
        this.render();
    }

    groupSelected() {
        const shapes = this.selectedObjects.filter(obj => obj.type !== 'connector');
        if (shapes.length < 2) return;
        const groupId = this.nextGroupId++;
        shapes.forEach(shape => { shape.groupId = groupId; });
        this.saveState();
        this.render();
    }

    ungroupSelected() {
        if (this.selectedObjects.length === 0) return;
        this.selectedObjects.forEach(obj => { if (obj.type !== 'connector') obj.groupId = null; });
        this.saveState();
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

    /**
     * Distributes the selected shapes with equal gaps along an axis.
     * @param {("horizontal"|"vertical")} axis
     */
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
        this.zoomToFit();
    }

    setZoom(newZoom) {
        this.zoom = Math.max(0.1, Math.min(3, newZoom));
        this.updateZoomLabel();
        this.render();
    }

    updateZoomLabel() {
        const el = document.getElementById('zoom-level');
        if (el) el.textContent = Math.round(this.zoom * 100) + '%';
    }

    /**
     * Fits the whole diagram into the viewport.
     */
    zoomToFit() {
        const bounds = this.diagram.getBounds(40);
        if (!bounds) return;
        const zoom = Math.max(0.1, Math.min(3, Math.min(this.canvas.width / bounds.width, this.canvas.height / bounds.height)));
        this.zoom = zoom;
        this.panX = (this.canvas.width - bounds.width * zoom) / 2 - bounds.x * zoom;
        this.panY = (this.canvas.height - bounds.height * zoom) / 2 - bounds.y * zoom;
        this.updateZoomLabel();
        this.render();
    }

    // ------------------------------------------------------------------
    // Templates, icons, images
    // ------------------------------------------------------------------
    showTemplates() {
        const modal = document.getElementById('templates-modal');
        const grid = document.getElementById('templates-grid');
        grid.innerHTML = '';
        Templates.getAllTemplates().forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `<h4>${escapeHtml(template.name)}</h4><p>Click to insert</p>`;
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
        this.render();
    }

    showIcons() {
        const modal = document.getElementById('icons-modal');
        const grid = document.getElementById('icons-grid');
        grid.innerHTML = '';
        for (const icon of Object.values(IconLibrary.getAllIcons())) {
            const card = document.createElement('div');
            card.className = 'icon-card';
            card.innerHTML = `<h4>${escapeHtml(icon.name)}</h4><p>Click to add</p>`;
            card.addEventListener('click', () => {
                this.insertIcon(icon, 200, 200);
                modal.style.display = 'none';
            });
            grid.appendChild(card);
        }
        modal.style.display = 'block';
    }

    insertIcon(icon, x, y) {
        const objects = icon.create(x, y);
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
            const img = ShapeRegistry.create('image', 100, 100, 200, 150, { imageData: event.target.result });
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
                        this.showMessage(`Connection type "${id}" is still used by objects in this diagram`, 'error');
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
            this.showMessage('Enter an id for the new connection type (e.g. hdmi)', 'error');
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
        this.showMessage(`Connection type "${id}" added`, 'info');
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
    // Documents: save / load / export / live sync
    // ------------------------------------------------------------------
    /**
     * Builds the JSON document for the current state.
     * @returns {Object}
     */
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

    /**
     * Replaces the current content with a document.
     * @param {Object|string} doc
     * @param {{resetView: boolean}} [options]
     * @returns {string[]} Loader warnings.
     */
    loadDocument(doc, options = {}) {
        const parsed = parseDocument(doc);
        this.objects = parsed.objects;
        this.diagram.metadata = parsed.metadata;
        this.nextGroupId = this.diagram.computeNextGroupId(parsed.metadata.nextGroupId);
        this.selectedObjects = [];
        const nameInput = document.getElementById('diagram-name');
        if (nameInput) nameInput.value = parsed.metadata.name || '';
        if (options.resetView && typeof parsed.metadata.zoom === 'number') {
            this.zoom = Math.max(0.1, Math.min(3, parsed.metadata.zoom));
            this.panX = Number(parsed.metadata.panX) || 0;
            this.panY = Number(parsed.metadata.panY) || 0;
            this.updateZoomLabel();
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
                if (warnings.length) this.showMessage(`Loaded with ${warnings.length} warning(s): ${warnings[0]}`, 'error');
                else this.showMessage(`Loaded ${file.name}`, 'info');
            } catch (error) {
                this.showMessage('Error loading file: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    new() {
        if (this.objects.length > 0 && !confirm('Create new diagram? Current work will be lost.')) return;
        this.objects = [];
        this.diagram.metadata = {};
        this.selectedObjects = [];
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

    /**
     * Renders the diagram (without grid or selection chrome) into an arbitrary context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {{bounds:Object, scale:number, background:string}} options
     */
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
        const bounds = this.exportBounds();
        const scale = 2;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.ceil(bounds.width * scale);
        tempCanvas.height = Math.ceil(bounds.height * scale);
        this.renderScene(tempCanvas.getContext('2d'), { bounds, scale });
        tempCanvas.toBlob((blob) => downloadBlob(blob, `${this.exportBaseName()}.png`));
    }

    exportSVG() {
        const svg = diagramToSvg(this.objects, { showPortLabels: this.showPortLabels });
        downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `${this.exportBaseName()}.svg`);
    }

    exportPDF() {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            this.showMessage('PDF export needs the jsPDF library (offline?). Use SVG export instead.', 'error');
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

    async initLiveSync() {
        try {
            if (!(await LiveSync.detect())) return;
        } catch {
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
        el.title = 'This page is served by the Morph MCP server / bridge. Changes made by the agent appear here; your edits are sent back. Click to reload.';
    }

    /**
     * Shows a transient toast.
     * @param {string} textContent
     * @param {("info"|"error")} [type='info']
     */
    showMessage(textContent, type = 'info') {
        const el = document.createElement('div');
        el.className = `message ${type}`;
        el.textContent = textContent;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
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
        if (this.liveSync && !this.applyingRemote) this.liveSync.push();
    }

    restoreHistory(index) {
        const selectedIds = this.selectedObjects.map(o => o.id);
        this.objects = deserializeObjects(JSON.parse(JSON.stringify(this.history[index])), { onWarning: w => console.warn(w) });
        this.selectedObjects = this.objects.filter(o => selectedIds.includes(o.id));
        this.updatePropertiesPanel();
        this.updateUndoRedoButtons();
        if (this.liveSync) this.liveSync.push();
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

    // ------------------------------------------------------------------
    // Properties panel
    // ------------------------------------------------------------------
    updatePropertiesPanel() {
        const panel = document.getElementById('properties-content');
        const header = document.getElementById('properties-header');
        if (!panel || !header) return;

        if (this.selectedObjects.length === 0) {
            header.textContent = 'Properties';
            panel.innerHTML = '<p class="no-selection">No object selected</p>';
            return;
        }

        if (this.selectedObjects.length === 1) {
            const obj = this.selectedObjects[0];
            const typeName = obj.type === 'connector' ? 'Connector' : ShapeRegistry.displayName(obj.type);
            header.textContent = `Properties (${typeName})`;
            panel.innerHTML = this.getPropertiesHTML(obj);
            this.attachPropertyListeners(obj);
        } else {
            header.textContent = 'Properties';
            const ports = this.selectedObjects.filter(o => o.ports).length;
            panel.innerHTML = `<p class="no-selection">${this.selectedObjects.length} objects selected${ports ? ` (${ports} with ports)` : ''}</p>`;
        }
    }

    connectionTypeOptions(selected, { allowAny = true } = {}) {
        const anyOption = allowAny ? `<option value="" ${!selected ? 'selected' : ''}>Any / untyped</option>` : '';
        return anyOption + ConnectionTypeRegistry.list().map(t =>
            `<option value="${escapeHtml(t.id)}" ${selected === t.id ? 'selected' : ''}>${escapeHtml(t.label)}</option>`).join('');
    }

    getPropertiesHTML(obj) {
        let html = '';
        const isConnector = obj.type === 'connector';

        if (!isConnector) {
            html += `
                <div class="property-row">
                    <div class="property-group"><label>X</label><input type="number" id="prop-x" value="${Math.round(obj.x)}"></div>
                    <div class="property-group"><label>Y</label><input type="number" id="prop-y" value="${Math.round(obj.y)}"></div>
                </div>`;
            if (obj.type !== 'connector_anchor') {
                html += `
                <div class="property-row">
                    <div class="property-group"><label>Width</label><input type="number" id="prop-width" value="${Math.round(obj.width)}"></div>
                    <div class="property-group"><label>Height</label><input type="number" id="prop-height" value="${Math.round(obj.height)}"></div>
                </div>
                <div class="property-group">
                    <label>Rotation</label>
                    <input type="range" id="prop-rotation" min="0" max="${Math.PI * 2}" step="0.01" value="${obj.rotation || 0}">
                    <span>${Math.round((obj.rotation || 0) * 180 / Math.PI)}°</span>
                </div>`;
            }
        }

        if (obj.type !== 'text') {
            html += `
                <div class="property-group">
                    <label>${isConnector ? 'Label' : 'Label / name'}</label>
                    <input type="text" id="prop-label" value="${escapeHtml(obj.label || '')}" placeholder="${isConnector ? 'e.g. PGM 1' : 'e.g. Media Server 1'}">
                </div>`;
        }
        if (!isConnector && obj.type !== 'text' && obj.type !== 'connector_anchor') {
            html += `
                <div class="property-group">
                    <label>Label position</label>
                    <select id="prop-labelposition">
                        ${['inside', 'bottom', 'below', 'above'].map(p => `<option value="${p}" ${obj.labelPosition === p ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                </div>`;
        }

        if (obj.ports) {
            html += `
                <div class="property-group"><label class="section-label">Port configuration</label></div>
                <table class="port-table">
                    <thead><tr><th>Type</th><th>Inputs</th><th>Outputs</th><th></th></tr></thead>
                    <tbody>`;
            for (const type of Object.keys(obj.ports)) {
                const config = obj.ports[type];
                const def = ConnectionTypeRegistry.get(type);
                html += `
                        <tr>
                            <td><span class="port-swatch" style="background:${escapeHtml(ConnectionTypeRegistry.colorFor(type))}"></span>${escapeHtml(def ? def.label : type)}</td>
                            <td><input type="number" id="prop-port-${escapeHtml(type)}-input" min="0" max="256" value="${config.input || 0}"></td>
                            <td><input type="number" id="prop-port-${escapeHtml(type)}-output" min="0" max="256" value="${config.output || 0}"></td>
                            <td><button class="mini-btn" data-remove-port="${escapeHtml(type)}" title="Remove port type">×</button></td>
                        </tr>`;
            }
            const missing = ConnectionTypeRegistry.list().filter(t => !obj.ports[t.id]);
            html += `
                    </tbody>
                </table>
                <div class="property-row port-add-row">
                    <select id="prop-port-add-type">${missing.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.label)}</option>`).join('')}</select>
                    <button id="prop-port-add" class="mini-btn wide" ${missing.length ? '' : 'disabled'}>+ Add port type</button>
                </div>`;
        }

        if (obj.type === 'connector_anchor') {
            html += `
                <div class="property-group">
                    <label>Connection type</label>
                    <select id="prop-connectiontype">${this.connectionTypeOptions(obj.connectionType || '')}</select>
                    <p class="hint">Untyped anchors accept any connection type.</p>
                </div>`;
        }

        if (obj.type === 'text') {
            html += `
                <div class="property-group"><label>Text</label><textarea id="prop-text" rows="4">${escapeHtml(obj.text || '')}</textarea></div>
                <div class="property-group"><label>Font Size</label><input type="number" id="prop-fontsize" value="${obj.fontSize}"></div>
                <div class="property-group">
                    <label>Font Family</label>
                    <select id="prop-fontfamily">
                        ${['Arial', 'Helvetica', 'Times New Roman', 'Courier New'].map(f => `<option value="${f}" ${obj.fontFamily === f ? 'selected' : ''}>${f}</option>`).join('')}
                    </select>
                </div>
                <div class="property-group">
                    <label>Text Align</label>
                    <div class="button-group">
                        <button id="prop-align-left" class="${obj.textAlign === 'left' ? 'active' : ''}" title="Align Left">◀</button>
                        <button id="prop-align-center" class="${obj.textAlign === 'center' ? 'active' : ''}" title="Align Center">▊</button>
                        <button id="prop-align-right" class="${obj.textAlign === 'right' ? 'active' : ''}" title="Align Right">▶</button>
                    </div>
                </div>`;
        }

        if (obj.fill !== undefined && !isConnector) {
            html += `
                <div class="property-group">
                    <label>${obj.type === 'text' ? 'Text Color' : 'Fill Color'}</label>
                    <input type="color" id="prop-fill" value="${escapeHtml(/^#[0-9a-fA-F]{6}$/.test(obj.fill) ? obj.fill : '#3498db')}">
                </div>`;
        }

        if (obj.stroke !== undefined && obj.stroke !== 'transparent') {
            html += `
                <div class="property-group">
                    <label>Stroke Color</label>
                    <input type="color" id="prop-stroke" value="${escapeHtml(/^#[0-9a-fA-F]{6}$/.test(obj.stroke) ? obj.stroke : '#2c3e50')}">
                </div>
                <div class="property-group">
                    <label>Stroke Width</label>
                    <input type="range" id="prop-strokewidth" min="1" max="10" value="${obj.strokeWidth || 2}">
                    <span>${obj.strokeWidth || 2}px</span>
                </div>`;
        }

        if (isConnector) {
            const from = obj.startObject ? (obj.startObject.label || ShapeRegistry.displayName(obj.startObject.type)) : '?';
            const to = obj.endObject ? (obj.endObject.label || ShapeRegistry.displayName(obj.endObject.type)) : '?';
            html += `
                <div class="property-group">
                    <p class="hint">${escapeHtml(from)}.${escapeHtml(portLabel(obj.startAnchor))} → ${escapeHtml(to)}.${escapeHtml(portLabel(obj.endAnchor))}${obj.isDangling() ? '<br><b class="warn">⚠ a port no longer exists</b>' : ''}</p>
                </div>
                <div class="property-group">
                    <label>Connection type</label>
                    <select id="prop-connectiontype">${this.connectionTypeOptions(obj.connectionType || '')}</select>
                </div>
                <div class="property-group">
                    <label>Path Style</label>
                    <select id="prop-style">
                        ${['straight', 'orthogonal', 'bezier', 'polyline'].map(s => `<option value="${s}" ${obj.style === s ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}
                    </select>
                </div>
                <div class="property-group">
                    <label>Line Style</label>
                    <select id="prop-linestyle">
                        ${['solid', 'dashed', 'dotted'].map(s => `<option value="${s}" ${obj.lineStyle === s ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}
                    </select>
                </div>
                <div class="property-group"><label><input type="checkbox" id="prop-arrowstart" ${obj.arrowStart ? 'checked' : ''}> Arrow Start</label></div>
                <div class="property-group"><label><input type="checkbox" id="prop-arrowend" ${obj.arrowEnd ? 'checked' : ''}> Arrow End</label></div>`;
        }

        if (!isConnector) {
            html += `
                <div class="property-group">
                    <label>Notes</label>
                    <textarea id="prop-description" rows="2" placeholder="model, IP, rack position…">${escapeHtml(obj.description || '')}</textarea>
                </div>`;
        }

        if (obj.shadow !== undefined) {
            html += `<div class="property-group"><label><input type="checkbox" id="prop-shadow" ${obj.shadow ? 'checked' : ''}> Shadow</label></div>`;
        }
        if (!isConnector) {
            html += `<div class="property-group"><label><input type="checkbox" id="prop-locked" ${obj.locked ? 'checked' : ''}> Locked</label></div>`;
        }
        return html;
    }

    attachPropertyListeners(obj) {
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
                this.render();
                if (id === 'prop-strokewidth') e.target.nextElementSibling.textContent = value + 'px';
                else if (id === 'prop-rotation') e.target.nextElementSibling.textContent = Math.round(value * 180 / Math.PI) + '°';
                if (isCheckbox || isSelect) this.saveState();
            });
            if (!isCheckbox && !isSelect) el.addEventListener('change', () => this.saveState());
        });

        [['prop-align-left', 'left'], ['prop-align-center', 'center'], ['prop-align-right', 'right']].forEach(([id, align]) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => {
                obj.textAlign = align;
                this.updatePropertiesPanel();
                this.saveState();
                this.render();
            });
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
                        this.render();
                    });
                    el.addEventListener('change', () => {
                        this.reportDanglingConnectors(obj);
                        this.saveState();
                    });
                }
            }
            document.querySelectorAll('[data-remove-port]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.removePort;
                    delete obj.ports[type];
                    this.reportDanglingConnectors(obj);
                    this.updatePropertiesPanel();
                    this.saveState();
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
                    this.updatePropertiesPanel();
                    this.saveState();
                    this.render();
                });
            }
        }
    }

    reportDanglingConnectors(obj) {
        const dangling = this.objects.filter(c => c.type === 'connector' && (c.startObject === obj || c.endObject === obj) && c.isDangling());
        if (dangling.length) {
            this.showMessage(`${dangling.length} connector(s) lost their port on this object (shown in red). Restore the port count or reconnect them.`, 'error');
        }
    }

    // ------------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------------
    /**
     * Set of `<objectId>|<anchorKey>` strings for every connected port.
     * @returns {Set<string>}
     */
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
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

        ctx.restore();
    }

    drawGrid() {
        const ctx = this.ctx;
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5 / this.zoom;
        const left = -this.panX / this.zoom;
        const top = -this.panY / this.zoom;
        const right = left + this.canvas.width / this.zoom;
        const bottom = top + this.canvas.height / this.zoom;
        const startX = Math.floor(left / this.gridSize) * this.gridSize;
        const startY = Math.floor(top / this.gridSize) * this.gridSize;
        ctx.beginPath();
        for (let x = startX; x <= right; x += this.gridSize) {
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
        }
        for (let y = startY; y <= bottom; y += this.gridSize) {
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
        }
        ctx.stroke();
    }

    /**
     * Draws port dots: filled when connected, hollow when free, coloured by connection type.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} obj
     * @param {Set<string>} used
     * @param {number} scale Size multiplier (1/zoom on screen).
     * @param {boolean} includeGeneric Also draw the untyped side anchors of basic shapes.
     */
    drawPortDots(ctx, obj, used, scale, includeGeneric) {
        const anchors = obj.getAnchorPoints();
        for (const [key, pos] of Object.entries(anchors)) {
            if (!pos || key === 'center') continue;
            if (!pos.connectionType && !includeGeneric && obj.type !== 'connector_anchor') continue;
            if (obj.type === 'connector_anchor') continue;
            const color = ConnectionTypeRegistry.colorFor(pos.connectionType, '#0066cc');
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
     * Draws port names just inside the shape edge next to each typed port.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} obj
     * @param {number} scale
     */
    drawPortLabels(ctx, obj, scale) {
        const anchors = obj.getAnchorPoints();
        const fontSize = 9 * scale;
        ctx.save();
        ctx.font = `${fontSize}px Arial`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = contrastColor(obj.fill);
        for (const [key, pos] of Object.entries(anchors)) {
            if (!pos || !pos.connectionType || !pos.normal) continue;
            const inward = { x: -pos.normal.x, y: -pos.normal.y };
            const tx = pos.x + inward.x * 8 * scale;
            const ty = pos.y + inward.y * 8 * scale;
            ctx.textAlign = Math.abs(inward.x) < 0.5 ? 'center' : (inward.x > 0 ? 'left' : 'right');
            ctx.fillText(pos.label || portLabel(key), tx, ty);
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
        ctx.strokeStyle = this.tempObject.connectionType ? this.tempObject.stroke : '#0066cc';
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
            ctx.fillStyle = '#0066cc';
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
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 2 / this.zoom;
        ctx.setLineDash([5 / this.zoom, 5 / this.zoom]);

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
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 2 / this.zoom;
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

        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 2 / this.zoom;
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

    findWaypointAtPoint(x, y) {
        const threshold = 8 / this.zoom;
        for (const obj of this.selectedObjects) {
            if (obj.type === 'connector' && obj.style === 'polyline' && obj.waypoints) {
                for (let i = 0; i < obj.waypoints.length; i++) {
                    const wp = obj.waypoints[i];
                    if (Math.hypot(x - wp.x, y - wp.y) <= threshold) return { connector: obj, index: i };
                }
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
        ctx.fillStyle = 'rgba(0, 102, 204, 0.1)';
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 1 / this.zoom;
        ctx.setLineDash([5 / this.zoom, 5 / this.zoom]);
        ctx.fillRect(box.x, box.y, box.width, box.height);
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.setLineDash([]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new CanvasApp();
});

export { CanvasApp };
