# SyncGenerator

_Source: `js/shapes/SyncGenerator.js`_

<a name="SyncGenerator"></a>

## SyncGenerator ⇐ <code>BaseShape</code>
**Kind**: global class  
**Extends**: <code>BaseShape</code>  

* [SyncGenerator](#SyncGenerator) ⇐ <code>BaseShape</code>
    * [new SyncGenerator()](#new_SyncGenerator_new)
    * [.SyncGenerator](#SyncGenerator+SyncGenerator)
        * [new exports.SyncGenerator(x, y, width, height)](#new_SyncGenerator+SyncGenerator_new)
    * [.ports](#SyncGenerator+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getPoints()](#SyncGenerator+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>

<a name="new_SyncGenerator_new"></a>

### new SyncGenerator()
SyncGenerator shape representing a video sync generation device.
Provides SDI timing signals to other devices in the system.
Renders as a hexagon shape.

<a name="SyncGenerator+SyncGenerator"></a>

### syncGenerator.SyncGenerator
**Kind**: instance class of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="new_SyncGenerator+SyncGenerator_new"></a>

#### new exports.SyncGenerator(x, y, width, height)
Creates a new SyncGenerator instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="SyncGenerator+ports"></a>

### syncGenerator.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration - SDI only

**Kind**: instance property of [<code>SyncGenerator</code>](#SyncGenerator)  
<a name="SyncGenerator+getPoints"></a>

### syncGenerator.getPoints() ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>
Calculates the hexagon vertex points based on position and size.

**Kind**: instance method of [<code>SyncGenerator</code>](#SyncGenerator)  
**Returns**: <code>Array.&lt;{x: number, y: number}&gt;</code> - Array of 6 hexagon vertices  

