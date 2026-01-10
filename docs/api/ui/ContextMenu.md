# ContextMenu

_Source: `js/ui/ContextMenu.js`_

<a name="module_ui/ContextMenu"></a>

## ui/ContextMenu
UI module for `ContextMenu`.

**See**: module:main  
**Example**  
```js
import { ContextMenu } from './ui/ContextMenu.js';
```

* [ui/ContextMenu](#module_ui/ContextMenu)
    * [.ContextMenu](#module_ui/ContextMenu.ContextMenu)
        * [new exports.ContextMenu(canvas)](#new_module_ui/ContextMenu.ContextMenu_new)
        * [.createMenu()](#module_ui/ContextMenu.ContextMenu+createMenu)
        * [.setupEventListeners()](#module_ui/ContextMenu.ContextMenu+setupEventListeners)
        * [.show(x, y, object, options)](#module_ui/ContextMenu.ContextMenu+show)
        * [.getMenuItems(object, options)](#module_ui/ContextMenu.ContextMenu+getMenuItems) ⇒ <code>\*</code>
        * [.hide()](#module_ui/ContextMenu.ContextMenu+hide)
        * [.destroy()](#module_ui/ContextMenu.ContextMenu+destroy)

<a name="module_ui/ContextMenu.ContextMenu"></a>

### ui/ContextMenu.ContextMenu
**Kind**: static class of [<code>ui/ContextMenu</code>](#module_ui/ContextMenu)  

* [.ContextMenu](#module_ui/ContextMenu.ContextMenu)
    * [new exports.ContextMenu(canvas)](#new_module_ui/ContextMenu.ContextMenu_new)
    * [.createMenu()](#module_ui/ContextMenu.ContextMenu+createMenu)
    * [.setupEventListeners()](#module_ui/ContextMenu.ContextMenu+setupEventListeners)
    * [.show(x, y, object, options)](#module_ui/ContextMenu.ContextMenu+show)
    * [.getMenuItems(object, options)](#module_ui/ContextMenu.ContextMenu+getMenuItems) ⇒ <code>\*</code>
    * [.hide()](#module_ui/ContextMenu.ContextMenu+hide)
    * [.destroy()](#module_ui/ContextMenu.ContextMenu+destroy)

<a name="new_module_ui/ContextMenu.ContextMenu_new"></a>

#### new exports.ContextMenu(canvas)
Creates a new `ContextMenu` instance.


| Param | Type | Description |
| --- | --- | --- |
| canvas | <code>HTMLCanvasElement</code> | canvas value. |

<a name="module_ui/ContextMenu.ContextMenu+createMenu"></a>

#### contextMenu.createMenu()
Performs `createMenu`.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
<a name="module_ui/ContextMenu.ContextMenu+setupEventListeners"></a>

#### contextMenu.setupEventListeners()
Sets the `upEventListeners` value.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
<a name="module_ui/ContextMenu.ContextMenu+show"></a>

#### contextMenu.show(x, y, object, options)
Performs `show`.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X position in canvas coordinates. |
| y | <code>number</code> | Y position in canvas coordinates. |
| object | <code>\*</code> | object value. |
| options | <code>Object</code> | options value. |

<a name="module_ui/ContextMenu.ContextMenu+getMenuItems"></a>

#### contextMenu.getMenuItems(object, options) ⇒ <code>\*</code>
Returns the `MenuItems` value.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
**Returns**: <code>\*</code> - Result value.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>\*</code> | object value. |
| options | <code>Object</code> | options value. |

<a name="module_ui/ContextMenu.ContextMenu+hide"></a>

#### contextMenu.hide()
Performs `hide`.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  
<a name="module_ui/ContextMenu.ContextMenu+destroy"></a>

#### contextMenu.destroy()
Performs `destroy`.

**Kind**: instance method of [<code>ContextMenu</code>](#module_ui/ContextMenu.ContextMenu)  

