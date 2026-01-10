# ConnectorAnchor

_Source: `js/shapes/ConnectorAnchor.js`_

<a name="ConnectorAnchor"></a>

## ConnectorAnchor ⇐ <code>BaseShape</code>
**Kind**: global class  
**Extends**: <code>BaseShape</code>  

* [ConnectorAnchor](#ConnectorAnchor) ⇐ <code>BaseShape</code>
    * [new ConnectorAnchor()](#new_ConnectorAnchor_new)
    * [.ConnectorAnchor](#ConnectorAnchor+ConnectorAnchor)
        * [new exports.ConnectorAnchor(x, y)](#new_ConnectorAnchor+ConnectorAnchor_new)
    * [.type](#ConnectorAnchor+type) : <code>string</code>
    * [.fill](#ConnectorAnchor+fill) : <code>string</code>
    * [.stroke](#ConnectorAnchor+stroke) : <code>string</code>
    * [.strokeWidth](#ConnectorAnchor+strokeWidth) : <code>number</code>
    * [.resizable](#ConnectorAnchor+resizable) : <code>boolean</code>
    * [.connectionType](#ConnectorAnchor+connectionType) : <code>string</code> \| <code>null</code>
    * [.portType](#ConnectorAnchor+portType) : <code>string</code>
    * [.label](#ConnectorAnchor+label) : <code>string</code>
    * [.getAnchorPoints()](#ConnectorAnchor+getAnchorPoints) ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: null, portType: string}&gt;</code>
    * [.draw(ctx)](#ConnectorAnchor+draw)
    * [.toJSON()](#ConnectorAnchor+toJSON) ⇒ <code>Object</code>

<a name="new_ConnectorAnchor_new"></a>

### new ConnectorAnchor()
ConnectorAnchor shape representing a universal connection point.
Acts as a waypoint or junction for connectors, allowing any connection type.
Renders as a small circle with an inner dot.

<a name="ConnectorAnchor+ConnectorAnchor"></a>

### connectorAnchor.ConnectorAnchor
**Kind**: instance class of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="new_ConnectorAnchor+ConnectorAnchor_new"></a>

#### new exports.ConnectorAnchor(x, y)
Creates a new ConnectorAnchor instance.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of top-left corner |
| y | <code>number</code> | Y-coordinate of top-left corner |

<a name="ConnectorAnchor+type"></a>

### connectorAnchor.type : <code>string</code>
Shape type identifier

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+fill"></a>

### connectorAnchor.fill : <code>string</code>
Fill color (white)

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+stroke"></a>

### connectorAnchor.stroke : <code>string</code>
Stroke color

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+strokeWidth"></a>

### connectorAnchor.strokeWidth : <code>number</code>
Stroke width

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+resizable"></a>

### connectorAnchor.resizable : <code>boolean</code>
Shape cannot be resized

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+connectionType"></a>

### connectorAnchor.connectionType : <code>string</code> \| <code>null</code>
Connection type - null allows any connection type

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+portType"></a>

### connectorAnchor.portType : <code>string</code>
Port type - 'both' allows input and output connections

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+label"></a>

### connectorAnchor.label : <code>string</code>
Display label

**Kind**: instance property of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+getAnchorPoints"></a>

### connectorAnchor.getAnchorPoints() ⇒ <code>Object.&lt;string, {x: number, y: number, connectionType: null, portType: string}&gt;</code>
Gets the anchor point at the center of the shape.
Returns a single universal anchor that accepts any connection type.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
<a name="ConnectorAnchor+draw"></a>

### connectorAnchor.draw(ctx)
Draws the connector anchor as a circle with an inner dot.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context |

<a name="ConnectorAnchor+toJSON"></a>

### connectorAnchor.toJSON() ⇒ <code>Object</code>
Serializes the connector anchor to JSON, including connection properties.

**Kind**: instance method of [<code>ConnectorAnchor</code>](#ConnectorAnchor)  
**Returns**: <code>Object</code> - JSON representation with connectionType, portType, and label  

