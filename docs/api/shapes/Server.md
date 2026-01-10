# Server

_Source: `js/shapes/Server.js`_

<a name="module_shapes/Server"></a>

## shapes/Server
Server shape representing a network server with multiple port types. Supports video, SDI, network, and USB connections.

**Remarks**: - Renders as a rectangle with horizontal rack lines to indicate server rack units.- Port configuration defines input/output ports for each connection type (video, sdi, network, usb).- Input ports appear on the left side, output ports on the right side.- Anchor points are automatically generated based on port configuration.  
**See**

- module:core/BaseShape
- module:config/ConnectionTypes

**Example**  
```js
const server = new Server(10, 20, 120, 180);server.ports = {  video: { input: 2, output: 4 },  sdi: { input: 1, output: 0 },  network: { input: 2, output: 0 }};server.draw(ctx);
```

* [shapes/Server](#module_shapes/Server)
    * [.Server](#module_shapes/Server.Server) ⇐ <code>BaseShape</code>
        * [new exports.Server(x, y, width, height)](#new_module_shapes/Server.Server_new)
        * [.type](#module_shapes/Server.Server+type) : <code>string</code>
        * [.fill](#module_shapes/Server.Server+fill) : <code>string</code>
        * [.ports](#module_shapes/Server.Server+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
        * [.getAnchorPoints()](#module_shapes/Server.Server+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
        * [.draw(ctx)](#module_shapes/Server.Server+draw)
        * [.toJSON()](#module_shapes/Server.Server+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/Server.Server"></a>

### shapes/Server.Server ⇐ <code>BaseShape</code>
Represents a network server with configurable ports.

**Kind**: static class of [<code>shapes/Server</code>](#module_shapes/Server)  
**Extends**: <code>BaseShape</code>  

* [.Server](#module_shapes/Server.Server) ⇐ <code>BaseShape</code>
    * [new exports.Server(x, y, width, height)](#new_module_shapes/Server.Server_new)
    * [.type](#module_shapes/Server.Server+type) : <code>string</code>
    * [.fill](#module_shapes/Server.Server+fill) : <code>string</code>
    * [.ports](#module_shapes/Server.Server+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getAnchorPoints()](#module_shapes/Server.Server+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
    * [.draw(ctx)](#module_shapes/Server.Server+draw)
    * [.toJSON()](#module_shapes/Server.Server+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/Server.Server_new"></a>

#### new exports.Server(x, y, width, height)
Creates a new Server instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner. |
| y | <code>number</code> | Y-coordinate of top-left corner. |
| width | <code>number</code> | Width in pixels. |
| height | <code>number</code> | Height in pixels. |

**Example**  
```js
const server = new Server(10, 20, 120, 180);
```
<a name="module_shapes/Server.Server+type"></a>

#### server.type : <code>string</code>
Shape type identifier

**Kind**: instance property of [<code>Server</code>](#module_shapes/Server.Server)  
<a name="module_shapes/Server.Server+fill"></a>

#### server.fill : <code>string</code>
Fill color from ObjectColors config

**Kind**: instance property of [<code>Server</code>](#module_shapes/Server.Server)  
<a name="module_shapes/Server.Server+ports"></a>

#### server.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration defining input/output ports for each connection type.Inputs appear on left side, outputs on right side.

**Kind**: instance property of [<code>Server</code>](#module_shapes/Server.Server)  
<a name="module_shapes/Server.Server+getAnchorPoints"></a>

#### server.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.Distributes input ports evenly along left edge, output ports along right edge.Each anchor includes connectionType and portType for connection validation.

**Kind**: instance method of [<code>Server</code>](#module_shapes/Server.Server)  
<a name="module_shapes/Server.Server+draw"></a>

#### server.draw(ctx)
Draws the server shape as a rectangle with horizontal rack lines.

**Kind**: instance method of [<code>Server</code>](#module_shapes/Server.Server)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="module_shapes/Server.Server+toJSON"></a>

#### server.toJSON() ⇒ <code>Object</code>
Serializes the server to JSON, including port configuration.

**Kind**: instance method of [<code>Server</code>](#module_shapes/Server.Server)  
**Returns**: <code>Object</code> - JSON representation with ports  

