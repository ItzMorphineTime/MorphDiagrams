# Morph Diagrams MCP server

An [MCP](https://modelcontextprotocol.io) server that lets an LLM agent (Claude Desktop, Claude Code,
or any MCP client) build and edit Morph system diagrams: add devices with typed input/output ports,
wire them with validated connections, auto-layout, validate, render SVG and save the same JSON files
the web editor opens.

It reuses the editor's own model code (`js/core/*`), so anything the agent produces loads pixel-for-pixel
in the browser, and a **live view** shows the diagram being built in real time.

## Requirements

- Node.js 18 or newer
- `npm install` in the repository root (installs `@modelcontextprotocol/sdk` and `zod`)

## Running

```bash
npm run mcp            # stdio MCP server (what MCP clients launch)
npm run serve          # standalone live view / file bridge: node mcp/http-bridge.js [file.json] [--port 8765]
npm test               # model + MCP integration tests
```

### Claude Desktop

Add to `claude_desktop_config.json` (adjust the paths):

```json
{
  "mcpServers": {
    "morph-diagrams": {
      "command": "node",
      "args": ["C:/Users/you/MorphDiagrams/mcp/server.js"],
      "env": {
        "MORPH_DIAGRAM_DIR": "C:/Users/you/MorphDiagrams/diagrams",
        "MORPH_HTTP_PORT": "8765"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add morph-diagrams -- node /absolute/path/to/MorphDiagrams/mcp/server.js
```

Then ask, for example: *"Build a diagram of a media server feeding two LED processors through a video
matrix, with a sync generator on SDI and everything on one network switch. Save it as stage-a.json."*

The `build_system_diagram` prompt (`/morph-diagrams:build_system_diagram` in clients that expose prompts)
walks the agent through the recommended workflow.

## Live view

While the server runs it also serves the web editor at <http://127.0.0.1:8765/> (change with
`MORPH_HTTP_PORT`, disable with `MORPH_HTTP_PORT=off`). Open that URL in a browser: the page shows a
green **● Live (MCP)** pill, every tool call updates the canvas immediately, and edits made in the
browser are pushed back to the server (so the agent sees them with `describe_diagram`). Last write wins;
the browser keeps its own undo history.

The same page can be served without the MCP server by `node mcp/http-bridge.js diagrams/foo.json`, which
also watches the file so any tool that rewrites it refreshes the browser.

## Environment variables

| Variable | Default | Meaning |
|---|---|---|
| `MORPH_DIAGRAM_DIR` | `<repo>/diagrams` | Directory that relative file paths resolve against |
| `MORPH_OPEN` | – | Diagram file to open on start |
| `MORPH_AUTOSAVE` | `1` | Write the current file after every change (`0` to disable) |
| `MORPH_HTTP_PORT` | `8765` | Port of the live view (`off` to disable) |
| `MORPH_MAX_UNDO` | `50` | Undo depth of the `undo` tool |

## Tools

| Tool | Purpose |
|---|---|
| `list_shape_types` | Catalogue of shape types, default sizes and default port maps |
| `list_connection_types` / `define_connection_type` | Signal types (video, sdi, network, usb, fibre, power, wifi, plus custom ones such as hdmi, dante, dmx) |
| `new_diagram` / `open_diagram` / `save_diagram` | Document lifecycle (files are the editor's JSON format 2.1) |
| `get_diagram` / `describe_diagram` / `find_objects` / `describe_object` | Inspect the current diagram and its ports |
| `add_device` | Add a system object (`server`, `network_switch`, `video_matrix`, `led_processor`, `sync_generator`, `monitor`, `camera`, `power_supply`, `led_distro`, `kvm`, `device`, `connector_anchor`) with a label and a port map |
| `add_shape` | Add basic shapes / text |
| `update_object` / `set_port_count` / `move_objects` / `remove_object` | Edit objects |
| `connect` / `connect_many` / `disconnect` / `update_connector` | Wire ports with validation (type match, direction, occupancy) |
| `auto_layout` | Layered layout following the signal flow |
| `trace_signal_path` | Everything reachable downstream / upstream of a device (optionally per connection type), as a tree |
| `validate_diagram` | Dangling ports, incompatible/duplicate connections, overlaps, missing labels |
| `render_svg` | Vector rendering (file or inline) |
| `insert_template` / `group_objects` / `ungroup_objects` / `undo` | Convenience |

### Port addressing

Ports are keyed `<type>_<direction>_<index>`, e.g. `video_output_0`, `sdi_input_2`. In `connect` you may pass:

- an exact key (`video_output_1`),
- a type and direction (`video_output`) to take the first free port of that kind,
- just a type (`video`) to take the first free output on the source / input on the target,
- nothing, to let the server pick the first free compatible pair,
- for basic shapes: a side (`top`, `right`, `bottom`, `left`).

Occupied ports are refused (the error lists the free ones) unless `allowOccupied` is set. Connection types
must match on both ends (untyped anchors are wildcards) and, except for bidirectional types such as
`network`, links run from an output to an input.

## Resources and prompt

- `morph://schema/diagram` – JSON schema of the file format
- `morph://catalog/shape-types`, `morph://catalog/connection-types`
- `morph://diagram/current` (JSON) and `morph://diagram/current.svg`
- `morph://files/{name}` – saved diagrams in the diagram directory
- prompt `build_system_diagram` – guided workflow for a hardware brief
