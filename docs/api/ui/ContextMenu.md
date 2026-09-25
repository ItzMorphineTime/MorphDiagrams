# ContextMenu

_Source: `js/ui/ContextMenu.js`_

<a name="module_ui/ContextMenu"></a>

## ui/ContextMenu
Right-click menu. The caller supplies the items, so the same component serves shapes,
connectors, waypoints and the empty canvas.

**Example**  
```js
menu.show(e.clientX, e.clientY, [
    { label: 'Copy', shortcut: 'Ctrl+C', action: () => app.copy() },
    { separator: true },
    { label: 'Delete', shortcut: 'Del', danger: true, action: () => app.deleteSelected() }
]);
```

* [ui/ContextMenu](#module_ui/ContextMenu)
    * _static_
        * [.ContextMenu](#module_ui/ContextMenu.ContextMenu)
            * [new exports.ContextMenu(canvas)](#new_module_ui/ContextMenu.ContextMenu_new)
            * [.show(x, y, items)](#module_ui/ContextMenu.ContextMenu+show)
    * _inner_
        * [~MenuItem](#module_ui/ContextMenu..MenuItem) : <code>Object</code>

<a name="module_ui/ContextMenu.ContextMenu"></a>

### ui/ContextMenu.ContextMenu
**Kind**: static class of [<code>ui/ContextMenu</code>](#module_ui/ContextMenu)  

* [.ContextMenu](#module_ui/ContextMenu.ContextMenu)
    * [new exports.ContextMenu(canvas)](#new_module_ui/ContextMenu.ContextMenu_new)
    * [.show(x, y, items)](#module_ui/ContextMenu.ContextMenu+show)

<a name="new_module_ui/ContextMenu.ContextMenu_new"></a>

#### new exports.ContextMenu(canvas)

| Param | Type | Description |
| --- | --- | --- |
| canvas | <code>HTMLElement</code> | Element whose native context menu is replaced. |

<a name="module_ui/ContextMenu.ContextMenu+show"></a>

#### contextMenu.show(x, y, items)
Shows the menu at a screen position.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| items | <code>Array.&lt;MenuItem&gt;</code> | 

<a name="module_ui/ContextMenu..MenuItem"></a>

### ui/ContextMenu~MenuItem : <code>Object</code>
**Kind**: inner typedef of [<code>ui/ContextMenu</code>](#module_ui/ContextMenu)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [label] | <code>string</code> |  |
| [shortcut] | <code>string</code> |  |
| [icon] | <code>string</code> | Id of an SVG symbol in the page's icon sprite (without `#`). |
| [action] | <code>function</code> |  |
| [disabled] | <code>boolean</code> |  |
| [danger] | <code>boolean</code> | Render in the danger colour. |
| [checked] | <code>boolean</code> | Render a check mark (toggle items). |
| [separator] | <code>boolean</code> | Render a separator instead of an item. |


