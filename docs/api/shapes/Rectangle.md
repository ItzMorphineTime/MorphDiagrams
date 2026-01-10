# Rectangle

_Source: `js/shapes/Rectangle.js`_

<a name="module_shapes/Rectangle"></a>

## shapes/Rectangle
Rectangular diagram shape with optional rounded corners. Extends BaseShape to provide rectangular geometry and rendering.

**Remarks**: - Supports corner radius for rounded rectangles.- All rectangular properties (x, y, width, height) are inherited from BaseShape.  
**See**: module:core/BaseShape  
**Example**  
```js
const rect = new Rectangle(10, 20, 120, 60);rect.cornerRadius = 5;rect.draw(ctx);
```

* [shapes/Rectangle](#module_shapes/Rectangle)
    * [.Rectangle](#module_shapes/Rectangle.Rectangle) ⇐ <code>BaseShape</code>
        * [new exports.Rectangle(x, y, width, height)](#new_module_shapes/Rectangle.Rectangle_new)
        * [.cornerRadius](#module_shapes/Rectangle.Rectangle+cornerRadius) : <code>number</code>
        * [.draw(ctx)](#module_shapes/Rectangle.Rectangle+draw)
        * [.toJSON()](#module_shapes/Rectangle.Rectangle+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/Rectangle.Rectangle"></a>

### shapes/Rectangle.Rectangle ⇐ <code>BaseShape</code>
Represents a rectangular diagram shape.

**Kind**: static class of [<code>shapes/Rectangle</code>](#module_shapes/Rectangle)  
**Extends**: <code>BaseShape</code>  

* [.Rectangle](#module_shapes/Rectangle.Rectangle) ⇐ <code>BaseShape</code>
    * [new exports.Rectangle(x, y, width, height)](#new_module_shapes/Rectangle.Rectangle_new)
    * [.cornerRadius](#module_shapes/Rectangle.Rectangle+cornerRadius) : <code>number</code>
    * [.draw(ctx)](#module_shapes/Rectangle.Rectangle+draw)
    * [.toJSON()](#module_shapes/Rectangle.Rectangle+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/Rectangle.Rectangle_new"></a>

#### new exports.Rectangle(x, y, width, height)
Creates a new Rectangle instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner. |
| y | <code>number</code> | Y-coordinate of top-left corner. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |

**Example**  
```js
const rect = new Rectangle(10, 20, 120, 60);
```
<a name="module_shapes/Rectangle.Rectangle+cornerRadius"></a>

#### rectangle.cornerRadius : <code>number</code>
Corner radius for rounded rectangles (0 = sharp corners).

**Kind**: instance property of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  
<a name="module_shapes/Rectangle.Rectangle+draw"></a>

#### rectangle.draw(ctx)
Draws the rectangle on the canvas.Uses rounded rectangle rendering if cornerRadius > 0, otherwise draws a standard rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |

<a name="module_shapes/Rectangle.Rectangle+toJSON"></a>

#### rectangle.toJSON() ⇒ <code>Object</code>
Serializes the rectangle to JSON, including cornerRadius.

**Kind**: instance method of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  
**Returns**: <code>Object</code> - JSON representation with all properties.  

