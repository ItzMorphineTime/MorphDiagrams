# BaseShape

_Source: `js/core/BaseShape.js`_

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


