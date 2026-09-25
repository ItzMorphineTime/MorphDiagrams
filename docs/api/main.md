# main

_Source: `js/main.js`_

<a name="module_main"></a>

## main
Browser entry point: the `CanvasApp` editor. Handles the canvas, mouse/keyboard input,
selection and transforms, inline editing, the tool palette / status bar, templates, file operations,
autosave and live sync with the MCP server. Diagram semantics (objects, ports, connections,
validation, layout, serialisation) live in the headless [module:core/Diagram](module:core/Diagram) model.

**See**

- module:core/Diagram
- module:ui/PropertiesPanel


* [main](#module_main)
    * [~CanvasApp](#module_main..CanvasApp)
        * [new CanvasApp()](#new_module_main..CanvasApp_new)
        * [.canvas](#module_main..CanvasApp+canvas) : <code>HTMLCanvasElement</code>
        * [.ctx](#module_main..CanvasApp+ctx) : <code>CanvasRenderingContext2D</code>
        * [.diagram](#module_main..CanvasApp+diagram) : <code>Diagram</code>
        * [.selectedObjects](#module_main..CanvasApp+selectedObjects) : <code>Array</code>
        * [.currentTool](#module_main..CanvasApp+currentTool) : <code>string</code>
        * [.clipboard](#module_main..CanvasApp+clipboard) : <code>Array</code>
        * [.defaultConnectorStyle](#module_main..CanvasApp+defaultConnectorStyle) : <code>string</code>
        * [.viewFilter](#module_main..CanvasApp+viewFilter) : <code>Object</code>
        * [.showPortLabels](#module_main..CanvasApp+showPortLabels) : <code>boolean</code>
        * [.liveSync](#module_main..CanvasApp+liveSync) : <code>LiveSync</code> \| <code>null</code>
        * [.objects](#module_main..CanvasApp+objects) ⇒ <code>Array</code>
        * [.nextGroupId](#module_main..CanvasApp+nextGroupId) ⇒ <code>number</code>
        * [.getMousePos(e, [options])](#module_main..CanvasApp+getMousePos) ⇒ <code>Object</code>
        * [.getMovingObjects()](#module_main..CanvasApp+getMovingObjects) ⇒ <code>Array</code>
        * [.applyConnectionType(conn, type)](#module_main..CanvasApp+applyConnectionType)
        * [.updateHover(pos)](#module_main..CanvasApp+updateHover)
        * [.selectInBox(box, [intersect])](#module_main..CanvasApp+selectInBox)
        * [.buildContextMenu(obj, pos, waypointHit)](#module_main..CanvasApp+buildContextMenu) ⇒ <code>Array</code>
        * [.pasteAt(at)](#module_main..CanvasApp+pasteAt)
        * [.revealObjects(ids)](#module_main..CanvasApp+revealObjects)
        * [.traceFrom(objs, direction)](#module_main..CanvasApp+traceFrom)
        * [.showMessage(textContent, [type])](#module_main..CanvasApp+showMessage)
        * [.drawPortLabels(ctx, obj, scale)](#module_main..CanvasApp+drawPortLabels)
        * [.findWaypointAtPoint(x, y, [anyConnector])](#module_main..CanvasApp+findWaypointAtPoint) ⇒ <code>Object</code> \| <code>null</code>
    * [~OBJECT_COLOR_KEYS](#module_main..OBJECT_COLOR_KEYS)

<a name="module_main..CanvasApp"></a>

### main~CanvasApp
**Kind**: inner class of [<code>main</code>](#module_main)  

* [~CanvasApp](#module_main..CanvasApp)
    * [new CanvasApp()](#new_module_main..CanvasApp_new)
    * [.canvas](#module_main..CanvasApp+canvas) : <code>HTMLCanvasElement</code>
    * [.ctx](#module_main..CanvasApp+ctx) : <code>CanvasRenderingContext2D</code>
    * [.diagram](#module_main..CanvasApp+diagram) : <code>Diagram</code>
    * [.selectedObjects](#module_main..CanvasApp+selectedObjects) : <code>Array</code>
    * [.currentTool](#module_main..CanvasApp+currentTool) : <code>string</code>
    * [.clipboard](#module_main..CanvasApp+clipboard) : <code>Array</code>
    * [.defaultConnectorStyle](#module_main..CanvasApp+defaultConnectorStyle) : <code>string</code>
    * [.viewFilter](#module_main..CanvasApp+viewFilter) : <code>Object</code>
    * [.showPortLabels](#module_main..CanvasApp+showPortLabels) : <code>boolean</code>
    * [.liveSync](#module_main..CanvasApp+liveSync) : <code>LiveSync</code> \| <code>null</code>
    * [.objects](#module_main..CanvasApp+objects) ⇒ <code>Array</code>
    * [.nextGroupId](#module_main..CanvasApp+nextGroupId) ⇒ <code>number</code>
    * [.getMousePos(e, [options])](#module_main..CanvasApp+getMousePos) ⇒ <code>Object</code>
    * [.getMovingObjects()](#module_main..CanvasApp+getMovingObjects) ⇒ <code>Array</code>
    * [.applyConnectionType(conn, type)](#module_main..CanvasApp+applyConnectionType)
    * [.updateHover(pos)](#module_main..CanvasApp+updateHover)
    * [.selectInBox(box, [intersect])](#module_main..CanvasApp+selectInBox)
    * [.buildContextMenu(obj, pos, waypointHit)](#module_main..CanvasApp+buildContextMenu) ⇒ <code>Array</code>
    * [.pasteAt(at)](#module_main..CanvasApp+pasteAt)
    * [.revealObjects(ids)](#module_main..CanvasApp+revealObjects)
    * [.traceFrom(objs, direction)](#module_main..CanvasApp+traceFrom)
    * [.showMessage(textContent, [type])](#module_main..CanvasApp+showMessage)
    * [.drawPortLabels(ctx, obj, scale)](#module_main..CanvasApp+drawPortLabels)
    * [.findWaypointAtPoint(x, y, [anyConnector])](#module_main..CanvasApp+findWaypointAtPoint) ⇒ <code>Object</code> \| <code>null</code>

<a name="new_module_main..CanvasApp_new"></a>

#### new CanvasApp()
Main application class that manages the canvas-based diagramming tool.

<a name="module_main..CanvasApp+canvas"></a>

#### canvasApp.canvas : <code>HTMLCanvasElement</code>
**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+ctx"></a>

#### canvasApp.ctx : <code>CanvasRenderingContext2D</code>
**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+diagram"></a>

#### canvasApp.diagram : <code>Diagram</code>
Headless document model (objects live in `diagram.objects`)

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+selectedObjects"></a>

#### canvasApp.selectedObjects : <code>Array</code>
Currently selected objects

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+currentTool"></a>

#### canvasApp.currentTool : <code>string</code>
Current tool

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+clipboard"></a>

#### canvasApp.clipboard : <code>Array</code>
Serialised objects for paste operations

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+defaultConnectorStyle"></a>

#### canvasApp.defaultConnectorStyle : <code>string</code>
Path style for new connectors

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+viewFilter"></a>

#### canvasApp.viewFilter : <code>Object</code>
View filter

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+showPortLabels"></a>

#### canvasApp.showPortLabels : <code>boolean</code>
Draw port names next to port dots on every device

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+liveSync"></a>

#### canvasApp.liveSync : <code>LiveSync</code> \| <code>null</code>
Live connection to the MCP server / bridge (when served by it)

**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+objects"></a>

#### canvasApp.objects ⇒ <code>Array</code>
**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
**Returns**: <code>Array</code> - All objects (shapes and connectors)  
<a name="module_main..CanvasApp+nextGroupId"></a>

#### canvasApp.nextGroupId ⇒ <code>number</code>
**Kind**: instance property of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+getMousePos"></a>

#### canvasApp.getMousePos(e, [options]) ⇒ <code>Object</code>
Mouse position in world coordinates. Snapping only applies to shape-drawing tools; the select and
connector tools need the exact position so that closely spaced ports can be picked.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| e | <code>MouseEvent</code> | 
| [options] | <code>Object</code> | 

<a name="module_main..CanvasApp+getMovingObjects"></a>

#### canvasApp.getMovingObjects() ⇒ <code>Array</code>
Objects that move with the current selection (selected shapes plus their group members).

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+applyConnectionType"></a>

#### canvasApp.applyConnectionType(conn, type)
Applies the colour/width convention for a typed connection.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| conn | <code>Connector</code> | 
| type | <code>string</code> \| <code>null</code> | 

<a name="module_main..CanvasApp+updateHover"></a>

#### canvasApp.updateHover(pos)
Hover feedback in select mode: cursor, hovered object outline and port tooltips.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| pos | <code>Object</code> | 

<a name="module_main..CanvasApp+selectInBox"></a>

#### canvasApp.selectInBox(box, [intersect])
Selects shapes inside (or, with `intersect`, touching) a marquee box.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type | Default |
| --- | --- | --- |
| box | <code>Object</code> |  | 
| [intersect] | <code>boolean</code> | <code>false</code> | 

<a name="module_main..CanvasApp+buildContextMenu"></a>

#### canvasApp.buildContextMenu(obj, pos, waypointHit) ⇒ <code>Array</code>
Builds the context menu for a target.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> \| <code>null</code> |  |
| pos | <code>Object</code> | World position of the click. |
| waypointHit | <code>Object</code> \| <code>null</code> |  |

<a name="module_main..CanvasApp+pasteAt"></a>

#### canvasApp.pasteAt(at)
Pastes the clipboard with fresh ids and group ids.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type | Description |
| --- | --- | --- |
| at | <code>Object</code> \| <code>null</code> | World position for the top-left of the pasted content (null = offset by 20px). |

<a name="module_main..CanvasApp+revealObjects"></a>

#### canvasApp.revealObjects(ids)
Selects objects by id and scrolls them into view.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| ids | <code>Array.&lt;string&gt;</code> | 

<a name="module_main..CanvasApp+traceFrom"></a>

#### canvasApp.traceFrom(objs, direction)
Highlights the signal path from the given shapes.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| objs | <code>Array</code> | 
| direction | <code>&quot;downstream&quot;</code> \| <code>&quot;upstream&quot;</code> \| <code>&quot;both&quot;</code> | 

<a name="module_main..CanvasApp+showMessage"></a>

#### canvasApp.showMessage(textContent, [type])
Legacy helper kept for modules that still call it.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type | Default |
| --- | --- | --- |
| textContent | <code>string</code> |  | 
| [type] | <code>&quot;info&quot;</code> \| <code>&quot;error&quot;</code> | <code>&#x27;info&#x27;</code> | 

<a name="module_main..CanvasApp+drawPortLabels"></a>

#### canvasApp.drawPortLabels(ctx, obj, scale)
Draws port names just inside the shape edge. Sides whose ports are packed too tightly for the text
are skipped (the hover tooltip still shows their names).

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> |  |
| obj | <code>Object</code> |  |
| scale | <code>number</code> | Size multiplier (1/zoom on screen). |

<a name="module_main..CanvasApp+findWaypointAtPoint"></a>

#### canvasApp.findWaypointAtPoint(x, y, [anyConnector]) ⇒ <code>Object</code> \| <code>null</code>
Finds a polyline waypoint under the cursor.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> |  |  |
| y | <code>number</code> |  |  |
| [anyConnector] | <code>boolean</code> | <code>false</code> | Search all connectors instead of only the selected ones. |

<a name="module_main..OBJECT_COLOR_KEYS"></a>

### main~OBJECT\_COLOR\_KEYS
Maps system object types to their key in [ObjectColors](ObjectColors).

**Kind**: inner constant of [<code>main</code>](#module_main)  

