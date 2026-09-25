# Dom

_Source: `js/utils/Dom.js`_

<a name="module_utils/Dom"></a>

## utils/Dom
Tiny DOM/browser helpers shared by the editor modules.


* [utils/Dom](#module_utils/Dom)
    * [.escapeHtml(value)](#module_utils/Dom.escapeHtml) ⇒ <code>string</code>
    * [.newId(prefix)](#module_utils/Dom.newId) ⇒ <code>string</code>
    * [.downloadBlob(blob, filename)](#module_utils/Dom.downloadBlob)
    * [.icon(id)](#module_utils/Dom.icon) ⇒ <code>string</code>
    * [.debounce(fn, ms)](#module_utils/Dom.debounce) ⇒ <code>function</code>

<a name="module_utils/Dom.escapeHtml"></a>

### utils/Dom.escapeHtml(value) ⇒ <code>string</code>
Escapes text for safe interpolation into innerHTML.

**Kind**: static method of [<code>utils/Dom</code>](#module_utils/Dom)  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 

<a name="module_utils/Dom.newId"></a>

### utils/Dom.newId(prefix) ⇒ <code>string</code>
Generates an id with the given prefix.

**Kind**: static method of [<code>utils/Dom</code>](#module_utils/Dom)  

| Param | Type |
| --- | --- |
| prefix | <code>string</code> | 

<a name="module_utils/Dom.downloadBlob"></a>

### utils/Dom.downloadBlob(blob, filename)
Triggers a file download for a blob.

**Kind**: static method of [<code>utils/Dom</code>](#module_utils/Dom)  

| Param | Type |
| --- | --- |
| blob | <code>Blob</code> | 
| filename | <code>string</code> | 

<a name="module_utils/Dom.icon"></a>

### utils/Dom.icon(id) ⇒ <code>string</code>
Inline SVG icon markup referencing the page's icon sprite.

**Kind**: static method of [<code>utils/Dom</code>](#module_utils/Dom)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Symbol id without `#`. |

<a name="module_utils/Dom.debounce"></a>

### utils/Dom.debounce(fn, ms) ⇒ <code>function</code>
Debounces a function.

**Kind**: static method of [<code>utils/Dom</code>](#module_utils/Dom)  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 
| ms | <code>number</code> | 


