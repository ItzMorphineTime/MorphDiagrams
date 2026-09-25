# SvgExporter

_Source: `js/core/SvgExporter.js`_

<a name="module_core/SvgExporter"></a>

## core/SvgExporter
Renders a set of shapes and connectors to a standalone SVG document. Runs headless
(no canvas needed), so the MCP server can produce previews and the editor can export true vector files.

The exporter mirrors each shape's canvas rendering; geometry helpers (`getPoints`, `getLabelLayout`,
`getPathPoints`) are shared with the canvas code so both outputs stay aligned.

**See**: module:core/Diagram  
**Example**  
```js
import { diagramToSvg } from './core/SvgExporter.js';
const svg = diagramToSvg(diagram.objects, { showPortLabels: true });
```

* [core/SvgExporter](#module_core/SvgExporter)
    * [.escapeXml(value)](#module_core/SvgExporter.escapeXml) ⇒ <code>string</code>
    * [.diagramToSvg(objects, [options])](#module_core/SvgExporter.diagramToSvg) ⇒ <code>string</code>

<a name="module_core/SvgExporter.escapeXml"></a>

### core/SvgExporter.escapeXml(value) ⇒ <code>string</code>
Escapes text for use inside SVG/XML.

**Kind**: static method of [<code>core/SvgExporter</code>](#module_core/SvgExporter)  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 

<a name="module_core/SvgExporter.diagramToSvg"></a>

### core/SvgExporter.diagramToSvg(objects, [options]) ⇒ <code>string</code>
Renders objects to an SVG document string.

**Kind**: static method of [<code>core/SvgExporter</code>](#module_core/SvgExporter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| objects | <code>Array</code> |  | Shapes and connectors (as held by a [module:core/Diagram~Diagram](module:core/Diagram~Diagram)). |
| [options] | <code>Object</code> |  |  |
| [options.padding] | <code>number</code> | <code>40</code> | Margin around the content. |
| [options.background] | <code>string</code> \| <code>null</code> | <code>&quot;&#x27;#ffffff&#x27;&quot;</code> | Background colour, or null for transparent. |
| [options.showPorts] | <code>boolean</code> | <code>true</code> | Draw port dots on system objects. |
| [options.showPortLabels] | <code>boolean</code> | <code>false</code> | Draw port names next to the dots. |
| [options.showGenericAnchors] | <code>boolean</code> | <code>false</code> | Draw the side anchors of basic shapes. |
| [options.bounds] | <code>Object</code> |  | Explicit view box (defaults to content bounds). |


