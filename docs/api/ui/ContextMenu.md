# ContextMenu

_Source: `js/ui/ContextMenu.js`_

<a name="module_ui/ContextMenu"></a>

## ui/ContextMenu
Context menu handler for canvas right-click interactions. Provides context-sensitive menu items based on the clicked object or canvas area.

**Remarks**: - Menu items are dynamically generated based on the target object type.- Supports both object-specific menus (for shapes/connectors) and canvas menus (for empty areas).- Menu positioning automatically adjusts to prevent going off-screen.- Menu items can be disabled based on context (e.g., paste disabled when clipboard is empty).  
**See**: module:main  
**Example**  
```js
const contextMenu = new ContextMenu(canvas);contextMenu.show(event.clientX, event.clientY, clickedObject, {  onCopy: () => app.copy(),  onDelete: () => app.deleteSelected()});
```

* [ui/ContextMenu](#module_ui/ContextMenu)
    * [.ContextMenu](#module_ui/ContextMenu.ContextMenu)
        * [new exports.ContextMenu(canvas)](#new_module_ui/ContextMenu.ContextMenu_new)
        * [.canvas](#module_ui/ContextMenu.ContextMenu+canvas) : <code>HTMLCanvasElement</code>
        * [.menu](#module_ui/ContextMenu.ContextMenu+menu) : <code>HTMLElement</code> \| <code>null</code>
        * [.visible](#module_ui/ContextMenu.ContextMenu+visible) : <code>boolean</code>
        * [.targetObject](#module_ui/ContextMenu.ContextMenu+targetObject) : <code>Object</code> \| <code>null</code>
        * [.show(x, y, object, [options])](#module_ui/ContextMenu.ContextMenu+show)
        * [.hide()](#module_ui/ContextMenu.ContextMenu+hide)
        * [.destroy()](#module_ui/ContextMenu.ContextMenu+destroy)

<a name="module_ui/ContextMenu.ContextMenu"></a>

### ui/ContextMenu.ContextMenu
Context menu handler for canvas interactions.

**Kind**: static class of [<code>ui/ContextMenu</code>](#module_ui/ContextMenu)  

* [.ContextMenu](#module_ui/ContextMenu.ContextMenu)
    * [new exports.ContextMenu(canvas)](#new_module_ui/ContextMenu.ContextMenu_new)
    * [.canvas](#module_ui/ContextMenu.ContextMenu+canvas) : <code>HTMLCanvasElement</code>
    * [.menu](#module_ui/ContextMenu.ContextMenu+menu) : <code>HTMLElement</code> \| <code>null</code>
    * [.visible](#module_ui/ContextMenu.ContextMenu+visible) : <code>boolean</code>
    * [.targetObject](#module_ui/ContextMenu.ContextMenu+targetObject) : <code>Object</code> \| <code>null</code>
    * [.show(x, y, object, [options])](#module_ui/ContextMenu.ContextMenu+show)
    * [.hide()](#module_ui/ContextMenu.ContextMenu+hide)
    * [.destroy()](#module_ui/ContextMenu.ContextMenu+destroy)

<a name="new_module_ui/ContextMenu.ContextMenu_new"></a>

#### new exports.ContextMenu(canvas)
Creates a new ContextMenu instance.


| Param | Type | Description |
| --- | --- | --- |
| canvas | <code>HTMLCanvasElement</code> | Canvas element to attach the context menu to. |

**Example**  
```js
const contextMenu = new ContextMenu(document.getElementById('canvas'));
```
<a name="module_ui/ContextMenu.ContextMenu+canvas"></a>

#### contextMenu.canvas : <code>HTMLCanvasElement</code>
Canvas element.

**Kind**: instance property of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
<a name="module_ui/ContextMenu.ContextMenu+menu"></a>

#### contextMenu.menu : <code>HTMLElement</code> \| <code>null</code>
Menu DOM element.

**Kind**: instance property of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
<a name="module_ui/ContextMenu.ContextMenu+visible"></a>

#### contextMenu.visible : <code>boolean</code>
Whether the menu is currently visible.

**Kind**: instance property of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
<a name="module_ui/ContextMenu.ContextMenu+targetObject"></a>

#### contextMenu.targetObject : <code>Object</code> \| <code>null</code>
Currently targeted object (if any).

**Kind**: instance property of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
<a name="module_ui/ContextMenu.ContextMenu+show"></a>

#### contextMenu.show(x, y, object, [options])
Shows the context menu at the specified screen coordinates.Menu items are dynamically generated based on the object type. Menu positionis automatically adjusted to prevent going off-screen.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> |  | Screen X-coordinate for menu position. |
| y | <code>number</code> |  | Screen Y-coordinate for menu position. |
| object | <code>Object</code> \| <code>null</code> |  | Target object (shape or connector) or null for canvas menu. |
| [options] | <code>Object</code> | <code>{}</code> | Menu action callbacks. |
| [options.onCopy] | <code>function</code> |  | Copy action callback. |
| [options.onCut] | <code>function</code> |  | Cut action callback. |
| [options.onPaste] | <code>function</code> |  | Paste action callback. |
| [options.onDuplicate] | <code>function</code> |  | Duplicate action callback. |
| [options.onDelete] | <code>function</code> |  | Delete action callback. |
| [options.onBringToFront] | <code>function</code> |  | Bring to front action callback. |
| [options.onBringForward] | <code>function</code> |  | Bring forward action callback. |
| [options.onSendBackward] | <code>function</code> |  | Send backward action callback. |
| [options.onSendToBack] | <code>function</code> |  | Send to back action callback. |
| [options.onToggleLock] | <code>function</code> |  | Toggle lock action callback. |
| [options.onSelectAll] | <code>function</code> |  | Select all action callback. |
| [options.onAddImage] | <code>function</code> |  | Add image action callback. |
| [options.onInsertIcon] | <code>function</code> |  | Insert icon action callback. |
| [options.onInsertTemplate] | <code>function</code> |  | Insert template action callback. |
| [options.onChangeConnectorStyle] | <code>function</code> |  | Change connector style action callback. |
| [options.onToggleArrows] | <code>function</code> |  | Toggle arrows action callback. |
| [options.hasClipboard] | <code>boolean</code> | <code>false</code> | Whether clipboard has content (for enabling paste). |

**Example**  
```js
contextMenu.show(100, 200, selectedObject, {  onCopy: () => app.copy(),  onDelete: () => app.deleteSelected(),  hasClipboard: app.clipboard.length > 0});
```
<a name="module_ui/ContextMenu.ContextMenu+hide"></a>

#### contextMenu.hide()
Hides the context menu and clears the target object.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
**Example**  
```js
contextMenu.hide();
```
<a name="module_ui/ContextMenu.ContextMenu+destroy"></a>

#### contextMenu.destroy()
Destroys the context menu by removing it from the DOM.Should be called when the context menu is no longer needed.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
**Example**  
```js
contextMenu.destroy();
```

