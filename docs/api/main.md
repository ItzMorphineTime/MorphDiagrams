# main

_Source: `js/main.js`_

## Classes

<dl>
<dt><a href="#CanvasApp">CanvasApp</a></dt>
<dd></dd>
<dt><a href="#CanvasApp">CanvasApp</a></dt>
<dd></dd>
</dl>

<a name="CanvasApp"></a>

## CanvasApp
**Kind**: global class  

* [CanvasApp](#CanvasApp)
    * [new CanvasApp()](#new_CanvasApp_new)
    * [new CanvasApp()](#new_CanvasApp_new)
    * [.canvas](#CanvasApp+canvas) : <code>HTMLCanvasElement</code>
    * [.ctx](#CanvasApp+ctx) : <code>CanvasRenderingContext2D</code>
    * [.objects](#CanvasApp+objects) : <code>Array</code>
    * [.selectedObjects](#CanvasApp+selectedObjects) : <code>Array</code>
    * [.currentTool](#CanvasApp+currentTool) : <code>string</code>
    * [.clipboard](#CanvasApp+clipboard) : <code>Array</code>
    * [.nextGroupId](#CanvasApp+nextGroupId) : <code>number</code>
    * [.isDrawing](#CanvasApp+isDrawing) : <code>boolean</code>
    * [.isDragging](#CanvasApp+isDragging) : <code>boolean</code>
    * [.dragStart](#CanvasApp+dragStart) : <code>Object</code> \| <code>null</code>
    * [.tempObject](#CanvasApp+tempObject) : <code>Object</code> \| <code>null</code>
    * [.isResizing](#CanvasApp+isResizing) : <code>boolean</code>
    * [.isRotating](#CanvasApp+isRotating) : <code>boolean</code>
    * [.resizeHandle](#CanvasApp+resizeHandle) : <code>string</code> \| <code>null</code>
    * [.rotateCenter](#CanvasApp+rotateCenter) : <code>Object</code> \| <code>null</code>
    * [.initialBounds](#CanvasApp+initialBounds) : <code>Object</code> \| <code>null</code>
    * [.initialRotation](#CanvasApp+initialRotation) : <code>number</code>
    * [.isDraggingWaypoint](#CanvasApp+isDraggingWaypoint) : <code>boolean</code>
    * [.isDraggingControlPoint](#CanvasApp+isDraggingControlPoint) : <code>boolean</code>
    * [.waypointConnector](#CanvasApp+waypointConnector) : <code>Connector</code> \| <code>null</code>
    * [.waypointIndex](#CanvasApp+waypointIndex) : <code>number</code>
    * [.controlPointConnector](#CanvasApp+controlPointConnector) : <code>Connector</code> \| <code>null</code>
    * [.controlPointType](#CanvasApp+controlPointType) : <code>string</code> \| <code>null</code>
    * [.connectorStart](#CanvasApp+connectorStart) : <code>Object</code> \| <code>null</code>
    * [.isDrawingPolyline](#CanvasApp+isDrawingPolyline) : <code>boolean</code>
    * [.polylineWaypoints](#CanvasApp+polylineWaypoints) : <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.gridSize](#CanvasApp+gridSize) : <code>number</code>
    * [.showGrid](#CanvasApp+showGrid) : <code>boolean</code>
    * [.snapToGrid](#CanvasApp+snapToGrid) : <code>boolean</code>
    * [.showShadows](#CanvasApp+showShadows) : <code>boolean</code>
    * [.zoom](#CanvasApp+zoom) : <code>number</code>
    * [.panX](#CanvasApp+panX) : <code>number</code>
    * [.panY](#CanvasApp+panY) : <code>number</code>
    * [.isPanning](#CanvasApp+isPanning) : <code>boolean</code>
    * [.panStartX](#CanvasApp+panStartX) : <code>number</code>
    * [.panStartY](#CanvasApp+panStartY) : <code>number</code>
    * [.spacePressed](#CanvasApp+spacePressed) : <code>boolean</code>
    * [.history](#CanvasApp+history) : <code>Array</code>
    * [.historyIndex](#CanvasApp+historyIndex) : <code>number</code>
    * [.maxHistory](#CanvasApp+maxHistory) : <code>number</code>
    * [.contextMenu](#CanvasApp+contextMenu) : <code>ContextMenu</code>

<a name="new_CanvasApp_new"></a>

### new CanvasApp()
Main application class that manages the canvas-based diagramming tool.
Handles user input, object creation/manipulation, rendering, and state management.
Supports shapes, connectors, groups, templates, zoom/pan, undo/redo, and more.

<a name="new_CanvasApp_new"></a>

### new CanvasApp()
Initializes the canvas application with default state and event listeners.
Sets up the canvas, initializes all state properties, and begins rendering.

<a name="CanvasApp+canvas"></a>

### canvasApp.canvas : <code>HTMLCanvasElement</code>
Main canvas element

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+ctx"></a>

### canvasApp.ctx : <code>CanvasRenderingContext2D</code>
Canvas 2D rendering context

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+objects"></a>

### canvasApp.objects : <code>Array</code>
All objects on the canvas (shapes and connectors)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+selectedObjects"></a>

### canvasApp.selectedObjects : <code>Array</code>
Currently selected objects

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+currentTool"></a>

### canvasApp.currentTool : <code>string</code>
Current tool mode (select, rectangle, circle, connector, etc.)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+clipboard"></a>

### canvasApp.clipboard : <code>Array</code>
Copied objects for paste operations

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+nextGroupId"></a>

### canvasApp.nextGroupId : <code>number</code>
Next available group ID

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDrawing"></a>

### canvasApp.isDrawing : <code>boolean</code>
Whether currently drawing a shape

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDragging"></a>

### canvasApp.isDragging : <code>boolean</code>
Whether currently dragging objects

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+dragStart"></a>

### canvasApp.dragStart : <code>Object</code> \| <code>null</code>
Starting position of drag

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+tempObject"></a>

### canvasApp.tempObject : <code>Object</code> \| <code>null</code>
Temporary object being created

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isResizing"></a>

### canvasApp.isResizing : <code>boolean</code>
Whether currently resizing

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isRotating"></a>

### canvasApp.isRotating : <code>boolean</code>
Whether currently rotating

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+resizeHandle"></a>

### canvasApp.resizeHandle : <code>string</code> \| <code>null</code>
Active resize handle (nw, n, ne, e, se, s, sw, w)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+rotateCenter"></a>

### canvasApp.rotateCenter : <code>Object</code> \| <code>null</code>
Center point for rotation

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+initialBounds"></a>

### canvasApp.initialBounds : <code>Object</code> \| <code>null</code>
Initial bounds before transformation

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+initialRotation"></a>

### canvasApp.initialRotation : <code>number</code>
Initial rotation angle

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDraggingWaypoint"></a>

### canvasApp.isDraggingWaypoint : <code>boolean</code>
Whether dragging a polyline waypoint

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDraggingControlPoint"></a>

### canvasApp.isDraggingControlPoint : <code>boolean</code>
Whether dragging a bezier control point

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+waypointConnector"></a>

### canvasApp.waypointConnector : <code>Connector</code> \| <code>null</code>
Connector being edited for waypoint

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+waypointIndex"></a>

### canvasApp.waypointIndex : <code>number</code>
Index of waypoint being dragged

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+controlPointConnector"></a>

### canvasApp.controlPointConnector : <code>Connector</code> \| <code>null</code>
Connector being edited for control point

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+controlPointType"></a>

### canvasApp.controlPointType : <code>string</code> \| <code>null</code>
Control point type being dragged (cp1 or cp2)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+connectorStart"></a>

### canvasApp.connectorStart : <code>Object</code> \| <code>null</code>
Starting object/anchor for connector being drawn

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDrawingPolyline"></a>

### canvasApp.isDrawingPolyline : <code>boolean</code>
Whether currently drawing a polyline connector

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+polylineWaypoints"></a>

### canvasApp.polylineWaypoints : <code>Array.&lt;{x: number, y: number}&gt;</code>
Waypoints for polyline being drawn

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+gridSize"></a>

### canvasApp.gridSize : <code>number</code>
Grid size in pixels

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+showGrid"></a>

### canvasApp.showGrid : <code>boolean</code>
Whether to show grid

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+snapToGrid"></a>

### canvasApp.snapToGrid : <code>boolean</code>
Whether to snap objects to grid

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+showShadows"></a>

### canvasApp.showShadows : <code>boolean</code>
Whether to render shadows

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+zoom"></a>

### canvasApp.zoom : <code>number</code>
Current zoom level (1.0 = 100%)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+panX"></a>

### canvasApp.panX : <code>number</code>
Pan offset in x direction

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+panY"></a>

### canvasApp.panY : <code>number</code>
Pan offset in y direction

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isPanning"></a>

### canvasApp.isPanning : <code>boolean</code>
Whether currently panning

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+panStartX"></a>

### canvasApp.panStartX : <code>number</code>
Pan gesture start x coordinate

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+panStartY"></a>

### canvasApp.panStartY : <code>number</code>
Pan gesture start y coordinate

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+spacePressed"></a>

### canvasApp.spacePressed : <code>boolean</code>
Whether space key is pressed (for pan mode)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+history"></a>

### canvasApp.history : <code>Array</code>
Undo/redo history stack

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+historyIndex"></a>

### canvasApp.historyIndex : <code>number</code>
Current position in history stack

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+maxHistory"></a>

### canvasApp.maxHistory : <code>number</code>
Maximum history entries

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+contextMenu"></a>

### canvasApp.contextMenu : <code>ContextMenu</code>
Context menu handler

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp"></a>

## CanvasApp
**Kind**: global class  

* [CanvasApp](#CanvasApp)
    * [new CanvasApp()](#new_CanvasApp_new)
    * [new CanvasApp()](#new_CanvasApp_new)
    * [.canvas](#CanvasApp+canvas) : <code>HTMLCanvasElement</code>
    * [.ctx](#CanvasApp+ctx) : <code>CanvasRenderingContext2D</code>
    * [.objects](#CanvasApp+objects) : <code>Array</code>
    * [.selectedObjects](#CanvasApp+selectedObjects) : <code>Array</code>
    * [.currentTool](#CanvasApp+currentTool) : <code>string</code>
    * [.clipboard](#CanvasApp+clipboard) : <code>Array</code>
    * [.nextGroupId](#CanvasApp+nextGroupId) : <code>number</code>
    * [.isDrawing](#CanvasApp+isDrawing) : <code>boolean</code>
    * [.isDragging](#CanvasApp+isDragging) : <code>boolean</code>
    * [.dragStart](#CanvasApp+dragStart) : <code>Object</code> \| <code>null</code>
    * [.tempObject](#CanvasApp+tempObject) : <code>Object</code> \| <code>null</code>
    * [.isResizing](#CanvasApp+isResizing) : <code>boolean</code>
    * [.isRotating](#CanvasApp+isRotating) : <code>boolean</code>
    * [.resizeHandle](#CanvasApp+resizeHandle) : <code>string</code> \| <code>null</code>
    * [.rotateCenter](#CanvasApp+rotateCenter) : <code>Object</code> \| <code>null</code>
    * [.initialBounds](#CanvasApp+initialBounds) : <code>Object</code> \| <code>null</code>
    * [.initialRotation](#CanvasApp+initialRotation) : <code>number</code>
    * [.isDraggingWaypoint](#CanvasApp+isDraggingWaypoint) : <code>boolean</code>
    * [.isDraggingControlPoint](#CanvasApp+isDraggingControlPoint) : <code>boolean</code>
    * [.waypointConnector](#CanvasApp+waypointConnector) : <code>Connector</code> \| <code>null</code>
    * [.waypointIndex](#CanvasApp+waypointIndex) : <code>number</code>
    * [.controlPointConnector](#CanvasApp+controlPointConnector) : <code>Connector</code> \| <code>null</code>
    * [.controlPointType](#CanvasApp+controlPointType) : <code>string</code> \| <code>null</code>
    * [.connectorStart](#CanvasApp+connectorStart) : <code>Object</code> \| <code>null</code>
    * [.isDrawingPolyline](#CanvasApp+isDrawingPolyline) : <code>boolean</code>
    * [.polylineWaypoints](#CanvasApp+polylineWaypoints) : <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.gridSize](#CanvasApp+gridSize) : <code>number</code>
    * [.showGrid](#CanvasApp+showGrid) : <code>boolean</code>
    * [.snapToGrid](#CanvasApp+snapToGrid) : <code>boolean</code>
    * [.showShadows](#CanvasApp+showShadows) : <code>boolean</code>
    * [.zoom](#CanvasApp+zoom) : <code>number</code>
    * [.panX](#CanvasApp+panX) : <code>number</code>
    * [.panY](#CanvasApp+panY) : <code>number</code>
    * [.isPanning](#CanvasApp+isPanning) : <code>boolean</code>
    * [.panStartX](#CanvasApp+panStartX) : <code>number</code>
    * [.panStartY](#CanvasApp+panStartY) : <code>number</code>
    * [.spacePressed](#CanvasApp+spacePressed) : <code>boolean</code>
    * [.history](#CanvasApp+history) : <code>Array</code>
    * [.historyIndex](#CanvasApp+historyIndex) : <code>number</code>
    * [.maxHistory](#CanvasApp+maxHistory) : <code>number</code>
    * [.contextMenu](#CanvasApp+contextMenu) : <code>ContextMenu</code>

<a name="new_CanvasApp_new"></a>

### new CanvasApp()
Main application class that manages the canvas-based diagramming tool.
Handles user input, object creation/manipulation, rendering, and state management.
Supports shapes, connectors, groups, templates, zoom/pan, undo/redo, and more.

<a name="new_CanvasApp_new"></a>

### new CanvasApp()
Initializes the canvas application with default state and event listeners.
Sets up the canvas, initializes all state properties, and begins rendering.

<a name="CanvasApp+canvas"></a>

### canvasApp.canvas : <code>HTMLCanvasElement</code>
Main canvas element

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+ctx"></a>

### canvasApp.ctx : <code>CanvasRenderingContext2D</code>
Canvas 2D rendering context

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+objects"></a>

### canvasApp.objects : <code>Array</code>
All objects on the canvas (shapes and connectors)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+selectedObjects"></a>

### canvasApp.selectedObjects : <code>Array</code>
Currently selected objects

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+currentTool"></a>

### canvasApp.currentTool : <code>string</code>
Current tool mode (select, rectangle, circle, connector, etc.)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+clipboard"></a>

### canvasApp.clipboard : <code>Array</code>
Copied objects for paste operations

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+nextGroupId"></a>

### canvasApp.nextGroupId : <code>number</code>
Next available group ID

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDrawing"></a>

### canvasApp.isDrawing : <code>boolean</code>
Whether currently drawing a shape

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDragging"></a>

### canvasApp.isDragging : <code>boolean</code>
Whether currently dragging objects

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+dragStart"></a>

### canvasApp.dragStart : <code>Object</code> \| <code>null</code>
Starting position of drag

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+tempObject"></a>

### canvasApp.tempObject : <code>Object</code> \| <code>null</code>
Temporary object being created

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isResizing"></a>

### canvasApp.isResizing : <code>boolean</code>
Whether currently resizing

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isRotating"></a>

### canvasApp.isRotating : <code>boolean</code>
Whether currently rotating

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+resizeHandle"></a>

### canvasApp.resizeHandle : <code>string</code> \| <code>null</code>
Active resize handle (nw, n, ne, e, se, s, sw, w)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+rotateCenter"></a>

### canvasApp.rotateCenter : <code>Object</code> \| <code>null</code>
Center point for rotation

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+initialBounds"></a>

### canvasApp.initialBounds : <code>Object</code> \| <code>null</code>
Initial bounds before transformation

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+initialRotation"></a>

### canvasApp.initialRotation : <code>number</code>
Initial rotation angle

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDraggingWaypoint"></a>

### canvasApp.isDraggingWaypoint : <code>boolean</code>
Whether dragging a polyline waypoint

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDraggingControlPoint"></a>

### canvasApp.isDraggingControlPoint : <code>boolean</code>
Whether dragging a bezier control point

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+waypointConnector"></a>

### canvasApp.waypointConnector : <code>Connector</code> \| <code>null</code>
Connector being edited for waypoint

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+waypointIndex"></a>

### canvasApp.waypointIndex : <code>number</code>
Index of waypoint being dragged

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+controlPointConnector"></a>

### canvasApp.controlPointConnector : <code>Connector</code> \| <code>null</code>
Connector being edited for control point

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+controlPointType"></a>

### canvasApp.controlPointType : <code>string</code> \| <code>null</code>
Control point type being dragged (cp1 or cp2)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+connectorStart"></a>

### canvasApp.connectorStart : <code>Object</code> \| <code>null</code>
Starting object/anchor for connector being drawn

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isDrawingPolyline"></a>

### canvasApp.isDrawingPolyline : <code>boolean</code>
Whether currently drawing a polyline connector

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+polylineWaypoints"></a>

### canvasApp.polylineWaypoints : <code>Array.&lt;{x: number, y: number}&gt;</code>
Waypoints for polyline being drawn

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+gridSize"></a>

### canvasApp.gridSize : <code>number</code>
Grid size in pixels

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+showGrid"></a>

### canvasApp.showGrid : <code>boolean</code>
Whether to show grid

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+snapToGrid"></a>

### canvasApp.snapToGrid : <code>boolean</code>
Whether to snap objects to grid

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+showShadows"></a>

### canvasApp.showShadows : <code>boolean</code>
Whether to render shadows

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+zoom"></a>

### canvasApp.zoom : <code>number</code>
Current zoom level (1.0 = 100%)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+panX"></a>

### canvasApp.panX : <code>number</code>
Pan offset in x direction

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+panY"></a>

### canvasApp.panY : <code>number</code>
Pan offset in y direction

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+isPanning"></a>

### canvasApp.isPanning : <code>boolean</code>
Whether currently panning

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+panStartX"></a>

### canvasApp.panStartX : <code>number</code>
Pan gesture start x coordinate

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+panStartY"></a>

### canvasApp.panStartY : <code>number</code>
Pan gesture start y coordinate

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+spacePressed"></a>

### canvasApp.spacePressed : <code>boolean</code>
Whether space key is pressed (for pan mode)

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+history"></a>

### canvasApp.history : <code>Array</code>
Undo/redo history stack

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+historyIndex"></a>

### canvasApp.historyIndex : <code>number</code>
Current position in history stack

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+maxHistory"></a>

### canvasApp.maxHistory : <code>number</code>
Maximum history entries

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+contextMenu"></a>

### canvasApp.contextMenu : <code>ContextMenu</code>
Context menu handler

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  

