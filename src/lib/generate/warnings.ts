import type { GeneratedPalette, GeneratedSwatchMeta } from '../generate'

export type WarningKind = 'low-contrast' | 'clipped-gamut' | 'mapped-color'

export class Warning {
  kind: WarningKind
  message: string
  tokens: string[]

  constructor(kind: WarningKind, tokens: string[], message: string) {
    this.kind = kind
    this.message = message
    this.tokens = tokens
  }

  static For(kind: WarningKind, swatches: GeneratedSwatchMeta[], message: string): Warning | undefined {
    if (!swatches.length) return undefined
    return new Warning(
      kind,
      swatches.map((swatch) => swatch.token),
      message,
    )
  }

  /** Returns user-facing warning summaries for generated color quality checks. */
  static forPalette(
    palette: GeneratedPalette,
    contrastRatio = DEFAULT_CONTRAST_RATIO,
    materialDeltaE = DEFAULT_MATERIAL_DELTA_E,
  ): Warning[] {
    const warnings = [
      Warning.For(
        'low-contrast',
        palette.swatches.filter(
          (swatch) => Math.max(swatch.contrastWithBlack, swatch.contrastWithWhite) < contrastRatio,
        ),
        `No black or white text reaches ${contrastRatio}:1 contrast`,
      ),
      Warning.For(
        'clipped-gamut',
        palette.swatches.filter((swatch) => swatch.clipped),
        'Mapped into sRGB gamut',
      ),
      Warning.For(
        'mapped-color',
        palette.swatches.filter((swatch) => swatch.deltaE >= materialDeltaE),
        `Changed materially during gamut mapping (Delta E >= ${materialDeltaE})`,
      ),
    ]

    return warnings.filter((warning): warning is Warning => Boolean(warning))
  }
}

const DEFAULT_CONTRAST_RATIO = 4.5

const DEFAULT_MATERIAL_DELTA_E = 2
