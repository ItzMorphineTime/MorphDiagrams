# NetworkSwitch

_Source: `js/shapes/NetworkSwitch.js`_

<a name="module_shapes/NetworkSwitch"></a>

## shapes/NetworkSwitch
Network switch system object with bidirectional network ports. Renders as a hexagon with an "N" glyph.

**See**: module:core/SystemObject  

* [shapes/NetworkSwitch](#module_shapes/NetworkSwitch)
    * [.NetworkSwitch](#module_shapes/NetworkSwitch.NetworkSwitch)
        * [new exports.NetworkSwitch(x, y, width, height)](#new_module_shapes/NetworkSwitch.NetworkSwitch_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/NetworkSwitch.NetworkSwitch+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/NetworkSwitch.NetworkSwitch.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/NetworkSwitch.NetworkSwitch"></a>

### shapes/NetworkSwitch.NetworkSwitch
**Kind**: static class of [<code>shapes/NetworkSwitch</code>](#module_shapes/NetworkSwitch)  

* [.NetworkSwitch](#module_shapes/NetworkSwitch.NetworkSwitch)
    * [new exports.NetworkSwitch(x, y, width, height)](#new_module_shapes/NetworkSwitch.NetworkSwitch_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/NetworkSwitch.NetworkSwitch+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/NetworkSwitch.NetworkSwitch.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/NetworkSwitch.NetworkSwitch_new"></a>

#### new exports.NetworkSwitch(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/NetworkSwitch.NetworkSwitch+drawIcon"></a>

#### networkSwitch.drawIcon(ctx)
Draws the "N" glyph.

**Kind**: instance method of [<code>NetworkSwitch</code>](#module_shapes/NetworkSwitch.NetworkSwitch)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/NetworkSwitch.NetworkSwitch.defaultPorts"></a>

#### NetworkSwitch.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>NetworkSwitch</code>](#module_shapes/NetworkSwitch.NetworkSwitch)  

