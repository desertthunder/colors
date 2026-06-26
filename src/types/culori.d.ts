declare module 'culori' {
  /** Minimal Culori color object shape used by this app. */
  export type CuloriColor = { mode: string; alpha?: number; [channel: string]: number | string | undefined }

  /** Creates a converter for a target Culori color mode. */
  export function converter(mode: string): (color: CuloriColor | string | undefined) => CuloriColor | undefined
  /** Formats a color as hex. */
  export function formatHex(color: CuloriColor | string): string | undefined
  /** Formats a color as CSS hsl(). */
  export function formatHsl(color: CuloriColor | string): string | undefined
  /** Formats a color as CSS rgb(). */
  export function formatRgb(color: CuloriColor | string): string | undefined
  /** Parses a CSS color string into a Culori color object. */
  export function parse(color: string): CuloriColor | undefined
}
