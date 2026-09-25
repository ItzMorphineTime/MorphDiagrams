# LEDDistro

_Source: `js/shapes/LEDDistro.js`_

<a name="module_shapes/LEDDistro"></a>

## shapes/LEDDistro
LED distribution box ("XD"): takes data from an LED processor (video / fibre) and power,
and fans both out to LED panels. Renders as a box with an "XD" glyph and a row of outlets.

**See**: module:core/SystemObject  

* [shapes/LEDDistro](#module_shapes/LEDDistro)
    * [.LEDDistro](#module_shapes/LEDDistro.LEDDistro)
        * [new exports.LEDDistro(x, y, width, height)](#new_module_shapes/LEDDistro.LEDDistro_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/LEDDistro.LEDDistro+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/LEDDistro.LEDDistro.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/LEDDistro.LEDDistro"></a>

### shapes/LEDDistro.LEDDistro
**Kind**: static class of [<code>shapes/LEDDistro</code>](#module_shapes/LEDDistro)  

* [.LEDDistro](#module_shapes/LEDDistro.LEDDistro)
    * [new exports.LEDDistro(x, y, width, height)](#new_module_shapes/LEDDistro.LEDDistro_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/LEDDistro.LEDDistro+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/LEDDistro.LEDDistro.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/LEDDistro.LEDDistro_new"></a>

#### new exports.LEDDistro(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/LEDDistro.LEDDistro+drawIcon"></a>

#### ledDistro.drawIcon(ctx)
Draws the "XD" glyph and outlet row.

**Kind**: instance method of [<code>LEDDistro</code>](#module_shapes/LEDDistro.LEDDistro)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/LEDDistro.LEDDistro.defaultPorts"></a>

#### LEDDistro.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>LEDDistro</code>](#module_shapes/LEDDistro.LEDDistro)  

