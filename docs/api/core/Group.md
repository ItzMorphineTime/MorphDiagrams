# Group

_Source: `js/core/Group.js`_

<a name="module_core/Group"></a>

## core/Group
Group class for managing multiple shapes together. Enables moving, selecting, and transforming multiple shapes as a unit.

**Remarks**: - Groups are used to treat multiple shapes as a single unit.- Groups maintain bounds that encompass all member shapes.- Shapes can be added or removed from groups dynamically.  
**See**: module:core/BaseShape  
**Example**  
```js
const group = new Group([shape1, shape2, shape3]);group.move(10, 20); // Moves all shapes in the group
```

* [core/Group](#module_core/Group)
    * [.Group](#module_core/Group.Group)
        * [new exports.Group([shapes])](#new_module_core/Group.Group_new)
        * [.addShape(shape)](#module_core/Group.Group+addShape)
        * [.removeShape(shape)](#module_core/Group.Group+removeShape)
        * [.getBounds()](#module_core/Group.Group+getBounds) ⇒ <code>Object</code> \| <code>null</code>
        * [.move(dx, dy)](#module_core/Group.Group+move)
        * [.containsPoint(x, y)](#module_core/Group.Group+containsPoint) ⇒ <code>boolean</code>
        * [.draw(ctx)](#module_core/Group.Group+draw)
        * [.toJSON()](#module_core/Group.Group+toJSON) ⇒ <code>Object</code>

<a name="module_core/Group.Group"></a>

### core/Group.Group
Group class for managing multiple shapes together.

**Kind**: static class of [<code>core/Group</code>](#module_core/Group)  

* [.Group](#module_core/Group.Group)
    * [new exports.Group([shapes])](#new_module_core/Group.Group_new)
    * [.addShape(shape)](#module_core/Group.Group+addShape)
    * [.removeShape(shape)](#module_core/Group.Group+removeShape)
    * [.getBounds()](#module_core/Group.Group+getBounds) ⇒ <code>Object</code> \| <code>null</code>
    * [.move(dx, dy)](#module_core/Group.Group+move)
    * [.containsPoint(x, y)](#module_core/Group.Group+containsPoint) ⇒ <code>boolean</code>
    * [.draw(ctx)](#module_core/Group.Group+draw)
    * [.toJSON()](#module_core/Group.Group+toJSON) ⇒ <code>Object</code>

<a name="new_module_core/Group.Group_new"></a>

#### new exports.Group([shapes])
Creates a new Group instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [shapes] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | Array of shape objects to include in the group. |

**Example**  
```js
const group = new Group([rect1, circle1, text1]);
```
<a name="module_core/Group.Group+addShape"></a>

#### group.addShape(shape)
Adds a shape to the group.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  

| Param | Type | Description |
| --- | --- | --- |
| shape | <code>Object</code> | Shape object to add to the group. |

**Example**  
```js
group.addShape(newShape);
```
<a name="module_core/Group.Group+removeShape"></a>

#### group.removeShape(shape)
Removes a shape from the group.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  

| Param | Type | Description |
| --- | --- | --- |
| shape | <code>Object</code> | Shape object to remove from the group. |

**Example**  
```js
group.removeShape(shapeToRemove);
```
<a name="module_core/Group.Group+getBounds"></a>

#### group.getBounds() ⇒ <code>Object</code> \| <code>null</code>
Gets the bounding box that encompasses all shapes in the group.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  
**Returns**: <code>Object</code> \| <code>null</code> - Bounding box or null if group is empty.  
**Example**  
```js
const bounds = group.getBounds();if (bounds) console.log(`Group bounds: ${bounds.width}x${bounds.height}`);
```
<a name="module_core/Group.Group+move"></a>

#### group.move(dx, dy)
Moves all shapes in the group by a delta amount.Movement is prevented if the group is locked.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  

| Param | Type | Description |
| --- | --- | --- |
| dx | <code>number</code> | Change in x position. |
| dy | <code>number</code> | Change in y position. |

**Example**  
```js
group.move(10, 20); // Moves all shapes 10px right, 20px down
```
<a name="module_core/Group.Group+containsPoint"></a>

#### group.containsPoint(x, y) ⇒ <code>boolean</code>
Checks if a point is inside any shape in the group.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  
**Returns**: <code>boolean</code> - True if point is inside any shape in the group.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate of the point to test. |
| y | <code>number</code> | Y-coordinate of the point to test. |

**Example**  
```js
if (group.containsPoint(50, 30)) {  console.log('Point is inside group');}
```
<a name="module_core/Group.Group+draw"></a>

#### group.draw(ctx)
Draws all shapes in the group on the canvas.Optionally draws a group outline if `showOutline` is enabled.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | Canvas rendering context. |

**Example**  
```js
group.draw(ctx);
```
<a name="module_core/Group.Group+toJSON"></a>

#### group.toJSON() ⇒ <code>Object</code>
Serializes the group to a JSON-compatible object for saving.Stores shape IDs instead of shape references for proper serialization.

**Kind**: instance method of [<code>Group</code>](#module_core/Group.Group)  
**Returns**: <code>Object</code> - JSON representation of the group.  
**Example**  
```js
const json = group.toJSON();// json.shapes contains array of shape IDs
```

