# Systems Canvas Pro - Feature-Complete Diagram Tool

**Version 2.0** - Complete refactored implementation with all advanced features

## 🚀 Quick Start

1. Open `index.html` in a modern web browser
2. Start drawing shapes and connections
3. Use keyboard shortcuts for faster workflow
4. Save your work to JSON format

## ✨ Features

### 🎨 Shape Tools
- **Rectangle** (R) - Basic rectangle with optional rounded corners
- **Circle** (C) - Circle/ellipse shapes
- **Diamond** (D) - Diamond/rhombus for decisions
- **Hexagon** (H) - Six-sided polygon
- **Cylinder** - 3D-style cylinder for databases/servers
- **Parallelogram** - Skewed rectangle
- **Text** (T) - Text labels with customizable fonts
- **Image** - Import images from your computer

### 🔗 Advanced Connectors
- **Straight Lines** - Simple direct connections
- **Orthogonal** - Right-angle routing
- **Bezier Curves** - Smooth curved connections
- **Polyline** (P) - Custom path with waypoints

**Connector Features:**
- ✅ Selectable connectors (click on lines!)
- ✅ Snap to any shape on canvas
- ✅ Visible anchor points when drawing
- ✅ Configurable arrows (start/end/both)
- ✅ Multiple routing styles
- ✅ Waypoint editing for polylines
- ✅ Control point editing for bezier curves

### 🎯 Selection & Editing
- **Select Tool** (V) - Click to select, drag to move
- **Multi-Select** - Shift+Click to select multiple
- **Selection Box** - Click and drag to select area
- **Properties Panel** - Live editing of all properties
- **Copy/Paste** (Ctrl+C/V) - Duplicate objects
- **Duplicate** (Ctrl+D) - Quick duplicate
- **Undo/Redo** (Ctrl+Z/Y) - Full history

### 📦 Grouping
- **Group** (Ctrl+G) - Group objects together
- **Ungroup** (Ctrl+Shift+G) - Separate grouped objects
- Move groups as single unit
- Lock/unlock groups

### 📐 Layout & Alignment
- **Align Left/Center/Right** - Align multiple objects
- **Bring to Front** - Move objects to top layer
- **Send to Back** - Move objects to bottom layer
- **Z-Index Control** - Full layer management
- **Grid & Snap** - Precise alignment

### 🎨 Visual Effects
- **Shadow Effects** - Drop shadows with customization
- **Color Customization** - Fill and stroke colors
- **Stroke Width** - Adjustable line thickness
- **Corner Radius** - Rounded rectangle corners

### 📚 Templates
Pre-made diagram templates:
- Basic Flowchart
- 3-Tier Architecture
- Network Diagram
- Organization Chart

### 🎭 Icon Library
Pre-made icons for common elements:
- Server
- Database
- User
- Cloud
- Network
- Process
- Decision

### 💾 File Operations
- **Save** (Ctrl+S) - Save to JSON
- **Load** - Load from JSON
- **Export PNG** - High-quality image export
- **Export PDF** - Professional PDF export
- **New** - Start fresh diagram

### 🖱️ Context Menu
Right-click on objects for quick actions:
- Copy, Cut, Paste
- Duplicate
- Delete
- Bring to Front / Send to Back
- Lock / Unlock
- Change connector style
- Toggle arrows

## ⌨️ Keyboard Shortcuts

### Tools
- `V` - Select tool
- `R` - Rectangle
- `C` - Circle
- `D` - Diamond
- `H` - Hexagon
- `T` - Text
- `L` - Connector
- `P` - Polyline

### Actions
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Ctrl+X` - Cut
- `Ctrl+D` - Duplicate
- `Ctrl+A` - Select All
- `Ctrl+G` - Group
- `Ctrl+Shift+G` - Ungroup
- `Ctrl+S` - Save
- `Delete` / `Backspace` - Delete selected
- `Escape` - Cancel current operation

### View
- `+` / `-` - Zoom in/out
- Mouse wheel - Zoom

## 🎓 How to Use

### Creating Shapes
1. Click a shape tool in the toolbar
2. Click and drag on the canvas
3. Release to create the shape
4. Edit properties in the right panel

### Creating Connections
1. Click the Connector or Polyline tool
2. Click on an anchor point (blue dots) on a shape
3. Drag to another shape's anchor point
4. Release to create connection

**For Polyline:**
- Click to add waypoints
- Click on anchor point to finish
- Press `Escape` to cancel

### Editing Objects
1. Select the object with the Select tool
2. Use the Properties Panel to modify:
   - Position and size
   - Colors and styling
   - Text content
   - Connector properties
3. Changes apply in real-time

### Using Templates
1. Click "Templates" button
2. Choose a template
3. Template is inserted on canvas
4. Customize as needed

### Using Icons
1. Click "Icons" button
2. Choose an icon
3. Icon is inserted on canvas
4. Resize and customize

### Importing Images
1. Click "Image" button
2. Select image file
3. Image is placed on canvas
4. Resize and position

## 🏗️ Architecture

### Modular Design
The application uses ES6 modules for clean separation:

```
js/
├── main.js              - Main application controller
├── core/
│   ├── BaseShape.js     - Base class for shapes
│   ├── Connector.js     - Advanced connector system
│   └── Group.js         - Grouping functionality
├── shapes/
│   ├── Rectangle.js
│   ├── Circle.js
│   ├── Diamond.js
│   ├── Hexagon.js
│   ├── Cylinder.js
│   ├── Parallelogram.js
│   ├── TextShape.js
│   └── ImageShape.js
├── utils/
│   ├── IconLibrary.js   - Pre-made icons
│   └── Templates.js     - Diagram templates
└── ui/
    └── ContextMenu.js   - Right-click menu
```

### Adding Custom Shapes

```javascript
import { BaseShape } from './core/BaseShape.js';

class MyCustomShape extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = 'mycustom';
    }

    draw(ctx) {
        // Your drawing code
        ctx.fillStyle = this.fill;
        // ...
    }

    containsPoint(x, y) {
        // Hit detection logic
        return /* true if point is inside */;
    }
}
```

### Adding Custom Icons

```javascript
// In IconLibrary.js
static createMyIcon(x, y) {
    const shapes = [];

    // Create shapes
    const rect = new Rectangle(x, y, 100, 100);
    rect.fill = '#color';
    shapes.push(rect);

    return shapes;
}
```

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `styles2.css`:
```css
:root {
    --primary-color: #0066cc;
    --background-color: #1e1e1e;
    --panel-color: #2d2d2d;
}
```

### Adjusting Grid Size
In `js/main.js`:
```javascript
this.gridSize = 20; // Change to your preferred size
```

### Adding More Templates
In `js/utils/Templates.js`:
```javascript
static createMyTemplate() {
    const objects = [];
    // Add your shapes and connectors
    return { name: 'My Template', objects };
}
```

## 🐛 Troubleshooting

### Shapes not appearing?
- Check browser console for errors
- Ensure all JS files loaded correctly
- Try hard refresh (Ctrl+Shift+R)

### Connectors not snapping?
- Ensure snap is enabled in toolbar
- Get close to anchor points
- Look for blue dots indicating anchors

### Performance issues?
- Reduce number of objects
- Disable shadows if not needed
- Lower zoom level
- Clear browser cache

### Images not loading?
- Check file format (PNG, JPG, GIF supported)
- Ensure file size is reasonable
- Check browser console for errors

## 🌟 Advanced Features

### Smart Routing
Orthogonal connectors attempt to route around objects.

### Z-Index Management
Objects are rendered in layer order. Use Bring to Front / Send to Back to control layering.

### History Management
Up to 50 undo/redo states are preserved.

### Serialization
All objects serialize to JSON with proper reference handling for connectors.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES6 module support.

## 🔒 Privacy

All data stays local in your browser. No server communication except for loading external libraries (jsPDF).

## 📄 File Format

Diagrams save as JSON:
```json
{
    "version": "2.0",
    "objects": [ /* shapes and connectors */ ],
    "groups": [ /* group definitions */ ],
    "metadata": {
        "created": "2025-01-08T...",
        "zoom": 1.0
    }
}
```

## 🤝 Contributing

To extend the application:
1. Add new shape classes in `js/shapes/`
2. Add new tools in `js/main.js`
3. Add new icons in `js/utils/IconLibrary.js`
4. Add new templates in `js/utils/Templates.js`

## 📝 License

Free to use and modify.

## 🙏 Credits

Built with:
- HTML5 Canvas API
- Vanilla JavaScript (ES6+)
- jsPDF for PDF export

## 🆚 Version History

### Version 2.0 (Current)
- Complete refactored architecture
- All requested features implemented
- Modular codebase
- Enhanced UI/UX

### Version 1.0
- Original monolithic implementation
- Basic features

## 📞 Support

For issues or questions:
- Check troubleshooting section
- Review IMPLEMENTATION_PLAN.md
- Check browser console for errors

## 🎯 What's Next?

Potential future enhancements:
- Mobile/touch support
- Collaborative real-time editing
- More shape types
- Advanced auto-layout algorithms
- Shape library import/export
- SVG export
- Animation support

---

**Enjoy creating amazing diagrams with Systems Canvas Pro!** 🎨✨
