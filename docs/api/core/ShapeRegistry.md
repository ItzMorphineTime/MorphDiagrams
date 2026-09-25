# ShapeRegistry

_Source: `js/core/ShapeRegistry.js`_

<a name="module_core/ShapeRegistry"></a>

## core/ShapeRegistry
Single catalogue of every shape type: class, display name, category, default size and
default ports. Used by the editor (tool palette, properties panel, file loading), the headless
[module:core/Diagram](module:core/Diagram) model and the MCP server.

**See**

- module:core/SystemObject
- module:core/Serialization

**Example**  
```js
import { ShapeRegistry } from './core/ShapeRegistry.js';
const srv = ShapeRegistry.create('server', 100, 100);          // default size
const dev = ShapeRegistry.create('device', 0, 0, 140, 90, { label: 'Encoder', ports: { sdi: { input: 1, output: 0 } } });
```

* [core/ShapeRegistry](#module_core/ShapeRegistry)
    * [~ShapeRegistry](#module_core/ShapeRegistry..ShapeRegistry) : <code>object</code>
        * [.list([category])](#module_core/ShapeRegistry..ShapeRegistry.list) ⇒ <code>Array.&lt;ShapeTypeDef&gt;</code>
        * [.types()](#module_core/ShapeRegistry..ShapeRegistry.types) ⇒ <code>Array.&lt;string&gt;</code>
        * [.get(type)](#module_core/ShapeRegistry..ShapeRegistry.get) ⇒ <code>ShapeTypeDef</code> \| <code>undefined</code>
        * [.has(type)](#module_core/ShapeRegistry..ShapeRegistry.has)
        * [.displayName(type)](#module_core/ShapeRegistry..ShapeRegistry.displayName) ⇒ <code>string</code>
        * [.alwaysShowPorts(type)](#module_core/ShapeRegistry..ShapeRegistry.alwaysShowPorts) ⇒ <code>boolean</code>
        * [.create(type, [x], [y], [width], [height], [props])](#module_core/ShapeRegistry..ShapeRegistry.create) ⇒ <code>BaseShape</code>
        * [.applyProps(shape, props)](#module_core/ShapeRegistry..ShapeRegistry.applyProps) ⇒ <code>Object</code>
        * [.fromJSON(data, [options])](#module_core/ShapeRegistry..ShapeRegistry.fromJSON) ⇒ <code>BaseShape</code>
    * [~DEFS](#module_core/ShapeRegistry..DEFS) : <code>Array.&lt;ShapeTypeDef&gt;</code>
    * [~SETTABLE_PROPS](#module_core/ShapeRegistry..SETTABLE_PROPS)
    * [~ShapeTypeDef](#module_core/ShapeRegistry..ShapeTypeDef) : <code>Object</code>

<a name="module_core/ShapeRegistry..ShapeRegistry"></a>

### core/ShapeRegistry~ShapeRegistry : <code>object</code>
**Kind**: inner namespace of [<code>core/ShapeRegistry</code>](#module_core/ShapeRegistry)  

* [~ShapeRegistry](#module_core/ShapeRegistry..ShapeRegistry) : <code>object</code>
    * [.list([category])](#module_core/ShapeRegistry..ShapeRegistry.list) ⇒ <code>Array.&lt;ShapeTypeDef&gt;</code>
    * [.types()](#module_core/ShapeRegistry..ShapeRegistry.types) ⇒ <code>Array.&lt;string&gt;</code>
    * [.get(type)](#module_core/ShapeRegistry..ShapeRegistry.get) ⇒ <code>ShapeTypeDef</code> \| <code>undefined</code>
    * [.has(type)](#module_core/ShapeRegistry..ShapeRegistry.has)
    * [.displayName(type)](#module_core/ShapeRegistry..ShapeRegistry.displayName) ⇒ <code>string</code>
    * [.alwaysShowPorts(type)](#module_core/ShapeRegistry..ShapeRegistry.alwaysShowPorts) ⇒ <code>boolean</code>
    * [.create(type, [x], [y], [width], [height], [props])](#module_core/ShapeRegistry..ShapeRegistry.create) ⇒ <code>BaseShape</code>
    * [.applyProps(shape, props)](#module_core/ShapeRegistry..ShapeRegistry.applyProps) ⇒ <code>Object</code>
    * [.fromJSON(data, [options])](#module_core/ShapeRegistry..ShapeRegistry.fromJSON) ⇒ <code>BaseShape</code>

<a name="module_core/ShapeRegistry..ShapeRegistry.list"></a>

#### ShapeRegistry.list([category]) ⇒ <code>Array.&lt;ShapeTypeDef&gt;</code>
**Kind**: static method of [<code>ShapeRegistry</code>](#module_core/ShapeRegistry..ShapeRegistry)  

| Param | Type | Description |
| --- | --- | --- |
| [category] | <code>&quot;basic&quot;</code> \| <code>&quot;system&quot;</code> | Optional filter. |

<a name="module_core/ShapeRegistry..ShapeRegistry.types"></a>

#### ShapeRegistry.types() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: static method of [<code>ShapeRegistry</code>](#module_core/ShapeRegistry..ShapeRegistry)  
<a name="module_core/ShapeRegistry..ShapeRegistry.get"></a>

#### ShapeRegistry.get(type) ⇒ <code>ShapeTypeDef</code> \| <code>undefined</code>
**Kind**: static method of [<code>ShapeRegistry</code>](#module_core/ShapeRegistry..ShapeRegistry)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 

<a name="module_core/ShapeRegistry..ShapeRegistry.has"></a>

#### ShapeRegistry.has(type)
**Kind**: static method of [<code>ShapeRegistry</code>](#module_core/ShapeRegistry..ShapeRegistry)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | @returns {boolean} |

<a name="module_core/ShapeRegistry..ShapeRegistry.displayName"></a>

#### ShapeRegistry.displayName(type) ⇒ <code>string</code>
Display name for a type id (falls back to the id).

**Kind**: static method of [<code>ShapeRegistry</code>](#module_core/ShapeRegistry..ShapeRegistry)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 

<a name="module_core/ShapeRegistry..ShapeRegistry.alwaysShowPorts"></a>

#### ShapeRegistry.alwaysShowPorts(type) ⇒ <code>boolean</code>
Whether the editor should always draw port dots for this type.

**Kind**: static method of [<code>ShapeRegistry</code>](#module_core/ShapeRegistry..ShapeRegistry)  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 

<a name="module_core/ShapeRegistry..ShapeRegistry.create"></a>

#### ShapeRegistry.create(type, [x], [y], [width], [height], [props]) ⇒ <code>BaseShape</code>
Creates a shape instance.

**Kind**: static method of [<code>ShapeRegistry</code>](#module_core/ShapeRegistry..ShapeRegistry)  
**Throws**:

- <code>Error</code> For unknown types or invalid props (e.g. malformed ports).


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  |  |
| [x] | <code>number</code> | <code>0</code> |  |
| [y] | <code>number</code> | <code>0</code> |  |
| [width] | <code>number</code> |  | Defaults to the type's default width. |
| [height] | <code>number</code> |  | Defaults to the type's default height. |
| [props] | <code>Object</code> |  | Extra properties applied through [ShapeRegistry.applyProps](ShapeRegistry.applyProps). |

<a name="module_core/ShapeRegistry..ShapeRegistry.applyProps"></a>

#### ShapeRegistry.applyProps(shape, props) ⇒ <code>Object</code>
Applies a bag of properties to a shape, validating ports.

**Kind**: static method of [<code>ShapeRegistry</code>](#module_core/ShapeRegistry..ShapeRegistry)  
**Returns**: <code>Object</code> - Names of properties that were applied / not recognised.  
**Throws**:

- <code>Error</code> If `ports` is malformed or given to a shape without ports.


| Param | Type |
| --- | --- |
| shape | <code>BaseShape</code> | 
| props | <code>Object</code> | 

<a name="module_core/ShapeRegistry..ShapeRegistry.fromJSON"></a>

#### ShapeRegistry.fromJSON(data, [options]) ⇒ <code>BaseShape</code>
Restores a shape from its JSON form. Unknown types fall back to a rectangle (a warning is returned
via `options.onWarning`).

**Kind**: static method of [<code>ShapeRegistry</code>](#module_core/ShapeRegistry..ShapeRegistry)  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 
| [options] | <code>Object</code> | 

<a name="module_core/ShapeRegistry..DEFS"></a>

### core/ShapeRegistry~DEFS : <code>Array.&lt;ShapeTypeDef&gt;</code>
**Kind**: inner constant of [<code>core/ShapeRegistry</code>](#module_core/ShapeRegistry)  
<a name="module_core/ShapeRegistry..SETTABLE_PROPS"></a>

### core/ShapeRegistry~SETTABLE\_PROPS
Properties that may be set through [ShapeRegistry.applyProps](ShapeRegistry.applyProps).

**Kind**: inner constant of [<code>core/ShapeRegistry</code>](#module_core/ShapeRegistry)  
<a name="module_core/ShapeRegistry..ShapeTypeDef"></a>

### core/ShapeRegistry~ShapeTypeDef : <code>Object</code>
**Kind**: inner typedef of [<code>core/ShapeRegistry</code>](#module_core/ShapeRegistry)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | Type id stored in files. |
| name | <code>string</code> | Display name. |
| category | <code>&quot;basic&quot;</code> \| <code>&quot;system&quot;</code> |  |
| cls | <code>function</code> | Constructor. |
| defaultSize | <code>Object</code> |  |
| description | <code>string</code> |  |
| [hasPorts] | <code>boolean</code> | True for system objects with a `ports` map. |
| [fixedSize] | <code>boolean</code> | True when the shape cannot be resized. |
| [alwaysShowPorts] | <code>boolean</code> | Editor draws port dots even when unselected. |
| [defaultPorts] | <code>function</code> | Returns the default port map. |


