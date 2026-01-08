// Main Application Controller
import { BaseShape } from './core/BaseShape.js';
import { Connector } from './core/Connector.js';
import { Group } from './core/Group.js';
import { Rectangle } from './shapes/Rectangle.js';
import { Circle } from './shapes/Circle.js';
import { Diamond } from './shapes/Diamond.js';
import { Hexagon } from './shapes/Hexagon.js';
import { Cylinder } from './shapes/Cylinder.js';
import { Parallelogram } from './shapes/Parallelogram.js';
import { TextShape } from './shapes/TextShape.js';
import { ImageShape } from './shapes/ImageShape.js';
import { Server } from './shapes/Server.js';
import { NetworkSwitch } from './shapes/NetworkSwitch.js';
import { VideoMatrix } from './shapes/VideoMatrix.js';
import { LEDProcessor } from './shapes/LEDProcessor.js';
import { SyncGenerator } from './shapes/SyncGenerator.js';
import { ConnectorAnchor } from './shapes/ConnectorAnchor.js';
import { ContextMenu } from './ui/ContextMenu.js';
import { IconLibrary } from './utils/IconLibrary.js';
import { Templates } from './utils/Templates.js';
import { ConnectionTypes, ConnectionColors } from './config/ConnectionTypes.js';

class CanvasApp {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // State
        this.objects = [];
        this.selectedObjects = [];
        this.currentTool = 'select';
        this.clipboard = [];
        this.nextGroupId = 1;

        // Drawing state
        this.isDrawing = false;
        this.isDragging = false;
        this.dragStart = null;
        this.tempObject = null;

        // Handle state
        this.isResizing = false;
        this.isRotating = false;
        this.resizeHandle = null; // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
        this.rotateCenter = null;
        this.initialBounds = null;
        this.initialRotation = 0;

        // Waypoint and control point dragging
        this.isDraggingWaypoint = false;
        this.isDraggingControlPoint = false;
        this.waypointConnector = null;
        this.waypointIndex = -1;
        this.controlPointConnector = null;
        this.controlPointType = null; // 'cp1' or 'cp2'

        // Connector state
        this.connectorStart = null;
        this.isDrawingPolyline = false;
        this.polylineWaypoints = [];

        // Grid and snap
        this.gridSize = 20;
        this.showGrid = true;
        this.snapToGrid = true;
        this.showShadows = false;

        // Zoom and pan
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;

        // History
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;

        // UI
        this.contextMenu = new ContextMenu(this.canvas);

        // Initialize
        this.resizeCanvas();
        this.setupEventListeners();
        this.render();
        this.saveState();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.render();
    }

    setupEventListeners() {
        // Tool buttons
        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setTool(e.currentTarget.dataset.tool);
            });
        });

        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        // Keyboard
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Action buttons
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('delete-btn').addEventListener('click', () => this.deleteSelected());
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());
        document.getElementById('group-btn').addEventListener('click', () => this.groupSelected());
        document.getElementById('ungroup-btn').addEventListener('click', () => this.ungroupSelected());

        // Layer controls
        document.getElementById('bring-front-btn').addEventListener('click', () => this.bringToFront());
        document.getElementById('send-back-btn').addEventListener('click', () => this.sendToBack());

        // Alignment
        document.getElementById('align-left').addEventListener('click', () => this.align('left'));
        document.getElementById('align-center').addEventListener('click', () => this.align('center'));
        document.getElementById('align-right').addEventListener('click', () => this.align('right'));

        // View toggles
        document.getElementById('grid-toggle').addEventListener('change', (e) => {
            this.showGrid = e.target.checked;
            this.render();
        });
        document.getElementById('snap-toggle').addEventListener('change', (e) => {
            this.snapToGrid = e.target.checked;
        });
        document.getElementById('shadow-toggle').addEventListener('change', (e) => {
            this.showShadows = e.target.checked;
            this.selectedObjects.forEach(obj => {
                if (obj.shadow !== undefined) {
                    obj.shadow = this.showShadows;
                }
            });
            this.render();
        });

        // Zoom
        document.getElementById('zoom-in').addEventListener('click', () => this.setZoom(this.zoom + 0.1));
        document.getElementById('zoom-out').addEventListener('click', () => this.setZoom(this.zoom - 0.1));

        // Connector style
        document.getElementById('connector-style').addEventListener('change', (e) => {
            this.connectorStyle = e.target.value;
            // Apply to selected connectors
            this.selectedObjects.forEach(obj => {
                if (obj.type === 'connector') {
                    obj.style = e.target.value;
                }
            });
            this.render();
        });

        // File operations
        document.getElementById('save-btn').addEventListener('click', () => this.save());
        document.getElementById('load-btn').addEventListener('click', () => this.load());
        document.getElementById('export-png-btn').addEventListener('click', () => this.exportPNG());
        document.getElementById('export-pdf-btn').addEventListener('click', () => this.exportPDF());
        document.getElementById('new-btn').addEventListener('click', () => this.new());

        // Templates and icons
        document.getElementById('templates-btn').addEventListener('click', () => this.showTemplates());
        document.getElementById('icons-btn').addEventListener('click', () => this.showIcons());
        document.getElementById('image-btn').addEventListener('click', () => this.addImage());

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());

        // File inputs
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileLoad(e));
        document.getElementById('image-input').addEventListener('change', (e) => this.handleImageLoad(e));

        // Modal close buttons
        document.querySelectorAll('.modal .close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Settings modal buttons
        document.getElementById('reset-colors-btn').addEventListener('click', () => this.resetColors());
        document.getElementById('apply-colors-btn').addEventListener('click', () => this.applyColors());
    }

    setTool(tool) {
        // Cancel any in-progress polyline
        if (this.isDrawingPolyline && tool !== 'polyline') {
            this.cancelPolyline();
        }

        this.currentTool = tool;
        document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`[data-tool="${tool}"]`);
        if (btn) btn.classList.add('active');

        this.canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left - this.panX) / this.zoom;
        let y = (e.clientY - rect.top - this.panY) / this.zoom;

        if (this.snapToGrid && this.currentTool !== 'select') {
            x = Math.round(x / this.gridSize) * this.gridSize;
            y = Math.round(y / this.gridSize) * this.gridSize;
        }

        return { x, y };
    }

    handleMouseDown(e) {
        if (e.button !== 0) return; // Only left click

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
        // Check for waypoints first (higher priority than handles)
        const waypoint = this.findWaypointAtPoint(pos.x, pos.y);
        if (waypoint) {
            this.isDraggingWaypoint = true;
            this.waypointConnector = waypoint.connector;
            this.waypointIndex = waypoint.index;
            this.dragStart = pos;
            return;
        }

        // Check for control points
        const controlPoint = this.findControlPointAtPoint(pos.x, pos.y);
        if (controlPoint) {
            this.isDraggingControlPoint = true;
            this.controlPointConnector = controlPoint.connector;
            this.controlPointType = controlPoint.type;
            this.dragStart = pos;
            return;
        }

        // Check for handles
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
            // If object is part of a group, select all group members
            let toSelect = [clicked];
            if (clicked.groupId) {
                toSelect = this.getGroupMembers(clicked.groupId);
            }

            if (!e.shiftKey) {
                // Replace selection
                this.selectedObjects = toSelect;
            } else {
                // Add/remove from selection
                const alreadySelected = this.selectedObjects.includes(clicked);
                if (alreadySelected) {
                    // Remove all group members
                    toSelect.forEach(obj => {
                        const idx = this.selectedObjects.indexOf(obj);
                        if (idx >= 0) this.selectedObjects.splice(idx, 1);
                    });
                } else {
                    // Add all group members
                    toSelect.forEach(obj => {
                        if (!this.selectedObjects.includes(obj)) {
                            this.selectedObjects.push(obj);
                        }
                    });
                }
            }
            this.isDragging = true;
            this.dragStart = pos;
        } else {
            if (!e.shiftKey) {
                this.selectedObjects = [];
            }
            this.isDrawing = true;
            this.tempObject = { type: 'selection', x: pos.x, y: pos.y, width: 0, height: 0 };
        }

        this.updatePropertiesPanel();
    }

    handleShapeMouseDown(pos) {
        this.isDrawing = true;
        this.tempObject = this.createShape(this.currentTool, pos.x, pos.y, 0, 0);
    }

    handleConnectorMouseDown(pos) {
        const anchor = this.findNearestAnchor(pos.x, pos.y);

        if (anchor) {
            this.connectorStart = anchor;
            this.isDrawing = true;
            const connectionType = anchor.connectionType || null;
            this.tempObject = new Connector(
                anchor.object,
                anchor.side,
                null,
                null,
                connectionType
            );
            this.tempObject.style = document.getElementById('connector-style').value || 'straight';

            // Apply connection type color if available
            if (connectionType && ConnectionColors[connectionType]) {
                this.tempObject.stroke = ConnectionColors[connectionType];
                this.tempObject.strokeWidth = 3; // Make typed connections thicker
            }

            this.showAnchorIndicator(anchor);
        }
    }

    handlePolylineClick(pos) {
        if (!this.isDrawingPolyline) {
            // Start new polyline
            const anchor = this.findNearestAnchor(pos.x, pos.y);
            if (anchor) {
                this.isDrawingPolyline = true;
                this.connectorStart = anchor;
                this.polylineWaypoints = [];
                const connectionType = anchor.connectionType || null;
                this.tempObject = new Connector(anchor.object, anchor.side, null, null, connectionType);
                this.tempObject.style = 'polyline';

                // Apply connection type color if available
                if (connectionType && ConnectionColors[connectionType]) {
                    this.tempObject.stroke = ConnectionColors[connectionType];
                    this.tempObject.strokeWidth = 3;
                }

                this.showAnchorIndicator(anchor);
            }
        } else {
            // Add waypoint or finish
            const requiredConnectionType = this.connectorStart.connectionType || null;
            const requiredPortType = this.connectorStart.portType === 'output' ? 'input' :
                                     this.connectorStart.portType === 'input' ? 'output' : null;

            const anchor = this.findNearestAnchor(pos.x, pos.y, 15, requiredConnectionType, requiredPortType);

            if (anchor && anchor.object !== this.connectorStart.object) {
                // Finish polyline
                this.tempObject.endObject = anchor.object;
                this.tempObject.endAnchor = anchor.side;
                this.tempObject.waypoints = [...this.polylineWaypoints];
                this.objects.push(this.tempObject);
                this.cancelPolyline();
                this.saveState();
            } else {
                // Add waypoint
                this.polylineWaypoints.push({ x: pos.x, y: pos.y });
                if (this.tempObject) {
                    this.tempObject.waypoints = [...this.polylineWaypoints];
                }
            }
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
        const pos = this.getMousePos(e);

        // Update anchor indicator for connector tools
        if ((this.currentTool === 'connector' || this.currentTool === 'polyline') && !this.isDrawing && !this.isDrawingPolyline) {
            const anchor = this.findNearestAnchor(pos.x, pos.y);
            if (anchor) {
                this.showAnchorIndicator(anchor);
            } else {
                this.hideAnchorIndicator();
            }
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
            } else if (this.tempObject.type === 'selection') {
                this.tempObject.width = pos.x - this.tempObject.x;
                this.tempObject.height = pos.y - this.tempObject.y;
            } else {
                this.tempObject.width = pos.x - this.tempObject.x;
                this.tempObject.height = pos.y - this.tempObject.y;
            }
            this.render();
        } else if (this.isDragging && this.selectedObjects.length > 0) {
            const dx = pos.x - this.dragStart.x;
            const dy = pos.y - this.dragStart.y;

            // Collect all objects to move (selected + their group members)
            const objectsToMove = new Set();
            this.selectedObjects.forEach(obj => {
                if (obj.type !== 'connector') {
                    objectsToMove.add(obj);
                    // If object is in a group, add all group members
                    if (obj.groupId) {
                        this.getGroupMembers(obj.groupId).forEach(member => {
                            if (member.type !== 'connector') {
                                objectsToMove.add(member);
                            }
                        });
                    }
                }
            });

            // Move all objects
            objectsToMove.forEach(obj => {
                if (obj.move) {
                    obj.move(dx, dy);
                }
            });

            this.dragStart = pos;
            this.render();
        } else if (this.currentTool === 'select') {
            // Check for waypoints and control points first
            const waypoint = this.findWaypointAtPoint(pos.x, pos.y);
            const controlPoint = this.findControlPointAtPoint(pos.x, pos.y);

            if (waypoint || controlPoint) {
                this.canvas.style.cursor = 'pointer';
            } else {
                // Check for handles
                const handle = this.findHandleAtPoint(pos.x, pos.y);
                if (handle) {
                    if (handle.type === 'rotate') {
                        this.canvas.style.cursor = 'crosshair';
                    } else {
                        // Set cursor based on resize handle
                        const cursors = {
                            nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
                            e: 'e-resize', se: 'se-resize', s: 's-resize',
                            sw: 'sw-resize', w: 'w-resize'
                        };
                        this.canvas.style.cursor = cursors[handle.handle] || 'default';
                    }
                } else {
                    const hovered = this.findObjectAtPoint(pos.x, pos.y);
                    this.canvas.style.cursor = hovered ? 'move' : 'default';
                }
            }
        } else if (this.isDrawingPolyline) {
            // Update temp polyline endpoint
            if (this.tempObject) {
                const requiredConnectionType = this.connectorStart.connectionType || null;
                const requiredPortType = this.connectorStart.portType === 'output' ? 'input' :
                                         this.connectorStart.portType === 'input' ? 'output' : null;

                const anchor = this.findNearestAnchor(pos.x, pos.y, 15, requiredConnectionType, requiredPortType);
                if (anchor && anchor.object !== this.connectorStart.object) {
                    const anchorPos = anchor.object.getAnchorPoints()[anchor.side];
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
    }

    updateTempConnector(pos) {
        // Get required connection type and port type from starting anchor
        const requiredConnectionType = this.connectorStart.connectionType || null;
        const requiredPortType = this.connectorStart.portType === 'output' ? 'input' :
                                 this.connectorStart.portType === 'input' ? 'output' : null;

        const anchor = this.findNearestAnchor(pos.x, pos.y, 15, requiredConnectionType, requiredPortType);

        if (anchor && anchor.object !== this.connectorStart.object) {
            const anchorPos = anchor.object.getAnchorPoints()[anchor.side];
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
        if (this.isDrawing && this.tempObject) {
            if (this.tempObject.type === 'connector') {
                if (this.tempObject.endObject && this.tempObject.startObject !== this.tempObject.endObject) {
                    this.objects.push(this.tempObject);
                    this.saveState();
                }
            } else if (this.tempObject.type === 'selection') {
                this.selectInBox(this.tempObject);
            } else if (Math.abs(this.tempObject.width) > 5 && Math.abs(this.tempObject.height) > 5) {
                this.normalizeShape(this.tempObject);
                this.objects.push(this.tempObject);
                this.saveState();
            }

            if (this.currentTool !== 'polyline') {
                this.tempObject = null;
                this.connectorStart = null;
            }
        }

        if (this.isDragging && this.selectedObjects.length > 0) {
            this.saveState();
        }

        if (this.isResizing || this.isRotating || this.isDraggingWaypoint || this.isDraggingControlPoint) {
            this.saveState();
            // Update properties panel after resize/rotate is complete
            if (this.isResizing || this.isRotating) {
                this.updatePropertiesPanel();
            }
        }

        this.isDrawing = false;
        this.isDragging = false;
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

        if (!this.isDrawingPolyline) {
            this.hideAnchorIndicator();
        }

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

        // Apply resize based on which handle is being dragged
        switch (this.resizeHandle) {
            case 'nw':
                obj.x = bounds.x + dx;
                obj.y = bounds.y + dy;
                obj.width = bounds.width - dx;
                obj.height = bounds.height - dy;
                break;
            case 'n':
                obj.y = bounds.y + dy;
                obj.height = bounds.height - dy;
                break;
            case 'ne':
                obj.y = bounds.y + dy;
                obj.width = bounds.width + dx;
                obj.height = bounds.height - dy;
                break;
            case 'e':
                obj.width = bounds.width + dx;
                break;
            case 'se':
                obj.width = bounds.width + dx;
                obj.height = bounds.height + dy;
                break;
            case 's':
                obj.height = bounds.height + dy;
                break;
            case 'sw':
                obj.x = bounds.x + dx;
                obj.width = bounds.width - dx;
                obj.height = bounds.height + dy;
                break;
            case 'w':
                obj.x = bounds.x + dx;
                obj.width = bounds.width - dx;
                break;
        }

        // Enforce minimum size
        const minSize = 10;
        if (Math.abs(obj.width) < minSize) {
            obj.width = obj.width < 0 ? -minSize : minSize;
        }
        if (Math.abs(obj.height) < minSize) {
            obj.height = obj.height < 0 ? -minSize : minSize;
        }

        this.updatePropertiesPanel();
    }

    handleRotate(pos) {
        if (!this.selectedObjects.length || !this.rotateCenter) return;

        const obj = this.selectedObjects[0];

        // Calculate angle from center to current mouse position
        const angle = Math.atan2(
            pos.y - this.rotateCenter.y,
            pos.x - this.rotateCenter.x
        );

        // Calculate angle from center to drag start position
        const startAngle = Math.atan2(
            this.dragStart.y - this.rotateCenter.y,
            this.dragStart.x - this.rotateCenter.x
        );

        // Update rotation (convert to degrees)
        obj.rotation = this.initialRotation + (angle - startAngle);

        // Don't update properties panel during drag - will update on mouse up
    }

    handleWaypointDrag(pos) {
        if (!this.waypointConnector || this.waypointIndex < 0) return;

        // Update waypoint position
        this.waypointConnector.waypoints[this.waypointIndex] = {
            x: pos.x,
            y: pos.y
        };
    }

    handleControlPointDrag(pos) {
        if (!this.controlPointConnector || !this.controlPointType) return;

        // Update control point position
        if (this.controlPointType === 'cp1') {
            this.controlPointConnector.controlPoint1 = {
                x: pos.x,
                y: pos.y
            };
        } else if (this.controlPointType === 'cp2') {
            this.controlPointConnector.controlPoint2 = {
                x: pos.x,
                y: pos.y
            };
        }
    }

    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.setZoom(this.zoom + delta);
    }

    handleContextMenu(e) {
        e.preventDefault();
        const pos = this.getMousePos(e);
        const obj = this.findObjectAtPoint(pos.x, pos.y);

        this.contextMenu.show(e.clientX, e.clientY, obj, {
            hasClipboard: this.clipboard.length > 0,
            onCopy: () => this.copy(),
            onCut: () => { this.copy(); this.deleteSelected(); },
            onPaste: () => this.paste(),
            onDuplicate: () => this.duplicate(),
            onDelete: () => this.deleteSelected(),
            onBringToFront: () => this.bringToFront(),
            onSendToBack: () => this.sendToBack(),
            onToggleLock: (obj) => { obj.locked = !obj.locked; this.render(); },
            onSelectAll: () => this.selectAll(),
            onAddImage: () => this.addImage(),
            onInsertIcon: () => this.showIcons(),
            onInsertTemplate: () => this.showTemplates(),
            onChangeConnectorStyle: () => {
                const styles = ['straight', 'orthogonal', 'bezier', 'polyline'];
                const current = obj.style || 'straight';
                const next = styles[(styles.indexOf(current) + 1) % styles.length];
                obj.style = next;
                this.render();
                this.saveState();
            },
            onToggleArrows: (obj) => {
                if (!obj.arrowStart && !obj.arrowEnd) {
                    obj.arrowEnd = true;
                } else if (!obj.arrowStart && obj.arrowEnd) {
                    obj.arrowStart = true;
                    obj.arrowEnd = true;
                } else if (obj.arrowStart && obj.arrowEnd) {
                    obj.arrowStart = false;
                    obj.arrowEnd = false;
                } else {
                    obj.arrowEnd = true;
                }
                this.render();
                this.saveState();
            }
        });
    }

    handleKeyDown(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'Escape') {
            if (this.isDrawingPolyline) {
                this.cancelPolyline();
                this.render();
            }
            return;
        }

        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    this.undo();
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
                case 'c':
                    e.preventDefault();
                    this.copy();
                    break;
                case 'v':
                    e.preventDefault();
                    this.paste();
                    break;
                case 'x':
                    e.preventDefault();
                    this.copy();
                    this.deleteSelected();
                    break;
                case 'd':
                    e.preventDefault();
                    this.duplicate();
                    break;
                case 'a':
                    e.preventDefault();
                    this.selectAll();
                    break;
                case 'g':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.ungroupSelected();
                    } else {
                        this.groupSelected();
                    }
                    break;
                case 's':
                    e.preventDefault();
                    this.save();
                    break;
            }
        } else {
            switch (e.key) {
                case 'Delete':
                case 'Backspace':
                    e.preventDefault();
                    this.deleteSelected();
                    break;
                case 'v':
                    this.setTool('select');
                    break;
                case 'r':
                    this.setTool('rectangle');
                    break;
                case 'c':
                    this.setTool('circle');
                    break;
                case 'd':
                    this.setTool('diamond');
                    break;
                case 'h':
                    this.setTool('hexagon');
                    break;
                case 't':
                    this.setTool('text');
                    break;
                case 'l':
                    this.setTool('connector');
                    break;
                case 'p':
                    this.setTool('polyline');
                    break;
            }
        }
    }

    handleKeyUp(e) {
        // Reserved for future use
    }

    createShape(type, x, y, width, height) {
        let shape;

        switch (type) {
            case 'rectangle':
                shape = new Rectangle(x, y, width, height);
                break;
            case 'circle':
                shape = new Circle(x, y, width, height);
                break;
            case 'diamond':
                shape = new Diamond(x, y, width, height);
                break;
            case 'hexagon':
                shape = new Hexagon(x, y, width, height);
                break;
            case 'cylinder':
                shape = new Cylinder(x, y, width, height);
                break;
            case 'parallelogram':
                shape = new Parallelogram(x, y, width, height);
                break;
            case 'server':
                shape = new Server(x, y, width, height);
                break;
            case 'network_switch':
                shape = new NetworkSwitch(x, y, width, height);
                break;
            case 'video_matrix':
                shape = new VideoMatrix(x, y, width, height);
                break;
            case 'led_processor':
                shape = new LEDProcessor(x, y, width, height);
                break;
            case 'sync_generator':
                shape = new SyncGenerator(x, y, width, height);
                break;
            case 'connector_anchor':
                shape = new ConnectorAnchor(x, y);
                break;
            default:
                shape = new Rectangle(x, y, width, height);
        }

        shape.shadow = this.showShadows;
        return shape;
    }

    createTextShape(pos) {
        const textShape = new TextShape(pos.x, pos.y, 'Text');
        this.objects.push(textShape);
        this.selectedObjects = [textShape];
        this.updatePropertiesPanel();
        this.saveState();
    }

    findObjectAtPoint(x, y) {
        // Check shapes in reverse order (top first)
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];
            if (obj.type === 'connector') continue;
            if (obj.containsPoint && obj.containsPoint(x, y)) {
                return obj;
            }
        }

        // Then check connectors
        for (let obj of this.objects) {
            if (obj.type === 'connector' && obj.containsPoint && obj.containsPoint(x, y, 5)) {
                return obj;
            }
        }

        return null;
    }

    findNearestAnchor(x, y, threshold = 15, requiredConnectionType = null, requiredPortType = null) {
        let nearest = null;
        let minDist = threshold;

        for (let obj of this.objects) {
            if (obj.type === 'connector' || !obj.getAnchorPoints) continue;

            const anchors = obj.getAnchorPoints();
            for (let [side, pos] of Object.entries(anchors)) {
                if (side === 'center') continue; // Skip center anchor

                // Check connection type compatibility if required
                if (requiredConnectionType && pos.connectionType && pos.connectionType !== requiredConnectionType) {
                    continue; // Skip incompatible connection types
                }

                // Check port type compatibility if required (output can only connect to input)
                if (requiredPortType && pos.portType) {
                    // If we're looking for a specific port type, only match that type
                    if (pos.portType !== requiredPortType) continue;
                }

                const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = {
                        object: obj,
                        side,
                        position: pos,
                        connectionType: pos.connectionType,
                        portType: pos.portType
                    };
                }
            }
        }

        return nearest;
    }

    showAnchorIndicator(anchor) {
        const indicator = document.getElementById('anchor-indicator');
        if (indicator) {
            const screenX = anchor.position.x * this.zoom + this.panX;
            const screenY = anchor.position.y * this.zoom + this.panY;
            indicator.style.left = screenX + 'px';
            indicator.style.top = screenY + 'px';
            indicator.style.display = 'block';
        }
    }

    hideAnchorIndicator() {
        const indicator = document.getElementById('anchor-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // Object manipulation
    deleteSelected() {
        if (this.selectedObjects.length === 0) return;

        const selectedIds = this.selectedObjects.map(obj => obj.id);
        this.objects = this.objects.filter(obj => {
            if (selectedIds.includes(obj.id)) return false;
            if (obj.type === 'connector') {
                if (obj.startObject && selectedIds.includes(obj.startObject.id)) return false;
                if (obj.endObject && selectedIds.includes(obj.endObject.id)) return false;
            }
            return true;
        });

        this.selectedObjects = [];
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
    }

    copy() {
        if (this.selectedObjects.length === 0) return;
        this.clipboard = this.serializeObjects(this.selectedObjects);
    }

    paste() {
        if (this.clipboard.length === 0) return;

        const newObjects = this.deserializeObjects(JSON.stringify(this.clipboard));
        const offset = 20;

        newObjects.forEach(obj => {
            obj.x += offset;
            obj.y += offset;
            this.objects.push(obj);
        });

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
        if (this.selectedObjects.length < 2) return;

        const shapes = this.selectedObjects.filter(obj => obj.type !== 'connector');
        if (shapes.length < 2) return;

        const groupId = this.nextGroupId++;

        // Assign same group ID to all selected shapes
        shapes.forEach(shape => {
            shape.groupId = groupId;
        });

        this.saveState();
        this.render();
    }

    ungroupSelected() {
        if (this.selectedObjects.length === 0) return;

        // Remove group ID from all selected objects
        this.selectedObjects.forEach(obj => {
            if (obj.groupId !== undefined) {
                delete obj.groupId;
            }
        });

        this.saveState();
        this.render();
    }

    getGroupMembers(groupId) {
        if (!groupId) return [];
        return this.objects.filter(obj => obj.groupId === groupId);
    }

    bringToFront() {
        if (this.selectedObjects.length === 0) return;

        const maxZ = Math.max(...this.objects.map(obj => obj.zIndex || 0), 0);
        this.selectedObjects.forEach(obj => {
            if (obj.zIndex !== undefined) {
                obj.zIndex = maxZ + 1;
            }
        });

        this.saveState();
        this.render();
    }

    sendToBack() {
        if (this.selectedObjects.length === 0) return;

        const minZ = Math.min(...this.objects.map(obj => obj.zIndex || 0), 0);
        this.selectedObjects.forEach(obj => {
            if (obj.zIndex !== undefined) {
                obj.zIndex = minZ - 1;
            }
        });

        this.saveState();
        this.render();
    }

    align(direction) {
        if (this.selectedObjects.length < 2) return;

        const shapes = this.selectedObjects.filter(obj => obj.type !== 'connector' && obj.getBounds);
        if (shapes.length < 2) return;

        switch (direction) {
            case 'left':
                const minX = Math.min(...shapes.map(obj => obj.x));
                shapes.forEach(obj => obj.x = minX);
                break;
            case 'center':
                const avgX = shapes.reduce((sum, obj) => sum + obj.x + obj.width / 2, 0) / shapes.length;
                shapes.forEach(obj => obj.x = avgX - obj.width / 2);
                break;
            case 'right':
                const maxX = Math.max(...shapes.map(obj => obj.x + obj.width));
                shapes.forEach(obj => obj.x = maxX - obj.width);
                break;
        }

        this.saveState();
        this.render();
    }

    setZoom(newZoom) {
        this.zoom = Math.max(0.1, Math.min(3, newZoom));
        document.getElementById('zoom-level').textContent = Math.round(this.zoom * 100) + '%';
        this.render();
    }

    // Templates and Icons
    showTemplates() {
        const modal = document.getElementById('templates-modal');
        const grid = document.getElementById('templates-grid');

        grid.innerHTML = '';

        const templates = Templates.getAllTemplates();
        templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <h4>${template.name}</h4>
                <p>Click to insert</p>
            `;
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
        const objects = result.objects;

        // Deserialize if needed
        const newObjects = objects.map(obj => {
            if (obj instanceof BaseShape || obj instanceof Connector) {
                return obj;
            }
            // Convert plain objects to proper instances
            return this.objectFromJSON(obj);
        });

        // Auto-group all shapes (not connectors) in the template
        const groupId = this.nextGroupId++;
        const shapesToGroup = newObjects.filter(obj => obj.type !== 'connector');
        shapesToGroup.forEach(shape => {
            shape.groupId = groupId;
        });

        this.objects.push(...newObjects);

        // Select the newly inserted template
        this.selectedObjects = shapesToGroup;
        this.updatePropertiesPanel();

        this.saveState();
        this.render();
    }

    showIcons() {
        const modal = document.getElementById('icons-modal');
        const grid = document.getElementById('icons-grid');

        grid.innerHTML = '';

        const icons = IconLibrary.getAllIcons();
        for (let [key, icon] of Object.entries(icons)) {
            const card = document.createElement('div');
            card.className = 'icon-card';
            card.innerHTML = `
                <h4>${icon.name}</h4>
                <p>Click to add</p>
            `;
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

        // Auto-group all shapes in the icon
        const groupId = this.nextGroupId++;
        const shapesToGroup = objects.filter(obj => obj.type !== 'connector');
        shapesToGroup.forEach(shape => {
            shape.groupId = groupId;
        });

        this.objects.push(...objects);

        // Select the newly inserted icon
        this.selectedObjects = shapesToGroup;
        this.updatePropertiesPanel();

        this.saveState();
        this.render();
    }

    addImage() {
        document.getElementById('image-input').click();
    }

    showSettings() {
        const modal = document.getElementById('settings-modal');

        // Set current colors
        document.getElementById('color-video').value = ConnectionColors.video;
        document.getElementById('color-sdi').value = ConnectionColors.sdi;
        document.getElementById('color-network').value = ConnectionColors.network;
        document.getElementById('color-usb').value = ConnectionColors.usb;

        modal.style.display = 'block';
    }

    resetColors() {
        // Reset to defaults
        ConnectionColors.video = '#FFD700';
        ConnectionColors.sdi = '#FF4500';
        ConnectionColors.network = '#00CED1';
        ConnectionColors.usb = '#9370DB';

        // Update inputs
        document.getElementById('color-video').value = ConnectionColors.video;
        document.getElementById('color-sdi').value = ConnectionColors.sdi;
        document.getElementById('color-network').value = ConnectionColors.network;
        document.getElementById('color-usb').value = ConnectionColors.usb;

        this.render();
    }

    applyColors() {
        // Apply new colors
        ConnectionColors.video = document.getElementById('color-video').value;
        ConnectionColors.sdi = document.getElementById('color-sdi').value;
        ConnectionColors.network = document.getElementById('color-network').value;
        ConnectionColors.usb = document.getElementById('color-usb').value;

        // Update all connectors with new colors
        this.objects.forEach(obj => {
            if (obj.type === 'connector' && obj.connectionType) {
                obj.stroke = ConnectionColors[obj.connectionType];
            }
        });

        // Close modal
        document.getElementById('settings-modal').style.display = 'none';

        this.render();
    }

    handleImageLoad(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new ImageShape(100, 100, 200, 150, event.target.result);
            this.objects.push(img);
            this.saveState();
            this.render();
        };
        reader.readAsDataURL(file);

        e.target.value = '';
    }

    // File operations
    save() {
        const data = {
            version: '2.0',
            objects: this.serializeObjects(this.objects),
            metadata: {
                created: new Date().toISOString(),
                zoom: this.zoom,
                nextGroupId: this.nextGroupId
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram-' + Date.now() + '.json';
        a.click();
        URL.revokeObjectURL(url);
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
                const data = JSON.parse(event.target.result);
                this.objects = this.deserializeObjects(JSON.stringify(data.objects || []));
                this.nextGroupId = data.metadata?.nextGroupId || 1;
                this.selectedObjects = [];
                this.updatePropertiesPanel();
                this.saveState();
                this.render();
            } catch (error) {
                alert('Error loading file: ' + error.message);
            }
        };
        reader.readAsText(file);

        e.target.value = '';
    }

    new() {
        if (this.objects.length > 0 && !confirm('Create new diagram? Current work will be lost.')) {
            return;
        }

        this.objects = [];
        this.selectedObjects = [];
        this.history = [];
        this.historyIndex = -1;
        this.nextGroupId = 1;
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
    }

    exportPNG() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(this.canvas, 0, 0);

        tempCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'diagram-' + Date.now() + '.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    exportPDF() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: this.canvas.width > this.canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [this.canvas.width, this.canvas.height]
        });

        pdf.addImage(this.canvas.toDataURL('image/png'), 'PNG', 0, 0, this.canvas.width, this.canvas.height);
        pdf.save('diagram-' + Date.now() + '.pdf');
    }

    // History
    saveState() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(this.serializeObjects(this.objects));

        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }

        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.objects = this.deserializeObjects(JSON.stringify(this.history[this.historyIndex]));
            this.selectedObjects = [];
            this.updatePropertiesPanel();
            this.updateUndoRedoButtons();
            this.render();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.objects = this.deserializeObjects(JSON.stringify(this.history[this.historyIndex]));
            this.selectedObjects = [];
            this.updatePropertiesPanel();
            this.updateUndoRedoButtons();
            this.render();
        }
    }

    updateUndoRedoButtons() {
        document.getElementById('undo-btn').disabled = this.historyIndex <= 0;
        document.getElementById('redo-btn').disabled = this.historyIndex >= this.history.length - 1;
    }

    // Serialization
    serializeObjects(objects) {
        return objects.map(obj => {
            if (obj.toJSON) {
                const json = obj.toJSON();
                // Convert object references to IDs for connectors
                if (obj.type === 'connector') {
                    json.startObject = obj.startObject ? obj.startObject.id : null;
                    json.endObject = obj.endObject ? obj.endObject.id : null;
                }
                return json;
            }
            return obj;
        });
    }

    deserializeObjects(data) {
        const parsed = JSON.parse(data);
        const objects = [];
        const objectMap = {};

        // First pass: create all non-connector objects
        parsed.forEach(obj => {
            if (obj.type !== 'connector') {
                const instance = this.objectFromJSON(obj);
                objects.push(instance);
                objectMap[obj.id] = instance;
            }
        });

        // Second pass: create connectors with restored references
        parsed.forEach(obj => {
            if (obj.type === 'connector') {
                const startObj = objectMap[obj.startObject];
                const endObj = objectMap[obj.endObject];

                if (startObj && endObj) {
                    const conn = new Connector(startObj, obj.startAnchor, endObj, obj.endAnchor);
                    Object.assign(conn, obj);
                    conn.startObject = startObj;
                    conn.endObject = endObj;
                    objects.push(conn);
                }
            }
        });

        return objects;
    }

    objectFromJSON(data) {
        let obj;

        switch (data.type) {
            case 'rectangle':
                obj = new Rectangle(data.x, data.y, data.width, data.height);
                break;
            case 'circle':
                obj = new Circle(data.x, data.y, data.width, data.height);
                break;
            case 'diamond':
                obj = new Diamond(data.x, data.y, data.width, data.height);
                break;
            case 'hexagon':
                obj = new Hexagon(data.x, data.y, data.width, data.height);
                break;
            case 'cylinder':
                obj = new Cylinder(data.x, data.y, data.width, data.height);
                break;
            case 'parallelogram':
                obj = new Parallelogram(data.x, data.y, data.width, data.height);
                break;
            case 'server':
                obj = new Server(data.x, data.y, data.width, data.height);
                break;
            case 'network_switch':
                obj = new NetworkSwitch(data.x, data.y, data.width, data.height);
                break;
            case 'video_matrix':
                obj = new VideoMatrix(data.x, data.y, data.width, data.height);
                break;
            case 'led_processor':
                obj = new LEDProcessor(data.x, data.y, data.width, data.height);
                break;
            case 'sync_generator':
                obj = new SyncGenerator(data.x, data.y, data.width, data.height);
                break;
            case 'connector_anchor':
                obj = new ConnectorAnchor(data.x, data.y);
                break;
            case 'text':
                obj = new TextShape(data.x, data.y, data.text);
                break;
            case 'image':
                obj = new ImageShape(data.x, data.y, data.width, data.height, data.imageData);
                break;
            default:
                obj = new Rectangle(data.x, data.y, data.width, data.height);
        }

        Object.assign(obj, data);
        return obj;
    }

    // Properties Panel
    updatePropertiesPanel() {
        const panel = document.getElementById('properties-content');

        if (this.selectedObjects.length === 0) {
            panel.innerHTML = '<p class="no-selection">No object selected</p>';
            return;
        }

        if (this.selectedObjects.length === 1) {
            const obj = this.selectedObjects[0];
            panel.innerHTML = this.getPropertiesHTML(obj);
            this.attachPropertyListeners(obj);
        } else {
            panel.innerHTML = `<p class="no-selection">${this.selectedObjects.length} objects selected</p>`;
        }
    }

    getPropertiesHTML(obj) {
        let html = '';

        if (obj.type !== 'connector') {
            html += `
                <div class="property-row">
                    <div class="property-group">
                        <label>X</label>
                        <input type="number" id="prop-x" value="${Math.round(obj.x)}">
                    </div>
                    <div class="property-group">
                        <label>Y</label>
                        <input type="number" id="prop-y" value="${Math.round(obj.y)}">
                    </div>
                </div>
                <div class="property-row">
                    <div class="property-group">
                        <label>Width</label>
                        <input type="number" id="prop-width" value="${Math.round(obj.width)}">
                    </div>
                    <div class="property-group">
                        <label>Height</label>
                        <input type="number" id="prop-height" value="${Math.round(obj.height)}">
                    </div>
                </div>
                <div class="property-group">
                    <label>Rotation</label>
                    <input type="range" id="prop-rotation" min="0" max="${Math.PI * 2}" step="0.01" value="${obj.rotation || 0}">
                    <span>${Math.round((obj.rotation || 0) * 180 / Math.PI)}°</span>
                </div>
            `;
        }

        // Port configuration for custom network objects
        if (obj.ports) {
            html += '<div class="property-group"><label style="font-weight: bold; margin-top: 10px;">Port Configuration</label></div>';

            for (let type in obj.ports) {
                const config = obj.ports[type];
                const typeName = type.charAt(0).toUpperCase() + type.slice(1);

                if (config.input !== undefined) {
                    html += `
                        <div class="property-group">
                            <label>${typeName} Inputs</label>
                            <input type="number" id="prop-port-${type}-input" min="0" max="16" value="${config.input}">
                        </div>
                    `;
                }

                if (config.output !== undefined) {
                    html += `
                        <div class="property-group">
                            <label>${typeName} Outputs</label>
                            <input type="number" id="prop-port-${type}-output" min="0" max="16" value="${config.output}">
                        </div>
                    `;
                }
            }
        }

        // Connector Anchor configuration
        if (obj.type === 'connector_anchor') {
            html += `
                <div class="property-group">
                    <label>Connection Type</label>
                    <select id="prop-connectiontype">
                        <option value="video" ${obj.connectionType === 'video' ? 'selected' : ''}>Video</option>
                        <option value="sdi" ${obj.connectionType === 'sdi' ? 'selected' : ''}>SDI</option>
                        <option value="network" ${obj.connectionType === 'network' ? 'selected' : ''}>Network</option>
                        <option value="usb" ${obj.connectionType === 'usb' ? 'selected' : ''}>USB</option>
                    </select>
                </div>
                <div class="property-group">
                    <label>Label</label>
                    <input type="text" id="prop-label" value="${obj.label || ''}">
                </div>
            `;
        }

        if (obj.type === 'text') {
            html += `
                <div class="property-group">
                    <label>Text</label>
                    <textarea id="prop-text" rows="4">${obj.text || ''}</textarea>
                </div>
                <div class="property-group">
                    <label>Font Size</label>
                    <input type="number" id="prop-fontsize" value="${obj.fontSize}">
                </div>
                <div class="property-group">
                    <label>Font Family</label>
                    <select id="prop-fontfamily">
                        <option value="Arial" ${obj.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                        <option value="Helvetica" ${obj.fontFamily === 'Helvetica' ? 'selected' : ''}>Helvetica</option>
                        <option value="Times New Roman" ${obj.fontFamily === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
                        <option value="Courier New" ${obj.fontFamily === 'Courier New' ? 'selected' : ''}>Courier New</option>
                    </select>
                </div>
                <div class="property-group">
                    <label>Text Align</label>
                    <div class="button-group">
                        <button id="prop-align-left" class="${obj.textAlign === 'left' ? 'active' : ''}" title="Align Left">◀</button>
                        <button id="prop-align-center" class="${obj.textAlign === 'center' ? 'active' : ''}" title="Align Center">▊</button>
                        <button id="prop-align-right" class="${obj.textAlign === 'right' ? 'active' : ''}" title="Align Right">▶</button>
                    </div>
                </div>
            `;
        }

        if (obj.fill !== undefined && obj.type !== 'text') {
            html += `
                <div class="property-group">
                    <label>Fill Color</label>
                    <input type="color" id="prop-fill" value="${obj.fill}">
                </div>
            `;
        } else if (obj.type === 'text') {
            html += `
                <div class="property-group">
                    <label>Text Color</label>
                    <input type="color" id="prop-fill" value="${obj.fill}">
                </div>
            `;
        }

        if (obj.stroke !== undefined && obj.stroke !== 'transparent') {
            html += `
                <div class="property-group">
                    <label>Stroke Color</label>
                    <input type="color" id="prop-stroke" value="${obj.stroke}">
                </div>
                <div class="property-group">
                    <label>Stroke Width</label>
                    <input type="range" id="prop-strokewidth" min="1" max="10" value="${obj.strokeWidth || 2}">
                    <span>${obj.strokeWidth || 2}px</span>
                </div>
            `;
        }

        if (obj.type === 'connector') {
            html += `
                <div class="property-group">
                    <label>Style</label>
                    <select id="prop-style">
                        <option value="straight" ${obj.style === 'straight' ? 'selected' : ''}>Straight</option>
                        <option value="orthogonal" ${obj.style === 'orthogonal' ? 'selected' : ''}>Orthogonal</option>
                        <option value="bezier" ${obj.style === 'bezier' ? 'selected' : ''}>Bezier</option>
                        <option value="polyline" ${obj.style === 'polyline' ? 'selected' : ''}>Polyline</option>
                    </select>
                </div>
                <div class="property-group">
                    <label>
                        <input type="checkbox" id="prop-arrowstart" ${obj.arrowStart ? 'checked' : ''}>
                        Arrow Start
                    </label>
                </div>
                <div class="property-group">
                    <label>
                        <input type="checkbox" id="prop-arrowend" ${obj.arrowEnd ? 'checked' : ''}>
                        Arrow End
                    </label>
                </div>
            `;
        }

        if (obj.shadow !== undefined) {
            html += `
                <div class="property-group">
                    <label>
                        <input type="checkbox" id="prop-shadow" ${obj.shadow ? 'checked' : ''}>
                        Shadow
                    </label>
                </div>
            `;
        }

        return html;
    }

    attachPropertyListeners(obj) {
        const props = {
            'prop-x': (val) => { obj.x = parseFloat(val); },
            'prop-y': (val) => { obj.y = parseFloat(val); },
            'prop-width': (val) => { obj.width = parseFloat(val); },
            'prop-height': (val) => { obj.height = parseFloat(val); },
            'prop-rotation': (val) => { obj.rotation = parseFloat(val); },
            'prop-fill': (val) => { obj.fill = val; },
            'prop-stroke': (val) => { obj.stroke = val; },
            'prop-strokewidth': (val) => { obj.strokeWidth = parseFloat(val); },
            'prop-text': (val) => { obj.text = val; },
            'prop-fontsize': (val) => { obj.fontSize = parseFloat(val); },
            'prop-fontfamily': (val) => { obj.fontFamily = val; },
            'prop-style': (val) => { obj.style = val; },
            'prop-arrowstart': (val) => { obj.arrowStart = val; },
            'prop-arrowend': (val) => { obj.arrowEnd = val; },
            'prop-shadow': (val) => { obj.shadow = val; },
            'prop-connectiontype': (val) => { obj.connectionType = val; },
            'prop-label': (val) => { obj.label = val; }
        };

        Object.keys(props).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const eventType = el.type === 'checkbox' ? 'change' : 'input';
                el.addEventListener(eventType, (e) => {
                    const value = el.type === 'checkbox' ? e.target.checked : e.target.value;
                    props[id](value);
                    this.render();

                    if (id === 'prop-strokewidth') {
                        e.target.nextElementSibling.textContent = value + 'px';
                    } else if (id === 'prop-rotation') {
                        e.target.nextElementSibling.textContent = Math.round(value * 180 / Math.PI) + '°';
                    }
                });
            }
        });

        // Text alignment buttons
        const alignLeft = document.getElementById('prop-align-left');
        const alignCenter = document.getElementById('prop-align-center');
        const alignRight = document.getElementById('prop-align-right');

        if (alignLeft) {
            alignLeft.addEventListener('click', () => {
                obj.textAlign = 'left';
                this.updatePropertiesPanel();
                this.render();
            });
        }
        if (alignCenter) {
            alignCenter.addEventListener('click', () => {
                obj.textAlign = 'center';
                this.updatePropertiesPanel();
                this.render();
            });
        }
        if (alignRight) {
            alignRight.addEventListener('click', () => {
                obj.textAlign = 'right';
                this.updatePropertiesPanel();
                this.render();
            });
        }

        // Port configuration listeners
        if (obj.ports) {
            for (let type in obj.ports) {
                const config = obj.ports[type];

                if (config.input !== undefined) {
                    const inputEl = document.getElementById(`prop-port-${type}-input`);
                    if (inputEl) {
                        inputEl.addEventListener('input', (e) => {
                            obj.ports[type].input = parseInt(e.target.value) || 0;
                            this.render();
                        });
                    }
                }

                if (config.output !== undefined) {
                    const outputEl = document.getElementById(`prop-port-${type}-output`);
                    if (outputEl) {
                        outputEl.addEventListener('input', (e) => {
                            obj.ports[type].output = parseInt(e.target.value) || 0;
                            this.render();
                        });
                    }
                }
            }
        }
    }

    // Rendering
    render() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoom, this.zoom);

        if (this.showGrid) {
            this.drawGrid();
        }

        // Sort objects by z-index
        const sorted = [...this.objects].sort((a, b) => {
            const aZ = a.zIndex !== undefined ? a.zIndex : 0;
            const bZ = b.zIndex !== undefined ? b.zIndex : 0;
            return aZ - bZ;
        });

        // Draw all objects
        sorted.forEach(obj => {
            if (obj.draw) {
                // Mark selected connectors
                if (obj.type === 'connector') {
                    obj.selected = this.selectedObjects.includes(obj);
                }
                obj.draw(this.ctx);
            }
        });

        // Draw temp object
        if (this.tempObject) {
            if (this.tempObject.type === 'connector') {
                this.drawTempConnector();
            } else if (this.tempObject.type === 'selection') {
                this.drawSelectionBox(this.tempObject);
            } else if (this.tempObject.draw) {
                this.tempObject.draw(this.ctx);
            }
        }

        // Draw selection indicators
        this.selectedObjects.forEach(obj => {
            if (obj.type !== 'connector' && obj.getBounds) {
                this.drawSelection(obj);
                if (obj.getAnchorPoints) {
                    this.drawAnchors(obj);
                }
            }
        });

        // Draw all anchor points when drawing connectors
        if ((this.currentTool === 'connector' || this.currentTool === 'polyline') && !this.isDrawing) {
            this.drawAllAnchors();
        }

        this.ctx.restore();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x < this.canvas.width / this.zoom; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height / this.zoom);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height / this.zoom; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width / this.zoom, y);
            this.ctx.stroke();
        }
    }

    drawTempConnector() {
        if (!this.tempObject || !this.connectorStart) return;

        const start = this.connectorStart.object.getAnchorPoints()[this.connectorStart.side];
        let end;

        if (this.tempObject.endObject) {
            end = this.tempObject.endObject.getAnchorPoints()[this.tempObject.endAnchor];
        } else {
            end = { x: this.tempObject.endX, y: this.tempObject.endY };
        }

        this.ctx.save();
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);

        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);

        // Draw waypoints for polyline
        if (this.isDrawingPolyline && this.polylineWaypoints.length > 0) {
            for (const wp of this.polylineWaypoints) {
                this.ctx.lineTo(wp.x, wp.y);
            }
        }

        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();

        this.ctx.setLineDash([]);
        this.ctx.restore();

        // Draw waypoints
        if (this.isDrawingPolyline) {
            this.polylineWaypoints.forEach(wp => {
                this.ctx.fillStyle = '#0066cc';
                this.ctx.beginPath();
                this.ctx.arc(wp.x, wp.y, 4, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }
    }

    drawSelection(obj) {
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 2 / this.zoom;
        this.ctx.setLineDash([5, 5]);

        // If object is rotated, draw rotated bounding box
        if (obj.rotation && obj.rotation !== 0) {
            const corners = obj.getRotatedBounds();
            this.ctx.beginPath();
            this.ctx.moveTo(corners[0].x, corners[0].y);
            for (let i = 1; i < corners.length; i++) {
                this.ctx.lineTo(corners[i].x, corners[i].y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        } else {
            // Non-rotated, use simple rectangle
            const bounds = obj.getBounds();
            this.ctx.strokeRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4);
        }

        this.ctx.setLineDash([]);

        // Draw resize handles (only if single object selected)
        if (this.selectedObjects.length === 1 && !obj.locked) {
            this.drawResizeHandles(obj);
            this.drawRotateHandle(obj);
        }
    }

    drawResizeHandles(obj) {
        const handleSize = 8 / this.zoom;
        const handles = this.getHandlePositions(obj);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 2 / this.zoom;

        // Draw 8 resize handles
        ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(handle => {
            const pos = handles[handle];
            this.ctx.fillRect(pos.x - handleSize / 2, pos.y - handleSize / 2, handleSize, handleSize);
            this.ctx.strokeRect(pos.x - handleSize / 2, pos.y - handleSize / 2, handleSize, handleSize);
        });
    }

    drawRotateHandle(obj) {
        const handleSize = 8 / this.zoom;
        const rotateDistance = 30 / this.zoom;

        // Get top center position
        let cx = obj.x + obj.width / 2;
        let topY = obj.y;

        // Calculate rotate handle position (above top center)
        let handleX = cx;
        let handleY = topY - rotateDistance;

        // Rotate the handle position if object is rotated
        if (obj.rotation && obj.rotation !== 0) {
            const rotatedHandle = obj.rotatePoint(handleX, handleY);
            handleX = rotatedHandle.x;
            handleY = rotatedHandle.y;

            // Also rotate the connection point (top center)
            const topCenter = obj.rotatePoint(cx, topY);
            cx = topCenter.x;
            topY = topCenter.y;
        }

        // Draw line from top to rotate handle
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 2 / this.zoom;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, topY);
        this.ctx.lineTo(handleX, handleY);
        this.ctx.stroke();

        // Draw rotate handle as circle
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.beginPath();
        this.ctx.arc(handleX, handleY, handleSize / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
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

        // Rotate handle positions if object is rotated
        if (obj.rotation && obj.rotation !== 0) {
            Object.keys(positions).forEach(key => {
                positions[key] = obj.rotatePoint(positions[key].x, positions[key].y);
            });
        }

        return positions;
    }

    getRotateHandlePosition(obj) {
        const rotateDistance = 30 / this.zoom;
        let pos = {
            x: obj.x + obj.width / 2,
            y: obj.y - rotateDistance
        };

        // Rotate handle position if object is rotated
        if (obj.rotation && obj.rotation !== 0) {
            pos = obj.rotatePoint(pos.x, pos.y);
        }

        return pos;
    }

    findHandleAtPoint(x, y) {
        if (this.selectedObjects.length !== 1) return null;

        const obj = this.selectedObjects[0];
        if (obj.locked || obj.type === 'connector') return null;

        const handleSize = 8 / this.zoom;
        const threshold = handleSize;

        // Check rotate handle first
        const rotatePos = this.getRotateHandlePosition(obj);
        const distToRotate = Math.sqrt(
            Math.pow(x - rotatePos.x, 2) + Math.pow(y - rotatePos.y, 2)
        );
        if (distToRotate <= threshold) {
            return { type: 'rotate', obj, center: { x: obj.x + obj.width / 2, y: obj.y + obj.height / 2 } };
        }

        // Check resize handles
        const handles = this.getHandlePositions(obj);
        for (let [name, pos] of Object.entries(handles)) {
            const dist = Math.sqrt(
                Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
            );
            if (dist <= threshold) {
                return { type: 'resize', handle: name, obj };
            }
        }

        return null;
    }

    findWaypointAtPoint(x, y) {
        const threshold = 8 / this.zoom;

        // Check all selected connectors for waypoints
        for (const obj of this.selectedObjects) {
            if (obj.type === 'connector' && obj.style === 'polyline' && obj.waypoints) {
                for (let i = 0; i < obj.waypoints.length; i++) {
                    const wp = obj.waypoints[i];
                    const dist = Math.sqrt(
                        Math.pow(x - wp.x, 2) + Math.pow(y - wp.y, 2)
                    );
                    if (dist <= threshold) {
                        return { connector: obj, index: i };
                    }
                }
            }
        }

        return null;
    }

    findControlPointAtPoint(x, y) {
        const threshold = 8 / this.zoom;

        // Check all selected connectors for control points
        for (const obj of this.selectedObjects) {
            if (obj.type === 'connector' && obj.style === 'bezier') {
                const cp1 = obj.controlPoint1 || obj.getDefaultControlPoint1();
                const cp2 = obj.controlPoint2 || obj.getDefaultControlPoint2();

                const dist1 = Math.sqrt(
                    Math.pow(x - cp1.x, 2) + Math.pow(y - cp1.y, 2)
                );
                if (dist1 <= threshold) {
                    return { connector: obj, type: 'cp1' };
                }

                const dist2 = Math.sqrt(
                    Math.pow(x - cp2.x, 2) + Math.pow(y - cp2.y, 2)
                );
                if (dist2 <= threshold) {
                    return { connector: obj, type: 'cp2' };
                }
            }
        }

        return null;
    }

    drawSelectionBox(box) {
        this.ctx.fillStyle = 'rgba(0, 102, 204, 0.1)';
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.fillRect(box.x, box.y, box.width, box.height);
        this.ctx.strokeRect(box.x, box.y, box.width, box.height);
        this.ctx.setLineDash([]);
    }

    drawAnchors(obj) {
        const anchors = obj.getAnchorPoints();

        // Draw all anchor points (including custom typed ports)
        Object.keys(anchors).forEach(key => {
            const pos = anchors[key];
            if (pos && key !== 'center') {
                // Use connection type color if available
                const color = pos.connectionType && ConnectionColors[pos.connectionType]
                    ? ConnectionColors[pos.connectionType]
                    : '#0066cc';

                this.ctx.fillStyle = color;
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2 / this.zoom;
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 5 / this.zoom, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            }
        });
    }

    drawAllAnchors() {
        this.objects.forEach(obj => {
            if (obj.type === 'connector' || !obj.getAnchorPoints) return;

            const anchors = obj.getAnchorPoints();
            Object.keys(anchors).forEach(key => {
                const pos = anchors[key];
                if (pos && key !== 'center') {
                    // Use connection type color if available
                    const color = pos.connectionType && ConnectionColors[pos.connectionType]
                        ? ConnectionColors[pos.connectionType]
                        : '#0066cc';

                    this.ctx.fillStyle = color;
                    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    this.ctx.lineWidth = 1.5 / this.zoom;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, 4 / this.zoom, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.stroke();
                }
            });
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CanvasApp();
});
