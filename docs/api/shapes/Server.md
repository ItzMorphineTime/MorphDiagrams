# Server

_Source: `js/shapes/Server.js`_

<a name="module_shapes/Server"></a>

## shapes/Server
Rack server system object with video, SDI, network and USB ports.
Renders as a rectangle with horizontal rack lines.

**See**: module:core/SystemObject  
**Example**  
```js
const srv = new Server(100, 100, 120, 180);
srv.ports.video.output = 4;
```

* [shapes/Server](#module_shapes/Server)
    * [.Server](#module_shapes/Server.Server)
        * [new exports.Server(x, y, width, height)](#new_module_shapes/Server.Server_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/Server.Server+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/Server.Server.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/Server.Server"></a>

### shapes/Server.Server
**Kind**: static class of [<code>shapes/Server</code>](#module_shapes/Server)  

* [.Server](#module_shapes/Server.Server)
    * [new exports.Server(x, y, width, height)](#new_module_shapes/Server.Server_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/Server.Server+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/Server.Server.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/Server.Server_new"></a>

#### new exports.Server(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/Server.Server+drawIcon"></a>

#### server.drawIcon(ctx)
Draws the rack lines.

**Kind**: instance method of [<code>Server</code>](#module_shapes/Server.Server)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/Server.Server.defaultPorts"></a>

#### Server.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>Server</code>](#module_shapes/Server.Server)  

