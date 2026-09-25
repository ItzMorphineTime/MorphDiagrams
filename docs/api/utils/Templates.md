# Templates

_Source: `js/utils/Templates.js`_

<a name="Templates"></a>

## Templates
**Kind**: global class  

* [Templates](#Templates)
    * [new Templates()](#new_Templates_new)
    * [.createBasicFlowchart()](#Templates.createBasicFlowchart) ⇒ <code>Object</code>
    * [.createVirtualProductionVolume()](#Templates.createVirtualProductionVolume) ⇒ <code>Object</code>

<a name="new_Templates_new"></a>

### new Templates()
Provides static methods for creating pre-configured diagram templates.Each template returns an object with a name and an array of shape/connector objects.

<a name="Templates.createBasicFlowchart"></a>

### Templates.createBasicFlowchart() ⇒ <code>Object</code>
Creates a basic flowchart template with start, process, decision, and end nodes.

**Kind**: static method of [<code>Templates</code>](#Templates)  
**Returns**: <code>Object</code> - Template with flowchart shapes and connectors  
<a name="Templates.createVirtualProductionVolume"></a>

### Templates.createVirtualProductionVolume() ⇒ <code>Object</code>
Extra-large virtual production LED volume: 10 render servers (2 outputs each) and a video matrixfeeding 4 LED processors, 4 LED distros and 4 wall sections; 4 control machines on 2 KVMs;a core switch with 4 separated VLANs (render, tracking, control/management, media & camera);10 tracking cameras and a tracking server; a show camera with genlock; 2 comfort monitors;4 PDUs. Everything is wired through typed ports so the signal path can be traced.

**Kind**: static method of [<code>Templates</code>](#Templates)  

