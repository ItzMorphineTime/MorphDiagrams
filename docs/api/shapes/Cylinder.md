# Cylinder

_Source: `js/shapes/Cylinder.js`_

<a name="module_shapes/Cylinder"></a>

## shapes/Cylinder
Cylindrical (capsule) diagram shape. Extends BaseShape to provide cylindrical geometry and rendering.

**Remarks**: - Renders as a capsule shape (rounded rectangle with semicircular ends).- Automatically adapts to horizontal or vertical orientation based on aspect ratio.  
**See**: module:core/BaseShape  
**Example**  
```js
const cylinder = new Cylinder(10, 20, 80, 100);cylinder.draw(ctx);
```

* [shapes/Cylinder](#module_shapes/Cylinder)
    * [.Cylinder](#module_shapes/Cylinder.Cylinder) ⇐ <code>BaseShape</code>
        * [new exports.Cylinder(x, y, width, height)](#new_module_shapes/Cylinder.Cylinder_new)
        * [.topHeight](#module_shapes/Cylinder.Cylinder+topHeight) : <code>number</code>
        * [.draw(ctx)](#module_shapes/Cylinder.Cylinder+draw)
        * [.toJSON()](#module_shapes/Cylinder.Cylinder+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/Cylinder.Cylinder"></a>

### shapes/Cylinder.Cylinder ⇐ <code>BaseShape</code>
Represents a cylindrical (capsule) diagram shape.

**Kind**: static class of [<code>shapes/Cylinder</code>](#module_shapes/Cylinder)  
**Extends**: <code>BaseShape</code>  

* [.Cylinder](#module_shapes/Cylinder.Cylinder) ⇐ <code>BaseShape</code>
    * [new exports.Cylinder(x, y, width, height)](#new_module_shapes/Cylinder.Cylinder_new)
    * [.topHeight](#module_shapes/Cylinder.Cylinder+topHeight) : <code>number</code>
    * [.draw(ctx)](#module_shapes/Cylinder.Cylinder+draw)
    * [.toJSON()](#module_shapes/Cylinder.Cylinder+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/Cylinder.Cylinder_new"></a>

#### new exports.Cylinder(x, y, width, height)
Creates a new Cylinder instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner of bounding box. |
| y | <code>number</code> | Y-coordinate of top-left corner of bounding box. |
| width | <code>number</code> | Width of bounding box. |
| height | <code>number</code> | Height of bounding box. |

<a name="module_shapes/Cylinder.Cylinder+topHeight"></a>

#### cylinder.topHeight : <code>number</code>
Ellipse height at top (for 3D effect).

**Kind**: instance property of [<code>Cylinder</code>](#module_shapes/Cylinder.Cylinder)  
<a name="module_shapes/Cylinder.Cylinder+draw"></a>

#### cylinder.draw(ctx)
Draws the cylinder (capsule) shape on the canvas.Automatically renders as horizontal or vertical capsule based on aspect ratio.

**Kind**: instance method of [<code>Cylinder</code>](#module_shapes/Cylinder.Cylinder)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |

<a name="module_shapes/Cylinder.Cylinder+toJSON"></a>

#### cylinder.toJSON() ⇒ <code>Object</code>
Serializes the cylinder to JSON, including topHeight.

**Kind**: instance method of [<code>Cylinder</code>](#module_shapes/Cylinder.Cylinder)  
**Returns**: <code>Object</code> - JSON representation with all properties.  

