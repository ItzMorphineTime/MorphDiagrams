# Camera

_Source: `js/shapes/Camera.js`_

<a name="module_shapes/Camera"></a>

## shapes/Camera
Camera system object: SDI outputs, a reference (genlock) input, network control and power.
Renders as a camera body with a lens.

**See**: module:core/SystemObject  

* [shapes/Camera](#module_shapes/Camera)
    * [.Camera](#module_shapes/Camera.Camera)
        * [new exports.Camera(x, y, width, height)](#new_module_shapes/Camera.Camera_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/Camera.Camera+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/Camera.Camera.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/Camera.Camera"></a>

### shapes/Camera.Camera
**Kind**: static class of [<code>shapes/Camera</code>](#module_shapes/Camera)  

* [.Camera](#module_shapes/Camera.Camera)
    * [new exports.Camera(x, y, width, height)](#new_module_shapes/Camera.Camera_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/Camera.Camera+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/Camera.Camera.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/Camera.Camera_new"></a>

#### new exports.Camera(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/Camera.Camera+drawIcon"></a>

#### camera.drawIcon(ctx)
Draws the lens and viewfinder.

**Kind**: instance method of [<code>Camera</code>](#module_shapes/Camera.Camera)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/Camera.Camera.defaultPorts"></a>

#### Camera.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>Camera</code>](#module_shapes/Camera.Camera)  

