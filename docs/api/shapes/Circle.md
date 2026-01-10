# Circle

_Source: `js/shapes/Circle.js`_

<a name="module_shapes/Circle"></a>

## shapes/Circle
Diagram shape implementation for `Circle`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { Circle } from './shapes/Circle.js';
```

* [shapes/Circle](#module_shapes/Circle)
    * _static_
        * [.Circle](#module_shapes/Circle.Circle)
            * [new exports.Circle(x, y, width, height)](#new_module_shapes/Circle.Circle_new)
            * [.containsPoint(x, y)](#module_shapes/Circle.Circle+containsPoint) ⇒ <code>\*</code>
            * [.draw(ctx)](#module_shapes/Circle.Circle+draw)
    * _inner_
        * [~Circle](#module_shapes/Circle..Circle) ⇐ <code>BaseShape</code>
            * [new Circle()](#new_module_shapes/Circle..Circle_new)

<a name="module_shapes/Circle.Circle"></a>

### shapes/Circle.Circle
**Kind**: static class of [<code>shapes/Circle</code>](#module_shapes/Circle)  

* [.Circle](#module_shapes/Circle.Circle)
    * [new exports.Circle(x, y, width, height)](#new_module_shapes/Circle.Circle_new)
    * [.containsPoint(x, y)](#module_shapes/Circle.Circle+containsPoint) ⇒ <code>\*</code>
    * [.draw(ctx)](#module_shapes/Circle.Circle+draw)

<a name="new_module_shapes/Circle.Circle_new"></a>

#### new exports.Circle(x, y, width, height)
Creates a new `Circle` instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |

<a name="module_shapes/Circle.Circle+containsPoint"></a>

#### circle.containsPoint(x, y) ⇒ <code>\*</code>
Checks whether a point lies within the object's bounds.

**Kind**: instance method of [<code>Circle</code>](#module_shapes/Circle.Circle)  
**Returns**: <code>\*</code> - Result value.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |

<a name="module_shapes/Circle.Circle+draw"></a>

#### circle.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>Circle</code>](#module_shapes/Circle.Circle)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/Circle..Circle"></a>

### shapes/Circle~Circle ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/Circle</code>](#module_shapes/Circle)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/Circle..Circle_new"></a>

#### new Circle()
`Circle` shape for MorphDiagrams.

**Example**  
```js
const instance = new Circle(10, 20, 30, 40);
```

