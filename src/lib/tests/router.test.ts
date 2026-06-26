import { describe, expect, it } from 'vitest'
import { formatHashRoute, parseHashRoute } from '../router'

describe('hash routes', () => {
  it('parses valid palette routes with selected format', () => {
    expect(parseHashRoute('#/uchu?format=oklch')).toEqual({ page: 'uchu', format: 'oklch' })
  })

  it('defaults invalid route parts', () => {
    expect(parseHashRoute('#/missing?format=nope')).toEqual({ page: 'tailwind', format: 'hex' })
  })

  it('formats route state as a hash route', () => {
    expect(formatHashRoute({ page: 'reasonable', format: 'hsl' })).toBe('#/reasonable?format=hsl')
  })
})
