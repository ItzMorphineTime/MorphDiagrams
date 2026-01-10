# ImageShape

_Source: `js/shapes/ImageShape.js`_

<a name="module_shapes/ImageShape"></a>

## shapes/ImageShape
Image diagram shape for embedding images in diagrams. Extends BaseShape to provide image rendering capabilities.

**Remarks**: - Images are loaded asynchronously; shape only renders when loaded.- Supports opacity control for image transparency.- Image data can be a URL or data URI.  
**See**: module:core/BaseShape  
**Example**  
```js
const img = new ImageShape(10, 20, 200, 150, 'https://example.com/image.png');img.opacity = 0.8; // 80% opacityimg.draw(ctx);
```

* [shapes/ImageShape](#module_shapes/ImageShape)
    * [.ImageShape](#module_shapes/ImageShape.ImageShape) ⇐ <code>BaseShape</code>
        * [new exports.ImageShape(x, y, width, height, imageData)](#new_module_shapes/ImageShape.ImageShape_new)
        * [.imageData](#module_shapes/ImageShape.ImageShape+imageData) : <code>string</code>
        * [.image](#module_shapes/ImageShape.ImageShape+image) : <code>Image</code> \| <code>null</code>
        * [.loaded](#module_shapes/ImageShape.ImageShape+loaded) : <code>boolean</code>
        * [.opacity](#module_shapes/ImageShape.ImageShape+opacity) : <code>number</code>
        * [.draw(ctx)](#module_shapes/ImageShape.ImageShape+draw)

<a name="module_shapes/ImageShape.ImageShape"></a>

### shapes/ImageShape.ImageShape ⇐ <code>BaseShape</code>
Represents an image diagram shape.

**Kind**: static class of [<code>shapes/ImageShape</code>](#module_shapes/ImageShape)  
**Extends**: <code>BaseShape</code>  

* [.ImageShape](#module_shapes/ImageShape.ImageShape) ⇐ <code>BaseShape</code>
    * [new exports.ImageShape(x, y, width, height, imageData)](#new_module_shapes/ImageShape.ImageShape_new)
    * [.imageData](#module_shapes/ImageShape.ImageShape+imageData) : <code>string</code>
    * [.image](#module_shapes/ImageShape.ImageShape+image) : <code>Image</code> \| <code>null</code>
    * [.loaded](#module_shapes/ImageShape.ImageShape+loaded) : <code>boolean</code>
    * [.opacity](#module_shapes/ImageShape.ImageShape+opacity) : <code>number</code>
    * [.draw(ctx)](#module_shapes/ImageShape.ImageShape+draw)

<a name="new_module_shapes/ImageShape.ImageShape_new"></a>

#### new exports.ImageShape(x, y, width, height, imageData)
Creates a new ImageShape instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner. |
| y | <code>number</code> | Y-coordinate of top-left corner. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |
| imageData | <code>string</code> | Image URL or data URI string. |

**Example**  
```js
const img = new ImageShape(10, 20, 200, 150, 'data:image/png;base64,...');
```
<a name="module_shapes/ImageShape.ImageShape+imageData"></a>

#### imageShape.imageData : <code>string</code>
Image URL or data URI.

**Kind**: instance property of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  
<a name="module_shapes/ImageShape.ImageShape+image"></a>

#### imageShape.image : <code>Image</code> \| <code>null</code>
Loaded image object.

**Kind**: instance property of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  
<a name="module_shapes/ImageShape.ImageShape+loaded"></a>

#### imageShape.loaded : <code>boolean</code>
Whether the image has finished loading.

**Kind**: instance property of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  
<a name="module_shapes/ImageShape.ImageShape+opacity"></a>

#### imageShape.opacity : <code>number</code>
Opacity value between 0 and 1.

**Kind**: instance property of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  
<a name="module_shapes/ImageShape.ImageShape+draw"></a>

#### imageShape.draw(ctx)
Draws the image shape on the canvas.Only renders if the image has finished loading. Applies opacity and optional border.

**Kind**: instance method of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |


