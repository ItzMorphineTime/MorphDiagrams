## Classes

<dl>
<dt><a href="#BaseShape">BaseShape</a></dt>
<dd></dd>
<dt><a href="#Connector">Connector</a></dt>
<dd></dd>
<dt><a href="#CanvasApp">CanvasApp</a></dt>
<dd></dd>
<dt><a href="#CanvasApp">CanvasApp</a></dt>
<dd></dd>
<dt><a href="#ConnectorAnchor">ConnectorAnchor</a> ⇐ <code><a href="#BaseShape">BaseShape</a></code></dt>
<dd></dd>
<dt><a href="#LEDProcessor">LEDProcessor</a> ⇐ <code><a href="#BaseShape">BaseShape</a></code></dt>
<dd></dd>
<dt><a href="#NetworkSwitch">NetworkSwitch</a> ⇐ <code><a href="#BaseShape">BaseShape</a></code></dt>
<dd></dd>
<dt><a href="#Server">Server</a> ⇐ <code><a href="#BaseShape">BaseShape</a></code></dt>
<dd></dd>
<dt><a href="#SyncGenerator">SyncGenerator</a> ⇐ <code><a href="#BaseShape">BaseShape</a></code></dt>
<dd></dd>
<dt><a href="#VideoMatrix">VideoMatrix</a> ⇐ <code><a href="#BaseShape">BaseShape</a></code></dt>
<dd></dd>
<dt><a href="#Templates">Templates</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#ConnectionTypes">ConnectionTypes</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Supported connection types for network diagram connectors.</p>
</dd>
<dt><a href="#ConnectionColors">ConnectionColors</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Default colors for each connection type.
Colors are used to visually distinguish different connection types on the canvas.</p>
</dd>
<dt><a href="#ObjectColors">ObjectColors</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Default fill colors for system object types.
Used to visually distinguish different device types on the canvas.</p>
</dd>
<dt><a href="#PortTypes">PortTypes</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Port direction types for defining input/output ports.</p>
</dd>
</dl>

<a name="BaseShape"></a>

## BaseShape
**Kind**: global class  

* [BaseShape](#BaseShape)
    * [new BaseShape()](#new_BaseShape_new)
    * _instance_
        * [.BaseShape](#BaseShape+BaseShape)
            * [new exports.BaseShape(x, y, width, height)](#new_BaseShape+BaseShape_new)
        * [.id](#BaseShape+id) : <code>string</code>
        * [.type](#BaseShape+type) : <code>string</code>
        * [.x](#BaseShape+x) : <code>number</code>
        * [.y](#BaseShape+y) : <code>number</code>
        * [.width](#BaseShape+width) : <code>number</code>
        * [.height](#BaseShape+height) : <code>number</code>
        * [.fill](#BaseShape+fill) : <code>string</code>
        * [.stroke](#BaseShape+stroke) : <code>string</code>
        * [.strokeWidth](#BaseShape+strokeWidth) : <code>number</code>
        * [.rotation](#BaseShape+rotation) : <code>number</code>
        * [.shadow](#BaseShape+shadow) : <code>boolean</code>
        * [.shadowBlur](#BaseShape+shadowBlur) : <code>number</code>
        * [.shadowColor](#BaseShape+shadowColor) : <code>string</code>
        * [.shadowOffsetX](#BaseShape+shadowOffsetX) : <code>number</code>
        * [.shadowOffsetY](#BaseShape+shadowOffsetY) : <code>number</code>
        * [.zIndex](#BaseShape+zIndex) : <code>number</code>
        * [.locked](#BaseShape+locked) : <code>boolean</code>
        * [.visible](#BaseShape+visible) : <code>boolean</code>
        * [.groupId](#BaseShape+groupId) : <code>string</code> \| <code>null</code>
        * [.generateId()](#BaseShape+generateId) ⇒ <code>string</code>
        * [.getBounds()](#BaseShape+getBounds) ⇒ <code>Object</code>
        * [.containsPoint(x, y)](#BaseShape+containsPoint) ⇒ <code>boolean</code>
        * [.rotatePoint(x, y)](#BaseShape+rotatePoint) ⇒ <code>Object</code>
        * [.getRotatedBounds()](#BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
        * [.getAnchorPoints()](#BaseShape+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number}&gt;</code>
        * [.move(dx, dy)](#BaseShape+move)
        * [.resize(width, height)](#BaseShape+resize)
        * [.applyRotation(ctx)](#BaseShape+applyRotation)
        * [.applyShadow(ctx)](#BaseShape+applyShadow)
        * [.clearShadow(ctx)](#BaseShape+clearShadow)
        * *[.draw(ctx)](#BaseShape+draw)*
        * [.clone()](#BaseShape+clone) ⇒ [<code>BaseShape</code>](#BaseShape)
        * [.toJSON()](#BaseShape+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.fromJSON(data)](#BaseShape.fromJSON) ⇒ [<code>BaseShape</code>](#BaseShape)

<a name="new_BaseShape_new"></a>

### new BaseShape()
Base class for all drawable shapes in the canvas.
Provides common properties and methods for shape management, rendering, and interaction.
All specific shape classes (Rectangle, Server, NetworkSwitch, etc.) extend this base class.

<a name="BaseShape+BaseShape"></a>

### baseShape.BaseShape
**Kind**: instance class of [<code>BaseShape</code>](#BaseShape)  
<a name="new_BaseShape+BaseShape_new"></a>

#### new exports.BaseShape(x, y, width, height)
Creates a new BaseShape instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-coordinate of the shape's top-left corner |
| y | <code>number</code> | The y-coordinate of the shape's top-left corner |
| width | <code>number</code> | The width of the shape in pixels |
| height | <code>number</code> | The height of the shape in pixels |

<a name="BaseShape+id"></a>

### baseShape.id : <code>string</code>
Unique identifier for the shape

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+type"></a>

### baseShape.type : <code>string</code>
Type identifier for the shape (overridden by subclasses)

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+x"></a>

### baseShape.x : <code>number</code>
X-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+y"></a>

### baseShape.y : <code>number</code>
Y-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+width"></a>

### baseShape.width : <code>number</code>
Width of the shape in pixels

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+height"></a>

### baseShape.height : <code>number</code>
Height of the shape in pixels

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+fill"></a>

### baseShape.fill : <code>string</code>
Fill color in hex format

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+stroke"></a>

### baseShape.stroke : <code>string</code>
Stroke color in hex format

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+strokeWidth"></a>

### baseShape.strokeWidth : <code>number</code>
Width of the stroke in pixels

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+rotation"></a>

### baseShape.rotation : <code>number</code>
Rotation angle in radians

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+shadow"></a>

### baseShape.shadow : <code>boolean</code>
Whether shadow rendering is enabled

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+shadowBlur"></a>

### baseShape.shadowBlur : <code>number</code>
Shadow blur radius in pixels

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+shadowColor"></a>

### baseShape.shadowColor : <code>string</code>
Shadow color in rgba format

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+shadowOffsetX"></a>

### baseShape.shadowOffsetX : <code>number</code>
Shadow horizontal offset in pixels

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+shadowOffsetY"></a>

### baseShape.shadowOffsetY : <code>number</code>
Shadow vertical offset in pixels

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+zIndex"></a>

### baseShape.zIndex : <code>number</code>
Z-index for rendering order (higher values render on top)

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+locked"></a>

### baseShape.locked : <code>boolean</code>
Whether the shape is locked from editing

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+visible"></a>

### baseShape.visible : <code>boolean</code>
Whether the shape is visible on canvas

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+groupId"></a>

### baseShape.groupId : <code>string</code> \| <code>null</code>
Group identifier for grouped shapes

**Kind**: instance property of [<code>BaseShape</code>](#BaseShape)  
<a name="BaseShape+generateId"></a>

### baseShape.generateId() ⇒ <code>string</code>
Generates a unique identifier for the shape.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string  
<a name="BaseShape+getBounds"></a>

### baseShape.getBounds() ⇒ <code>Object</code>
Gets the bounding box of the shape for hit detection.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  
**Returns**: <code>Object</code> - Bounding box coordinates and dimensions  
<a name="BaseShape+containsPoint"></a>

### baseShape.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the shape's bounds.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  
**Returns**: <code>boolean</code> - True if point is inside shape bounds  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |

<a name="BaseShape+rotatePoint"></a>

### baseShape.rotatePoint(x, y) ⇒ <code>Object</code>
Rotates a point around the shape's center based on the shape's rotation.
Uses standard 2D rotation matrix transformation.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  
**Returns**: <code>Object</code> - Rotated point coordinates  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to rotate |
| y | <code>number</code> | Y-coordinate of the point to rotate |

<a name="BaseShape+getRotatedBounds"></a>

### baseShape.getRotatedBounds() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Gets the four corners of the shape's bounding box after rotation is applied.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of four corner points  
<a name="BaseShape+getAnchorPoints"></a>

### baseShape.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number}&gt;</code>
Gets anchor points for connecting lines to this shape.
Returns points at top, right, bottom, left edges and center.
Anchor points are automatically rotated if the shape is rotated.
Subclasses override this to provide port-specific anchor points.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  
**Returns**: <code>Object.&lt;string, {x: number, y: number}&gt;</code> - Dictionary of anchor points keyed by position name  
<a name="BaseShape+move"></a>

### baseShape.move(dx, dy)
Moves the shape by a delta amount in x and y directions.
Movement is prevented if the shape is locked.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | Change in x position |
| dy | <code>number</code> | Change in y position |

<a name="BaseShape+resize"></a>

### baseShape.resize(width, height)
Resizes the shape to new dimensions.
Resizing is prevented if the shape is locked.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | New width in pixels |
| height | <code>number</code> | New height in pixels |

<a name="BaseShape+applyRotation"></a>

### baseShape.applyRotation(ctx)
Applies rotation transformation to the canvas context.
Rotates around the shape's center point.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+applyShadow"></a>

### baseShape.applyShadow(ctx)
Applies shadow effects to the canvas context if shadow is enabled.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clearShadow"></a>

### baseShape.clearShadow(ctx)
Clears shadow effects from the canvas context.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+draw"></a>

### *baseShape.draw(ctx)*
Draws the shape on the canvas. Must be overridden by subclasses.

**Kind**: instance abstract method of [<code>BaseShape</code>](#BaseShape)  
**Throws**:

- <code>Error</code> If not implemented by subclass


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clone"></a>

### baseShape.clone() ⇒ [<code>BaseShape</code>](#BaseShape)
Creates a deep copy of the shape with a new unique ID.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  
**Returns**: [<code>BaseShape</code>](#BaseShape) - Cloned shape instance  
<a name="BaseShape+toJSON"></a>

### baseShape.toJSON() ⇒ <code>Object</code>
Serializes the shape to a JSON-compatible object for saving.

**Kind**: instance method of [<code>BaseShape</code>](#BaseShape)  
**Returns**: <code>Object</code> - JSON representation of the shape  
<a name="BaseShape.fromJSON"></a>

### BaseShape.fromJSON(data) ⇒ [<code>BaseShape</code>](#BaseShape)
Restores a shape from a JSON object.

**Kind**: static method of [<code>BaseShape</code>](#BaseShape)  
**Returns**: [<code>BaseShape</code>](#BaseShape) - Restored shape instance  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | JSON data containing shape properties |

<a name="Connector"></a>

## Connector
**Kind**: global class  

* [Connector](#Connector)
    * [new Connector()](#new_Connector_new)
    * [.Connector](#Connector+Connector)
        * [new exports.Connector(startObject, startAnchor, endObject, endAnchor, connectionType)](#new_Connector+Connector_new)
    * [.id](#Connector+id) : <code>string</code>
    * [.type](#Connector+type) : <code>string</code>
    * [.startObject](#Connector+startObject) : <code>Object</code>
    * [.startAnchor](#Connector+startAnchor) : <code>string</code>
    * [.endObject](#Connector+endObject) : <code>Object</code>
    * [.endAnchor](#Connector+endAnchor) : <code>string</code>
    * [.stroke](#Connector+stroke) : <code>string</code>
    * [.strokeWidth](#Connector+strokeWidth) : <code>number</code>
    * [.arrowStart](#Connector+arrowStart) : <code>boolean</code>
    * [.arrowEnd](#Connector+arrowEnd) : <code>boolean</code>
    * [.style](#Connector+style) : <code>string</code>
    * [.lineStyle](#Connector+lineStyle) : <code>string</code>
    * [.zIndex](#Connector+zIndex) : <code>number</code>
    * [.visible](#Connector+visible) : <code>boolean</code>
    * [.selected](#Connector+selected) : <code>boolean</code>
    * [.connectionType](#Connector+connectionType) : <code>string</code> \| <code>null</code>
    * [.waypoints](#Connector+waypoints) : <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.controlPoint1](#Connector+controlPoint1) : <code>Object</code> \| <code>null</code>
    * [.controlPoint2](#Connector+controlPoint2) : <code>Object</code> \| <code>null</code>
    * [.generateId()](#Connector+generateId) ⇒ <code>string</code>
    * [.getStartPoint()](#Connector+getStartPoint) ⇒ <code>Object</code> \| <code>null</code>
    * [.getEndPoint()](#Connector+getEndPoint) ⇒ <code>Object</code> \| <code>null</code>
    * [.containsPoint(x, y, [threshold])](#Connector+containsPoint) ⇒ <code>boolean</code>
    * [.isNearLine(p1, p2, x, y, threshold)](#Connector+isNearLine) ⇒ <code>boolean</code>
    * [.isNearPolyline(x, y, threshold)](#Connector+isNearPolyline) ⇒ <code>boolean</code>
    * [.isNearOrthogonal(x, y, threshold)](#Connector+isNearOrthogonal) ⇒ <code>boolean</code>
    * [.isNearBezier(x, y, threshold)](#Connector+isNearBezier) ⇒ <code>boolean</code>
    * [.getBezierPoint(t)](#Connector+getBezierPoint) ⇒ <code>Object</code>
    * [.getDefaultControlPoint1()](#Connector+getDefaultControlPoint1) ⇒ <code>Object</code>
    * [.getDefaultControlPoint2()](#Connector+getDefaultControlPoint2) ⇒ <code>Object</code>
    * [.draw(ctx)](#Connector+draw)
    * [.toJSON()](#Connector+toJSON) ⇒ <code>Object</code>

<a name="new_Connector_new"></a>

### new Connector()
Connector class for drawing lines between shapes on the canvas.
Supports multiple connection styles (straight, orthogonal, bezier, polyline),
line styles (solid, dashed, dotted), and connection types for typed network diagrams.

<a name="Connector+Connector"></a>

### connector.Connector
**Kind**: instance class of [<code>Connector</code>](#Connector)  
<a name="new_Connector+Connector_new"></a>

#### new exports.Connector(startObject, startAnchor, endObject, endAnchor, connectionType)
Creates a new Connector instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startObject | <code>Object</code> |  | The shape object where the connector starts |
| startAnchor | <code>string</code> |  | The anchor point key on the start object |
| endObject | <code>Object</code> |  | The shape object where the connector ends |
| endAnchor | <code>string</code> |  | The anchor point key on the end object |
| connectionType | <code>string</code> \| <code>null</code> | <code>null</code> | Type of connection (video, sdi, network, usb) or null for generic |

<a name="Connector+id"></a>

### connector.id : <code>string</code>
Unique identifier for the connector

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+type"></a>

### connector.type : <code>string</code>
Type identifier

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+startObject"></a>

### connector.startObject : <code>Object</code>
Shape object where the connector starts

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+startAnchor"></a>

### connector.startAnchor : <code>string</code>
Anchor point key on the start object

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+endObject"></a>

### connector.endObject : <code>Object</code>
Shape object where the connector ends

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+endAnchor"></a>

### connector.endAnchor : <code>string</code>
Anchor point key on the end object

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+stroke"></a>

### connector.stroke : <code>string</code>
Stroke color in hex format

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+strokeWidth"></a>

### connector.strokeWidth : <code>number</code>
Width of the line in pixels

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+arrowStart"></a>

### connector.arrowStart : <code>boolean</code>
Whether to draw arrow at start point

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+arrowEnd"></a>

### connector.arrowEnd : <code>boolean</code>
Whether to draw arrow at end point

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+style"></a>

### connector.style : <code>string</code>
Connection style: 'straight', 'orthogonal', 'bezier', or 'polyline'

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+lineStyle"></a>

### connector.lineStyle : <code>string</code>
Line dash style: 'solid', 'dashed', or 'dotted'

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+zIndex"></a>

### connector.zIndex : <code>number</code>
Z-index for rendering order (connectors default to -1, below shapes)

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+visible"></a>

### connector.visible : <code>boolean</code>
Whether the connector is visible

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+selected"></a>

### connector.selected : <code>boolean</code>
Whether the connector is currently selected

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+connectionType"></a>

### connector.connectionType : <code>string</code> \| <code>null</code>
Connection type for network objects (video, sdi, network, usb)

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+waypoints"></a>

### connector.waypoints : <code>Array.&lt;{x: number, y: number}&gt;</code>
Intermediate points for polyline connectors

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+controlPoint1"></a>

### connector.controlPoint1 : <code>Object</code> \| <code>null</code>
First control point for bezier connectors

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+controlPoint2"></a>

### connector.controlPoint2 : <code>Object</code> \| <code>null</code>
Second control point for bezier connectors

**Kind**: instance property of [<code>Connector</code>](#Connector)  
<a name="Connector+generateId"></a>

### connector.generateId() ⇒ <code>string</code>
Generates a unique identifier for the connector.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string  
<a name="Connector+getStartPoint"></a>

### connector.getStartPoint() ⇒ <code>Object</code> \| <code>null</code>
Gets the starting point of the connector from the start object's anchor points.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>Object</code> \| <code>null</code> - Start point coordinates or null if no start object  
<a name="Connector+getEndPoint"></a>

### connector.getEndPoint() ⇒ <code>Object</code> \| <code>null</code>
Gets the ending point of the connector from the end object's anchor points.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>Object</code> \| <code>null</code> - End point coordinates or null if no end object  
<a name="Connector+containsPoint"></a>

### connector.containsPoint(x, y, [threshold]) ⇒ <code>boolean</code>
Checks if a point is near the connector line for hit detection.
Delegates to specific methods based on connector style.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>boolean</code> - True if point is within threshold distance of the connector  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> |  | X-coordinate of the point to test |
| y | <code>number</code> |  | Y-coordinate of the point to test |
| [threshold] | <code>number</code> | <code>5</code> | Maximum distance in pixels to consider "near" |

<a name="Connector+isNearLine"></a>

### connector.isNearLine(p1, p2, x, y, threshold) ⇒ <code>boolean</code>
Checks if a point is near a straight line segment using perpendicular distance.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>boolean</code> - True if point is within threshold distance of the line segment  

| Param | Type | Description |
| --- | --- | --- |
| p1 | <code>Object</code> | First endpoint of the line |
| p2 | <code>Object</code> | Second endpoint of the line |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |
| threshold | <code>number</code> | Maximum distance to consider "near" |

<a name="Connector+isNearPolyline"></a>

### connector.isNearPolyline(x, y, threshold) ⇒ <code>boolean</code>
Checks if a point is near a polyline connector by testing each segment.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>boolean</code> - True if point is near any segment of the polyline  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |
| threshold | <code>number</code> | Maximum distance to consider "near" |

<a name="Connector+isNearOrthogonal"></a>

### connector.isNearOrthogonal(x, y, threshold) ⇒ <code>boolean</code>
Checks if a point is near an orthogonal (right-angled) connector.
Orthogonal connectors use 3 segments forming right angles.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>boolean</code> - True if point is near the orthogonal path  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |
| threshold | <code>number</code> | Maximum distance to consider "near" |

<a name="Connector+isNearBezier"></a>

### connector.isNearBezier(x, y, threshold) ⇒ <code>boolean</code>
Checks if a point is near a bezier curve connector by sampling points along the curve.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>boolean</code> - True if point is near the bezier curve  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |
| threshold | <code>number</code> | Maximum distance to consider "near" |

<a name="Connector+getBezierPoint"></a>

### connector.getBezierPoint(t) ⇒ <code>Object</code>
Calculates a point on the bezier curve at parameter t using cubic bezier formula.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>Object</code> - Point coordinates on the bezier curve  

| Param | Type | Description |
| --- | --- | --- |
| t | <code>number</code> | Parameter value between 0 and 1 (0=start, 1=end) |

<a name="Connector+getDefaultControlPoint1"></a>

### connector.getDefaultControlPoint1() ⇒ <code>Object</code>
Gets the default position for the first bezier control point.
Positioned at 25% along the line with slight curve offset.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>Object</code> - Default first control point coordinates  
<a name="Connector+getDefaultControlPoint2"></a>

### connector.getDefaultControlPoint2() ⇒ <code>Object</code>
Gets the default position for the second bezier control point.
Positioned at 75% along the line with slight curve offset.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>Object</code> - Default second control point coordinates  
<a name="Connector+draw"></a>

### connector.draw(ctx)
Draws the connector on the canvas.
Applies appropriate styling, draws the connection line based on style,
and draws arrows and control points as needed.

**Kind**: instance method of [<code>Connector</code>](#Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="Connector+toJSON"></a>

### connector.toJSON() ⇒ <code>Object</code>
Serializes the connector to a JSON-compatible object for saving.
Stores object IDs instead of object references for proper serialization.

**Kind**: instance method of [<code>Connector</code>](#Connector)  
**Returns**: <code>Object</code> - JSON representation of the connector with all properties  
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
    * [.waypointConnector](#CanvasApp+waypointConnector) : [<code>Connector</code>](#Connector) \| <code>null</code>
    * [.waypointIndex](#CanvasApp+waypointIndex) : <code>number</code>
    * [.controlPointConnector](#CanvasApp+controlPointConnector) : [<code>Connector</code>](#Connector) \| <code>null</code>
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

### canvasApp.waypointConnector : [<code>Connector</code>](#Connector) \| <code>null</code>
Connector being edited for waypoint

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+waypointIndex"></a>

### canvasApp.waypointIndex : <code>number</code>
Index of waypoint being dragged

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+controlPointConnector"></a>

### canvasApp.controlPointConnector : [<code>Connector</code>](#Connector) \| <code>null</code>
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
    * [.waypointConnector](#CanvasApp+waypointConnector) : [<code>Connector</code>](#Connector) \| <code>null</code>
    * [.waypointIndex](#CanvasApp+waypointIndex) : <code>number</code>
    * [.controlPointConnector](#CanvasApp+controlPointConnector) : [<code>Connector</code>](#Connector) \| <code>null</code>
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

### canvasApp.waypointConnector : [<code>Connector</code>](#Connector) \| <code>null</code>
Connector being edited for waypoint

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+waypointIndex"></a>

### canvasApp.waypointIndex : <code>number</code>
Index of waypoint being dragged

**Kind**: instance property of [<code>CanvasApp</code>](#CanvasApp)  
<a name="CanvasApp+controlPointConnector"></a>

### canvasApp.controlPointConnector : [<code>Connector</code>](#Connector) \| <code>null</code>
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
<a name="ConnectorAnchor"></a>

## ConnectorAnchor ⇐ [<code>BaseShape</code>](#BaseShape)
**Kind**: global class  
**Extends**: [<code>BaseShape</code>](#BaseShape)  

* [ConnectorAnchor](#ConnectorAnchor) ⇐ [<code>BaseShape</code>](#BaseShape)
    * [new ConnectorAnchor()](#new_ConnectorAnchor_new)
    * [.ConnectorAnchor](#ConnectorAnchor+ConnectorAnchor)
        * [new exports.ConnectorAnchor(x, y)](#new_ConnectorAnchor+ConnectorAnchor_new)
    * [.BaseShape](#BaseShape+BaseShape)
        * [new exports.BaseShape(x, y, width, height)](#new_ConnectorAnchor+BaseShape_new)
    * [.type](#ConnectorAnchor+type) : <code>string</code>
    * [.fill](#ConnectorAnchor+fill) : <code>string</code>
    * [.stroke](#ConnectorAnchor+stroke) : <code>string</code>
    * [.strokeWidth](#ConnectorAnchor+strokeWidth) : <code>number</code>
    * [.resizable](#ConnectorAnchor+resizable) : <code>boolean</code>
    * [.connectionType](#ConnectorAnchor+connectionType) : <code>string</code> \| <code>null</code>
    * [.portType](#ConnectorAnchor+portType) : <code>string</code>
    * [.label](#ConnectorAnchor+label) : <code>string</code>
    * [.id](#BaseShape+id) : <code>string</code>
    * [.x](#BaseShape+x) : <code>number</code>
    * [.y](#BaseShape+y) : <code>number</code>
    * [.width](#BaseShape+width) : <code>number</code>
    * [.height](#BaseShape+height) : <code>number</code>
    * [.rotation](#BaseShape+rotation) : <code>number</code>
    * [.shadow](#BaseShape+shadow) : <code>boolean</code>
    * [.shadowBlur](#BaseShape+shadowBlur) : <code>number</code>
    * [.shadowColor](#BaseShape+shadowColor) : <code>string</code>
    * [.shadowOffsetX](#BaseShape+shadowOffsetX) : <code>number</code>
    * [.shadowOffsetY](#BaseShape+shadowOffsetY) : <code>number</code>
    * [.zIndex](#BaseShape+zIndex) : <code>number</code>
    * [.locked](#BaseShape+locked) : <code>boolean</code>
    * [.visible](#BaseShape+visible) : <code>boolean</code>
    * [.groupId](#BaseShape+groupId) : <code>string</code> \| <code>null</code>
    * [.getAnchorPoints()](#ConnectorAnchor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: null, portType: string}&gt;</code>
    * [.draw(ctx)](#ConnectorAnchor+draw)
    * [.toJSON()](#ConnectorAnchor+toJSON) ⇒ <code>Object</code>
    * [.generateId()](#BaseShape+generateId) ⇒ <code>string</code>
    * [.getBounds()](#BaseShape+getBounds) ⇒ <code>Object</code>
    * [.containsPoint(x, y)](#BaseShape+containsPoint) ⇒ <code>boolean</code>
    * [.rotatePoint(x, y)](#BaseShape+rotatePoint) ⇒ <code>Object</code>
    * [.getRotatedBounds()](#BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.move(dx, dy)](#BaseShape+move)
    * [.resize(width, height)](#BaseShape+resize)
    * [.applyRotation(ctx)](#BaseShape+applyRotation)
    * [.applyShadow(ctx)](#BaseShape+applyShadow)
    * [.clearShadow(ctx)](#BaseShape+clearShadow)
    * [.clone()](#BaseShape+clone) ⇒ [<code>BaseShape</code>](#BaseShape)

<a name="new_ConnectorAnchor_new"></a>

### new ConnectorAnchor()
ConnectorAnchor shape representing a universal connection point.
Acts as a waypoint or junction for connectors, allowing any connection type.
Renders as a small circle with an inner dot.

<a name="ConnectorAnchor+ConnectorAnchor"></a>

### connectorAnchor.ConnectorAnchor
**Kind**: instance class of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="new_ConnectorAnchor+ConnectorAnchor_new"></a>

#### new exports.ConnectorAnchor(x, y)
Creates a new ConnectorAnchor instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |

<a name="BaseShape+BaseShape"></a>

### connectorAnchor.BaseShape
**Kind**: instance class of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="new_ConnectorAnchor+BaseShape_new"></a>

#### new exports.BaseShape(x, y, width, height)
Creates a new BaseShape instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-coordinate of the shape's top-left corner |
| y | <code>number</code> | The y-coordinate of the shape's top-left corner |
| width | <code>number</code> | The width of the shape in pixels |
| height | <code>number</code> | The height of the shape in pixels |

<a name="ConnectorAnchor+type"></a>

### connectorAnchor.type : <code>string</code>
Shape type identifier

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Overrides**: [<code>type</code>](#BaseShape+type)  
<a name="ConnectorAnchor+fill"></a>

### connectorAnchor.fill : <code>string</code>
Fill color (white)

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Overrides**: [<code>fill</code>](#BaseShape+fill)  
<a name="ConnectorAnchor+stroke"></a>

### connectorAnchor.stroke : <code>string</code>
Stroke color

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Overrides**: [<code>stroke</code>](#BaseShape+stroke)  
<a name="ConnectorAnchor+strokeWidth"></a>

### connectorAnchor.strokeWidth : <code>number</code>
Stroke width

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Overrides**: [<code>strokeWidth</code>](#BaseShape+strokeWidth)  
<a name="ConnectorAnchor+resizable"></a>

### connectorAnchor.resizable : <code>boolean</code>
Shape cannot be resized

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+connectionType"></a>

### connectorAnchor.connectionType : <code>string</code> \| <code>null</code>
Connection type - null allows any connection type

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+portType"></a>

### connectorAnchor.portType : <code>string</code>
Port type - 'both' allows input and output connections

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+label"></a>

### connectorAnchor.label : <code>string</code>
Display label

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+id"></a>

### connectorAnchor.id : <code>string</code>
Unique identifier for the shape

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+x"></a>

### connectorAnchor.x : <code>number</code>
X-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+y"></a>

### connectorAnchor.y : <code>number</code>
Y-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+width"></a>

### connectorAnchor.width : <code>number</code>
Width of the shape in pixels

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+height"></a>

### connectorAnchor.height : <code>number</code>
Height of the shape in pixels

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+rotation"></a>

### connectorAnchor.rotation : <code>number</code>
Rotation angle in radians

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+shadow"></a>

### connectorAnchor.shadow : <code>boolean</code>
Whether shadow rendering is enabled

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+shadowBlur"></a>

### connectorAnchor.shadowBlur : <code>number</code>
Shadow blur radius in pixels

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+shadowColor"></a>

### connectorAnchor.shadowColor : <code>string</code>
Shadow color in rgba format

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+shadowOffsetX"></a>

### connectorAnchor.shadowOffsetX : <code>number</code>
Shadow horizontal offset in pixels

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+shadowOffsetY"></a>

### connectorAnchor.shadowOffsetY : <code>number</code>
Shadow vertical offset in pixels

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+zIndex"></a>

### connectorAnchor.zIndex : <code>number</code>
Z-index for rendering order (higher values render on top)

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+locked"></a>

### connectorAnchor.locked : <code>boolean</code>
Whether the shape is locked from editing

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+visible"></a>

### connectorAnchor.visible : <code>boolean</code>
Whether the shape is visible on canvas

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="BaseShape+groupId"></a>

### connectorAnchor.groupId : <code>string</code> \| <code>null</code>
Group identifier for grouped shapes

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+getAnchorPoints"></a>

### connectorAnchor.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: null, portType: string}&gt;</code>
Gets the anchor point at the center of the shape.
Returns a single universal anchor that accepts any connection type.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Overrides**: [<code>getAnchorPoints</code>](#BaseShape+getAnchorPoints)  
<a name="ConnectorAnchor+draw"></a>

### connectorAnchor.draw(ctx)
Draws the connector anchor as a circle with an inner dot.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Overrides**: [<code>draw</code>](#BaseShape+draw)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="ConnectorAnchor+toJSON"></a>

### connectorAnchor.toJSON() ⇒ <code>Object</code>
Serializes the connector anchor to JSON, including connection properties.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Overrides**: [<code>toJSON</code>](#BaseShape+toJSON)  
**Returns**: <code>Object</code> - JSON representation with connectionType, portType, and label  
<a name="BaseShape+generateId"></a>

### connectorAnchor.generateId() ⇒ <code>string</code>
Generates a unique identifier for the shape.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string  
<a name="BaseShape+getBounds"></a>

### connectorAnchor.getBounds() ⇒ <code>Object</code>
Gets the bounding box of the shape for hit detection.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Returns**: <code>Object</code> - Bounding box coordinates and dimensions  
<a name="BaseShape+containsPoint"></a>

### connectorAnchor.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the shape's bounds.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Returns**: <code>boolean</code> - True if point is inside shape bounds  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |

<a name="BaseShape+rotatePoint"></a>

### connectorAnchor.rotatePoint(x, y) ⇒ <code>Object</code>
Rotates a point around the shape's center based on the shape's rotation.
Uses standard 2D rotation matrix transformation.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Returns**: <code>Object</code> - Rotated point coordinates  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to rotate |
| y | <code>number</code> | Y-coordinate of the point to rotate |

<a name="BaseShape+getRotatedBounds"></a>

### connectorAnchor.getRotatedBounds() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Gets the four corners of the shape's bounding box after rotation is applied.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of four corner points  
<a name="BaseShape+move"></a>

### connectorAnchor.move(dx, dy)
Moves the shape by a delta amount in x and y directions.
Movement is prevented if the shape is locked.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | Change in x position |
| dy | <code>number</code> | Change in y position |

<a name="BaseShape+resize"></a>

### connectorAnchor.resize(width, height)
Resizes the shape to new dimensions.
Resizing is prevented if the shape is locked.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | New width in pixels |
| height | <code>number</code> | New height in pixels |

<a name="BaseShape+applyRotation"></a>

### connectorAnchor.applyRotation(ctx)
Applies rotation transformation to the canvas context.
Rotates around the shape's center point.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+applyShadow"></a>

### connectorAnchor.applyShadow(ctx)
Applies shadow effects to the canvas context if shadow is enabled.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clearShadow"></a>

### connectorAnchor.clearShadow(ctx)
Clears shadow effects from the canvas context.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clone"></a>

### connectorAnchor.clone() ⇒ [<code>BaseShape</code>](#BaseShape)
Creates a deep copy of the shape with a new unique ID.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Returns**: [<code>BaseShape</code>](#BaseShape) - Cloned shape instance  
<a name="LEDProcessor"></a>

## LEDProcessor ⇐ [<code>BaseShape</code>](#BaseShape)
**Kind**: global class  
**Extends**: [<code>BaseShape</code>](#BaseShape)  

* [LEDProcessor](#LEDProcessor) ⇐ [<code>BaseShape</code>](#BaseShape)
    * [new LEDProcessor()](#new_LEDProcessor_new)
    * [.LEDProcessor](#LEDProcessor+LEDProcessor)
        * [new exports.LEDProcessor(x, y, width, height)](#new_LEDProcessor+LEDProcessor_new)
    * [.BaseShape](#BaseShape+BaseShape)
        * [new exports.BaseShape(x, y, width, height)](#new_LEDProcessor+BaseShape_new)
    * [.ports](#LEDProcessor+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.id](#BaseShape+id) : <code>string</code>
    * [.type](#BaseShape+type) : <code>string</code>
    * [.x](#BaseShape+x) : <code>number</code>
    * [.y](#BaseShape+y) : <code>number</code>
    * [.width](#BaseShape+width) : <code>number</code>
    * [.height](#BaseShape+height) : <code>number</code>
    * [.fill](#BaseShape+fill) : <code>string</code>
    * [.stroke](#BaseShape+stroke) : <code>string</code>
    * [.strokeWidth](#BaseShape+strokeWidth) : <code>number</code>
    * [.rotation](#BaseShape+rotation) : <code>number</code>
    * [.shadow](#BaseShape+shadow) : <code>boolean</code>
    * [.shadowBlur](#BaseShape+shadowBlur) : <code>number</code>
    * [.shadowColor](#BaseShape+shadowColor) : <code>string</code>
    * [.shadowOffsetX](#BaseShape+shadowOffsetX) : <code>number</code>
    * [.shadowOffsetY](#BaseShape+shadowOffsetY) : <code>number</code>
    * [.zIndex](#BaseShape+zIndex) : <code>number</code>
    * [.locked](#BaseShape+locked) : <code>boolean</code>
    * [.visible](#BaseShape+visible) : <code>boolean</code>
    * [.groupId](#BaseShape+groupId) : <code>string</code> \| <code>null</code>
    * [.getAnchorPoints()](#LEDProcessor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
    * [.generateId()](#BaseShape+generateId) ⇒ <code>string</code>
    * [.getBounds()](#BaseShape+getBounds) ⇒ <code>Object</code>
    * [.containsPoint(x, y)](#BaseShape+containsPoint) ⇒ <code>boolean</code>
    * [.rotatePoint(x, y)](#BaseShape+rotatePoint) ⇒ <code>Object</code>
    * [.getRotatedBounds()](#BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.move(dx, dy)](#BaseShape+move)
    * [.resize(width, height)](#BaseShape+resize)
    * [.applyRotation(ctx)](#BaseShape+applyRotation)
    * [.applyShadow(ctx)](#BaseShape+applyShadow)
    * [.clearShadow(ctx)](#BaseShape+clearShadow)
    * *[.draw(ctx)](#BaseShape+draw)*
    * [.clone()](#BaseShape+clone) ⇒ [<code>BaseShape</code>](#BaseShape)
    * [.toJSON()](#BaseShape+toJSON) ⇒ <code>Object</code>

<a name="new_LEDProcessor_new"></a>

### new LEDProcessor()
LEDProcessor shape representing an LED video processing device.
Handles video and SDI inputs for LED wall output.
Renders as a capsule (rounded rectangle) shape.

<a name="LEDProcessor+LEDProcessor"></a>

### ledProcessor.LEDProcessor
**Kind**: instance class of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="new_LEDProcessor+LEDProcessor_new"></a>

#### new exports.LEDProcessor(x, y, width, height)
Creates a new LEDProcessor instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="BaseShape+BaseShape"></a>

### ledProcessor.BaseShape
**Kind**: instance class of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="new_LEDProcessor+BaseShape_new"></a>

#### new exports.BaseShape(x, y, width, height)
Creates a new BaseShape instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-coordinate of the shape's top-left corner |
| y | <code>number</code> | The y-coordinate of the shape's top-left corner |
| width | <code>number</code> | The width of the shape in pixels |
| height | <code>number</code> | The height of the shape in pixels |

<a name="LEDProcessor+ports"></a>

### ledProcessor.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+id"></a>

### ledProcessor.id : <code>string</code>
Unique identifier for the shape

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+type"></a>

### ledProcessor.type : <code>string</code>
Type identifier for the shape (overridden by subclasses)

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
**Overrides**: [<code>type</code>](#BaseShape+type)  
<a name="BaseShape+x"></a>

### ledProcessor.x : <code>number</code>
X-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+y"></a>

### ledProcessor.y : <code>number</code>
Y-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+width"></a>

### ledProcessor.width : <code>number</code>
Width of the shape in pixels

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+height"></a>

### ledProcessor.height : <code>number</code>
Height of the shape in pixels

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+fill"></a>

### ledProcessor.fill : <code>string</code>
Fill color in hex format

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
**Overrides**: [<code>fill</code>](#BaseShape+fill)  
<a name="BaseShape+stroke"></a>

### ledProcessor.stroke : <code>string</code>
Stroke color in hex format

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+strokeWidth"></a>

### ledProcessor.strokeWidth : <code>number</code>
Width of the stroke in pixels

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+rotation"></a>

### ledProcessor.rotation : <code>number</code>
Rotation angle in radians

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+shadow"></a>

### ledProcessor.shadow : <code>boolean</code>
Whether shadow rendering is enabled

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+shadowBlur"></a>

### ledProcessor.shadowBlur : <code>number</code>
Shadow blur radius in pixels

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+shadowColor"></a>

### ledProcessor.shadowColor : <code>string</code>
Shadow color in rgba format

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+shadowOffsetX"></a>

### ledProcessor.shadowOffsetX : <code>number</code>
Shadow horizontal offset in pixels

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+shadowOffsetY"></a>

### ledProcessor.shadowOffsetY : <code>number</code>
Shadow vertical offset in pixels

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+zIndex"></a>

### ledProcessor.zIndex : <code>number</code>
Z-index for rendering order (higher values render on top)

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+locked"></a>

### ledProcessor.locked : <code>boolean</code>
Whether the shape is locked from editing

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+visible"></a>

### ledProcessor.visible : <code>boolean</code>
Whether the shape is visible on canvas

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="BaseShape+groupId"></a>

### ledProcessor.groupId : <code>string</code> \| <code>null</code>
Group identifier for grouped shapes

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="LEDProcessor+getAnchorPoints"></a>

### ledProcessor.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  
**Overrides**: [<code>getAnchorPoints</code>](#BaseShape+getAnchorPoints)  
<a name="BaseShape+generateId"></a>

### ledProcessor.generateId() ⇒ <code>string</code>
Generates a unique identifier for the shape.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string  
<a name="BaseShape+getBounds"></a>

### ledProcessor.getBounds() ⇒ <code>Object</code>
Gets the bounding box of the shape for hit detection.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  
**Returns**: <code>Object</code> - Bounding box coordinates and dimensions  
<a name="BaseShape+containsPoint"></a>

### ledProcessor.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the shape's bounds.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  
**Returns**: <code>boolean</code> - True if point is inside shape bounds  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |

<a name="BaseShape+rotatePoint"></a>

### ledProcessor.rotatePoint(x, y) ⇒ <code>Object</code>
Rotates a point around the shape's center based on the shape's rotation.
Uses standard 2D rotation matrix transformation.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  
**Returns**: <code>Object</code> - Rotated point coordinates  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to rotate |
| y | <code>number</code> | Y-coordinate of the point to rotate |

<a name="BaseShape+getRotatedBounds"></a>

### ledProcessor.getRotatedBounds() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Gets the four corners of the shape's bounding box after rotation is applied.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of four corner points  
<a name="BaseShape+move"></a>

### ledProcessor.move(dx, dy)
Moves the shape by a delta amount in x and y directions.
Movement is prevented if the shape is locked.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | Change in x position |
| dy | <code>number</code> | Change in y position |

<a name="BaseShape+resize"></a>

### ledProcessor.resize(width, height)
Resizes the shape to new dimensions.
Resizing is prevented if the shape is locked.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | New width in pixels |
| height | <code>number</code> | New height in pixels |

<a name="BaseShape+applyRotation"></a>

### ledProcessor.applyRotation(ctx)
Applies rotation transformation to the canvas context.
Rotates around the shape's center point.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+applyShadow"></a>

### ledProcessor.applyShadow(ctx)
Applies shadow effects to the canvas context if shadow is enabled.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clearShadow"></a>

### ledProcessor.clearShadow(ctx)
Clears shadow effects from the canvas context.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+draw"></a>

### *ledProcessor.draw(ctx)*
Draws the shape on the canvas. Must be overridden by subclasses.

**Kind**: instance abstract method of [<code>LEDProcessor</code>](#LEDProcessor)  
**Overrides**: [<code>draw</code>](#BaseShape+draw)  
**Throws**:

- <code>Error</code> If not implemented by subclass


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clone"></a>

### ledProcessor.clone() ⇒ [<code>BaseShape</code>](#BaseShape)
Creates a deep copy of the shape with a new unique ID.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  
**Returns**: [<code>BaseShape</code>](#BaseShape) - Cloned shape instance  
<a name="BaseShape+toJSON"></a>

### ledProcessor.toJSON() ⇒ <code>Object</code>
Serializes the shape to a JSON-compatible object for saving.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  
**Overrides**: [<code>toJSON</code>](#BaseShape+toJSON)  
**Returns**: <code>Object</code> - JSON representation of the shape  
<a name="NetworkSwitch"></a>

## NetworkSwitch ⇐ [<code>BaseShape</code>](#BaseShape)
**Kind**: global class  
**Extends**: [<code>BaseShape</code>](#BaseShape)  

* [NetworkSwitch](#NetworkSwitch) ⇐ [<code>BaseShape</code>](#BaseShape)
    * [new NetworkSwitch()](#new_NetworkSwitch_new)
    * [.NetworkSwitch](#NetworkSwitch+NetworkSwitch)
        * [new exports.NetworkSwitch(x, y, width, height)](#new_NetworkSwitch+NetworkSwitch_new)
    * [.BaseShape](#BaseShape+BaseShape)
        * [new exports.BaseShape(x, y, width, height)](#new_NetworkSwitch+BaseShape_new)
    * [.ports](#NetworkSwitch+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.id](#BaseShape+id) : <code>string</code>
    * [.type](#BaseShape+type) : <code>string</code>
    * [.x](#BaseShape+x) : <code>number</code>
    * [.y](#BaseShape+y) : <code>number</code>
    * [.width](#BaseShape+width) : <code>number</code>
    * [.height](#BaseShape+height) : <code>number</code>
    * [.fill](#BaseShape+fill) : <code>string</code>
    * [.stroke](#BaseShape+stroke) : <code>string</code>
    * [.strokeWidth](#BaseShape+strokeWidth) : <code>number</code>
    * [.rotation](#BaseShape+rotation) : <code>number</code>
    * [.shadow](#BaseShape+shadow) : <code>boolean</code>
    * [.shadowBlur](#BaseShape+shadowBlur) : <code>number</code>
    * [.shadowColor](#BaseShape+shadowColor) : <code>string</code>
    * [.shadowOffsetX](#BaseShape+shadowOffsetX) : <code>number</code>
    * [.shadowOffsetY](#BaseShape+shadowOffsetY) : <code>number</code>
    * [.zIndex](#BaseShape+zIndex) : <code>number</code>
    * [.locked](#BaseShape+locked) : <code>boolean</code>
    * [.visible](#BaseShape+visible) : <code>boolean</code>
    * [.groupId](#BaseShape+groupId) : <code>string</code> \| <code>null</code>
    * [.getPoints()](#NetworkSwitch+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.generateId()](#BaseShape+generateId) ⇒ <code>string</code>
    * [.getBounds()](#BaseShape+getBounds) ⇒ <code>Object</code>
    * [.containsPoint(x, y)](#BaseShape+containsPoint) ⇒ <code>boolean</code>
    * [.rotatePoint(x, y)](#BaseShape+rotatePoint) ⇒ <code>Object</code>
    * [.getRotatedBounds()](#BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.getAnchorPoints()](#BaseShape+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number}&gt;</code>
    * [.move(dx, dy)](#BaseShape+move)
    * [.resize(width, height)](#BaseShape+resize)
    * [.applyRotation(ctx)](#BaseShape+applyRotation)
    * [.applyShadow(ctx)](#BaseShape+applyShadow)
    * [.clearShadow(ctx)](#BaseShape+clearShadow)
    * *[.draw(ctx)](#BaseShape+draw)*
    * [.clone()](#BaseShape+clone) ⇒ [<code>BaseShape</code>](#BaseShape)
    * [.toJSON()](#BaseShape+toJSON) ⇒ <code>Object</code>

<a name="new_NetworkSwitch_new"></a>

### new NetworkSwitch()
NetworkSwitch shape representing a network switching device.
Supports bidirectional network connections.
Renders as a hexagon with an 'N' letter drawn in the center.

<a name="NetworkSwitch+NetworkSwitch"></a>

### networkSwitch.NetworkSwitch
**Kind**: instance class of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="new_NetworkSwitch+NetworkSwitch_new"></a>

#### new exports.NetworkSwitch(x, y, width, height)
Creates a new NetworkSwitch instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="BaseShape+BaseShape"></a>

### networkSwitch.BaseShape
**Kind**: instance class of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="new_NetworkSwitch+BaseShape_new"></a>

#### new exports.BaseShape(x, y, width, height)
Creates a new BaseShape instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-coordinate of the shape's top-left corner |
| y | <code>number</code> | The y-coordinate of the shape's top-left corner |
| width | <code>number</code> | The width of the shape in pixels |
| height | <code>number</code> | The height of the shape in pixels |

<a name="NetworkSwitch+ports"></a>

### networkSwitch.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+id"></a>

### networkSwitch.id : <code>string</code>
Unique identifier for the shape

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+type"></a>

### networkSwitch.type : <code>string</code>
Type identifier for the shape (overridden by subclasses)

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Overrides**: [<code>type</code>](#BaseShape+type)  
<a name="BaseShape+x"></a>

### networkSwitch.x : <code>number</code>
X-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+y"></a>

### networkSwitch.y : <code>number</code>
Y-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+width"></a>

### networkSwitch.width : <code>number</code>
Width of the shape in pixels

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+height"></a>

### networkSwitch.height : <code>number</code>
Height of the shape in pixels

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+fill"></a>

### networkSwitch.fill : <code>string</code>
Fill color in hex format

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Overrides**: [<code>fill</code>](#BaseShape+fill)  
<a name="BaseShape+stroke"></a>

### networkSwitch.stroke : <code>string</code>
Stroke color in hex format

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+strokeWidth"></a>

### networkSwitch.strokeWidth : <code>number</code>
Width of the stroke in pixels

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+rotation"></a>

### networkSwitch.rotation : <code>number</code>
Rotation angle in radians

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+shadow"></a>

### networkSwitch.shadow : <code>boolean</code>
Whether shadow rendering is enabled

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+shadowBlur"></a>

### networkSwitch.shadowBlur : <code>number</code>
Shadow blur radius in pixels

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+shadowColor"></a>

### networkSwitch.shadowColor : <code>string</code>
Shadow color in rgba format

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+shadowOffsetX"></a>

### networkSwitch.shadowOffsetX : <code>number</code>
Shadow horizontal offset in pixels

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+shadowOffsetY"></a>

### networkSwitch.shadowOffsetY : <code>number</code>
Shadow vertical offset in pixels

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+zIndex"></a>

### networkSwitch.zIndex : <code>number</code>
Z-index for rendering order (higher values render on top)

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+locked"></a>

### networkSwitch.locked : <code>boolean</code>
Whether the shape is locked from editing

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+visible"></a>

### networkSwitch.visible : <code>boolean</code>
Whether the shape is visible on canvas

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="BaseShape+groupId"></a>

### networkSwitch.groupId : <code>string</code> \| <code>null</code>
Group identifier for grouped shapes

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="NetworkSwitch+getPoints"></a>

### networkSwitch.getPoints() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Calculates the hexagon vertex points based on position and size.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of 6 hexagon vertices  
<a name="BaseShape+generateId"></a>

### networkSwitch.generateId() ⇒ <code>string</code>
Generates a unique identifier for the shape.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string  
<a name="BaseShape+getBounds"></a>

### networkSwitch.getBounds() ⇒ <code>Object</code>
Gets the bounding box of the shape for hit detection.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Returns**: <code>Object</code> - Bounding box coordinates and dimensions  
<a name="BaseShape+containsPoint"></a>

### networkSwitch.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the shape's bounds.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Returns**: <code>boolean</code> - True if point is inside shape bounds  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |

<a name="BaseShape+rotatePoint"></a>

### networkSwitch.rotatePoint(x, y) ⇒ <code>Object</code>
Rotates a point around the shape's center based on the shape's rotation.
Uses standard 2D rotation matrix transformation.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Returns**: <code>Object</code> - Rotated point coordinates  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to rotate |
| y | <code>number</code> | Y-coordinate of the point to rotate |

<a name="BaseShape+getRotatedBounds"></a>

### networkSwitch.getRotatedBounds() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Gets the four corners of the shape's bounding box after rotation is applied.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of four corner points  
<a name="BaseShape+getAnchorPoints"></a>

### networkSwitch.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number}&gt;</code>
Gets anchor points for connecting lines to this shape.
Returns points at top, right, bottom, left edges and center.
Anchor points are automatically rotated if the shape is rotated.
Subclasses override this to provide port-specific anchor points.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Overrides**: [<code>getAnchorPoints</code>](#BaseShape+getAnchorPoints)  
**Returns**: <code>Object.&lt;string, {x: number, y: number}&gt;</code> - Dictionary of anchor points keyed by position name  
<a name="BaseShape+move"></a>

### networkSwitch.move(dx, dy)
Moves the shape by a delta amount in x and y directions.
Movement is prevented if the shape is locked.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | Change in x position |
| dy | <code>number</code> | Change in y position |

<a name="BaseShape+resize"></a>

### networkSwitch.resize(width, height)
Resizes the shape to new dimensions.
Resizing is prevented if the shape is locked.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | New width in pixels |
| height | <code>number</code> | New height in pixels |

<a name="BaseShape+applyRotation"></a>

### networkSwitch.applyRotation(ctx)
Applies rotation transformation to the canvas context.
Rotates around the shape's center point.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+applyShadow"></a>

### networkSwitch.applyShadow(ctx)
Applies shadow effects to the canvas context if shadow is enabled.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clearShadow"></a>

### networkSwitch.clearShadow(ctx)
Clears shadow effects from the canvas context.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+draw"></a>

### *networkSwitch.draw(ctx)*
Draws the shape on the canvas. Must be overridden by subclasses.

**Kind**: instance abstract method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Overrides**: [<code>draw</code>](#BaseShape+draw)  
**Throws**:

- <code>Error</code> If not implemented by subclass


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clone"></a>

### networkSwitch.clone() ⇒ [<code>BaseShape</code>](#BaseShape)
Creates a deep copy of the shape with a new unique ID.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Returns**: [<code>BaseShape</code>](#BaseShape) - Cloned shape instance  
<a name="BaseShape+toJSON"></a>

### networkSwitch.toJSON() ⇒ <code>Object</code>
Serializes the shape to a JSON-compatible object for saving.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Overrides**: [<code>toJSON</code>](#BaseShape+toJSON)  
**Returns**: <code>Object</code> - JSON representation of the shape  
<a name="Server"></a>

## Server ⇐ [<code>BaseShape</code>](#BaseShape)
**Kind**: global class  
**Extends**: [<code>BaseShape</code>](#BaseShape)  

* [Server](#Server) ⇐ [<code>BaseShape</code>](#BaseShape)
    * [new Server()](#new_Server_new)
    * [.Server](#Server+Server)
        * [new exports.Server(x, y, width, height)](#new_Server+Server_new)
    * [.BaseShape](#BaseShape+BaseShape)
        * [new exports.BaseShape(x, y, width, height)](#new_Server+BaseShape_new)
    * [.type](#Server+type) : <code>string</code>
    * [.fill](#Server+fill) : <code>string</code>
    * [.ports](#Server+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.id](#BaseShape+id) : <code>string</code>
    * [.x](#BaseShape+x) : <code>number</code>
    * [.y](#BaseShape+y) : <code>number</code>
    * [.width](#BaseShape+width) : <code>number</code>
    * [.height](#BaseShape+height) : <code>number</code>
    * [.stroke](#BaseShape+stroke) : <code>string</code>
    * [.strokeWidth](#BaseShape+strokeWidth) : <code>number</code>
    * [.rotation](#BaseShape+rotation) : <code>number</code>
    * [.shadow](#BaseShape+shadow) : <code>boolean</code>
    * [.shadowBlur](#BaseShape+shadowBlur) : <code>number</code>
    * [.shadowColor](#BaseShape+shadowColor) : <code>string</code>
    * [.shadowOffsetX](#BaseShape+shadowOffsetX) : <code>number</code>
    * [.shadowOffsetY](#BaseShape+shadowOffsetY) : <code>number</code>
    * [.zIndex](#BaseShape+zIndex) : <code>number</code>
    * [.locked](#BaseShape+locked) : <code>boolean</code>
    * [.visible](#BaseShape+visible) : <code>boolean</code>
    * [.groupId](#BaseShape+groupId) : <code>string</code> \| <code>null</code>
    * [.getAnchorPoints()](#Server+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
    * [.draw(ctx)](#Server+draw)
    * [.toJSON()](#Server+toJSON) ⇒ <code>Object</code>
    * [.generateId()](#BaseShape+generateId) ⇒ <code>string</code>
    * [.getBounds()](#BaseShape+getBounds) ⇒ <code>Object</code>
    * [.containsPoint(x, y)](#BaseShape+containsPoint) ⇒ <code>boolean</code>
    * [.rotatePoint(x, y)](#BaseShape+rotatePoint) ⇒ <code>Object</code>
    * [.getRotatedBounds()](#BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.move(dx, dy)](#BaseShape+move)
    * [.resize(width, height)](#BaseShape+resize)
    * [.applyRotation(ctx)](#BaseShape+applyRotation)
    * [.applyShadow(ctx)](#BaseShape+applyShadow)
    * [.clearShadow(ctx)](#BaseShape+clearShadow)
    * [.clone()](#BaseShape+clone) ⇒ [<code>BaseShape</code>](#BaseShape)

<a name="new_Server_new"></a>

### new Server()
Server shape representing a network server with multiple port types.
Supports video, SDI, network, and USB connections.
Renders as a rectangle with horizontal rack lines.

<a name="Server+Server"></a>

### server.Server
**Kind**: instance class of [<code>Server</code>](#Server)  
<a name="new_Server+Server_new"></a>

#### new exports.Server(x, y, width, height)
Creates a new Server instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="BaseShape+BaseShape"></a>

### server.BaseShape
**Kind**: instance class of [<code>Server</code>](#Server)  
<a name="new_Server+BaseShape_new"></a>

#### new exports.BaseShape(x, y, width, height)
Creates a new BaseShape instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-coordinate of the shape's top-left corner |
| y | <code>number</code> | The y-coordinate of the shape's top-left corner |
| width | <code>number</code> | The width of the shape in pixels |
| height | <code>number</code> | The height of the shape in pixels |

<a name="Server+type"></a>

### server.type : <code>string</code>
Shape type identifier

**Kind**: instance property of [<code>Server</code>](#Server)  
**Overrides**: [<code>type</code>](#BaseShape+type)  
<a name="Server+fill"></a>

### server.fill : <code>string</code>
Fill color from ObjectColors config

**Kind**: instance property of [<code>Server</code>](#Server)  
**Overrides**: [<code>fill</code>](#BaseShape+fill)  
<a name="Server+ports"></a>

### server.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration defining input/output ports for each connection type.
Inputs appear on left side, outputs on right side.

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+id"></a>

### server.id : <code>string</code>
Unique identifier for the shape

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+x"></a>

### server.x : <code>number</code>
X-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+y"></a>

### server.y : <code>number</code>
Y-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+width"></a>

### server.width : <code>number</code>
Width of the shape in pixels

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+height"></a>

### server.height : <code>number</code>
Height of the shape in pixels

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+stroke"></a>

### server.stroke : <code>string</code>
Stroke color in hex format

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+strokeWidth"></a>

### server.strokeWidth : <code>number</code>
Width of the stroke in pixels

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+rotation"></a>

### server.rotation : <code>number</code>
Rotation angle in radians

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+shadow"></a>

### server.shadow : <code>boolean</code>
Whether shadow rendering is enabled

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+shadowBlur"></a>

### server.shadowBlur : <code>number</code>
Shadow blur radius in pixels

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+shadowColor"></a>

### server.shadowColor : <code>string</code>
Shadow color in rgba format

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+shadowOffsetX"></a>

### server.shadowOffsetX : <code>number</code>
Shadow horizontal offset in pixels

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+shadowOffsetY"></a>

### server.shadowOffsetY : <code>number</code>
Shadow vertical offset in pixels

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+zIndex"></a>

### server.zIndex : <code>number</code>
Z-index for rendering order (higher values render on top)

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+locked"></a>

### server.locked : <code>boolean</code>
Whether the shape is locked from editing

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+visible"></a>

### server.visible : <code>boolean</code>
Whether the shape is visible on canvas

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="BaseShape+groupId"></a>

### server.groupId : <code>string</code> \| <code>null</code>
Group identifier for grouped shapes

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="Server+getAnchorPoints"></a>

### server.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.
Distributes input ports evenly along left edge, output ports along right edge.
Each anchor includes connectionType and portType for connection validation.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Overrides**: [<code>getAnchorPoints</code>](#BaseShape+getAnchorPoints)  
<a name="Server+draw"></a>

### server.draw(ctx)
Draws the server shape as a rectangle with horizontal rack lines.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Overrides**: [<code>draw</code>](#BaseShape+draw)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="Server+toJSON"></a>

### server.toJSON() ⇒ <code>Object</code>
Serializes the server to JSON, including port configuration.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Overrides**: [<code>toJSON</code>](#BaseShape+toJSON)  
**Returns**: <code>Object</code> - JSON representation with ports  
<a name="BaseShape+generateId"></a>

### server.generateId() ⇒ <code>string</code>
Generates a unique identifier for the shape.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string  
<a name="BaseShape+getBounds"></a>

### server.getBounds() ⇒ <code>Object</code>
Gets the bounding box of the shape for hit detection.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Returns**: <code>Object</code> - Bounding box coordinates and dimensions  
<a name="BaseShape+containsPoint"></a>

### server.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the shape's bounds.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Returns**: <code>boolean</code> - True if point is inside shape bounds  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |

<a name="BaseShape+rotatePoint"></a>

### server.rotatePoint(x, y) ⇒ <code>Object</code>
Rotates a point around the shape's center based on the shape's rotation.
Uses standard 2D rotation matrix transformation.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Returns**: <code>Object</code> - Rotated point coordinates  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to rotate |
| y | <code>number</code> | Y-coordinate of the point to rotate |

<a name="BaseShape+getRotatedBounds"></a>

### server.getRotatedBounds() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Gets the four corners of the shape's bounding box after rotation is applied.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of four corner points  
<a name="BaseShape+move"></a>

### server.move(dx, dy)
Moves the shape by a delta amount in x and y directions.
Movement is prevented if the shape is locked.

**Kind**: instance method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | Change in x position |
| dy | <code>number</code> | Change in y position |

<a name="BaseShape+resize"></a>

### server.resize(width, height)
Resizes the shape to new dimensions.
Resizing is prevented if the shape is locked.

**Kind**: instance method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | New width in pixels |
| height | <code>number</code> | New height in pixels |

<a name="BaseShape+applyRotation"></a>

### server.applyRotation(ctx)
Applies rotation transformation to the canvas context.
Rotates around the shape's center point.

**Kind**: instance method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+applyShadow"></a>

### server.applyShadow(ctx)
Applies shadow effects to the canvas context if shadow is enabled.

**Kind**: instance method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clearShadow"></a>

### server.clearShadow(ctx)
Clears shadow effects from the canvas context.

**Kind**: instance method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clone"></a>

### server.clone() ⇒ [<code>BaseShape</code>](#BaseShape)
Creates a deep copy of the shape with a new unique ID.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Returns**: [<code>BaseShape</code>](#BaseShape) - Cloned shape instance  
<a name="SyncGenerator"></a>

## SyncGenerator ⇐ [<code>BaseShape</code>](#BaseShape)
**Kind**: global class  
**Extends**: [<code>BaseShape</code>](#BaseShape)  

* [SyncGenerator](#SyncGenerator) ⇐ [<code>BaseShape</code>](#BaseShape)
    * [new SyncGenerator()](#new_SyncGenerator_new)
    * [.SyncGenerator](#SyncGenerator+SyncGenerator)
        * [new exports.SyncGenerator(x, y, width, height)](#new_SyncGenerator+SyncGenerator_new)
    * [.BaseShape](#BaseShape+BaseShape)
        * [new exports.BaseShape(x, y, width, height)](#new_SyncGenerator+BaseShape_new)
    * [.ports](#SyncGenerator+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.id](#BaseShape+id) : <code>string</code>
    * [.type](#BaseShape+type) : <code>string</code>
    * [.x](#BaseShape+x) : <code>number</code>
    * [.y](#BaseShape+y) : <code>number</code>
    * [.width](#BaseShape+width) : <code>number</code>
    * [.height](#BaseShape+height) : <code>number</code>
    * [.fill](#BaseShape+fill) : <code>string</code>
    * [.stroke](#BaseShape+stroke) : <code>string</code>
    * [.strokeWidth](#BaseShape+strokeWidth) : <code>number</code>
    * [.rotation](#BaseShape+rotation) : <code>number</code>
    * [.shadow](#BaseShape+shadow) : <code>boolean</code>
    * [.shadowBlur](#BaseShape+shadowBlur) : <code>number</code>
    * [.shadowColor](#BaseShape+shadowColor) : <code>string</code>
    * [.shadowOffsetX](#BaseShape+shadowOffsetX) : <code>number</code>
    * [.shadowOffsetY](#BaseShape+shadowOffsetY) : <code>number</code>
    * [.zIndex](#BaseShape+zIndex) : <code>number</code>
    * [.locked](#BaseShape+locked) : <code>boolean</code>
    * [.visible](#BaseShape+visible) : <code>boolean</code>
    * [.groupId](#BaseShape+groupId) : <code>string</code> \| <code>null</code>
    * [.getPoints()](#SyncGenerator+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.generateId()](#BaseShape+generateId) ⇒ <code>string</code>
    * [.getBounds()](#BaseShape+getBounds) ⇒ <code>Object</code>
    * [.containsPoint(x, y)](#BaseShape+containsPoint) ⇒ <code>boolean</code>
    * [.rotatePoint(x, y)](#BaseShape+rotatePoint) ⇒ <code>Object</code>
    * [.getRotatedBounds()](#BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.getAnchorPoints()](#BaseShape+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number}&gt;</code>
    * [.move(dx, dy)](#BaseShape+move)
    * [.resize(width, height)](#BaseShape+resize)
    * [.applyRotation(ctx)](#BaseShape+applyRotation)
    * [.applyShadow(ctx)](#BaseShape+applyShadow)
    * [.clearShadow(ctx)](#BaseShape+clearShadow)
    * *[.draw(ctx)](#BaseShape+draw)*
    * [.clone()](#BaseShape+clone) ⇒ [<code>BaseShape</code>](#BaseShape)
    * [.toJSON()](#BaseShape+toJSON) ⇒ <code>Object</code>

<a name="new_SyncGenerator_new"></a>

### new SyncGenerator()
SyncGenerator shape representing a video sync generation device.
Provides SDI timing signals to other devices in the system.
Renders as a hexagon shape.

<a name="SyncGenerator+SyncGenerator"></a>

### syncGenerator.SyncGenerator
**Kind**: instance class of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="new_SyncGenerator+SyncGenerator_new"></a>

#### new exports.SyncGenerator(x, y, width, height)
Creates a new SyncGenerator instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="BaseShape+BaseShape"></a>

### syncGenerator.BaseShape
**Kind**: instance class of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="new_SyncGenerator+BaseShape_new"></a>

#### new exports.BaseShape(x, y, width, height)
Creates a new BaseShape instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-coordinate of the shape's top-left corner |
| y | <code>number</code> | The y-coordinate of the shape's top-left corner |
| width | <code>number</code> | The width of the shape in pixels |
| height | <code>number</code> | The height of the shape in pixels |

<a name="SyncGenerator+ports"></a>

### syncGenerator.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration - SDI only

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+id"></a>

### syncGenerator.id : <code>string</code>
Unique identifier for the shape

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+type"></a>

### syncGenerator.type : <code>string</code>
Type identifier for the shape (overridden by subclasses)

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
**Overrides**: [<code>type</code>](#BaseShape+type)  
<a name="BaseShape+x"></a>

### syncGenerator.x : <code>number</code>
X-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+y"></a>

### syncGenerator.y : <code>number</code>
Y-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+width"></a>

### syncGenerator.width : <code>number</code>
Width of the shape in pixels

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+height"></a>

### syncGenerator.height : <code>number</code>
Height of the shape in pixels

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+fill"></a>

### syncGenerator.fill : <code>string</code>
Fill color in hex format

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
**Overrides**: [<code>fill</code>](#BaseShape+fill)  
<a name="BaseShape+stroke"></a>

### syncGenerator.stroke : <code>string</code>
Stroke color in hex format

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+strokeWidth"></a>

### syncGenerator.strokeWidth : <code>number</code>
Width of the stroke in pixels

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+rotation"></a>

### syncGenerator.rotation : <code>number</code>
Rotation angle in radians

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+shadow"></a>

### syncGenerator.shadow : <code>boolean</code>
Whether shadow rendering is enabled

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+shadowBlur"></a>

### syncGenerator.shadowBlur : <code>number</code>
Shadow blur radius in pixels

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+shadowColor"></a>

### syncGenerator.shadowColor : <code>string</code>
Shadow color in rgba format

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+shadowOffsetX"></a>

### syncGenerator.shadowOffsetX : <code>number</code>
Shadow horizontal offset in pixels

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+shadowOffsetY"></a>

### syncGenerator.shadowOffsetY : <code>number</code>
Shadow vertical offset in pixels

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+zIndex"></a>

### syncGenerator.zIndex : <code>number</code>
Z-index for rendering order (higher values render on top)

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+locked"></a>

### syncGenerator.locked : <code>boolean</code>
Whether the shape is locked from editing

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+visible"></a>

### syncGenerator.visible : <code>boolean</code>
Whether the shape is visible on canvas

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="BaseShape+groupId"></a>

### syncGenerator.groupId : <code>string</code> \| <code>null</code>
Group identifier for grouped shapes

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="SyncGenerator+getPoints"></a>

### syncGenerator.getPoints() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Calculates the hexagon vertex points based on position and size.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of 6 hexagon vertices  
<a name="BaseShape+generateId"></a>

### syncGenerator.generateId() ⇒ <code>string</code>
Generates a unique identifier for the shape.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string  
<a name="BaseShape+getBounds"></a>

### syncGenerator.getBounds() ⇒ <code>Object</code>
Gets the bounding box of the shape for hit detection.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Returns**: <code>Object</code> - Bounding box coordinates and dimensions  
<a name="BaseShape+containsPoint"></a>

### syncGenerator.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the shape's bounds.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Returns**: <code>boolean</code> - True if point is inside shape bounds  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |

<a name="BaseShape+rotatePoint"></a>

### syncGenerator.rotatePoint(x, y) ⇒ <code>Object</code>
Rotates a point around the shape's center based on the shape's rotation.
Uses standard 2D rotation matrix transformation.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Returns**: <code>Object</code> - Rotated point coordinates  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to rotate |
| y | <code>number</code> | Y-coordinate of the point to rotate |

<a name="BaseShape+getRotatedBounds"></a>

### syncGenerator.getRotatedBounds() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Gets the four corners of the shape's bounding box after rotation is applied.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of four corner points  
<a name="BaseShape+getAnchorPoints"></a>

### syncGenerator.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number}&gt;</code>
Gets anchor points for connecting lines to this shape.
Returns points at top, right, bottom, left edges and center.
Anchor points are automatically rotated if the shape is rotated.
Subclasses override this to provide port-specific anchor points.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Overrides**: [<code>getAnchorPoints</code>](#BaseShape+getAnchorPoints)  
**Returns**: <code>Object.&lt;string, {x: number, y: number}&gt;</code> - Dictionary of anchor points keyed by position name  
<a name="BaseShape+move"></a>

### syncGenerator.move(dx, dy)
Moves the shape by a delta amount in x and y directions.
Movement is prevented if the shape is locked.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | Change in x position |
| dy | <code>number</code> | Change in y position |

<a name="BaseShape+resize"></a>

### syncGenerator.resize(width, height)
Resizes the shape to new dimensions.
Resizing is prevented if the shape is locked.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | New width in pixels |
| height | <code>number</code> | New height in pixels |

<a name="BaseShape+applyRotation"></a>

### syncGenerator.applyRotation(ctx)
Applies rotation transformation to the canvas context.
Rotates around the shape's center point.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+applyShadow"></a>

### syncGenerator.applyShadow(ctx)
Applies shadow effects to the canvas context if shadow is enabled.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clearShadow"></a>

### syncGenerator.clearShadow(ctx)
Clears shadow effects from the canvas context.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+draw"></a>

### *syncGenerator.draw(ctx)*
Draws the shape on the canvas. Must be overridden by subclasses.

**Kind**: instance abstract method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Overrides**: [<code>draw</code>](#BaseShape+draw)  
**Throws**:

- <code>Error</code> If not implemented by subclass


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clone"></a>

### syncGenerator.clone() ⇒ [<code>BaseShape</code>](#BaseShape)
Creates a deep copy of the shape with a new unique ID.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Returns**: [<code>BaseShape</code>](#BaseShape) - Cloned shape instance  
<a name="BaseShape+toJSON"></a>

### syncGenerator.toJSON() ⇒ <code>Object</code>
Serializes the shape to a JSON-compatible object for saving.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Overrides**: [<code>toJSON</code>](#BaseShape+toJSON)  
**Returns**: <code>Object</code> - JSON representation of the shape  
<a name="VideoMatrix"></a>

## VideoMatrix ⇐ [<code>BaseShape</code>](#BaseShape)
**Kind**: global class  
**Extends**: [<code>BaseShape</code>](#BaseShape)  

* [VideoMatrix](#VideoMatrix) ⇐ [<code>BaseShape</code>](#BaseShape)
    * [new VideoMatrix()](#new_VideoMatrix_new)
    * [.VideoMatrix](#VideoMatrix+VideoMatrix)
        * [new exports.VideoMatrix(x, y, width, height)](#new_VideoMatrix+VideoMatrix_new)
    * [.BaseShape](#BaseShape+BaseShape)
        * [new exports.BaseShape(x, y, width, height)](#new_VideoMatrix+BaseShape_new)
    * [.ports](#VideoMatrix+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.id](#BaseShape+id) : <code>string</code>
    * [.type](#BaseShape+type) : <code>string</code>
    * [.x](#BaseShape+x) : <code>number</code>
    * [.y](#BaseShape+y) : <code>number</code>
    * [.width](#BaseShape+width) : <code>number</code>
    * [.height](#BaseShape+height) : <code>number</code>
    * [.fill](#BaseShape+fill) : <code>string</code>
    * [.stroke](#BaseShape+stroke) : <code>string</code>
    * [.strokeWidth](#BaseShape+strokeWidth) : <code>number</code>
    * [.rotation](#BaseShape+rotation) : <code>number</code>
    * [.shadow](#BaseShape+shadow) : <code>boolean</code>
    * [.shadowBlur](#BaseShape+shadowBlur) : <code>number</code>
    * [.shadowColor](#BaseShape+shadowColor) : <code>string</code>
    * [.shadowOffsetX](#BaseShape+shadowOffsetX) : <code>number</code>
    * [.shadowOffsetY](#BaseShape+shadowOffsetY) : <code>number</code>
    * [.zIndex](#BaseShape+zIndex) : <code>number</code>
    * [.locked](#BaseShape+locked) : <code>boolean</code>
    * [.visible](#BaseShape+visible) : <code>boolean</code>
    * [.groupId](#BaseShape+groupId) : <code>string</code> \| <code>null</code>
    * [.getAnchorPoints()](#VideoMatrix+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
    * [.generateId()](#BaseShape+generateId) ⇒ <code>string</code>
    * [.getBounds()](#BaseShape+getBounds) ⇒ <code>Object</code>
    * [.containsPoint(x, y)](#BaseShape+containsPoint) ⇒ <code>boolean</code>
    * [.rotatePoint(x, y)](#BaseShape+rotatePoint) ⇒ <code>Object</code>
    * [.getRotatedBounds()](#BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.move(dx, dy)](#BaseShape+move)
    * [.resize(width, height)](#BaseShape+resize)
    * [.applyRotation(ctx)](#BaseShape+applyRotation)
    * [.applyShadow(ctx)](#BaseShape+applyShadow)
    * [.clearShadow(ctx)](#BaseShape+clearShadow)
    * *[.draw(ctx)](#BaseShape+draw)*
    * [.clone()](#BaseShape+clone) ⇒ [<code>BaseShape</code>](#BaseShape)
    * [.toJSON()](#BaseShape+toJSON) ⇒ <code>Object</code>

<a name="new_VideoMatrix_new"></a>

### new VideoMatrix()
VideoMatrix shape representing a video routing matrix.
Supports video and SDI connections with configurable input/output ports.
Renders as a rectangle with an 'M' letter drawn in the center.

<a name="VideoMatrix+VideoMatrix"></a>

### videoMatrix.VideoMatrix
**Kind**: instance class of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="new_VideoMatrix+VideoMatrix_new"></a>

#### new exports.VideoMatrix(x, y, width, height)
Creates a new VideoMatrix instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="BaseShape+BaseShape"></a>

### videoMatrix.BaseShape
**Kind**: instance class of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="new_VideoMatrix+BaseShape_new"></a>

#### new exports.BaseShape(x, y, width, height)
Creates a new BaseShape instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-coordinate of the shape's top-left corner |
| y | <code>number</code> | The y-coordinate of the shape's top-left corner |
| width | <code>number</code> | The width of the shape in pixels |
| height | <code>number</code> | The height of the shape in pixels |

<a name="VideoMatrix+ports"></a>

### videoMatrix.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+id"></a>

### videoMatrix.id : <code>string</code>
Unique identifier for the shape

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+type"></a>

### videoMatrix.type : <code>string</code>
Type identifier for the shape (overridden by subclasses)

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
**Overrides**: [<code>type</code>](#BaseShape+type)  
<a name="BaseShape+x"></a>

### videoMatrix.x : <code>number</code>
X-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+y"></a>

### videoMatrix.y : <code>number</code>
Y-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+width"></a>

### videoMatrix.width : <code>number</code>
Width of the shape in pixels

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+height"></a>

### videoMatrix.height : <code>number</code>
Height of the shape in pixels

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+fill"></a>

### videoMatrix.fill : <code>string</code>
Fill color in hex format

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
**Overrides**: [<code>fill</code>](#BaseShape+fill)  
<a name="BaseShape+stroke"></a>

### videoMatrix.stroke : <code>string</code>
Stroke color in hex format

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+strokeWidth"></a>

### videoMatrix.strokeWidth : <code>number</code>
Width of the stroke in pixels

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+rotation"></a>

### videoMatrix.rotation : <code>number</code>
Rotation angle in radians

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+shadow"></a>

### videoMatrix.shadow : <code>boolean</code>
Whether shadow rendering is enabled

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+shadowBlur"></a>

### videoMatrix.shadowBlur : <code>number</code>
Shadow blur radius in pixels

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+shadowColor"></a>

### videoMatrix.shadowColor : <code>string</code>
Shadow color in rgba format

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+shadowOffsetX"></a>

### videoMatrix.shadowOffsetX : <code>number</code>
Shadow horizontal offset in pixels

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+shadowOffsetY"></a>

### videoMatrix.shadowOffsetY : <code>number</code>
Shadow vertical offset in pixels

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+zIndex"></a>

### videoMatrix.zIndex : <code>number</code>
Z-index for rendering order (higher values render on top)

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+locked"></a>

### videoMatrix.locked : <code>boolean</code>
Whether the shape is locked from editing

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+visible"></a>

### videoMatrix.visible : <code>boolean</code>
Whether the shape is visible on canvas

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="BaseShape+groupId"></a>

### videoMatrix.groupId : <code>string</code> \| <code>null</code>
Group identifier for grouped shapes

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="VideoMatrix+getAnchorPoints"></a>

### videoMatrix.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  
**Overrides**: [<code>getAnchorPoints</code>](#BaseShape+getAnchorPoints)  
<a name="BaseShape+generateId"></a>

### videoMatrix.generateId() ⇒ <code>string</code>
Generates a unique identifier for the shape.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string  
<a name="BaseShape+getBounds"></a>

### videoMatrix.getBounds() ⇒ <code>Object</code>
Gets the bounding box of the shape for hit detection.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  
**Returns**: <code>Object</code> - Bounding box coordinates and dimensions  
<a name="BaseShape+containsPoint"></a>

### videoMatrix.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the shape's bounds.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  
**Returns**: <code>boolean</code> - True if point is inside shape bounds  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test |
| y | <code>number</code> | Y-coordinate of the point to test |

<a name="BaseShape+rotatePoint"></a>

### videoMatrix.rotatePoint(x, y) ⇒ <code>Object</code>
Rotates a point around the shape's center based on the shape's rotation.
Uses standard 2D rotation matrix transformation.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  
**Returns**: <code>Object</code> - Rotated point coordinates  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to rotate |
| y | <code>number</code> | Y-coordinate of the point to rotate |

<a name="BaseShape+getRotatedBounds"></a>

### videoMatrix.getRotatedBounds() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Gets the four corners of the shape's bounding box after rotation is applied.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of four corner points  
<a name="BaseShape+move"></a>

### videoMatrix.move(dx, dy)
Moves the shape by a delta amount in x and y directions.
Movement is prevented if the shape is locked.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | Change in x position |
| dy | <code>number</code> | Change in y position |

<a name="BaseShape+resize"></a>

### videoMatrix.resize(width, height)
Resizes the shape to new dimensions.
Resizing is prevented if the shape is locked.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | New width in pixels |
| height | <code>number</code> | New height in pixels |

<a name="BaseShape+applyRotation"></a>

### videoMatrix.applyRotation(ctx)
Applies rotation transformation to the canvas context.
Rotates around the shape's center point.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+applyShadow"></a>

### videoMatrix.applyShadow(ctx)
Applies shadow effects to the canvas context if shadow is enabled.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clearShadow"></a>

### videoMatrix.clearShadow(ctx)
Clears shadow effects from the canvas context.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+draw"></a>

### *videoMatrix.draw(ctx)*
Draws the shape on the canvas. Must be overridden by subclasses.

**Kind**: instance abstract method of [<code>VideoMatrix</code>](#VideoMatrix)  
**Overrides**: [<code>draw</code>](#BaseShape+draw)  
**Throws**:

- <code>Error</code> If not implemented by subclass


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="BaseShape+clone"></a>

### videoMatrix.clone() ⇒ [<code>BaseShape</code>](#BaseShape)
Creates a deep copy of the shape with a new unique ID.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  
**Returns**: [<code>BaseShape</code>](#BaseShape) - Cloned shape instance  
<a name="BaseShape+toJSON"></a>

### videoMatrix.toJSON() ⇒ <code>Object</code>
Serializes the shape to a JSON-compatible object for saving.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  
**Overrides**: [<code>toJSON</code>](#BaseShape+toJSON)  
**Returns**: <code>Object</code> - JSON representation of the shape  
<a name="Templates"></a>

## Templates
**Kind**: global class  

* [Templates](#Templates)
    * [new Templates()](#new_Templates_new)
    * [.createBasicFlowchart()](#Templates.createBasicFlowchart) ⇒ <code>Object</code>

<a name="new_Templates_new"></a>

### new Templates()
Provides static methods for creating pre-configured diagram templates.
Each template returns an object with a name and an array of shape/connector objects.

<a name="Templates.createBasicFlowchart"></a>

### Templates.createBasicFlowchart() ⇒ <code>Object</code>
Creates a basic flowchart template with start, process, decision, and end nodes.

**Kind**: static method of [<code>Templates</code>](#Templates)  
**Returns**: <code>Object</code> - Template with flowchart shapes and connectors  
<a name="ConnectionTypes"></a>

## ConnectionTypes : <code>Object.&lt;string, string&gt;</code>
Supported connection types for network diagram connectors.

**Kind**: global constant  

* [ConnectionTypes](#ConnectionTypes) : <code>Object.&lt;string, string&gt;</code>
    * [.VIDEO](#ConnectionTypes.VIDEO)
    * [.SDI](#ConnectionTypes.SDI)
    * [.NETWORK](#ConnectionTypes.NETWORK)
    * [.USB](#ConnectionTypes.USB)

<a name="ConnectionTypes.VIDEO"></a>

### ConnectionTypes.VIDEO
Video connection type

**Kind**: static property of [<code>ConnectionTypes</code>](#ConnectionTypes)  
<a name="ConnectionTypes.SDI"></a>

### ConnectionTypes.SDI
SDI (Serial Digital Interface) connection type

**Kind**: static property of [<code>ConnectionTypes</code>](#ConnectionTypes)  
<a name="ConnectionTypes.NETWORK"></a>

### ConnectionTypes.NETWORK
Network/Ethernet connection type

**Kind**: static property of [<code>ConnectionTypes</code>](#ConnectionTypes)  
<a name="ConnectionTypes.USB"></a>

### ConnectionTypes.USB
USB connection type

**Kind**: static property of [<code>ConnectionTypes</code>](#ConnectionTypes)  
<a name="ConnectionColors"></a>

## ConnectionColors : <code>Object.&lt;string, string&gt;</code>
Default colors for each connection type.
Colors are used to visually distinguish different connection types on the canvas.

**Kind**: global constant  

* [ConnectionColors](#ConnectionColors) : <code>Object.&lt;string, string&gt;</code>
    * [.ConnectionTypes.VIDEO](#ConnectionColors.ConnectionTypes.VIDEO)
    * [.ConnectionTypes.SDI](#ConnectionColors.ConnectionTypes.SDI)
    * [.ConnectionTypes.NETWORK](#ConnectionColors.ConnectionTypes.NETWORK)
    * [.ConnectionTypes.USB](#ConnectionColors.ConnectionTypes.USB)

<a name="ConnectionColors.ConnectionTypes.VIDEO"></a>

### ConnectionColors.ConnectionTypes.VIDEO
Gold color for video connections

**Kind**: static property of [<code>ConnectionColors</code>](#ConnectionColors)  
<a name="ConnectionColors.ConnectionTypes.SDI"></a>

### ConnectionColors.ConnectionTypes.SDI
Orange red color for SDI connections

**Kind**: static property of [<code>ConnectionColors</code>](#ConnectionColors)  
<a name="ConnectionColors.ConnectionTypes.NETWORK"></a>

### ConnectionColors.ConnectionTypes.NETWORK
Dark turquoise color for network connections

**Kind**: static property of [<code>ConnectionColors</code>](#ConnectionColors)  
<a name="ConnectionColors.ConnectionTypes.USB"></a>

### ConnectionColors.ConnectionTypes.USB
Medium purple color for USB connections

**Kind**: static property of [<code>ConnectionColors</code>](#ConnectionColors)  
<a name="ObjectColors"></a>

## ObjectColors : <code>Object.&lt;string, string&gt;</code>
Default fill colors for system object types.
Used to visually distinguish different device types on the canvas.

**Kind**: global constant  

* [ObjectColors](#ObjectColors) : <code>Object.&lt;string, string&gt;</code>
    * [.SERVER](#ObjectColors.SERVER)
    * [.NETWORK_SWITCH](#ObjectColors.NETWORK_SWITCH)
    * [.VIDEO_MATRIX](#ObjectColors.VIDEO_MATRIX)
    * [.LED_PROCESSOR](#ObjectColors.LED_PROCESSOR)
    * [.SYNC_GENERATOR](#ObjectColors.SYNC_GENERATOR)

<a name="ObjectColors.SERVER"></a>

### ObjectColors.SERVER
Dark blue-gray for server objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="ObjectColors.NETWORK_SWITCH"></a>

### ObjectColors.NETWORK\_SWITCH
Green for network switch objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="ObjectColors.VIDEO_MATRIX"></a>

### ObjectColors.VIDEO\_MATRIX
Red for video matrix objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="ObjectColors.LED_PROCESSOR"></a>

### ObjectColors.LED\_PROCESSOR
Orange for LED processor objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="ObjectColors.SYNC_GENERATOR"></a>

### ObjectColors.SYNC\_GENERATOR
Purple for sync generator objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="PortTypes"></a>

## PortTypes : <code>Object.&lt;string, string&gt;</code>
Port direction types for defining input/output ports.

**Kind**: global constant  

* [PortTypes](#PortTypes) : <code>Object.&lt;string, string&gt;</code>
    * [.INPUT](#PortTypes.INPUT)
    * [.OUTPUT](#PortTypes.OUTPUT)

<a name="PortTypes.INPUT"></a>

### PortTypes.INPUT
Input port direction

**Kind**: static property of [<code>PortTypes</code>](#PortTypes)  
<a name="PortTypes.OUTPUT"></a>

### PortTypes.OUTPUT
Output port direction

**Kind**: static property of [<code>PortTypes</code>](#PortTypes)  
