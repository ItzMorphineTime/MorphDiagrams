# Diamond

_Source: `js/shapes/Diamond.js`_

<a name="module_shapes/Diamond"></a>

## shapes/Diamond
Diagram shape implementation for `Diamond`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { Diamond } from './shapes/Diamond.js';
```

* [shapes/Diamond](#module_shapes/Diamond)
    * _static_
        * [.Diamond](#module_shapes/Diamond.Diamond)
            * [new exports.Diamond(x, y, width, height)](#new_module_shapes/Diamond.Diamond_new)
            * [.containsPoint(x, y)](#module_shapes/Diamond.Diamond+containsPoint) ⇒ <code>\*</code>
            * [.draw(ctx)](#module_shapes/Diamond.Diamond+draw)
    * _inner_
        * [~Diamond](#module_shapes/Diamond..Diamond) ⇐ <code>BaseShape</code>
            * [new Diamond()](#new_module_shapes/Diamond..Diamond_new)

<a name="module_shapes/Diamond.Diamond"></a>

### shapes/Diamond.Diamond
**Kind**: static class of [<code>shapes/Diamond</code>](#module_shapes/Diamond)  

* [.Diamond](#module_shapes/Diamond.Diamond)
    * [new exports.Diamond(x, y, width, height)](#new_module_shapes/Diamond.Diamond_new)
    * [.containsPoint(x, y)](#module_shapes/Diamond.Diamond+containsPoint) ⇒ <code>\*</code>
    * [.draw(ctx)](#module_shapes/Diamond.Diamond+draw)

<a name="new_module_shapes/Diamond.Diamond_new"></a>

#### new exports.Diamond(x, y, width, height)
Creates a new `Diamond` instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |

<a name="module_shapes/Diamond.Diamond+containsPoint"></a>

#### diamond.containsPoint(x, y) ⇒ <code>\*</code>
Checks whether a point lies within the object's bounds.

**Kind**: instance method of [<code>Diamond</code>](#module_shapes/Diamond.Diamond)  
**Returns**: <code>\*</code> - Result value.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |

<a name="module_shapes/Diamond.Diamond+draw"></a>

#### diamond.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>Diamond</code>](#module_shapes/Diamond.Diamond)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/Diamond..Diamond"></a>

### shapes/Diamond~Diamond ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/Diamond</code>](#module_shapes/Diamond)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/Diamond..Diamond_new"></a>

#### new Diamond()
`Diamond` shape for MorphDiagrams.

**Example**  
```js
const instance = new Diamond(10, 20, 30, 40);
```

