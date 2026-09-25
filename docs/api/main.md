# main

_Source: `js/main.js`_

<a name="module_main"></a>

## main
Browser entry point: the `CanvasApp` editor. Handles the canvas, mouse/keyboard input,
selection and transforms, the properties panel, templates, file operations and live sync with the
MCP server. All diagram semantics (objects, ports, connections, validation, layout, serialisation)
live in the headless [module:core/Diagram](module:core/Diagram) model so the editor, the MCP server and the tests
share one implementation.

**See**

- module:core/Diagram
- module:core/ShapeRegistry


* [main](#module_main)
    * [~CanvasApp](#module_main..CanvasApp)
        * [new CanvasApp()](#new_module_main..CanvasApp_new)
        * [.canvas](#module_main..CanvasApp+canvas) : <code>HTMLCanvasElement</code>
        * [.ctx](#module_main..CanvasApp+ctx) : <code>CanvasRenderingContext2D</code>
        * [.diagram](#module_main..CanvasApp+diagram) : <code>Diagram</code>
        * [.selectedObjects](#module_main..CanvasApp+selectedObjects) : <code>Array</code>
        * [.currentTool](#module_main..CanvasApp+currentTool) : <code>string</code>
        * [.clipboard](#module_main..CanvasApp+clipboard) : <code>Array</code>
        * [.showPortLabels](#module_main..CanvasApp+showPortLabels) : <code>boolean</code>
        * [.liveSync](#module_main..CanvasApp+liveSync) : <code>LiveSync</code> \| <code>null</code>
        * [.objects](#module_main..CanvasApp+objects) ⇒ <code>Array</code>
        * [.nextGroupId](#module_main..CanvasApp+nextGroupId) ⇒ <code>number</code>
        * [.getMousePos(e, [options])](#module_main..CanvasApp+getMousePos) ⇒ <code>Object</code>
        * [.applyConnectionType(conn, type)](#module_main..CanvasApp+applyConnectionType)
        * [.findCompatibleEndAnchor(pos)](#module_main..CanvasApp+findCompatibleEndAnchor) ⇒ <code>Object</code> \| <code>null</code>
        * [.finalizeConnector(conn)](#module_main..CanvasApp+finalizeConnector)
        * [.handleWheel(e)](#module_main..CanvasApp+handleWheel)
        * [.zoomAt(sx, sy, newZoom)](#module_main..CanvasApp+zoomAt)
        * [.findNearestAnchor(x, y, [threshold], [requiredConnectionType], [requiredPortType])](#module_main..CanvasApp+findNearestAnchor) ⇒ <code>Object</code> \| <code>null</code>
        * [.copy()](#module_main..CanvasApp+copy)
        * [.paste()](#module_main..CanvasApp+paste)
        * [.distribute(axis)](#module_main..CanvasApp+distribute)
        * [.zoomToFit()](#module_main..CanvasApp+zoomToFit)
        * [.buildDocument()](#module_main..CanvasApp+buildDocument) ⇒ <code>Object</code>
        * [.loadDocument(doc, [options])](#module_main..CanvasApp+loadDocument) ⇒ <code>Array.&lt;string&gt;</code>
        * [.renderScene(ctx, options)](#module_main..CanvasApp+renderScene)
        * [.showMessage(textContent, [type])](#module_main..CanvasApp+showMessage)
        * [.getUsedPortKeys()](#module_main..CanvasApp+getUsedPortKeys) ⇒ <code>Set.&lt;string&gt;</code>
        * [.drawPortDots(ctx, obj, used, scale, includeGeneric)](#module_main..CanvasApp+drawPortDots)
        * [.drawPortLabels(ctx, obj, scale)](#module_main..CanvasApp+drawPortLabels)
    * [~OBJECT_COLOR_KEYS](#module_main..OBJECT_COLOR_KEYS)
    * [~escapeHtml(value)](#module_main..escapeHtml) ⇒ <code>string</code>

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
    * [.showPortLabels](#module_main..CanvasApp+showPortLabels) : <code>boolean</code>
    * [.liveSync](#module_main..CanvasApp+liveSync) : <code>LiveSync</code> \| <code>null</code>
    * [.objects](#module_main..CanvasApp+objects) ⇒ <code>Array</code>
    * [.nextGroupId](#module_main..CanvasApp+nextGroupId) ⇒ <code>number</code>
    * [.getMousePos(e, [options])](#module_main..CanvasApp+getMousePos) ⇒ <code>Object</code>
    * [.applyConnectionType(conn, type)](#module_main..CanvasApp+applyConnectionType)
    * [.findCompatibleEndAnchor(pos)](#module_main..CanvasApp+findCompatibleEndAnchor) ⇒ <code>Object</code> \| <code>null</code>
    * [.finalizeConnector(conn)](#module_main..CanvasApp+finalizeConnector)
    * [.handleWheel(e)](#module_main..CanvasApp+handleWheel)
    * [.zoomAt(sx, sy, newZoom)](#module_main..CanvasApp+zoomAt)
    * [.findNearestAnchor(x, y, [threshold], [requiredConnectionType], [requiredPortType])](#module_main..CanvasApp+findNearestAnchor) ⇒ <code>Object</code> \| <code>null</code>
    * [.copy()](#module_main..CanvasApp+copy)
    * [.paste()](#module_main..CanvasApp+paste)
    * [.distribute(axis)](#module_main..CanvasApp+distribute)
    * [.zoomToFit()](#module_main..CanvasApp+zoomToFit)
    * [.buildDocument()](#module_main..CanvasApp+buildDocument) ⇒ <code>Object</code>
    * [.loadDocument(doc, [options])](#module_main..CanvasApp+loadDocument) ⇒ <code>Array.&lt;string&gt;</code>
    * [.renderScene(ctx, options)](#module_main..CanvasApp+renderScene)
    * [.showMessage(textContent, [type])](#module_main..CanvasApp+showMessage)
    * [.getUsedPortKeys()](#module_main..CanvasApp+getUsedPortKeys) ⇒ <code>Set.&lt;string&gt;</code>
    * [.drawPortDots(ctx, obj, used, scale, includeGeneric)](#module_main..CanvasApp+drawPortDots)
    * [.drawPortLabels(ctx, obj, scale)](#module_main..CanvasApp+drawPortLabels)

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

<a name="module_main..CanvasApp+applyConnectionType"></a>

#### canvasApp.applyConnectionType(conn, type)
Applies the colour/width convention for a typed connection.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| conn | <code>Connector</code> | 
| type | <code>string</code> \| <code>null</code> | 

<a name="module_main..CanvasApp+findCompatibleEndAnchor"></a>

#### canvasApp.findCompatibleEndAnchor(pos) ⇒ <code>Object</code> \| <code>null</code>
Finds the anchor under the cursor that may complete the connector being drawn.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| pos | <code>Object</code> | 

<a name="module_main..CanvasApp+finalizeConnector"></a>

#### canvasApp.finalizeConnector(conn)
Finalises a connector: adopts the typed end's connection type when the start was untyped.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| conn | <code>Connector</code> | 

<a name="module_main..CanvasApp+handleWheel"></a>

#### canvasApp.handleWheel(e)
Zooms around the cursor so the point under the mouse stays put.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| e | <code>WheelEvent</code> | 

<a name="module_main..CanvasApp+zoomAt"></a>

#### canvasApp.zoomAt(sx, sy, newZoom)
Sets the zoom keeping the screen point (sx, sy) fixed.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| sx | <code>number</code> | 
| sy | <code>number</code> | 
| newZoom | <code>number</code> | 

<a name="module_main..CanvasApp+findNearestAnchor"></a>

#### canvasApp.findNearestAnchor(x, y, [threshold], [requiredConnectionType], [requiredPortType]) ⇒ <code>Object</code> \| <code>null</code>
Finds the closest anchor to a world point within a screen-space threshold.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> |  |  |
| y | <code>number</code> |  |  |
| [threshold] | <code>number</code> | <code>15</code> | Threshold in screen pixels. |
| [requiredConnectionType] | <code>string</code> \| <code>null</code> | <code>null</code> |  |
| [requiredPortType] | <code>string</code> \| <code>null</code> | <code>null</code> |  |

<a name="module_main..CanvasApp+copy"></a>

#### canvasApp.copy()
Copies the selection plus every connector whose both ends are selected.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+paste"></a>

#### canvasApp.paste()
Pastes the clipboard with fresh ids and fresh group ids, offset by 20px.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+distribute"></a>

#### canvasApp.distribute(axis)
Distributes the selected shapes with equal gaps along an axis.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| axis | <code>&quot;horizontal&quot;</code> \| <code>&quot;vertical&quot;</code> | 

<a name="module_main..CanvasApp+zoomToFit"></a>

#### canvasApp.zoomToFit()
Fits the whole diagram into the viewport.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+buildDocument"></a>

#### canvasApp.buildDocument() ⇒ <code>Object</code>
Builds the JSON document for the current state.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+loadDocument"></a>

#### canvasApp.loadDocument(doc, [options]) ⇒ <code>Array.&lt;string&gt;</code>
Replaces the current content with a document.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  
**Returns**: <code>Array.&lt;string&gt;</code> - Loader warnings.  

| Param | Type |
| --- | --- |
| doc | <code>Object</code> \| <code>string</code> | 
| [options] | <code>Object</code> | 

<a name="module_main..CanvasApp+renderScene"></a>

#### canvasApp.renderScene(ctx, options)
Renders the diagram (without grid or selection chrome) into an arbitrary context.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 
| options | <code>Object</code> | 

<a name="module_main..CanvasApp+showMessage"></a>

#### canvasApp.showMessage(textContent, [type])
Shows a transient toast.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type | Default |
| --- | --- | --- |
| textContent | <code>string</code> |  | 
| [type] | <code>&quot;info&quot;</code> \| <code>&quot;error&quot;</code> | <code>&#x27;info&#x27;</code> | 

<a name="module_main..CanvasApp+getUsedPortKeys"></a>

#### canvasApp.getUsedPortKeys() ⇒ <code>Set.&lt;string&gt;</code>
Set of `<objectId>|<anchorKey>` strings for every connected port.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  
<a name="module_main..CanvasApp+drawPortDots"></a>

#### canvasApp.drawPortDots(ctx, obj, used, scale, includeGeneric)
Draws port dots: filled when connected, hollow when free, coloured by connection type.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> |  |
| obj | <code>Object</code> |  |
| used | <code>Set.&lt;string&gt;</code> |  |
| scale | <code>number</code> | Size multiplier (1/zoom on screen). |
| includeGeneric | <code>boolean</code> | Also draw the untyped side anchors of basic shapes. |

<a name="module_main..CanvasApp+drawPortLabels"></a>

#### canvasApp.drawPortLabels(ctx, obj, scale)
Draws port names just inside the shape edge next to each typed port.

**Kind**: instance method of [<code>CanvasApp</code>](#module_main..CanvasApp)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 
| obj | <code>Object</code> | 
| scale | <code>number</code> | 

<a name="module_main..OBJECT_COLOR_KEYS"></a>

### main~OBJECT\_COLOR\_KEYS
Maps system object types to their key in [ObjectColors](ObjectColors).

**Kind**: inner constant of [<code>main</code>](#module_main)  
<a name="module_main..escapeHtml"></a>

### main~escapeHtml(value) ⇒ <code>string</code>
Escapes text for safe interpolation into innerHTML.

**Kind**: inner method of [<code>main</code>](#module_main)  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 


