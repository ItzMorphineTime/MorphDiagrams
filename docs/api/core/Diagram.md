# Diagram

_Source: `js/core/Diagram.js`_

<a name="module_core/Diagram"></a>

## core/Diagram
Headless diagram document: the objects plus the operations that keep them consistent
(adding/removing objects, connecting ports with validation, port usage, semantic validation,
automatic layout, bounds). It has no DOM dependency and is used by the editor, the MCP server
and the tests.

**See**

- module:core/Serialization
- module:core/Ports

**Example**  
```js
const d = new Diagram();
const srv = d.createShape('server', { label: 'Media Server', ports: { video: { input: 0, output: 2 } } });
const led = d.createShape('led_processor', { label: 'LED Proc' });
d.connect({ from: srv, fromPort: 'video_output', to: led, toPort: 'video_input' });
d.autoLayout();
d.validate(); // { errors: [], warnings: [] }
```

* [core/Diagram](#module_core/Diagram)
    * [.DiagramError](#module_core/Diagram.DiagramError)
        * [new exports.DiagramError(message, [details])](#new_module_core/Diagram.DiagramError_new)
    * [.Diagram](#module_core/Diagram.Diagram)
        * [new exports.Diagram([init])](#new_module_core/Diagram.Diagram_new)
        * _instance_
            * [.objects](#module_core/Diagram.Diagram+objects) : <code>Array</code>
            * [.metadata](#module_core/Diagram.Diagram+metadata) : <code>Object</code>
            * [.nextGroupId](#module_core/Diagram.Diagram+nextGroupId) : <code>number</code>
            * [.shapes](#module_core/Diagram.Diagram+shapes) ⇒ <code>Array</code>
            * [.connectors](#module_core/Diagram.Diagram+connectors) ⇒ <code>Array.&lt;Connector&gt;</code>
            * [.toJSON([extraMetadata])](#module_core/Diagram.Diagram+toJSON) ⇒ <code>Object</code>
            * [.clone()](#module_core/Diagram.Diagram+clone) ⇒ <code>Diagram</code>
            * [.getById(id)](#module_core/Diagram.Diagram+getById) ⇒ <code>Object</code> \| <code>undefined</code>
            * [.findByLabel(label)](#module_core/Diagram.Diagram+findByLabel) ⇒ <code>Array</code>
            * [.resolve(ref, [options])](#module_core/Diagram.Diagram+resolve) ⇒ <code>Object</code>
            * [.add(obj)](#module_core/Diagram.Diagram+add) ⇒ <code>Object</code>
            * [.createShape(type, [props])](#module_core/Diagram.Diagram+createShape) ⇒ <code>Object</code>
            * [.updateObject(ref, patch, [options])](#module_core/Diagram.Diagram+updateObject) ⇒ <code>Object</code>
            * [.updateConnector(ref, patch)](#module_core/Diagram.Diagram+updateConnector) ⇒ <code>Object</code>
            * [.remove(ref)](#module_core/Diagram.Diagram+remove) ⇒ <code>Array.&lt;string&gt;</code>
            * [.getPortUsage(shape)](#module_core/Diagram.Diagram+getPortUsage) ⇒ <code>Map.&lt;string, Array.&lt;Connector&gt;&gt;</code>
            * [.listPorts(ref)](#module_core/Diagram.Diagram+listPorts) ⇒ <code>Array.&lt;{key:string, label:string, type: (string\|null), direction:string, x:number, y:number, connections:Array.&lt;{connectorId:string, otherObject:string, otherAnchor:string}&gt;}&gt;</code>
            * [.connect(spec)](#module_core/Diagram.Diagram+connect) ⇒ <code>Connector</code>
            * [.connectionTypeOf(conn)](#module_core/Diagram.Diagram+connectionTypeOf) ⇒ <code>string</code> \| <code>null</code>
            * [.flowOf(conn)](#module_core/Diagram.Diagram+flowOf) ⇒ <code>Object</code>
            * [.tracePath(fromRefs, [direction], [options])](#module_core/Diagram.Diagram+tracePath) ⇒ <code>Object</code>
            * [.computeFilter([filter])](#module_core/Diagram.Diagram+computeFilter) ⇒ <code>Object</code>
            * [.disconnect(spec)](#module_core/Diagram.Diagram+disconnect) ⇒ <code>Array.&lt;string&gt;</code>
            * [.group(refs)](#module_core/Diagram.Diagram+group) ⇒ <code>number</code>
            * [.ungroup(refs)](#module_core/Diagram.Diagram+ungroup)
            * [.validate()](#module_core/Diagram.Diagram+validate) ⇒ <code>Object</code>
            * [.getBounds([padding])](#module_core/Diagram.Diagram+getBounds) ⇒ <code>Object</code> \| <code>null</code>
            * [.autoLayout([options])](#module_core/Diagram.Diagram+autoLayout) ⇒ <code>Object</code>
            * [.summary()](#module_core/Diagram.Diagram+summary) ⇒ <code>string</code>
        * _static_
            * [.fromJSON(doc)](#module_core/Diagram.Diagram.fromJSON) ⇒ <code>Object</code>

<a name="module_core/Diagram.DiagramError"></a>

### core/Diagram.DiagramError
Error raised for invalid diagram operations. `details` carries machine-readable hints
(e.g. the list of free ports) so agents can recover.

**Kind**: static class of [<code>core/Diagram</code>](#module_core/Diagram)  
<a name="new_module_core/Diagram.DiagramError_new"></a>

#### new exports.DiagramError(message, [details])

| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| [details] | <code>Object</code> | 

<a name="module_core/Diagram.Diagram"></a>

### core/Diagram.Diagram
**Kind**: static class of [<code>core/Diagram</code>](#module_core/Diagram)  

* [.Diagram](#module_core/Diagram.Diagram)
    * [new exports.Diagram([init])](#new_module_core/Diagram.Diagram_new)
    * _instance_
        * [.objects](#module_core/Diagram.Diagram+objects) : <code>Array</code>
        * [.metadata](#module_core/Diagram.Diagram+metadata) : <code>Object</code>
        * [.nextGroupId](#module_core/Diagram.Diagram+nextGroupId) : <code>number</code>
        * [.shapes](#module_core/Diagram.Diagram+shapes) ⇒ <code>Array</code>
        * [.connectors](#module_core/Diagram.Diagram+connectors) ⇒ <code>Array.&lt;Connector&gt;</code>
        * [.toJSON([extraMetadata])](#module_core/Diagram.Diagram+toJSON) ⇒ <code>Object</code>
        * [.clone()](#module_core/Diagram.Diagram+clone) ⇒ <code>Diagram</code>
        * [.getById(id)](#module_core/Diagram.Diagram+getById) ⇒ <code>Object</code> \| <code>undefined</code>
        * [.findByLabel(label)](#module_core/Diagram.Diagram+findByLabel) ⇒ <code>Array</code>
        * [.resolve(ref, [options])](#module_core/Diagram.Diagram+resolve) ⇒ <code>Object</code>
        * [.add(obj)](#module_core/Diagram.Diagram+add) ⇒ <code>Object</code>
        * [.createShape(type, [props])](#module_core/Diagram.Diagram+createShape) ⇒ <code>Object</code>
        * [.updateObject(ref, patch, [options])](#module_core/Diagram.Diagram+updateObject) ⇒ <code>Object</code>
        * [.updateConnector(ref, patch)](#module_core/Diagram.Diagram+updateConnector) ⇒ <code>Object</code>
        * [.remove(ref)](#module_core/Diagram.Diagram+remove) ⇒ <code>Array.&lt;string&gt;</code>
        * [.getPortUsage(shape)](#module_core/Diagram.Diagram+getPortUsage) ⇒ <code>Map.&lt;string, Array.&lt;Connector&gt;&gt;</code>
        * [.listPorts(ref)](#module_core/Diagram.Diagram+listPorts) ⇒ <code>Array.&lt;{key:string, label:string, type: (string\|null), direction:string, x:number, y:number, connections:Array.&lt;{connectorId:string, otherObject:string, otherAnchor:string}&gt;}&gt;</code>
        * [.connect(spec)](#module_core/Diagram.Diagram+connect) ⇒ <code>Connector</code>
        * [.connectionTypeOf(conn)](#module_core/Diagram.Diagram+connectionTypeOf) ⇒ <code>string</code> \| <code>null</code>
        * [.flowOf(conn)](#module_core/Diagram.Diagram+flowOf) ⇒ <code>Object</code>
        * [.tracePath(fromRefs, [direction], [options])](#module_core/Diagram.Diagram+tracePath) ⇒ <code>Object</code>
        * [.computeFilter([filter])](#module_core/Diagram.Diagram+computeFilter) ⇒ <code>Object</code>
        * [.disconnect(spec)](#module_core/Diagram.Diagram+disconnect) ⇒ <code>Array.&lt;string&gt;</code>
        * [.group(refs)](#module_core/Diagram.Diagram+group) ⇒ <code>number</code>
        * [.ungroup(refs)](#module_core/Diagram.Diagram+ungroup)
        * [.validate()](#module_core/Diagram.Diagram+validate) ⇒ <code>Object</code>
        * [.getBounds([padding])](#module_core/Diagram.Diagram+getBounds) ⇒ <code>Object</code> \| <code>null</code>
        * [.autoLayout([options])](#module_core/Diagram.Diagram+autoLayout) ⇒ <code>Object</code>
        * [.summary()](#module_core/Diagram.Diagram+summary) ⇒ <code>string</code>
    * _static_
        * [.fromJSON(doc)](#module_core/Diagram.Diagram.fromJSON) ⇒ <code>Object</code>

<a name="new_module_core/Diagram.Diagram_new"></a>

#### new exports.Diagram([init])

| Param | Type | Description |
| --- | --- | --- |
| [init] | <code>Object</code> |  |
| [init.objects] | <code>Array</code> | Live objects. |
| [init.metadata] | <code>Object</code> |  |

<a name="module_core/Diagram.Diagram+objects"></a>

#### diagram.objects : <code>Array</code>
Shapes and connectors, in insertion (z) order

**Kind**: instance property of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
<a name="module_core/Diagram.Diagram+metadata"></a>

#### diagram.metadata : <code>Object</code>
**Kind**: instance property of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
<a name="module_core/Diagram.Diagram+nextGroupId"></a>

#### diagram.nextGroupId : <code>number</code>
**Kind**: instance property of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
<a name="module_core/Diagram.Diagram+shapes"></a>

#### diagram.shapes ⇒ <code>Array</code>
**Kind**: instance property of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Returns**: <code>Array</code> - Non-connector objects  
<a name="module_core/Diagram.Diagram+connectors"></a>

#### diagram.connectors ⇒ <code>Array.&lt;Connector&gt;</code>
**Kind**: instance property of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
<a name="module_core/Diagram.Diagram+toJSON"></a>

#### diagram.toJSON([extraMetadata]) ⇒ <code>Object</code>
Serialises the diagram to a document.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| [extraMetadata] | <code>Object</code> | 

<a name="module_core/Diagram.Diagram+clone"></a>

#### diagram.clone() ⇒ <code>Diagram</code>
Deep copy of the diagram.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
<a name="module_core/Diagram.Diagram+getById"></a>

#### diagram.getById(id) ⇒ <code>Object</code> \| <code>undefined</code>
**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="module_core/Diagram.Diagram+findByLabel"></a>

#### diagram.findByLabel(label) ⇒ <code>Array</code>
Case-insensitive label lookup among shapes.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| label | <code>string</code> | 

<a name="module_core/Diagram.Diagram+resolve"></a>

#### diagram.resolve(ref, [options]) ⇒ <code>Object</code>
Resolves an object reference: an instance, an id, or a unique label.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Throws**:

- <code>DiagramError</code> When nothing (or more than one label match) is found.


| Param | Type |
| --- | --- |
| ref | <code>Object</code> \| <code>string</code> | 
| [options] | <code>Object</code> | 

<a name="module_core/Diagram.Diagram+add"></a>

#### diagram.add(obj) ⇒ <code>Object</code>
Adds an object, ensuring its id is unique.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Returns**: <code>Object</code> - The same object.  
**Throws**:

- <code>DiagramError</code> On duplicate ids.


| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="module_core/Diagram.Diagram+createShape"></a>

#### diagram.createShape(type, [props]) ⇒ <code>Object</code>
Creates a shape through the registry and adds it.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Returns**: <code>Object</code> - The new shape.  
**Throws**:

- <code>DiagramError</code> 


| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> |  |
| [props] | <code>Object</code> | Position, size, label, ports, ... (see ShapeRegistry.applyProps). |

<a name="module_core/Diagram.Diagram+updateObject"></a>

#### diagram.updateObject(ref, patch, [options]) ⇒ <code>Object</code>
Applies a property patch to an object. Reducing port counts that would orphan connectors is
refused unless `options.detachConnectors` is true (those connectors are then removed).

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Throws**:

- <code>DiagramError</code> 


| Param | Type |
| --- | --- |
| ref | <code>Object</code> \| <code>string</code> | 
| patch | <code>Object</code> | 
| [options] | <code>Object</code> | 

<a name="module_core/Diagram.Diagram+updateConnector"></a>

#### diagram.updateConnector(ref, patch) ⇒ <code>Object</code>
Updates connector styling / label / waypoints.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| ref | <code>Connector</code> \| <code>string</code> | 
| patch | <code>Object</code> | 

<a name="module_core/Diagram.Diagram+remove"></a>

#### diagram.remove(ref) ⇒ <code>Array.&lt;string&gt;</code>
Removes an object; removing a shape also removes its connectors.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Returns**: <code>Array.&lt;string&gt;</code> - Ids of all removed objects.  

| Param | Type |
| --- | --- |
| ref | <code>Object</code> \| <code>string</code> | 

<a name="module_core/Diagram.Diagram+getPortUsage"></a>

#### diagram.getPortUsage(shape) ⇒ <code>Map.&lt;string, Array.&lt;Connector&gt;&gt;</code>
Connectors attached to each anchor of a shape.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| shape | <code>Object</code> | 

<a name="module_core/Diagram.Diagram+listPorts"></a>

#### diagram.listPorts(ref) ⇒ <code>Array.&lt;{key:string, label:string, type: (string\|null), direction:string, x:number, y:number, connections:Array.&lt;{connectorId:string, otherObject:string, otherAnchor:string}&gt;}&gt;</code>
Describes every anchor of a shape with its usage.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| ref | <code>Object</code> \| <code>string</code> | 

<a name="module_core/Diagram.Diagram+connect"></a>

#### diagram.connect(spec) ⇒ <code>Connector</code>
Creates a validated connector between two shapes.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Throws**:

- <code>DiagramError</code> 


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| spec | <code>Object</code> |  |  |
| spec.from | <code>Object</code> \| <code>string</code> |  | Shape (instance, id or unique label). |
| spec.to | <code>Object</code> \| <code>string</code> |  |  |
| [spec.fromPort] | <code>string</code> |  | Port key, `type_direction`, type, side, or omitted for auto. |
| [spec.toPort] | <code>string</code> |  |  |
| [spec.connectionType] | <code>string</code> |  | Force a connection type (defaults to the ports' type). |
| [spec.style] | <code>&quot;straight&quot;</code> \| <code>&quot;orthogonal&quot;</code> \| <code>&quot;bezier&quot;</code> \| <code>&quot;polyline&quot;</code> | <code>&#x27;orthogonal&#x27;</code> |  |
| [spec.lineStyle] | <code>&quot;solid&quot;</code> \| <code>&quot;dashed&quot;</code> \| <code>&quot;dotted&quot;</code> | <code>&#x27;solid&#x27;</code> |  |
| [spec.label] | <code>string</code> |  |  |
| [spec.arrowStart] | <code>boolean</code> | <code>false</code> |  |
| [spec.arrowEnd] | <code>boolean</code> | <code>true</code> |  |
| [spec.waypoints] | <code>Array.&lt;{x:number, y:number}&gt;</code> |  |  |
| [spec.id] | <code>string</code> |  |  |
| [spec.stroke] | <code>string</code> |  | Override colour. |
| [spec.strokeWidth] | <code>number</code> |  |  |
| [spec.allowOccupied] | <code>boolean</code> | <code>false</code> | Allow sharing an already connected port. |

<a name="module_core/Diagram.Diagram+connectionTypeOf"></a>

#### diagram.connectionTypeOf(conn) ⇒ <code>string</code> \| <code>null</code>
Effective connection type of a connector: its own type, or the type of the typed port it touches.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| conn | <code>Connector</code> | 

<a name="module_core/Diagram.Diagram+flowOf"></a>

#### diagram.flowOf(conn) ⇒ <code>Object</code>
Signal flow of a connector derived from its port directions: `from` feeds `to`.
Bidirectional types (and links between untyped anchors) are reported as `undirected`.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| conn | <code>Connector</code> | 

<a name="module_core/Diagram.Diagram+tracePath"></a>

#### diagram.tracePath(fromRefs, [direction], [options]) ⇒ <code>Object</code>
Follows connectors from one or more shapes and returns everything reachable.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Returns**: <code>Object</code> - Shapes in breadth-first order (depth 0 = start).  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fromRefs | <code>Array.&lt;(Object\|string)&gt;</code> |  | Start shapes (ids, labels or instances). |
| [direction] | <code>&quot;downstream&quot;</code> \| <code>&quot;upstream&quot;</code> \| <code>&quot;both&quot;</code> | <code>&#x27;downstream&#x27;</code> |  |
| [options] | <code>Object</code> |  |  |
| [options.connectionTypes] | <code>Array.&lt;string&gt;</code> |  | Only traverse connectors of these types. |
| [options.maxDepth] | <code>number</code> | <code>Infinity</code> |  |
| [options.bidirectional] | <code>&quot;hop&quot;</code> \| <code>&quot;full&quot;</code> \| <code>&quot;none&quot;</code> | <code>&#x27;hop&#x27;</code> | How undirected links (network, fibre, Wi-Fi, untyped)   are followed: `hop` reaches the neighbour but does not continue through it (a switch does not leak the trace   into the whole network), `full` traverses them like any other link, `none` ignores them. |

<a name="module_core/Diagram.Diagram+computeFilter"></a>

#### diagram.computeFilter([filter]) ⇒ <code>Object</code>
Computes which objects a view filter keeps. Criteria combine with AND.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type | Description |
| --- | --- | --- |
| [filter] | <code>Object</code> |  |
| [filter.connectionTypes] | <code>Array.&lt;string&gt;</code> | Keep connectors of these types and the shapes that carry such ports or links. |
| [filter.shapeTypes] | <code>Array.&lt;string&gt;</code> | Keep only shapes of these types (and links between them). |
| [filter.trace] | <code>Object</code> | Keep only the signal path reachable from the given shapes (see [Diagram#tracePath](Diagram#tracePath) for `bidirectional`). |

<a name="module_core/Diagram.Diagram+disconnect"></a>

#### diagram.disconnect(spec) ⇒ <code>Array.&lt;string&gt;</code>
Removes a connector by id, or every connector between two shapes.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Returns**: <code>Array.&lt;string&gt;</code> - Removed connector ids.  

| Param | Type |
| --- | --- |
| spec | <code>Object</code> | 
| [spec.id] | <code>string</code> | 
| [spec.from] | <code>Object</code> \| <code>string</code> | 
| [spec.to] | <code>Object</code> \| <code>string</code> | 

<a name="module_core/Diagram.Diagram+group"></a>

#### diagram.group(refs) ⇒ <code>number</code>
Groups shapes together (they move as a unit in the editor).

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Returns**: <code>number</code> - The group id.  

| Param | Type |
| --- | --- |
| refs | <code>Array.&lt;(Object\|string)&gt;</code> | 

<a name="module_core/Diagram.Diagram+ungroup"></a>

#### diagram.ungroup(refs)
Removes shapes from their groups.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| refs | <code>Array.&lt;(Object\|string)&gt;</code> | 

<a name="module_core/Diagram.Diagram+validate"></a>

#### diagram.validate() ⇒ <code>Object</code>
Semantic validation: dangling ports, incompatible or duplicated connections, unknown types,
overlapping devices, unlabeled devices.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Returns**: <code>Object</code> - `issues` carries the ids of the objects involved so a UI can select them.  
<a name="module_core/Diagram.Diagram+getBounds"></a>

#### diagram.getBounds([padding]) ⇒ <code>Object</code> \| <code>null</code>
Union of all shape bounds (and connector waypoints).

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
**Returns**: <code>Object</code> \| <code>null</code> - Null for an empty diagram.  

| Param | Type | Default |
| --- | --- | --- |
| [padding] | <code>number</code> | <code>0</code> | 

<a name="module_core/Diagram.Diagram+autoLayout"></a>

#### diagram.autoLayout([options]) ⇒ <code>Object</code>
Layered automatic layout following the connection flow (sources on the left / top).
Grouped shapes move as one unit. Waypoints and bezier control points of moved connectors are reset.

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.direction] | <code>&quot;LR&quot;</code> \| <code>&quot;TB&quot;</code> | <code>&#x27;LR&#x27;</code> |  |
| [options.columnGap] | <code>number</code> | <code>140</code> | Gap between layers. |
| [options.rowGap] | <code>number</code> | <code>50</code> | Gap between nodes in a layer. |
| [options.marginX] | <code>number</code> | <code>60</code> |  |
| [options.marginY] | <code>number</code> | <code>60</code> |  |
| [options.includeUnconnected] | <code>boolean</code> | <code>true</code> | Place unconnected shapes in a final layer. |

<a name="module_core/Diagram.Diagram+summary"></a>

#### diagram.summary() ⇒ <code>string</code>
Human readable summary of the diagram (devices, ports, connections, issues).

**Kind**: instance method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  
<a name="module_core/Diagram.Diagram.fromJSON"></a>

#### Diagram.fromJSON(doc) ⇒ <code>Object</code>
Loads a diagram from a document (object or JSON string).

**Kind**: static method of [<code>Diagram</code>](#module_core/Diagram.Diagram)  

| Param | Type |
| --- | --- |
| doc | <code>Object</code> \| <code>string</code> | 


