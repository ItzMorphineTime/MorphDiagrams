# LEDProcessor

_Source: `js/shapes/LEDProcessor.js`_

<a name="LEDProcessor"></a>

## LEDProcessor ⇐ <code>BaseShape</code>
**Kind**: global class  
**Extends**: <code>BaseShape</code>  

* [LEDProcessor](#LEDProcessor) ⇐ <code>BaseShape</code>
    * [new LEDProcessor()](#new_LEDProcessor_new)
    * [.LEDProcessor](#LEDProcessor+LEDProcessor)
        * [new exports.LEDProcessor(x, y, width, height)](#new_LEDProcessor+LEDProcessor_new)
    * [.ports](#LEDProcessor+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getAnchorPoints()](#LEDProcessor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>

<a name="new_LEDProcessor_new"></a>

### new LEDProcessor()
LEDProcessor shape representing an LED video processing device.
Handles video and SDI inputs for LED wall output.
Renders as a capsule (rounded rectangle) shape.

<a name="LEDProcessor+LEDProcessor"></a>

### ledProcessor.LEDProcessor
**Kind**: instance class of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="new_LEDProcessor+LEDProcessor_new"></a>

#### new exports.LEDProcessor(x, y, width, height)
Creates a new LEDProcessor instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="LEDProcessor+ports"></a>

### ledProcessor.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration

**Kind**: instance property of [<code>LEDProcessor</code>](#LEDProcessor)  
<a name="LEDProcessor+getAnchorPoints"></a>

### ledProcessor.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.

**Kind**: instance method of [<code>LEDProcessor</code>](#LEDProcessor)  

