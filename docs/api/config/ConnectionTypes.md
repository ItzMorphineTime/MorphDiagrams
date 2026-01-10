# ConnectionTypes

_Source: `js/config/ConnectionTypes.js`_

<a name="module_config/ConnectionTypes"></a>

## config/ConnectionTypes
Configuration constants for connection types, colors, and port types. Defines the available connection types (video, SDI, network, USB) and their associated colors, as well as default colors for system objects and port direction types.

**Remarks**: - Connection types enable typed network diagrams with color-coded connections.- Object colors provide default styling for system device shapes.- Port types define input/output directionality for connection validation.  
**See**

- module:core/Connector
- module:shapes/Server

**Example**  
```js
import { ConnectionTypes, ConnectionColors, ObjectColors } from './config/ConnectionTypes.js';const connector = new Connector(start, 'right', end, 'left', ConnectionTypes.VIDEO);connector.stroke = ConnectionColors.video; // '#FFD700'
```

* [config/ConnectionTypes](#module_config/ConnectionTypes)
    * [.ConnectionTypes](#module_config/ConnectionTypes.ConnectionTypes) : <code>enum</code>
    * [.ConnectionColors](#module_config/ConnectionTypes.ConnectionColors) : <code>enum</code>
    * [.ObjectColors](#module_config/ConnectionTypes.ObjectColors) : <code>enum</code>
    * [.PortTypes](#module_config/ConnectionTypes.PortTypes) : <code>enum</code>

<a name="module_config/ConnectionTypes.ConnectionTypes"></a>

### config/ConnectionTypes.ConnectionTypes : <code>enum</code>
Supported connection types for network diagram connectors.

**Kind**: static enum of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
**Read only**: true  
<a name="module_config/ConnectionTypes.ConnectionColors"></a>

### config/ConnectionTypes.ConnectionColors : <code>enum</code>
Default colors for each connection type.Colors are used to visually distinguish different connection types on the canvas.

**Kind**: static enum of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
**Read only**: true  
<a name="module_config/ConnectionTypes.ObjectColors"></a>

### config/ConnectionTypes.ObjectColors : <code>enum</code>
Default fill colors for system object types.Used to visually distinguish different device types on the canvas.

**Kind**: static enum of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
**Read only**: true  
<a name="module_config/ConnectionTypes.PortTypes"></a>

### config/ConnectionTypes.PortTypes : <code>enum</code>
Port direction types for defining input/output ports.

**Kind**: static enum of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
**Read only**: true  

