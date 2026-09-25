# Ports

_Source: `js/core/Ports.js`_

<a name="module_core/Ports"></a>

## core/Ports
Port key helpers and the rules that decide whether two anchors may be connected.

Port keys have the shape `<type>_<direction>_<index>`, e.g. `video_input_0` or `sdi_output_3`.
Basic shapes expose the generic anchors `top`, `right`, `bottom`, `left` and `center`;
connector anchors expose a single `anchor_point`.

**See**

- module:core/SystemObject
- module:core/Connector


* [core/Ports](#module_core/Ports)
    * [.portKey(type, direction, index)](#module_core/Ports.portKey) ⇒ <code>string</code>
    * [.parsePortKey(key)](#module_core/Ports.parsePortKey) ⇒ <code>Object</code> \| <code>null</code>
    * [.portLabel(key)](#module_core/Ports.portLabel) ⇒ <code>string</code>
    * [.expectedCounterpartPortType(startAnchor)](#module_core/Ports.expectedCounterpartPortType) ⇒ <code>&quot;input&quot;</code> \| <code>&quot;output&quot;</code> \| <code>null</code>
    * [.anchorsCompatible(a, b)](#module_core/Ports.anchorsCompatible) ⇒ <code>Object</code>
    * [.sideNormal(side)](#module_core/Ports.sideNormal) ⇒ <code>Object</code> \| <code>null</code>

<a name="module_core/Ports.portKey"></a>

### core/Ports.portKey(type, direction, index) ⇒ <code>string</code>
Builds a port key.

**Kind**: static method of [<code>core/Ports</code>](#module_core/Ports)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | Connection type id. |
| direction | <code>&quot;input&quot;</code> \| <code>&quot;output&quot;</code> |  |
| index | <code>number</code> | Zero-based index within the type/direction. |

<a name="module_core/Ports.parsePortKey"></a>

### core/Ports.parsePortKey(key) ⇒ <code>Object</code> \| <code>null</code>
Parses a port key.

**Kind**: static method of [<code>core/Ports</code>](#module_core/Ports)  
**Returns**: <code>Object</code> \| <code>null</code> - Null when the key is not a typed port key.  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="module_core/Ports.portLabel"></a>

### core/Ports.portLabel(key) ⇒ <code>string</code>
Human readable name for a port key, e.g. `Video In 1`.

**Kind**: static method of [<code>core/Ports</code>](#module_core/Ports)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="module_core/Ports.expectedCounterpartPortType"></a>

### core/Ports.expectedCounterpartPortType(startAnchor) ⇒ <code>&quot;input&quot;</code> \| <code>&quot;output&quot;</code> \| <code>null</code>
Given the anchor a connection starts from, returns the port direction the other end must have,
or `null` when any direction is acceptable (untyped anchors, bidirectional types).

**Kind**: static method of [<code>core/Ports</code>](#module_core/Ports)  

| Param | Type |
| --- | --- |
| startAnchor | <code>Object</code> | 

<a name="module_core/Ports.anchorsCompatible"></a>

### core/Ports.anchorsCompatible(a, b) ⇒ <code>Object</code>
Checks whether two anchors are allowed to be connected.

Rules:
- Untyped anchors (`connectionType` null) are wildcards and accept any type.
- Typed anchors must have the same connection type.
- Unless the type is bidirectional, one side must be an output and the other an input
  (`both` matches anything).

**Kind**: static method of [<code>core/Ports</code>](#module_core/Ports)  
**Returns**: <code>Object</code> - The resolved connection type is the
  typed side's type (or null when both are untyped).  

| Param | Type |
| --- | --- |
| a | <code>Object</code> | 
| b | <code>Object</code> | 

<a name="module_core/Ports.sideNormal"></a>

### core/Ports.sideNormal(side) ⇒ <code>Object</code> \| <code>null</code>
Unit normal vector pointing away from a shape for a given anchor side.

**Kind**: static method of [<code>core/Ports</code>](#module_core/Ports)  

| Param | Type | Description |
| --- | --- | --- |
| side | <code>string</code> \| <code>undefined</code> | One of `top`, `right`, `bottom`, `left`. |


