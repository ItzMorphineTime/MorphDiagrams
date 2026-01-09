# Morph Diagrams - Professional Diagramming Tool

**Version 2.0** - Feature-complete system diagramming tool with intelligent connectors and extensive editing capabilities

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge)](https://itzmorphinetime.github.io/MorphDiagrams/)
![License](https://img.shields.io/badge/license-Apache%202.0-green?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0-orange?style=for-the-badge)

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
- **System Diagram** (NEW!) - Complete system with typed connections
  - Server, Video Matrix, LED Processor
  - Sync Generator, Network Switch
  - 8 pre-connected signal paths

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

1. **Select** with Select tool (V)
2. **Modify in Properties Panel:**
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
- High-quality raster image
- White background
- Perfect for presentations

#### PDF Export
- Vector format
- Scalable without quality loss
- Professional documentation ready

---

## 🏗️ Architecture

### Code Structure

```
MorphDiagrams/
├── js/
│   ├── main.js                    # Main application controller
│   ├── core/
│   │   ├── BaseShape.js          # Base class for all shapes
│   │   ├── Connector.js          # Smart connector system
│   │   └── Group.js              # Object grouping
│   ├── shapes/
│   │   ├── Rectangle.js          # Basic shapes
│   │   ├── Circle.js
│   │   ├── Diamond.js
│   │   ├── Hexagon.js
│   │   ├── Cylinder.js
│   │   ├── Parallelogram.js
│   │   ├── TextShape.js
│   │   ├── ImageShape.js
│   │   ├── Server.js             # System objects
│   │   ├── VideoMatrix.js
│   │   ├── LEDProcessor.js
│   │   ├── NetworkSwitch.js
│   │   ├── SyncGenerator.js
│   │   └── ConnectorAnchor.js
│   ├── config/
│   │   └── ConnectionTypes.js    # Connection type definitions
│   ├── utils/
│   │   ├── Templates.js          # Diagram templates
│   │   └── IconLibrary.js        # Icon management
│   └── ui/
│       └── ContextMenu.js        # Right-click menu
├── css/
│   └── style.css                 # Application styles
└── index.html                    # Main HTML file
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

## 📄 File Format

Diagrams save as JSON:

```json
{
    "version": "1.0",
    "zoom": 1.0,
    "panX": 0,
    "panY": 0,
    "objects": [
        {
            "id": "shape_123",
            "type": "server",
            "x": 100,
            "y": 100,
            "ports": {
                "video": { "input": 2, "output": 2 }
            },
            "fill": "#2C3E50"
        },
        {
            "id": "conn_456",
            "type": "connector",
            "startObject": "shape_123",
            "startAnchor": "video_output_0",
            "endObject": "shape_789",
            "endAnchor": "video_input_0",
            "connectionType": "video",
            "style": "orthogonal",
            "lineStyle": "solid"
        }
    ]
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
