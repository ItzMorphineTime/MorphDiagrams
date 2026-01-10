# Parallelogram

_Source: `js/shapes/Parallelogram.js`_

<a name="module_shapes/Parallelogram"></a>

## shapes/Parallelogram
Parallelogram diagram shape with configurable skew. Extends BaseShape to provide parallelogram geometry and rendering.

**Remarks**: - Supports configurable skew factor for different parallelogram angles.- Handles negative dimensions during drag operations.  
**See**: module:core/BaseShape  
**Example**  
```js
const para = new Parallelogram(10, 20, 120, 60);para.skew = 0.3; // Increase skew anglepara.draw(ctx);
```

* [shapes/Parallelogram](#module_shapes/Parallelogram)
    * [.Parallelogram](#module_shapes/Parallelogram.Parallelogram) ⇐ <code>BaseShape</code>
        * [new exports.Parallelogram(x, y, width, height)](#new_module_shapes/Parallelogram.Parallelogram_new)
        * [.skew](#module_shapes/Parallelogram.Parallelogram+skew) : <code>number</code>
        * [.draw(ctx)](#module_shapes/Parallelogram.Parallelogram+draw)

<a name="module_shapes/Parallelogram.Parallelogram"></a>

### shapes/Parallelogram.Parallelogram ⇐ <code>BaseShape</code>
Represents a parallelogram diagram shape.

**Kind**: static class of [<code>shapes/Parallelogram</code>](#module_shapes/Parallelogram)  
**Extends**: <code>BaseShape</code>  

* [.Parallelogram](#module_shapes/Parallelogram.Parallelogram) ⇐ <code>BaseShape</code>
    * [new exports.Parallelogram(x, y, width, height)](#new_module_shapes/Parallelogram.Parallelogram_new)
    * [.skew](#module_shapes/Parallelogram.Parallelogram+skew) : <code>number</code>
    * [.draw(ctx)](#module_shapes/Parallelogram.Parallelogram+draw)

<a name="new_module_shapes/Parallelogram.Parallelogram_new"></a>

#### new exports.Parallelogram(x, y, width, height)
Creates a new Parallelogram instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner of bounding box. |
| y | <code>number</code> | Y-coordinate of top-left corner of bounding box. |
| width | <code>number</code> | Width of bounding box. |
| height | <code>number</code> | Height of bounding box. |

<a name="module_shapes/Parallelogram.Parallelogram+skew"></a>

#### parallelogram.skew : <code>number</code>
Skew factor (0-1) controlling the horizontal offset of top/bottom edges.

**Kind**: instance property of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  
<a name="module_shapes/Parallelogram.Parallelogram+draw"></a>

#### parallelogram.draw(ctx)
Draws the parallelogram shape on the canvas.

**Kind**: instance method of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |


