# colors

A copy-friendly browser for Tailwind CSS v3, uchu, and Reasonable Colors.

## Features

- Browse all three palette systems from one interface.
- Switch displayed values between `hex`, `rgb`, `hsl`, and `oklch`.
- Copy raw values, CSS custom properties, or JavaScript object entries.
- Navigate long palettes with a sticky color-group picker and scrollspy highlight.
- Collapse color groups with accordion sections.
- Preview each group with a compact light-to-dark swatch ramp.

## Installing and Using the Source Palettes

This project is a browser for existing palette systems.

If you want to use the palettes directly in another project, install or import the upstream
packages/files.

### Tailwind CSS v3

Install Tailwind CSS and use its default color palette through Tailwind utilities or the exported color object.

```sh
pnpm add -D tailwindcss@3
```

```js
import colors from 'tailwindcss/colors'

colors.sky[500]
```

### uchu

Install `@inc/uchu` and use the JavaScript exports or CSS custom properties.

```sh
pnpm add @inc/uchu
```

```js
import { palette, pastelPalette, color } from '@inc/uchu'
import '@inc/uchu/css'

palette.blue[5]
pastelPalette.blue[5]
color('red', 7)
```

### Reasonable Colors

Reasonable Colors ships CSS variable files and alternate color-space files.

Its variable format is `--color-COLORNAME-SHADE`, where shades are `1` through `6`.

```sh
pnpm add reasonable-colors
```

```css
@import 'reasonable-colors/reasonable-colors.css';

.example {
  color: var(--color-blue-6);
  background: var(--color-blue-1);
}
```

## Sources

1. [Tailwind CSS v3 color docs](https://v3.tailwindcss.com/docs/customizing-colors)
   - [Tailwind CSS v3.4.17 source](https://github.com/tailwindlabs/tailwindcss/tree/v3.4.17)
2. [uchu](https://code.webb.page/nevercease/uchu.git/about/)
3. [Reasonable Colors](https://github.com/matthewhowell/reasonable-colors)
