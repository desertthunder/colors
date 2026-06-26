/** Stable ids for each palette available in the app. */
export type PaletteId = 'tailwind' | 'uchu' | 'reasonable'

/** Canonical color spaces stored in palette data. */
export type ColorSpace = 'hex' | 'keyword' | 'oklch'

/** A canonical color value from an upstream palette source. */
export type ColorValue = { space: ColorSpace; value: string }

/** One named color token within a palette group. */
export type ColorSwatch = { name: string; token: string; value: ColorValue }

/** A display group such as Blue, Gray, or Pastel Blue. */
export type ColorGroup = { name: string; swatches: ColorSwatch[] }

/** A complete color palette with source-level attribution. */
export type Palette = { id: PaletteId; name: string; sourceUrl: string; groups: ColorGroup[] }
