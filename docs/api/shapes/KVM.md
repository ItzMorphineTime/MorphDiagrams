# KVM

_Source: `js/shapes/KVM.js`_

<a name="module_shapes/KVM"></a>

## shapes/KVM
KVM switch / extender: video and USB from several computers in, one console (video + USB)
out, optional network for IP KVM. Renders as a box with a keyboard-and-screen glyph.

**See**: module:core/SystemObject  

* [shapes/KVM](#module_shapes/KVM)
    * [.KVM](#module_shapes/KVM.KVM)
        * [new exports.KVM(x, y, width, height)](#new_module_shapes/KVM.KVM_new)
        * _instance_
            * [.drawIcon(ctx)](#module_shapes/KVM.KVM+drawIcon)
        * _static_
            * [.defaultPorts()](#module_shapes/KVM.KVM.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/KVM.KVM"></a>

### shapes/KVM.KVM
**Kind**: static class of [<code>shapes/KVM</code>](#module_shapes/KVM)  

* [.KVM](#module_shapes/KVM.KVM)
    * [new exports.KVM(x, y, width, height)](#new_module_shapes/KVM.KVM_new)
    * _instance_
        * [.drawIcon(ctx)](#module_shapes/KVM.KVM+drawIcon)
    * _static_
        * [.defaultPorts()](#module_shapes/KVM.KVM.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/KVM.KVM_new"></a>

#### new exports.KVM(x, y, width, height)

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="module_shapes/KVM.KVM+drawIcon"></a>

#### kvM.drawIcon(ctx)
Draws the screen-and-keyboard glyph.

**Kind**: instance method of [<code>KVM</code>](#module_shapes/KVM.KVM)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/KVM.KVM.defaultPorts"></a>

#### KVM.defaultPorts() ⇒ <code>PortConfig</code>
**Kind**: static method of [<code>KVM</code>](#module_shapes/KVM.KVM)  

