# Roadmap

## Algorithmic Palettes and Exportable Swatches

Status: draft

### Objective

Add tools that generate new, copyable palettes from the app's existing palette data, then export those palettes as CSS
custom properties plus SVG and PNG swatch sheets.

The first version should stay local and deterministic: no server, no design-model API, no project file uploads. A user
should be able to start from Tailwind, uchu, or Reasonable Colors, derive a useful palette, inspect every generated
color, and copy or download the output.

### Users and Use Cases

- A designer can pick an existing swatch as a seed and generate a tone scale for a UI theme.
- A developer can generate CSS custom properties that follow the app's existing token conventions.
- A user can export a visual swatch sheet as SVG or PNG for docs, design reviews, and README usage.
- A user can compare generated colors against source colors and avoid obviously low-contrast or out-of-gamut results.

### Current State

- Palette data is static and typed in `src/lib/colors/*.ts`.
- Palette rendering is handled by `src/pages/Palette.vue` and reusable components in `src/components`.
- Color formatting and OKLCH conversion already use `culori` in `src/lib/color.ts`.
- Copy formatting exists in `src/lib/copy.ts` for raw values, CSS custom property entries, and object entries.
- `TODO.md` already tracks a CSS Variables and Export View, but not generated palettes or image swatch exports.

### Library Direction

- Use `culori` as the primary color engine. It is already installed and supports CSS Color Level 4 color formats,
  conversion, interpolation, gamut handling, color difference helpers, and WCAG contrast utilities.
  - Docs: <https://culorijs.org/>
  - API reference: <https://culorijs.org/api/>
- Avoid adding `chroma.js` for the first implementation. It has strong color-scale APIs, but it overlaps with `culori`
  and would add a second color model to maintain.
  - Reference only: <https://gka.github.io/chroma.js/>
- Keep `Color.js` as a future option if this project needs deeper CSS Color 4/5 experimentation or object-oriented color
  APIs later.
  - Reference only: <https://colorjs.io/docs/>
- Generate SVG swatch sheets with a small string builder in `src/lib/export.ts`; SVG is structured text and does not need
  a dependency.
- Generate PNG downloads in the browser by drawing the generated SVG into a `canvas` and calling `toBlob`.
- Consider `sharp` only for a later Node/build-time export workflow, not for the browser MVP.
  - Reference only: <https://sharp.pixelplumbing.com/>

### Palette Generation Model

Use a small explicit data model rather than mutating source palettes:

```ts
type GeneratedPalette = {
  id: string
  name: string
  sourcePaletteId: PaletteId
  recipe: PaletteRecipe
  groups: ColorGroup[]
}

type PaletteRecipe =
  | { mode: 'tone-scale'; seedToken: string; steps: number; lightnessCurve: 'linear' | 'tailwind-like' }
  | { mode: 'blend-ramp'; fromToken: string; toToken: string; steps: number }
  | { mode: 'group-smoothing'; groupName: string; steps: number }
```

Initial generation modes:

1. Tone scale from one existing swatch.
   - Convert the seed to OKLCH.
   - Preserve hue by default.
   - Vary lightness across a fixed step list.
   - Taper chroma near the light and dark ends to reduce clipping.
   - Map back into sRGB with `culori` gamut helpers before formatting.
2. Blend ramp between two existing swatches.
   - Interpolate in OKLCH.
   - Use deterministic sample positions.
   - Preserve endpoint colors exactly when possible.
3. Group smoothing.
   - Use an existing group as anchors.
   - Re-sample it into a clean step count while preserving the source order.

Do not store generated palettes in source files in the MVP. Treat them as route/UI state until there is a concrete need
for persistence.

### Export Model

CSS custom properties:

- Reuse `formatColorValue` for selected output format.
- Add helpers that format a complete palette, group, or generated palette:
  - `formatCssVariables(palette, format)`
  - `formatCssVariableGroup(paletteId, group, format)`
- Keep token names stable and predictable:
  - Source palette token: existing `swatch.token`.
  - Generated token: `--generated-{slug}-{step}` or `--{sourcePaletteId}-{slug}-{step}`.

SVG swatch sheet:

- Generate a standalone `<svg>` string with embedded text labels and color rectangles.
- Include palette title, source attribution, token names, and formatted color values.
- Keep dimensions deterministic from row count, column count, cell size, and gaps.
- Escape all text labels before injecting them into SVG markup.

PNG swatch sheet:

- Convert the SVG string to a `Blob`.
- Draw it into an `HTMLImageElement`.
- Paint it onto a `canvas`.
- Download with `canvas.toBlob`.
- Keep this as browser-only export code unless a build-time asset pipeline is added later.

### UI Plan

- Add an Export or Generate panel reachable from the palette toolbar without crowding the current format/copy controls.
- Start with a compact panel, not a new route, unless route state becomes too large.
- Let the user choose:
  - generation mode;
  - source swatch, source pair, or source group;
  - step count;
  - output format;
  - CSS, SVG, or PNG export.
- Render generated palettes with the existing `ColorGroup` and `ColorSwatch` components where possible.
- Use the existing clipboard behavior for copy actions.

### Verification

- Add Vitest coverage for recipe validation, deterministic generation, CSS variable formatting, SVG escaping, and file
  naming.
- Run `pnpm test` before submitting implementation work.
- Run `pnpm build` when Vue or TypeScript source changes.
- Manually verify in supported browsers that PNG export works through the Canvas path and that clipboard actions still
  work over HTTPS/local dev contexts.

### Boundaries

- Always use the existing palette types, route helpers, copy helpers, and `culori` dependency first.
- Ask before adding a new color or image dependency.
- Never run the dev server in this repository.
- Never commit changes from the agent.

### Risks and Open Questions

- Generated colors can look mathematically consistent but visually weak; contrast and gamut checks should be visible,
  not hidden.
- OKLCH interpolation across very different hues can take surprising paths. Blend-ramp mode may need hue direction
  controls later.
- PNG export from SVG depends on browser canvas behavior. Keep the SVG path as the canonical export and treat PNG as a
  convenience output.
- Persistence is intentionally deferred. If users need shareable generated palettes, route encoding or local storage
  should be specified before implementation.

## Base16 Scheme Lab

Status: draft

### Objective

Add a Base16-focused editor for generating, importing, previewing, and exporting terminal/editor color schemes inspired
by tinted-theming, Vim, and Neovim color schemes.

This should be a semantic scheme tool, not just another swatch browser. A user should be able to experiment with the
16 Base16 slots, see how those slots affect a realistic editor preview, start from curated samples, and export a scheme
in formats that are useful outside this app.

### Users and Use Cases

- A theme author can generate a Base16 scheme from existing app palettes and tune the semantic slots by hand.
- A Vim or Neovim user can sketch a colorscheme direction before writing editor-specific highlight groups.
- A developer can copy CSS variables or YAML for a generated Base16 palette.
- A user can start from familiar sample themes such as Catppuccin, Gruvbox, Iceberg, Carbonfox, Vitesse, or Eldritch and
  adjust them without losing the Base16 semantics.

### Current State

- The app has typed palette data, color formatting, clipboard helpers, hash routing, and swatch rendering.
- The planned algorithmic palette work covers generic tone/ramp generation and image swatch exports.
- There is no Base16-specific data model, semantic preview, YAML export, or editor-theme sample set yet.

### Base16 Model

Use the current tinted-theming common scheme shape as the internal/export model:

```ts
type Base16Key =
  | 'base00'
  | 'base01'
  | 'base02'
  | 'base03'
  | 'base04'
  | 'base05'
  | 'base06'
  | 'base07'
  | 'base08'
  | 'base09'
  | 'base0A'
  | 'base0B'
  | 'base0C'
  | 'base0D'
  | 'base0E'
  | 'base0F'

type Base16Scheme = {
  system: 'base16'
  name: string
  slug: string
  author: string
  description?: string
  variant: 'dark' | 'light'
  palette: Record<Base16Key, string>
  sourceUrl?: string
  license?: string
}
```

Token semantics:

- `base00` through `base07` are the neutral ramp.
  - Dark schemes should usually run from darkest background to lightest foreground.
  - Light schemes should usually run from lightest background to darkest foreground.
- `base08` through `base0F` are syntax/accent colors.
  - `base08`: variables, errors, deleted diff lines.
  - `base09`: integers, booleans, constants.
  - `base0A`: classes, bold markup, search highlights.
  - `base0B`: strings, inserted diff lines.
  - `base0C`: support, regex, escape characters.
  - `base0D`: functions, headings.
  - `base0E`: keywords, storage, selectors, italic markup.
  - `base0F`: deprecated symbols and embedded-language delimiters.

### Library Direction

- Use `culori` for all color parsing, OKLCH conversion, gamut mapping, interpolation, contrast checks, and color
  difference checks.
- Do not add a YAML parser for the MVP. Generate YAML strings with a small formatter because the app only needs to write
  a known schema at first.
- Add YAML parsing/import later only if users need paste/import workflows for arbitrary tinted-theming scheme files.
- Reuse the planned SVG and PNG export path from the generic swatch export work.

### Generation Model

Support three generation paths:

1. Sample-first editing.
   - Load a curated `Base16Scheme` object.
   - Let the user manually replace or tune individual slots.
2. Seeded generation.
   - Choose background, foreground, and one or more accent seeds from the existing palette browser.
   - Generate `base00` to `base07` as an OKLCH neutral ramp.
   - Generate or assign `base08` to `base0F` by matching hue families from source colors.
3. Assisted remapping.
   - Start from any existing color group or generated palette.
   - Suggest Base16 assignments based on hue, lightness, and role.
   - Let the user lock specific slots before regenerating the rest.

Keep generation deterministic. The same options and locked slots should produce the same scheme.

### Editor Experiment UI

Add a Base16 Lab view or panel with:

- Sample selector.
- Scheme name, slug, author, description, and dark/light variant fields.
- A fixed 16-slot grid showing token, semantic role, hex value, and editable color control.
- Per-slot lock toggles so generation can preserve hand-picked colors.
- Seed selectors that can choose from existing palettes and generated palettes.
- Controls for neutral contrast, background depth, accent chroma, warmth/coolness, and step spacing.
- A live editor preview using realistic syntax categories, diff lines, search highlights, selection, line numbers,
  statusline, diagnostics, cursor, and terminal ANSI swatches.
- Export buttons for tinted-theming YAML, CSS variables, SVG swatch sheet, and PNG swatch sheet.

The preview should be implemented with ordinary Vue markup and CSS variables first. Do not embed Monaco, CodeMirror, or a
syntax-highlighting dependency for the MVP.

### Curated Samples

Add a small static sample set in `src/lib/base16-samples.ts`. Each sample should include source attribution, upstream URL,
license, and a note when it is an approximation rather than an official Base16 scheme.

Initial candidates:

- Catppuccin. Upstream palette is MIT licensed and available as a package/repo.
- Gruvbox. Upstream Vim theme is MIT/X11 licensed.
- Iceberg. Upstream Vim theme is MIT licensed.
- Carbonfox. Part of Nightfox, MIT licensed.
- Vitesse. MIT licensed.
- Eldritch. MIT licensed.

Prefer official tinted-theming Base16 schemes where they already exist. For themes that do not publish an official Base16
mapping, store a hand-adapted sample with clear attribution and an `approximation` flag.

### Export Model

Tinted-theming YAML:

```yaml
system: 'base16'
name: 'Scheme Name'
slug: 'scheme-name'
author: 'Author'
variant: 'dark'
palette:
  base00: '#000000'
  base01: '#111111'
  base02: '#222222'
  base03: '#333333'
  base04: '#444444'
  base05: '#555555'
  base06: '#666666'
  base07: '#777777'
  base08: '#888888'
  base09: '#999999'
  base0A: '#aaaaaa'
  base0B: '#bbbbbb'
  base0C: '#cccccc'
  base0D: '#dddddd'
  base0E: '#eeeeee'
  base0F: '#ffffff'
```

CSS variables:

- Emit `--base00` through `--base0F` aliases.
- Also emit `--scheme-bg`, `--scheme-fg`, `--scheme-red`, `--scheme-yellow`, etc. only if the UI makes the aliases
  visible and clearly derived.

SVG and PNG:

- Reuse the swatch export model from the earlier roadmap section.
- Include semantic role labels, not only token names.

### Verification

- Add tests for Base16 key ordering, scheme validation, slug fallback, YAML formatting, CSS variable formatting, sample
  integrity, locked-slot generation, and editor-preview token mappings.
- Run `pnpm test` before submitting implementation work.
- Run `pnpm build` when Vue or TypeScript source changes.
- Manually inspect one dark and one light sample in the editor preview.

### Boundaries

- Always preserve Base16 semantics over aesthetic palette sorting.
- Ask before adding a parser, editor widget, syntax highlighter, or theme-builder dependency.
- Do not claim approximated samples are official ports.
- Never run the dev server in this repository.
- Never commit changes from the agent.

### Risks and Open Questions

- Base16 is intentionally small; some modern editor schemes use more semantic colors than 16 slots can express.
- Imported Vim themes may not map cleanly to Base16 without losing nuance.
- License and attribution must stay attached to samples and exports.
- The first editor preview should be representative, not exhaustive. Real Vim/Neovim output requires separate templates.
