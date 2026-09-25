# SyncGenerator

_Source: `js/shapes/SyncGenerator.js`_

<a name="module_shapes/SyncGenerator"></a>

## shapes/SyncGenerator
Sync / reference generator system object distributing SDI timing. Renders as a hexagon with a clock glyph.

**See**: module:core/SystemObject  

* [shapes/SyncGenerator](#module_shapes/SyncGenerator)
    * [.SyncGenerator](#module_shapes/SyncGenerator.SyncGenerator)
        * [new exports.SyncGenerator(x, y, width, height)](#new_module_shapes/SyncGenerator.SyncGenerator_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/SyncGenerator.SyncGenerator+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/SyncGenerator.SyncGenerator.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/SyncGenerator.SyncGenerator"></a>

### shapes/SyncGenerator.SyncGenerator
**Kind**: static class of [<code>shapes/SyncGenerator</code>](#module_shapes/SyncGenerator)  

* [.SyncGenerator](#module_shapes/SyncGenerator.SyncGenerator)
    * [new exports.SyncGenerator(x, y, width, height)](#new_module_shapes/SyncGenerator.SyncGenerator_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/SyncGenerator.SyncGenerator+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/SyncGenerator.SyncGenerator.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/SyncGenerator.SyncGenerator_new"></a>

#### new exports.SyncGenerator(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/SyncGenerator.SyncGenerator+drawIcon"></a>

#### syncGenerator.drawIcon(ctx)
Draws the clock glyph.

**Kind**: instance method of [<code>SyncGenerator</code>](#module_shapes/SyncGenerator.SyncGenerator)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/SyncGenerator.SyncGenerator.defaultPorts"></a>

#### SyncGenerator.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>SyncGenerator</code>](#module_shapes/SyncGenerator.SyncGenerator)  

