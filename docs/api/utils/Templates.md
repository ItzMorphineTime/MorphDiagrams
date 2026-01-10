# Templates

_Source: `js/utils/Templates.js`_

<a name="module_utils/Templates"></a>

## utils/Templates
Pre-configured diagram templates for quick start. Provides factory methods for creating common diagram layouts including flowcharts, org charts, network diagrams, and system diagrams.

**Remarks**: - Templates return objects with a name and an array of shape/connector objects.- Templates can be inserted into the canvas via the template system.- System diagram templates include pre-configured port configurations for network devices.  
**See**

- module:core/Connector
- module:shapes/Server

**Example**  
```js
import { Templates } from './utils/Templates.js';const template = Templates.createBasicFlowchart();objects.push(...template.objects);
```

* [utils/Templates](#module_utils/Templates)
    * [.Templates](#module_utils/Templates.Templates)
        * [.createBasicFlowchart()](#module_utils/Templates.Templates.createBasicFlowchart) ⇒ <code>Object</code>
        * [.createThreeTierArchitecture()](#module_utils/Templates.Templates.createThreeTierArchitecture) ⇒ <code>Object</code>
        * [.createNetworkDiagram()](#module_utils/Templates.Templates.createNetworkDiagram) ⇒ <code>Object</code>
        * [.createOrgChart()](#module_utils/Templates.Templates.createOrgChart) ⇒ <code>Object</code>
        * [.createSystemDiagram()](#module_utils/Templates.Templates.createSystemDiagram) ⇒ <code>Object</code>
        * [.getAllTemplates()](#module_utils/Templates.Templates.getAllTemplates) ⇒ <code>Array.&lt;{id:string, name:string, create:Function}&gt;</code>

<a name="module_utils/Templates.Templates"></a>

### utils/Templates.Templates
Provides static methods for creating pre-configured diagram templates.

**Kind**: static class of [<code>utils/Templates</code>](#module_utils/Templates)  

* [.Templates](#module_utils/Templates.Templates)
    * [.createBasicFlowchart()](#module_utils/Templates.Templates.createBasicFlowchart) ⇒ <code>Object</code>
    * [.createThreeTierArchitecture()](#module_utils/Templates.Templates.createThreeTierArchitecture) ⇒ <code>Object</code>
    * [.createNetworkDiagram()](#module_utils/Templates.Templates.createNetworkDiagram) ⇒ <code>Object</code>
    * [.createOrgChart()](#module_utils/Templates.Templates.createOrgChart) ⇒ <code>Object</code>
    * [.createSystemDiagram()](#module_utils/Templates.Templates.createSystemDiagram) ⇒ <code>Object</code>
    * [.getAllTemplates()](#module_utils/Templates.Templates.getAllTemplates) ⇒ <code>Array.&lt;{id:string, name:string, create:Function}&gt;</code>

<a name="module_utils/Templates.Templates.createBasicFlowchart"></a>

#### Templates.createBasicFlowchart() ⇒ <code>Object</code>
Creates a basic flowchart template with start, process, decision, and end nodes.

**Kind**: static method of [<code>Templates</code>](#module_utils/Templates.Templates)  
**Returns**: <code>Object</code> - Template with flowchart shapes and connectors.  
**Example**  
```js
const template = Templates.createBasicFlowchart();console.log(template.name); // "Basic Flowchart"objects.push(...template.objects);
```
<a name="module_utils/Templates.Templates.createThreeTierArchitecture"></a>

#### Templates.createThreeTierArchitecture() ⇒ <code>Object</code>
Creates a 3-tier architecture template with presentation, business, and data layers.

**Kind**: static method of [<code>Templates</code>](#module_utils/Templates.Templates)  
**Returns**: <code>Object</code> - Template with 3-tier architecture shapes and connectors.  
<a name="module_utils/Templates.Templates.createNetworkDiagram"></a>

#### Templates.createNetworkDiagram() ⇒ <code>Object</code>
Creates a network diagram template with server, database, and user icons.

**Kind**: static method of [<code>Templates</code>](#module_utils/Templates.Templates)  
**Returns**: <code>Object</code> - Template with network diagram shapes.  
<a name="module_utils/Templates.Templates.createOrgChart"></a>

#### Templates.createOrgChart() ⇒ <code>Object</code>
Creates an organization chart template with CEO and manager positions.

**Kind**: static method of [<code>Templates</code>](#module_utils/Templates.Templates)  
**Returns**: <code>Object</code> - Template with organization chart shapes and connectors.  
<a name="module_utils/Templates.Templates.createSystemDiagram"></a>

#### Templates.createSystemDiagram() ⇒ <code>Object</code>
Creates a system diagram template with network devices (Sync Generator, Network Switch, Server, Video Matrix, LED Processor).Includes pre-configured port configurations and typed connections between devices.

**Kind**: static method of [<code>Templates</code>](#module_utils/Templates.Templates)  
**Returns**: <code>Object</code> - Template with system diagram shapes and connectors.  
**Example**  
```js
const template = Templates.createSystemDiagram();// Template includes devices with port configurations and typed SDI/Video/Network connections
```
<a name="module_utils/Templates.Templates.getAllTemplates"></a>

#### Templates.getAllTemplates() ⇒ <code>Array.&lt;{id:string, name:string, create:Function}&gt;</code>
Gets all available templates as an array of template metadata.

**Kind**: static method of [<code>Templates</code>](#module_utils/Templates.Templates)  
**Returns**: <code>Array.&lt;{id:string, name:string, create:Function}&gt;</code> - Array of all templates with their IDs, names, and create functions.  
**Example**  
```js
const templates = Templates.getAllTemplates();templates.forEach(t => console.log(t.name));
```

