# Cylinder

_Source: `js/shapes/Cylinder.js`_

<a name="module_shapes/Cylinder"></a>

## shapes/Cylinder
Capsule ("pill") shape with semicircular ends, used for databases / storage.

**See**: module:core/BaseShape  

* [shapes/Cylinder](#module_shapes/Cylinder)
    * [.Cylinder](#module_shapes/Cylinder.Cylinder)
        * [new exports.Cylinder(x, y, width, height)](#new_module_shapes/Cylinder.Cylinder_new)
        * [.topHeight](#module_shapes/Cylinder.Cylinder+topHeight) : <code>number</code>
        * [.tracePath(ctx, [b])](#module_shapes/Cylinder.Cylinder+tracePath)
        * [.draw(ctx)](#module_shapes/Cylinder.Cylinder+draw)
        * [.toJSON()](#module_shapes/Cylinder.Cylinder+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/Cylinder.Cylinder"></a>

### shapes/Cylinder.Cylinder
**Kind**: static class of [<code>shapes/Cylinder</code>](#module_shapes/Cylinder)  

* [.Cylinder](#module_shapes/Cylinder.Cylinder)
    * [new exports.Cylinder(x, y, width, height)](#new_module_shapes/Cylinder.Cylinder_new)
    * [.topHeight](#module_shapes/Cylinder.Cylinder+topHeight) : <code>number</code>
    * [.tracePath(ctx, [b])](#module_shapes/Cylinder.Cylinder+tracePath)
    * [.draw(ctx)](#module_shapes/Cylinder.Cylinder+draw)
    * [.toJSON()](#module_shapes/Cylinder.Cylinder+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/Cylinder.Cylinder_new"></a>

#### new exports.Cylinder(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/Cylinder.Cylinder+topHeight"></a>

#### cylinder.topHeight : <code>number</code>
Kept for file compatibility (unused by the capsule renderer)

**Kind**: instance property of [<code>Cylinder</code>](#module_shapes/Cylinder.Cylinder)  
<a name="module_shapes/Cylinder.Cylinder+tracePath"></a>

#### cylinder.tracePath(ctx, [b])
Traces the capsule outline on the context (no fill/stroke).

**Kind**: instance method of [<code>Cylinder</code>](#module_shapes/Cylinder.Cylinder)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 
| [b] | <code>Object</code> | 

<a name="module_shapes/Cylinder.Cylinder+draw"></a>

#### cylinder.draw(ctx)
**Kind**: instance method of [<code>Cylinder</code>](#module_shapes/Cylinder.Cylinder)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/Cylinder.Cylinder+toJSON"></a>

#### cylinder.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>Cylinder</code>](#module_shapes/Cylinder.Cylinder)  

