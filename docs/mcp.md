# MCP server

`mcp/server.js` is a Model Context Protocol server (stdio transport) that lets an LLM agent build and
edit diagrams with the same model code the editor uses. Full setup and tool reference:
[mcp/README.md](../mcp/README.md).

## Quick start

```bash
npm install
npm run mcp                      # or: claude mcp add morph-diagrams -- node /path/to/mcp/server.js
```

While the server runs, open <http://127.0.0.1:8765/> to watch the diagram being built. Edits made in the
browser are pushed back to the server.

## Typical agent workflow

1. `list_shape_types`, `list_connection_types` (optionally `define_connection_type`)
2. `new_diagram` with a file name
3. `add_device` for every piece of hardware (label + `ports` map)
4. `connect_many` – ports are picked automatically from a type (`"sdi"`) or type + direction (`"sdi_output"`)
5. `auto_layout`, `validate_diagram`
6. `save_diagram`, `render_svg`

Every mutating call is snapshotted for `undo`, autosaved to the current file and broadcast to the live view.

## Port addressing

Ports are keyed `<type>_<direction>_<index>` (e.g. `video_output_0`). `connect` accepts an exact key, a
`type_direction`, a bare type, a side name for basic shapes (`left`, `right`, ...), or nothing for a
fully automatic choice of the first free compatible pair. Occupied ports are refused with the list of
free alternatives unless `allowOccupied` is set.

## Resources

- `morph://schema/diagram` – JSON schema of the file format
- `morph://catalog/shape-types`, `morph://catalog/connection-types`
- `morph://diagram/current`, `morph://diagram/current.svg`
- `morph://files/{name}` – saved diagrams
