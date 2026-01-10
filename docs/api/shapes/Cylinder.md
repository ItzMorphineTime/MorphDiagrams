# Cylinder

_Source: `js/shapes/Cylinder.js`_

<a name="module_shapes/Cylinder"></a>

## shapes/Cylinder
Diagram shape implementation for `Cylinder`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { Cylinder } from './shapes/Cylinder.js';
```

* [shapes/Cylinder](#module_shapes/Cylinder)
    * _static_
        * [.Cylinder](#module_shapes/Cylinder.Cylinder)
            * [new exports.Cylinder(x, y, width, height)](#new_module_shapes/Cylinder.Cylinder_new)
            * [.draw(ctx)](#module_shapes/Cylinder.Cylinder+draw)
            * [.toJSON()](#module_shapes/Cylinder.Cylinder+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~Cylinder](#module_shapes/Cylinder..Cylinder) ⇐ <code>BaseShape</code>
            * [new Cylinder()](#new_module_shapes/Cylinder..Cylinder_new)

<a name="module_shapes/Cylinder.Cylinder"></a>

### shapes/Cylinder.Cylinder
**Kind**: static class of [<code>shapes/Cylinder</code>](#module_shapes/Cylinder)  

* [.Cylinder](#module_shapes/Cylinder.Cylinder)
    * [new exports.Cylinder(x, y, width, height)](#new_module_shapes/Cylinder.Cylinder_new)
    * [.draw(ctx)](#module_shapes/Cylinder.Cylinder+draw)
    * [.toJSON()](#module_shapes/Cylinder.Cylinder+toJSON) ⇒ <code>\*</code>

<a name="new_module_shapes/Cylinder.Cylinder_new"></a>

#### new exports.Cylinder(x, y, width, height)
Creates a new `Cylinder` instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |

<a name="module_shapes/Cylinder.Cylinder+draw"></a>

#### cylinder.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>Cylinder</code>](#module_shapes/Cylinder.Cylinder)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/Cylinder.Cylinder+toJSON"></a>

#### cylinder.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>Cylinder</code>](#module_shapes/Cylinder.Cylinder)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/Cylinder..Cylinder"></a>

### shapes/Cylinder~Cylinder ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/Cylinder</code>](#module_shapes/Cylinder)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/Cylinder..Cylinder_new"></a>

#### new Cylinder()
`Cylinder` shape for MorphDiagrams.

**Example**  
```js
const instance = new Cylinder(10, 20, 30, 40);
```

