# ConnectorAnchor

_Source: `js/shapes/ConnectorAnchor.js`_

<a name="module_shapes/ConnectorAnchor"></a>

## shapes/ConnectorAnchor
ConnectorAnchor shape representing a universal connection point. Acts as a waypoint or junction for connectors, allowing any connection type.

**Remarks**: - Renders as a small circle with an inner dot.- Accepts all connection types (video, sdi, network, usb) or can be configured for specific types.- Port type is 'both', allowing both input and output connections.- Fixed size (16x16 pixels) and cannot be resized.  
**See**

- module:core/BaseShape
- module:config/ConnectionTypes

**Example**  
```js
const anchor = new ConnectorAnchor(100, 200);anchor.label = 'Junction Point';anchor.draw(ctx);
```

* [shapes/ConnectorAnchor](#module_shapes/ConnectorAnchor)
    * [.ConnectorAnchor](#module_shapes/ConnectorAnchor.ConnectorAnchor) ⇐ <code>BaseShape</code>
        * [new exports.ConnectorAnchor(x, y)](#new_module_shapes/ConnectorAnchor.ConnectorAnchor_new)
        * [.type](#module_shapes/ConnectorAnchor.ConnectorAnchor+type) : <code>string</code>
        * [.fill](#module_shapes/ConnectorAnchor.ConnectorAnchor+fill) : <code>string</code>
        * [.stroke](#module_shapes/ConnectorAnchor.ConnectorAnchor+stroke) : <code>string</code>
        * [.strokeWidth](#module_shapes/ConnectorAnchor.ConnectorAnchor+strokeWidth) : <code>number</code>
        * [.resizable](#module_shapes/ConnectorAnchor.ConnectorAnchor+resizable) : <code>boolean</code>
        * [.connectionType](#module_shapes/ConnectorAnchor.ConnectorAnchor+connectionType) : <code>string</code> \| <code>null</code>
        * [.portType](#module_shapes/ConnectorAnchor.ConnectorAnchor+portType) : <code>string</code>
        * [.label](#module_shapes/ConnectorAnchor.ConnectorAnchor+label) : <code>string</code>
        * [.getAnchorPoints()](#module_shapes/ConnectorAnchor.ConnectorAnchor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: null, portType: string}&gt;</code>
        * [.draw(ctx)](#module_shapes/ConnectorAnchor.ConnectorAnchor+draw)
        * [.toJSON()](#module_shapes/ConnectorAnchor.ConnectorAnchor+toJSON) ⇒ <code>Object</code>

<a name="module_shapes/ConnectorAnchor.ConnectorAnchor"></a>

### shapes/ConnectorAnchor.ConnectorAnchor ⇐ <code>BaseShape</code>
Represents a universal connection point anchor.

**Kind**: static class of [<code>shapes/ConnectorAnchor</code>](#module_shapes/ConnectorAnchor)  
**Extends**: <code>BaseShape</code>  

* [.ConnectorAnchor](#module_shapes/ConnectorAnchor.ConnectorAnchor) ⇐ <code>BaseShape</code>
    * [new exports.ConnectorAnchor(x, y)](#new_module_shapes/ConnectorAnchor.ConnectorAnchor_new)
    * [.type](#module_shapes/ConnectorAnchor.ConnectorAnchor+type) : <code>string</code>
    * [.fill](#module_shapes/ConnectorAnchor.ConnectorAnchor+fill) : <code>string</code>
    * [.stroke](#module_shapes/ConnectorAnchor.ConnectorAnchor+stroke) : <code>string</code>
    * [.strokeWidth](#module_shapes/ConnectorAnchor.ConnectorAnchor+strokeWidth) : <code>number</code>
    * [.resizable](#module_shapes/ConnectorAnchor.ConnectorAnchor+resizable) : <code>boolean</code>
    * [.connectionType](#module_shapes/ConnectorAnchor.ConnectorAnchor+connectionType) : <code>string</code> \| <code>null</code>
    * [.portType](#module_shapes/ConnectorAnchor.ConnectorAnchor+portType) : <code>string</code>
    * [.label](#module_shapes/ConnectorAnchor.ConnectorAnchor+label) : <code>string</code>
    * [.getAnchorPoints()](#module_shapes/ConnectorAnchor.ConnectorAnchor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: null, portType: string}&gt;</code>
    * [.draw(ctx)](#module_shapes/ConnectorAnchor.ConnectorAnchor+draw)
    * [.toJSON()](#module_shapes/ConnectorAnchor.ConnectorAnchor+toJSON) ⇒ <code>Object</code>

<a name="new_module_shapes/ConnectorAnchor.ConnectorAnchor_new"></a>

#### new exports.ConnectorAnchor(x, y)
Creates a new ConnectorAnchor instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner. |
| y | <code>number</code> | Y-coordinate of top-left corner. |

**Example**  
```js
const anchor = new ConnectorAnchor(100, 200);
```
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+type"></a>

#### connectorAnchor.type : <code>string</code>
Shape type identifier

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+fill"></a>

#### connectorAnchor.fill : <code>string</code>
Fill color (white)

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+stroke"></a>

#### connectorAnchor.stroke : <code>string</code>
Stroke color

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+strokeWidth"></a>

#### connectorAnchor.strokeWidth : <code>number</code>
Stroke width

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+resizable"></a>

#### connectorAnchor.resizable : <code>boolean</code>
Shape cannot be resized

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+connectionType"></a>

#### connectorAnchor.connectionType : <code>string</code> \| <code>null</code>
Connection type - null allows any connection type

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+portType"></a>

#### connectorAnchor.portType : <code>string</code>
Port type - 'both' allows input and output connections

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+label"></a>

#### connectorAnchor.label : <code>string</code>
Display label

**Kind**: instance property of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+getAnchorPoints"></a>

#### connectorAnchor.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: null, portType: string}&gt;</code>
Gets the anchor point at the center of the shape.Returns a single universal anchor that accepts any connection type.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+draw"></a>

#### connectorAnchor.draw(ctx)
Draws the connector anchor as a circle with an inner dot.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="module_shapes/ConnectorAnchor.ConnectorAnchor+toJSON"></a>

#### connectorAnchor.toJSON() ⇒ <code>Object</code>
Serializes the connector anchor to JSON, including connection properties.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#module_shapes/ConnectorAnchor.ConnectorAnchor)  
**Returns**: <code>Object</code> - JSON representation with connectionType, portType, and label  

