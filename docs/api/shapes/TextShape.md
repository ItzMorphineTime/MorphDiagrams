# TextShape

_Source: `js/shapes/TextShape.js`_

<a name="module_shapes/TextShape"></a>

## shapes/TextShape
Diagram shape implementation for `TextShape`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { TextShape } from './shapes/TextShape.js';
```

* [shapes/TextShape](#module_shapes/TextShape)
    * _static_
        * [.TextShape](#module_shapes/TextShape.TextShape)
            * [new exports.TextShape(x, y, text)](#new_module_shapes/TextShape.TextShape_new)
            * [.draw(ctx)](#module_shapes/TextShape.TextShape+draw)
            * [.toJSON()](#module_shapes/TextShape.TextShape+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~TextShape](#module_shapes/TextShape..TextShape) ⇐ <code>BaseShape</code>
            * [new TextShape()](#new_module_shapes/TextShape..TextShape_new)

<a name="module_shapes/TextShape.TextShape"></a>

### shapes/TextShape.TextShape
**Kind**: static class of [<code>shapes/TextShape</code>](#module_shapes/TextShape)  

* [.TextShape](#module_shapes/TextShape.TextShape)
    * [new exports.TextShape(x, y, text)](#new_module_shapes/TextShape.TextShape_new)
    * [.draw(ctx)](#module_shapes/TextShape.TextShape+draw)
    * [.toJSON()](#module_shapes/TextShape.TextShape+toJSON) ⇒ <code>\*</code>

<a name="new_module_shapes/TextShape.TextShape_new"></a>

#### new exports.TextShape(x, y, text)
Creates a new `TextShape` instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> |  | X position in canvas coordinates. |
| y | <code>number</code> |  | Y position in canvas coordinates. |
| text | <code>string</code> | <code>&quot;Text&quot;</code> | Display text. |

<a name="module_shapes/TextShape.TextShape+draw"></a>

#### textShape.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/TextShape.TextShape+toJSON"></a>

#### textShape.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/TextShape..TextShape"></a>

### shapes/TextShape~TextShape ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/TextShape</code>](#module_shapes/TextShape)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/TextShape..TextShape_new"></a>

#### new TextShape()
`TextShape` shape for MorphDiagrams.

**Example**  
```js
const instance = new TextShape(10, 20, 'example');
```

