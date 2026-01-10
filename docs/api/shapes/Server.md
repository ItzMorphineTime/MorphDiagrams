# Server

_Source: `js/shapes/Server.js`_

<a name="Server"></a>

## Server ⇐ <code>BaseShape</code>
**Kind**: global class  
**Extends**: <code>BaseShape</code>  

* [Server](#Server) ⇐ <code>BaseShape</code>
    * [new Server()](#new_Server_new)
    * [.Server](#Server+Server)
        * [new exports.Server(x, y, width, height)](#new_Server+Server_new)
    * [.type](#Server+type) : <code>string</code>
    * [.fill](#Server+fill) : <code>string</code>
    * [.ports](#Server+ports) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
    * [.getAnchorPoints()](#Server+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
    * [.draw(ctx)](#Server+draw)
    * [.toJSON()](#Server+toJSON) ⇒ <code>Object</code>

<a name="new_Server_new"></a>

### new Server()
Server shape representing a network server with multiple port types.
Supports video, SDI, network, and USB connections.
Renders as a rectangle with horizontal rack lines.

<a name="Server+Server"></a>

### server.Server
**Kind**: instance class of [<code>Server</code>](#Server)  
<a name="new_Server+Server_new"></a>

#### new exports.Server(x, y, width, height)
Creates a new Server instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |
| width | <code>number</code> | Width in pixels |
| height | <code>number</code> | Height in pixels |

<a name="Server+type"></a>

### server.type : <code>string</code>
Shape type identifier

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="Server+fill"></a>

### server.fill : <code>string</code>
Fill color from ObjectColors config

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="Server+ports"></a>

### server.ports : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
Port configuration defining input/output ports for each connection type.
Inputs appear on left side, outputs on right side.

**Kind**: instance property of [<code>Server</code>](#Server)  
<a name="Server+getAnchorPoints"></a>

### server.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: string, portType: string}&gt;</code>
Gets anchor points for connections based on port configuration.
Distributes input ports evenly along left edge, output ports along right edge.
Each anchor includes connectionType and portType for connection validation.

**Kind**: instance method of [<code>Server</code>](#Server)  
<a name="Server+draw"></a>

### server.draw(ctx)
Draws the server shape as a rectangle with horizontal rack lines.

**Kind**: instance method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="Server+toJSON"></a>

### server.toJSON() ⇒ <code>Object</code>
Serializes the server to JSON, including port configuration.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Returns**: <code>Object</code> - JSON representation with ports  

