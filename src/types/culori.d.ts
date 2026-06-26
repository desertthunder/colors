declare module 'culori' {
  export type CuloriColor = { mode: string; alpha?: number; [channel: string]: number | string | undefined }

  export function converter(mode: string): (color: CuloriColor | string | undefined) => CuloriColor | undefined
  export function formatHex(color: CuloriColor | string): string | undefined
  export function formatHsl(color: CuloriColor | string): string | undefined
  export function formatRgb(color: CuloriColor | string): string | undefined
  export function parse(color: string): CuloriColor | undefined
}
