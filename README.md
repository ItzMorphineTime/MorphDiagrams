# Morph Diagrams - Professional Diagramming Tool

**Version 2.1** - System diagramming tool with typed hardware ports, intelligent connectors, vector export and an MCP server so LLM agents can build diagrams for you

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge)](https://itzmorphinetime.github.io/MorphDiagrams/)
![License](https://img.shields.io/badge/license-Apache%202.0-green?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.1-orange?style=for-the-badge)

---

## 🚀 Live Demo

**[Launch Morph Diagrams →](https://itzmorphinetime.github.io/MorphDiagrams/)**

No installation required. Works in any modern browser.

---

## ✨ Features

### 🎨 Drawing Tools

#### Basic Shapes
- **Rectangle** (R) - Rectangular shapes with optional rounded corners
- **Circle** (C) - Circles and ellipses
- **Diamond** (D) - Diamond shapes for decision nodes
- **Hexagon** (H) - Six-sided polygons
- **Parallelogram** - Skewed rectangles for processes
- **Cylinder** - Capsule/pill shapes for databases
- **Text** (T) - Text labels with customizable fonts
- **Image** - Insert images from your computer

#### System Objects (NEW!)
- **Server** - Network server with multiple port types
  - Video, SDI, Network, USB ports
  - Configurable input/output ports
  - Visual rack server design
- **Video Matrix** - Video routing matrix with 'M' indicator
  - Video and SDI connections
  - Multiple input/output ports
- **LED Processor** - LED wall processor with capsule design
  - Video and SDI inputs
  - Multiple output ports
- **Network Switch** - Network device with hexagon shape
  - Bidirectional network ports
  - 'N' shape indicator
- **Sync Generator** - Timing signal generator
  - SDI distribution
  - Hexagonal design
- **Device** - Generic hardware with a fully configurable port map
- **Monitor** - Video/SDI inputs, loop-through output, power input
- **Camera** - SDI outputs, genlock input, network control, power
- **Power Supply** - One power input feeding several power outputs (PDU)
- **LED Distro (XD)** - Data (video/fibre) and power fanned out to LED panels
- **KVM** - Video/USB from several computers in, one console out
- **Connector Anchor** - Universal connection point
  - Accepts any connection type
  - Acts as waypoint or junction

### 🔗 Smart Connector System

#### Connection Styles
- **Straight** - Direct line connections
- **Orthogonal** - Right-angle routing
- **Bezier** - Smooth curved paths with control points
- **Polyline** - Multi-segment custom paths

#### Line Styles
- **Solid** - Standard continuous lines
- **Dashed** - Dashed line patterns
- **Dotted** - Dotted line patterns

#### Typed Connections (NEW!)
- **Video** - Gold (#FFD700) connections
- **SDI** - Orange Red (#FF4500) connections
- **Network** - Dark Turquoise (#00CED1) connections
- **USB** - Medium Purple (#9370DB) connections
- **Fibre** - Magenta (#D81B60), bidirectional
- **Power** - Deep Red (#B71C1C), supply output → device input
- **Wi-Fi** - Green (#43A047), bidirectional, drawn dashed
- **Custom types** - Add your own (HDMI, Dante, DMX, ...) in Settings; they are stored in the diagram file
- **Generic** - Default for standard shapes

#### Advanced Features
- ✅ Zoom-scaled precision snapping
- ✅ Port type validation (input/output)
- ✅ Connection type matching
- ✅ Persistent connections (stay attached when moving)
- ✅ Editable waypoints and control points
- ✅ Configurable arrows (start/end/both)
- ✅ Visual anchor point feedback

### 🎯 Selection & Manipulation

#### Selection Modes
- **Single Select** - Click to select objects
- **Multi-Select** - Shift+Click to add/remove
- **Selection Box** - Drag to select area
- **Select All** (Ctrl+A) - Select everything

#### Object Operations
- **Move** - Drag to reposition
- **Resize** - Drag handles to scale
- **Rotate** - Drag rotation handle
- **Duplicate** (Ctrl+D) - Quick copy
- **Copy/Paste** (Ctrl+C/V) - Clipboard operations
- **Delete** (Del/Backspace) - Remove objects

#### Transform Tools
- **Grouping** (Ctrl+G) - Group objects together
- **Ungroup** (Ctrl+Shift+G) - Break apart groups
- **Lock/Unlock** - Prevent accidental edits
- **Show/Hide** - Toggle visibility
- **Z-Index** - Layer ordering control

### 📐 Layout & Alignment

- **Align Left/Center/Right** - Horizontal alignment
- **Align Top/Middle/Bottom** - Vertical alignment
- **Distribute Horizontally** - Even spacing
- **Distribute Vertically** - Even spacing
- **Grid Display** - Toggle visual grid (20px spacing)
- **Snap to Grid** - Automatic alignment
- **Smart Guides** - Alignment helpers

### 🎨 Visual Properties

Edit live in the Properties Panel:
- **Position** (X, Y coordinates)
- **Dimensions** (Width, Height)
- **Fill Color** (with color picker)
- **Stroke Color** (with color picker)
- **Stroke Width** (1-10px)
- **Rotation** (degrees)
- **Corner Radius** (rounded corners)
- **Shadow Effects** (optional)
- **Z-Index** (layer order)

### 📚 Templates

Pre-configured diagrams:
- **Basic Flowchart** - Start, process, decision, end nodes
- **Organizational Chart** - Hierarchical structure
- **Network Diagram** - Server and switch topology
- **System Diagram** - Complete system with typed connections
  - Server, Video Matrix, LED Processor
  - Sync Generator, Network Switch
  - 8 pre-connected signal paths
- **XL Virtual Production LED Volume** - A full stage in one click
  - 10 genlocked render servers (2 outputs each) into a 20×12 video matrix
  - 4 LED processors → 4 LED distros (XD) → 4 wall sections (data + power)
  - Core switch with 4 separated VLANs (render, tracking, control/management, media & camera)
  - 4 control machines on 2 KVMs, 10 PoE tracking cameras + tracking server, show camera with genlock
  - 2 comfort monitors, 4 PDUs; ~190 typed links, ready for tracing and filtering

### 💾 File Operations

- **Save** (Ctrl+S) - Export to JSON
- **Load** - Import from JSON
- **Export PNG** - High-quality raster image
- **Export PDF** - Vector format for printing
- **New** - Start fresh diagram
- **Auto-Save** - Periodic state preservation

### 🖱️ Context Menu

Right-click for quick actions:
- Copy, Cut, Paste, Duplicate
- Delete, Lock/Unlock
- Bring to Front / Send to Back
- Change connector style
- Toggle arrows
- Group/Ungroup

### 🔍 View Controls

#### Zoom
- **Zoom In/Out** (+/- buttons or Ctrl+Plus/Minus)
- **Mouse Wheel** - Zoom to cursor position
- **Zoom Range** - 10% to 300%
- **Zoom Display** - Current percentage in toolbar

#### Pan
- **Space+Drag** - Pan the canvas
- **Middle Mouse** - Pan gesture
- **Infinite Canvas** - Unlimited workspace

---

## ⌨️ Keyboard Shortcuts

### Tools
| Key | Tool |
|-----|------|
| `V` | Select tool |
| `R` | Rectangle |
| `C` | Circle |
| `D` | Diamond |
| `H` | Hexagon |
| `T` | Text |
| `L` | Connector/Line |
| `P` | Polyline connector |
| `E` | Generic device |

### Actions
| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+C` | Copy |
| `Ctrl+V` | Paste |
| `Ctrl+X` | Cut |
| `Ctrl+D` | Duplicate |
| `Ctrl+A` | Select All |
| `Ctrl+S` | Save |
| `Ctrl+O` | Open |
| `Delete` / `Backspace` | Delete |
| `F2` / `Enter` / double-click | Rename / edit text in place |
| `?` | Shortcut help |
| `Escape` | Cancel/Deselect |

### Grouping
| Shortcut | Action |
|----------|--------|
| `Ctrl+G` | Group |
| `Ctrl+Shift+G` | Ungroup |

### View
| Shortcut | Action |
|----------|--------|
| `Ctrl+Plus` | Zoom In |
| `Ctrl+Minus` | Zoom Out |
| `Ctrl+0` | Reset Zoom |
| `Space+Drag` | Pan Canvas |
| `Arrow keys` | Nudge selection (Shift: grid step); pan when nothing is selected |
| `Escape` | Deselect / back to select tool |
| `Mouse Wheel` | Zoom |

---

## 🎓 How to Use

### Creating Basic Shapes

1. **Select a shape tool** from the toolbar
2. **Click and drag** on the canvas
3. **Release** to create the shape
4. **Edit properties** in the right panel

### Creating System Objects

1. **Click a system object button** (Server, Video Matrix, etc.)
2. **Click on canvas** to place at default size
3. **Configure ports** in Properties Panel
4. **Connect using typed ports** (automatic color coding)

### Drawing Connections

#### Simple Connection
1. Select **Connector tool** (L)
2. Click on **anchor point** (small dot on shape edge)
3. Drag to **another anchor point**
4. Release to create connection

#### Polyline with Waypoints
1. Select Connector tool
2. Click starting anchor
3. **Click intermediate points** to add waypoints
4. **Double-click** end anchor to finish

#### Editing an existing connector
1. **Right-click** the link → **Add waypoint here** (straight/orthogonal/bezier links become editable polylines without changing shape)
2. Drag waypoints (they snap to the grid); **Alt+click** a waypoint or use *Remove waypoint* to delete it
3. *Straighten*, switch the path style, *Reverse direction* or edit the label from the same menu

#### Reading a busy diagram (view filter)
1. Press **F** or click **Filter** in the app bar
2. Pick one or more **signal types** (video, SDI, network, fibre, power, Wi-Fi, ...) or **device types**
3. Or right-click a device → **Trace downstream** / **Trace upstream** to highlight its signal path
4. Everything else is dimmed (or hidden); **Esc** clears the filter. SVG export respects the filter.

#### Bezier Curves
1. Create any connector
2. Change style to **Bezier** in Properties Panel
3. **Drag orange control points** to adjust curve

#### Typed Connections (System Objects)
1. Use Connector tool with system objects
2. Connectors **automatically match port types**
3. **Colors auto-assign** based on type
4. Use **Connector Anchors** for universal junctions

### Editing Objects

1. **Select** with Select tool (V) — double-click to rename in place, drag with smart alignment guides
2. **Modify in Properties Panel** (multi-selection edits shared properties):
   - Position and dimensions
   - Colors and styling
   - Text content
   - Connector properties
   - Port configurations
3. Changes apply **in real-time**

### Using Templates

1. Click **Templates** button in toolbar
2. Choose from:
   - Basic Flowchart
   - Organizational Chart
   - Network Diagram
   - System Diagram (with typed connections)
3. Template loads on canvas
4. **Customize** colors, labels, and connections

### Grouping Objects

1. **Select multiple objects** (Shift+Click or drag box)
2. Press **Ctrl+G** or use context menu
3. Grouped objects **move together**
4. Press **Ctrl+Shift+G** to ungroup

### Saving Your Work

1. Click **Save** or press **Ctrl+S**
2. JSON file downloads automatically
3. Filename includes **timestamp**
4. File preserves **all properties** and zoom/pan

### Loading Diagrams

1. Click **Load** or press **Ctrl+O**
2. Select saved JSON file
3. Diagram loads with **all objects intact**
4. **View settings restored** (zoom, pan)

### Exporting

#### PNG Export
- Whole diagram (not just the viewport) rendered at 2x, without grid or selection handles
- White background

#### SVG Export
- True vector output (every shape, connector, port dot and label)
- Same renderer the MCP server uses for previews

#### PDF Export
- Page sized to the diagram, rendered at 2x (raster; vector PDF is on the roadmap)
- Needs the jsPDF CDN script; use SVG when offline

---

## 🏗️ Architecture

### Code Structure

```
MorphDiagrams/
├── index.html                     # Editor page
├── styles2.css                    # Editor styles
├── js/
│   ├── main.js                    # Editor (CanvasApp): input, rendering, properties panel, live sync
│   ├── core/
│   │   ├── BaseShape.js           # Base class: geometry, rotation, labels, anchors, serialisation
│   │   ├── SystemObject.js        # Base class for devices with typed ports (+ hexagon variant)
│   │   ├── Connector.js           # Connectors: routing, arrows, labels, hit-testing
│   │   ├── Ports.js               # Port keys and connection rules
│   │   ├── ShapeRegistry.js       # Catalogue of shape types (create / fromJSON / props)
│   │   ├── Serialization.js       # JSON file format (v2.1), validation
│   │   ├── Diagram.js             # Headless document model: connect, validate, auto-layout
│   │   ├── SvgExporter.js         # Vector SVG rendering (browser + Node)
│   │   └── Group.js               # (legacy, unused)
│   ├── shapes/
│   │   ├── Rectangle.js, Circle.js, Diamond.js, Hexagon.js, Cylinder.js, Parallelogram.js
│   │   ├── TextShape.js, ImageShape.js
│   │   ├── Server.js, VideoMatrix.js, LEDProcessor.js, NetworkSwitch.js, SyncGenerator.js
│   │   ├── Device.js              # Generic device with configurable ports
│   │   └── ConnectorAnchor.js     # Universal junction point
│   ├── config/
│   │   └── ConnectionTypes.js     # Connection type registry (video, sdi, network, usb, custom)
│   ├── utils/
│   │   ├── Templates.js, IconLibrary.js, Color.js
│   └── ui/
│       ├── ContextMenu.js         # Right-click menu
│       └── LiveSync.js            # Follows the MCP server / bridge over SSE
├── mcp/
│   ├── server.js                  # MCP server (stdio) for LLM agents
│   ├── http-bridge.js             # Live view: serves the editor + /api/diagram + SSE
│   └── README.md                  # Setup and tool reference
├── schema/diagram.schema.json     # JSON schema of the file format
├── test/                          # node --test suites (model + MCP end-to-end)
├── docs/                          # GitBook docs (generated API pages under docs/api)
└── IMPROVEMENTS.md                # Assessment and improvement backlog
```

### Key Technologies

- **HTML5 Canvas API** - High-performance rendering
- **ES6+ JavaScript** - Modern, modular code
- **JSDoc** - Comprehensive documentation
- **jsPDF** - PDF export functionality
- **No frameworks** - Pure vanilla JavaScript

### Connection System

#### Port Configuration
```javascript
ports: {
    video: { input: 2, output: 2 },
    sdi: { input: 1, output: 1 },
    network: { input: 2, output: 0 },
    usb: { input: 4, output: 0 }
}
```

#### Anchor Points
Each port creates anchors with:
- `x, y` - Position coordinates
- `connectionType` - video, sdi, network, usb, or null
- `portType` - input, output, or both

#### Connection Rules
- **Input ports** connect to **output ports**
- **Types must match** (unless null/universal)
- **Connector Anchors** accept any type

---

## 🔧 Customization

### Adding Custom Shapes

```javascript
import { BaseShape } from './core/BaseShape.js';

class CustomShape extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'custom';
    }

    draw(ctx) {
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
```

### Creating Templates

```javascript
static createCustomTemplate() {
    const objects = [];

    // Add your shapes
    const rect = new Rectangle(100, 100, 200, 150);
    rect.fill = '#3498db';
    objects.push(rect);

    // Add connectors
    const conn = new Connector(rect, 'right', otherShape, 'left');
    objects.push(conn);

    return { name: 'Custom Template', objects };
}
```

### Programmatic Access

```javascript
// Access app instance
window.app

// Get all objects
window.app.objects

// Add object
const rect = new Rectangle(100, 100, 200, 150);
window.app.objects.push(rect);
window.app.render();

// Set zoom
window.app.zoom = 1.5;
window.app.render();
```

---

## 🤖 MCP Server (build diagrams with an LLM agent)

The repository ships an [MCP](https://modelcontextprotocol.io) server so Claude (Desktop or Code) or any
MCP client can create and edit system diagrams through tools such as `add_device`, `connect`,
`auto_layout`, `validate_diagram`, `render_svg` and `save_diagram`. It reuses the editor's own model
code, and a **live view** shows the diagram being built in the browser in real time.

```bash
npm install
npm run mcp      # stdio MCP server; live view at http://127.0.0.1:8765/
npm test         # model + MCP integration tests
```

Claude Code: `claude mcp add morph-diagrams -- node /path/to/MorphDiagrams/mcp/server.js`

See [mcp/README.md](mcp/README.md) for the Claude Desktop configuration, all tools and the port
addressing rules.

---

## 📄 File Format

Diagrams save as JSON (format 2.1, schema in `schema/diagram.schema.json`):

```json
{
    "version": "2.1",
    "objects": [
        {
            "id": "srv1",
            "type": "server",
            "label": "Media Server",
            "x": 100,
            "y": 100,
            "width": 120,
            "height": 180,
            "ports": {
                "video": { "input": 0, "output": 2 },
                "network": { "input": 1, "output": 0 }
            },
            "fill": "#2C3E50"
        },
        {
            "id": "conn1",
            "type": "connector",
            "startObject": "srv1",
            "startAnchor": "video_output_0",
            "endObject": "led1",
            "endAnchor": "video_input_0",
            "connectionType": "video",
            "style": "orthogonal",
            "lineStyle": "solid",
            "label": "PGM"
        }
    ],
    "connectionTypes": {
        "dante": { "label": "Dante", "color": "#3F51B5", "bidirectional": true }
    },
    "metadata": { "name": "Stage A", "zoom": 1, "panX": 0, "panY": 0, "nextGroupId": 1 }
}
```

---

## 🐛 Troubleshooting

### Shapes Not Appearing?
- Check browser console for errors
- Ensure all JS files loaded correctly
- Try hard refresh (Ctrl+Shift+R)
- Clear browser cache

### Connectors Not Snapping?
- Enable snap in toolbar
- Get close to anchor points
- Look for blue dots indicating anchors
- Try higher zoom level for precision

### Performance Issues?
- Reduce number of objects
- Disable shadows
- Lower zoom level
- Use orthogonal instead of bezier
- Clear browser cache

### Export Not Working?
- Check browser console
- Ensure jsPDF library loaded
- Try different export format
- Check file permissions

---

## 📱 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+ |
| Firefox | 88+ |
| Safari  | 14+ |
| Edge    | 90+ |

**Requirements:**
- HTML5 Canvas support
- ES6 JavaScript support
- FileReader API

---

## 🎯 Performance Tips

### Optimization Features
- Efficient rendering loop
- Object culling for off-screen items
- Zoom-scaled hit detection
- Lazy property updates
- Minimal DOM manipulation

### Best Practices
- Use orthogonal connectors for large diagrams
- Limit shadow effects
- Group related objects
- Export at appropriate zoom levels
- Close unused browser tabs

---

## 🔒 Privacy

✅ **100% Local** - All data stays in your browser
✅ **No Tracking** - Zero analytics or telemetry
✅ **No Server** - No data sent to servers
✅ **Secure** - Your diagrams remain private

Only external resource: jsPDF library for PDF export

---

## 🆚 Version History

### Version 2.0 (Current)
- ✨ Added system object shapes
- 🔗 Implemented typed connection system
- 🎯 Added Connector Anchor for universal connections
- 📏 Improved anchor snapping with zoom scaling
- 🎨 Added line style options (solid, dashed, dotted)
- 📝 Comprehensive JSDoc documentation
- 🎨 Updated object colors
- 🔧 Enhanced port configuration

### Version 1.0
- 🎨 Basic shapes and connectors
- 📐 Alignment tools
- 💾 Save/Load functionality
- 📤 PNG/PDF export

---

## 🤝 Contributing

Want to extend Morph Diagrams?

1. **Add shapes** - Create new classes in `js/shapes/`
2. **Add tools** - Extend functionality in `js/main.js`
3. **Add templates** - Create templates in `js/utils/Templates.js`
4. **Add icons** - Build icon factories in `js/utils/IconLibrary.js`

All contributions welcome!

---

## 🙏 Credits

**Built With:**
- HTML5 Canvas API
- Vanilla JavaScript (ES6+)
- jsPDF library for PDF export
- No external frameworks

**Special Thanks:**
- Canvas API community
- Open source contributors
- Early testers and users

---

## 💡 What's Next?

### Planned Features
- 📱 Mobile/touch support
- 🤝 Collaborative real-time editing
- 🎨 More shape types
- 🤖 Auto-layout algorithms
- 📚 Shape library import/export
- 📊 SVG export
- 🎬 Animation support
- 🌐 Cloud sync (optional)

---

## 📞 Support

**Need Help?**
- 📖 Check the troubleshooting section above
- 💻 Review browser console for errors
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions

---

<div align="center">

**Enjoy creating amazing diagrams with Morph Diagrams!** 🎨✨

[Live Demo](https://itzmorphinetime.github.io/MorphDiagrams/) • [GitHub](https://github.com/itzmorphinetime/MorphDiagrams)

Made with ❤️ using vanilla JavaScript

</div>
