import { describe, expect, it } from 'vitest'
import type { GeneratedPalette } from '../../generate'
import { Warning } from '../../generate/warnings'

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

describe('Warning.forPalette', () => {
  it('summarizes low contrast, gamut clipping, and material color changes', () => {
    expect(Warning.forPalette(generatedPalette)).toEqual([
      new Warning('low-contrast', ['--risky'], 'No black or white text reaches 4.5:1 contrast'),
      new Warning('clipped-gamut', ['--risky'], 'Mapped into sRGB gamut'),
      new Warning('mapped-color', ['--risky'], 'Changed materially during gamut mapping (Delta E >= 2)'),
    ])
  })

  it('omits low contrast when either black or white text reaches the target', () => {
    expect(
      Warning.forPalette({
        ...generatedPalette,
        swatches: [{ ...generatedPalette.swatches[1], clipped: false, deltaE: 0.1, contrastWithBlack: 7 }],
      }),
    ).toEqual([])
  })

  it('omits warning categories without affected swatches', () => {
    expect(Warning.forPalette({ ...generatedPalette, swatches: [generatedPalette.swatches[0]] })).toEqual([])
  })
})
