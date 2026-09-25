# Diamond

_Source: `js/shapes/Diamond.js`_

<a name="module_shapes/Diamond"></a>

## shapes/Diamond
Diamond (rhombus) shape, typically used for decisions.

**See**: module:core/BaseShape  

* [shapes/Diamond](#module_shapes/Diamond)
    * [.Diamond](#module_shapes/Diamond.Diamond)
        * [new exports.Diamond(x, y, width, height)](#new_module_shapes/Diamond.Diamond_new)
        * [.getPoints()](#module_shapes/Diamond.Diamond+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
        * [.containsPoint(x, y)](#module_shapes/Diamond.Diamond+containsPoint) ⇒ <code>boolean</code>
        * [.draw(ctx)](#module_shapes/Diamond.Diamond+draw)

<a name="module_shapes/Diamond.Diamond"></a>

### shapes/Diamond.Diamond
**Kind**: static class of [<code>shapes/Diamond</code>](#module_shapes/Diamond)  

* [.Diamond](#module_shapes/Diamond.Diamond)
    * [new exports.Diamond(x, y, width, height)](#new_module_shapes/Diamond.Diamond_new)
    * [.getPoints()](#module_shapes/Diamond.Diamond+getPoints) ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
    * [.containsPoint(x, y)](#module_shapes/Diamond.Diamond+containsPoint) ⇒ <code>boolean</code>
    * [.draw(ctx)](#module_shapes/Diamond.Diamond+draw)

<a name="new_module_shapes/Diamond.Diamond_new"></a>

#### new exports.Diamond(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/Diamond.Diamond+getPoints"></a>

#### diamond.getPoints() ⇒ <code>Array.&lt;{x:number, y:number}&gt;</code>
The four vertices (top, right, bottom, left).

**Kind**: instance method of [<code>Diamond</code>](#module_shapes/Diamond.Diamond)  
<a name="module_shapes/Diamond.Diamond+containsPoint"></a>

#### diamond.containsPoint(x, y) ⇒ <code>boolean</code>
Diamond hit test (rotation aware).

**Kind**: instance method of [<code>Diamond</code>](#module_shapes/Diamond.Diamond)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="module_shapes/Diamond.Diamond+draw"></a>

#### diamond.draw(ctx)
**Kind**: instance method of [<code>Diamond</code>](#module_shapes/Diamond.Diamond)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 


