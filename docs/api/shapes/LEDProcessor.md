# LEDProcessor

_Source: `js/shapes/LEDProcessor.js`_

<a name="module_shapes/LEDProcessor"></a>

## shapes/LEDProcessor
LED wall processor system object (video + SDI inputs, video outputs). Renders as a rectangle
with three LED dots.

**See**: module:core/SystemObject  

* [shapes/LEDProcessor](#module_shapes/LEDProcessor)
    * [.LEDProcessor](#module_shapes/LEDProcessor.LEDProcessor)
        * [new exports.LEDProcessor(x, y, width, height)](#new_module_shapes/LEDProcessor.LEDProcessor_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/LEDProcessor.LEDProcessor+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/LEDProcessor.LEDProcessor.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/LEDProcessor.LEDProcessor"></a>

### shapes/LEDProcessor.LEDProcessor
**Kind**: static class of [<code>shapes/LEDProcessor</code>](#module_shapes/LEDProcessor)  

* [.LEDProcessor](#module_shapes/LEDProcessor.LEDProcessor)
    * [new exports.LEDProcessor(x, y, width, height)](#new_module_shapes/LEDProcessor.LEDProcessor_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/LEDProcessor.LEDProcessor+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/LEDProcessor.LEDProcessor.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/LEDProcessor.LEDProcessor_new"></a>

#### new exports.LEDProcessor(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/LEDProcessor.LEDProcessor+drawIcon"></a>

#### ledProcessor.drawIcon(ctx)
Draws the LED dots.

**Kind**: instance method of [<code>LEDProcessor</code>](#module_shapes/LEDProcessor.LEDProcessor)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/LEDProcessor.LEDProcessor.defaultPorts"></a>

#### LEDProcessor.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>LEDProcessor</code>](#module_shapes/LEDProcessor.LEDProcessor)  

