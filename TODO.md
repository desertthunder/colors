# TODO

## Search

- [ ] Install Fuse.js.
- [ ] Build a normalized search index across palette, group, swatch name, token, canonical
      value, and formatted values.
- [ ] Add a search input near the palette controls without crowding format/copy controls.
- [ ] Show grouped search results with palette, group, swatch name, formatted value, and
      copy action.
- [ ] Keep results scoped to the active palette by default, with an option to search all
      palettes.
- [ ] Support keyboard navigation for search results.
- [ ] Put search query in the hash route.

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
