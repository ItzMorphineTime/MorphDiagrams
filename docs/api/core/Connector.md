# Connector

_Source: `js/core/Connector.js`_

<a name="module_core/Connector"></a>

## core/Connector
Connector class for drawing lines between shapes on the canvas. Supports multiple connection styles (straight, orthogonal, bezier, polyline), line styles (solid, dashed, dotted), and connection types for typed network diagrams.

**Remarks**: - Connectors connect shapes via anchor points (top, right, bottom, left, center).- Connection types (video, sdi, network, usb) enable typed network diagrams.- Polyline connectors support intermediate waypoints for complex routing.- Bezier connectors support control points for curved paths.  
**See**

- module:core/BaseShape
- module:config/ConnectionTypes

**Example**  
```js
const connector = new Connector(startShape, 'right', endShape, 'left', 'video');connector.style = 'orthogonal';connector.draw(ctx);
```

* [core/Connector](#module_core/Connector)
    * [.Connector](#module_core/Connector.Connector)
        * [new exports.Connector(startObject, startAnchor, endObject, endAnchor, [connectionType])](#new_module_core/Connector.Connector_new)
        * [.id](#module_core/Connector.Connector+id) : <code>string</code>
        * [.type](#module_core/Connector.Connector+type) : <code>string</code>
        * [.startObject](#module_core/Connector.Connector+startObject) : <code>Object</code>
        * [.startAnchor](#module_core/Connector.Connector+startAnchor) : <code>string</code>
        * [.endObject](#module_core/Connector.Connector+endObject) : <code>Object</code>
        * [.endAnchor](#module_core/Connector.Connector+endAnchor) : <code>string</code>
        * [.stroke](#module_core/Connector.Connector+stroke) : <code>string</code>
        * [.strokeWidth](#module_core/Connector.Connector+strokeWidth) : <code>number</code>
        * [.arrowStart](#module_core/Connector.Connector+arrowStart) : <code>boolean</code>
        * [.arrowEnd](#module_core/Connector.Connector+arrowEnd) : <code>boolean</code>
        * [.style](#module_core/Connector.Connector+style) : <code>string</code>
        * [.lineStyle](#module_core/Connector.Connector+lineStyle) : <code>string</code>
        * [.zIndex](#module_core/Connector.Connector+zIndex) : <code>number</code>
        * [.visible](#module_core/Connector.Connector+visible) : <code>boolean</code>
        * [.selected](#module_core/Connector.Connector+selected) : <code>boolean</code>
        * [.connectionType](#module_core/Connector.Connector+connectionType) : <code>string</code> \| <code>null</code>
        * [.waypoints](#module_core/Connector.Connector+waypoints) : <code>Array.&lt;{x: number, y: number}&gt;</code>
        * [.controlPoint1](#module_core/Connector.Connector+controlPoint1) : <code>Object</code> \| <code>null</code>
        * [.controlPoint2](#module_core/Connector.Connector+controlPoint2) : <code>Object</code> \| <code>null</code>
        * [.generateId()](#module_core/Connector.Connector+generateId) ⇒ <code>string</code>
        * [.getStartPoint()](#module_core/Connector.Connector+getStartPoint) ⇒ <code>Object</code> \| <code>null</code>
        * [.getEndPoint()](#module_core/Connector.Connector+getEndPoint) ⇒ <code>Object</code> \| <code>null</code>
        * [.containsPoint(x, y, [threshold])](#module_core/Connector.Connector+containsPoint) ⇒ <code>boolean</code>
        * [.isNearLine(p1, p2, x, y, threshold)](#module_core/Connector.Connector+isNearLine) ⇒ <code>boolean</code>
        * [.isNearPolyline(x, y, threshold)](#module_core/Connector.Connector+isNearPolyline) ⇒ <code>boolean</code>
        * [.isNearOrthogonal(x, y, threshold)](#module_core/Connector.Connector+isNearOrthogonal) ⇒ <code>boolean</code>
        * [.isNearBezier(x, y, threshold)](#module_core/Connector.Connector+isNearBezier) ⇒ <code>boolean</code>
        * [.getBezierPoint(t)](#module_core/Connector.Connector+getBezierPoint) ⇒ <code>Object</code>
        * [.getDefaultControlPoint1()](#module_core/Connector.Connector+getDefaultControlPoint1) ⇒ <code>Object</code>
        * [.getDefaultControlPoint2()](#module_core/Connector.Connector+getDefaultControlPoint2) ⇒ <code>Object</code>
        * [.draw(ctx)](#module_core/Connector.Connector+draw)
        * [.toJSON()](#module_core/Connector.Connector+toJSON) ⇒ <code>Object</code>

<a name="module_core/Connector.Connector"></a>

### core/Connector.Connector
Connector class for drawing lines between shapes.

**Kind**: static class of [<code>core/Connector</code>](#module_core/Connector)  

* [.Connector](#module_core/Connector.Connector)
    * [new exports.Connector(startObject, startAnchor, endObject, endAnchor, [connectionType])](#new_module_core/Connector.Connector_new)
    * [.id](#module_core/Connector.Connector+id) : <code>string</code>
    * [.type](#module_core/Connector.Connector+type) : <code>string</code>
    * [.startObject](#module_core/Connector.Connector+startObject) : <code>Object</code>
    * [.startAnchor](#module_core/Connector.Connector+startAnchor) : <code>string</code>
    * [.endObject](#module_core/Connector.Connector+endObject) : <code>Object</code>
    * [.endAnchor](#module_core/Connector.Connector+endAnchor) : <code>string</code>
    * [.stroke](#module_core/Connector.Connector+stroke) : <code>string</code>
    * [.strokeWidth](#module_core/Connector.Connector+strokeWidth) : <code>number</code>
    * [.arrowStart](#module_core/Connector.Connector+arrowStart) : <code>boolean</code>
    * [.arrowEnd](#module_core/Connector.Connector+arrowEnd) : <code>boolean</code>
    * [.style](#module_core/Connector.Connector+style) : <code>string</code>
    * [.lineStyle](#module_core/Connector.Connector+lineStyle) : <code>string</code>
    * [.zIndex](#module_core/Connector.Connector+zIndex) : <code>number</code>
    * [.visible](#module_core/Connector.Connector+visible) : <code>boolean</code>
    * [.selected](#module_core/Connector.Connector+selected) : <code>boolean</code>
    * [.connectionType](#module_core/Connector.Connector+connectionType) : <code>string</code> \| <code>null</code>
    * [.waypoints](#module_core/Connector.Connector+waypoints) : <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.controlPoint1](#module_core/Connector.Connector+controlPoint1) : <code>Object</code> \| <code>null</code>
    * [.controlPoint2](#module_core/Connector.Connector+controlPoint2) : <code>Object</code> \| <code>null</code>
    * [.generateId()](#module_core/Connector.Connector+generateId) ⇒ <code>string</code>
    * [.getStartPoint()](#module_core/Connector.Connector+getStartPoint) ⇒ <code>Object</code> \| <code>null</code>
    * [.getEndPoint()](#module_core/Connector.Connector+getEndPoint) ⇒ <code>Object</code> \| <code>null</code>
    * [.containsPoint(x, y, [threshold])](#module_core/Connector.Connector+containsPoint) ⇒ <code>boolean</code>
    * [.isNearLine(p1, p2, x, y, threshold)](#module_core/Connector.Connector+isNearLine) ⇒ <code>boolean</code>
    * [.isNearPolyline(x, y, threshold)](#module_core/Connector.Connector+isNearPolyline) ⇒ <code>boolean</code>
    * [.isNearOrthogonal(x, y, threshold)](#module_core/Connector.Connector+isNearOrthogonal) ⇒ <code>boolean</code>
    * [.isNearBezier(x, y, threshold)](#module_core/Connector.Connector+isNearBezier) ⇒ <code>boolean</code>
    * [.getBezierPoint(t)](#module_core/Connector.Connector+getBezierPoint) ⇒ <code>Object</code>
    * [.getDefaultControlPoint1()](#module_core/Connector.Connector+getDefaultControlPoint1) ⇒ <code>Object</code>
    * [.getDefaultControlPoint2()](#module_core/Connector.Connector+getDefaultControlPoint2) ⇒ <code>Object</code>
    * [.draw(ctx)](#module_core/Connector.Connector+draw)
    * [.toJSON()](#module_core/Connector.Connector+toJSON) ⇒ <code>Object</code>

<a name="new_module_core/Connector.Connector_new"></a>

#### new exports.Connector(startObject, startAnchor, endObject, endAnchor, [connectionType])
Creates a new Connector instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startObject | <code>Object</code> |  | The shape object where the connector starts. |
| startAnchor | <code>string</code> |  | The anchor point key on the start object (e.g., 'top', 'right', 'bottom', 'left', 'center'). |
| endObject | <code>Object</code> |  | The shape object where the connector ends. |
| endAnchor | <code>string</code> |  | The anchor point key on the end object. |
| [connectionType] | <code>string</code> \| <code>null</code> | <code>null</code> | Type of connection: 'video', 'sdi', 'network', 'usb', or null for generic. |

**Example**  
```js
const connector = new Connector(serverShape, 'right', videoMatrixShape, 'left', 'video');
```
<a name="module_core/Connector.Connector+id"></a>

#### connector.id : <code>string</code>
Unique identifier for the connector

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+type"></a>

#### connector.type : <code>string</code>
Type identifier

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+startObject"></a>

#### connector.startObject : <code>Object</code>
Shape object where the connector starts

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+startAnchor"></a>

#### connector.startAnchor : <code>string</code>
Anchor point key on the start object

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+endObject"></a>

#### connector.endObject : <code>Object</code>
Shape object where the connector ends

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+endAnchor"></a>

#### connector.endAnchor : <code>string</code>
Anchor point key on the end object

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+stroke"></a>

#### connector.stroke : <code>string</code>
Stroke color in hex format

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+strokeWidth"></a>

#### connector.strokeWidth : <code>number</code>
Width of the line in pixels

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+arrowStart"></a>

#### connector.arrowStart : <code>boolean</code>
Whether to draw arrow at start point

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+arrowEnd"></a>

#### connector.arrowEnd : <code>boolean</code>
Whether to draw arrow at end point

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+style"></a>

#### connector.style : <code>string</code>
Connection style: 'straight', 'orthogonal', 'bezier', or 'polyline'

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+lineStyle"></a>

#### connector.lineStyle : <code>string</code>
Line dash style: 'solid', 'dashed', or 'dotted'

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+zIndex"></a>

#### connector.zIndex : <code>number</code>
Z-index for rendering order (connectors default to -1, below shapes)

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+visible"></a>

#### connector.visible : <code>boolean</code>
Whether the connector is visible

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+selected"></a>

#### connector.selected : <code>boolean</code>
Whether the connector is currently selected

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+connectionType"></a>

#### connector.connectionType : <code>string</code> \| <code>null</code>
Connection type for network objects (video, sdi, network, usb)

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+waypoints"></a>

#### connector.waypoints : <code>Array.&lt;{x: number, y: number}&gt;</code>
Intermediate points for polyline connectors

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+controlPoint1"></a>

#### connector.controlPoint1 : <code>Object</code> \| <code>null</code>
First control point for bezier connectors

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+controlPoint2"></a>

#### connector.controlPoint2 : <code>Object</code> \| <code>null</code>
Second control point for bezier connectors

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+generateId"></a>

#### connector.generateId() ⇒ <code>string</code>
Generates a unique identifier for the connector.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string.  
<a name="module_core/Connector.Connector+getStartPoint"></a>

#### connector.getStartPoint() ⇒ <code>Object</code> \| <code>null</code>
Gets the starting point of the connector from the start object's anchor points.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> \| <code>null</code> - Start point coordinates or null if no start object.  
**Example**  
```js
const start = connector.getStartPoint();if (start) console.log(`Connector starts at (${start.x}, ${start.y})`);
```
<a name="module_core/Connector.Connector+getEndPoint"></a>

#### connector.getEndPoint() ⇒ <code>Object</code> \| <code>null</code>
Gets the ending point of the connector from the end object's anchor points.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> \| <code>null</code> - End point coordinates or null if no end object.  
<a name="module_core/Connector.Connector+containsPoint"></a>

#### connector.containsPoint(x, y, [threshold]) ⇒ <code>boolean</code>
Checks if a point is near the connector line for hit detection.Delegates to specific methods based on connector style (straight, orthogonal, bezier, polyline).

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>boolean</code> - True if point is within threshold distance of the connector.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> |  | X-coordinate of the point to test. |
| y | <code>number</code> |  | Y-coordinate of the point to test. |
| [threshold] | <code>number</code> | <code>5</code> | Maximum distance in pixels to consider "near". |

**Example**  
```js
if (connector.containsPoint(100, 50, 10)) {  console.log('Mouse is near connector');}
```
<a name="module_core/Connector.Connector+isNearLine"></a>

#### connector.isNearLine(p1, p2, x, y, threshold) ⇒ <code>boolean</code>
Checks if a point is near a straight line segment using perpendicular distance.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>boolean</code> - True if point is within threshold distance of the line segment  

| Param | Type | Description |
| --- | --- | --- |
| p1 | <code>Object</code> | First endpoint of the line |
| p2 | <code>Object</code> | Second endpoint of the line |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |
| threshold | <code>number</code> | Maximum distance to consider "near" |

<a name="module_core/Connector.Connector+isNearPolyline"></a>

#### connector.isNearPolyline(x, y, threshold) ⇒ <code>boolean</code>
Checks if a point is near a polyline connector by testing each segment.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>boolean</code> - True if point is near any segment of the polyline  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |
| threshold | <code>number</code> | Maximum distance to consider "near" |

<a name="module_core/Connector.Connector+isNearOrthogonal"></a>

#### connector.isNearOrthogonal(x, y, threshold) ⇒ <code>boolean</code>
Checks if a point is near an orthogonal (right-angled) connector.Orthogonal connectors use 3 segments forming right angles.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>boolean</code> - True if point is near the orthogonal path  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |
| threshold | <code>number</code> | Maximum distance to consider "near" |

<a name="module_core/Connector.Connector+isNearBezier"></a>

#### connector.isNearBezier(x, y, threshold) ⇒ <code>boolean</code>
Checks if a point is near a bezier curve connector by sampling points along the curve.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>boolean</code> - True if point is near the bezier curve  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |
| threshold | <code>number</code> | Maximum distance to consider "near" |

<a name="module_core/Connector.Connector+getBezierPoint"></a>

#### connector.getBezierPoint(t) ⇒ <code>Object</code>
Calculates a point on the bezier curve at parameter t using cubic bezier formula.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> - Point coordinates on the bezier curve  

| Param | Type | Description |
| --- | --- | --- |
| t | <code>number</code> | Parameter value between 0 and 1 (0=start, 1=end) |

<a name="module_core/Connector.Connector+getDefaultControlPoint1"></a>

#### connector.getDefaultControlPoint1() ⇒ <code>Object</code>
Gets the default position for the first bezier control point.Positioned at 25% along the line with slight curve offset.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> - Default first control point coordinates  
<a name="module_core/Connector.Connector+getDefaultControlPoint2"></a>

#### connector.getDefaultControlPoint2() ⇒ <code>Object</code>
Gets the default position for the second bezier control point.Positioned at 75% along the line with slight curve offset.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> - Default second control point coordinates  
<a name="module_core/Connector.Connector+draw"></a>

#### connector.draw(ctx)
Draws the connector on the canvas.Applies appropriate styling, draws the connection line based on style (straight, orthogonal, bezier, polyline),and draws arrows and control points as needed.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |

**Example**  
```js
ctx.save();connector.draw(ctx);ctx.restore();
```
<a name="module_core/Connector.Connector+toJSON"></a>

#### connector.toJSON() ⇒ <code>Object</code>
Serializes the connector to a JSON-compatible object for saving.Stores object IDs instead of object references for proper serialization.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> - JSON representation of the connector with all properties.  
**Example**  
```js
const json = connector.toJSON();// json.startObject and json.endObject are now IDs instead of object references
```

