# TextShape

_Source: `js/shapes/TextShape.js`_

<a name="module_shapes/TextShape"></a>

## shapes/TextShape
Text diagram shape for rendering labels and annotations. Extends BaseShape to provide text rendering capabilities.

**Remarks**: - Supports multi-line text via newline characters.- Text alignment (left, center, right) and baseline positioning are configurable.- Font family, size, weight, and style are customizable.  
**See**: module:core/BaseShape  
**Example**  
```js
const text = new TextShape(10, 20, 'Hello World');text.fontSize = 20;text.textAlign = 'center';text.draw(ctx);
```

* [shapes/TextShape](#module_shapes/TextShape)
    * [.TextShape](#module_shapes/TextShape.TextShape) ⇐ <code>BaseShape</code>
        * [new exports.TextShape(x, y, [text])](#new_module_shapes/TextShape.TextShape_new)
        * [.text](#module_shapes/TextShape.TextShape+text) : <code>string</code>
        * [.fontSize](#module_shapes/TextShape.TextShape+fontSize) : <code>number</code>
        * [.fontFamily](#module_shapes/TextShape.TextShape+fontFamily) : <code>string</code>
        * [.fontWeight](#module_shapes/TextShape.TextShape+fontWeight) : <code>string</code>
        * [.fontStyle](#module_shapes/TextShape.TextShape+fontStyle) : <code>string</code>
        * [.textAlign](#module_shapes/TextShape.TextShape+textAlign) : <code>string</code>
        * [.textBaseline](#module_shapes/TextShape.TextShape+textBaseline) : <code>string</code>
        * [.fill](#module_shapes/TextShape.TextShape+fill) : <code>string</code>
        * [.stroke](#module_shapes/TextShape.TextShape+stroke) : <code>string</code>
        * [.draw(ctx)](#module_shapes/TextShape.TextShape+draw)

<a name="module_shapes/TextShape.TextShape"></a>

### shapes/TextShape.TextShape ⇐ <code>BaseShape</code>
Represents a text diagram shape.

**Kind**: static class of [<code>shapes/TextShape</code>](#module_shapes/TextShape)  
**Extends**: <code>BaseShape</code>  

* [.TextShape](#module_shapes/TextShape.TextShape) ⇐ <code>BaseShape</code>
    * [new exports.TextShape(x, y, [text])](#new_module_shapes/TextShape.TextShape_new)
    * [.text](#module_shapes/TextShape.TextShape+text) : <code>string</code>
    * [.fontSize](#module_shapes/TextShape.TextShape+fontSize) : <code>number</code>
    * [.fontFamily](#module_shapes/TextShape.TextShape+fontFamily) : <code>string</code>
    * [.fontWeight](#module_shapes/TextShape.TextShape+fontWeight) : <code>string</code>
    * [.fontStyle](#module_shapes/TextShape.TextShape+fontStyle) : <code>string</code>
    * [.textAlign](#module_shapes/TextShape.TextShape+textAlign) : <code>string</code>
    * [.textBaseline](#module_shapes/TextShape.TextShape+textBaseline) : <code>string</code>
    * [.fill](#module_shapes/TextShape.TextShape+fill) : <code>string</code>
    * [.stroke](#module_shapes/TextShape.TextShape+stroke) : <code>string</code>
    * [.draw(ctx)](#module_shapes/TextShape.TextShape+draw)

<a name="new_module_shapes/TextShape.TextShape_new"></a>

#### new exports.TextShape(x, y, [text])
Creates a new TextShape instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> |  | X-coordinate of top-left corner. |
| y | <code>number</code> |  | Y-coordinate of top-left corner. |
| [text] | <code>string</code> | <code>&quot;&#x27;Text&#x27;&quot;</code> | Text content to display. |

**Example**  
```js
const text = new TextShape(10, 20, 'Label');
```
<a name="module_shapes/TextShape.TextShape+text"></a>

#### textShape.text : <code>string</code>
Text content to display. Supports multi-line via newlines.

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+fontSize"></a>

#### textShape.fontSize : <code>number</code>
Font size in pixels.

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+fontFamily"></a>

#### textShape.fontFamily : <code>string</code>
Font family name.

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+fontWeight"></a>

#### textShape.fontWeight : <code>string</code>
Font weight: 'normal' or 'bold'.

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+fontStyle"></a>

#### textShape.fontStyle : <code>string</code>
Font style: 'normal' or 'italic'.

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+textAlign"></a>

#### textShape.textAlign : <code>string</code>
Text alignment: 'left', 'center', or 'right'.

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+textBaseline"></a>

#### textShape.textBaseline : <code>string</code>
Text baseline: 'top', 'middle', or 'bottom'.

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+fill"></a>

#### textShape.fill : <code>string</code>
Text color in hex format.

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+stroke"></a>

#### textShape.stroke : <code>string</code>
Stroke color (usually transparent for text).

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+draw"></a>

#### textShape.draw(ctx)
Draws the text shape on the canvas.Supports multi-line text by splitting on newline characters. Centers all lines vertically within the shape bounds.

**Kind**: instance method of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |


