# Color

_Source: `js/utils/Color.js`_

<a name="module_utils/Color"></a>

## utils/Color
Small colour helpers shared by the canvas renderer and the SVG exporter.


* [utils/Color](#module_utils/Color)
    * [.FALLBACK_PALETTE](#module_utils/Color.FALLBACK_PALETTE)
    * [.parseHex(hex)](#module_utils/Color.parseHex) ⇒ <code>Object</code> \| <code>null</code>
    * [.luminance(color)](#module_utils/Color.luminance) ⇒ <code>number</code>
    * [.contrastColor(background)](#module_utils/Color.contrastColor) ⇒ <code>string</code>
    * [.paletteColorFor(key)](#module_utils/Color.paletteColorFor) ⇒ <code>string</code>

<a name="module_utils/Color.FALLBACK_PALETTE"></a>

### utils/Color.FALLBACK\_PALETTE
Distinct fallback palette used for connection types that have no explicit colour.

**Kind**: static constant of [<code>utils/Color</code>](#module_utils/Color)  
<a name="module_utils/Color.parseHex"></a>

### utils/Color.parseHex(hex) ⇒ <code>Object</code> \| <code>null</code>
Parses a `#rgb` / `#rrggbb` hex colour into components.

**Kind**: static method of [<code>utils/Color</code>](#module_utils/Color)  

| Param | Type |
| --- | --- |
| hex | <code>string</code> | 

<a name="module_utils/Color.luminance"></a>

### utils/Color.luminance(color) ⇒ <code>number</code>
Relative luminance (0..1) of a hex colour. Non-hex input (rgba(), names) is treated as mid-grey.

**Kind**: static method of [<code>utils/Color</code>](#module_utils/Color)  

| Param | Type |
| --- | --- |
| color | <code>string</code> | 

<a name="module_utils/Color.contrastColor"></a>

### utils/Color.contrastColor(background) ⇒ <code>string</code>
Returns black or white, whichever is more legible on top of `background`.

**Kind**: static method of [<code>utils/Color</code>](#module_utils/Color)  

| Param | Type |
| --- | --- |
| background | <code>string</code> | 

<a name="module_utils/Color.paletteColorFor"></a>

### utils/Color.paletteColorFor(key) ⇒ <code>string</code>
Deterministically picks a palette colour for an arbitrary string key.

**Kind**: static method of [<code>utils/Color</code>](#module_utils/Color)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 


