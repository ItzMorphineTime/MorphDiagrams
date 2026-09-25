# ConnectorAnchor

_Source: `js/shapes/ConnectorAnchor.js`_

<a name="module_shapes/ConnectorAnchor"></a>

## shapes/ConnectorAnchor
Universal connection point / junction. Exposes a single `anchor_point` anchor that accepts
any connection type in any direction, so it can be used as a waypoint hub, a patch point or a
"to be defined" endpoint. A connection type may optionally be pinned on it.

**See**: module:core/Connector  

* [shapes/ConnectorAnchor](#module_shapes/ConnectorAnchor)
    * [.ConnectorAnchor](#module_shapes/ConnectorAnchor.ConnectorAnchor)
        * [new exports.ConnectorAnchor(x, y)](#new_module_shapes/ConnectorAnchor.ConnectorAnchor_new)
        * [.resizable](#module_shapes/ConnectorAnchor.ConnectorAnchor+resizable) : <code>boolean</code>
        * [.connectionType](#module_shapes/ConnectorAnchor.ConnectorAnchor+connectionType) : <code>string</code> \| <code>null</code>
        * [.portType](#module_shapes/ConnectorAnchor.ConnectorAnchor+portType) : <code>string</code>
        * [.getAnchorPoints()](#module_shapes/ConnectorAnchor.ConnectorAnchor+getAnchorPoints) ⇒ <code>Object.&lt;string, AnchorPoint&gt;</code>
        * [.getLabelLayout([measure])](#module_shapes/ConnectorAnchor.ConnectorAnchor+getLabelLayout) ⇒ <code>Object</code> \| <code>null</code>
        * [.draw(ctx)](#module_shapes/ConnectorAnchor.ConnectorAnchor+draw)
        * [.toJSON()](#module_shapes/ConnectorAnchor.ConnectorAnchor+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/ConnectorAnchor.ConnectorAnchor"></a>

### shapes/ConnectorAnchor.ConnectorAnchor
**Kind**: static class of [<code>shapes/ConnectorAnchor</code>](#module_shapes/ConnectorAnchor)  

* [.ConnectorAnchor](#module_shapes/ConnectorAnchor.ConnectorAnchor)
    * [new exports.ConnectorAnchor(x, y)](#new_module_shapes/ConnectorAnchor.ConnectorAnchor_new)
    * [.resizable](#module_shapes/ConnectorAnchor.ConnectorAnchor+resizable) : <code>boolean</code>
    * [.connectionType](#module_shapes/ConnectorAnchor.ConnectorAnchor+connectionType) : <code>string</code> \| <code>null</code>
    * [.portType](#module_shapes/ConnectorAnchor.ConnectorAnchor+portType) : <code>string</code>
    * [.getAnchorPoints()](#module_shapes/ConnectorAnchor.ConnectorAnchor+getAnchorPoints) ⇒ <code>Object.&lt;string, AnchorPoint&gt;</code>
    * [.getLabelLayout([measure])](#module_shapes/ConnectorAnchor.ConnectorAnchor+getLabelLayout) ⇒ <code>Object</code> \| <code>null</code>
    * [.draw(ctx)](#module_shapes/ConnectorAnchor.ConnectorAnchor+draw)
    * [.toJSON()](#module_shapes/ConnectorAnchor.ConnectorAnchor+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/ConnectorAnchor.ConnectorAnchor_new"></a>

#### new exports.ConnectorAnchor(x, y)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+resizable"></a>

#### connectorAnchor.resizable : <code>boolean</code>
Anchors have a fixed size

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+connectionType"></a>

#### connectorAnchor.connectionType : <code>string</code> \| <code>null</code>
Pinned connection type, or null to accept anything

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+portType"></a>

#### connectorAnchor.portType : <code>string</code>
Anchors accept inputs and outputs

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+getAnchorPoints"></a>

#### connectorAnchor.getAnchorPoints() ⇒ <code>Object.&lt;string, AnchorPoint&gt;</code>
Single wildcard anchor at the centre.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+getLabelLayout"></a>

#### connectorAnchor.getLabelLayout([measure]) ⇒ <code>Object</code> \| <code>null</code>
The legacy default label "Anchor" is treated as "no label" so older files do not sprout captions.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  

| Param | Type |
| --- | --- |
| [measure] | <code>function</code> | 

<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+draw"></a>

#### connectorAnchor.draw(ctx)
Draws the anchor as a ring with a centre dot (tinted by the pinned connection type).

**Kind**: instance method of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+toJSON"></a>

#### connectorAnchor.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  

