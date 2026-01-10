# Hexagon

_Source: `js/shapes/Hexagon.js`_

<a name="module_shapes/Hexagon"></a>

## shapes/Hexagon
Hexagonal diagram shape. Extends BaseShape to provide hexagon geometry and rendering.

**Remarks**: - Hexagon has 6 vertices arranged in a regular polygon.- Point detection currently uses bounding box (can be enhanced for true hexagon hit testing).  
**See**: module:core/BaseShape  
**Example**  
```js
const hexagon = new Hexagon(10, 20, 100, 100);hexagon.draw(ctx);
```

* [shapes/Hexagon](#module_shapes/Hexagon)
    * [.Hexagon](#module_shapes/Hexagon.Hexagon) ⇐ <code>BaseShape</code>
        * [new exports.Hexagon(x, y, width, height)](#new_module_shapes/Hexagon.Hexagon_new)
        * [.getPoints()](#module_shapes/Hexagon.Hexagon+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.containsPoint(x, y)](#module_shapes/Hexagon.Hexagon+containsPoint) ⇒ <code>boolean</code>
        * [.draw(ctx)](#module_shapes/Hexagon.Hexagon+draw)

<a name="module_shapes/Hexagon.Hexagon"></a>

### shapes/Hexagon.Hexagon ⇐ <code>BaseShape</code>
Represents a hexagonal diagram shape.

**Kind**: static class of [<code>shapes/Hexagon</code>](#module_shapes/Hexagon)  
**Extends**: <code>BaseShape</code>  

* [.Hexagon](#module_shapes/Hexagon.Hexagon) ⇐ <code>BaseShape</code>
    * [new exports.Hexagon(x, y, width, height)](#new_module_shapes/Hexagon.Hexagon_new)
    * [.getPoints()](#module_shapes/Hexagon.Hexagon+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
    * [.containsPoint(x, y)](#module_shapes/Hexagon.Hexagon+containsPoint) ⇒ <code>boolean</code>
    * [.draw(ctx)](#module_shapes/Hexagon.Hexagon+draw)

<a name="new_module_shapes/Hexagon.Hexagon_new"></a>

#### new exports.Hexagon(x, y, width, height)
Creates a new Hexagon instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner of bounding box. |
| y | <code>number</code> | Y-coordinate of top-left corner of bounding box. |
| width | <code>number</code> | Width of bounding box. |
| height | <code>number</code> | Height of bounding box. |

<a name="module_shapes/Hexagon.Hexagon+getPoints"></a>

#### hexagon.getPoints() ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
Gets the six vertex points of the hexagon.

**Kind**: instance method of [<code>Hexagon</code>](#module_shapes/Hexagon.Hexagon)  
**Returns**: <code>Array.&lt;{x:number, y:number}&gt;</code> - Array of six vertex coordinates.  
**Example**  
```js
const points = hexagon.getPoints();// Returns 6 points starting from top, going clockwise
```
<a name="module_shapes/Hexagon.Hexagon+containsPoint"></a>

#### hexagon.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the hexagon.Currently uses bounding box check. Can be enhanced for true hexagon hit testing.

**Kind**: instance method of [<code>Hexagon</code>](#module_shapes/Hexagon.Hexagon)  
**Returns**: <code>boolean</code> - True if point is inside the hexagon bounding box.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test. |
| y | <code>number</code> | Y-coordinate of the point to test. |

<a name="module_shapes/Hexagon.Hexagon+draw"></a>

#### hexagon.draw(ctx)
Draws the hexagon shape on the canvas.

**Kind**: instance method of [<code>Hexagon</code>](#module_shapes/Hexagon.Hexagon)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |


