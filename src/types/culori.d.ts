declare module 'culori' {
  /** Minimal Culori color object shape used by this app. */
  export type CuloriColor = { mode: string; alpha?: number; [channel: string]: number | string | undefined }

  /** Creates a converter for a target Culori color mode. */
  export function converter(mode: string): (color: CuloriColor | string | undefined) => CuloriColor | undefined
  /** Maps colors into the requested gamut while preserving the original color mode. */
  export function clampGamut(mode?: string): (color: CuloriColor | string) => CuloriColor
  /** Returns whether a color fits inside the sRGB gamut. */
  export function displayable(color: CuloriColor | string): boolean
  /** Creates a CIEDE2000 color difference function. */
  export function differenceCiede2000(): (colorA: CuloriColor | string, colorB: CuloriColor | string) => number
  /** Formats a color as hex. */
  export function formatHex(color: CuloriColor | string): string | undefined
  /** Formats a color as CSS hsl(). */
  export function formatHsl(color: CuloriColor | string): string | undefined
  /** Formats a color as CSS rgb(). */
  export function formatRgb(color: CuloriColor | string): string | undefined
  /** Creates an interpolator across colors in the requested color mode. */
  export function interpolate(colors: (CuloriColor | string)[], mode?: string): (position: number) => CuloriColor
  /** Parses a CSS color string into a Culori color object. */
  export function parse(color: string): CuloriColor | undefined
  /** Computes the WCAG contrast ratio between two colors. */
  export function wcagContrast(colorA: CuloriColor | string, colorB: CuloriColor | string): number
}
