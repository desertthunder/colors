import { describe, expect, it } from 'vitest'
import { formatColorValue, getLightestSwatchValue } from '../color'
import type { ColorSwatch, ColorValue } from '../colors'

describe('formatColorValue', () => {
  const blue = { space: 'hex', value: '#3b82f6' } satisfies ColorValue
  const uchu = { space: 'oklch', value: 'oklch(0.5487 0.222 260.33)' } satisfies ColorValue

  it('returns keywords unchanged for every format', () => {
    const keyword = { space: 'keyword', value: 'currentColor' } satisfies ColorValue

    expect(formatColorValue(keyword, 'hex')).toBe('currentColor')
    expect(formatColorValue(keyword, 'rgb')).toBe('currentColor')
  })

  it('formats hex values into common CSS formats', () => {
    expect(formatColorValue(blue, 'hex')).toBe('#3b82f6')
    expect(formatColorValue(blue, 'rgb')).toBe('rgb(59, 130, 246)')
    expect(formatColorValue(blue, 'hsl')).toBe('hsl(217.22, 91.22%, 59.8%)')
  })

  it('preserves oklch output for oklch colors', () => {
    expect(formatColorValue(uchu, 'oklch')).toBe('oklch(0.5487 0.222 260.33)')
  })

  it('finds the lightest parseable swatch value', () => {
    const swatches = [
      { name: 'current', token: '--current', value: { space: 'keyword', value: 'currentColor' } },
      { name: 'black', token: '--black', value: { space: 'hex', value: '#000' } },
      { name: 'white', token: '--white', value: { space: 'hex', value: '#fff' } },
    ] satisfies ColorSwatch[]

    expect(getLightestSwatchValue(swatches)).toBe('#fff')
  })
})
