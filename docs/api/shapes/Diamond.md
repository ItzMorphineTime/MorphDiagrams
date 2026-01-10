# Diamond

_Source: `js/shapes/Diamond.js`_

<a name="module_shapes/Diamond"></a>

## shapes/Diamond
Diamond (rhombus) diagram shape. Extends BaseShape to provide diamond geometry and rendering.

**Remarks**: - Uses cross-product test for accurate point-in-diamond detection.- Rotation is supported via BaseShape rotation.  
**See**: module:core/BaseShape  
**Example**  
```js
const diamond = new Diamond(10, 20, 100, 80);diamond.draw(ctx);
```

* [shapes/Diamond](#module_shapes/Diamond)
    * [.Diamond](#module_shapes/Diamond.Diamond) ⇐ <code>BaseShape</code>
        * [new exports.Diamond(x, y, width, height)](#new_module_shapes/Diamond.Diamond_new)
        * [.containsPoint(x, y)](#module_shapes/Diamond.Diamond+containsPoint) ⇒ <code>boolean</code>
        * [.draw(ctx)](#module_shapes/Diamond.Diamond+draw)

<a name="module_shapes/Diamond.Diamond"></a>

### shapes/Diamond.Diamond ⇐ <code>BaseShape</code>
Represents a diamond (rhombus) diagram shape.

**Kind**: static class of [<code>shapes/Diamond</code>](#module_shapes/Diamond)  
**Extends**: <code>BaseShape</code>  

* [.Diamond](#module_shapes/Diamond.Diamond) ⇐ <code>BaseShape</code>
    * [new exports.Diamond(x, y, width, height)](#new_module_shapes/Diamond.Diamond_new)
    * [.containsPoint(x, y)](#module_shapes/Diamond.Diamond+containsPoint) ⇒ <code>boolean</code>
    * [.draw(ctx)](#module_shapes/Diamond.Diamond+draw)

<a name="new_module_shapes/Diamond.Diamond_new"></a>

#### new exports.Diamond(x, y, width, height)
Creates a new Diamond instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner of bounding box. |
| y | <code>number</code> | Y-coordinate of top-left corner of bounding box. |
| width | <code>number</code> | Width of bounding box. |
| height | <code>number</code> | Height of bounding box. |

<a name="module_shapes/Diamond.Diamond+containsPoint"></a>

#### diamond.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the diamond using cross-product test.

**Kind**: instance method of [<code>Diamond</code>](#module_shapes/Diamond.Diamond)  
**Returns**: <code>boolean</code> - True if point is inside the diamond.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test. |
| y | <code>number</code> | Y-coordinate of the point to test. |

<a name="module_shapes/Diamond.Diamond+draw"></a>

#### diamond.draw(ctx)
Draws the diamond shape on the canvas.

**Kind**: instance method of [<code>Diamond</code>](#module_shapes/Diamond.Diamond)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |


