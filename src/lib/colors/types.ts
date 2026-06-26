export type PaletteId = 'tailwind' | 'uchu' | 'reasonable'

export type ColorSpace = 'hex' | 'keyword' | 'oklch'

export type ColorValue = { space: ColorSpace; value: string }

export type ColorSwatch = { name: string; token: string; value: ColorValue }

export type ColorGroup = { name: string; swatches: ColorSwatch[] }

export type Palette = { id: PaletteId; name: string; sourceUrl: string; groups: ColorGroup[] }
