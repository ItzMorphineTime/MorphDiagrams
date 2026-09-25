# SmartGuides

_Source: `js/core/SmartGuides.js`_

<a name="module_core/SmartGuides"></a>

## core/SmartGuides
Alignment guides for dragging: snaps a moving box to the edges and centres of the other
shapes when they are within a small distance, and returns the guide lines to draw.

**Example**  
```js
const result = computeSmartGuides(movingBounds, otherBounds, { threshold: 6 });
moving.x += result.dx; moving.y += result.dy; drawGuides(result.guides);
```

* [core/SmartGuides](#module_core/SmartGuides)
    * _static_
        * [.computeSmartGuides(moving, others, [options])](#module_core/SmartGuides.computeSmartGuides) ⇒ <code>Object</code>
    * _inner_
        * [~Guide](#module_core/SmartGuides..Guide) : <code>Object</code>

<a name="module_core/SmartGuides.computeSmartGuides"></a>

### core/SmartGuides.computeSmartGuides(moving, others, [options]) ⇒ <code>Object</code>
Computes the snap offset and guide lines for a moving box.

**Kind**: static method of [<code>core/SmartGuides</code>](#module_core/SmartGuides)  

| Param | Type | Description |
| --- | --- | --- |
| moving | <code>Object</code> | Bounds of the dragged selection at its intended position. |
| others | <code>Array.&lt;{x:number, y:number, width:number, height:number}&gt;</code> | Bounds of the static shapes. |
| [options] | <code>Object</code> | Snap distance in world units (default 6). |

<a name="module_core/SmartGuides..Guide"></a>

### core/SmartGuides~Guide : <code>Object</code>
**Kind**: inner typedef of [<code>core/SmartGuides</code>](#module_core/SmartGuides)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| axis | <code>&quot;x&quot;</code> \| <code>&quot;y&quot;</code> | `x` for a vertical guide line at `pos`, `y` for a horizontal one. |
| pos | <code>number</code> | World coordinate of the line. |
| from | <code>number</code> | Start of the line along the other axis. |
| to | <code>number</code> | End of the line along the other axis. |


