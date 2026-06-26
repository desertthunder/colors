import type { ColorFormat } from './color'
import { formatColorValue } from './color'
import type { ColorSwatch } from './colors'

/** User-selectable modes for copied swatch text. */
export type CopyMode = 'value' | 'css' | 'object'

/** Ordered copy modes for controls. */
export const copyModes = ['value', 'css', 'object'] satisfies CopyMode[]

/** Builds the text copied for a swatch using the selected format and copy mode. */
export function formatCopyValue(swatch: ColorSwatch, fmt: ColorFormat, mode: CopyMode): string {
  const value = formatColorValue(swatch.value, fmt)
  if (mode === 'css') return `${swatch.token}: ${value};`
  if (mode === 'object') return `'${swatch.name}': '${value}'`
  return value
}
