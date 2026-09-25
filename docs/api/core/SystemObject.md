# SystemObject

_Source: `js/core/SystemObject.js`_

<a name="module_core/SystemObject"></a>

## core/SystemObject
Base class for hardware/system objects that expose typed input/output ports.

A system object owns a `ports` map:

```js
ports = {
  video:   { input: 2, output: 2 },
  network: { input: 1, output: 0 }
}
```

Inputs are laid out along the left edge and outputs along the right edge (rotated with the shape).
Each port becomes an anchor whose key is `<type>_<direction>_<index>` (see [module:core/Ports](module:core/Ports)).

Subclasses customise the body (`drawBody`), the icon (`drawIcon`) and, for non-rectangular shapes,
the edges ports are distributed on (`getPortEdges`).

**See**

- module:core/Ports
- module:shapes/Device

**Example**  
```js
const dev = new SystemObject(0, 0, 120, 80, { type: 'device', ports: { hdmi: { input: 1, output: 2 } } });
Object.keys(dev.getAnchorPoints()); // ['hdmi_input_0', 'hdmi_output_0', 'hdmi_output_1']
```

* [core/SystemObject](#module_core/SystemObject)
    * _static_
        * [.SystemObject](#module_core/SystemObject.SystemObject)
            * [new exports.SystemObject(x, y, width, height, [options])](#new_module_core/SystemObject.SystemObject_new)
            * _instance_
                * [.ports](#module_core/SystemObject.SystemObject+ports) : <code>PortConfig</code>
                * [.setPorts(ports)](#module_core/SystemObject.SystemObject+setPorts)
                * [.getPortEntries()](#module_core/SystemObject.SystemObject+getPortEntries) ⇒ <code>Array.&lt;{type:string, direction: (&quot;input&quot;\|&quot;output&quot;), index:number, key:string}&gt;</code>
                * [.getPortEdges()](#module_core/SystemObject.SystemObject+getPortEdges) ⇒ <code>Object</code>
                * [.getAnchorPoints()](#module_core/SystemObject.SystemObject+getAnchorPoints) ⇒ <code>Object.&lt;string, AnchorPoint&gt;</code>
                * [.draw(ctx)](#module_core/SystemObject.SystemObject+draw)
                * [.drawBody(ctx)](#module_core/SystemObject.SystemObject+drawBody)
                * [.drawIcon(ctx)](#module_core/SystemObject.SystemObject+drawIcon)
                * [.toJSON()](#module_core/SystemObject.SystemObject+toJSON) ⇒ <code>Object</code>
            * _static_
                * [.normalizePorts(ports)](#module_core/SystemObject.SystemObject.normalizePorts) ⇒ <code>PortConfig</code>
        * [.HexSystemObject](#module_core/SystemObject.HexSystemObject) ⇐ <code>SystemObject</code>
            * [.getPoints()](#module_core/SystemObject.HexSystemObject+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
            * [.getPortEdges()](#module_core/SystemObject.HexSystemObject+getPortEdges) ⇒ <code>Object</code>
            * [.containsPoint(x, y)](#module_core/SystemObject.HexSystemObject+containsPoint) ⇒ <code>boolean</code>
            * [.drawBody(ctx)](#module_core/SystemObject.HexSystemObject+drawBody)
    * _inner_
        * [~PortConfig](#module_core/SystemObject..PortConfig) : <code>Object.&lt;string, {input: number, output: number}&gt;</code>

<a name="module_core/SystemObject.SystemObject"></a>

### core/SystemObject.SystemObject
**Kind**: static class of [<code>core/SystemObject</code>](#module_core/SystemObject)  

* [.SystemObject](#module_core/SystemObject.SystemObject)
    * [new exports.SystemObject(x, y, width, height, [options])](#new_module_core/SystemObject.SystemObject_new)
    * _instance_
        * [.ports](#module_core/SystemObject.SystemObject+ports) : <code>PortConfig</code>
        * [.setPorts(ports)](#module_core/SystemObject.SystemObject+setPorts)
        * [.getPortEntries()](#module_core/SystemObject.SystemObject+getPortEntries) ⇒ <code>Array.&lt;{type:string, direction: (&quot;input&quot;\|&quot;output&quot;), index:number, key:string}&gt;</code>
        * [.getPortEdges()](#module_core/SystemObject.SystemObject+getPortEdges) ⇒ <code>Object</code>
        * [.getAnchorPoints()](#module_core/SystemObject.SystemObject+getAnchorPoints) ⇒ <code>Object.&lt;string, AnchorPoint&gt;</code>
        * [.draw(ctx)](#module_core/SystemObject.SystemObject+draw)
        * [.drawBody(ctx)](#module_core/SystemObject.SystemObject+drawBody)
        * [.drawIcon(ctx)](#module_core/SystemObject.SystemObject+drawIcon)
        * [.toJSON()](#module_core/SystemObject.SystemObject+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.normalizePorts(ports)](#module_core/SystemObject.SystemObject.normalizePorts) ⇒ <code>PortConfig</code>

<a name="new_module_core/SystemObject.SystemObject_new"></a>

#### new exports.SystemObject(x, y, width, height, [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> |  |  |
| y | <code>number</code> |  |  |
| width | <code>number</code> |  |  |
| height | <code>number</code> |  |  |
| [options] | <code>Object</code> |  |  |
| [options.type] | <code>string</code> | <code>&quot;&#x27;device&#x27;&quot;</code> | Type identifier. |
| [options.fill] | <code>string</code> |  | Fill colour. |
| [options.ports] | <code>PortConfig</code> |  | Initial port configuration. |
| [options.labelPosition] | <code>string</code> | <code>&quot;&#x27;bottom&#x27;&quot;</code> |  |

<a name="module_core/SystemObject.SystemObject+ports"></a>

#### systemObject.ports : <code>PortConfig</code>
**Kind**: instance property of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  
<a name="module_core/SystemObject.SystemObject+setPorts"></a>

#### systemObject.setPorts(ports)
Replaces the port configuration.

**Kind**: instance method of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  

| Param | Type |
| --- | --- |
| ports | <code>PortConfig</code> | 

<a name="module_core/SystemObject.SystemObject+getPortEntries"></a>

#### systemObject.getPortEntries() ⇒ <code>Array.&lt;{type:string, direction: (&quot;input&quot;\|&quot;output&quot;), index:number, key:string}&gt;</code>
Ordered list of ports: all inputs (by type order) then all outputs.

**Kind**: instance method of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  
<a name="module_core/SystemObject.SystemObject+getPortEdges"></a>

#### systemObject.getPortEdges() ⇒ <code>Object</code>
Edges that input/output ports are distributed along (unrotated coordinates).
Rectangular objects use the full left and right edges.

**Kind**: instance method of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  
<a name="module_core/SystemObject.SystemObject+getAnchorPoints"></a>

#### systemObject.getAnchorPoints() ⇒ <code>Object.&lt;string, AnchorPoint&gt;</code>
Anchor points for every configured port, evenly spaced along the port edges and rotated with the shape.

**Kind**: instance method of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  
<a name="module_core/SystemObject.SystemObject+draw"></a>

#### systemObject.draw(ctx)
Draws the object: body, icon and label, with rotation and shadow applied.

**Kind**: instance method of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/SystemObject.SystemObject+drawBody"></a>

#### systemObject.drawBody(ctx)
Draws the body outline. Default: a rectangle.

**Kind**: instance method of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/SystemObject.SystemObject+drawIcon"></a>

#### systemObject.drawIcon(ctx)
Draws a type-specific icon. Default: nothing.

**Kind**: instance method of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/SystemObject.SystemObject+toJSON"></a>

#### systemObject.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  
<a name="module_core/SystemObject.SystemObject.normalizePorts"></a>

#### SystemObject.normalizePorts(ports) ⇒ <code>PortConfig</code>
Validates and normalises a port configuration (integer counts >= 0, missing directions default to 0).

**Kind**: static method of [<code>SystemObject</code>](#module_core/SystemObject.SystemObject)  
**Returns**: <code>PortConfig</code> - A fresh, normalised copy.  
**Throws**:

- <code>TypeError</code> If the configuration is malformed.


| Param | Type |
| --- | --- |
| ports | <code>PortConfig</code> \| <code>Object</code> | 

<a name="module_core/SystemObject.HexSystemObject"></a>

### core/SystemObject.HexSystemObject ⇐ <code>SystemObject</code>
System object rendered as a pointy-top hexagon. Inputs sit on the left vertical edge,
outputs on the right vertical edge.

**Kind**: static class of [<code>core/SystemObject</code>](#module_core/SystemObject)  
**Extends**: <code>SystemObject</code>  

* [.HexSystemObject](#module_core/SystemObject.HexSystemObject) ⇐ <code>SystemObject</code>
    * [.getPoints()](#module_core/SystemObject.HexSystemObject+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
    * [.getPortEdges()](#module_core/SystemObject.HexSystemObject+getPortEdges) ⇒ <code>Object</code>
    * [.containsPoint(x, y)](#module_core/SystemObject.HexSystemObject+containsPoint) ⇒ <code>boolean</code>
    * [.drawBody(ctx)](#module_core/SystemObject.HexSystemObject+drawBody)

<a name="module_core/SystemObject.HexSystemObject+getPoints"></a>

#### hexSystemObject.getPoints() ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
The six vertices, starting at the top and going clockwise.

**Kind**: instance method of [<code>HexSystemObject</code>](#module_core/SystemObject.HexSystemObject)  
<a name="module_core/SystemObject.HexSystemObject+getPortEdges"></a>

#### hexSystemObject.getPortEdges() ⇒ <code>Object</code>
Left edge (vertices 5 -> 4) for inputs, right edge (vertices 1 -> 2) for outputs.

**Kind**: instance method of [<code>HexSystemObject</code>](#module_core/SystemObject.HexSystemObject)  
<a name="module_core/SystemObject.HexSystemObject+containsPoint"></a>

#### hexSystemObject.containsPoint(x, y) ⇒ <code>boolean</code>
Point-in-polygon hit test (rotation aware).

**Kind**: instance method of [<code>HexSystemObject</code>](#module_core/SystemObject.HexSystemObject)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="module_core/SystemObject.HexSystemObject+drawBody"></a>

#### hexSystemObject.drawBody(ctx)
**Kind**: instance method of [<code>HexSystemObject</code>](#module_core/SystemObject.HexSystemObject)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_core/SystemObject..PortConfig"></a>

### core/SystemObject~PortConfig : <code>Object.&lt;string, {input: number, output: number}&gt;</code>
**Kind**: inner typedef of [<code>core/SystemObject</code>](#module_core/SystemObject)  

