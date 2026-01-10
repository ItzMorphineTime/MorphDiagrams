# NetworkSwitch

_Source: `js/shapes/NetworkSwitch.js`_

<a name="module_shapes/NetworkSwitch"></a>

## shapes/NetworkSwitch
Diagram shape implementation for `NetworkSwitch`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { NetworkSwitch } from './shapes/NetworkSwitch.js';
```

* [shapes/NetworkSwitch](#module_shapes/NetworkSwitch)
    * _static_
        * [.NetworkSwitch](#module_shapes/NetworkSwitch.NetworkSwitch)
            * [new exports.NetworkSwitch(x, y, width, height)](#new_module_shapes/NetworkSwitch.NetworkSwitch_new)
            * [.ports](#module_shapes/NetworkSwitch.NetworkSwitch+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
            * [.getPoints()](#module_shapes/NetworkSwitch.NetworkSwitch+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
            * [.getAnchorPoints()](#module_shapes/NetworkSwitch.NetworkSwitch+getAnchorPoints) ⇒ <code>\*</code>
            * [.draw(ctx)](#module_shapes/NetworkSwitch.NetworkSwitch+draw)
            * [.toJSON()](#module_shapes/NetworkSwitch.NetworkSwitch+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~NetworkSwitch](#module_shapes/NetworkSwitch..NetworkSwitch) ⇐ <code>BaseShape</code>
            * [new NetworkSwitch()](#new_module_shapes/NetworkSwitch..NetworkSwitch_new)

<a name="module_shapes/NetworkSwitch.NetworkSwitch"></a>

### shapes/NetworkSwitch.NetworkSwitch
**Kind**: static class of [<code>shapes/NetworkSwitch</code>](#module_shapes/NetworkSwitch)  

* [.NetworkSwitch](#module_shapes/NetworkSwitch.NetworkSwitch)
    * [new exports.NetworkSwitch(x, y, width, height)](#new_module_shapes/NetworkSwitch.NetworkSwitch_new)
    * [.ports](#module_shapes/NetworkSwitch.NetworkSwitch+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getPoints()](#module_shapes/NetworkSwitch.NetworkSwitch+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
    * [.getAnchorPoints()](#module_shapes/NetworkSwitch.NetworkSwitch+getAnchorPoints) ⇒ <code>\*</code>
    * [.draw(ctx)](#module_shapes/NetworkSwitch.NetworkSwitch+draw)
    * [.toJSON()](#module_shapes/NetworkSwitch.NetworkSwitch+toJSON) ⇒ <code>\*</code>

<a name="new_module_shapes/NetworkSwitch.NetworkSwitch_new"></a>

#### new exports.NetworkSwitch(x, y, width, height)
Creates a new NetworkSwitch instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="module_shapes/NetworkSwitch.NetworkSwitch+ports"></a>

#### networkSwitch.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration

**Kind**: instance property of [<code>NetworkSwitch</code>](#module_shapes/NetworkSwitch.NetworkSwitch)  
<a name="module_shapes/NetworkSwitch.NetworkSwitch+getPoints"></a>

#### networkSwitch.getPoints() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Calculates the hexagon vertex points based on position and size.

**Kind**: instance method of [<code>NetworkSwitch</code>](#module_shapes/NetworkSwitch.NetworkSwitch)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of 6 hexagon vertices  
<a name="module_shapes/NetworkSwitch.NetworkSwitch+getAnchorPoints"></a>

#### networkSwitch.getAnchorPoints() ⇒ <code>\*</code>
Returns the `AnchorPoints` value.

**Kind**: instance method of [<code>NetworkSwitch</code>](#module_shapes/NetworkSwitch.NetworkSwitch)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/NetworkSwitch.NetworkSwitch+draw"></a>

#### networkSwitch.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>NetworkSwitch</code>](#module_shapes/NetworkSwitch.NetworkSwitch)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/NetworkSwitch.NetworkSwitch+toJSON"></a>

#### networkSwitch.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>NetworkSwitch</code>](#module_shapes/NetworkSwitch.NetworkSwitch)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/NetworkSwitch..NetworkSwitch"></a>

### shapes/NetworkSwitch~NetworkSwitch ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/NetworkSwitch</code>](#module_shapes/NetworkSwitch)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/NetworkSwitch..NetworkSwitch_new"></a>

#### new NetworkSwitch()
NetworkSwitch shape representing a network switching device.
Supports bidirectional network connections.
Renders as a hexagon with an 'N' letter drawn in the center.


