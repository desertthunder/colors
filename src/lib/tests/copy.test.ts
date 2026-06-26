import { describe, expect, it } from 'vitest'
import { formatCopyValue } from '../copy'
import type { ColorSwatch } from '../colors'

describe('formatCopyValue', () => {
  const swatch = {
    name: 'blue-500',
    token: '--tailwind-blue-500',
    value: { space: 'hex', value: '#3b82f6' },
  } satisfies ColorSwatch

  it('formats raw values', () => {
    expect(formatCopyValue(swatch, 'hex', 'value')).toBe('#3b82f6')
  })

  it('formats CSS custom property snippets', () => {
    expect(formatCopyValue(swatch, 'rgb', 'css')).toBe('--tailwind-blue-500: rgb(59, 130, 246);')
  })

  it('formats object snippets', () => {
    expect(formatCopyValue(swatch, 'hex', 'object')).toBe("'blue-500': '#3b82f6'")
  })
})
