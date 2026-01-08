# Systems Canvas - Professional Diagram Tool

A sleek, feature-rich HTML5 canvas-based tool for creating system diagrams with smart connectors and extensive editing capabilities.

## Features

### Core Drawing Tools
- **Rectangle Tool (R)** - Draw rectangular shapes
- **Circle Tool (C)** - Draw circular/elliptical shapes
- **Diamond Tool (D)** - Draw diamond shapes (perfect for decision nodes)
- **Text Tool (T)** - Add text elements
- **Connector Tool (L)** - Draw smart connections between shapes

### Smart Connector System
- **Anchor Points** - Automatic anchor points on all four sides of shapes (top, right, bottom, left)
- **Persistent Connections** - Connectors stay attached when shapes are moved or resized
- **Multiple Styles** - Straight and orthogonal (right-angle) connector routing
- **Arrow Heads** - Configurable arrows on start and/or end of connectors
- **Visual Feedback** - Anchor points highlight during connection creation

### Selection & Editing
- **Select Tool (V)** - Click to select, drag to move
- **Multi-Select** - Hold Shift and click to select multiple objects
- **Selection Box** - Click and drag to select multiple objects in an area
- **Properties Panel** - Live editing of:
  - Position (X, Y)
  - Dimensions (Width, Height)
  - Colors (Fill, Stroke)
  - Stroke width
  - Text content, font size, font family
  - Connector style and arrows

### Layout & Alignment
- **Align Left** - Align selected objects to the leftmost position
- **Align Center** - Align selected objects to center horizontally
- **Align Right** - Align selected objects to the rightmost position
- **Grid Display** - Optional grid for visual guidance
- **Snap to Grid** - Automatic snapping for precise alignment

### History & Clipboard
- **Undo (Ctrl+Z)** - Step backward through changes
- **Redo (Ctrl+Y)** - Step forward through changes
- **Copy (Ctrl+C)** - Copy selected objects
- **Paste (Ctrl+V)** - Paste with smart offset
- **Delete (Del/Backspace)** - Remove selected objects

### File Operations
- **Save** - Export diagram to JSON format
- **Load** - Import previously saved diagrams
- **Export PNG** - Export diagram as high-quality PNG image
- **Export PDF** - Export diagram as PDF document
- **New** - Start fresh diagram

### View Controls
- **Zoom In (+)** - Zoom in up to 300%
- **Zoom Out (-)** - Zoom out to 10%
- **Zoom Display** - Current zoom percentage shown in toolbar
- **Mouse Wheel Zoom** - Scroll to zoom in/out

## Keyboard Shortcuts

### Tools
- `V` - Select tool
- `R` - Rectangle tool
- `C` - Circle tool
- `D` - Diamond tool
- `T` - Text tool
- `L` - Connector/Line tool

### Actions
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Ctrl+S` - Save
- `Delete` or `Backspace` - Delete selected

### Selection
- `Shift+Click` - Add/remove from selection
- `Click+Drag` - Selection box

## How to Use

### Creating Shapes
1. Select a shape tool from the toolbar (Rectangle, Circle, or Diamond)
2. Click and drag on the canvas to create the shape
3. Release to finalize

### Adding Text
1. Select the Text tool
2. Click where you want to place text
3. Enter your text in the prompt
4. Edit properties in the properties panel

### Creating Connections
1. Select the Connector tool
2. Click on an anchor point (small dots on shape edges)
3. Drag to another shape's anchor point
4. Release to create the connection
5. Connections automatically update when shapes move

### Editing Objects
1. Select the object with the Select tool
2. Use the Properties Panel on the right to modify:
   - Position and size
   - Colors and stroke
   - Text content and styling
   - Connector appearance

### Moving Objects
1. Select one or more objects
2. Click and drag to move
3. All connected lines move automatically

### Aligning Objects
1. Select multiple objects (Shift+Click or selection box)
2. Click alignment buttons in toolbar
3. Objects align relative to each other

## Technical Details

### File Format
Diagrams are saved as JSON files containing:
- All object data (shapes, text, connectors)
- Visual properties (colors, sizes, positions)
- Metadata (version, creation date, zoom level)

### Export Formats
- **PNG**: Rasterized image with white background
- **PDF**: Vector format using jsPDF library

### Browser Compatibility
- Modern browsers with HTML5 Canvas support
- Chrome, Firefox, Safari, Edge (latest versions)

## Advanced Features

### Smart Connectors
Connectors are object-aware:
- They store references to connected objects
- They automatically recalculate positions when objects move
- They support multiple routing styles
- They can have arrows on either or both ends

### Undo/Redo System
- Full history tracking (up to 50 states)
- Captures all modifications
- Efficient JSON-based state storage

### Grid System
- 20px grid spacing
- Optional display toggle
- Snap-to-grid for precise alignment
- Works with all drawing tools

## Future Enhancement Ideas

### Additional Features to Consider
- **More Shapes**: Cylinders, hexagons, parallelograms, custom shapes
- **Grouping**: Group multiple objects to move together
- **Layers**: Z-index control for overlapping objects
- **Styles**: Pre-defined color schemes and styles
- **Templates**: Common diagram patterns (flowcharts, network diagrams)
- **Smart Routing**: Automatic line routing that avoids shapes
- **Bezier Curves**: Curved connector paths
- **Shadow Effects**: Drop shadows for depth
- **Image Import**: Add background images or icons
- **Collaborative Editing**: Real-time multi-user support

## Usage Example

```javascript
// The app initializes automatically on page load
// Access the app instance via: window.app

// Programmatic access examples:
window.app.objects // Array of all objects
window.app.selectedObjects // Currently selected objects
window.app.zoom // Current zoom level
window.app.saveState() // Manually save to history
```

## Credits

Built with:
- HTML5 Canvas API
- Vanilla JavaScript (no frameworks)
- jsPDF for PDF export

## License

Free to use and modify for any purpose.
