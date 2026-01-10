# SyncGenerator

_Source: `js/shapes/SyncGenerator.js`_

<a name="module_shapes/SyncGenerator"></a>

## shapes/SyncGenerator
SyncGenerator shape representing a video sync generation device. Provides SDI timing signals to other devices in the system.

**Remarks**: - Renders as a hexagon with a clock icon in the center.- Port configuration defines input/output ports for SDI connections only.- Input ports appear on the left edge, output ports on the right edge of the hexagon.- Anchor points are automatically generated based on port configuration.  
**See**

- module:core/BaseShape
- module:config/ConnectionTypes

**Example**  
```js
const sync = new SyncGenerator(10, 20, 100, 100);sync.ports = { sdi: { input: 2, output: 4 } };sync.draw(ctx);
```

* [shapes/SyncGenerator](#module_shapes/SyncGenerator)
    * [.SyncGenerator](#module_shapes/SyncGenerator.SyncGenerator) ⇐ <code>BaseShape</code>
        * [new exports.SyncGenerator(x, y, width, height)](#new_module_shapes/SyncGenerator.SyncGenerator_new)
        * [.ports](#module_shapes/SyncGenerator.SyncGenerator+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
        * [.getPoints()](#module_shapes/SyncGenerator.SyncGenerator+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>

<a name="module_shapes/SyncGenerator.SyncGenerator"></a>

### shapes/SyncGenerator.SyncGenerator ⇐ <code>BaseShape</code>
Represents a video sync generation device.

**Kind**: static class of [<code>shapes/SyncGenerator</code>](#module_shapes/SyncGenerator)  
**Extends**: <code>BaseShape</code>  

* [.SyncGenerator](#module_shapes/SyncGenerator.SyncGenerator) ⇐ <code>BaseShape</code>
    * [new exports.SyncGenerator(x, y, width, height)](#new_module_shapes/SyncGenerator.SyncGenerator_new)
    * [.ports](#module_shapes/SyncGenerator.SyncGenerator+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getPoints()](#module_shapes/SyncGenerator.SyncGenerator+getPoints) ⇒ <code>Array.&lt;{x: number, y: number}&gt;</code>

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

