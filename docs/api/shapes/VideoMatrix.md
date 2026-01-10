# VideoMatrix

_Source: `js/shapes/VideoMatrix.js`_

<a name="module_shapes/VideoMatrix"></a>

## shapes/VideoMatrix
VideoMatrix shape representing a video routing matrix. Supports video and SDI connections with configurable input/output ports.

**Remarks**: - Renders as a rectangle with an 'M' letter drawn in the center.- Port configuration defines input/output ports for video and SDI connections.- Input ports appear on the left side, output ports on the right side.- Anchor points are automatically generated based on port configuration.  
**See**

- module:core/BaseShape
- module:config/ConnectionTypes

**Example**  
```js
const matrix = new VideoMatrix(10, 20, 120, 180);matrix.ports = {  video: { input: 4, output: 4 },  sdi: { input: 2, output: 2 }};matrix.draw(ctx);
```

* [shapes/VideoMatrix](#module_shapes/VideoMatrix)
    * [.VideoMatrix](#module_shapes/VideoMatrix.VideoMatrix) ⇐ <code>BaseShape</code>
        * [new exports.VideoMatrix(x, y, width, height)](#new_module_shapes/VideoMatrix.VideoMatrix_new)
        * [.ports](#module_shapes/VideoMatrix.VideoMatrix+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
        * [.getAnchorPoints()](#module_shapes/VideoMatrix.VideoMatrix+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>

<a name="module_shapes/VideoMatrix.VideoMatrix"></a>

### shapes/VideoMatrix.VideoMatrix ⇐ <code>BaseShape</code>
Represents a video routing matrix device.

**Kind**: static class of [<code>shapes/VideoMatrix</code>](#module_shapes/VideoMatrix)  
**Extends**: <code>BaseShape</code>  

* [.VideoMatrix](#module_shapes/VideoMatrix.VideoMatrix) ⇐ <code>BaseShape</code>
    * [new exports.VideoMatrix(x, y, width, height)](#new_module_shapes/VideoMatrix.VideoMatrix_new)
    * [.ports](#module_shapes/VideoMatrix.VideoMatrix+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getAnchorPoints()](#module_shapes/VideoMatrix.VideoMatrix+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>

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

