# Tooltip

_Source: `js/ui/Tooltip.js`_

<a name="module_ui/Tooltip"></a>

## ui/Tooltip
Lightweight tooltip layer for elements with a `data-tip` attribute. A single floating
element is positioned next to the hovered (or keyboard-focused) control, so tooltips are never clipped
by scrolling containers such as the tool palette.

Attributes:
- `data-tip`       title text; a trailing "(Ctrl+Z)" is shown as a shortcut chip automatically
- `data-tip-key`   explicit shortcut chip
- `data-tip-desc`  optional second line with a longer description
- `data-tip-side`  `top` | `bottom` | `left` | `right`; may also be set on an ancestor (e.g. the palette)

**Example**  
```js
installTooltips();
// <button data-tip="Connector" data-tip-key="L" data-tip-desc="Drag from a port to a compatible port">
```
<a name="module_ui/Tooltip.installTooltips"></a>

### ui/Tooltip.installTooltips([options]) ⇒ <code>Object</code>
Installs the global tooltip behaviour. Safe to call once per page.

**Kind**: static method of [<code>ui/Tooltip</code>](#module_ui/Tooltip)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.delay] | <code>number</code> | <code>350</code> | Hover delay in milliseconds. |


