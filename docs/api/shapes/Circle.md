# Circle

_Source: `js/shapes/Circle.js`_

<a name="module_shapes/Circle"></a>

## shapes/Circle
Circular/elliptical diagram shape. Extends BaseShape to provide elliptical geometry and rendering.

**Remarks**: - Circles are rendered as ellipses, allowing non-square dimensions.- Point-in-shape detection uses ellipse equation for accurate hit testing.  
**See**: module:core/BaseShape  
**Example**  
```js
const circle = new Circle(10, 20, 100, 100); // Perfect circleconst ellipse = new Circle(10, 20, 120, 80); // Ellipsecircle.draw(ctx);
```

* [shapes/Circle](#module_shapes/Circle)
    * [.Circle](#module_shapes/Circle.Circle) ⇐ <code>BaseShape</code>
        * [new exports.Circle(x, y, width, height)](#new_module_shapes/Circle.Circle_new)
        * [.containsPoint(x, y)](#module_shapes/Circle.Circle+containsPoint) ⇒ <code>boolean</code>
        * [.draw(ctx)](#module_shapes/Circle.Circle+draw)

<a name="module_shapes/Circle.Circle"></a>

### shapes/Circle.Circle ⇐ <code>BaseShape</code>
Represents a circular or elliptical diagram shape.

**Kind**: static class of [<code>shapes/Circle</code>](#module_shapes/Circle)  
**Extends**: <code>BaseShape</code>  

* [.Circle](#module_shapes/Circle.Circle) ⇐ <code>BaseShape</code>
    * [new exports.Circle(x, y, width, height)](#new_module_shapes/Circle.Circle_new)
    * [.containsPoint(x, y)](#module_shapes/Circle.Circle+containsPoint) ⇒ <code>boolean</code>
    * [.draw(ctx)](#module_shapes/Circle.Circle+draw)

<a name="new_module_shapes/Circle.Circle_new"></a>

#### new exports.Circle(x, y, width, height)
Creates a new Circle instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner of bounding box. |
| y | <code>number</code> | Y-coordinate of top-left corner of bounding box. |
| width | <code>number</code> | Width of bounding box (horizontal radius * 2). |
| height | <code>number</code> | Height of bounding box (vertical radius * 2). |

**Example**  
```js
const circle = new Circle(10, 20, 100, 100);
```
<a name="module_shapes/Circle.Circle+containsPoint"></a>

#### circle.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside the ellipse using the ellipse equation.

**Kind**: instance method of [<code>Circle</code>](#module_shapes/Circle.Circle)  
**Returns**: <code>boolean</code> - True if point is inside the ellipse.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test. |
| y | <code>number</code> | Y-coordinate of the point to test. |

<a name="module_shapes/Circle.Circle+draw"></a>

#### circle.draw(ctx)
Draws the circle/ellipse on the canvas.

**Kind**: instance method of [<code>Circle</code>](#module_shapes/Circle.Circle)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |


