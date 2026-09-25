# Morph Diagrams – assessment and improvement plan

This document records a full review of the implementation (editor, shape/connector model, file format,
docs and tooling), what was changed in this pass, and a prioritised list of further improvements.

Legend: **P1** = high value / should do next, **P2** = worthwhile, **P3** = nice to have.
Effort: **S** (< 1 day), **M** (1–3 days), **L** (more than 3 days).

---

## 1. Assessment summary

**What works well**

- Clear shape hierarchy (`BaseShape` → concrete shapes) with lazy anchor resolution, so connectors follow
  shapes for free.
- The typed port idea (`ports = { video: { input, output } }` → anchors keyed `video_input_0`) is a good,
  compact model for hardware diagrams and serialises naturally.
- Zoom-aware handles, polyline/bezier editing, templates, undo/redo and a plain JSON file format make the
  tool genuinely usable without a build step.

**Main weaknesses found (all addressed in this pass unless marked ✗)**

| Area | Finding |
|---|---|
| Duplication | The five system objects each carried an identical 55-line `getAnchorPoints()`; the two hexagon shapes duplicated their geometry; four separate type switches (`createShape`, `objectFromJSON`, `typeMap`, `systemObjectTypes`) had to be kept in sync. |
| Connection UX | Mouse position was snapped to the 20 px grid for the connector tool, so closely spaced ports (16 network ports on a 100 px hexagon edge are ~7 px apart) could not be picked; the pick threshold was only zoom-scaled when snapping was on. |
| Silent data loss | Reducing a port count left connectors pointing at a missing anchor: they vanished from the canvas but stayed in the file and could not be selected or deleted. |
| Paste bugs | Pasted shapes kept the original `groupId` (moving a copy moved the originals) and connections between copied shapes were dropped. |
| Routing | Orthogonal connectors routed through the devices they connect (midpoint elbow ignoring port direction), and the same route logic was duplicated three times (draw, hit-test, arrows). |
| Exports | PNG/PDF exported the visible viewport including grid lines and selection handles; PDF was a raster despite the README's "vector" claim; there was no SVG export. |
| Extensibility | Connection types were hard-coded in four places (config, settings modal HTML, `resetColors`, `applyColors`); no generic device type existed for hardware without a dedicated shape. |
| Safety | Text/labels were injected into the properties panel with `innerHTML` unescaped (a crafted JSON file could run script); numeric inputs accepted `NaN`, making shapes disappear. |
| History | Every click on an object pushed an undo state even without movement; the properties panel was rebuilt on every mouse-move while resizing. |
| Headless use | All serialisation lived inside the DOM-bound `main.js`, so nothing could be reused by tests or an agent-facing API; `ImageShape` called `new Image()` unguarded. |
| Docs/README | README promised features that did not exist (Ctrl+O, align top/middle/bottom, distribute, zoom to cursor, auto-save, smart guides, show/hide) and pointed at a non-existent `css/style.css`; `docs/getting-started.md` was linked but missing. ✗ smart guides, auto-save and show/hide are still open (see §3). |
| Tests | None. |

---

## 2. Implemented in this pass

### Core model (headless, shared by editor, tests and MCP server)

- **`js/core/ShapeRegistry.js`** – single catalogue of shape types (class, display name, category,
  default size, default ports, `create`, `fromJSON`, `applyProps`). Replaces the four hand-maintained
  switches in `main.js`.
- **`js/core/SystemObject.js`** – base class for ported devices (`SystemObject`, `HexSystemObject`):
  port normalisation/validation, ordered port entries, anchors with `side`/`normal`/`label`, polygon hit
  testing for hexagons. `Server`, `VideoMatrix`, `LEDProcessor`, `NetworkSwitch`, `SyncGenerator` now
  only define defaults and an icon (≈250 duplicated lines removed).
- **`js/shapes/Device.js`** – generic device with a fully configurable port map (the workhorse for
  hardware without a dedicated shape, and for agents). New toolbar button (shortcut `E`).
- **`js/config/ConnectionTypes.js`** – `ConnectionTypeRegistry`: register/update custom signal types
  (id, label, colour, `bidirectional`, description), stable fallback colours for unknown types, factory
  reset; `ConnectionColors` kept as a live view for old code. Custom types are embedded in the diagram
  file (`connectionTypes`) and re-registered on load.
- **`js/core/Ports.js`** – port key helpers and the compatibility rules (`anchorsCompatible`,
  `expectedCounterpartPortType`), so the editor, `Diagram.connect()` and validation share one rule set;
  the bidirectional behaviour is now a property of the type instead of `=== 'network'` checks.
- **`js/core/BaseShape.js`** – labels on every shape (`label`, `labelPosition`, `labelFontSize`, auto
  contrast colour, auto-fit inside the shape), `description` notes, rotation-aware `containsPoint`
  (`toLocalPoint`), anchor normals, normalised bounds for negative sizes.
- **`js/core/Connector.js`** – direction-aware orthogonal routing that leaves each port along its
  normal (20 px stub) and routes around when the target is behind the port; a single `getPathPoints()`
  used by drawing, hit-testing, arrows, labels and SVG; connector labels with a readable background;
  `isDangling()` + centre fallback instead of vanishing when a port disappears; `getMidpoint()`.
- **`js/core/Serialization.js`** – file format 2.1 (`createDocument`, `parseDocument`,
  `validateDocument`, `serializeObjects`, `deserializeObjects`), order-preserving load, loader warnings
  instead of silent drops, backwards compatible with 1.0/2.0 files.
- **`js/core/Diagram.js`** – headless document model: `createShape`, `updateObject` (refuses port
  reductions that would orphan connectors unless asked to detach), `connect()` with automatic free-port
  selection, type/direction/occupancy validation and agent-friendly errors (`DiagramError.details`),
  `disconnect`, `listPorts`/`getPortUsage`, `validate()` (dangling ports, incompatible or duplicate
  links, shared ports, overlaps, unlabeled devices, unknown types), layered `autoLayout()` (groups move
  as units, waypoints reset), `getBounds()`, `summary()`.
- **`js/core/SvgExporter.js`** – true vector SVG output for every shape type, connectors (arrows,
  dashes, labels), port dots (hollow = free, filled = used) and optional port labels; text is escaped.
- `Templates.js` now imports colours from the registry and labels the system-diagram devices;
  `IconLibrary.createDecisionIcon` uses a real `Diamond`; `ImageShape` is Node-safe.

### Editor (`js/main.js`, `index.html`, `styles2.css`)

- Connector/polyline tools no longer snap the cursor; pick threshold is always zoom-scaled → tightly
  spaced ports are selectable. Untyped → typed connections adopt the typed end's type and colour.
- Zoom to cursor on wheel, **zoom to fit** button, `Ctrl+O` / `Ctrl++` / `Ctrl+-` / `Ctrl+0`, `Escape`
  deselects / returns to the select tool, arrow keys nudge the selection (Shift = grid step) and pan
  only when nothing is selected, `Ctrl+Shift+Z` redo.
- Align top/middle/bottom, distribute horizontally/vertically, one-click **auto layout**.
- Click without dragging places a shape at its default size (system objects previously required a drag).
- Copy/paste/duplicate keep connections between copied shapes and assign fresh ids and group ids.
- Undo history only records real changes (no entries for plain clicks); properties panel is not rebuilt
  on every resize frame.
- Properties panel: label + position, notes, connection-type selectors for connectors and anchors,
  port table with **add/remove port type** (any registered type), NaN guards, HTML escaping, warning when
  a port change orphans connectors (dangling ends are drawn with red rings).
- Settings modal is generated from the registry (custom connection types can be added/removed there);
  "Reset to defaults" restores factory colours without dropping custom types.
- Port dots are hollow when free and filled when connected; **Port labels** toggle; labels are also
  shown for the selected device.
- Exports render the whole diagram (not the viewport) at 2× without grid/selection chrome; new **SVG**
  export; PDF reports a clear message when jsPDF is unavailable.
- Grid now covers the viewport when panned; a diagram **name** field drives file names and is stored in
  metadata; toast messages replace some `alert()`s.
- **Live sync** (`js/ui/LiveSync.js`): when the page is served by the MCP server/bridge the editor
  follows agent changes over SSE and pushes local edits back (status pill in the toolbar).

### MCP layer

- **`mcp/server.js`** – stdio MCP server (`@modelcontextprotocol/sdk`) with 27 tools
  (`add_device`, `connect`, `connect_many`, `set_port_count`, `auto_layout`, `validate_diagram`,
  `render_svg`, `undo`, …), five resources (schema, catalogues, current diagram as JSON/SVG, saved
  files) and a `build_system_diagram` prompt. Mutations are snapshotted for `undo`, autosaved to the
  current file and broadcast to the live view.
- **`mcp/http-bridge.js`** – HTTP + SSE bridge serving the editor with `/api/diagram` and
  `/api/events`; also usable standalone (`npm run serve diagrams/x.json`) with file watching.
- **`schema/diagram.schema.json`** – JSON schema of the file format (also exposed as an MCP resource).
- **`mcp/README.md`** – setup for Claude Desktop / Claude Code, tool reference, port addressing rules.

### Tooling, tests, docs

- `package.json`: ESM, `npm test` (Node test runner), `npm run mcp`, `npm run serve`, `.gitignore`.
- `test/model.test.js` (19 cases: registry, anchors, rotation hit-tests, port rules, serialisation
  round-trip of `TestDiagram.json`, dangling ports, routing, connect validation, layout, SVG, templates)
  and `test/mcp.test.js` (end-to-end over stdio with the official client).
- API docs regenerated for the new modules; `docs/getting-started.md` and `docs/mcp.md` added;
  README corrected/extended.

### Behaviour changes to be aware of

- Orthogonal connectors now leave ports with a straight 20 px stub, so existing files render slightly
  differently (more legible, no longer through devices).
- Files are written as format `2.1` (2.0/1.0 still load). `VideoMatrix` no longer writes `topHeight`.
- Legacy connector anchors with the default label `Anchor` do not render that label.
- Arrow keys nudge the selection; pan with arrows only when nothing is selected.

---

## 3. Suggested improvements (not yet implemented)

### Connection / port system

| # | Priority | Effort | Suggestion |
|---|---|---|---|
| 3.1 | P1 | M | **Per-port metadata**: optional names per port index (`"HDMI 1"`, `"SDI A"`), per-port direction override (`both` for USB-C/RS-232), and a `side` per type (top/bottom/left/right) so bidirectional links (network) can sit on the top edge. Extend `SystemObject.getPortEdges()` and the port table. |
| 3.2 | P1 | M | **Cable/signal metadata on connectors** (signal format, cable id/length, colour code) and a **cable schedule export** (CSV/Markdown) from the diagram – the single most requested artefact for AV/IT integrators. Add an MCP tool `export_cable_list`. |
| 3.3 | P1 | L | **Obstacle-avoiding orthogonal routing** (grid/visibility-graph search) and **channel spacing** for parallel links between the same two devices, which currently overlap. Keep the current router as the fast fallback. |
| 3.4 | P2 | S | Editor option to **refuse connecting to an occupied port** while dragging (the model already tracks usage; the editor only visualises it). |
| 3.5 | P2 | S | **Reconnect by dragging** a connector endpoint to another port; today a connector must be deleted and redrawn. |
| 3.6 | P2 | S | Connector anchors could **adopt the type** of the first typed connection made to them (currently they stay wildcards unless pinned in the panel). |
| 3.7 | P3 | M | Port **capacity/bandwidth** attributes (e.g. 3G/12G SDI, 1G/10G) validated on connect. |

### Editor UX

| # | Priority | Effort | Suggestion |
|---|---|---|---|
| 3.8 | P1 | S | **HiDPI canvas** (scale by `devicePixelRatio`) – rendering is blurry on 4K/retina screens. |
| 3.9 | P1 | M | **Multi-select property editing** (fill, stroke, ports, labels applied to all selected). |
| 3.10 | P1 | S | **Autosave to `localStorage`** with "restore last session" – the README advertises auto-save. |
| 3.11 | P2 | M | **Smart alignment guides** while dragging (README promises them) and an "intersect" selection mode. |
| 3.12 | P2 | S | **Inline label editing** by double-click (device and connector labels). |
| 3.13 | P2 | M | **Object list / layers panel** (search by label, lock/hide toggles – "show/hide" is promised but not exposed). |
| 3.14 | P2 | S | Resize handles on **rotated** shapes apply deltas in world space; convert to local space. |
| 3.15 | P2 | S | Template and icon modals could show **thumbnails** rendered with `SvgExporter`. |
| 3.16 | P3 | L | **Touch/pen input**, keyboard accessibility for the canvas (focusable, ARIA), minimap and rulers. |
| 3.17 | P3 | M | **Command-pattern undo** (diffs instead of full JSON snapshots) to reduce memory with large image data. |

### Rendering and performance

| # | Priority | Effort | Suggestion |
|---|---|---|---|
| 3.18 | P2 | S | Coalesce renders with `requestAnimationFrame` and a dirty flag; cache `getAnchorPoints()` per frame (it is recomputed several times per connector per render). |
| 3.19 | P3 | M | Spatial index (grid/R-tree) for hit-testing and culling in large diagrams (hundreds of devices). |
| 3.20 | P3 | S | Dark canvas theme and a print stylesheet. |

### Export and file format

| # | Priority | Effort | Suggestion |
|---|---|---|---|
| 3.21 | P1 | S | **Vector PDF** via `svg2pdf.js` from the new SVG exporter instead of a raster page. |
| 3.22 | P2 | S | Export options: selection only, scale, transparent background, copy PNG to clipboard. |
| 3.23 | P2 | S | Validate loaded files against `schema/diagram.schema.json` (Ajv is already an installed transitive dependency) and show a proper error dialog. |
| 3.24 | P3 | S | Persist the user's colour palette in `localStorage`; a migration table for future format versions. |

### MCP / agent workflow

| # | Priority | Effort | Suggestion |
|---|---|---|---|
| 3.25 | P1 | M | **Image preview for vision-capable agents**: rasterise the SVG (e.g. `@resvg/resvg-js`) and return it as MCP image content so an agent can look at what it built. |
| 3.26 | P1 | M | **Sugiyama-quality layout**: crossing minimisation over several sweeps, ordering ports to reduce crossings, layer compaction, and TB layouts with ports on top/bottom (needs 3.1). |
| 3.27 | P2 | S | Named **checkpoints** (`snapshot`/`restore`) and a `diff_diagrams` tool for review workflows. |
| 3.28 | P2 | M | **Import from inventory** (CSV/JSON of devices and patch lists) → devices + connections in one call. |
| 3.29 | P2 | S | `explain_diagram`: narrative of the signal flow (sources → processing → sinks) for documentation. |
| 3.30 | P2 | M | Live-sync **conflict handling**: revision check on `PUT` (409 on stale revision) and a merge prompt in the editor instead of last-write-wins. |
| 3.31 | P3 | M | Streamable-HTTP MCP transport + auth for hosted use; multi-document sessions. |

### Code quality and tooling

| # | Priority | Effort | Suggestion |
|---|---|---|---|
| 3.32 | P1 | S | **CI** (GitHub Actions): `npm test`, `npm run docs:api`, a syntax check of `js/`; ESLint + Prettier config. |
| 3.33 | P1 | S | Remove or archive the legacy files `app.js`, `index_old.html`, `styles.css`, `README_old.md` (unused, confusing for contributors). |
| 3.34 | P2 | S | `js/core/Group.js` is unused (grouping works through `groupId`); delete it or make it the group model. |
| 3.35 | P2 | M | Split `main.js` further: input controller, properties panel view, renderer; consider `@ts-check` JSDoc types or TypeScript for the model layer. |
| 3.36 | P2 | M | Browser-level tests (Playwright) for drag/connect/undo interactions. |
| 3.37 | P3 | S | Serve jsPDF locally (or drop it in favour of 3.21) to work fully offline. |

### Documentation

| # | Priority | Effort | Suggestion |
|---|---|---|---|
| 3.38 | P2 | S | Guides for the port system and file format in `docs/guides/` (the DOC_SCHEMA already suggests this layout); keep `docs/SUMMARY.md` in sync with generated pages automatically in `build-api-docs.mjs`. |
| 3.39 | P3 | S | Short screencast/GIF of the MCP live view in the README. |

---

## 4. Suggested order of work

1. CI + HiDPI + vector PDF + autosave (3.32, 3.8, 3.21, 3.10) – small, high-visibility wins.
2. Per-port metadata and cable schedule (3.1, 3.2) – rounds out the hardware-diagram use case.
3. Agent image preview and better layout (3.25, 3.26) – makes fully autonomous diagram generation reliable.
4. Routing quality (3.3) and multi-select editing (3.9).
