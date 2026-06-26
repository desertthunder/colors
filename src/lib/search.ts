import Fuse from 'fuse.js'
import { palettes } from './colors'
import type { ColorValue, PaletteId } from './colors'
import { formatColorValue } from './color'
import type { ColorFormat } from './color'

/** A single searchable color entry indexed across all palettes. */
export type ColorSearchEntry = {
  paletteId: PaletteId
  paletteName: string
  groupName: string
  name: string
  token: string
  value: ColorValue
}

/** A search result paired with its formatted display value. */
export type ColorSearchResult = ColorSearchEntry & { formatted: string }

const index = palettes.flatMap<ColorSearchEntry>((palette) =>
  palette.groups.flatMap((group) =>
    group.swatches.map((swatch) => ({
      paletteId: palette.id,
      paletteName: palette.name,
      groupName: group.name,
      name: swatch.name,
      token: swatch.token,
      value: swatch.value,
    })),
  ),
)

const fuse = new Fuse(index, {
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'token', weight: 0.25 },
    { name: 'groupName', weight: 0.15 },
    { name: 'paletteName', weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 1,
})

/** Searches colors across all palettes, returning formatted values for the given format. */
export function searchColors(query: string, fmt: ColorFormat, limit = 25): ColorSearchResult[] {
  if (!query.trim()) return []
  return fuse.search(query, { limit }).map(({ item }) => ({ ...item, formatted: formatColorValue(item.value, fmt) }))
}
