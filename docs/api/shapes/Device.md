# Device

_Source: `js/shapes/Device.js`_

<a name="module_shapes/Device"></a>

## shapes/Device
Generic hardware device with a fully configurable port map. This is the workhorse for
modelling equipment that has no dedicated shape (media servers, converters, consoles, PLCs, ...).

**See**: module:core/SystemObject  
**Example**  
```js
const enc = new Device(100, 100, 140, 90);
enc.label = 'Encoder 1';
enc.setPorts({ sdi: { input: 2, output: 0 }, network: { input: 0, output: 1 } });
```

* [shapes/Device](#module_shapes/Device)
    * [.Device](#module_shapes/Device.Device)
        * [new exports.Device(x, y, width, height, [options])](#new_module_shapes/Device.Device_new)
        * _instance_
            * [.cornerRadius](#module_shapes/Device.Device+cornerRadius) : <code>number</code>
            * [.drawBody(ctx)](#module_shapes/Device.Device+drawBody)
            * [.toJSON()](#module_shapes/Device.Device+toJSON) ⇒ <code>Object</code>
        * _static_
            * [.defaultPorts()](#module_shapes/Device.Device.defaultPorts) ⇒ <code>PortConfig</code>

<a name="module_shapes/Device.Device"></a>

### shapes/Device.Device
**Kind**: static class of [<code>shapes/Device</code>](#module_shapes/Device)  

* [.Device](#module_shapes/Device.Device)
    * [new exports.Device(x, y, width, height, [options])](#new_module_shapes/Device.Device_new)
    * _instance_
        * [.cornerRadius](#module_shapes/Device.Device+cornerRadius) : <code>number</code>
        * [.drawBody(ctx)](#module_shapes/Device.Device+drawBody)
        * [.toJSON()](#module_shapes/Device.Device+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.defaultPorts()](#module_shapes/Device.Device.defaultPorts) ⇒ <code>PortConfig</code>

<a name="new_module_shapes/Device.Device_new"></a>

#### new exports.Device(x, y, width, height, [options])

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 
| [options] | <code>Object</code> | 
| [options.ports] | <code>PortConfig</code> | 

<a name="module_shapes/Device.Device+cornerRadius"></a>

#### device.cornerRadius : <code>number</code>
Corner radius of the body

**Kind**: instance property of [<code>Device</code>](#module_shapes/Device.Device)  
<a name="module_shapes/Device.Device+drawBody"></a>

#### device.drawBody(ctx)
**Kind**: instance method of [<code>Device</code>](#module_shapes/Device.Device)  

| Param | Type |
| --- | --- |
| ctx | <code>CanvasRenderingContext2D</code> | 

<a name="module_shapes/Device.Device+toJSON"></a>

#### device.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>Device</code>](#module_shapes/Device.Device)  
<a name="module_shapes/Device.Device.defaultPorts"></a>

#### Device.defaultPorts() ⇒ <code>PortConfig</code>
Default port map for a freshly created device.

**Kind**: static method of [<code>Device</code>](#module_shapes/Device.Device)  

