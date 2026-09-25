# Monitor

_Source: `js/shapes/Monitor.js`_

<a name="module_shapes/Monitor"></a>

## shapes/Monitor
Display / monitor system object: video and SDI inputs with a loop-through output.
Renders as a screen with a bezel and a stand.

**See**: module:core/SystemObject  

* [shapes/Monitor](#module_shapes/Monitor)
    * [.Monitor](#module_shapes/Monitor.Monitor)
        * [new exports.Monitor(x, y, width, height)](#new_module_shapes/Monitor.Monitor_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/Monitor.Monitor+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/Monitor.Monitor.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/Monitor.Monitor"></a>

### shapes/Monitor.Monitor
**Kind**: static class of [<code>shapes/Monitor</code>](#module_shapes/Monitor)  

* [.Monitor](#module_shapes/Monitor.Monitor)
    * [new exports.Monitor(x, y, width, height)](#new_module_shapes/Monitor.Monitor_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/Monitor.Monitor+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/Monitor.Monitor.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/Monitor.Monitor_new"></a>

#### new exports.Monitor(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/Monitor.Monitor+drawIcon"></a>

#### monitor.drawIcon(ctx)
Draws the screen inset and the stand.

**Kind**: instance method of [<code>Monitor</code>](#module_shapes/Monitor.Monitor)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/Monitor.Monitor.defaultPorts"></a>

#### Monitor.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>Monitor</code>](#module_shapes/Monitor.Monitor)  

