# Hexagon

_Source: `js/shapes/Hexagon.js`_

<a name="module_shapes/Hexagon"></a>

## shapes/Hexagon
Flat-sided hexagon (pointy top and bottom).

**See**: module:core/BaseShape  

* [shapes/Hexagon](#module_shapes/Hexagon)
    * [.Hexagon](#module_shapes/Hexagon.Hexagon)
        * [new exports.Hexagon(x, y, width, height)](#new_module_shapes/Hexagon.Hexagon_new)
        * [.getPoints()](#module_shapes/Hexagon.Hexagon+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.containsPoint(x, y)](#module_shapes/Hexagon.Hexagon+containsPoint) ⇒ <code>boolean</code>
        * [.draw(ctx)](#module_shapes/Hexagon.Hexagon+draw)

<a name="module_shapes/Hexagon.Hexagon"></a>

### shapes/Hexagon.Hexagon
**Kind**: static class of [<code>shapes/Hexagon</code>](#module_shapes/Hexagon)  

* [.Hexagon](#module_shapes/Hexagon.Hexagon)
    * [new exports.Hexagon(x, y, width, height)](#new_module_shapes/Hexagon.Hexagon_new)
    * [.getPoints()](#module_shapes/Hexagon.Hexagon+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
    * [.containsPoint(x, y)](#module_shapes/Hexagon.Hexagon+containsPoint) ⇒ <code>boolean</code>
    * [.draw(ctx)](#module_shapes/Hexagon.Hexagon+draw)

<a name="new_module_shapes/Hexagon.Hexagon_new"></a>

#### new exports.Hexagon(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/Hexagon.Hexagon+getPoints"></a>

#### hexagon.getPoints() ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
The six vertices starting at the top, clockwise.

**Kind**: instance method of [<code>Hexagon</code>](#module_shapes/Hexagon.Hexagon)  
<a name="module_shapes/Hexagon.Hexagon+containsPoint"></a>

#### hexagon.containsPoint(x, y) ⇒ <code>boolean</code>
Point-in-polygon hit test (rotation aware).

**Kind**: instance method of [<code>Hexagon</code>](#module_shapes/Hexagon.Hexagon)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="module_shapes/Hexagon.Hexagon+draw"></a>

#### hexagon.draw(ctx)
**Kind**: instance method of [<code>Hexagon</code>](#module_shapes/Hexagon.Hexagon)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 


