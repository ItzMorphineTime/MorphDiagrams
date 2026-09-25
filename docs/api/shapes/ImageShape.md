# ImageShape

_Source: `js/shapes/ImageShape.js`_

<a name="module_shapes/ImageShape"></a>

## shapes/ImageShape
Raster image (data URL) drawn into its bounds.

**Remarks**: The image element is only created in a browser; in Node (MCP server, tests) the shape keeps the
data URL and simply does not decode it.  
**See**: module:core/BaseShape  

* [shapes/ImageShape](#module_shapes/ImageShape)
    * [.ImageShape](#module_shapes/ImageShape.ImageShape)
        * [new exports.ImageShape(x, y, width, height, [imageData])](#new_module_shapes/ImageShape.ImageShape_new)
        * [.imageData](#module_shapes/ImageShape.ImageShape+imageData) : <code>string</code> \| <code>undefined</code>
        * [.image](#module_shapes/ImageShape.ImageShape+image) : <code>HTMLImageElement</code> \| <code>null</code>
        * [.loaded](#module_shapes/ImageShape.ImageShape+loaded) : <code>boolean</code>
        * [.opacity](#module_shapes/ImageShape.ImageShape+opacity) : <code>number</code>
        * [.loadImage(imageData)](#module_shapes/ImageShape.ImageShape+loadImage)
        * [.draw(ctx)](#module_shapes/ImageShape.ImageShape+draw)
        * [.toJSON()](#module_shapes/ImageShape.ImageShape+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/ImageShape.ImageShape"></a>

### shapes/ImageShape.ImageShape
**Kind**: static class of [<code>shapes/ImageShape</code>](#module_shapes/ImageShape)  

* [.ImageShape](#module_shapes/ImageShape.ImageShape)
    * [new exports.ImageShape(x, y, width, height, [imageData])](#new_module_shapes/ImageShape.ImageShape_new)
    * [.imageData](#module_shapes/ImageShape.ImageShape+imageData) : <code>string</code> \| <code>undefined</code>
    * [.image](#module_shapes/ImageShape.ImageShape+image) : <code>HTMLImageElement</code> \| <code>null</code>
    * [.loaded](#module_shapes/ImageShape.ImageShape+loaded) : <code>boolean</code>
    * [.opacity](#module_shapes/ImageShape.ImageShape+opacity) : <code>number</code>
    * [.loadImage(imageData)](#module_shapes/ImageShape.ImageShape+loadImage)
    * [.draw(ctx)](#module_shapes/ImageShape.ImageShape+draw)
    * [.toJSON()](#module_shapes/ImageShape.ImageShape+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/ImageShape.ImageShape_new"></a>

#### new exports.ImageShape(x, y, width, height, [imageData])

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> |  |
| y | <code>number</code> |  |
| width | <code>number</code> |  |
| height | <code>number</code> |  |
| [imageData] | <code>string</code> | Data URL or image URL. |

<a name="module_shapes/ImageShape.ImageShape+imageData"></a>

#### imageShape.imageData : <code>string</code> \| <code>undefined</code>
Data URL

**Kind**: instance property of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  
<a name="module_shapes/ImageShape.ImageShape+image"></a>

#### imageShape.image : <code>HTMLImageElement</code> \| <code>null</code>
Decoded image (browser only, not serialised)

**Kind**: instance property of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  
<a name="module_shapes/ImageShape.ImageShape+loaded"></a>

#### imageShape.loaded : <code>boolean</code>
**Kind**: instance property of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  
<a name="module_shapes/ImageShape.ImageShape+opacity"></a>

#### imageShape.opacity : <code>number</code>
0..1

**Kind**: instance property of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  
<a name="module_shapes/ImageShape.ImageShape+loadImage"></a>

#### imageShape.loadImage(imageData)
Starts decoding the image (no-op outside a browser).

**Kind**: instance method of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  

| Param | Type |
| --- | --- |
| imageData | <code>string</code> | 

<a name="module_shapes/ImageShape.ImageShape+draw"></a>

#### imageShape.draw(ctx)
**Kind**: instance method of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/ImageShape.ImageShape+toJSON"></a>

#### imageShape.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>ImageShape</code>](#module_shapes/ImageShape.ImageShape)  

