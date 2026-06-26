import { describe, expect, it } from 'vitest'
import { formatHashRoute, parseHashRoute } from '../router'

describe('hash routes', () => {
  it('parses valid palette routes with selected format', () => {
    expect(parseHashRoute('#/uchu?format=oklch')).toEqual({ page: 'uchu', format: 'oklch', search: '', swatch: null })
  })

  it('defaults invalid route parts', () => {
    expect(parseHashRoute('#/missing?format=nope')).toEqual({
      page: 'tailwind',
      format: 'hex',
      search: '',
      swatch: null,
    })
  })

  it('parses search and swatch params', () => {
    expect(parseHashRoute('#/tailwind?format=hex&search=blue&swatch=sky-500')).toEqual({
      page: 'tailwind',
      format: 'hex',
      search: 'blue',
      swatch: 'sky-500',
    })
  })

  it('formats route state as a hash route', () => {
    expect(formatHashRoute({ page: 'reasonable', format: 'hsl', search: '', swatch: null })).toBe(
      '#/reasonable?format=hsl',
    )
  })

  it('includes search and swatch params when present', () => {
    expect(formatHashRoute({ page: 'tailwind', format: 'hex', search: 'red', swatch: 'red-500' })).toBe(
      '#/tailwind?format=hex&search=red&swatch=red-500',
    )
  })
})
