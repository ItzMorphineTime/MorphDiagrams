# LEDProcessor

_Source: `js/shapes/LEDProcessor.js`_

<a name="module_shapes/LEDProcessor"></a>

## shapes/LEDProcessor
LEDProcessor shape representing an LED video processing device. Handles video and SDI inputs for LED wall output.

**Remarks**: - Renders as a rectangle with LED pattern indicators.- Port configuration defines input/output ports for video and SDI connections.- Input ports appear on the left side, output ports on the right side.- Anchor points are automatically generated based on port configuration.  
**See**

- module:core/BaseShape
- module:config/ConnectionTypes

**Example**  
```js
const processor = new LEDProcessor(10, 20, 120, 100);processor.ports = {  video: { input: 4, output: 1 },  sdi: { input: 1, output: 0 }};processor.draw(ctx);
```

* [shapes/LEDProcessor](#module_shapes/LEDProcessor)
    * [.LEDProcessor](#module_shapes/LEDProcessor.LEDProcessor) ⇐ <code>BaseShape</code>
        * [new exports.LEDProcessor(x, y, width, height)](#new_module_shapes/LEDProcessor.LEDProcessor_new)
        * [.ports](#module_shapes/LEDProcessor.LEDProcessor+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
        * [.getAnchorPoints()](#module_shapes/LEDProcessor.LEDProcessor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>

<a name="module_shapes/LEDProcessor.LEDProcessor"></a>

### shapes/LEDProcessor.LEDProcessor ⇐ <code>BaseShape</code>
Represents an LED video processing device.

**Kind**: static class of [<code>shapes/LEDProcessor</code>](#module_shapes/LEDProcessor)  
**Extends**: <code>BaseShape</code>  

* [.LEDProcessor](#module_shapes/LEDProcessor.LEDProcessor) ⇐ <code>BaseShape</code>
    * [new exports.LEDProcessor(x, y, width, height)](#new_module_shapes/LEDProcessor.LEDProcessor_new)
    * [.ports](#module_shapes/LEDProcessor.LEDProcessor+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getAnchorPoints()](#module_shapes/LEDProcessor.LEDProcessor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>

<a name="new_module_shapes/LEDProcessor.LEDProcessor_new"></a>

#### new exports.LEDProcessor(x, y, width, height)
Creates a new LEDProcessor instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="module_shapes/LEDProcessor.LEDProcessor+ports"></a>

#### ledProcessor.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration

**Kind**: instance property of [<code>LEDProcessor</code>](#module_shapes/LEDProcessor.LEDProcessor)  
<a name="module_shapes/LEDProcessor.LEDProcessor+getAnchorPoints"></a>

#### ledProcessor.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.

**Kind**: instance method of [<code>LEDProcessor</code>](#module_shapes/LEDProcessor.LEDProcessor)  

