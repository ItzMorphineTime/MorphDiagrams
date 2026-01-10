# SyncGenerator

_Source: `js/shapes/SyncGenerator.js`_

<a name="module_shapes/SyncGenerator"></a>

## shapes/SyncGenerator
Diagram shape implementation for `SyncGenerator`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { SyncGenerator } from './shapes/SyncGenerator.js';
```

* [shapes/SyncGenerator](#module_shapes/SyncGenerator)
    * _static_
        * [.SyncGenerator](#module_shapes/SyncGenerator.SyncGenerator)
            * [new exports.SyncGenerator(x, y, width, height)](#new_module_shapes/SyncGenerator.SyncGenerator_new)
            * [.ports](#module_shapes/SyncGenerator.SyncGenerator+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
            * [.getPoints()](#module_shapes/SyncGenerator.SyncGenerator+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
            * [.getAnchorPoints()](#module_shapes/SyncGenerator.SyncGenerator+getAnchorPoints) ⇒ <code>\*</code>
            * [.draw(ctx)](#module_shapes/SyncGenerator.SyncGenerator+draw)
            * [.toJSON()](#module_shapes/SyncGenerator.SyncGenerator+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~SyncGenerator](#module_shapes/SyncGenerator..SyncGenerator) ⇐ <code>BaseShape</code>
            * [new SyncGenerator()](#new_module_shapes/SyncGenerator..SyncGenerator_new)

<a name="module_shapes/SyncGenerator.SyncGenerator"></a>

### shapes/SyncGenerator.SyncGenerator
**Kind**: static class of [<code>shapes/SyncGenerator</code>](#module_shapes/SyncGenerator)  

* [.SyncGenerator](#module_shapes/SyncGenerator.SyncGenerator)
    * [new exports.SyncGenerator(x, y, width, height)](#new_module_shapes/SyncGenerator.SyncGenerator_new)
    * [.ports](#module_shapes/SyncGenerator.SyncGenerator+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getPoints()](#module_shapes/SyncGenerator.SyncGenerator+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.getAnchorPoints()](#module_shapes/SyncGenerator.SyncGenerator+getAnchorPoints) ⇒ <code>\*</code>
    * [.draw(ctx)](#module_shapes/SyncGenerator.SyncGenerator+draw)
    * [.toJSON()](#module_shapes/SyncGenerator.SyncGenerator+toJSON) ⇒ <code>\*</code>

<a name="new_module_shapes/SyncGenerator.SyncGenerator_new"></a>

#### new exports.SyncGenerator(x, y, width, height)
Creates a new SyncGenerator instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="module_shapes/SyncGenerator.SyncGenerator+ports"></a>

#### syncGenerator.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration - SDI only

**Kind**: instance property of [<code>SyncGenerator</code>](#module_shapes/SyncGenerator.SyncGenerator)  
<a name="module_shapes/SyncGenerator.SyncGenerator+getPoints"></a>

#### syncGenerator.getPoints() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Calculates the hexagon vertex points based on position and size.

**Kind**: instance method of [<code>SyncGenerator</code>](#module_shapes/SyncGenerator.SyncGenerator)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of 6 hexagon vertices  
<a name="module_shapes/SyncGenerator.SyncGenerator+getAnchorPoints"></a>

#### syncGenerator.getAnchorPoints() ⇒ <code>\*</code>
Returns the `AnchorPoints` value.

**Kind**: instance method of [<code>SyncGenerator</code>](#module_shapes/SyncGenerator.SyncGenerator)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/SyncGenerator.SyncGenerator+draw"></a>

#### syncGenerator.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>SyncGenerator</code>](#module_shapes/SyncGenerator.SyncGenerator)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/SyncGenerator.SyncGenerator+toJSON"></a>

#### syncGenerator.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>SyncGenerator</code>](#module_shapes/SyncGenerator.SyncGenerator)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/SyncGenerator..SyncGenerator"></a>

### shapes/SyncGenerator~SyncGenerator ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/SyncGenerator</code>](#module_shapes/SyncGenerator)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/SyncGenerator..SyncGenerator_new"></a>

#### new SyncGenerator()
SyncGenerator shape representing a video sync generation device.
Provides SDI timing signals to other devices in the system.
Renders as a hexagon shape.


