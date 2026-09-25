# Connector

_Source: `js/core/Connector.js`_

<a name="module_core/Connector"></a>

## core/Connector
Connector (edge) between two anchors of two shapes.

Supports four path styles (`straight`, `orthogonal`, `bezier`, `polyline`), three line styles
(`solid`, `dashed`, `dotted`), optional arrows at either end, a typed connection (video, sdi, ...)
and a text label drawn at the middle of the path.

**Remarks**: - Endpoints are resolved lazily from the attached shapes' anchor points, so connectors follow shapes.
- If a referenced port no longer exists (e.g. the port count was reduced) the connector falls back to
  the shape centre and reports `isDangling()`; it is never silently hidden.
- Orthogonal routing leaves each port along its outward normal ("stub") before turning, which keeps
  links from crossing through the devices they connect.  
**See**

- module:core/Ports
- module:core/BaseShape

**Example**  
```js
const link = new Connector(server, 'video_output_0', matrix, 'video_input_0', 'video');
link.style = 'orthogonal';
link.label = 'Program A';
```

* [core/Connector](#module_core/Connector)
    * [.Connector](#module_core/Connector.Connector)
        * [new exports.Connector(startObject, startAnchor, endObject, endAnchor, [connectionType])](#new_module_core/Connector.Connector_new)
        * _instance_
            * [.id](#module_core/Connector.Connector+id) : <code>string</code>
            * [.type](#module_core/Connector.Connector+type) : <code>string</code>
            * [.startObject](#module_core/Connector.Connector+startObject) : <code>Object</code>
            * [.startAnchor](#module_core/Connector.Connector+startAnchor) : <code>string</code>
            * [.endObject](#module_core/Connector.Connector+endObject) : <code>Object</code> \| <code>null</code>
            * [.endAnchor](#module_core/Connector.Connector+endAnchor) : <code>string</code>
            * [.stroke](#module_core/Connector.Connector+stroke) : <code>string</code>
            * [.strokeWidth](#module_core/Connector.Connector+strokeWidth) : <code>number</code>
            * [.arrowStart](#module_core/Connector.Connector+arrowStart) : <code>boolean</code>
            * [.arrowEnd](#module_core/Connector.Connector+arrowEnd) : <code>boolean</code>
            * [.style](#module_core/Connector.Connector+style) : <code>&quot;straight&quot;</code> \| <code>&quot;orthogonal&quot;</code> \| <code>&quot;bezier&quot;</code> \| <code>&quot;polyline&quot;</code>
            * [.lineStyle](#module_core/Connector.Connector+lineStyle) : <code>&quot;solid&quot;</code> \| <code>&quot;dashed&quot;</code> \| <code>&quot;dotted&quot;</code>
            * [.zIndex](#module_core/Connector.Connector+zIndex) : <code>number</code>
            * [.visible](#module_core/Connector.Connector+visible) : <code>boolean</code>
            * [.selected](#module_core/Connector.Connector+selected) : <code>boolean</code>
            * [.connectionType](#module_core/Connector.Connector+connectionType) : <code>string</code> \| <code>null</code>
            * [.waypoints](#module_core/Connector.Connector+waypoints) : <code>Array.&lt;{x:number, y:number}&gt;</code>
            * [.controlPoint1](#module_core/Connector.Connector+controlPoint1) : <code>Object</code> \| <code>null</code>
            * [.controlPoint2](#module_core/Connector.Connector+controlPoint2) : <code>Object</code> \| <code>null</code>
            * [.label](#module_core/Connector.Connector+label) : <code>string</code>
            * [.generateId()](#module_core/Connector.Connector+generateId) ⇒ <code>string</code>
            * [.getStartAnchorInfo()](#module_core/Connector.Connector+getStartAnchorInfo) ⇒ <code>AnchorPoint</code> \| <code>null</code>
            * [.getEndAnchorInfo()](#module_core/Connector.Connector+getEndAnchorInfo) ⇒ <code>AnchorPoint</code> \| <code>null</code>
            * [.getStartPoint()](#module_core/Connector.Connector+getStartPoint) ⇒ <code>Object</code> \| <code>null</code>
            * [.getEndPoint()](#module_core/Connector.Connector+getEndPoint) ⇒ <code>Object</code> \| <code>null</code>
            * [.isDangling()](#module_core/Connector.Connector+isDangling) ⇒ <code>boolean</code>
            * [.getPathPoints()](#module_core/Connector.Connector+getPathPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
            * [.getBezierSamples([samples])](#module_core/Connector.Connector+getBezierSamples) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
            * [.containsPoint(x, y, [threshold])](#module_core/Connector.Connector+containsPoint) ⇒ <code>boolean</code>
            * ~~[.isNearLine()](#module_core/Connector.Connector+isNearLine)~~
            * [.getBezierPoint(t)](#module_core/Connector.Connector+getBezierPoint) ⇒ <code>Object</code>
            * [.getDefaultControlPoint1()](#module_core/Connector.Connector+getDefaultControlPoint1) ⇒ <code>Object</code>
            * [.getDefaultControlPoint2()](#module_core/Connector.Connector+getDefaultControlPoint2) ⇒ <code>Object</code>
            * [.getMidpoint()](#module_core/Connector.Connector+getMidpoint) ⇒ <code>Object</code> \| <code>null</code>
            * [.getArrowAngles()](#module_core/Connector.Connector+getArrowAngles) ⇒ <code>Object</code> \| <code>null</code>
            * [.draw(ctx)](#module_core/Connector.Connector+draw)
            * [.drawArrowWithAngle(ctx, point, angle)](#module_core/Connector.Connector+drawArrowWithAngle)
            * [.getBezierTangentAtStart()](#module_core/Connector.Connector+getBezierTangentAtStart) ⇒ <code>number</code>
            * [.getBezierTangentAtEnd()](#module_core/Connector.Connector+getBezierTangentAtEnd) ⇒ <code>number</code>
            * [.drawWaypoints(ctx)](#module_core/Connector.Connector+drawWaypoints)
            * [.drawControlPoints(ctx)](#module_core/Connector.Connector+drawControlPoints)
            * [.getLabelLayout([measure])](#module_core/Connector.Connector+getLabelLayout) ⇒ <code>Object</code> \| <code>null</code>
            * [.drawLabel(ctx)](#module_core/Connector.Connector+drawLabel)
            * [.toJSON()](#module_core/Connector.Connector+toJSON) ⇒ <code>Object</code>
        * _static_
            * [.orthogonalRoute(start, end, ns, ne, [stub])](#module_core/Connector.Connector.orthogonalRoute) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
            * [.isNearSegment(p1, p2, x, y, threshold)](#module_core/Connector.Connector.isNearSegment) ⇒ <code>boolean</code>
    * [.ORTHOGONAL_STUB](#module_core/Connector.ORTHOGONAL_STUB)

<a name="module_core/Connector.Connector"></a>

### core/Connector.Connector
**Kind**: static class of [<code>core/Connector</code>](#module_core/Connector)  

* [.Connector](#module_core/Connector.Connector)
    * [new exports.Connector(startObject, startAnchor, endObject, endAnchor, [connectionType])](#new_module_core/Connector.Connector_new)
    * _instance_
        * [.id](#module_core/Connector.Connector+id) : <code>string</code>
        * [.type](#module_core/Connector.Connector+type) : <code>string</code>
        * [.startObject](#module_core/Connector.Connector+startObject) : <code>Object</code>
        * [.startAnchor](#module_core/Connector.Connector+startAnchor) : <code>string</code>
        * [.endObject](#module_core/Connector.Connector+endObject) : <code>Object</code> \| <code>null</code>
        * [.endAnchor](#module_core/Connector.Connector+endAnchor) : <code>string</code>
        * [.stroke](#module_core/Connector.Connector+stroke) : <code>string</code>
        * [.strokeWidth](#module_core/Connector.Connector+strokeWidth) : <code>number</code>
        * [.arrowStart](#module_core/Connector.Connector+arrowStart) : <code>boolean</code>
        * [.arrowEnd](#module_core/Connector.Connector+arrowEnd) : <code>boolean</code>
        * [.style](#module_core/Connector.Connector+style) : <code>&quot;straight&quot;</code> \| <code>&quot;orthogonal&quot;</code> \| <code>&quot;bezier&quot;</code> \| <code>&quot;polyline&quot;</code>
        * [.lineStyle](#module_core/Connector.Connector+lineStyle) : <code>&quot;solid&quot;</code> \| <code>&quot;dashed&quot;</code> \| <code>&quot;dotted&quot;</code>
        * [.zIndex](#module_core/Connector.Connector+zIndex) : <code>number</code>
        * [.visible](#module_core/Connector.Connector+visible) : <code>boolean</code>
        * [.selected](#module_core/Connector.Connector+selected) : <code>boolean</code>
        * [.connectionType](#module_core/Connector.Connector+connectionType) : <code>string</code> \| <code>null</code>
        * [.waypoints](#module_core/Connector.Connector+waypoints) : <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.controlPoint1](#module_core/Connector.Connector+controlPoint1) : <code>Object</code> \| <code>null</code>
        * [.controlPoint2](#module_core/Connector.Connector+controlPoint2) : <code>Object</code> \| <code>null</code>
        * [.label](#module_core/Connector.Connector+label) : <code>string</code>
        * [.generateId()](#module_core/Connector.Connector+generateId) ⇒ <code>string</code>
        * [.getStartAnchorInfo()](#module_core/Connector.Connector+getStartAnchorInfo) ⇒ <code>AnchorPoint</code> \| <code>null</code>
        * [.getEndAnchorInfo()](#module_core/Connector.Connector+getEndAnchorInfo) ⇒ <code>AnchorPoint</code> \| <code>null</code>
        * [.getStartPoint()](#module_core/Connector.Connector+getStartPoint) ⇒ <code>Object</code> \| <code>null</code>
        * [.getEndPoint()](#module_core/Connector.Connector+getEndPoint) ⇒ <code>Object</code> \| <code>null</code>
        * [.isDangling()](#module_core/Connector.Connector+isDangling) ⇒ <code>boolean</code>
        * [.getPathPoints()](#module_core/Connector.Connector+getPathPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.getBezierSamples([samples])](#module_core/Connector.Connector+getBezierSamples) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.containsPoint(x, y, [threshold])](#module_core/Connector.Connector+containsPoint) ⇒ <code>boolean</code>
        * ~~[.isNearLine()](#module_core/Connector.Connector+isNearLine)~~
        * [.getBezierPoint(t)](#module_core/Connector.Connector+getBezierPoint) ⇒ <code>Object</code>
        * [.getDefaultControlPoint1()](#module_core/Connector.Connector+getDefaultControlPoint1) ⇒ <code>Object</code>
        * [.getDefaultControlPoint2()](#module_core/Connector.Connector+getDefaultControlPoint2) ⇒ <code>Object</code>
        * [.getMidpoint()](#module_core/Connector.Connector+getMidpoint) ⇒ <code>Object</code> \| <code>null</code>
        * [.getArrowAngles()](#module_core/Connector.Connector+getArrowAngles) ⇒ <code>Object</code> \| <code>null</code>
        * [.draw(ctx)](#module_core/Connector.Connector+draw)
        * [.drawArrowWithAngle(ctx, point, angle)](#module_core/Connector.Connector+drawArrowWithAngle)
        * [.getBezierTangentAtStart()](#module_core/Connector.Connector+getBezierTangentAtStart) ⇒ <code>number</code>
        * [.getBezierTangentAtEnd()](#module_core/Connector.Connector+getBezierTangentAtEnd) ⇒ <code>number</code>
        * [.drawWaypoints(ctx)](#module_core/Connector.Connector+drawWaypoints)
        * [.drawControlPoints(ctx)](#module_core/Connector.Connector+drawControlPoints)
        * [.getLabelLayout([measure])](#module_core/Connector.Connector+getLabelLayout) ⇒ <code>Object</code> \| <code>null</code>
        * [.drawLabel(ctx)](#module_core/Connector.Connector+drawLabel)
        * [.toJSON()](#module_core/Connector.Connector+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.orthogonalRoute(start, end, ns, ne, [stub])](#module_core/Connector.Connector.orthogonalRoute) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.isNearSegment(p1, p2, x, y, threshold)](#module_core/Connector.Connector.isNearSegment) ⇒ <code>boolean</code>

<a name="new_module_core/Connector.Connector_new"></a>

#### new exports.Connector(startObject, startAnchor, endObject, endAnchor, [connectionType])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| startObject | <code>Object</code> |  | Shape the connector starts at. |
| startAnchor | <code>string</code> |  | Anchor key on the start object. |
| endObject | <code>Object</code> \| <code>null</code> |  | Shape the connector ends at (null while being drawn). |
| endAnchor | <code>string</code> \| <code>null</code> |  | Anchor key on the end object. |
| [connectionType] | <code>string</code> \| <code>null</code> | <code>null</code> | Connection type id or null for untyped. |

<a name="module_core/Connector.Connector+id"></a>

#### connector.id : <code>string</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+type"></a>

#### connector.type : <code>string</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+startObject"></a>

#### connector.startObject : <code>Object</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+startAnchor"></a>

#### connector.startAnchor : <code>string</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+endObject"></a>

#### connector.endObject : <code>Object</code> \| <code>null</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+endAnchor"></a>

#### connector.endAnchor : <code>string</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+stroke"></a>

#### connector.stroke : <code>string</code>
Stroke colour

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+strokeWidth"></a>

#### connector.strokeWidth : <code>number</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+arrowStart"></a>

#### connector.arrowStart : <code>boolean</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+arrowEnd"></a>

#### connector.arrowEnd : <code>boolean</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+style"></a>

#### connector.style : <code>&quot;straight&quot;</code> \| <code>&quot;orthogonal&quot;</code> \| <code>&quot;bezier&quot;</code> \| <code>&quot;polyline&quot;</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+lineStyle"></a>

#### connector.lineStyle : <code>&quot;solid&quot;</code> \| <code>&quot;dashed&quot;</code> \| <code>&quot;dotted&quot;</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+zIndex"></a>

#### connector.zIndex : <code>number</code>
Connectors render below shapes by default

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+visible"></a>

#### connector.visible : <code>boolean</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+selected"></a>

#### connector.selected : <code>boolean</code>
Transient selection flag (not serialised)

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+connectionType"></a>

#### connector.connectionType : <code>string</code> \| <code>null</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+waypoints"></a>

#### connector.waypoints : <code>Array.&lt;{x:number, y:number}&gt;</code>
Intermediate points for polyline connectors

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+controlPoint1"></a>

#### connector.controlPoint1 : <code>Object</code> \| <code>null</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+controlPoint2"></a>

#### connector.controlPoint2 : <code>Object</code> \| <code>null</code>
**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+label"></a>

#### connector.label : <code>string</code>
Text label drawn at the middle of the connector

**Kind**: instance property of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+generateId"></a>

#### connector.generateId() ⇒ <code>string</code>
**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getStartAnchorInfo"></a>

#### connector.getStartAnchorInfo() ⇒ <code>AnchorPoint</code> \| <code>null</code>
Resolves the start anchor (position, normal, type info).

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getEndAnchorInfo"></a>

#### connector.getEndAnchorInfo() ⇒ <code>AnchorPoint</code> \| <code>null</code>
Resolves the end anchor. While a connector is being drawn (`endObject` null) the transient
`endX`/`endY` fields are used.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getStartPoint"></a>

#### connector.getStartPoint() ⇒ <code>Object</code> \| <code>null</code>
**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getEndPoint"></a>

#### connector.getEndPoint() ⇒ <code>Object</code> \| <code>null</code>
**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+isDangling"></a>

#### connector.isDangling() ⇒ <code>boolean</code>
True when one of the referenced anchor keys does not exist on its shape any more.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getPathPoints"></a>

#### connector.getPathPoints() ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
Ordered points of the connector path for straight, polyline and orthogonal styles.
Bezier connectors return the sampled curve (see [Connector#getBezierSamples](Connector#getBezierSamples)).

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
**Returns**: <code>Array.&lt;{x:number, y:number}&gt;</code> - Empty when an endpoint is unresolved.  
<a name="module_core/Connector.Connector+getBezierSamples"></a>

#### connector.getBezierSamples([samples]) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
Samples the bezier curve into a polyline.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Default |
| --- | --- | --- |
| [samples] | <code>number</code> | <code>24</code> | 

<a name="module_core/Connector.Connector+containsPoint"></a>

#### connector.containsPoint(x, y, [threshold]) ⇒ <code>boolean</code>
Hit test: is the point within `threshold` of the path?

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Default |
| --- | --- | --- |
| x | <code>number</code> |  | 
| y | <code>number</code> |  | 
| [threshold] | <code>number</code> | <code>5</code> | 

<a name="module_core/Connector.Connector+isNearLine"></a>

#### ~~connector.isNearLine()~~
***Use [Connector.isNearSegment](Connector.isNearSegment).***

Kept for backwards compatibility.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getBezierPoint"></a>

#### connector.getBezierPoint(t) ⇒ <code>Object</code>
Point on the cubic bezier at parameter `t`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| t | <code>number</code> | 0..1 |

<a name="module_core/Connector.Connector+getDefaultControlPoint1"></a>

#### connector.getDefaultControlPoint1() ⇒ <code>Object</code>
Default first control point (25% along, offset perpendicular).

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getDefaultControlPoint2"></a>

#### connector.getDefaultControlPoint2() ⇒ <code>Object</code>
Default second control point (75% along, offset perpendicular).

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getMidpoint"></a>

#### connector.getMidpoint() ⇒ <code>Object</code> \| <code>null</code>
Point halfway along the path (by length) plus the direction angle of that segment.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getArrowAngles"></a>

#### connector.getArrowAngles() ⇒ <code>Object</code> \| <code>null</code>
Arrow angles (radians) at both ends, pointing outwards along the path.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+draw"></a>

#### connector.draw(ctx)
Draws the connector.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/Connector.Connector+drawArrowWithAngle"></a>

#### connector.drawArrowWithAngle(ctx, point, angle)
Draws a filled arrow head at `point` pointing in direction `angle`.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> |  |
| point | <code>Object</code> |  |
| angle | <code>number</code> | Radians. |

<a name="module_core/Connector.Connector+getBezierTangentAtStart"></a>

#### connector.getBezierTangentAtStart() ⇒ <code>number</code>
Tangent angle at the start (pointing away from the curve).

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+getBezierTangentAtEnd"></a>

#### connector.getBezierTangentAtEnd() ⇒ <code>number</code>
Tangent angle at the end.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector+drawWaypoints"></a>

#### connector.drawWaypoints(ctx)
Draws polyline waypoint handles.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/Connector.Connector+drawControlPoints"></a>

#### connector.drawControlPoints(ctx)
Draws bezier control point handles and guide lines.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/Connector.Connector+getLabelLayout"></a>

#### connector.getLabelLayout([measure]) ⇒ <code>Object</code> \| <code>null</code>
Layout of the label box at the middle of the path.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Description |
| --- | --- | --- |
| [measure] | <code>function</code> | Text width measurer for the label font. |

<a name="module_core/Connector.Connector+drawLabel"></a>

#### connector.drawLabel(ctx)
Draws the label with a light background so it stays readable over the line.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/Connector.Connector+toJSON"></a>

#### connector.toJSON() ⇒ <code>Object</code>
Serialises the connector, storing object ids instead of references.

**Kind**: instance method of [<code>Connector</code>](#module_core/Connector.Connector)  
<a name="module_core/Connector.Connector.orthogonalRoute"></a>

#### Connector.orthogonalRoute(start, end, ns, ne, [stub]) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
Computes an orthogonal (right-angled) route between two points, leaving each endpoint along its
outward normal first.

**Kind**: static method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| start | <code>Object</code> |  |  |
| end | <code>Object</code> |  |  |
| ns | <code>Object</code> \| <code>null</code> |  | Outward unit normal at the start (null = free point). |
| ne | <code>Object</code> \| <code>null</code> |  | Outward unit normal at the end (null = free point). |
| [stub] | <code>number</code> | <code>ORTHOGONAL_STUB</code> |  |

<a name="module_core/Connector.Connector.isNearSegment"></a>

#### Connector.isNearSegment(p1, p2, x, y, threshold) ⇒ <code>boolean</code>
Distance test from a point to a segment.

**Kind**: static method of [<code>Connector</code>](#module_core/Connector.Connector)  

| Param | Type |
| --- | --- |
| p1 | <code>Object</code> | 
| p2 | <code>Object</code> | 
| x | <code>number</code> | 
| y | <code>number</code> | 
| threshold | <code>number</code> | 

<a name="module_core/Connector.ORTHOGONAL_STUB"></a>

### core/Connector.ORTHOGONAL\_STUB
Length of the straight stub leaving a port before an orthogonal connector turns.

**Kind**: static constant of [<code>core/Connector</code>](#module_core/Connector)  

