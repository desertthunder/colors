# A practical browser for color systems

This tool brings Tailwind CSS, uchu, and Reasonable Colors into one place so palette values
can be inspected, converted, and copied without switching between source docs.

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
