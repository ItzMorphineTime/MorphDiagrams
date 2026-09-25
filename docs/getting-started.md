# Getting started

Morph Diagrams is a browser-based tool for drawing **system diagrams**: hardware devices with typed
input/output ports (video, SDI, network, USB, or your own types) connected by validated links.

## Run the editor

The editor is static HTML + ES modules, so any static server works:

```bash
npm install          # only needed for the MCP server, tests and docs
npm run serve        # serves the editor at http://127.0.0.1:8765/ with a live diagram file
```

Or open the published version at <https://itzmorphinetime.github.io/MorphDiagrams/>.

## Draw a system

1. Pick a **system object** from the toolbar (Server, Network Switch, Video Matrix, LED Processor, Sync
   Generator, or the generic **Device**) and click on the canvas to place it at its default size.
2. In the **Properties** panel give it a label and adjust its **port configuration** (inputs on the
   left, outputs on the right). Use *Add port type* for any registered connection type.
3. Choose the **Connector** tool (`L`), press on a port dot and release on a compatible port of another
   device. Typed ports only accept the same type, and outputs connect to inputs (network links are
   bidirectional). Hollow dots are free ports, filled dots are already connected.
4. Use **Auto layout** (⌗) to arrange devices along the signal flow, then **Zoom to fit** (⛶).
5. Save as JSON, or export PNG / SVG / PDF.

## Custom connection types

Open **Settings** and add a type (id, label, colour, bidirectional). Custom types are stored inside the
diagram file, so the file re-registers them wherever it is opened.

## Let an agent do it

The [MCP server](mcp.md) exposes the same model to LLM agents. Ask Claude to build the diagram from a
description, watch it appear in the live view, then refine it by hand.
