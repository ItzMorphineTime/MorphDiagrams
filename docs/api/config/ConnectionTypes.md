# ConnectionTypes

_Source: `js/config/ConnectionTypes.js`_

<a name="module_config/ConnectionTypes"></a>

## config/ConnectionTypes
Connection-type registry (video, SDI, network, USB, ... plus user-defined types),
their colours, default system-object colours and port direction constants.

The registry is the single source of truth for which typed connections exist. The legacy
`ConnectionColors` map is kept as a live view of the registry so older code (and the settings
panel) can keep reading `ConnectionColors[type]`.

**Example**  
```js
import { ConnectionTypeRegistry } from './config/ConnectionTypes.js';
ConnectionTypeRegistry.register({ id: 'hdmi', label: 'HDMI', color: '#FF00AA' });
ConnectionTypeRegistry.colorFor('hdmi'); // '#FF00AA'
```

* [config/ConnectionTypes](#module_config/ConnectionTypes)
    * _static_
        * [.ConnectionTypes](#module_config/ConnectionTypes.ConnectionTypes) : <code>enum</code>
        * [.PortTypes](#module_config/ConnectionTypes.PortTypes) : <code>enum</code>
        * [.ObjectColors](#module_config/ConnectionTypes.ObjectColors) : <code>Object.&lt;string, string&gt;</code>
        * [.DEFAULT_OBJECT_COLORS](#module_config/ConnectionTypes.DEFAULT_OBJECT_COLORS)
        * [.ConnectionColors](#module_config/ConnectionTypes.ConnectionColors) : <code>Object.&lt;string, string&gt;</code>
        * [.DEFAULT_CONNECTION_COLORS](#module_config/ConnectionTypes.DEFAULT_CONNECTION_COLORS)
    * _inner_
        * [~ConnectionTypeRegistry](#module_config/ConnectionTypes..ConnectionTypeRegistry) : <code>object</code>
            * [.normalizeId](#module_config/ConnectionTypes..ConnectionTypeRegistry.normalizeId) ⇒ <code>string</code>
            * [.register(def)](#module_config/ConnectionTypes..ConnectionTypeRegistry.register) ⇒ <code>ConnectionTypeDef</code>
            * [.get(id)](#module_config/ConnectionTypes..ConnectionTypeRegistry.get)
            * [.has(id)](#module_config/ConnectionTypes..ConnectionTypeRegistry.has)
            * [.list()](#module_config/ConnectionTypes..ConnectionTypeRegistry.list) ⇒ <code>Array.&lt;ConnectionTypeDef&gt;</code>
            * [.ids()](#module_config/ConnectionTypes..ConnectionTypeRegistry.ids) ⇒ <code>Array.&lt;string&gt;</code>
            * [.colorFor(id, [fallback])](#module_config/ConnectionTypes..ConnectionTypeRegistry.colorFor) ⇒ <code>string</code>
            * [.setColor(id, color)](#module_config/ConnectionTypes..ConnectionTypeRegistry.setColor)
            * [.isBidirectional(id)](#module_config/ConnectionTypes..ConnectionTypeRegistry.isBidirectional) ⇒ <code>boolean</code>
            * [.unregister(id)](#module_config/ConnectionTypes..ConnectionTypeRegistry.unregister) ⇒ <code>boolean</code>
            * [.reset()](#module_config/ConnectionTypes..ConnectionTypeRegistry.reset)
            * [.toJSON([options])](#module_config/ConnectionTypes..ConnectionTypeRegistry.toJSON) ⇒ <code>Object.&lt;string, {label:string, color:string, bidirectional:boolean, description:string}&gt;</code>
            * [.fromJSON(json)](#module_config/ConnectionTypes..ConnectionTypeRegistry.fromJSON)
        * [~ConnectionTypeDef](#module_config/ConnectionTypes..ConnectionTypeDef) : <code>Object</code>

<a name="module_config/ConnectionTypes.ConnectionTypes"></a>

### config/ConnectionTypes.ConnectionTypes : <code>enum</code>
Built-in connection type identifiers.

**Kind**: static enum of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
**Read only**: true  
<a name="module_config/ConnectionTypes.PortTypes"></a>

### config/ConnectionTypes.PortTypes : <code>enum</code>
Port direction identifiers.

**Kind**: static enum of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
**Read only**: true  
<a name="module_config/ConnectionTypes.ObjectColors"></a>

### config/ConnectionTypes.ObjectColors : <code>Object.&lt;string, string&gt;</code>
Default fill colours for the built-in system object types.
Mutated at runtime by the settings panel.

**Kind**: static constant of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
<a name="module_config/ConnectionTypes.DEFAULT_OBJECT_COLORS"></a>

### config/ConnectionTypes.DEFAULT\_OBJECT\_COLORS
Factory defaults for [ObjectColors](ObjectColors), used by "Reset to defaults".

**Kind**: static constant of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
<a name="module_config/ConnectionTypes.ConnectionColors"></a>

### config/ConnectionTypes.ConnectionColors : <code>Object.&lt;string, string&gt;</code>
Live map of connection type id -> colour. Kept in sync with the registry.

**Kind**: static constant of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
<a name="module_config/ConnectionTypes.DEFAULT_CONNECTION_COLORS"></a>

### config/ConnectionTypes.DEFAULT\_CONNECTION\_COLORS
Factory colours of the built-in connection types, used by "Reset to defaults".

**Kind**: static constant of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
<a name="module_config/ConnectionTypes..ConnectionTypeRegistry"></a>

### config/ConnectionTypes~ConnectionTypeRegistry : <code>object</code>
Registry of connection types.

**Kind**: inner namespace of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  

* [~ConnectionTypeRegistry](#module_config/ConnectionTypes..ConnectionTypeRegistry) : <code>object</code>
    * [.normalizeId](#module_config/ConnectionTypes..ConnectionTypeRegistry.normalizeId) ⇒ <code>string</code>
    * [.register(def)](#module_config/ConnectionTypes..ConnectionTypeRegistry.register) ⇒ <code>ConnectionTypeDef</code>
    * [.get(id)](#module_config/ConnectionTypes..ConnectionTypeRegistry.get)
    * [.has(id)](#module_config/ConnectionTypes..ConnectionTypeRegistry.has)
    * [.list()](#module_config/ConnectionTypes..ConnectionTypeRegistry.list) ⇒ <code>Array.&lt;ConnectionTypeDef&gt;</code>
    * [.ids()](#module_config/ConnectionTypes..ConnectionTypeRegistry.ids) ⇒ <code>Array.&lt;string&gt;</code>
    * [.colorFor(id, [fallback])](#module_config/ConnectionTypes..ConnectionTypeRegistry.colorFor) ⇒ <code>string</code>
    * [.setColor(id, color)](#module_config/ConnectionTypes..ConnectionTypeRegistry.setColor)
    * [.isBidirectional(id)](#module_config/ConnectionTypes..ConnectionTypeRegistry.isBidirectional) ⇒ <code>boolean</code>
    * [.unregister(id)](#module_config/ConnectionTypes..ConnectionTypeRegistry.unregister) ⇒ <code>boolean</code>
    * [.reset()](#module_config/ConnectionTypes..ConnectionTypeRegistry.reset)
    * [.toJSON([options])](#module_config/ConnectionTypes..ConnectionTypeRegistry.toJSON) ⇒ <code>Object.&lt;string, {label:string, color:string, bidirectional:boolean, description:string}&gt;</code>
    * [.fromJSON(json)](#module_config/ConnectionTypes..ConnectionTypeRegistry.fromJSON)

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.normalizeId"></a>

#### ConnectionTypeRegistry.normalizeId ⇒ <code>string</code>
Normalises an id the same way [ConnectionTypeRegistry.register](ConnectionTypeRegistry.register) does.

**Kind**: static property of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.register"></a>

#### ConnectionTypeRegistry.register(def) ⇒ <code>ConnectionTypeDef</code>
Registers (or updates) a connection type.

**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  
**Returns**: <code>ConnectionTypeDef</code> - The stored definition.  
**Throws**:

- <code>Error</code> If the id is empty after normalisation.


| Param | Type |
| --- | --- |
| def | <code>Object</code> | 

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.get"></a>

#### ConnectionTypeRegistry.get(id)
**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | @returns {ConnectionTypeDef|undefined} |

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.has"></a>

#### ConnectionTypeRegistry.has(id)
**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | @returns {boolean} |

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.list"></a>

#### ConnectionTypeRegistry.list() ⇒ <code>Array.&lt;ConnectionTypeDef&gt;</code>
**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  
**Returns**: <code>Array.&lt;ConnectionTypeDef&gt;</code> - All registered types in registration order.  
<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.ids"></a>

#### ConnectionTypeRegistry.ids() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  
<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.colorFor"></a>

#### ConnectionTypeRegistry.colorFor(id, [fallback]) ⇒ <code>string</code>
Colour for a connection type. Unknown types get a stable palette colour so they still render distinctly.

**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> \| <code>null</code> \| <code>undefined</code> |  |  |
| [fallback] | <code>string</code> | <code>&quot;&#x27;#0066cc&#x27;&quot;</code> | Colour for null/undefined (untyped) connections. |

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.setColor"></a>

#### ConnectionTypeRegistry.setColor(id, color)
Changes the colour of an existing type (also updates `ConnectionColors`).

**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 
| color | <code>string</code> | 

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.isBidirectional"></a>

#### ConnectionTypeRegistry.isBidirectional(id) ⇒ <code>boolean</code>
Whether ports of this type can connect regardless of input/output direction.

**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  

| Param | Type |
| --- | --- |
| id | <code>string</code> \| <code>null</code> | 

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.unregister"></a>

#### ConnectionTypeRegistry.unregister(id) ⇒ <code>boolean</code>
Removes a user-defined type. Built-in types cannot be removed.

**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  
**Returns**: <code>boolean</code> - True if removed.  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.reset"></a>

#### ConnectionTypeRegistry.reset()
Restores factory colours for built-in types and removes user-defined types.

**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  
<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.toJSON"></a>

#### ConnectionTypeRegistry.toJSON([options]) ⇒ <code>Object.&lt;string, {label:string, color:string, bidirectional:boolean, description:string}&gt;</code>
Serialisable snapshot of the registry (used in the diagram file's `connectionTypes` block).

**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  

| Param | Type |
| --- | --- |
| [options] | <code>Object</code> | 

<a name="module_config/ConnectionTypes..ConnectionTypeRegistry.fromJSON"></a>

#### ConnectionTypeRegistry.fromJSON(json)
Registers every type found in a `connectionTypes` block from a diagram file.

**Kind**: static method of [<code>ConnectionTypeRegistry</code>](#module_config/ConnectionTypes..ConnectionTypeRegistry)  

| Param | Type |
| --- | --- |
| json | <code>Object.&lt;string, Partial.&lt;ConnectionTypeDef&gt;&gt;</code> \| <code>null</code> \| <code>undefined</code> | 

<a name="module_config/ConnectionTypes..ConnectionTypeDef"></a>

### config/ConnectionTypes~ConnectionTypeDef : <code>Object</code>
**Kind**: inner typedef of [<code>config/ConnectionTypes</code>](#module_config/ConnectionTypes)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Machine identifier (lowercase, used in port keys such as `video_input_0`). |
| label | <code>string</code> | Human readable name. |
| color | <code>string</code> | Hex colour used for ports and connectors of this type. |
| bidirectional | <code>boolean</code> | When true, ports of this type may connect input-to-input or output-to-output   (e.g. network links). When false, connections must run from an output to an input. |
| [description] | <code>string</code> | Free-form description shown to users and agents. |
| [builtin] | <code>boolean</code> | True for the four factory types. |


