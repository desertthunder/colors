import { converter, formatHex, formatHsl, formatRgb, parse } from 'culori'
import type { CuloriColor } from 'culori'
import type { ColorValue } from './colors'

/** User-selectable color output formats. */
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch'

/** Ordered color formats for controls and route validation. */
export const colorFormats = ['hex', 'rgb', 'hsl', 'oklch'] satisfies ColorFormat[]

const toOklch = converter('oklch')

/** Returns whether a string is a supported color output format. */
export function isColorFormat(value: string | null): value is ColorFormat {
  return colorFormats.includes(value as ColorFormat)
}

/** Formats a canonical palette value for display and copying. */
export function formatColorValue(color: ColorValue, format: ColorFormat): string {
  if (color.space === 'keyword') return color.value

  const parsed = parse(color.value)
  if (!parsed) return color.value

  if (format === 'hex') return formatHex(parsed) ?? color.value
  if (format === 'rgb') return formatRgb(parsed) ?? color.value
  if (format === 'hsl') return formatHsl(parsed) ?? color.value

  return formatOklch(parsed) ?? color.value
}

function formatOklch(color: CuloriColor): string | undefined {
  const oklch = toOklch(color)
  if (!oklch) return undefined

  const lightness = formatNumber(oklch.l)
  const chroma = formatNumber(oklch.c)
  const hue = formatNumber(oklch.h ?? 0)
  const alpha = typeof oklch.alpha === 'number' && oklch.alpha < 1 ? ` / ${formatNumber(oklch.alpha)}` : ''

  return `oklch(${lightness} ${chroma} ${hue}${alpha})`
}

function formatNumber(value: number | string | undefined): string {
  if (typeof value !== 'number') return '0'
  return Number(value.toFixed(4)).toString()
}
