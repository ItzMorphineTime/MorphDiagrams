# IconLibrary

_Source: `js/utils/IconLibrary.js`_

<a name="module_utils/IconLibrary"></a>

## utils/IconLibrary
Icon library providing pre-configured icon shapes for common diagram elements. Each icon is created from a combination of basic shapes.

**Remarks**: - Icons are created as arrays of shape objects that can be added to the canvas.- Each icon method takes x, y coordinates to position the icon.- Icons are composed of basic shapes (Rectangle, Circle, Cylinder, TextShape).  
**See**

- module:shapes/Rectangle
- module:shapes/Circle

**Example**  
```js
import { IconLibrary } from './utils/IconLibrary.js';const serverIcon = IconLibrary.createServerIcon(100, 100);objects.push(...serverIcon);
```

* [utils/IconLibrary](#module_utils/IconLibrary)
    * [.IconLibrary](#module_utils/IconLibrary.IconLibrary)
        * [.createServerIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createServerIcon) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.createDatabaseIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createDatabaseIcon) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.createUserIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createUserIcon) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.createCloudIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createCloudIcon) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.createNetworkIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createNetworkIcon) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.createProcessIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createProcessIcon) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.createDecisionIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createDecisionIcon) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.getAllIcons()](#module_utils/IconLibrary.IconLibrary.getAllIcons) ⇒ <code>Object.&lt;string, {name:string, create:Function}&gt;</code>

<a name="module_utils/IconLibrary.IconLibrary"></a>

### utils/IconLibrary.IconLibrary
Provides static methods for creating pre-configured icon shapes.

**Kind**: static class of [<code>utils/IconLibrary</code>](#module_utils/IconLibrary)  

* [.IconLibrary](#module_utils/IconLibrary.IconLibrary)
    * [.createServerIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createServerIcon) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.createDatabaseIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createDatabaseIcon) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.createUserIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createUserIcon) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.createCloudIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createCloudIcon) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.createNetworkIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createNetworkIcon) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.createProcessIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createProcessIcon) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.createDecisionIcon(x, y)](#module_utils/IconLibrary.IconLibrary.createDecisionIcon) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getAllIcons()](#module_utils/IconLibrary.IconLibrary.getAllIcons) ⇒ <code>Object.&lt;string, {name:string, create:Function}&gt;</code>

<a name="module_utils/IconLibrary.IconLibrary.createServerIcon"></a>

#### IconLibrary.createServerIcon(x, y) ⇒ <code>Array.&lt;Object&gt;</code>
Creates a server icon composed of a cylinder body and status lights.

**Kind**: static method of [<code>IconLibrary</code>](#module_utils/IconLibrary.IconLibrary)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of shape objects representing the server icon.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate for icon position. |
| y | <code>number</code> | Y-coordinate for icon position. |

**Example**  
```js
const serverIcon = IconLibrary.createServerIcon(100, 100);objects.push(...serverIcon);
```
<a name="module_utils/IconLibrary.IconLibrary.createDatabaseIcon"></a>

#### IconLibrary.createDatabaseIcon(x, y) ⇒ <code>Array.&lt;Object&gt;</code>
Creates a database icon composed of a cylinder with 'DB' label.

**Kind**: static method of [<code>IconLibrary</code>](#module_utils/IconLibrary.IconLibrary)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of shape objects representing the database icon.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate for icon position. |
| y | <code>number</code> | Y-coordinate for icon position. |

<a name="module_utils/IconLibrary.IconLibrary.createUserIcon"></a>

#### IconLibrary.createUserIcon(x, y) ⇒ <code>Array.&lt;Object&gt;</code>
Creates a user icon composed of two circles (head and body).

**Kind**: static method of [<code>IconLibrary</code>](#module_utils/IconLibrary.IconLibrary)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of shape objects representing the user icon.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate for icon position. |
| y | <code>number</code> | Y-coordinate for icon position. |

<a name="module_utils/IconLibrary.IconLibrary.createCloudIcon"></a>

#### IconLibrary.createCloudIcon(x, y) ⇒ <code>Array.&lt;Object&gt;</code>
Creates a cloud icon composed of overlapping circles.

**Kind**: static method of [<code>IconLibrary</code>](#module_utils/IconLibrary.IconLibrary)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of shape objects representing the cloud icon.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate for icon position. |
| y | <code>number</code> | Y-coordinate for icon position. |

<a name="module_utils/IconLibrary.IconLibrary.createNetworkIcon"></a>

#### IconLibrary.createNetworkIcon(x, y) ⇒ <code>Array.&lt;Object&gt;</code>
Creates a network icon composed of connected nodes (circles).

**Kind**: static method of [<code>IconLibrary</code>](#module_utils/IconLibrary.IconLibrary)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of shape objects representing the network icon.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate for icon position. |
| y | <code>number</code> | Y-coordinate for icon position. |

<a name="module_utils/IconLibrary.IconLibrary.createProcessIcon"></a>

#### IconLibrary.createProcessIcon(x, y) ⇒ <code>Array.&lt;Object&gt;</code>
Creates a process icon composed of a rounded rectangle with 'Process' label.

**Kind**: static method of [<code>IconLibrary</code>](#module_utils/IconLibrary.IconLibrary)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of shape objects representing the process icon.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate for icon position. |
| y | <code>number</code> | Y-coordinate for icon position. |

<a name="module_utils/IconLibrary.IconLibrary.createDecisionIcon"></a>

#### IconLibrary.createDecisionIcon(x, y) ⇒ <code>Array.&lt;Object&gt;</code>
Creates a decision icon composed of a diamond with '?' label.

**Kind**: static method of [<code>IconLibrary</code>](#module_utils/IconLibrary.IconLibrary)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of shape objects representing the decision icon.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X-coordinate for icon position. |
| y | <code>number</code> | Y-coordinate for icon position. |

<a name="module_utils/IconLibrary.IconLibrary.getAllIcons"></a>

#### IconLibrary.getAllIcons() ⇒ <code>Object.&lt;string, {name:string, create:Function}&gt;</code>
Gets all available icons as a dictionary mapping icon keys to icon metadata.

**Kind**: static method of [<code>IconLibrary</code>](#module_utils/IconLibrary.IconLibrary)  
**Returns**: <code>Object.&lt;string, {name:string, create:Function}&gt;</code> - Dictionary of all icons with their names and create functions.  
**Example**  
```js
const icons = IconLibrary.getAllIcons();const serverIcon = icons.server.create(100, 100);
```

