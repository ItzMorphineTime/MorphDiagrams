# VideoMatrix

_Source: `js/shapes/VideoMatrix.js`_

<a name="VideoMatrix"></a>

## VideoMatrix ⇐ <code>BaseShape</code>
**Kind**: global class  
**Extends**: <code>BaseShape</code>  

* [VideoMatrix](#VideoMatrix) ⇐ <code>BaseShape</code>
    * [new VideoMatrix()](#new_VideoMatrix_new)
    * [.VideoMatrix](#VideoMatrix+VideoMatrix)
        * [new exports.VideoMatrix(x, y, width, height)](#new_VideoMatrix+VideoMatrix_new)
    * [.ports](#VideoMatrix+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getAnchorPoints()](#VideoMatrix+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>

<a name="new_VideoMatrix_new"></a>

### new VideoMatrix()
VideoMatrix shape representing a video routing matrix.
Supports video and SDI connections with configurable input/output ports.
Renders as a rectangle with an 'M' letter drawn in the center.

<a name="VideoMatrix+VideoMatrix"></a>

### videoMatrix.VideoMatrix
**Kind**: instance class of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="new_VideoMatrix+VideoMatrix_new"></a>

#### new exports.VideoMatrix(x, y, width, height)
Creates a new VideoMatrix instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="VideoMatrix+ports"></a>

### videoMatrix.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration

**Kind**: instance property of [<code>VideoMatrix</code>](#VideoMatrix)  
<a name="VideoMatrix+getAnchorPoints"></a>

### videoMatrix.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.

**Kind**: instance method of [<code>VideoMatrix</code>](#VideoMatrix)  

