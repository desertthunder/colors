import { reasonablePalette } from './colors/reasonable'
import { tailwindPalette } from './colors/tw'
import type { Palette, PaletteId } from './colors/types'
import { uchuPalette } from './colors/uchu'

export type { ColorGroup, ColorSpace, ColorSwatch, ColorValue, Palette, PaletteId } from './colors/types'

export const palettes = [tailwindPalette, uchuPalette, reasonablePalette] satisfies Palette[]

export const paletteById = Object.fromEntries(palettes.map((palette) => [palette.id, palette])) as Record<
  PaletteId,
  Palette
>

export function getPalette(id: PaletteId): Palette {
  return paletteById[id]
}
