import { reasonablePalette } from './colors/reasonable'
import { tailwindPalette } from './colors/tw'
import type { Palette, PaletteId } from './colors/types'
import { uchuPalette } from './colors/uchu'

/** Shared color data types used by palette UI and formatting helpers. */
export type { ColorGroup, ColorSpace, ColorSwatch, ColorValue, Palette, PaletteId } from './colors/types'

/** All palettes in the order they should appear in the UI. */
export const palettes = [tailwindPalette, uchuPalette, reasonablePalette] satisfies Palette[]

/** Palette lookup table keyed by stable palette id. */
export const paletteById = Object.fromEntries(palettes.map((palette) => [palette.id, palette])) as Record<
  PaletteId,
  Palette
>

/** Returns a palette by id. */
export const getPalette = (id: PaletteId): Palette => paletteById[id]
