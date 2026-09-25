# Dialogs

_Source: `js/ui/Dialogs.js`_

<a name="module_ui/Dialogs"></a>

## ui/Dialogs
Small UI helpers: toast notifications (optionally with an action button) and a
promise-based confirm dialog that replaces `window.confirm`.


* [ui/Dialogs](#module_ui/Dialogs)
    * [.showToast(text, [options])](#module_ui/Dialogs.showToast) ⇒ <code>function</code>
    * [.confirmDialog(message, [options])](#module_ui/Dialogs.confirmDialog) ⇒ <code>Promise.&lt;boolean&gt;</code>

<a name="module_ui/Dialogs.showToast"></a>

### ui/Dialogs.showToast(text, [options]) ⇒ <code>function</code>
Shows a transient toast.

**Kind**: static method of [<code>ui/Dialogs</code>](#module_ui/Dialogs)  
**Returns**: <code>function</code> - Dismiss function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  |  |
| [options] | <code>Object</code> |  |  |
| [options.type] | <code>&quot;info&quot;</code> \| <code>&quot;success&quot;</code> \| <code>&quot;error&quot;</code> | <code>&#x27;info&#x27;</code> |  |
| [options.timeout] | <code>number</code> | <code>4000</code> | Milliseconds before auto-dismiss (0 = sticky). |
| [options.action] | <code>Object</code> |  | Optional action button. |

<a name="module_ui/Dialogs.confirmDialog"></a>

### ui/Dialogs.confirmDialog(message, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Promise-based confirm dialog using the app's modal styling.

**Kind**: static method of [<code>ui/Dialogs</code>](#module_ui/Dialogs)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  |  |
| [options] | <code>Object</code> |  |  |
| [options.title] | <code>string</code> | <code>&quot;&#x27;Confirm&#x27;&quot;</code> |  |
| [options.okLabel] | <code>string</code> | <code>&quot;&#x27;OK&#x27;&quot;</code> |  |
| [options.cancelLabel] | <code>string</code> | <code>&quot;&#x27;Cancel&#x27;&quot;</code> |  |
| [options.danger] | <code>boolean</code> | <code>false</code> | Style the OK button as destructive. |


