# PowerSupply

_Source: `js/shapes/PowerSupply.js`_

<a name="module_shapes/PowerSupply"></a>

## shapes/PowerSupply
Power supply / power distribution unit: one mains input feeding several power outputs,
with an optional management network port. Renders as a box with a lightning bolt.

**See**: module:core/SystemObject  

* [shapes/PowerSupply](#module_shapes/PowerSupply)
    * [.PowerSupply](#module_shapes/PowerSupply.PowerSupply)
        * [new exports.PowerSupply(x, y, width, height)](#new_module_shapes/PowerSupply.PowerSupply_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/PowerSupply.PowerSupply+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/PowerSupply.PowerSupply.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/PowerSupply.PowerSupply"></a>

### shapes/PowerSupply.PowerSupply
**Kind**: static class of [<code>shapes/PowerSupply</code>](#module_shapes/PowerSupply)  

* [.PowerSupply](#module_shapes/PowerSupply.PowerSupply)
    * [new exports.PowerSupply(x, y, width, height)](#new_module_shapes/PowerSupply.PowerSupply_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/PowerSupply.PowerSupply+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/PowerSupply.PowerSupply.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/PowerSupply.PowerSupply_new"></a>

#### new exports.PowerSupply(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/PowerSupply.PowerSupply+drawIcon"></a>

#### powerSupply.drawIcon(ctx)
Draws the lightning bolt.

**Kind**: instance method of [<code>PowerSupply</code>](#module_shapes/PowerSupply.PowerSupply)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/PowerSupply.PowerSupply.defaultPorts"></a>

#### PowerSupply.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>PowerSupply</code>](#module_shapes/PowerSupply.PowerSupply)  

