# VideoMatrix

_Source: `js/shapes/VideoMatrix.js`_

<a name="module_shapes/VideoMatrix"></a>

## shapes/VideoMatrix
Diagram shape implementation for `VideoMatrix`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { VideoMatrix } from './shapes/VideoMatrix.js';
```

* [shapes/VideoMatrix](#module_shapes/VideoMatrix)
    * _static_
        * [.VideoMatrix](#module_shapes/VideoMatrix.VideoMatrix)
            * [new exports.VideoMatrix(x, y, width, height)](#new_module_shapes/VideoMatrix.VideoMatrix_new)
            * [.ports](#module_shapes/VideoMatrix.VideoMatrix+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
            * [.getAnchorPoints()](#module_shapes/VideoMatrix.VideoMatrix+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
            * [.draw(ctx)](#module_shapes/VideoMatrix.VideoMatrix+draw)
            * [.toJSON()](#module_shapes/VideoMatrix.VideoMatrix+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~VideoMatrix](#module_shapes/VideoMatrix..VideoMatrix) ⇐ <code>BaseShape</code>
            * [new VideoMatrix()](#new_module_shapes/VideoMatrix..VideoMatrix_new)

<a name="module_shapes/VideoMatrix.VideoMatrix"></a>

### shapes/VideoMatrix.VideoMatrix
**Kind**: static class of [<code>shapes/VideoMatrix</code>](#module_shapes/VideoMatrix)  

* [.VideoMatrix](#module_shapes/VideoMatrix.VideoMatrix)
    * [new exports.VideoMatrix(x, y, width, height)](#new_module_shapes/VideoMatrix.VideoMatrix_new)
    * [.ports](#module_shapes/VideoMatrix.VideoMatrix+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getAnchorPoints()](#module_shapes/VideoMatrix.VideoMatrix+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
    * [.draw(ctx)](#module_shapes/VideoMatrix.VideoMatrix+draw)
    * [.toJSON()](#module_shapes/VideoMatrix.VideoMatrix+toJSON) ⇒ <code>\*</code>

<a name="new_module_shapes/VideoMatrix.VideoMatrix_new"></a>

#### new exports.VideoMatrix(x, y, width, height)
Creates a new VideoMatrix instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="module_shapes/VideoMatrix.VideoMatrix+ports"></a>

#### videoMatrix.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration

**Kind**: instance property of [<code>VideoMatrix</code>](#module_shapes/VideoMatrix.VideoMatrix)  
<a name="module_shapes/VideoMatrix.VideoMatrix+getAnchorPoints"></a>

#### videoMatrix.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.

**Kind**: instance method of [<code>VideoMatrix</code>](#module_shapes/VideoMatrix.VideoMatrix)  
<a name="module_shapes/VideoMatrix.VideoMatrix+draw"></a>

#### videoMatrix.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>VideoMatrix</code>](#module_shapes/VideoMatrix.VideoMatrix)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_shapes/VideoMatrix.VideoMatrix+toJSON"></a>

#### videoMatrix.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>VideoMatrix</code>](#module_shapes/VideoMatrix.VideoMatrix)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_shapes/VideoMatrix..VideoMatrix"></a>

### shapes/VideoMatrix~VideoMatrix ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/VideoMatrix</code>](#module_shapes/VideoMatrix)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/VideoMatrix..VideoMatrix_new"></a>

#### new VideoMatrix()
VideoMatrix shape representing a video routing matrix.
Supports video and SDI connections with configurable input/output ports.
Renders as a rectangle with an 'M' letter drawn in the center.


