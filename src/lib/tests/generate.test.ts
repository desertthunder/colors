import { describe, expect, it } from 'vitest'
import { generatePalette, getGenerateableSwatches } from '../generate'
import type { Palette } from '../colors'

const testPalette = {
  id: 'tailwind',
  name: 'Test Palette',
  sourceUrl: 'https://example.com',
  groups: [
    {
      name: 'Base',
      swatches: [
        { name: 'current', token: '--test-current', value: { space: 'keyword', value: 'currentColor' } },
        { name: 'black', token: '--test-black', value: { space: 'hex', value: '#000000' } },
      ],
    },
    {
      name: 'Blue',
      swatches: [
        { name: 'blue-100', token: '--test-blue-100', value: { space: 'hex', value: '#dbeafe' } },
        { name: 'blue-500', token: '--test-blue-500', value: { space: 'hex', value: '#3b82f6' } },
        { name: 'blue-900', token: '--test-blue-900', value: { space: 'hex', value: '#1e3a8a' } },
      ],
    },
    {
      name: 'Brand Accent',
      swatches: [
        { name: 'hot', token: '--test-hot', value: { space: 'hex', value: '#ff0066' } },
        { name: 'cool', token: '--test-cool', value: { space: 'hex', value: '#00ccff' } },
      ],
    },
  ],
} satisfies Palette

describe('generatePalette', () => {
  it('creates deterministic tone scales with generated token names', () => {
    const generated = generatePalette(testPalette, {
      mode: 'tone-scale',
      seedToken: '--test-blue-500',
      steps: 5,
      lightnessCurve: 'linear',
    })

    expect(generated.id).toBe('generated-tailwind-tone-scale-blue-500')
    expect(generated.sourcePaletteId).toBe('tailwind')
    expect(generated.groups).toHaveLength(1)
    expect(generated.groups[0].swatches).toHaveLength(5)
    expect(generated.groups[0].swatches.map((swatch) => swatch.token)).toEqual([
      '--generated-blue-500-1',
      '--generated-blue-500-2',
      '--generated-blue-500-3',
      '--generated-blue-500-4',
      '--generated-blue-500-5',
    ])
    expect(generated.groups[0].swatches.map((swatch) => swatch.value.space)).toEqual([
      'hex',
      'hex',
      'hex',
      'hex',
      'hex',
    ])
    expect(generated.swatches.every((swatch) => typeof swatch.contrastWithBlack === 'number')).toBe(true)
    expect(generated.swatches.every((swatch) => typeof swatch.contrastWithWhite === 'number')).toBe(true)
  })

  it('preserves blend ramp endpoints exactly', () => {
    const generated = generatePalette(testPalette, {
      mode: 'blend-ramp',
      fromToken: '--test-blue-100',
      toToken: '--test-blue-900',
      steps: 4,
    })
    const swatches = generated.groups[0].swatches

    expect(swatches).toHaveLength(4)
    expect(swatches[0].value.value).toBe('#dbeafe')
    expect(swatches[3].value.value).toBe('#1e3a8a')
  })

  it('preserves group smoothing endpoints and uses group token naming', () => {
    const generated = generatePalette(testPalette, { mode: 'group-smoothing', groupName: 'Brand Accent', steps: 3 })
    const swatches = generated.groups[0].swatches

    expect(swatches.map((swatch) => swatch.token)).toEqual([
      '--generated-brand-accent-1',
      '--generated-brand-accent-2',
      '--generated-brand-accent-3',
    ])
    expect(swatches[0].value.value).toBe('#ff0066')
    expect(swatches[2].value.value).toBe('#00ccff')
  })

  it('returns only parseable swatches as generation inputs', () => {
    expect(getGenerateableSwatches(testPalette).map((swatch) => swatch.token)).toEqual([
      '--test-black',
      '--test-blue-100',
      '--test-blue-500',
      '--test-blue-900',
      '--test-hot',
      '--test-cool',
    ])
  })

  it('rejects invalid recipe step counts and missing sources', () => {
    expect(() =>
      generatePalette(testPalette, {
        mode: 'tone-scale',
        seedToken: '--test-blue-500',
        steps: 1,
        lightnessCurve: 'linear',
      }),
    ).toThrow(RangeError)

    expect(() =>
      generatePalette(testPalette, {
        mode: 'blend-ramp',
        fromToken: '--test-current',
        toToken: '--test-blue-900',
        steps: 3,
      }),
    ).toThrow('Swatch is not parseable')

    expect(() => generatePalette(testPalette, { mode: 'group-smoothing', groupName: 'Missing', steps: 3 })).toThrow(
      'Unknown group',
    )
  })
})
