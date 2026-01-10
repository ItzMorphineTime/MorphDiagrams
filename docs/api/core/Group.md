# Group

_Source: `js/core/Group.js`_

<a name="module_core/Group"></a>

## core/Group
Core diagram module for `Group`.

**See**: module:core/BaseShape  
**Example**  
```js
import { Group } from './core/Group.js';
```

* [core/Group](#module_core/Group)
    * _static_
        * [.Group](#module_core/Group.Group)
            * [new exports.Group(shapes)](#new_module_core/Group.Group_new)
            * [.generateId()](#module_core/Group.Group+generateId)
            * [.addShape(shape)](#module_core/Group.Group+addShape)
            * [.removeShape(shape)](#module_core/Group.Group+removeShape)
            * [.getBounds()](#module_core/Group.Group+getBounds) ⇒ <code>\*</code>
            * [.move(dx, dy)](#module_core/Group.Group+move)
            * [.containsPoint(x, y)](#module_core/Group.Group+containsPoint) ⇒ <code>\*</code>
            * [.draw(ctx)](#module_core/Group.Group+draw)
            * [.toJSON()](#module_core/Group.Group+toJSON) ⇒ <code>\*</code>
    * _inner_
        * [~Group](#module_core/Group..Group)
            * [new Group()](#new_module_core/Group..Group_new)

<a name="module_core/Group.Group"></a>

### core/Group.Group
**Kind**: static class of [<code>core/Group</code>](#module_core/Group)  

* [.Group](#module_core/Group.Group)
    * [new exports.Group(shapes)](#new_module_core/Group.Group_new)
    * [.generateId()](#module_core/Group.Group+generateId)
    * [.addShape(shape)](#module_core/Group.Group+addShape)
    * [.removeShape(shape)](#module_core/Group.Group+removeShape)
    * [.getBounds()](#module_core/Group.Group+getBounds) ⇒ <code>\*</code>
    * [.move(dx, dy)](#module_core/Group.Group+move)
    * [.containsPoint(x, y)](#module_core/Group.Group+containsPoint) ⇒ <code>\*</code>
    * [.draw(ctx)](#module_core/Group.Group+draw)
    * [.toJSON()](#module_core/Group.Group+toJSON) ⇒ <code>\*</code>

<a name="new_module_core/Group.Group_new"></a>

#### new exports.Group(shapes)
Creates a new `Group` instance.


| Param | Type | Description |
| --- | --- | --- |
| shapes | <code>\*</code> | shapes value. |

<a name="module_core/Group.Group+generateId"></a>

#### group.generateId()
Performs `generateId`.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  
<a name="module_core/Group.Group+addShape"></a>

#### group.addShape(shape)
Performs `addShape`.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  

| Param | Type | Description |
| --- | --- | --- |
| shape | <code>Event</code> | shape value. |

<a name="module_core/Group.Group+removeShape"></a>

#### group.removeShape(shape)
Performs `removeShape`.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  

| Param | Type | Description |
| --- | --- | --- |
| shape | <code>Event</code> | shape value. |

<a name="module_core/Group.Group+getBounds"></a>

#### group.getBounds() ⇒ <code>\*</code>
Returns the object's bounding box in canvas coordinates.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_core/Group.Group+move"></a>

#### group.move(dx, dy)
Performs `move`.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | dx value. |
| dy | <code>number</code> | dy value. |

<a name="module_core/Group.Group+containsPoint"></a>

#### group.containsPoint(x, y) ⇒ <code>\*</code>
Checks whether a point lies within the object's bounds.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  
**Returns**: <code>\*</code> - Result value.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |

<a name="module_core/Group.Group+draw"></a>

#### group.draw(ctx)
Draws the object using the provided canvas context.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>number</code> | ctx value. |

<a name="module_core/Group.Group+toJSON"></a>

#### group.toJSON() ⇒ <code>\*</code>
Serializes the object to a JSON-compatible structure.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  
**Returns**: <code>\*</code> - Result value.  
<a name="module_core/Group..Group"></a>

### core/Group~Group
**Kind**: inner class of [<code>core/Group</code>](#module_core/Group)  
<a name="new_module_core/Group..Group_new"></a>

#### new Group()
`Group` core module for MorphDiagrams.

**Example**  
```js
const instance = new Group(10);
```

