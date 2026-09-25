# VideoMatrix

_Source: `js/shapes/VideoMatrix.js`_

<a name="module_shapes/VideoMatrix"></a>

## shapes/VideoMatrix
Video routing matrix system object (video + SDI ports). Renders as a rectangle with an "M" glyph.

**See**: module:core/SystemObject  

* [shapes/VideoMatrix](#module_shapes/VideoMatrix)
    * [.VideoMatrix](#module_shapes/VideoMatrix.VideoMatrix)
        * [new exports.VideoMatrix(x, y, width, height)](#new_module_shapes/VideoMatrix.VideoMatrix_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/VideoMatrix.VideoMatrix+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/VideoMatrix.VideoMatrix.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/VideoMatrix.VideoMatrix"></a>

### shapes/VideoMatrix.VideoMatrix
**Kind**: static class of [<code>shapes/VideoMatrix</code>](#module_shapes/VideoMatrix)  

* [.VideoMatrix](#module_shapes/VideoMatrix.VideoMatrix)
    * [new exports.VideoMatrix(x, y, width, height)](#new_module_shapes/VideoMatrix.VideoMatrix_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/VideoMatrix.VideoMatrix+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/VideoMatrix.VideoMatrix.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/VideoMatrix.VideoMatrix_new"></a>

#### new exports.VideoMatrix(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/VideoMatrix.VideoMatrix+drawIcon"></a>

#### videoMatrix.drawIcon(ctx)
Draws the "M" glyph.

**Kind**: instance method of [<code>VideoMatrix</code>](#module_shapes/VideoMatrix.VideoMatrix)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/VideoMatrix.VideoMatrix.defaultPorts"></a>

#### VideoMatrix.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>VideoMatrix</code>](#module_shapes/VideoMatrix.VideoMatrix)  

