# DOC_SCHEMA.MD — JavaScript Documentation Schema (JSDoc → GitBook)

This schema defines **how we document our JavaScript code** (JSDoc style) so it generates **clean, consistent, professional API pages** when rendered as Markdown in **GitBook**.

It is designed for a **pure JavaScript** project (no TypeScript required) and assumes the API reference is generated **per-file** (one GitBook page per source file), then synced to GitBook via Git Sync.

---

## Goals

1. **Professional GitBook output**
   - Clear page titles, predictable sections, readable signatures, and useful examples.
2. **Consistency**
   - Every module/class/method looks the same across the docs.
3. **Fast scanning**
   - Readers can quickly answer: _what is it_, _how do I use it_, _what does it return/throw/emit_.
4. **Stable linking**
   - Module names mirror file paths for durable anchors and reliable cross-links.

---

## Documentation Architecture (GitBook)

### Recommended folder layout

- `/docs` contains **hand-written** pages (guides, architecture, tutorials)
- `/docs/api` contains **generated** API pages (do not hand-edit)

Example:
- `docs/README.md` (intro)
- `docs/getting-started.md`
- `docs/guides/...`
- `docs/api/README.md` (generated index)
- `docs/api/core/BaseShape.md` (generated)
- `docs/api/shapes/Rectangle.md` (generated)

### Generated API page layout (what we aim for)

Each generated page should read like:

1. **Title** (module/class name)
2. **One-paragraph summary**
3. **Notes / constraints** (short bullets)
4. **Public API** (classes/functions/typedefs/constants)
5. **Examples** (at least one)
6. **Related** links (`@see`)

> Put narrative explanations, workflows, and long-form concepts in `/docs/guides`. Keep API pages reference-focused.

---

## Global Writing Rules (to look good on GitBook)

### Tone & style

- Use **present tense**, direct voice.
- First line should be a **one-sentence summary**.
- Keep paragraphs short (1–4 lines).
- Prefer **Markdown** in descriptions (lists, emphasis, inline code) over HTML.

### Formatting conventions

- Use backticks for identifiers: `BaseShape`, `Connector`, `x`, `y`.
- Prefer: “Computes …” / “Returns …” over “This method is used to …”.
- Document **observable behavior**, not implementation details.

### Public vs private

- Thoroughly document the **public API**.
- Internal helpers:
  - Mark `@private` if documented, or
  - Omit documentation entirely if it’s truly internal.

---

## Naming & Grouping

### Rule: every file is a module

At the top of **every** `.js` file, include a module docblock.

- Module name must mirror the path under `/js` (no extension)
- Use forward slashes: `core/BaseShape`, `shapes/Rectangle`, `ui/ContextMenu`

This produces consistent GitBook page titles and stable cross-links.

---

## Required JSDoc Blocks

### 1) File / Module Header (required for every file)

**Template**
```js
/**
 * @module core/BaseShape
 * @description Base class for diagram shapes. Provides geometry, rendering hooks, and selection behavior.
 *
 * @remarks
 * - Most shapes extend {@link BaseShape}.
 * - Shapes should avoid mutating the canvas directly; use renderer callbacks.
 *
 * @example
 * const shape = new BaseShape({ x: 10, y: 20 });
 * shape.setSelected(true);
 *
 * @see module:shapes/Rectangle
 * @see module:core/Connector
 */
```

**Rules**
- `@module` must be the **first tag**.
- `@description` should be a concise paragraph.
- Use `@remarks` for short bullets (not a long essay).
- Include at least one `@example` for public-facing modules.
- Use `@see` for closely-related modules (2–5 links).

> If your generator doesn’t recognize `@remarks`, keep that section as plain text/bullets in the docblock; the structure still helps readability.

---

## Classes

### 2) Public Class (required)

**Template**
```js
/**
 * Represents a rectangular diagram shape.
 *
 * @class
 * @extends BaseShape
 *
 * @example
 * const rect = new Rectangle({ x: 10, y: 10, width: 120, height: 60 });
 * rect.setLabel("Ingest");
 */
class Rectangle extends BaseShape { /* ... */ }
```

**Rules**
- Start with a one-line summary.
- Use `@extends` for inheritance.
- Include at least one `@example` for user-facing classes.
- Prefer documenting constructor options thoroughly.

---

## Constructors & Options Objects

### 3) Constructor options schema (strongly recommended)

Document options as an object with named properties. This renders much cleaner in GitBook than vague “options object” text.

**Template**
```js
/**
 * @param {Object} options
 * @param {number} options.x X position in canvas coordinates.
 * @param {number} options.y Y position in canvas coordinates.
 * @param {number} [options.width=100] Width in pixels.
 * @param {number} [options.height=60] Height in pixels.
 * @param {string} [options.id] Stable identifier used for serialization.
 */
constructor(options) { /* ... */ }
```

**Rules**
- Use `[param=default]` to show defaults.
- Use sub-params for shaped options (`options.width`, etc.).
- If there are many options, group them:
  - `options.style.*`, `options.constraints.*`, etc.

---

## Methods

### 4) Public methods (required)

**Template**
```js
/**
 * Computes the connector anchor point closest to the given target.
 *
 * @param {{x:number, y:number}} target Target point in canvas coordinates.
 * @param {("top"|"right"|"bottom"|"left")} [preferredSide] Prefer a side when distances are equal.
 * @returns {{x:number, y:number}} The chosen anchor point.
 * @throws {Error} If the shape has no geometry defined.
 *
 * @example
 * const p = rect.getAnchorPoint({ x: 400, y: 200 }, "right");
 * connector.attach(rect, p);
 */
getAnchorPoint(target, preferredSide) { /* ... */ }
```

**Rules**
- Always document:
  - `@param` for every parameter
  - `@returns` for non-void returns
- Include `@throws` when callers may need to handle failures.
- Use string literal unions for enum-like args: `("a"|"b")`.
- Keep `@example` short and runnable.

### Void methods

If a method returns nothing, omit `@returns` and describe side effects in the summary.

---

## Properties & Fields

### 5) Public properties

Prefer documenting public fields either via `@property` on the class, or via getters/setters.

**Option A: `@property` (good for data-shaped classes)**
```js
/**
 * Base class for all shapes.
 *
 * @property {string} id Stable identifier used for serialization.
 * @property {number} x X position.
 * @property {number} y Y position.
 */
class BaseShape { /* ... */ }
```

**Option B: getters (best for computed properties)**
```js
/**
 * Current bounds in canvas coordinates.
 * @returns {{x:number, y:number, width:number, height:number}}
 */
get bounds() { /* ... */ }
```

**Rules**
- Do not document internal fields as public.
- Mark internal fields as `@private` if documented.

---

## Types, Typedefs, Callbacks, Enums

### 6) `@typedef` (recommended)

Use typedefs to keep signatures small and pages readable.

```js
/**
 * A 2D point in canvas coordinates.
 * @typedef {{x:number, y:number}} Point
 */
```

Then:
```js
/** @param {Point} target */
```

### 7) `@callback` (hooks / handlers)

```js
/**
 * Called when a shape changes.
 * @callback ShapeChangeHandler
 * @param {BaseShape} shape
 * @param {string} reason Human-readable reason for the change.
 */
```

### 8) `@enum` for discrete sets

```js
/**
 * Connection type identifiers.
 * @readonly
 * @enum {string}
 */
export const ConnectionTypes = {
  SDI: "sdi",
  HDMI: "hdmi",
  NDI: "ndi"
};
```

**Rules**
- Use `@readonly` for constant maps.
- Prefer string enums for readability in docs and serialized data.

---

## Events

If your system emits events (custom event bus, DOM events, etc.), document them explicitly.

### 9) `@event` + `@fires`

```js
/**
 * Fired when a connector is created.
 * @event Connector#created
 * @type {object}
 * @property {Connector} connector The created connector.
 * @property {string} id The connector id.
 */

/**
 * Creates a connector between two anchors.
 *
 * @fires Connector#created
 * @returns {Connector}
 */
create(/* ... */) { /* ... */ }
```

**Rules**
- Use `ClassName#eventName`.
- Always document payload shape with `@property`.

---

## Error Contracts

### 10) Use `@throws` as part of your API contract

Use `@throws` when:
- The error is caused by invalid input/state a caller can influence.
- The failure is likely enough to matter in integration.

```js
/**
 * @throws {RangeError} If width or height is negative.
 * @throws {Error} If the shape is not attached to a diagram.
 */
```

---

## Examples (Make GitBook Shine)

### 11) Examples should be fenced and minimal

```js
/**
 * @example
 * const diagram = new Diagram(canvas);
 * const rect = new Rectangle({ x: 10, y: 10, width: 120, height: 60 });
 * diagram.add(rect);
 */
```

**Rules**
- Prefer one “hello world” example and optionally one advanced example.
- Avoid heavy setup unless essential.
- Keep examples aligned with typical usage paths.

---

## Cross-linking (GitBook-friendly)

### 12) Use `@see` and `{@link ...}` consistently

**Inline**
- `{@link Rectangle}`
- `{@link module:core/Connector}`
- `{@link BaseShape#getAnchorPoint}`

**Related**
```js
/****
 * @see module:core/Group
 * @see module:core/Connector
 */
```

**Rules**
- Include 2–5 related links for key modules.
- Prefer module links for “neighbor” files (base/derived/peer).

---

## Tag Order (Consistency improves output)

Within a docblock, use this order:

1. Summary sentence (plain text)
2. Additional description / bullets (plain Markdown)
3. Identity tags: `@module` / `@class` / `@event` / `@typedef`
4. Relationship tags: `@extends` / `@implements`
5. `@param` (all)
6. `@returns`
7. `@throws`
8. `@fires`
9. `@example`
10. `@see`

---

## Type Style Guide (choose one style and stick to it)

Recommended:

- Primitives: `string`, `number`, `boolean`, `null`, `undefined`
- Arrays: `Type[]` (simple), `Array<Type>` (complex)
- Objects: `Object` (generic) and typedefs for structured shapes
- Maps: `Record<string, Type>` when helpful
- Unions: `(TypeA|TypeB)` and `("a"|"b")`
- Nullable: prefer `(Type|null)` for clarity

---

## Coverage Requirements

### Must document
- Public classes
- Public functions
- Public module exports/constants (e.g., `ConnectionTypes`)
- Serialization formats (if any)
- Events emitted (if part of public behavior)
- Any non-trivial options object

### Should document
- Extension points (overrides / hook methods)
- Default behaviors and constraints
- Performance-sensitive methods (brief note)

### Do not document as public API
- Private helpers
- Internal caches
- Debug-only flags

Mark internal items with `@private` (or omit).

---

## Codebase-Specific Guidance (MorphDiagrams)

### Core modules (`js/core/*`)
- Document lifecycle contracts:
  - creation → attach → render → interaction → serialize
- Use `@remarks` bullets for “who calls whom” and invariants.

### Shapes (`js/shapes/*`)
- Emphasize:
  - geometry model (bounds/anchors)
  - render behavior (what it draws)
  - interaction (drag/select/resize)
  - serialization fields (id/type/props)

### UI modules (`js/ui/*`)
- Document event handlers and side effects.
- Document DOM integration points (what elements/events are expected).

### Config modules (`js/config/*`)
- Prefer `@enum` + `@readonly` for constant sets.
- Include short examples showing how config is consumed.

---

## Anti-patterns (These generate ugly GitBook pages)

- Missing `@module` header → inconsistent pages and poor indexing
- Huge paragraphs in API blocks → move to Guides
- Undocumented options objects → poor discoverability
- Inconsistent type style → confusing signatures
- `@returns {void}` everywhere → omit returns unless meaningful
- HTML in descriptions → Markdown renders more consistently

---

## Quick Copy/Paste Blocks

### Module header (minimum)
```js
/**
 * @module shapes/Rectangle
 * @description Rectangular diagram shape with label and resize handles.
 *
 * @example
 * const rect = new Rectangle({ x: 10, y: 10, width: 120, height: 60 });
 */
```

### Method block (minimum)
```js
/**
 * Updates the label text.
 * @param {string} text New label text.
 */
setLabel(text) {}
```

### Options block (minimum)
```js
/**
 * @param {Object} options
 * @param {number} options.x
 * @param {number} options.y
 * @param {number} [options.width=100]
 * @param {number} [options.height=60]
 */
constructor(options) {}
```

---

## Definition of Done (per file)

- [ ] File begins with a `@module` header and `@description`
- [ ] Public exports have a one-line summary
- [ ] Constructors document options and defaults
- [ ] Public methods document params, returns, throws (when relevant)
- [ ] At least one `@example` for user-facing modules/classes
- [ ] Related modules are linked via `@see` / `{@link ...}`
- [ ] Internal items are `@private` or undocumented

---

## Notes on Generation (assumptions)

This schema assumes an API generator that:
- Parses JSDoc blocks from files under `/js`
- Produces one Markdown page per source file under `docs/api/**`
- Adds a page title (e.g., `# Rectangle`) before the generated content
- GitBook is configured to use `root: ./docs` and sync via Git

If you follow this schema, your generated GitBook API pages will be:
- consistent,
- navigable,
- and readable as a polished reference.
