# main

_Source: `js/main.js`_

<a name="module_main"></a>

## main
Main application controller for the SystemsCanvas diagramming tool. Manages the canvas, user interactions, object manipulation, and rendering.

**Remarks**: - Handles all user input (mouse, keyboard, touch).- Manages object creation, selection, manipulation, and deletion.- Provides undo/redo history system.- Supports file operations (save, load, export PNG/PDF).- Integrates with templates, icons, and context menu systems.- Supports zoom, pan, grid, and snap-to-grid features.  
**See**

- module:core/BaseShape
- module:core/Connector
- module:ui/ContextMenu
- module:utils/Templates

**Example**  
```js
import { CanvasApp } from './main.js';document.addEventListener('DOMContentLoaded', () => {  window.app = new CanvasApp();});
```

* [main](#module_main)
    * [~CanvasApp](#module_main..CanvasApp)
        * [new CanvasApp()](#new_module_main..CanvasApp_new)
        * [.canvas](#module_main..CanvasApp+canvas) : <code>HTMLCanvasElement</code>
        * [.ctx](#module_main..CanvasApp+ctx) : <code>CanvasRenderingContext2D</code>
        * [.objects](#module_main..CanvasApp+objects) : <code>Array</code>
        * [.selectedObjects](#module_main..CanvasApp+selectedObjects) : <code>Array</code>
        * [.currentTool](#module_main..CanvasApp+currentTool) : <code>string</code>
        * [.clipboard](#module_main..CanvasApp+clipboard) : <code>Array</code>
        * [.nextGroupId](#module_main..CanvasApp+nextGroupId) : <code>number</code>
        * [.isDrawing](#module_main..CanvasApp+isDrawing) : <code>boolean</code>
        * [.isDragging](#module_main..CanvasApp+isDragging) : <code>boolean</code>
        * [.dragStart](#module_main..CanvasApp+dragStart) : <code>Object</code> \| <code>null</code>
        * [.tempObject](#module_main..CanvasApp+tempObject) : <code>Object</code> \| <code>null</code>
        * [.isResizing](#module_main..CanvasApp+isResizing) : <code>boolean</code>
        * [.isRotating](#module_main..CanvasApp+isRotating) : <code>boolean</code>
        * [.resizeHandle](#module_main..CanvasApp+resizeHandle) : <code>string</code> \| <code>null</code>
        * [.rotateCenter](#module_main..CanvasApp+rotateCenter) : <code>Object</code> \| <code>null</code>
        * [.initialBounds](#module_main..CanvasApp+initialBounds) : <code>Object</code> \| <code>null</code>
        * [.initialRotation](#module_main..CanvasApp+initialRotation) : <code>number</code>
        * [.isDraggingWaypoint](#module_main..CanvasApp+isDraggingWaypoint) : <code>boolean</code>
        * [.isDraggingControlPoint](#module_main..CanvasApp+isDraggingControlPoint) : <code>boolean</code>
        * [.waypointConnector](#module_main..CanvasApp+waypointConnector) : <code>Connector</code> \| <code>null</code>
        * [.waypointIndex](#module_main..CanvasApp+waypointIndex) : <code>number</code>
        * [.controlPointConnector](#module_main..CanvasApp+controlPointConnector) : <code>Connector</code> \| <code>null</code>
        * [.controlPointType](#module_main..CanvasApp+controlPointType) : <code>string</code> \| <code>null</code>
        * [.connectorStart](#module_main..CanvasApp+connectorStart) : <code>Object</code> \| <code>null</code>
        * [.isDrawingPolyline](#module_main..CanvasApp+isDrawingPolyline) : <code>boolean</code>
        * [.polylineWaypoints](#module_main..CanvasApp+polylineWaypoints) : <code>Array.&lt;{x: number, y: number}&gt;</code>
        * [.gridSize](#module_main..CanvasApp+gridSize) : <code>number</code>
        * [.showGrid](#module_main..CanvasApp+showGrid) : <code>boolean</code>
        * [.snapToGrid](#module_main..CanvasApp+snapToGrid) : <code>boolean</code>
        * [.showShadows](#module_main..CanvasApp+showShadows) : <code>boolean</code>
        * [.zoom](#module_main..CanvasApp+zoom) : <code>number</code>
        * [.panX](#module_main..CanvasApp+panX) : <code>number</code>
        * [.panY](#module_main..CanvasApp+panY) : <code>number</code>
        * [.isPanning](#module_main..CanvasApp+isPanning) : <code>boolean</code>
        * [.panStartX](#module_main..CanvasApp+panStartX) : <code>number</code>
        * [.panStartY](#module_main..CanvasApp+panStartY) : <code>number</code>
        * [.spacePressed](#module_main..CanvasApp+spacePressed) : <code>boolean</code>
        * [.history](#module_main..CanvasApp+history) : <code>Array</code>
        * [.historyIndex](#module_main..CanvasApp+historyIndex) : <code>number</code>
        * [.maxHistory](#module_main..CanvasApp+maxHistory) : <code>number</code>
        * [.contextMenu](#module_main..CanvasApp+contextMenu) : <code>ContextMenu</code>

<a name="module_main..CanvasApp"></a>

### main~CanvasApp
Main application class that manages the canvas-based diagramming tool.

**Kind**: inner class of [<code>main</code>](#module_main)  

* [~CanvasApp](#module_main..CanvasApp)
    * [new CanvasApp()](#new_module_main..CanvasApp_new)
    * [.canvas](#module_main..CanvasApp+canvas) : <code>HTMLCanvasElement</code>
    * [.ctx](#module_main..CanvasApp+ctx) : <code>CanvasRenderingContext2D</code>
    * [.objects](#module_main..CanvasApp+objects) : <code>Array</code>
    * [.selectedObjects](#module_main..CanvasApp+selectedObjects) : <code>Array</code>
    * [.currentTool](#module_main..CanvasApp+currentTool) : <code>string</code>
    * [.clipboard](#module_main..CanvasApp+clipboard) : <code>Array</code>
    * [.nextGroupId](#module_main..CanvasApp+nextGroupId) : <code>number</code>
    * [.isDrawing](#module_main..CanvasApp+isDrawing) : <code>boolean</code>
    * [.isDragging](#module_main..CanvasApp+isDragging) : <code>boolean</code>
    * [.dragStart](#module_main..CanvasApp+dragStart) : <code>Object</code> \| <code>null</code>
    * [.tempObject](#module_main..CanvasApp+tempObject) : <code>Object</code> \| <code>null</code>
    * [.isResizing](#module_main..CanvasApp+isResizing) : <code>boolean</code>
    * [.isRotating](#module_main..CanvasApp+isRotating) : <code>boolean</code>
    * [.resizeHandle](#module_main..CanvasApp+resizeHandle) : <code>string</code> \| <code>null</code>
    * [.rotateCenter](#module_main..CanvasApp+rotateCenter) : <code>Object</code> \| <code>null</code>
    * [.initialBounds](#module_main..CanvasApp+initialBounds) : <code>Object</code> \| <code>null</code>
    * [.initialRotation](#module_main..CanvasApp+initialRotation) : <code>number</code>
    * [.isDraggingWaypoint](#module_main..CanvasApp+isDraggingWaypoint) : <code>boolean</code>
    * [.isDraggingControlPoint](#module_main..CanvasApp+isDraggingControlPoint) : <code>boolean</code>
    * [.waypointConnector](#module_main..CanvasApp+waypointConnector) : <code>Connector</code> \| <code>null</code>
    * [.waypointIndex](#module_main..CanvasApp+waypointIndex) : <code>number</code>
    * [.controlPointConnector](#module_main..CanvasApp+controlPointConnector) : <code>Connector</code> \| <code>null</code>
    * [.controlPointType](#module_main..CanvasApp+controlPointType) : <code>string</code> \| <code>null</code>
    * [.connectorStart](#module_main..CanvasApp+connectorStart) : <code>Object</code> \| <code>null</code>
    * [.isDrawingPolyline](#module_main..CanvasApp+isDrawingPolyline) : <code>boolean</code>
    * [.polylineWaypoints](#module_main..CanvasApp+polylineWaypoints) : <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.gridSize](#module_main..CanvasApp+gridSize) : <code>number</code>
    * [.showGrid](#module_main..CanvasApp+showGrid) : <code>boolean</code>
    * [.snapToGrid](#module_main..CanvasApp+snapToGrid) : <code>boolean</code>
    * [.showShadows](#module_main..CanvasApp+showShadows) : <code>boolean</code>
    * [.zoom](#module_main..CanvasApp+zoom) : <code>number</code>
    * [.panX](#module_main..CanvasApp+panX) : <code>number</code>
    * [.panY](#module_main..CanvasApp+panY) : <code>number</code>
    * [.isPanning](#module_main..CanvasApp+isPanning) : <code>boolean</code>
    * [.panStartX](#module_main..CanvasApp+panStartX) : <code>number</code>
    * [.panStartY](#module_main..CanvasApp+panStartY) : <code>number</code>
    * [.spacePressed](#module_main..CanvasApp+spacePressed) : <code>boolean</code>
    * [.history](#module_main..CanvasApp+history) : <code>Array</code>
    * [.historyIndex](#module_main..CanvasApp+historyIndex) : <code>number</code>
    * [.maxHistory](#module_main..CanvasApp+maxHistory) : <code>number</code>
    * [.contextMenu](#module_main..CanvasApp+contextMenu) : <code>ContextMenu</code>

<a name="new_module_main..CanvasApp_new"></a>

#### new CanvasApp()
Initializes the canvas application with default state and event listeners.Sets up the canvas, initializes all state properties, sets up event listeners,and begins rendering. Saves initial state for undo/redo history.

**Example**  
```js
const app = new CanvasApp();
```
<a name="module_main..CanvasApp+canvas"></a>

#### canvasApp.canvas : <code>HTMLCanvasElement</code>
Main canvas element

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+ctx"></a>

#### canvasApp.ctx : <code>CanvasRenderingContext2D</code>
Canvas 2D rendering context

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+objects"></a>

#### canvasApp.objects : <code>Array</code>
All objects on the canvas (shapes and connectors)

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+selectedObjects"></a>

#### canvasApp.selectedObjects : <code>Array</code>
Currently selected objects

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+currentTool"></a>

#### canvasApp.currentTool : <code>string</code>
Current tool mode (select, rectangle, circle, connector, etc.)

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+clipboard"></a>

#### canvasApp.clipboard : <code>Array</code>
Copied objects for paste operations

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+nextGroupId"></a>

#### canvasApp.nextGroupId : <code>number</code>
Next available group ID

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+isDrawing"></a>

#### canvasApp.isDrawing : <code>boolean</code>
Whether currently drawing a shape

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+isDragging"></a>

#### canvasApp.isDragging : <code>boolean</code>
Whether currently dragging objects

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+dragStart"></a>

#### canvasApp.dragStart : <code>Object</code> \| <code>null</code>
Starting position of drag

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+tempObject"></a>

#### canvasApp.tempObject : <code>Object</code> \| <code>null</code>
Temporary object being created

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+isResizing"></a>

#### canvasApp.isResizing : <code>boolean</code>
Whether currently resizing

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+isRotating"></a>

#### canvasApp.isRotating : <code>boolean</code>
Whether currently rotating

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+resizeHandle"></a>

#### canvasApp.resizeHandle : <code>string</code> \| <code>null</code>
Active resize handle (nw, n, ne, e, se, s, sw, w)

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+rotateCenter"></a>

#### canvasApp.rotateCenter : <code>Object</code> \| <code>null</code>
Center point for rotation

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+initialBounds"></a>

#### canvasApp.initialBounds : <code>Object</code> \| <code>null</code>
Initial bounds before transformation

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+initialRotation"></a>

#### canvasApp.initialRotation : <code>number</code>
Initial rotation angle

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+isDraggingWaypoint"></a>

#### canvasApp.isDraggingWaypoint : <code>boolean</code>
Whether dragging a polyline waypoint

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+isDraggingControlPoint"></a>

#### canvasApp.isDraggingControlPoint : <code>boolean</code>
Whether dragging a bezier control point

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+waypointConnector"></a>

#### canvasApp.waypointConnector : <code>Connector</code> \| <code>null</code>
Connector being edited for waypoint

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+waypointIndex"></a>

#### canvasApp.waypointIndex : <code>number</code>
Index of waypoint being dragged

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+controlPointConnector"></a>

#### canvasApp.controlPointConnector : <code>Connector</code> \| <code>null</code>
Connector being edited for control point

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+controlPointType"></a>

#### canvasApp.controlPointType : <code>string</code> \| <code>null</code>
Control point type being dragged (cp1 or cp2)

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+connectorStart"></a>

#### canvasApp.connectorStart : <code>Object</code> \| <code>null</code>
Starting object/anchor for connector being drawn

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+isDrawingPolyline"></a>

#### canvasApp.isDrawingPolyline : <code>boolean</code>
Whether currently drawing a polyline connector

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+polylineWaypoints"></a>

#### canvasApp.polylineWaypoints : <code>Array.&lt;{x: number, y: number}&gt;</code>
Waypoints for polyline being drawn

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+gridSize"></a>

#### canvasApp.gridSize : <code>number</code>
Grid size in pixels

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+showGrid"></a>

#### canvasApp.showGrid : <code>boolean</code>
Whether to show grid

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+snapToGrid"></a>

#### canvasApp.snapToGrid : <code>boolean</code>
Whether to snap objects to grid

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+showShadows"></a>

#### canvasApp.showShadows : <code>boolean</code>
Whether to render shadows

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+zoom"></a>

#### canvasApp.zoom : <code>number</code>
Current zoom level (1.0 = 100%)

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+panX"></a>

#### canvasApp.panX : <code>number</code>
Pan offset in x direction

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+panY"></a>

#### canvasApp.panY : <code>number</code>
Pan offset in y direction

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+isPanning"></a>

#### canvasApp.isPanning : <code>boolean</code>
Whether currently panning

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+panStartX"></a>

#### canvasApp.panStartX : <code>number</code>
Pan gesture start x coordinate

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+panStartY"></a>

#### canvasApp.panStartY : <code>number</code>
Pan gesture start y coordinate

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+spacePressed"></a>

#### canvasApp.spacePressed : <code>boolean</code>
Whether space key is pressed (for pan mode)

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+history"></a>

#### canvasApp.history : <code>Array</code>
Undo/redo history stack

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+historyIndex"></a>

#### canvasApp.historyIndex : <code>number</code>
Current position in history stack

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+maxHistory"></a>

#### canvasApp.maxHistory : <code>number</code>
Maximum history entries

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+contextMenu"></a>

#### canvasApp.contextMenu : <code>ContextMenu</code>
Context menu handler

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  

