# Connector

_Source: `js/core/Connector.js`_

<a name="module_core/Connector"></a>

## core/Connector
Connector class for drawing lines between shapes on the canvas.

**See**

- module:core/BaseShape
- module:shapes/ConnectorAnchor

**Example**  
```js
import { Connector } from './core/Connector.js';
```

* [core/Connector](#module_core/Connector)
    * _static_
        * [.Connector](#module_core/Connector.Connector)
            * [new exports.Connector(startObject, startAnchor, endObject, endAnchor, connectionType)](#new_module_core/Connector.Connector_new)
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
            * [.drawStraight(ctx, start, end)](#module_core/Connector.Connector+drawStraight)
            * [.drawPolyline(ctx, start, end)](#module_core/Connector.Connector+drawPolyline)
            * [.drawOrthogonal(ctx, start, end)](#module_core/Connector.Connector+drawOrthogonal)
            * [.drawBezier(ctx, start, end)](#module_core/Connector.Connector+drawBezier)
            * [.getArrowStartPoint()](#module_core/Connector.Connector+getArrowStartPoint) ⇒ <code>\*</code>
            * [.getArrowEndPoint()](#module_core/Connector.Connector+getArrowEndPoint) ⇒ <code>\*</code>
            * [.getOrthogonalStartArrowPoint()](#module_core/Connector.Connector+getOrthogonalStartArrowPoint) ⇒ <code>\*</code>
            * [.getOrthogonalEndArrowPoint()](#module_core/Connector.Connector+getOrthogonalEndArrowPoint) ⇒ <code>\*</code>
            * [.drawArrow(ctx, from, to, atStart)](#module_core/Connector.Connector+drawArrow)
            * [.drawArrowWithAngle(ctx, point, angle)](#module_core/Connector.Connector+drawArrowWithAngle)
            * [.getBezierTangentAtStart()](#module_core/Connector.Connector+getBezierTangentAtStart) ⇒ <code>\*</code>
            * [.getBezierTangentAtEnd()](#module_core/Connector.Connector+getBezierTangentAtEnd) ⇒ <code>\*</code>
            * [.drawWaypoints(ctx)](#module_core/Connector.Connector+drawWaypoints)
            * [.drawControlPoints(ctx)](#module_core/Connector.Connector+drawControlPoints)
            * [.toJSON()](#module_core/Connector.Connector+toJSON) ⇒ <code>Object</code>
    * _inner_
        * [~Connector](#module_core/Connector..Connector)
            * [new Connector()](#new_module_core/Connector..Connector_new)

<a name="module_core/Connector.Connector"></a>

### core/Connector.Connector
**Kind**: static class of [<code>core/Connector</code>](#module_core/Connector)  

* [.Connector](#module_core/Connector.Connector)
    * [new exports.Connector(startObject, startAnchor, endObject, endAnchor, connectionType)](#new_module_core/Connector.Connector_new)
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
    * [.drawStraight(ctx, start, end)](#module_core/Connector.Connector+drawStraight)
    * [.drawPolyline(ctx, start, end)](#module_core/Connector.Connector+drawPolyline)
    * [.drawOrthogonal(ctx, start, end)](#module_core/Connector.Connector+drawOrthogonal)
    * [.drawBezier(ctx, start, end)](#module_core/Connector.Connector+drawBezier)
    * [.getArrowStartPoint()](#module_core/Connector.Connector+getArrowStartPoint) ⇒ <code>\*</code>
    * [.getArrowEndPoint()](#module_core/Connector.Connector+getArrowEndPoint) ⇒ <code>\*</code>
    * [.getOrthogonalStartArrowPoint()](#module_core/Connector.Connector+getOrthogonalStartArrowPoint) ⇒ <code>\*</code>
    * [.getOrthogonalEndArrowPoint()](#module_core/Connector.Connector+getOrthogonalEndArrowPoint) ⇒ <code>\*</code>
    * [.drawArrow(ctx, from, to, atStart)](#module_core/Connector.Connector+drawArrow)
    * [.drawArrowWithAngle(ctx, point, angle)](#module_core/Connector.Connector+drawArrowWithAngle)
    * [.getBezierTangentAtStart()](#module_core/Connector.Connector+getBezierTangentAtStart) ⇒ <code>\*</code>
    * [.getBezierTangentAtEnd()](#module_core/Connector.Connector+getBezierTangentAtEnd) ⇒ <code>\*</code>
    * [.drawWaypoints(ctx)](#module_core/Connector.Connector+drawWaypoints)
    * [.drawControlPoints(ctx)](#module_core/Connector.Connector+drawControlPoints)
    * [.toJSON()](#module_core/Connector.Connector+toJSON) ⇒ <code>Object</code>

<a name="new_module_core/Connector.Connector_new"></a>

#### new exports.Connector(startObject, startAnchor, endObject, endAnchor, connectionType)
Creates a new Connector instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startObject | <code>Object</code> |  | The shape object where the connector starts |
| startAnchor | <code>string</code> |  | The anchor point key on the start object |
| endObject | <code>Object</code> |  | The shape object where the connector ends |
| endAnchor | <code>string</code> |  | The anchor point key on the end object |
| connectionType | <code>string</code> \| <code>null</code> | <code>null</code> | Type of connection (video, sdi, network, usb) or null for generic |

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
**Returns**: <code>string</code> - Unique ID combining timestamp and random string  
<a name="module_core/Connector.Connector+getStartPoint"></a>

#### connector.getStartPoint() ⇒ <code>Object</code> \| <code>null</code>
Gets the starting point of the connector from the start object's anchor points.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> \| <code>null</code> - Start point coordinates or null if no start object  
<a name="module_core/Connector.Connector+getEndPoint"></a>

#### connector.getEndPoint() ⇒ <code>Object</code> \| <code>null</code>
Gets the ending point of the connector from the end object's anchor points.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> \| <code>null</code> - End point coordinates or null if no end object  
<a name="module_core/Connector.Connector+containsPoint"></a>

#### connector.containsPoint(x, y, [threshold]) ⇒ <code>boolean</code>
Checks if a point is near the connector line for hit detection.
Delegates to specific methods based on connector style.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>boolean</code> - True if point is within threshold distance of the connector  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> |  | X-coordinate of the point to test |
| y | <code>number</code> |  | Y-coordinate of the point to test |
| [threshold] | <code>number</code> | <code>5</code> | Maximum distance in pixels to consider "near" |

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
Checks if a point is near an orthogonal (right-angled) connector.
Orthogonal connectors use 3 segments forming right angles.

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
Gets the default position for the first bezier control point.
Positioned at 25% along the line with slight curve offset.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> - Default first control point coordinates  
<a name="module_core/Connector.Connector+getDefaultControlPoint2"></a>

#### connector.getDefaultControlPoint2() ⇒ <code>Object</code>
Gets the default position for the second bezier control point.
Positioned at 75% along the line with slight curve offset.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> - Default second control point coordinates  
<a name="module_core/Connector.Connector+draw"></a>

#### connector.draw(ctx)
Draws the connector on the canvas.
Applies appropriate styling, draws the connection line based on style,
and draws arrows and control points as needed.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="module_core/Connector.Connector+drawStraight"></a>

#### connector.drawStraight(ctx, start, end)
Performs `drawStraight`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |
| start | <code>\*</code> | start value. |
| end | <code>\*</code> | end value. |

<a name="module_core/Connector.Connector+drawPolyline"></a>

#### connector.drawPolyline(ctx, start, end)
Performs `drawPolyline`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |
| start | <code>\*</code> | start value. |
| end | <code>\*</code> | end value. |

<a name="module_core/Connector.Connector+drawOrthogonal"></a>

#### connector.drawOrthogonal(ctx, start, end)
Performs `drawOrthogonal`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |
| start | <code>\*</code> | start value. |
| end | <code>\*</code> | end value. |

<a name="module_core/Connector.Connector+drawBezier"></a>

#### connector.drawBezier(ctx, start, end)
Performs `drawBezier`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |
| start | <code>\*</code> | start value. |
| end | <code>\*</code> | end value. |

<a name="module_core/Connector.Connector+getArrowStartPoint"></a>

#### connector.getArrowStartPoint() ⇒ <code>\*</code>
Returns the `ArrowStartPoint` value.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_core/Connector.Connector+getArrowEndPoint"></a>

#### connector.getArrowEndPoint() ⇒ <code>\*</code>
Returns the `ArrowEndPoint` value.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_core/Connector.Connector+getOrthogonalStartArrowPoint"></a>

#### connector.getOrthogonalStartArrowPoint() ⇒ <code>\*</code>
Returns the `OrthogonalStartArrowPoint` value.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_core/Connector.Connector+getOrthogonalEndArrowPoint"></a>

#### connector.getOrthogonalEndArrowPoint() ⇒ <code>\*</code>
Returns the `OrthogonalEndArrowPoint` value.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_core/Connector.Connector+drawArrow"></a>

#### connector.drawArrow(ctx, from, to, atStart)
Performs `drawArrow`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |
| from | <code>\*</code> | from value. |
| to | <code>\*</code> | to value. |
| atStart | <code>\*</code> | atStart value. |

<a name="module_core/Connector.Connector+drawArrowWithAngle"></a>

#### connector.drawArrowWithAngle(ctx, point, angle)
Performs `drawArrowWithAngle`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |
| point | <code>\*</code> | point value. |
| angle | <code>number</code> | angle value. |

<a name="module_core/Connector.Connector+getBezierTangentAtStart"></a>

#### connector.getBezierTangentAtStart() ⇒ <code>\*</code>
Returns the `BezierTangentAtStart` value.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_core/Connector.Connector+getBezierTangentAtEnd"></a>

#### connector.getBezierTangentAtEnd() ⇒ <code>\*</code>
Returns the `BezierTangentAtEnd` value.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_core/Connector.Connector+drawWaypoints"></a>

#### connector.drawWaypoints(ctx)
Performs `drawWaypoints`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_core/Connector.Connector+drawControlPoints"></a>

#### connector.drawControlPoints(ctx)
Performs `drawControlPoints`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_core/Connector.Connector+toJSON"></a>

#### connector.toJSON() ⇒ <code>Object</code>
Serializes the connector to a JSON-compatible object for saving.
Stores object IDs instead of object references for proper serialization.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Object</code> - JSON representation of the connector with all properties  
<a name="module_core/Connector..Connector"></a>

### core/Connector~Connector
**Kind**: inner class of [<code>core/Connector</code>](#module_core/Connector)  
<a name="new_module_core/Connector..Connector_new"></a>

#### new Connector()
Connector class for drawing lines between shapes on the canvas.
Supports multiple connection styles (straight, orthogonal, bezier, polyline),
line styles (solid, dashed, dotted), and connection types for typed network diagrams.


