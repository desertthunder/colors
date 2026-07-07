# A practical browser for color systems

This tool brings Tailwind CSS, uchu, and Reasonable Colors into one place so palette values
can be inspected, converted, exported, and copied without switching between source docs.

It can also generate new palettes from those source colors for quick experiments and
handoff-ready exports.

## Palette sources

### [Tailwind CSS v3](https://v3.tailwindcss.com/docs/customizing-colors)

Tailwind v3 ships an extensive default palette with literal color names and numeric shade
scales.

This project keeps those conventions intact so values still read like Tailwind tokens.

### [uchu](https://code.webb.page/nevercease/uchu.git/about/)

uchu is an OKLCH-first palette by NetOperator Wibby.

Its source provides primary, pastel, reduced, and CSS variable forms;
this browser focuses on the palette groups used by the app data.

### [Reasonable Colors](https://github.com/matthewhowell/reasonable-colors)

Reasonable Colors is an open-source system for accessible, good-looking palettes.

It uses `--color-COLORNAME-SHADE` variables with shades `1` through `6`, and its docs
describe contrast by shade-number differences.

## Copy behavior

Every palette keeps its source naming style.

Format controls change the displayed value, while copy modes produce raw values,
CSS custom properties, or JavaScript object entries per selected palette.

## Generated palettes

The Generator starts from the active source palette and keeps the result local to the
page. It can build tone scales, OKLCH blend ramps, smoothed source groups, and harmony
palettes such as complementary, analogous, triadic, tetradic, and split-complementary sets.

Generated colors are fit into sRGB before export so high-chroma OKLCH colors are reduced
instead of being clipped after the fact.

The app still reports warnings when a generated color has no black or white text option
at the target contrast, falls outside gamut, or changes materially during mapping.

## Exports

Generated palettes can be copied as CSS custom properties, either as a complete palette or
one generated group at a time.

You can also download a palette as an SVG or PNG swatch sheet.

## Using the source palettes

This project is a reference browser, not a replacement for the upstream packages.

For Tailwind CSS v3, install `tailwindcss@3` and use the default utilities or import
the color object from `tailwindcss/colors`.

For uchu, install `@inc/uchu`. The source package exports JavaScript palettes such as
`palette` and `pastelPalette`, a `color()` helper, and CSS entry points like `@inc/uchu/css`
and `@inc/uchu/pastel-css`.

For Reasonable Colors, install `reasonable-colors` or use the published CSS files directly.
Variables follow the `--color-COLORNAME-SHADE` pattern, with shade values from `1` through
`6`; the source also provides alternate color-space files.
