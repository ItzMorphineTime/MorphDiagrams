# Serialization

_Source: `js/core/Serialization.js`_

<a name="module_core/Serialization"></a>

## core/Serialization
Converts between live shape/connector instances and the JSON diagram file format,
independent of the DOM so the editor, the tests and the MCP server all share one implementation.

File format (version 2.1):

```json
{
  "version": "2.1",
  "objects": [ { "id": "...", "type": "server", ... }, { "id": "...", "type": "connector", ... } ],
  "connectionTypes": { "hdmi": { "label": "HDMI", "color": "#ff00aa", "bidirectional": false } },
  "metadata": { "name": "Stage A", "created": "...", "modified": "...", "zoom": 1, "panX": 0, "panY": 0, "nextGroupId": 1 }
}
```

Older files (versions 1.0 and 2.0) load unchanged.

**See**

- module:core/ShapeRegistry
- module:core/Diagram


* [core/Serialization](#module_core/Serialization)
    * [.FORMAT_VERSION](#module_core/Serialization.FORMAT_VERSION)
    * [.serializeObjects(objects)](#module_core/Serialization.serializeObjects) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.deserializeObjects(data, [options])](#module_core/Serialization.deserializeObjects) ⇒ <code>Array</code>
    * [.createDocument(parts)](#module_core/Serialization.createDocument) ⇒ <code>Object</code>
    * [.validateDocument(doc)](#module_core/Serialization.validateDocument) ⇒ <code>Object</code>
    * [.parseDocument(doc)](#module_core/Serialization.parseDocument) ⇒ <code>Object</code>

<a name="module_core/Serialization.FORMAT_VERSION"></a>

### core/Serialization.FORMAT\_VERSION
Current file format version.

**Kind**: static constant of [<code>core/Serialization</code>](#module_core/Serialization)  
<a name="module_core/Serialization.serializeObjects"></a>

### core/Serialization.serializeObjects(objects) ⇒ <code>Array.&lt;Object&gt;</code>
Serialises objects (shapes and connectors) to plain JSON.

**Kind**: static method of [<code>core/Serialization</code>](#module_core/Serialization)  

| Param | Type |
| --- | --- |
| objects | <code>Array</code> | 

<a name="module_core/Serialization.deserializeObjects"></a>

### core/Serialization.deserializeObjects(data, [options]) ⇒ <code>Array</code>
Restores objects from their JSON form. Shapes are created first, then connectors are re-linked by id.
Connectors whose endpoints are missing are dropped with a warning.

**Kind**: static method of [<code>core/Serialization</code>](#module_core/Serialization)  
**Returns**: <code>Array</code> - Live instances (shapes first, connectors after).  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;Object&gt;</code> \| <code>string</code> | Array of serialised objects (or its JSON string). |
| [options] | <code>Object</code> |  |

<a name="module_core/Serialization.createDocument"></a>

### core/Serialization.createDocument(parts) ⇒ <code>Object</code>
Builds a complete diagram document.

**Kind**: static method of [<code>core/Serialization</code>](#module_core/Serialization)  
**Returns**: <code>Object</code> - Plain document ready for `JSON.stringify`.  

| Param | Type | Description |
| --- | --- | --- |
| parts | <code>Object</code> |  |
| parts.objects | <code>Array</code> | Live objects. |
| [parts.metadata] | <code>Object</code> | Extra metadata (zoom, pan, name, ...). |
| [parts.connectionTypes] | <code>Object</code> | Connection types to embed; defaults to the custom (non built-in)   types in the registry. |

<a name="module_core/Serialization.validateDocument"></a>

### core/Serialization.validateDocument(doc) ⇒ <code>Object</code>
Structural validation of a document (no instantiation). Semantic checks (port existence, type
compatibility) live in [module:core/Diagram~Diagram#validate](module:core/Diagram~Diagram#validate).

**Kind**: static method of [<code>core/Serialization</code>](#module_core/Serialization)  

| Param | Type |
| --- | --- |
| doc | <code>Object</code> \| <code>string</code> | 

<a name="module_core/Serialization.parseDocument"></a>

### core/Serialization.parseDocument(doc) ⇒ <code>Object</code>
Parses a document: registers embedded connection types and restores live objects.

**Kind**: static method of [<code>core/Serialization</code>](#module_core/Serialization)  
**Throws**:

- <code>Error</code> If the document is structurally invalid.


| Param | Type |
| --- | --- |
| doc | <code>Object</code> \| <code>string</code> | 


