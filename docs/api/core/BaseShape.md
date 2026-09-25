# BaseShape

_Source: `js/core/BaseShape.js`_

<a name="module_core/BaseShape"></a>

## core/BaseShape
Base class for all drawable shapes. Provides geometry (bounds, rotation, hit testing),
generic anchor points, label rendering and JSON serialisation. Every concrete shape
(Rectangle, Server, Device, ...) extends this class.

**Remarks**: - Coordinates are canvas ("world") coordinates; `x`/`y` is the unrotated top-left corner.
- `rotation` is in radians and is applied around the shape centre.
- Shapes never touch the DOM, so this module also runs headless in Node (MCP server, tests).  
**See**

- module:core/Connector
- module:core/SystemObject

**Example**  
```js
const rect = new Rectangle(10, 10, 120, 60);
rect.label = 'Ingest';
rect.containsPoint(20, 20); // true
```

* [core/BaseShape](#module_core/BaseShape)
    * _static_
        * [.BaseShape](#module_core/BaseShape.BaseShape)
            * [new exports.BaseShape(x, y, width, height)](#new_module_core/BaseShape.BaseShape_new)
            * _instance_
                * [.id](#module_core/BaseShape.BaseShape+id) : <code>string</code>
                * [.type](#module_core/BaseShape.BaseShape+type) : <code>string</code>
                * [.x](#module_core/BaseShape.BaseShape+x) : <code>number</code>
                * [.y](#module_core/BaseShape.BaseShape+y) : <code>number</code>
                * [.width](#module_core/BaseShape.BaseShape+width) : <code>number</code>
                * [.height](#module_core/BaseShape.BaseShape+height) : <code>number</code>
                * [.fill](#module_core/BaseShape.BaseShape+fill) : <code>string</code>
                * [.stroke](#module_core/BaseShape.BaseShape+stroke) : <code>string</code>
                * [.strokeWidth](#module_core/BaseShape.BaseShape+strokeWidth) : <code>number</code>
                * [.rotation](#module_core/BaseShape.BaseShape+rotation) : <code>number</code>
                * [.shadow](#module_core/BaseShape.BaseShape+shadow) : <code>boolean</code>
                * [.shadowBlur](#module_core/BaseShape.BaseShape+shadowBlur) : <code>number</code>
                * [.shadowColor](#module_core/BaseShape.BaseShape+shadowColor) : <code>string</code>
                * [.shadowOffsetX](#module_core/BaseShape.BaseShape+shadowOffsetX) : <code>number</code>
                * [.shadowOffsetY](#module_core/BaseShape.BaseShape+shadowOffsetY) : <code>number</code>
                * [.zIndex](#module_core/BaseShape.BaseShape+zIndex) : <code>number</code>
                * [.locked](#module_core/BaseShape.BaseShape+locked) : <code>boolean</code>
                * [.visible](#module_core/BaseShape.BaseShape+visible) : <code>boolean</code>
                * [.groupId](#module_core/BaseShape.BaseShape+groupId) : <code>number</code> \| <code>string</code> \| <code>null</code>
                * [.label](#module_core/BaseShape.BaseShape+label) : <code>string</code>
                * [.labelPosition](#module_core/BaseShape.BaseShape+labelPosition) : <code>&quot;inside&quot;</code> \| <code>&quot;bottom&quot;</code> \| <code>&quot;below&quot;</code> \| <code>&quot;above&quot;</code>
                * [.labelFontSize](#module_core/BaseShape.BaseShape+labelFontSize) : <code>number</code>
                * [.description](#module_core/BaseShape.BaseShape+description) : <code>string</code>
                * [.generateId()](#module_core/BaseShape.BaseShape+generateId) ⇒ <code>string</code>
                * [.getBounds()](#module_core/BaseShape.BaseShape+getBounds) ⇒ <code>Object</code>
                * [.getCenter()](#module_core/BaseShape.BaseShape+getCenter) ⇒ <code>Object</code>
                * [.toLocalPoint(x, y)](#module_core/BaseShape.BaseShape+toLocalPoint) ⇒ <code>Object</code>
                * [.containsPoint(x, y)](#module_core/BaseShape.BaseShape+containsPoint) ⇒ <code>boolean</code>
                * [.rotatePoint(x, y)](#module_core/BaseShape.BaseShape+rotatePoint) ⇒ <code>Object</code>
                * [.rotateVector(v)](#module_core/BaseShape.BaseShape+rotateVector) ⇒ <code>Object</code> \| <code>null</code>
                * [.getRotatedBounds()](#module_core/BaseShape.BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
                * [.getAnchorPoints()](#module_core/BaseShape.BaseShape+getAnchorPoints) ⇒ <code>Object.&lt;string, AnchorPoint&gt;</code>
                * [.move(dx, dy)](#module_core/BaseShape.BaseShape+move)
                * [.resize(width, height)](#module_core/BaseShape.BaseShape+resize)
                * [.applyRotation(ctx)](#module_core/BaseShape.BaseShape+applyRotation)
                * [.applyShadow(ctx)](#module_core/BaseShape.BaseShape+applyShadow)
                * [.clearShadow(ctx)](#module_core/BaseShape.BaseShape+clearShadow)
                * *[.draw(ctx)](#module_core/BaseShape.BaseShape+draw)*
                * [.getLabelLayout([measure])](#module_core/BaseShape.BaseShape+getLabelLayout) ⇒ <code>Object</code> \| <code>null</code>
                * [.drawLabel(ctx)](#module_core/BaseShape.BaseShape+drawLabel)
                * [.clone()](#module_core/BaseShape.BaseShape+clone) ⇒ <code>BaseShape</code>
                * [.toJSON()](#module_core/BaseShape.BaseShape+toJSON) ⇒ <code>Object</code>
            * _static_
                * [.fromJSON(data)](#module_core/BaseShape.BaseShape.fromJSON) ⇒ <code>BaseShape</code>
    * _inner_
        * [~AnchorPoint](#module_core/BaseShape..AnchorPoint) : <code>Object</code>

<a name="module_core/BaseShape.BaseShape"></a>

### core/BaseShape.BaseShape
**Kind**: static class of [<code>core/BaseShape</code>](#module_core/BaseShape)  

* [.BaseShape](#module_core/BaseShape.BaseShape)
    * [new exports.BaseShape(x, y, width, height)](#new_module_core/BaseShape.BaseShape_new)
    * _instance_
        * [.id](#module_core/BaseShape.BaseShape+id) : <code>string</code>
        * [.type](#module_core/BaseShape.BaseShape+type) : <code>string</code>
        * [.x](#module_core/BaseShape.BaseShape+x) : <code>number</code>
        * [.y](#module_core/BaseShape.BaseShape+y) : <code>number</code>
        * [.width](#module_core/BaseShape.BaseShape+width) : <code>number</code>
        * [.height](#module_core/BaseShape.BaseShape+height) : <code>number</code>
        * [.fill](#module_core/BaseShape.BaseShape+fill) : <code>string</code>
        * [.stroke](#module_core/BaseShape.BaseShape+stroke) : <code>string</code>
        * [.strokeWidth](#module_core/BaseShape.BaseShape+strokeWidth) : <code>number</code>
        * [.rotation](#module_core/BaseShape.BaseShape+rotation) : <code>number</code>
        * [.shadow](#module_core/BaseShape.BaseShape+shadow) : <code>boolean</code>
        * [.shadowBlur](#module_core/BaseShape.BaseShape+shadowBlur) : <code>number</code>
        * [.shadowColor](#module_core/BaseShape.BaseShape+shadowColor) : <code>string</code>
        * [.shadowOffsetX](#module_core/BaseShape.BaseShape+shadowOffsetX) : <code>number</code>
        * [.shadowOffsetY](#module_core/BaseShape.BaseShape+shadowOffsetY) : <code>number</code>
        * [.zIndex](#module_core/BaseShape.BaseShape+zIndex) : <code>number</code>
        * [.locked](#module_core/BaseShape.BaseShape+locked) : <code>boolean</code>
        * [.visible](#module_core/BaseShape.BaseShape+visible) : <code>boolean</code>
        * [.groupId](#module_core/BaseShape.BaseShape+groupId) : <code>number</code> \| <code>string</code> \| <code>null</code>
        * [.label](#module_core/BaseShape.BaseShape+label) : <code>string</code>
        * [.labelPosition](#module_core/BaseShape.BaseShape+labelPosition) : <code>&quot;inside&quot;</code> \| <code>&quot;bottom&quot;</code> \| <code>&quot;below&quot;</code> \| <code>&quot;above&quot;</code>
        * [.labelFontSize](#module_core/BaseShape.BaseShape+labelFontSize) : <code>number</code>
        * [.description](#module_core/BaseShape.BaseShape+description) : <code>string</code>
        * [.generateId()](#module_core/BaseShape.BaseShape+generateId) ⇒ <code>string</code>
        * [.getBounds()](#module_core/BaseShape.BaseShape+getBounds) ⇒ <code>Object</code>
        * [.getCenter()](#module_core/BaseShape.BaseShape+getCenter) ⇒ <code>Object</code>
        * [.toLocalPoint(x, y)](#module_core/BaseShape.BaseShape+toLocalPoint) ⇒ <code>Object</code>
        * [.containsPoint(x, y)](#module_core/BaseShape.BaseShape+containsPoint) ⇒ <code>boolean</code>
        * [.rotatePoint(x, y)](#module_core/BaseShape.BaseShape+rotatePoint) ⇒ <code>Object</code>
        * [.rotateVector(v)](#module_core/BaseShape.BaseShape+rotateVector) ⇒ <code>Object</code> \| <code>null</code>
        * [.getRotatedBounds()](#module_core/BaseShape.BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.getAnchorPoints()](#module_core/BaseShape.BaseShape+getAnchorPoints) ⇒ <code>Object.&lt;string, AnchorPoint&gt;</code>
        * [.move(dx, dy)](#module_core/BaseShape.BaseShape+move)
        * [.resize(width, height)](#module_core/BaseShape.BaseShape+resize)
        * [.applyRotation(ctx)](#module_core/BaseShape.BaseShape+applyRotation)
        * [.applyShadow(ctx)](#module_core/BaseShape.BaseShape+applyShadow)
        * [.clearShadow(ctx)](#module_core/BaseShape.BaseShape+clearShadow)
        * *[.draw(ctx)](#module_core/BaseShape.BaseShape+draw)*
        * [.getLabelLayout([measure])](#module_core/BaseShape.BaseShape+getLabelLayout) ⇒ <code>Object</code> \| <code>null</code>
        * [.drawLabel(ctx)](#module_core/BaseShape.BaseShape+drawLabel)
        * [.clone()](#module_core/BaseShape.BaseShape+clone) ⇒ <code>BaseShape</code>
        * [.toJSON()](#module_core/BaseShape.BaseShape+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.fromJSON(data)](#module_core/BaseShape.BaseShape.fromJSON) ⇒ <code>BaseShape</code>

<a name="new_module_core/BaseShape.BaseShape_new"></a>

#### new exports.BaseShape(x, y, width, height)

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Top-left x. |
| y | <code>number</code> | Top-left y. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |

<a name="module_core/BaseShape.BaseShape+id"></a>

#### baseShape.id : <code>string</code>
Unique identifier

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+type"></a>

#### baseShape.type : <code>string</code>
Type identifier (overridden by subclasses)

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+x"></a>

#### baseShape.x : <code>number</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+y"></a>

#### baseShape.y : <code>number</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+width"></a>

#### baseShape.width : <code>number</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+height"></a>

#### baseShape.height : <code>number</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+fill"></a>

#### baseShape.fill : <code>string</code>
Fill colour

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+stroke"></a>

#### baseShape.stroke : <code>string</code>
Stroke colour

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+strokeWidth"></a>

#### baseShape.strokeWidth : <code>number</code>
Stroke width in pixels

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+rotation"></a>

#### baseShape.rotation : <code>number</code>
Rotation in radians

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadow"></a>

#### baseShape.shadow : <code>boolean</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadowBlur"></a>

#### baseShape.shadowBlur : <code>number</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadowColor"></a>

#### baseShape.shadowColor : <code>string</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadowOffsetX"></a>

#### baseShape.shadowOffsetX : <code>number</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadowOffsetY"></a>

#### baseShape.shadowOffsetY : <code>number</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+zIndex"></a>

#### baseShape.zIndex : <code>number</code>
Render order (higher on top)

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+locked"></a>

#### baseShape.locked : <code>boolean</code>
Locked shapes cannot be moved or resized

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+visible"></a>

#### baseShape.visible : <code>boolean</code>
**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+groupId"></a>

#### baseShape.groupId : <code>number</code> \| <code>string</code> \| <code>null</code>
Group identifier shared by grouped shapes

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+label"></a>

#### baseShape.label : <code>string</code>
Display label (device name, node title, ...). Empty string = no label.

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+labelPosition"></a>

#### baseShape.labelPosition : <code>&quot;inside&quot;</code> \| <code>&quot;bottom&quot;</code> \| <code>&quot;below&quot;</code> \| <code>&quot;above&quot;</code>
Where the label is drawn relative to the shape.

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+labelFontSize"></a>

#### baseShape.labelFontSize : <code>number</code>
Label font size in pixels

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+description"></a>

#### baseShape.description : <code>string</code>
Free-form notes (IP address, model number, ...). Not rendered.

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+generateId"></a>

#### baseShape.generateId() ⇒ <code>string</code>
Generates a unique identifier.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+getBounds"></a>

#### baseShape.getBounds() ⇒ <code>Object</code>
Axis-aligned bounds of the unrotated shape. Negative sizes (while dragging) are normalised.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+getCenter"></a>

#### baseShape.getCenter() ⇒ <code>Object</code>
Centre point of the shape.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+toLocalPoint"></a>

#### baseShape.toLocalPoint(x, y) ⇒ <code>Object</code>
Converts a world point into the shape's unrotated local frame (inverse rotation about the centre).

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="module_core/BaseShape.BaseShape+containsPoint"></a>

#### baseShape.containsPoint(x, y) ⇒ <code>boolean</code>
Hit test against the (rotation-aware) bounding box. Subclasses refine this for their geometry.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="module_core/BaseShape.BaseShape+rotatePoint"></a>

#### baseShape.rotatePoint(x, y) ⇒ <code>Object</code>
Rotates a point around the shape's centre by the shape's rotation.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="module_core/BaseShape.BaseShape+rotateVector"></a>

#### baseShape.rotateVector(v) ⇒ <code>Object</code> \| <code>null</code>
Rotates a direction vector by the shape's rotation.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| v | <code>Object</code> \| <code>null</code> | 

<a name="module_core/BaseShape.BaseShape+getRotatedBounds"></a>

#### baseShape.getRotatedBounds() ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
The four corners of the bounding box after rotation.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+getAnchorPoints"></a>

#### baseShape.getAnchorPoints() ⇒ <code>Object.&lt;string, AnchorPoint&gt;</code>
Generic anchor points (`top`, `right`, `bottom`, `left`, `center`) for connectors.
Subclasses with ports override this.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+move"></a>

#### baseShape.move(dx, dy)
Moves the shape unless it is locked.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| dx | <code>number</code> | 
| dy | <code>number</code> | 

<a name="module_core/BaseShape.BaseShape+resize"></a>

#### baseShape.resize(width, height)
Resizes the shape unless it is locked.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_core/BaseShape.BaseShape+applyRotation"></a>

#### baseShape.applyRotation(ctx)
Applies the shape's rotation to a canvas context (rotates about the centre).

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/BaseShape.BaseShape+applyShadow"></a>

#### baseShape.applyShadow(ctx)
Enables the drop shadow on a canvas context when `shadow` is set.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/BaseShape.BaseShape+clearShadow"></a>

#### baseShape.clearShadow(ctx)
Disables the drop shadow.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/BaseShape.BaseShape+draw"></a>

#### *baseShape.draw(ctx)*
Draws the shape. Must be implemented by subclasses.

**Kind**: instance abstract method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Throws**:

- <code>Error</code> Always, unless overridden.


| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/BaseShape.BaseShape+getLabelLayout"></a>

#### baseShape.getLabelLayout([measure]) ⇒ <code>Object</code> \| <code>null</code>
Computes where and how the label should be drawn. Shared by the canvas renderer and the SVG exporter.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>Object</code> \| <code>null</code> - `y` is the vertical centre of the text block. Null when there is no label.  

| Param | Type | Description |
| --- | --- | --- |
| [measure] | <code>function</code> | Text measurer `(text, cssFont) => width`; when omitted an   approximation is used. |

<a name="module_core/BaseShape.BaseShape+drawLabel"></a>

#### baseShape.drawLabel(ctx)
Draws the label (if any). Call inside the rotated context, after the body has been drawn.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/BaseShape.BaseShape+clone"></a>

#### baseShape.clone() ⇒ <code>BaseShape</code>
Deep copy with a fresh id.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+toJSON"></a>

#### baseShape.toJSON() ⇒ <code>Object</code>
Serialises the shape.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape.fromJSON"></a>

#### BaseShape.fromJSON(data) ⇒ <code>BaseShape</code>
Restores a shape of this class from JSON.

**Kind**: static method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="module_core/BaseShape..AnchorPoint"></a>

### core/BaseShape~AnchorPoint : <code>Object</code>
**Kind**: inner typedef of [<code>core/BaseShape</code>](#module_core/BaseShape)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| x | <code>number</code> |  |
| y | <code>number</code> |  |
| [side] | <code>string</code> | `top` | `right` | `bottom` | `left` (absent for centre / free anchors). |
| [normal] | <code>Object</code> \| <code>null</code> | Unit vector pointing away from the shape (rotated). |
| [connectionType] | <code>string</code> \| <code>null</code> | Connection type for typed ports, null for wildcard anchors. |
| [portType] | <code>&quot;input&quot;</code> \| <code>&quot;output&quot;</code> \| <code>&quot;both&quot;</code> |  |
| [label] | <code>string</code> | Human readable port name. |


