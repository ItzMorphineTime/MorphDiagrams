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

1. Pick a **system object** from the palette on the left (Device, Server, Network Switch, Video Matrix,
   LED Processor, Sync Generator, Monitor, Camera, Power Supply, LED Distro, KVM) and click on the canvas
   to place it at its default size.
2. Double-click it to name it. In the **Properties** panel adjust its **ports** (inputs on the left,
   outputs on the right); *Add* offers every registered connection type.
3. Choose the **Connector** tool (`L`), press on a port dot and release on a compatible port of another
   device. Typed ports only accept the same type, and outputs connect to inputs (network links are
   bidirectional). Hollow dots are free ports, filled dots are already connected; hovering a port shows
   its name and what it is connected to.
4. Right-click a link to add waypoints, straighten it, change its path style or reverse it.
5. With nothing selected the panel shows an overview with validation issues (click one to jump to it)
   and **Auto layout** / **Zoom to fit** actions. Press `?` for all shortcuts.
6. To read a busy diagram, open **Filter** (`F`): highlight one or more signal types (video, SDI,
   network, fibre, power, Wi-Fi, …) or device types, or right-click a device and choose *Trace
   downstream* / *Trace upstream* to see only its signal path. Everything else is dimmed (or hidden);
   `Esc` clears the filter and SVG export respects it.
6. Save as JSON, or export PNG / SVG / PDF from the *Export* menu. Unsaved work is kept in the browser
   and offered for restore on the next visit.

Want a head start? *Templates → XL Virtual Production LED Volume* inserts a complete stage (render
servers, matrix, LED processing, VLANs, KVMs, tracking, power) that you can trace and filter straight away.

## Custom connection types

Open **Settings** and add a type (id, label, colour, bidirectional). Custom types are stored inside the
diagram file, so the file re-registers them wherever it is opened.

## Let an agent do it

The [MCP server](mcp.md) exposes the same model to LLM agents. Ask Claude to build the diagram from a
description, watch it appear in the live view, then refine it by hand.
