# TODO

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
