# TextShape

_Source: `js/shapes/TextShape.js`_

<a name="module_shapes/TextShape"></a>

## shapes/TextShape
Free-standing (multi-line) text block.

**See**: module:core/BaseShape  

* [shapes/TextShape](#module_shapes/TextShape)
    * [.TextShape](#module_shapes/TextShape.TextShape)
        * [new exports.TextShape(x, y, [text])](#new_module_shapes/TextShape.TextShape_new)
        * [.text](#module_shapes/TextShape.TextShape+text) : <code>string</code>
        * [.textAlign](#module_shapes/TextShape.TextShape+textAlign) : <code>&quot;left&quot;</code> \| <code>&quot;center&quot;</code> \| <code>&quot;right&quot;</code>
        * [.fill](#module_shapes/TextShape.TextShape+fill)
        * [.getFont()](#module_shapes/TextShape.TextShape+getFont) ⇒ <code>string</code>
        * [.getTextLayout()](#module_shapes/TextShape.TextShape+getTextLayout) ⇒ <code>Object</code>
        * [.getLabelLayout()](#module_shapes/TextShape.TextShape+getLabelLayout)
        * [.draw(ctx)](#module_shapes/TextShape.TextShape+draw)
        * [.toJSON()](#module_shapes/TextShape.TextShape+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/TextShape.TextShape"></a>

### shapes/TextShape.TextShape
**Kind**: static class of [<code>shapes/TextShape</code>](#module_shapes/TextShape)  

* [.TextShape](#module_shapes/TextShape.TextShape)
    * [new exports.TextShape(x, y, [text])](#new_module_shapes/TextShape.TextShape_new)
    * [.text](#module_shapes/TextShape.TextShape+text) : <code>string</code>
    * [.textAlign](#module_shapes/TextShape.TextShape+textAlign) : <code>&quot;left&quot;</code> \| <code>&quot;center&quot;</code> \| <code>&quot;right&quot;</code>
    * [.fill](#module_shapes/TextShape.TextShape+fill)
    * [.getFont()](#module_shapes/TextShape.TextShape+getFont) ⇒ <code>string</code>
    * [.getTextLayout()](#module_shapes/TextShape.TextShape+getTextLayout) ⇒ <code>Object</code>
    * [.getLabelLayout()](#module_shapes/TextShape.TextShape+getLabelLayout)
    * [.draw(ctx)](#module_shapes/TextShape.TextShape+draw)
    * [.toJSON()](#module_shapes/TextShape.TextShape+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/TextShape.TextShape_new"></a>

#### new exports.TextShape(x, y, [text])

| Param | Type | Default |
| --- | --- | --- |
| x | <code>number</code> |  | 
| y | <code>number</code> |  | 
| [text] | <code>string</code> | <code>&quot;&#x27;Text&#x27;&quot;</code> | 

<a name="module_shapes/TextShape.TextShape+text"></a>

#### textShape.text : <code>string</code>
Text content; `\n` starts a new line

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+textAlign"></a>

#### textShape.textAlign : <code>&quot;left&quot;</code> \| <code>&quot;center&quot;</code> \| <code>&quot;right&quot;</code>
**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+fill"></a>

#### textShape.fill
Text colour (fill)

**Kind**: instance property of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+getFont"></a>

#### textShape.getFont() ⇒ <code>string</code>
CSS font shorthand for this text.

**Kind**: instance method of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+getTextLayout"></a>

#### textShape.getTextLayout() ⇒ <code>Object</code>
Lines and their positions (shared with the SVG exporter).

**Kind**: instance method of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+getLabelLayout"></a>

#### textShape.getLabelLayout()
Text shapes have no separate label. @returns {null}

**Kind**: instance method of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  
<a name="module_shapes/TextShape.TextShape+draw"></a>

#### textShape.draw(ctx)
**Kind**: instance method of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/TextShape.TextShape+toJSON"></a>

#### textShape.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>TextShape</code>](#module_shapes/TextShape.TextShape)  

