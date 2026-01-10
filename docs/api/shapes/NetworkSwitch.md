# NetworkSwitch

_Source: `js/shapes/NetworkSwitch.js`_

<a name="module_shapes/NetworkSwitch"></a>

## shapes/NetworkSwitch
NetworkSwitch shape representing a network switching device. Supports bidirectional network connections.

**Remarks**: - Renders as a hexagon with an 'N' letter drawn in the center.- Port configuration defines input/output ports for network connections.- Input ports appear on the left edge, output ports on the right edge of the hexagon.- Anchor points are automatically generated based on port configuration.  
**See**

- module:core/BaseShape
- module:config/ConnectionTypes

**Example**  
```js
const switch = new NetworkSwitch(10, 20, 100, 100);switch.ports = { network: { input: 6, output: 6 } };switch.draw(ctx);
```

* [shapes/NetworkSwitch](#module_shapes/NetworkSwitch)
    * [.NetworkSwitch](#module_shapes/NetworkSwitch.NetworkSwitch) ⇐ <code>BaseShape</code>
        * [new exports.NetworkSwitch(x, y, width, height)](#new_module_shapes/NetworkSwitch.NetworkSwitch_new)
        * [.ports](#module_shapes/NetworkSwitch.NetworkSwitch+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
        * [.getPoints()](#module_shapes/NetworkSwitch.NetworkSwitch+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>

<a name="module_shapes/NetworkSwitch.NetworkSwitch"></a>

### shapes/NetworkSwitch.NetworkSwitch ⇐ <code>BaseShape</code>
Represents a network switching device.

**Kind**: static class of [<code>shapes/NetworkSwitch</code>](#module_shapes/NetworkSwitch)  
**Extends**: <code>BaseShape</code>  

* [.NetworkSwitch](#module_shapes/NetworkSwitch.NetworkSwitch) ⇐ <code>BaseShape</code>
    * [new exports.NetworkSwitch(x, y, width, height)](#new_module_shapes/NetworkSwitch.NetworkSwitch_new)
    * [.ports](#module_shapes/NetworkSwitch.NetworkSwitch+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getPoints()](#module_shapes/NetworkSwitch.NetworkSwitch+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>

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

