import { describe, expect, it } from 'vitest'
import type { GeneratedPalette } from '../../generate'
import { getGeneratedWarnings } from '../../generate/warnings'

const generatedPalette = {
  id: 'generated-test',
  name: 'Generated Test',
  sourcePaletteId: 'tailwind',
  recipe: { mode: 'blend-ramp', fromToken: '--from', toToken: '--to', steps: 2 },
  groups: [],
  swatches: [
    {
      token: '--safe',
      sourceTokens: ['--from'],
      clipped: false,
      deltaE: 0.1,
      contrastWithBlack: 7,
      contrastWithWhite: 5,
    },
    { token: '--risky', sourceTokens: ['--to'], clipped: true, deltaE: 3, contrastWithBlack: 2, contrastWithWhite: 3 },
  ],
} satisfies GeneratedPalette

describe('getGeneratedWarnings', () => {
  it('summarizes low contrast, gamut clipping, and material color changes', () => {
    expect(getGeneratedWarnings(generatedPalette)).toEqual([
      { type: 'low-contrast-white', message: 'Low contrast on white below 4.5:1', tokens: ['--risky'] },
      { type: 'low-contrast-black', message: 'Low contrast on black below 4.5:1', tokens: ['--risky'] },
      { type: 'clipped-gamut', message: 'Mapped into sRGB gamut', tokens: ['--risky'] },
      { type: 'mapped-color', message: 'Changed materially during gamut mapping (Delta E >= 2)', tokens: ['--risky'] },
    ])
  })

  it('omits warning categories without affected swatches', () => {
    expect(getGeneratedWarnings({ ...generatedPalette, swatches: [generatedPalette.swatches[0]] })).toEqual([])
  })
})
