# LiveSync

_Source: `js/ui/LiveSync.js`_

<a name="module_ui/LiveSync"></a>

## ui/LiveSync
Keeps the editor in sync with the MCP server / HTTP bridge when the app is served by it
(`node mcp/http-bridge.js` or the MCP server's live view). Detection is automatic: when
`/api/status` answers, the editor loads the server's diagram, follows `change` events over SSE and
pushes its own edits back with `PUT /api/diagram`.

On static hosting (GitHub Pages, file://) detection fails silently and the editor works as usual.

**Example**  
```js
const sync = new LiveSync({
    getDocument: () => app.buildDocument(),
    applyDocument: doc => app.loadDocument(doc, { resetView: false }),
    onStatus: status => console.log(status)
});
if (await LiveSync.detect()) sync.start();
```

* [ui/LiveSync](#module_ui/LiveSync)
    * [.LiveSync](#module_ui/LiveSync.LiveSync)
        * [new exports.LiveSync(options)](#new_module_ui/LiveSync.LiveSync_new)
        * _instance_
            * [.clientId](#module_ui/LiveSync.LiveSync+clientId) : <code>string</code>
            * [.start()](#module_ui/LiveSync.LiveSync+start) ⇒ <code>Promise.&lt;void&gt;</code>
            * [.pull()](#module_ui/LiveSync.LiveSync+pull) ⇒ <code>Promise.&lt;void&gt;</code>
            * [.push()](#module_ui/LiveSync.LiveSync+push)
            * [.flush()](#module_ui/LiveSync.LiveSync+flush) ⇒ <code>Promise.&lt;void&gt;</code>
            * [.stop()](#module_ui/LiveSync.LiveSync+stop)
        * _static_
            * [.detect()](#module_ui/LiveSync.LiveSync.detect) ⇒ <code>Promise.&lt;boolean&gt;</code>

<a name="module_ui/LiveSync.LiveSync"></a>

### ui/LiveSync.LiveSync
**Kind**: static class of [<code>ui/LiveSync</code>](#module_ui/LiveSync)  

* [.LiveSync](#module_ui/LiveSync.LiveSync)
    * [new exports.LiveSync(options)](#new_module_ui/LiveSync.LiveSync_new)
    * _instance_
        * [.clientId](#module_ui/LiveSync.LiveSync+clientId) : <code>string</code>
        * [.start()](#module_ui/LiveSync.LiveSync+start) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.pull()](#module_ui/LiveSync.LiveSync+pull) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.push()](#module_ui/LiveSync.LiveSync+push)
        * [.flush()](#module_ui/LiveSync.LiveSync+flush) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.stop()](#module_ui/LiveSync.LiveSync+stop)
    * _static_
        * [.detect()](#module_ui/LiveSync.LiveSync.detect) ⇒ <code>Promise.&lt;boolean&gt;</code>

<a name="new_module_ui/LiveSync.LiveSync_new"></a>

#### new exports.LiveSync(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.getDocument | <code>function</code> |  | Returns the editor's current document. |
| options.applyDocument | <code>function</code> |  | Replaces the editor's content with a document. |
| [options.onStatus] | <code>function</code> |  | Status callback: `connected`, `syncing`, `pushed`, `disconnected`, `error`. |
| [options.debounceMs] | <code>number</code> | <code>400</code> | Delay before pushing local edits. |

<a name="module_ui/LiveSync.LiveSync+clientId"></a>

#### liveSync.clientId : <code>string</code>
Identifies this browser tab so its own pushes are not re-applied

**Kind**: instance property of [<code>LiveSync</code>](#module_ui/LiveSync.LiveSync)  
<a name="module_ui/LiveSync.LiveSync+start"></a>

#### liveSync.start() ⇒ <code>Promise.&lt;void&gt;</code>
Loads the server's diagram and starts following changes.

**Kind**: instance method of [<code>LiveSync</code>](#module_ui/LiveSync.LiveSync)  
<a name="module_ui/LiveSync.LiveSync+pull"></a>

#### liveSync.pull() ⇒ <code>Promise.&lt;void&gt;</code>
Fetches the server document and applies it.

**Kind**: instance method of [<code>LiveSync</code>](#module_ui/LiveSync.LiveSync)  
<a name="module_ui/LiveSync.LiveSync+push"></a>

#### liveSync.push()
Schedules a push of the local document (debounced).

**Kind**: instance method of [<code>LiveSync</code>](#module_ui/LiveSync.LiveSync)  
<a name="module_ui/LiveSync.LiveSync+flush"></a>

#### liveSync.flush() ⇒ <code>Promise.&lt;void&gt;</code>
Pushes immediately.

**Kind**: instance method of [<code>LiveSync</code>](#module_ui/LiveSync.LiveSync)  
<a name="module_ui/LiveSync.LiveSync+stop"></a>

#### liveSync.stop()
Stops following the server.

**Kind**: instance method of [<code>LiveSync</code>](#module_ui/LiveSync.LiveSync)  
<a name="module_ui/LiveSync.LiveSync.detect"></a>

#### LiveSync.detect() ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks whether the page is served by the bridge.

**Kind**: static method of [<code>LiveSync</code>](#module_ui/LiveSync.LiveSync)  

