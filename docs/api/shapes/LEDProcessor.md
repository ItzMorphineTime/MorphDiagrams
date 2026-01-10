# LEDProcessor

_Source: `js/shapes/LEDProcessor.js`_

<a name="module_shapes/LEDProcessor"></a>

## shapes/LEDProcessor
Diagram shape implementation for `LEDProcessor`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { LEDProcessor } from './shapes/LEDProcessor.js';
```

* [shapes/LEDProcessor](#module_shapes/LEDProcessor)
    * _static_
        * [.LEDProcessor](#module_shapes/LEDProcessor.LEDProcessor)
            * [new exports.LEDProcessor(x, y, width, height)](#new_module_shapes/LEDProcessor.LEDProcessor_new)
            * [.ports](#module_shapes/LEDProcessor.LEDProcessor+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
            * [.getAnchorPoints()](#module_shapes/LEDProcessor.LEDProcessor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
            * [.draw(ctx)](#module_shapes/LEDProcessor.LEDProcessor+draw)
            * [.toJSON()](#module_shapes/LEDProcessor.LEDProcessor+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~LEDProcessor](#module_shapes/LEDProcessor..LEDProcessor) ⇐ <code>BaseShape</code>
            * [new LEDProcessor()](#new_module_shapes/LEDProcessor..LEDProcessor_new)

<a name="module_shapes/LEDProcessor.LEDProcessor"></a>

### shapes/LEDProcessor.LEDProcessor
**Kind**: static class of [<code>shapes/LEDProcessor</code>](#module_shapes/LEDProcessor)  

* [.LEDProcessor](#module_shapes/LEDProcessor.LEDProcessor)
    * [new exports.LEDProcessor(x, y, width, height)](#new_module_shapes/LEDProcessor.LEDProcessor_new)
    * [.ports](#module_shapes/LEDProcessor.LEDProcessor+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getAnchorPoints()](#module_shapes/LEDProcessor.LEDProcessor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
    * [.draw(ctx)](#module_shapes/LEDProcessor.LEDProcessor+draw)
    * [.toJSON()](#module_shapes/LEDProcessor.LEDProcessor+toJSON) ⇒ <code>\*</code>

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
<a name="module_shapes/LEDProcessor.LEDProcessor+draw"></a>

#### ledProcessor.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>LEDProcessor</code>](#module_shapes/LEDProcessor.LEDProcessor)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/LEDProcessor.LEDProcessor+toJSON"></a>

#### ledProcessor.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>LEDProcessor</code>](#module_shapes/LEDProcessor.LEDProcessor)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/LEDProcessor..LEDProcessor"></a>

### shapes/LEDProcessor~LEDProcessor ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/LEDProcessor</code>](#module_shapes/LEDProcessor)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/LEDProcessor..LEDProcessor_new"></a>

#### new LEDProcessor()
LEDProcessor shape representing an LED video processing device.
Handles video and SDI inputs for LED wall output.
Renders as a capsule (rounded rectangle) shape.


