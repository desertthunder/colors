# TODO

## Algorithmic Palettes and Swatch Exports

- [x] Create `src/lib/generate.ts` with typed palette recipes for tone scales, blend
      ramps, and group smoothing.
- [x] Reuse `culori` for OKLCH conversion, interpolation, gamut mapping, color
      difference checks, and contrast checks.
- [x] Add deterministic tests for generated step counts, endpoint preservation, token
      naming, and invalid recipe handling.
- [x] Add `src/lib/export.ts` helpers for complete-palette and group-level CSS custom
      property output.
- [x] Add tests for CSS variable formatting across `hex`, `rgb`, `hsl`, and `oklch`.
- [x] Add an SVG swatch sheet generator that escapes labels, uses deterministic
      dimensions, and includes token/value text.
- [x] Add tests for SVG output structure, escaped text, generated dimensions, and stable
      filenames.
- [x] Add browser-only PNG export by rendering the generated SVG into a `canvas` and
      downloading with `toBlob`.
- [x] Add a compact Generate/Export panel to the palette toolbar without crowding the
      existing format and copy controls.
- [x] Render generated palettes with existing `ColorGroup`/`ColorSwatch` components
      where possible.
- [x] Support copy-all CSS variables for generated palettes and copy-group CSS variables
      for generated groups.
- [x] Add visible warnings for low contrast, clipped gamut, or colors that changed
      materially during gamut mapping.
- [x] Keep generated palettes as UI state for the first version; specify persistence
      separately before adding storage.
- [x] Run `pnpm test` and `pnpm build` before implementation handoff.

## Base16 Scheme Lab

- [ ] Create `src/lib/base16.ts` with `Base16Key`, ordered key constants,
      `Base16Scheme`, semantic role metadata, and validation helpers.
- [ ] Add `formatBase16Yaml` for tinted-theming common scheme output with `system`,
      `name`, `slug`, `author`, `variant`, and `palette.base00` through `base0F`.
- [ ] Add `formatBase16CssVariables` for `--base00` through `--base0F` output and any
      documented semantic aliases.
- [ ] Add `src/lib/base16-generate.ts` for deterministic sample-first, seeded, and
      assisted-remapping generation modes.
- [ ] Use `culori` for OKLCH ramp generation, hue matching, gamut mapping, color
      difference checks, and contrast validation.
- [ ] Support locked Base16 slots so regeneration preserves hand-picked colors.
- [ ] Add `src/lib/base16-samples.ts` with curated samples for Catppuccin, Gruvbox,
      Iceberg, Carbonfox, Vitesse, and Eldritch where licensing and attribution are
      clear.
- [ ] Prefer official tinted-theming Base16 mappings when available; mark hand-adapted
      samples with an `approximation` flag.
- [ ] Add tests for key ordering, validation, slug fallback, YAML formatting, CSS
      formatting, sample integrity, and locked-slot generation.
- [ ] Add a Base16 Lab view or panel with sample selection, metadata fields, variant
      toggle, seed controls, generation controls, and a fixed 16-slot editing grid.
- [ ] Add per-slot color editing and lock toggles for `base00` through `base0F`.
- [ ] Add a live editor preview using Vue markup and CSS variables for syntax, diff,
      search, selection, diagnostics, line numbers, statusline, and terminal ANSI
      swatches.
- [ ] Add export actions for tinted-theming YAML, CSS variables, SVG swatch sheet, and
      PNG swatch sheet generated from canvas blobs.
- [ ] Keep YAML import and real Vim/Neovim colorscheme template generation as later
      milestones unless users need them immediately.
- [ ] Run `pnpm test` and `pnpm build` before implementation handoff.

## Search

- [x] Install Fuse.js.
- [x] Put search query in the hash route (`?search=` param in `AppRoute`).
- [x] Add a search input below the palette toolbar (own row, doesn't crowd
      format/copy controls).
- [x] Search across all palettes by swatch name, token, group, and palette name.
- [x] Show results with color chip, swatch name, formatted value, and
      palette · group metadata.
- [x] Support keyboard navigation (arrow up/down, enter to select, escape to close).
- [x] Selecting a result navigates to its palette (`?swatch=` param), opens the
      containing accordion group, and smooth-scrolls to the swatch (offset for
      sticky nav height).
- [ ] Keep results scoped to the active palette by default, with an option to
      search all palettes.
- [ ] Add copy action to search results (currently navigates only).

## CSS Variables and Export View

- [ ] Add a view or panel for generated CSS custom properties for the active palette.
- [ ] Generate variables using the selected color format and each palette's naming
      convention.
- [ ] Add copy-all for the active palette and copy-group for one accordion section.
- [ ] Add downloadable exports for `.css` and `.ts` snippets.
- [ ] Add a Tailwind config snippet for palette-shaped object output.

## JSON View

- [ ] Add a JSON view for the active palette.
- [ ] Include source metadata, groups, swatches, tokens, canonical values, and
      selected-format values.
- [ ] Add copy and download actions for palette JSON.
- [ ] Keep JSON per palette only; avoid cross-palette combined JSON until search/export
      use cases need it.

## Polish

- [ ] Add screenshots or a short demo to the README once the UI settles.
- [ ] Visual-check accordion scrollspy thresholds on the longest palette and tune the
      marker if needed.

## New Palettes

### WebAwesome

- Docs: <https://webawesome.com/docs/color-palettes>
- Repo: <https://github.com/shoelace-style/webawesome> (branch `next`, monorepo)
- Color token source: `packages/webawesome/src/styles/color/`
- Docs-side theming helpers exist at
  `packages/webawesome/docs/_includes/theming/color-palette-picker.njk` and
  `color-palette-viewer.njk` — useful as a cross-reference for group names
- palette `id`: `webawesome`
- `sourceUrl`: the docs page URL above

---

- [ ] create `src/lib/colors/webawesome.ts` following the `tw.ts` pattern
- [ ] add the id to `PaletteId` in `types.ts`
- [ ] import + register in `colors.ts`
- [ ] add the page to `appPages` in `router.ts`

### USWDS (U.S. Web Design System)

- Docs: <https://designsystem.digital.gov/design-tokens/color/system-tokens/>
- Repo: <https://github.com/uswds/uswds> (branch `develop`)
- Color token source: `packages/uswds-core/src/styles/tokens/color/`
- Each color family is its own SCSS file (e.g. `_blue.scss`, `_red.scss`) defining
  graded tokens with hex values. ~26 families:
  - blue, blue-cool, blue-warm
  - red, red-cool, red-warm
  - green, green-cool, green-warm
  - gray, gray-cool, gray-warm
  - cyan, gold, indigo, indigo-cool, indigo-warm, magenta, mint, mint-cool, orange,
    orange-warm, violet, violet-warm, yellow
  - black-transparent, white-transparent (alpha-channel colors — supported
    without type changes by storing as 8-digit hex, e.g. `#000000B3`; Culori
    parses and formats these through the existing `formatHex`/`formatRgb`/
    `formatHsl`/`formatOklch` paths, and the custom `formatOklch` already emits
    the `/ alpha` suffix)
- Grades typically run 5, 10, 20, 30, 40, 50, 60, 70, 80, 90
- palette `id`: `uswds`
- `sourceUrl`: the docs page URL above
- License: public domain (U.S. government work)

---

- [ ] Consider a script under `scripts/` to automate extraction since there are
      ~24 files to process.
- [ ] same pattern as WebAwesome — fetch each `_*.scss` file via the raw GitHub URL
- [ ] extract hex values from the SCSS variables
- [ ] build the palette object.
