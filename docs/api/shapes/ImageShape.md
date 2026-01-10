# ImageShape

_Source: `js/shapes/ImageShape.js`_

<a name="module_shapes/ImageShape"></a>

## shapes/ImageShape
Diagram shape implementation for `ImageShape`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { ImageShape } from './shapes/ImageShape.js';
```

* [shapes/ImageShape](#module_shapes/ImageShape)
    * _static_
        * [.ImageShape](#module_shapes/ImageShape.ImageShape)
            * [new exports.ImageShape(x, y, width, height, imageData)](#new_module_shapes/ImageShape.ImageShape_new)
            * [.loadImage(imageData)](#module_shapes/ImageShape.ImageShape+loadImage)
            * [.draw(ctx)](#module_shapes/ImageShape.ImageShape+draw)
            * [.toJSON()](#module_shapes/ImageShape.ImageShape+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~ImageShape](#module_shapes/ImageShape..ImageShape) ⇐ <code>BaseShape</code>
            * [new ImageShape()](#new_module_shapes/ImageShape..ImageShape_new)

<a name="module_shapes/ImageShape.ImageShape"></a>

### shapes/ImageShape.ImageShape
**Kind**: static class of [<code>shapes/ImageShape</code>](#module_shapes/ImageShape)  

* [.ImageShape](#module_shapes/ImageShape.ImageShape)
    * [new exports.ImageShape(x, y, width, height, imageData)](#new_module_shapes/ImageShape.ImageShape_new)
    * [.loadImage(imageData)](#module_shapes/ImageShape.ImageShape+loadImage)
    * [.draw(ctx)](#module_shapes/ImageShape.ImageShape+draw)
    * [.toJSON()](#module_shapes/ImageShape.ImageShape+toJSON) ⇒ <code>\*</code>

<a name="new_module_shapes/ImageShape.ImageShape_new"></a>

#### new exports.ImageShape(x, y, width, height, imageData)
Creates a new `ImageShape` instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |
| imageData | <code>\*</code> | imageData value. |

<a name="module_shapes/ImageShape.ImageShape+loadImage"></a>

#### imageShape.loadImage(imageData)
Performs `loadImage`.

**Kind**: instance method of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  

| Param | Type | Description |
| --- | --- | --- |
| imageData | <code>\*</code> | imageData value. |

<a name="module_shapes/ImageShape.ImageShape+draw"></a>

#### imageShape.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/ImageShape.ImageShape+toJSON"></a>

#### imageShape.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/ImageShape..ImageShape"></a>

### shapes/ImageShape~ImageShape ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/ImageShape</code>](#module_shapes/ImageShape)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/ImageShape..ImageShape_new"></a>

#### new ImageShape()
`ImageShape` shape for MorphDiagrams.

**Example**  
```js
const instance = new ImageShape(10, 20, 30, 40, 50);
```

