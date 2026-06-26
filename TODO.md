# TODO

## Goal

Build a small color reference tool inspired by the Tailwind v3 color docs. It should let users browse, compare, and copy colors from all three palette systems listed in `README.md`:

- Tailwind v3 colors
- uchu
- Reasonable Colors

## Product Structure

### Current Foundation

- Vue/Vite starter UI has been replaced with a simple single-column app shell.
- Global CSS is split into `src/style.css` for imports/reset/base styles and `src/tokens.css` for tokens.
- Component-level styles live in scoped Vue component styles.
- App shell is split across `src/components/AppShell.vue`, `AppHeader.vue`, `AppFooter.vue`, and route views in `src/pages`.
- Prettier is configured with `pnpm format`.
- Palette data modules exist in `src/lib/colors`.

### Main Page

Use one main application view with:

- Top navigation for `Palettes` and `About`.
- Palette tabs for `Tailwind v3`, `uchu`, and `Reasonable`.
- A shared format control for color output.
- Palette sections rendered from data, not hard-coded markup.
- Click-to-copy behavior on each swatch.

Suggested hash routes:

- `#/tailwind`
- `#/uchu`
- `#/reasonable`
- `#/about`

Keep this as a native hash router unless the app grows beyond these simple routes.
Vue Router is unnecessary for this shape.

### About Page

Keep the about page short and source-focused:

- Explain that this is a copy-friendly browser for multiple color systems.
- Link to the three upstream sources already listed in `README.md`.
- Mention that palette names and values come from their respective projects.

## Color Display

### Formats

Start with the formats users are most likely to copy:

- `hex`
- `rgb`
- `hsl`

Possible later additions:

- `oklch`

Do not build every format up front. Add each format only when there is a clear display and copy use case.

Preserve each palette's naming conventions instead of normalizing shade names across systems. Tailwind,
uchu, and Reasonable should feel like their source projects when users browse or copy from them.

### Controls

Use one segmented control or compact select for the active format. The selected format should apply to
every palette tab so copying is predictable.

The hash route should include the selected format from the first version:

- `#/tailwind?format=hex`
- `#/uchu?format=hsl`

Changing the format control should update the hash. Loading a URL with a format in the hash should
restore that format.

## Data Model

Use the shared palette data shape in `src/lib/colors/types.ts`:

```ts
type PaletteId = 'tailwind' | 'uchu' | 'reasonable'

type ColorSpace = 'hex' | 'keyword' | 'oklch'

type ColorValue = { space: ColorSpace; value: string }

type ColorSwatch = { name: string; token: string; value: ColorValue }

type ColorGroup = { name: string; swatches: ColorSwatch[] }

type Palette = { id: PaletteId; name: string; sourceUrl: string; groups: ColorGroup[] }
```

Palette data is separated from components:

- `src/lib/colors/tw.ts`
- `src/lib/colors/uchu.ts`
- `src/lib/colors/reasonable.ts`

The UI should only receive normalized palette data and an output format. Color conversion and copy
formatting should live outside components, likely in `src/lib/color.ts` or a similarly narrow helper.

Source attribution should stay at the palette level. Do not track attribution per individual color
unless a specific palette source requires it later.

## Components

Start with a few boring components:

- `App.vue`: app entry, currently renders `AppShell`.
- `AppShell.vue`: page shell.
- `AppHeader.vue`: brand and main navigation.
- `AppFooter.vue`: source summary.
- `src/pages/PaletteRouteView.vue`: palette route wrapper.
- `PaletteTabs.vue`: switches between the three palette routes.
- `FormatControl.vue`: switches copied/displayed color format.
- `PaletteView.vue`: renders a selected palette.
- `ColorGroup.vue`: renders one named color group.
- `ColorSwatch.vue`: renders and copies one color.
- `ColorGroupNav.vue`: sticky in-page navigation for long palette group lists.
- `src/pages/AboutView.vue`: source notes and links.

Avoid adding global state management. Vue component state is enough.

## Copy Behavior

Each swatch should copy the displayed value using `navigator.clipboard.writeText`.

Minimum behavior:

- Show the swatch color.
- Show the color name.
- Show the formatted value.
- Copy the selected copy mode on click.
- Briefly show a copied state.

Copy modes:

- Raw color value, using the selected format.
- CSS custom property snippet.
- JavaScript/TypeScript object snippet.

Fallback behavior can be added later if clipboard support becomes a real issue.

## Implementation Order

- [x] Replace the default Vue/Vite starter UI with a simple app shell.
- [x] Add global CSS foundation with one token file and scoped component styles.
- [x] Configure Prettier with `pnpm format`.
- [x] Split `src/App.vue` into small shell components.
- [x] Review upstream palette source formats.
- [x] Add complete palette data for Tailwind v3, uchu, and Reasonable.
- [x] Add an index module for `src/lib/colors` as `src/lib/colors.ts` when a caller needs a single import point.
- [x] Install a color conversion library when implementing format helpers (`culori`)
- [x] Add `hex`, `rgb`, `hsl`, and `oklch` formatting helpers.
- [x] Build the native hash router for the four routes.
- [x] Persist the selected format in the hash route.
- [x] Build palette tabs and route-aware navigation state.
- [x] Build the shared palette rendering components.
- [x] Add copy modes for raw values, CSS variables, and object snippets.
- [x] Add click-to-copy and copied state.
- [x] Add sticky in-page color group navigation.
- [x] Replace temporary intro content with route views.
- [x] Add responsive layout polish for the palette grid and controls.
- [x] Add lightweight tests for color formatting, copy output, and hash route parsing.

## V2

- No saved palettes.
- No custom palette editor.
- Add search after the full palette browsing experience exists. Use Fuse.js for fuzzy search across palette, group, swatch name, token, and formatted values.
- No package for Vue Router unless route complexity grows.
- No advanced color conversion formats until `hex`, `rgb`, and `hsl` are solid.
