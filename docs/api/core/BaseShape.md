# BaseShape

_Source: `js/core/BaseShape.js`_

<a name="module_core/BaseShape"></a>

## core/BaseShape
Base class for all drawable shapes in the canvas. Provides common properties and methods for shape management, rendering, and interaction.

**Remarks**: - All specific shape classes (Rectangle, Server, NetworkSwitch, etc.) extend this base class.- Shapes should implement the `draw()` method to render themselves.- Geometry operations (move, resize, rotate) are handled by this base class.  
**See**

- module:shapes/Rectangle
- module:core/Connector

**Example**  
```js
const shape = new BaseShape(10, 20, 100, 60);shape.setSelected(true);shape.draw(ctx);
```

* [core/BaseShape](#module_core/BaseShape)
    * [.BaseShape](#module_core/BaseShape.BaseShape) ⇐ <code>Object</code>
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
            * [.groupId](#module_core/BaseShape.BaseShape+groupId) : <code>string</code> \| <code>null</code>
            * [.generateId()](#module_core/BaseShape.BaseShape+generateId) ⇒ <code>string</code>
            * [.getBounds()](#module_core/BaseShape.BaseShape+getBounds) ⇒ <code>Object</code>
            * [.containsPoint(x, y)](#module_core/BaseShape.BaseShape+containsPoint) ⇒ <code>boolean</code>
            * [.rotatePoint(x, y)](#module_core/BaseShape.BaseShape+rotatePoint) ⇒ <code>Object</code>
            * [.getRotatedBounds()](#module_core/BaseShape.BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
            * [.getAnchorPoints()](#module_core/BaseShape.BaseShape+getAnchorPoints) ⇒ <code>Object.&lt;string, {x:number, y:number}&gt;</code>
            * [.move(dx, dy)](#module_core/BaseShape.BaseShape+move)
            * [.resize(width, height)](#module_core/BaseShape.BaseShape+resize)
            * [.applyRotation(ctx)](#module_core/BaseShape.BaseShape+applyRotation)
            * [.applyShadow(ctx)](#module_core/BaseShape.BaseShape+applyShadow)
            * [.clearShadow(ctx)](#module_core/BaseShape.BaseShape+clearShadow)
            * [.draw(ctx)](#module_core/BaseShape.BaseShape+draw)
            * [.clone()](#module_core/BaseShape.BaseShape+clone) ⇒ <code>BaseShape</code>
            * [.toJSON()](#module_core/BaseShape.BaseShape+toJSON) ⇒ <code>Object</code>
        * _static_
            * [.fromJSON(data)](#module_core/BaseShape.BaseShape.fromJSON) ⇒ <code>BaseShape</code>

<a name="module_core/BaseShape.BaseShape"></a>

### core/BaseShape.BaseShape ⇐ <code>Object</code>
Base class for all drawable shapes in the canvas.

**Kind**: static class of [<code>core/BaseShape</code>](#module_core/BaseShape)  
**Extends**: <code>Object</code>  

* [.BaseShape](#module_core/BaseShape.BaseShape) ⇐ <code>Object</code>
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
        * [.groupId](#module_core/BaseShape.BaseShape+groupId) : <code>string</code> \| <code>null</code>
        * [.generateId()](#module_core/BaseShape.BaseShape+generateId) ⇒ <code>string</code>
        * [.getBounds()](#module_core/BaseShape.BaseShape+getBounds) ⇒ <code>Object</code>
        * [.containsPoint(x, y)](#module_core/BaseShape.BaseShape+containsPoint) ⇒ <code>boolean</code>
        * [.rotatePoint(x, y)](#module_core/BaseShape.BaseShape+rotatePoint) ⇒ <code>Object</code>
        * [.getRotatedBounds()](#module_core/BaseShape.BaseShape+getRotatedBounds) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.getAnchorPoints()](#module_core/BaseShape.BaseShape+getAnchorPoints) ⇒ <code>Object.&lt;string, {x:number, y:number}&gt;</code>
        * [.move(dx, dy)](#module_core/BaseShape.BaseShape+move)
        * [.resize(width, height)](#module_core/BaseShape.BaseShape+resize)
        * [.applyRotation(ctx)](#module_core/BaseShape.BaseShape+applyRotation)
        * [.applyShadow(ctx)](#module_core/BaseShape.BaseShape+applyShadow)
        * [.clearShadow(ctx)](#module_core/BaseShape.BaseShape+clearShadow)
        * [.draw(ctx)](#module_core/BaseShape.BaseShape+draw)
        * [.clone()](#module_core/BaseShape.BaseShape+clone) ⇒ <code>BaseShape</code>
        * [.toJSON()](#module_core/BaseShape.BaseShape+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.fromJSON(data)](#module_core/BaseShape.BaseShape.fromJSON) ⇒ <code>BaseShape</code>

<a name="new_module_core/BaseShape.BaseShape_new"></a>

#### new exports.BaseShape(x, y, width, height)
Creates a new BaseShape instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the shape's top-left corner in canvas coordinates. |
| y | <code>number</code> | Y-coordinate of the shape's top-left corner in canvas coordinates. |
| width | <code>number</code> | Width of the shape in pixels. |
| height | <code>number</code> | Height of the shape in pixels. |

**Example**  
```js
const shape = new BaseShape(10, 20, 100, 60);
```
<a name="module_core/BaseShape.BaseShape+id"></a>

#### baseShape.id : <code>string</code>
Unique identifier for the shape

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+type"></a>

#### baseShape.type : <code>string</code>
Type identifier for the shape (overridden by subclasses)

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+x"></a>

#### baseShape.x : <code>number</code>
X-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+y"></a>

#### baseShape.y : <code>number</code>
Y-coordinate of the shape's top-left corner

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+width"></a>

#### baseShape.width : <code>number</code>
Width of the shape in pixels

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+height"></a>

#### baseShape.height : <code>number</code>
Height of the shape in pixels

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+fill"></a>

#### baseShape.fill : <code>string</code>
Fill color in hex format

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+stroke"></a>

#### baseShape.stroke : <code>string</code>
Stroke color in hex format

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+strokeWidth"></a>

#### baseShape.strokeWidth : <code>number</code>
Width of the stroke in pixels

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+rotation"></a>

#### baseShape.rotation : <code>number</code>
Rotation angle in radians

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadow"></a>

#### baseShape.shadow : <code>boolean</code>
Whether shadow rendering is enabled

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadowBlur"></a>

#### baseShape.shadowBlur : <code>number</code>
Shadow blur radius in pixels

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadowColor"></a>

#### baseShape.shadowColor : <code>string</code>
Shadow color in rgba format

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadowOffsetX"></a>

#### baseShape.shadowOffsetX : <code>number</code>
Shadow horizontal offset in pixels

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+shadowOffsetY"></a>

#### baseShape.shadowOffsetY : <code>number</code>
Shadow vertical offset in pixels

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+zIndex"></a>

#### baseShape.zIndex : <code>number</code>
Z-index for rendering order (higher values render on top)

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+locked"></a>

#### baseShape.locked : <code>boolean</code>
Whether the shape is locked from editing

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+visible"></a>

#### baseShape.visible : <code>boolean</code>
Whether the shape is visible on canvas

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+groupId"></a>

#### baseShape.groupId : <code>string</code> \| <code>null</code>
Group identifier for grouped shapes

**Kind**: instance property of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
<a name="module_core/BaseShape.BaseShape+generateId"></a>

#### baseShape.generateId() ⇒ <code>string</code>
Generates a unique identifier for the shape.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>string</code> - Unique ID combining timestamp and random string.  
**Example**  
```js
const id = shape.generateId(); // Returns something like 'shape_1234567890_abc123xyz'
```
<a name="module_core/BaseShape.BaseShape+getBounds"></a>

#### baseShape.getBounds() ⇒ <code>Object</code>
Gets the bounding box of the shape for hit detection.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>Object</code> - Bounding box coordinates and dimensions.  
**Example**  
```js
const bounds = shape.getBounds();console.log(`Shape at (${bounds.x}, ${bounds.y}) size ${bounds.width}x${bounds.height}`);
```
<a name="module_core/BaseShape.BaseShape+containsPoint"></a>

#### baseShape.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the shape's bounds.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>boolean</code> - True if point is inside shape bounds.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test. |
| y | <code>number</code> | Y-coordinate of the point to test. |

**Example**  
```js
if (shape.containsPoint(50, 30)) {  console.log('Point is inside shape');}
```
<a name="module_core/BaseShape.BaseShape+rotatePoint"></a>

#### baseShape.rotatePoint(x, y) ⇒ <code>Object</code>
Rotates a point around the shape's center based on the shape's rotation angle.Uses standard 2D rotation matrix transformation. If the shape has no rotation,returns the original coordinates unchanged.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>Object</code> - Rotated point coordinates.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to rotate. |
| y | <code>number</code> | Y-coordinate of the point to rotate. |

**Example**  
```js
const rotated = shape.rotatePoint(100, 50);
```
<a name="module_core/BaseShape.BaseShape+getRotatedBounds"></a>

#### baseShape.getRotatedBounds() ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
Gets the four corners of the shape's bounding box after rotation is applied.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>Array.&lt;{x:number, y:number}&gt;</code> - Array of four corner points.  
**Example**  
```js
const corners = shape.getRotatedBounds();// corners = [{x:0, y:0}, {x:100, y:0}, {x:100, y:60}, {x:0, y:60}]
```
<a name="module_core/BaseShape.BaseShape+getAnchorPoints"></a>

#### baseShape.getAnchorPoints() ⇒ <code>Object.&lt;string, {x:number, y:number}&gt;</code>
Gets anchor points for connecting lines to this shape.Returns points at top, right, bottom, left edges and center. Anchor pointsare automatically rotated if the shape is rotated. Subclasses override thisto provide port-specific anchor points.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>Object.&lt;string, {x:number, y:number}&gt;</code> - Dictionary of anchor points keyed by position name (top, right, bottom, left, center).  
**Example**  
```js
const anchors = shape.getAnchorPoints();const topPoint = anchors.top; // {x: 50, y: 0}
```
<a name="module_core/BaseShape.BaseShape+move"></a>

#### baseShape.move(dx, dy)
Moves the shape by a delta amount in x and y directions.Movement is prevented if the shape is locked.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | Change in x position. |
| dy | <code>number</code> | Change in y position. |

**Example**  
```js
shape.move(10, 20); // Moves shape 10 pixels right, 20 pixels down
```
<a name="module_core/BaseShape.BaseShape+resize"></a>

#### baseShape.resize(width, height)
Resizes the shape to new dimensions.Resizing is prevented if the shape is locked.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | New width in pixels. |
| height | <code>number</code> | New height in pixels. |

**Example**  
```js
shape.resize(200, 100); // Sets shape to 200x100 pixels
```
<a name="module_core/BaseShape.BaseShape+applyRotation"></a>

#### baseShape.applyRotation(ctx)
Applies rotation transformation to the canvas context.Rotates around the shape's center point. This should be called before drawingthe shape to apply rotation visually.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |

**Example**  
```js
ctx.save();shape.applyRotation(ctx);// Draw shape content herectx.restore();
```
<a name="module_core/BaseShape.BaseShape+applyShadow"></a>

#### baseShape.applyShadow(ctx)
Applies shadow effects to the canvas context if shadow is enabled.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |

**Example**  
```js
shape.applyShadow(ctx);// Subsequent drawing operations will have shadow
```
<a name="module_core/BaseShape.BaseShape+clearShadow"></a>

#### baseShape.clearShadow(ctx)
Clears shadow effects from the canvas context.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |

<a name="module_core/BaseShape.BaseShape+draw"></a>

#### baseShape.draw(ctx)
Draws the shape on the canvas.Must be overridden by subclasses to provide shape-specific rendering logic.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Throws**:

- <code>Error</code> If not implemented by subclass.


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |

**Example**  
```js
// In subclass:draw(ctx) {  ctx.fillRect(this.x, this.y, this.width, this.height);}
```
<a name="module_core/BaseShape.BaseShape+clone"></a>

#### baseShape.clone() ⇒ <code>BaseShape</code>
Creates a deep copy of the shape with a new unique ID.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>BaseShape</code> - Cloned shape instance.  
**Example**  
```js
const cloned = shape.clone();cloned.id !== shape.id; // true - new ID assigned
```
<a name="module_core/BaseShape.BaseShape+toJSON"></a>

#### baseShape.toJSON() ⇒ <code>Object</code>
Serializes the shape to a JSON-compatible object for saving.

**Kind**: instance method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>Object</code> - JSON representation of the shape with all properties.  
**Example**  
```js
const json = shape.toJSON();localStorage.setItem('shape', JSON.stringify(json));
```
<a name="module_core/BaseShape.BaseShape.fromJSON"></a>

#### BaseShape.fromJSON(data) ⇒ <code>BaseShape</code>
Restores a shape from a JSON object.

**Kind**: static method of [<code>BaseShape</code>](#module_core/BaseShape.BaseShape)  
**Returns**: <code>BaseShape</code> - Restored shape instance.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | JSON data containing shape properties. |
| data.x | <code>number</code> | X-coordinate. |
| data.y | <code>number</code> | Y-coordinate. |
| data.width | <code>number</code> | Width. |
| data.height | <code>number</code> | Height. |

**Example**  
```js
const json = JSON.parse(localStorage.getItem('shape'));const restored = BaseShape.fromJSON(json);
```

