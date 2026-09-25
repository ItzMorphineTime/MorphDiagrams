# Parallelogram

_Source: `js/shapes/Parallelogram.js`_

<a name="module_shapes/Parallelogram"></a>

## shapes/Parallelogram
Skewed rectangle, typically used for input/output steps.

**See**: module:core/BaseShape  

* [shapes/Parallelogram](#module_shapes/Parallelogram)
    * [.Parallelogram](#module_shapes/Parallelogram.Parallelogram)
        * [new exports.Parallelogram(x, y, width, height)](#new_module_shapes/Parallelogram.Parallelogram_new)
        * [.skew](#module_shapes/Parallelogram.Parallelogram+skew) : <code>number</code>
        * [.getPoints()](#module_shapes/Parallelogram.Parallelogram+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.containsPoint(x, y)](#module_shapes/Parallelogram.Parallelogram+containsPoint) ⇒ <code>boolean</code>
        * [.draw(ctx)](#module_shapes/Parallelogram.Parallelogram+draw)
        * [.toJSON()](#module_shapes/Parallelogram.Parallelogram+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/Parallelogram.Parallelogram"></a>

### shapes/Parallelogram.Parallelogram
**Kind**: static class of [<code>shapes/Parallelogram</code>](#module_shapes/Parallelogram)  

* [.Parallelogram](#module_shapes/Parallelogram.Parallelogram)
    * [new exports.Parallelogram(x, y, width, height)](#new_module_shapes/Parallelogram.Parallelogram_new)
    * [.skew](#module_shapes/Parallelogram.Parallelogram+skew) : <code>number</code>
    * [.getPoints()](#module_shapes/Parallelogram.Parallelogram+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
    * [.containsPoint(x, y)](#module_shapes/Parallelogram.Parallelogram+containsPoint) ⇒ <code>boolean</code>
    * [.draw(ctx)](#module_shapes/Parallelogram.Parallelogram+draw)
    * [.toJSON()](#module_shapes/Parallelogram.Parallelogram+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/Parallelogram.Parallelogram_new"></a>

#### new exports.Parallelogram(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/Parallelogram.Parallelogram+skew"></a>

#### parallelogram.skew : <code>number</code>
Skew factor 0..1 (fraction of the width)

**Kind**: instance property of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  
<a name="module_shapes/Parallelogram.Parallelogram+getPoints"></a>

#### parallelogram.getPoints() ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
The four vertices, clockwise from the top-left.

**Kind**: instance method of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  
<a name="module_shapes/Parallelogram.Parallelogram+containsPoint"></a>

#### parallelogram.containsPoint(x, y) ⇒ <code>boolean</code>
Point-in-polygon hit test (rotation aware).

**Kind**: instance method of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="module_shapes/Parallelogram.Parallelogram+draw"></a>

#### parallelogram.draw(ctx)
**Kind**: instance method of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/Parallelogram.Parallelogram+toJSON"></a>

#### parallelogram.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>Parallelogram</code>](#module_shapes/Parallelogram.Parallelogram)  

