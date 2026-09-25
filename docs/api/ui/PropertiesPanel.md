# PropertiesPanel

_Source: `js/ui/PropertiesPanel.js`_

<a name="module_ui/PropertiesPanel"></a>

## ui/PropertiesPanel
Right-hand panel. Shows a diagram overview (stats, validation issues, quick actions) when
nothing is selected, the editable properties of a single object, or the shared properties of a
multi-selection, plus an "Arrange" section (layers, grouping, alignment, distribution).

The panel talks to the editor through a small set of app methods (`saveState`, `render`,
`align`, `revealObjects`, ...), so it can be replaced or tested independently.


* [ui/PropertiesPanel](#module_ui/PropertiesPanel)
    * [.PropertiesPanel](#module_ui/PropertiesPanel.PropertiesPanel)
        * [new exports.PropertiesPanel(app)](#new_module_ui/PropertiesPanel.PropertiesPanel_new)
        * [.render()](#module_ui/PropertiesPanel.PropertiesPanel+render)

<a name="module_ui/PropertiesPanel.PropertiesPanel"></a>

### ui/PropertiesPanel.PropertiesPanel
**Kind**: static class of [<code>ui/PropertiesPanel</code>](#module_ui/PropertiesPanel)  

* [.PropertiesPanel](#module_ui/PropertiesPanel.PropertiesPanel)
    * [new exports.PropertiesPanel(app)](#new_module_ui/PropertiesPanel.PropertiesPanel_new)
    * [.render()](#module_ui/PropertiesPanel.PropertiesPanel+render)

<a name="new_module_ui/PropertiesPanel.PropertiesPanel_new"></a>

#### new exports.PropertiesPanel(app)

| Param | Type | Description |
| --- | --- | --- |
| app | <code>Object</code> | The editor (CanvasApp). |

<a name="module_ui/PropertiesPanel.PropertiesPanel+render"></a>

#### propertiesPanel.render()
Re-renders for the current selection.

**Kind**: instance method of [<code>PropertiesPanel</code>](#module_ui/PropertiesPanel.PropertiesPanel)  

