# NetworkSwitch

_Source: `js/shapes/NetworkSwitch.js`_

<a name="NetworkSwitch"></a>

## NetworkSwitch ⇐ <code>BaseShape</code>
**Kind**: global class  
**Extends**: <code>BaseShape</code>  

* [NetworkSwitch](#NetworkSwitch) ⇐ <code>BaseShape</code>
    * [new NetworkSwitch()](#new_NetworkSwitch_new)
    * [.NetworkSwitch](#NetworkSwitch+NetworkSwitch)
        * [new exports.NetworkSwitch(x, y, width, height)](#new_NetworkSwitch+NetworkSwitch_new)
    * [.ports](#NetworkSwitch+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getPoints()](#NetworkSwitch+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>

<a name="new_NetworkSwitch_new"></a>

### new NetworkSwitch()
NetworkSwitch shape representing a network switching device.
Supports bidirectional network connections.
Renders as a hexagon with an 'N' letter drawn in the center.

<a name="NetworkSwitch+NetworkSwitch"></a>

### networkSwitch.NetworkSwitch
**Kind**: instance class of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="new_NetworkSwitch+NetworkSwitch_new"></a>

#### new exports.NetworkSwitch(x, y, width, height)
Creates a new NetworkSwitch instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="NetworkSwitch+ports"></a>

### networkSwitch.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration

**Kind**: instance property of [<code>NetworkSwitch</code>](#NetworkSwitch)  
<a name="NetworkSwitch+getPoints"></a>

### networkSwitch.getPoints() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Calculates the hexagon vertex points based on position and size.

**Kind**: instance method of [<code>NetworkSwitch</code>](#NetworkSwitch)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of 6 hexagon vertices  

