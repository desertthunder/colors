import { describe, expect, it } from 'vitest'
import {
  formatPaletteJson,
  formatCssVariableGroup,
  formatCssVariables,
  formatSvgSwatchSheet,
  getPaletteJsonFilename,
  getSwatchSheetFilename,
  type ExportablePalette,
} from '../export'

const testPalette = {
  id: 'generated-test',
  name: 'Generated <Brand> & Friends',
  sourceUrl: 'https://example.com/palette?name=Generated&mode=test',
  groups: [
    {
      name: 'Blue & Gray',
      swatches: [
        { name: 'Blue <500>', token: '--generated-blue-500', value: { space: 'hex', value: '#3b82f6' } },
        { name: 'Soft White', token: '--generated-soft-white', value: { space: 'hex', value: '#f8fafc' } },
      ],
    },
  ],
} satisfies ExportablePalette

describe('formatCssVariables', () => {
  it('formats a complete palette as CSS variables in every color format', () => {
    expect(formatCssVariables(testPalette, 'hex')).toBe(
      [':root {', '  --generated-blue-500: #3b82f6;', '  --generated-soft-white: #f8fafc;', '}'].join('\n'),
    )
    expect(formatCssVariables(testPalette, 'rgb')).toContain('  --generated-blue-500: rgb(59, 130, 246);')
    expect(formatCssVariables(testPalette, 'hsl')).toContain('  --generated-blue-500: hsl(217.22, 91.22%, 59.8%);')
    expect(formatCssVariables(testPalette, 'oklch')).toContain('  --generated-blue-500: oklch(')
  })

  it('formats one group without changing token names', () => {
    expect(formatCssVariableGroup(testPalette.id, testPalette.groups[0], 'hex')).toBe(
      [':root {', '  --generated-blue-500: #3b82f6;', '  --generated-soft-white: #f8fafc;', '}'].join('\n'),
    )
  })
})

describe('formatSvgSwatchSheet', () => {
  it('builds deterministic SVG structure and dimensions', () => {
    const svg = formatSvgSwatchSheet(testPalette, 'hex', {
      columns: 2,
      swatchWidth: 100,
      swatchHeight: 60,
      gap: 10,
      padding: 8,
      headerHeight: 30,
    })

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('width="226" height="106" viewBox="0 0 226 106"')
    expect(svg).toContain('<g transform="translate(8 38)">')
    expect(svg).toContain('<g transform="translate(118 38)">')
    expect(svg).toContain('fill="#3b82f6"')
    expect(svg).toContain('--generated-blue-500 - #3b82f6')
  })

  it('escapes injected labels and source text', () => {
    const svg = formatSvgSwatchSheet(testPalette, 'hex', { columns: 1 })

    expect(svg).toContain('Generated &lt;Brand&gt; &amp; Friends swatches')
    expect(svg).toContain('Source: https://example.com/palette?name=Generated&amp;mode=test')
    expect(svg).toContain('Blue &amp; Gray / Blue &lt;500&gt;')
    expect(svg).not.toContain('Blue & Gray / Blue <500>')
  })

  it('returns stable filenames', () => {
    expect(getSwatchSheetFilename(testPalette, 'svg')).toBe('generated-brand-friends-swatches.svg')
    expect(getSwatchSheetFilename({ id: 'generated-fallback', name: '   ' }, 'png')).toBe(
      'generated-fallback-swatches.png',
    )
  })
})

describe('formatPaletteJson', () => {
  it('formats palette objects as deterministic readable JSON', () => {
    const parsed = JSON.parse(formatPaletteJson(testPalette))

    expect(parsed).toEqual(testPalette)
    expect(formatPaletteJson(testPalette)).toContain('\n  "groups": [')
    expect(formatPaletteJson(testPalette).endsWith('\n')).toBe(true)
  })

  it('returns stable JSON filenames', () => {
    expect(getPaletteJsonFilename(testPalette)).toBe('generated-brand-friends-palette.json')
    expect(getPaletteJsonFilename({ id: 'fallback-json', name: '   ' })).toBe('fallback-json-palette.json')
  })
})
