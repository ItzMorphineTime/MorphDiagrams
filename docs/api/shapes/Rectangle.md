# Rectangle

_Source: `js/shapes/Rectangle.js`_

<a name="module_shapes/Rectangle"></a>

## shapes/Rectangle
Diagram shape implementation for `Rectangle`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { Rectangle } from './shapes/Rectangle.js';
```

* [shapes/Rectangle](#module_shapes/Rectangle)
    * _static_
        * [.Rectangle](#module_shapes/Rectangle.Rectangle)
            * [new exports.Rectangle(x, y, width, height)](#new_module_shapes/Rectangle.Rectangle_new)
            * [.draw(ctx)](#module_shapes/Rectangle.Rectangle+draw)
            * [.drawRoundedRect(ctx)](#module_shapes/Rectangle.Rectangle+drawRoundedRect)
            * [.toJSON()](#module_shapes/Rectangle.Rectangle+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~Rectangle](#module_shapes/Rectangle..Rectangle) ⇐ <code>BaseShape</code>
            * [new Rectangle()](#new_module_shapes/Rectangle..Rectangle_new)

<a name="module_shapes/Rectangle.Rectangle"></a>

### shapes/Rectangle.Rectangle
**Kind**: static class of [<code>shapes/Rectangle</code>](#module_shapes/Rectangle)  

* [.Rectangle](#module_shapes/Rectangle.Rectangle)
    * [new exports.Rectangle(x, y, width, height)](#new_module_shapes/Rectangle.Rectangle_new)
    * [.draw(ctx)](#module_shapes/Rectangle.Rectangle+draw)
    * [.drawRoundedRect(ctx)](#module_shapes/Rectangle.Rectangle+drawRoundedRect)
    * [.toJSON()](#module_shapes/Rectangle.Rectangle+toJSON) ⇒ <code>\*</code>

<a name="new_module_shapes/Rectangle.Rectangle_new"></a>

#### new exports.Rectangle(x, y, width, height)
Creates a new `Rectangle` instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |

<a name="module_shapes/Rectangle.Rectangle+draw"></a>

#### rectangle.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/Rectangle.Rectangle+drawRoundedRect"></a>

#### rectangle.drawRoundedRect(ctx)
Performs `drawRoundedRect`.

**Kind**: instance method of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/Rectangle.Rectangle+toJSON"></a>

#### rectangle.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/Rectangle..Rectangle"></a>

### shapes/Rectangle~Rectangle ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/Rectangle</code>](#module_shapes/Rectangle)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/Rectangle..Rectangle_new"></a>

#### new Rectangle()
`Rectangle` shape for MorphDiagrams.

**Example**  
```js
const instance = new Rectangle(10, 20, 30, 40);
```

