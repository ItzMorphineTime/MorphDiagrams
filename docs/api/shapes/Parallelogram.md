# Parallelogram

_Source: `js/shapes/Parallelogram.js`_

<a name="module_shapes/Parallelogram"></a>

## shapes/Parallelogram
Diagram shape implementation for `Parallelogram`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { Parallelogram } from './shapes/Parallelogram.js';
```

* [shapes/Parallelogram](#module_shapes/Parallelogram)
    * _static_
        * [.Parallelogram](#module_shapes/Parallelogram.Parallelogram)
            * [new exports.Parallelogram(x, y, width, height)](#new_module_shapes/Parallelogram.Parallelogram_new)
            * [.getPoints()](#module_shapes/Parallelogram.Parallelogram+getPoints) ⇒ <code>\*</code>
            * [.draw(ctx)](#module_shapes/Parallelogram.Parallelogram+draw)
            * [.toJSON()](#module_shapes/Parallelogram.Parallelogram+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~Parallelogram](#module_shapes/Parallelogram..Parallelogram) ⇐ <code>BaseShape</code>
            * [new Parallelogram()](#new_module_shapes/Parallelogram..Parallelogram_new)

<a name="module_shapes/Parallelogram.Parallelogram"></a>

### shapes/Parallelogram.Parallelogram
**Kind**: static class of [<code>shapes/Parallelogram</code>](#module_shapes/Parallelogram)  

* [.Parallelogram](#module_shapes/Parallelogram.Parallelogram)
    * [new exports.Parallelogram(x, y, width, height)](#new_module_shapes/Parallelogram.Parallelogram_new)
    * [.getPoints()](#module_shapes/Parallelogram.Parallelogram+getPoints) ⇒ <code>\*</code>
    * [.draw(ctx)](#module_shapes/Parallelogram.Parallelogram+draw)
    * [.toJSON()](#module_shapes/Parallelogram.Parallelogram+toJSON) ⇒ <code>\*</code>

<a name="new_module_shapes/Parallelogram.Parallelogram_new"></a>

#### new exports.Parallelogram(x, y, width, height)
Creates a new `Parallelogram` instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |

<a name="module_shapes/Parallelogram.Parallelogram+getPoints"></a>

#### parallelogram.getPoints() ⇒ <code>\*</code>
Returns the `Points` value.

**Kind**: instance method of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/Parallelogram.Parallelogram+draw"></a>

#### parallelogram.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/Parallelogram.Parallelogram+toJSON"></a>

#### parallelogram.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/Parallelogram..Parallelogram"></a>

### shapes/Parallelogram~Parallelogram ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/Parallelogram</code>](#module_shapes/Parallelogram)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/Parallelogram..Parallelogram_new"></a>

#### new Parallelogram()
`Parallelogram` shape for MorphDiagrams.

**Example**  
```js
const instance = new Parallelogram(10, 20, 30, 40);
```

