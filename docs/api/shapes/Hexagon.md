# Hexagon

_Source: `js/shapes/Hexagon.js`_

<a name="module_shapes/Hexagon"></a>

## shapes/Hexagon
Diagram shape implementation for `Hexagon`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { Hexagon } from './shapes/Hexagon.js';
```

* [shapes/Hexagon](#module_shapes/Hexagon)
    * _static_
        * [.Hexagon](#module_shapes/Hexagon.Hexagon)
            * [new exports.Hexagon(x, y, width, height)](#new_module_shapes/Hexagon.Hexagon_new)
            * [.getPoints()](#module_shapes/Hexagon.Hexagon+getPoints) ⇒ <code>\*</code>
            * [.containsPoint(x, y)](#module_shapes/Hexagon.Hexagon+containsPoint) ⇒ <code>\*</code>
            * [.draw(ctx)](#module_shapes/Hexagon.Hexagon+draw)
    * _inner_
        * [~Hexagon](#module_shapes/Hexagon..Hexagon) ⇐ <code>BaseShape</code>
            * [new Hexagon()](#new_module_shapes/Hexagon..Hexagon_new)

<a name="module_shapes/Hexagon.Hexagon"></a>

### shapes/Hexagon.Hexagon
**Kind**: static class of [<code>shapes/Hexagon</code>](#module_shapes/Hexagon)  

* [.Hexagon](#module_shapes/Hexagon.Hexagon)
    * [new exports.Hexagon(x, y, width, height)](#new_module_shapes/Hexagon.Hexagon_new)
    * [.getPoints()](#module_shapes/Hexagon.Hexagon+getPoints) ⇒ <code>\*</code>
    * [.containsPoint(x, y)](#module_shapes/Hexagon.Hexagon+containsPoint) ⇒ <code>\*</code>
    * [.draw(ctx)](#module_shapes/Hexagon.Hexagon+draw)

<a name="new_module_shapes/Hexagon.Hexagon_new"></a>

#### new exports.Hexagon(x, y, width, height)
Creates a new `Hexagon` instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |

<a name="module_shapes/Hexagon.Hexagon+getPoints"></a>

#### hexagon.getPoints() ⇒ <code>\*</code>
Returns the `Points` value.

**Kind**: instance method of [<code>Hexagon</code>](#module_shapes/Hexagon.Hexagon)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/Hexagon.Hexagon+containsPoint"></a>

#### hexagon.containsPoint(x, y) ⇒ <code>\*</code>
Checks whether a point lies within the object's bounds.

**Kind**: instance method of [<code>Hexagon</code>](#module_shapes/Hexagon.Hexagon)  
**Returns**: <code>\*</code> - Result value.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |

<a name="module_shapes/Hexagon.Hexagon+draw"></a>

#### hexagon.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>Hexagon</code>](#module_shapes/Hexagon.Hexagon)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/Hexagon..Hexagon"></a>

### shapes/Hexagon~Hexagon ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/Hexagon</code>](#module_shapes/Hexagon)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/Hexagon..Hexagon_new"></a>

#### new Hexagon()
`Hexagon` shape for MorphDiagrams.

**Example**  
```js
const instance = new Hexagon(10, 20, 30, 40);
```

