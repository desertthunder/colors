import { describe, expect, it } from 'vitest'
import { slugify } from '../slug'

describe('slugify', () => {
  it('creates lowercase fragment-safe slugs', () => {
    expect(slugify('Pastel Blue')).toBe('pastel-blue')
    expect(slugify('  Gray / Neutral  ')).toBe('gray-neutral')
  })
})
