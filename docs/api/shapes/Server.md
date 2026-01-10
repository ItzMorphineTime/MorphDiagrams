# Server

_Source: `js/shapes/Server.js`_

<a name="module_shapes/Server"></a>

## shapes/Server
Diagram shape implementation for `Server`.

**See**

- module:core/BaseShape
- module:core/Connector

**Example**  
```js
import { Server } from './shapes/Server.js';
```

* [shapes/Server](#module_shapes/Server)
    * _static_
        * [.Server](#module_shapes/Server.Server)
            * [new exports.Server(x, y, width, height)](#new_module_shapes/Server.Server_new)
            * [.type](#module_shapes/Server.Server+type) : <code>string</code>
            * [.fill](#module_shapes/Server.Server+fill) : <code>string</code>
            * [.ports](#module_shapes/Server.Server+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
            * [.getAnchorPoints()](#module_shapes/Server.Server+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
            * [.draw(ctx)](#module_shapes/Server.Server+draw)
            * [.toJSON()](#module_shapes/Server.Server+toJSON) ⇒ <code>Object</code>
    * _inner_
        * [~Server](#module_shapes/Server..Server) ⇐ <code>BaseShape</code>
            * [new Server()](#new_module_shapes/Server..Server_new)

<a name="module_shapes/Server.Server"></a>

### shapes/Server.Server
**Kind**: static class of [<code>shapes/Server</code>](#module_shapes/Server)  

* [.Server](#module_shapes/Server.Server)
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
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

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
Port configuration defining input/output ports for each connection type.
Inputs appear on left side, outputs on right side.

**Kind**: instance property of [<code>Server</code>](#module_shapes/Server.Server)  
<a name="module_shapes/Server.Server+getAnchorPoints"></a>

#### server.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.
Distributes input ports evenly along left edge, output ports along right edge.
Each anchor includes connectionType and portType for connection validation.

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
<a name="module_shapes/Server..Server"></a>

### shapes/Server~Server ⇐ <code>BaseShape</code>
**Kind**: inner class of [<code>shapes/Server</code>](#module_shapes/Server)  
**Extends**: <code>BaseShape</code>  
<a name="new_module_shapes/Server..Server_new"></a>

#### new Server()
Server shape representing a network server with multiple port types.
Supports video, SDI, network, and USB connections.
Renders as a rectangle with horizontal rack lines.


