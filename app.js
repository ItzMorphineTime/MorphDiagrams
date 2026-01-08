// Systems Canvas - Main Application
class SystemsCanvas {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Canvas setup
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // State
        this.objects = [];
        this.selectedObjects = [];
        this.currentTool = 'select';
        this.isDrawing = false;
        this.isDragging = false;
        this.dragStart = null;
        this.tempObject = null;
        this.clipboard = [];

        // Grid and snap
        this.gridSize = 20;
        this.showGrid = true;
        this.snapToGrid = true;

        // Zoom and pan
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;

        // Connector state
        this.connectorStart = null;
        this.connectorStartAnchor = null;

        // History for undo/redo
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;

        // Initialize
        this.setupEventListeners();
        this.render();

        // Save initial state
        this.saveState();
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
                document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentTool = e.currentTarget.dataset.tool;
                this.canvas.style.cursor = this.currentTool === 'select' ? 'default' : 'crosshair';
            });
        });

        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));

        // Action buttons
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('delete-btn').addEventListener('click', () => this.deleteSelected());
        document.getElementById('copy-btn').addEventListener('click', () => this.copy());

        // Alignment buttons
        document.getElementById('align-left').addEventListener('click', () => this.align('left'));
        document.getElementById('align-center').addEventListener('click', () => this.align('center'));
        document.getElementById('align-right').addEventListener('click', () => this.align('right'));

        // Grid and snap toggles
        document.getElementById('grid-toggle').addEventListener('change', (e) => {
            this.showGrid = e.target.checked;
            this.render();
        });
        document.getElementById('snap-toggle').addEventListener('change', (e) => {
            this.snapToGrid = e.target.checked;
        });

        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => this.setZoom(this.zoom + 0.1));
        document.getElementById('zoom-out').addEventListener('click', () => this.setZoom(this.zoom - 0.1));

        // File operations
        document.getElementById('save-btn').addEventListener('click', () => this.save());
        document.getElementById('load-btn').addEventListener('click', () => this.load());
        document.getElementById('export-png-btn').addEventListener('click', () => this.exportPNG());
        document.getElementById('export-pdf-btn').addEventListener('click', () => this.exportPDF());
        document.getElementById('new-btn').addEventListener('click', () => this.new());

        // File input
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileLoad(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
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
        const pos = this.getMousePos(e);

        if (this.currentTool === 'select') {
            // Check if clicking on existing object
            const clicked = this.findObjectAtPoint(pos.x, pos.y);

            if (clicked) {
                if (!e.shiftKey && !this.selectedObjects.includes(clicked)) {
                    this.selectedObjects = [clicked];
                } else if (e.shiftKey) {
                    if (this.selectedObjects.includes(clicked)) {
                        this.selectedObjects = this.selectedObjects.filter(obj => obj !== clicked);
                    } else {
                        this.selectedObjects.push(clicked);
                    }
                }
                this.isDragging = true;
                this.dragStart = pos;
            } else {
                if (!e.shiftKey) {
                    this.selectedObjects = [];
                }
                // Start selection box
                this.isDrawing = true;
                this.tempObject = { type: 'selection', x: pos.x, y: pos.y, width: 0, height: 0 };
            }
            this.updatePropertiesPanel();
        } else if (this.currentTool === 'connector') {
            // Find anchor point
            const anchor = this.findAnchorAtPoint(pos.x, pos.y);
            if (anchor) {
                this.connectorStart = anchor.object;
                this.connectorStartAnchor = anchor.side;
                this.isDrawing = true;
                this.tempObject = {
                    type: 'connector',
                    startObject: this.connectorStart,
                    startAnchor: this.connectorStartAnchor,
                    endX: pos.x,
                    endY: pos.y
                };
            }
        } else if (this.currentTool === 'text') {
            this.createTextObject(pos.x, pos.y);
        } else {
            // Start drawing shape
            this.isDrawing = true;
            this.tempObject = {
                type: this.currentTool,
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                fill: '#3498db',
                stroke: '#2c3e50',
                strokeWidth: 2,
                rotation: 0
            };
        }

        this.render();
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(e);

        if (this.isDrawing && this.tempObject) {
            if (this.currentTool === 'connector') {
                // Update connector endpoint
                const anchor = this.findAnchorAtPoint(pos.x, pos.y);
                if (anchor) {
                    const anchorPos = this.getAnchorPosition(anchor.object, anchor.side);
                    this.tempObject.endX = anchorPos.x;
                    this.tempObject.endY = anchorPos.y;
                    this.tempObject.endObject = anchor.object;
                    this.tempObject.endAnchor = anchor.side;
                } else {
                    this.tempObject.endX = pos.x;
                    this.tempObject.endY = pos.y;
                    this.tempObject.endObject = null;
                    this.tempObject.endAnchor = null;
                }
            } else {
                // Update shape dimensions
                this.tempObject.width = pos.x - this.tempObject.x;
                this.tempObject.height = pos.y - this.tempObject.y;
            }
            this.render();
        } else if (this.isDragging && this.selectedObjects.length > 0) {
            const dx = pos.x - this.dragStart.x;
            const dy = pos.y - this.dragStart.y;

            this.selectedObjects.forEach(obj => {
                if (obj.type !== 'connector') {
                    obj.x += dx;
                    obj.y += dy;
                }
            });

            // Update connectors attached to moved objects
            this.updateConnectors();

            this.dragStart = pos;
            this.render();
        } else if (this.currentTool === 'select') {
            // Update cursor based on hover
            const hovered = this.findObjectAtPoint(pos.x, pos.y);
            this.canvas.style.cursor = hovered ? 'move' : 'default';
        }
    }

    handleMouseUp(e) {
        if (this.isDrawing && this.tempObject) {
            if (this.currentTool === 'connector') {
                // Finalize connector
                if (this.tempObject.endObject && this.tempObject.startObject !== this.tempObject.endObject) {
                    const connector = {
                        id: this.generateId(),
                        type: 'connector',
                        startObject: this.tempObject.startObject,
                        startAnchor: this.tempObject.startAnchor,
                        endObject: this.tempObject.endObject,
                        endAnchor: this.tempObject.endAnchor,
                        stroke: '#2c3e50',
                        strokeWidth: 2,
                        arrowStart: false,
                        arrowEnd: true,
                        style: 'straight'
                    };
                    this.objects.push(connector);
                    this.saveState();
                }
            } else if (Math.abs(this.tempObject.width) > 5 && Math.abs(this.tempObject.height) > 5) {
                // Normalize negative dimensions
                if (this.tempObject.width < 0) {
                    this.tempObject.x += this.tempObject.width;
                    this.tempObject.width = Math.abs(this.tempObject.width);
                }
                if (this.tempObject.height < 0) {
                    this.tempObject.y += this.tempObject.height;
                    this.tempObject.height = Math.abs(this.tempObject.height);
                }

                this.tempObject.id = this.generateId();
                this.objects.push(this.tempObject);
                this.saveState();
            }

            this.tempObject = null;
            this.connectorStart = null;
            this.connectorStartAnchor = null;
        }

        if (this.isDragging && this.selectedObjects.length > 0) {
            this.saveState();
        }

        this.isDrawing = false;
        this.isDragging = false;
        this.render();
    }

    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.setZoom(this.zoom + delta);
    }

    handleKeyDown(e) {
        // Prevent shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
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
                case 't':
                    this.setTool('text');
                    break;
                case 'l':
                    this.setTool('connector');
                    break;
            }
        }
    }

    setTool(tool) {
        document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`[data-tool="${tool}"]`);
        if (btn) {
            btn.classList.add('active');
            this.currentTool = tool;
            this.canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
        }
    }

    findObjectAtPoint(x, y) {
        // Search in reverse order (top to bottom)
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];
            if (obj.type === 'connector') continue;

            if (this.isPointInObject(x, y, obj)) {
                return obj;
            }
        }
        return null;
    }

    isPointInObject(x, y, obj) {
        switch (obj.type) {
            case 'rectangle':
            case 'diamond':
                return x >= obj.x && x <= obj.x + obj.width &&
                       y >= obj.y && y <= obj.y + obj.height;
            case 'circle':
                const cx = obj.x + obj.width / 2;
                const cy = obj.y + obj.height / 2;
                const rx = obj.width / 2;
                const ry = obj.height / 2;
                return ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2) <= 1;
            case 'text':
                return x >= obj.x && x <= obj.x + (obj.width || 100) &&
                       y >= obj.y && y <= obj.y + (obj.height || 30);
            default:
                return false;
        }
    }

    findAnchorAtPoint(x, y) {
        const threshold = 10;

        for (let obj of this.objects) {
            if (obj.type === 'connector') continue;

            const anchors = ['top', 'right', 'bottom', 'left'];
            for (let side of anchors) {
                const pos = this.getAnchorPosition(obj, side);
                const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                if (dist < threshold) {
                    return { object: obj, side: side };
                }
            }
        }
        return null;
    }

    getAnchorPosition(obj, side) {
        if (!obj || obj.x === undefined || obj.y === undefined || obj.width === undefined || obj.height === undefined) {
            return null;
        }

        const cx = obj.x + obj.width / 2;
        const cy = obj.y + obj.height / 2;

        switch (side) {
            case 'top':
                return { x: cx, y: obj.y };
            case 'right':
                return { x: obj.x + obj.width, y: cy };
            case 'bottom':
                return { x: cx, y: obj.y + obj.height };
            case 'left':
                return { x: obj.x, y: cy };
            default:
                return { x: cx, y: cy };
        }
    }

    updateConnectors() {
        this.objects.forEach(obj => {
            if (obj.type === 'connector') {
                // Connectors are redrawn based on their attached objects
                // No need to update coordinates, they're calculated during render
            }
        });
    }

    createTextObject(x, y) {
        const text = prompt('Enter text:', 'Text');
        if (text) {
            const textObj = {
                id: this.generateId(),
                type: 'text',
                x: x,
                y: y,
                width: 100,
                height: 30,
                text: text,
                fontSize: 16,
                fontFamily: 'Arial',
                fill: '#000000',
                textAlign: 'center'
            };
            this.objects.push(textObj);
            this.saveState();
            this.render();
        }
    }

    deleteSelected() {
        if (this.selectedObjects.length === 0) return;

        // Delete selected objects and their connectors
        const selectedIds = this.selectedObjects.map(obj => obj.id);
        this.objects = this.objects.filter(obj => {
            if (selectedIds.includes(obj.id)) return false;
            if (obj.type === 'connector') {
                if (selectedIds.includes(obj.startObject.id) ||
                    selectedIds.includes(obj.endObject.id)) {
                    return false;
                }
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
        this.clipboard = JSON.parse(JSON.stringify(this.selectedObjects));
    }

    paste() {
        if (this.clipboard.length === 0) return;

        const offset = 20;
        const newObjects = JSON.parse(JSON.stringify(this.clipboard));

        newObjects.forEach(obj => {
            obj.id = this.generateId();
            obj.x += offset;
            obj.y += offset;
            this.objects.push(obj);
        });

        this.selectedObjects = newObjects;
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
    }

    align(direction) {
        if (this.selectedObjects.length < 2) return;

        const shapes = this.selectedObjects.filter(obj => obj.type !== 'connector');
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

        this.updateConnectors();
        this.saveState();
        this.render();
    }

    setZoom(newZoom) {
        this.zoom = Math.max(0.1, Math.min(3, newZoom));
        document.getElementById('zoom-level').textContent = Math.round(this.zoom * 100) + '%';
        this.render();
    }

    saveState() {
        // Remove any states after current index
        this.history = this.history.slice(0, this.historyIndex + 1);

        // Serialize objects with connector references
        const serialized = this.serializeObjects();
        this.history.push(serialized);

        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }

        this.updateUndoRedoButtons();
    }

    serializeObjects() {
        return JSON.stringify(this.objects, (key, value) => {
            // Convert object references to IDs for connectors
            if (key === 'startObject' || key === 'endObject') {
                return value ? value.id : null;
            }
            return value;
        });
    }

    deserializeObjects(data) {
        const objects = JSON.parse(data);

        // First pass: create object map
        const objectMap = {};
        objects.forEach(obj => {
            if (obj.type !== 'connector') {
                objectMap[obj.id] = obj;
            }
        });

        // Second pass: restore connector references
        objects.forEach(obj => {
            if (obj.type === 'connector') {
                obj.startObject = objectMap[obj.startObject];
                obj.endObject = objectMap[obj.endObject];
            }
        });

        return objects;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.objects = this.deserializeObjects(this.history[this.historyIndex]);
            this.selectedObjects = [];
            this.updatePropertiesPanel();
            this.updateUndoRedoButtons();
            this.render();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.objects = this.deserializeObjects(this.history[this.historyIndex]);
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

    save() {
        const data = {
            version: '1.0',
            objects: JSON.parse(this.serializeObjects()),
            metadata: {
                created: new Date().toISOString(),
                zoom: this.zoom
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
                const serializedObjects = JSON.stringify(data.objects || []);
                this.objects = this.deserializeObjects(serializedObjects);
                this.selectedObjects = [];
                this.updatePropertiesPanel();
                this.saveState();
                this.render();
            } catch (error) {
                alert('Error loading file: ' + error.message);
            }
        };
        reader.readAsText(file);

        // Reset file input
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
        this.updatePropertiesPanel();
        this.saveState();
        this.render();
    }

    exportPNG() {
        // Create temporary canvas with white background
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Fill white background
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw current canvas content
        tempCtx.drawImage(this.canvas, 0, 0);

        // Download
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

    generateId() {
        return 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

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
                        <label>X Position</label>
                        <input type="number" id="prop-x" value="${Math.round(obj.x)}">
                    </div>
                    <div class="property-group">
                        <label>Y Position</label>
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
            `;
        }

        if (obj.type === 'text') {
            html += `
                <div class="property-group">
                    <label>Text</label>
                    <textarea id="prop-text">${obj.text}</textarea>
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
            `;
        }

        if (obj.fill !== undefined) {
            html += `
                <div class="property-group">
                    <label>Fill Color</label>
                    <input type="color" id="prop-fill" value="${obj.fill}">
                </div>
            `;
        }

        if (obj.stroke !== undefined) {
            html += `
                <div class="property-group">
                    <label>Stroke Color</label>
                    <input type="color" id="prop-stroke" value="${obj.stroke}">
                </div>
                <div class="property-group">
                    <label>Stroke Width</label>
                    <input type="range" id="prop-strokewidth" min="1" max="10" value="${obj.strokeWidth}">
                    <span>${obj.strokeWidth}px</span>
                </div>
            `;
        }

        if (obj.type === 'connector') {
            html += `
                <div class="property-group">
                    <label>Connector Style</label>
                    <select id="prop-connectorstyle">
                        <option value="straight" ${obj.style === 'straight' ? 'selected' : ''}>Straight</option>
                        <option value="orthogonal" ${obj.style === 'orthogonal' ? 'selected' : ''}>Orthogonal</option>
                    </select>
                </div>
                <div class="property-group">
                    <label>Arrow Start</label>
                    <input type="checkbox" id="prop-arrowstart" ${obj.arrowStart ? 'checked' : ''}>
                </div>
                <div class="property-group">
                    <label>Arrow End</label>
                    <input type="checkbox" id="prop-arrowend" ${obj.arrowEnd ? 'checked' : ''}>
                </div>
            `;
        }

        return html;
    }

    attachPropertyListeners(obj) {
        const props = {
            'prop-x': (val) => obj.x = parseFloat(val),
            'prop-y': (val) => obj.y = parseFloat(val),
            'prop-width': (val) => obj.width = parseFloat(val),
            'prop-height': (val) => obj.height = parseFloat(val),
            'prop-fill': (val) => obj.fill = val,
            'prop-stroke': (val) => obj.stroke = val,
            'prop-strokewidth': (val) => obj.strokeWidth = parseFloat(val),
            'prop-text': (val) => obj.text = val,
            'prop-fontsize': (val) => obj.fontSize = parseFloat(val),
            'prop-fontfamily': (val) => obj.fontFamily = val,
            'prop-connectorstyle': (val) => obj.style = val,
            'prop-arrowstart': (val) => obj.arrowStart = val,
            'prop-arrowend': (val) => obj.arrowEnd = val
        };

        Object.keys(props).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const eventType = el.type === 'checkbox' ? 'change' : 'input';
                el.addEventListener(eventType, (e) => {
                    const value = el.type === 'checkbox' ? e.target.checked : e.target.value;
                    props[id](value);
                    this.updateConnectors();
                    this.render();

                    // Update stroke width display
                    if (id === 'prop-strokewidth') {
                        e.target.nextElementSibling.textContent = value + 'px';
                    }
                });
            }
        });
    }

    render() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoom, this.zoom);

        // Draw grid
        if (this.showGrid) {
            this.drawGrid();
        }

        // Draw all objects
        if (this.objects && Array.isArray(this.objects)) {
            this.objects.forEach(obj => {
                if (obj.type === 'connector') {
                    // Only draw connector if both objects exist
                    if (obj.startObject && obj.endObject) {
                        this.drawConnector(obj);
                    }
                } else {
                    this.drawShape(obj);
                }
            });
        }

        // Draw temp object
        if (this.tempObject) {
            if (this.tempObject.type === 'connector') {
                this.drawConnector(this.tempObject, true);
            } else if (this.tempObject.type === 'selection') {
                this.drawSelectionBox(this.tempObject);
            } else {
                this.drawShape(this.tempObject);
            }
        }

        // Draw selection
        if (this.selectedObjects && Array.isArray(this.selectedObjects)) {
            this.selectedObjects.forEach(obj => {
                if (obj.type !== 'connector') {
                    this.drawSelection(obj);
                    this.drawAnchors(obj);
                }
            });
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

    drawShape(obj) {
        this.ctx.save();

        switch (obj.type) {
            case 'rectangle':
                this.ctx.fillStyle = obj.fill;
                this.ctx.strokeStyle = obj.stroke;
                this.ctx.lineWidth = obj.strokeWidth;
                this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                this.ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
                break;

            case 'circle':
                this.ctx.fillStyle = obj.fill;
                this.ctx.strokeStyle = obj.stroke;
                this.ctx.lineWidth = obj.strokeWidth;
                this.ctx.beginPath();
                this.ctx.ellipse(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    Math.abs(obj.width / 2),
                    Math.abs(obj.height / 2),
                    0, 0, Math.PI * 2
                );
                this.ctx.fill();
                this.ctx.stroke();
                break;

            case 'diamond':
                this.ctx.fillStyle = obj.fill;
                this.ctx.strokeStyle = obj.stroke;
                this.ctx.lineWidth = obj.strokeWidth;
                this.ctx.beginPath();
                this.ctx.moveTo(obj.x + obj.width / 2, obj.y);
                this.ctx.lineTo(obj.x + obj.width, obj.y + obj.height / 2);
                this.ctx.lineTo(obj.x + obj.width / 2, obj.y + obj.height);
                this.ctx.lineTo(obj.x, obj.y + obj.height / 2);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
                break;

            case 'text':
                this.ctx.fillStyle = obj.fill;
                this.ctx.font = `${obj.fontSize}px ${obj.fontFamily}`;
                this.ctx.textAlign = obj.textAlign;
                this.ctx.textBaseline = 'middle';
                const textX = obj.textAlign === 'center' ? obj.x + obj.width / 2 : obj.x;
                this.ctx.fillText(obj.text, textX, obj.y + obj.height / 2);
                break;
        }

        this.ctx.restore();
    }

    drawConnector(conn, isTemp = false) {
        let startPos, endPos;

        try {
            if (isTemp) {
                if (!conn.startObject) return;
                startPos = this.getAnchorPosition(conn.startObject, conn.startAnchor);
                endPos = { x: conn.endX, y: conn.endY };
            } else {
                if (!conn.startObject || !conn.endObject) return;
                startPos = this.getAnchorPosition(conn.startObject, conn.startAnchor);
                endPos = this.getAnchorPosition(conn.endObject, conn.endAnchor);
            }

            if (!startPos || !endPos) return;

            this.ctx.strokeStyle = conn.stroke || '#2c3e50';
            this.ctx.lineWidth = conn.strokeWidth || 2;
            this.ctx.fillStyle = conn.stroke || '#2c3e50';

            // Draw line based on style
            if (conn.style === 'orthogonal') {
                this.drawOrthogonalLine(startPos, endPos);
            } else {
                this.ctx.beginPath();
                this.ctx.moveTo(startPos.x, startPos.y);
                this.ctx.lineTo(endPos.x, endPos.y);
                this.ctx.stroke();
            }

            // Draw arrows
            if (conn.arrowStart) {
                this.drawArrow(startPos, endPos, true);
            }
            if (conn.arrowEnd) {
                this.drawArrow(startPos, endPos, false);
            }
        } catch (error) {
            console.warn('Error drawing connector:', error);
        }
    }

    drawOrthogonalLine(start, end) {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);

        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        // Simple orthogonal routing
        if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
            this.ctx.lineTo(midX, start.y);
            this.ctx.lineTo(midX, end.y);
        } else {
            this.ctx.lineTo(start.x, midY);
            this.ctx.lineTo(end.x, midY);
        }

        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }

    drawArrow(start, end, atStart) {
        const point = atStart ? start : end;
        const from = atStart ? end : start;

        const angle = Math.atan2(point.y - from.y, point.x - from.x);
        const arrowLength = 12;
        const arrowWidth = 8;

        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(
            point.x - arrowLength * Math.cos(angle) + arrowWidth * Math.cos(angle + Math.PI / 2),
            point.y - arrowLength * Math.sin(angle) + arrowWidth * Math.sin(angle + Math.PI / 2)
        );
        this.ctx.lineTo(
            point.x - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle + Math.PI / 2),
            point.y - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle + Math.PI / 2)
        );
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawSelection(obj) {
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(obj.x - 2, obj.y - 2, obj.width + 4, obj.height + 4);
        this.ctx.setLineDash([]);
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
        const anchors = ['top', 'right', 'bottom', 'left'];

        anchors.forEach(side => {
            const pos = this.getAnchorPosition(obj, side);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.strokeStyle = '#0066cc';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SystemsCanvas();
});
