# ConnectionTypes

_Source: `js/config/ConnectionTypes.js`_

## Constants

<dl>
<dt><a href="#ConnectionTypes">ConnectionTypes</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Supported connection types for network diagram connectors.</p>
</dd>
<dt><a href="#ConnectionColors">ConnectionColors</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Default colors for each connection type.
Colors are used to visually distinguish different connection types on the canvas.</p>
</dd>
<dt><a href="#ObjectColors">ObjectColors</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Default fill colors for system object types.
Used to visually distinguish different device types on the canvas.</p>
</dd>
<dt><a href="#PortTypes">PortTypes</a> : <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Port direction types for defining input/output ports.</p>
</dd>
</dl>

<a name="ConnectionTypes"></a>

## ConnectionTypes : <code>Object.&lt;string, string&gt;</code>
Supported connection types for network diagram connectors.

**Kind**: global constant  

* [ConnectionTypes](#ConnectionTypes) : <code>Object.&lt;string, string&gt;</code>
    * [.VIDEO](#ConnectionTypes.VIDEO)
    * [.SDI](#ConnectionTypes.SDI)
    * [.NETWORK](#ConnectionTypes.NETWORK)
    * [.USB](#ConnectionTypes.USB)

<a name="ConnectionTypes.VIDEO"></a>

### ConnectionTypes.VIDEO
Video connection type

**Kind**: static property of [<code>ConnectionTypes</code>](#ConnectionTypes)  
<a name="ConnectionTypes.SDI"></a>

### ConnectionTypes.SDI
SDI (Serial Digital Interface) connection type

**Kind**: static property of [<code>ConnectionTypes</code>](#ConnectionTypes)  
<a name="ConnectionTypes.NETWORK"></a>

### ConnectionTypes.NETWORK
Network/Ethernet connection type

**Kind**: static property of [<code>ConnectionTypes</code>](#ConnectionTypes)  
<a name="ConnectionTypes.USB"></a>

### ConnectionTypes.USB
USB connection type

**Kind**: static property of [<code>ConnectionTypes</code>](#ConnectionTypes)  
<a name="ConnectionColors"></a>

## ConnectionColors : <code>Object.&lt;string, string&gt;</code>
Default colors for each connection type.
Colors are used to visually distinguish different connection types on the canvas.

**Kind**: global constant  

* [ConnectionColors](#ConnectionColors) : <code>Object.&lt;string, string&gt;</code>
    * [.ConnectionTypes.VIDEO](#ConnectionColors.ConnectionTypes.VIDEO)
    * [.ConnectionTypes.SDI](#ConnectionColors.ConnectionTypes.SDI)
    * [.ConnectionTypes.NETWORK](#ConnectionColors.ConnectionTypes.NETWORK)
    * [.ConnectionTypes.USB](#ConnectionColors.ConnectionTypes.USB)

<a name="ConnectionColors.ConnectionTypes.VIDEO"></a>

### ConnectionColors.ConnectionTypes.VIDEO
Gold color for video connections

**Kind**: static property of [<code>ConnectionColors</code>](#ConnectionColors)  
<a name="ConnectionColors.ConnectionTypes.SDI"></a>

### ConnectionColors.ConnectionTypes.SDI
Orange red color for SDI connections

**Kind**: static property of [<code>ConnectionColors</code>](#ConnectionColors)  
<a name="ConnectionColors.ConnectionTypes.NETWORK"></a>

### ConnectionColors.ConnectionTypes.NETWORK
Dark turquoise color for network connections

**Kind**: static property of [<code>ConnectionColors</code>](#ConnectionColors)  
<a name="ConnectionColors.ConnectionTypes.USB"></a>

### ConnectionColors.ConnectionTypes.USB
Medium purple color for USB connections

**Kind**: static property of [<code>ConnectionColors</code>](#ConnectionColors)  
<a name="ObjectColors"></a>

## ObjectColors : <code>Object.&lt;string, string&gt;</code>
Default fill colors for system object types.
Used to visually distinguish different device types on the canvas.

**Kind**: global constant  

* [ObjectColors](#ObjectColors) : <code>Object.&lt;string, string&gt;</code>
    * [.SERVER](#ObjectColors.SERVER)
    * [.NETWORK_SWITCH](#ObjectColors.NETWORK_SWITCH)
    * [.VIDEO_MATRIX](#ObjectColors.VIDEO_MATRIX)
    * [.LED_PROCESSOR](#ObjectColors.LED_PROCESSOR)
    * [.SYNC_GENERATOR](#ObjectColors.SYNC_GENERATOR)

<a name="ObjectColors.SERVER"></a>

### ObjectColors.SERVER
Dark blue-gray for server objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="ObjectColors.NETWORK_SWITCH"></a>

### ObjectColors.NETWORK\_SWITCH
Green for network switch objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="ObjectColors.VIDEO_MATRIX"></a>

### ObjectColors.VIDEO\_MATRIX
Red for video matrix objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="ObjectColors.LED_PROCESSOR"></a>

### ObjectColors.LED\_PROCESSOR
Orange for LED processor objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="ObjectColors.SYNC_GENERATOR"></a>

### ObjectColors.SYNC\_GENERATOR
Purple for sync generator objects

**Kind**: static property of [<code>ObjectColors</code>](#ObjectColors)  
<a name="PortTypes"></a>

## PortTypes : <code>Object.&lt;string, string&gt;</code>
Port direction types for defining input/output ports.

**Kind**: global constant  

* [PortTypes](#PortTypes) : <code>Object.&lt;string, string&gt;</code>
    * [.INPUT](#PortTypes.INPUT)
    * [.OUTPUT](#PortTypes.OUTPUT)

<a name="PortTypes.INPUT"></a>

### PortTypes.INPUT
Input port direction

**Kind**: static property of [<code>PortTypes</code>](#PortTypes)  
<a name="PortTypes.OUTPUT"></a>

### PortTypes.OUTPUT
Output port direction

**Kind**: static property of [<code>PortTypes</code>](#PortTypes)  

