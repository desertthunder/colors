import type { GeneratedPalette, GeneratedSwatchMeta } from '../generate'

export type GeneratedWarningType = 'low-contrast-black' | 'low-contrast-white' | 'clipped-gamut' | 'mapped-color'

export type GeneratedWarning = { type: GeneratedWarningType; message: string; tokens: string[] }

const defaultContrastRatio = 4.5
const defaultMaterialDeltaE = 2

/** Returns user-facing warning summaries for generated color quality checks. */
export function getGeneratedWarnings(
  palette: GeneratedPalette,
  contrastRatio = defaultContrastRatio,
  materialDeltaE = defaultMaterialDeltaE,
): GeneratedWarning[] {
  const warnings = [
    warningFor(
      'low-contrast-white',
      palette.swatches.filter((swatch) => swatch.contrastWithWhite < contrastRatio),
      `Low contrast on white below ${contrastRatio}:1`,
    ),
    warningFor(
      'low-contrast-black',
      palette.swatches.filter((swatch) => swatch.contrastWithBlack < contrastRatio),
      `Low contrast on black below ${contrastRatio}:1`,
    ),
    warningFor(
      'clipped-gamut',
      palette.swatches.filter((swatch) => swatch.clipped),
      'Mapped into sRGB gamut',
    ),
    warningFor(
      'mapped-color',
      palette.swatches.filter((swatch) => swatch.deltaE >= materialDeltaE),
      `Changed materially during gamut mapping (Delta E >= ${materialDeltaE})`,
    ),
  ]

  return warnings.filter((warning): warning is GeneratedWarning => Boolean(warning))
}

function warningFor(
  type: GeneratedWarningType,
  swatches: GeneratedSwatchMeta[],
  message: string,
): GeneratedWarning | undefined {
  if (!swatches.length) return undefined
  return { type, message, tokens: swatches.map((swatch) => swatch.token) }
}
