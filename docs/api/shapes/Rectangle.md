# Rectangle

_Source: `js/shapes/Rectangle.js`_

<a name="module_shapes/Rectangle"></a>

## shapes/Rectangle
Rectangle with optional rounded corners.

**See**: module:core/BaseShape  

* [shapes/Rectangle](#module_shapes/Rectangle)
    * [.Rectangle](#module_shapes/Rectangle.Rectangle)
        * [new exports.Rectangle(x, y, width, height)](#new_module_shapes/Rectangle.Rectangle_new)
        * [.cornerRadius](#module_shapes/Rectangle.Rectangle+cornerRadius) : <code>number</code>
        * [.draw(ctx)](#module_shapes/Rectangle.Rectangle+draw)
        * [.drawRoundedRect(ctx, [b])](#module_shapes/Rectangle.Rectangle+drawRoundedRect)
        * [.toJSON()](#module_shapes/Rectangle.Rectangle+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/Rectangle.Rectangle"></a>

### shapes/Rectangle.Rectangle
**Kind**: static class of [<code>shapes/Rectangle</code>](#module_shapes/Rectangle)  

* [.Rectangle](#module_shapes/Rectangle.Rectangle)
    * [new exports.Rectangle(x, y, width, height)](#new_module_shapes/Rectangle.Rectangle_new)
    * [.cornerRadius](#module_shapes/Rectangle.Rectangle+cornerRadius) : <code>number</code>
    * [.draw(ctx)](#module_shapes/Rectangle.Rectangle+draw)
    * [.drawRoundedRect(ctx, [b])](#module_shapes/Rectangle.Rectangle+drawRoundedRect)
    * [.toJSON()](#module_shapes/Rectangle.Rectangle+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/Rectangle.Rectangle_new"></a>

#### new exports.Rectangle(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/Rectangle.Rectangle+cornerRadius"></a>

#### rectangle.cornerRadius : <code>number</code>
Corner radius in pixels (0 = square corners)

**Kind**: instance property of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  
<a name="module_shapes/Rectangle.Rectangle+draw"></a>

#### rectangle.draw(ctx)
**Kind**: instance method of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/Rectangle.Rectangle+drawRoundedRect"></a>

#### rectangle.drawRoundedRect(ctx, [b])
**Kind**: instance method of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 
| [b] | <code>Object</code> | 

<a name="module_shapes/Rectangle.Rectangle+toJSON"></a>

#### rectangle.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>Rectangle</code>](#module_shapes/Rectangle.Rectangle)  

