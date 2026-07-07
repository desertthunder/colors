import {
  clampGamut,
  converter,
  differenceCiede2000,
  displayable,
  formatHex,
  interpolate,
  parse,
  wcagContrast,
} from 'culori'
import type { CuloriColor } from 'culori'
import type { ColorGroup, ColorSwatch, ColorValue, Palette, PaletteId } from './colors'
import { slugify } from './slug'

const MIN_STEPS = 2
const MAX_STEPS = 32
const MAX_POST_MAP_DELTA_E = 2
const CHROMA_FIT_ITERS = 18
const RGB_CHANNEL_TOLERANCE = 0.000001

/** Culori converters */
const C = {
  toOklch: converter('oklch'),
  toRgb: converter('rgb'),
  toRgbGamut: clampGamut('rgb'),
  diff: differenceCiede2000(),
}

type OklchColor = CuloriColor & { l: number; c: number }

type LightnessCurve = 'linear' | 'tailwind-like'

type GeneratedPaletteOpts = {
  recipe: PaletteRecipe
  slug: string
  groups: ColorGroup[]
  values: { meta: GeneratedSwatchMeta }[]
}

type GenerateSwatchOpts = { token: string; candidate: CuloriColor; sourceTokens: string[] }

export type ColorFitResult = { color: CuloriColor; adjusted: boolean; deltaE: number }

export type GeneratedPalette = {
  id: string
  name: string
  sourcePaletteId: PaletteId
  recipe: PaletteRecipe
  groups: ColorGroup[]
  swatches: GeneratedSwatchMeta[]
}

export type GeneratedSwatchMeta = {
  token: string
  sourceTokens: string[]
  clipped: boolean
  deltaE: number
  contrastWithBlack: number
  contrastWithWhite: number
}

export type ToneScaleRecipe = { mode: 'tone-scale'; seedToken: string; steps: number; lightnessCurve: LightnessCurve }

export type BlendRampRecipe = { mode: 'blend-ramp'; fromToken: string; toToken: string; steps: number }

export type GroupSmoothingRecipe = { mode: 'group-smoothing'; groupName: string; steps: number }

export type HarmonyKind = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary'

export type HarmonyRecipe = {
  mode: 'harmony'
  seedToken: string
  harmony: HarmonyKind
  steps: number
  lightnessCurve: LightnessCurve
}

export type PaletteRecipe = ToneScaleRecipe | BlendRampRecipe | GroupSmoothingRecipe | HarmonyRecipe

type GenerateTokenScaleOpts = {
  tokenSlug: string
  seedOklch: OklchColor
  steps: number
  lightnessCurve: LightnessCurve
  sourceTokens: string[]
}

type TokenScaleValues = { swatch: ColorSwatch; meta: GeneratedSwatchMeta }

/** Generates deterministic palette groups from an existing source palette and explicit recipe. */
export function generatePalette(source: Palette, recipe: PaletteRecipe): GeneratedPalette {
  assertValidSteps(recipe.steps)
  switch (recipe.mode) {
    case 'tone-scale': {
      return generateToneScale(source, recipe)
    }
    case 'blend-ramp': {
      return generateBlendRamp(source, recipe)
    }
    case 'harmony': {
      return generateHarmony(source, recipe)
    }
    default: {
      return generateGroupSmoothing(source, recipe)
    }
  }
}

/** Returns every parseable swatch in palette order. */
export function getGenerateableSwatches(palette: Palette): ColorSwatch[] {
  return palette.groups.flatMap((group) => group.swatches).filter((swatch) => parseColorValue(swatch.value))
}

function generateToneScale(source: Palette, recipe: ToneScaleRecipe): GeneratedPalette {
  const seed = findSwatchByToken(source, recipe.seedToken)
  const seedOklch = colorToOklch(seed.value)
  const slug = slugify(seed.name || seed.token)
  const values = generateToneScaleValues(seed.name, {
    tokenSlug: slug,
    seedOklch,
    steps: recipe.steps,
    lightnessCurve: recipe.lightnessCurve,
    sourceTokens: [seed.token],
  })

  const group = { name: `${seed.name} scale`, swatches: values.map((value) => value.swatch) } satisfies ColorGroup
  return generatedPalette(source, { recipe, slug, groups: [group], values })
}

function generateBlendRamp(source: Palette, recipe: BlendRampRecipe): GeneratedPalette {
  const from = findSwatchByToken(source, recipe.fromToken)
  const to = findSwatchByToken(source, recipe.toToken)
  const ramp = interpolate([parseableColorValue(from.value), parseableColorValue(to.value)], 'oklch')
  const slug = `${slugify(from.name || from.token)}-${slugify(to.name || to.token)}`
  const positions = samplePositions(recipe.steps)
  const values = positions.map((position, index) => {
    const exactEndpoint =
      index === 0 ? parseColorValue(from.value) : index === positions.length - 1 ? parseColorValue(to.value) : undefined

    const candidate = exactEndpoint ?? ramp(position)
    const sourceTokens =
      index === 0 ? [from.token] : index === positions.length - 1 ? [to.token] : [from.token, to.token]

    return generatedSwatch(`${from.name} to ${to.name} ${index + 1}`, {
      token: `--generated-${slug}-${index + 1}`,
      candidate,
      sourceTokens,
    })
  })

  const group = { name: `${from.name} to ${to.name}`, swatches: values.map((value) => value.swatch) }
  return generatedPalette(source, { recipe, slug, groups: [group], values })
}

function generateGroupSmoothing(source: Palette, recipe: GroupSmoothingRecipe): GeneratedPalette {
  const group = source.groups.find((candidate) => candidate.name === recipe.groupName)
  if (!group) throw new Error(`Unknown group: ${recipe.groupName}`)

  const anchors = group.swatches.filter((swatch) => parseColorValue(swatch.value))
  if (anchors.length < 2) throw new Error(`Group must contain at least two parseable colors: ${recipe.groupName}`)

  const ramp = interpolate(
    anchors.map((swatch) => parseableColorValue(swatch.value)),
    'oklch',
  )
  const slug = slugify(group.name)
  const positions = samplePositions(recipe.steps)
  const values = positions.map((position, index) => {
    const first = index === 0
    const last = index === positions.length - 1
    const sourceSwatch = first ? anchors[0] : last ? anchors.at(-1) : undefined
    const candidate = sourceSwatch ? parseableColor(sourceSwatch.value) : ramp(position)
    const sourceTokens = sourceSwatch ? [sourceSwatch.token] : anchors.map((swatch) => swatch.token)

    return generatedSwatch(`${group.name} smooth ${index + 1}`, {
      token: `--generated-${slug}-${index + 1}`,
      candidate,
      sourceTokens,
    })
  })

  const generatedGroup = {
    name: `${group.name} smooth`,
    swatches: values.map((value) => value.swatch),
  } satisfies ColorGroup
  return generatedPalette(source, { recipe, slug, groups: [generatedGroup], values })
}

function generateHarmony(source: Palette, recipe: HarmonyRecipe): GeneratedPalette {
  const seed = findSwatchByToken(source, recipe.seedToken)
  const seedOklch = colorToOklch(seed.value)
  const seedSlug = slugify(seed.name || seed.token)
  const values: { swatch: ColorSwatch; meta: GeneratedSwatchMeta }[] = []
  const groups = harmonyOffsets(recipe.harmony).map((harmony) => {
    const hue = wrapHue((typeof seedOklch.h === 'number' ? seedOklch.h : 0) + harmony.offset)
    const groupSlug = `${seedSlug}-${harmony.slug}`
    const groupValues = generateToneScaleValues(`${seed.name} ${harmony.label}`, {
      tokenSlug: groupSlug,
      seedOklch: { ...seedOklch, c: seedOklch.c * harmony.chromaScale, h: hue },
      steps: recipe.steps,
      lightnessCurve: recipe.lightnessCurve,
      sourceTokens: [seed.token],
    })

    values.push(...groupValues)
    return {
      name: `${seed.name} ${harmony.label}`,
      swatches: groupValues.map((value) => value.swatch),
    } satisfies ColorGroup
  })

  return generatedPalette(source, { recipe, slug: `${seedSlug}-${recipe.harmony}`, groups, values })
}

/** Reduces OKLCH chroma until the color is displayable in sRGB without material gamut mapping. */
export function fitOklchToSrgb(color: CuloriColor): ColorFitResult {
  const oklch = safeOklch(color)
  if (!oklch) {
    const mapped = C.toRgbGamut(color)
    return { color: mapped, adjusted: !isSrgbDisplayable(color), deltaE: roundMetric(C.diff(color, mapped)) }
  }

  if (isDisplaySafe(oklch)) {
    return { color: oklch, adjusted: false, deltaE: roundMetric(C.diff(oklch, C.toRgbGamut(oklch))) }
  }

  let low = 0
  let high = oklch.c
  let best = { ...oklch, c: 0 }

  for (let iteration = 0; iteration < CHROMA_FIT_ITERS; iteration += 1) {
    const candidate = { ...oklch, c: (low + high) / 2 }
    if (isDisplaySafe(candidate)) {
      best = candidate
      low = candidate.c
    } else {
      high = candidate.c
    }
  }

  return { color: best, adjusted: true, deltaE: roundMetric(C.diff(best, C.toRgbGamut(best))) }
}

function generatedPalette(source: Palette, { recipe, slug, groups, values }: GeneratedPaletteOpts): GeneratedPalette {
  const groupName = groups.length === 1 ? groups[0].name : `${slug} harmony`

  return {
    id: `generated-${source.id}-${recipe.mode}-${slug}`,
    name: `${source.name} ${groupName}`,
    sourcePaletteId: source.id,
    recipe,
    groups,
    swatches: values.map((value) => value.meta),
  }
}

function generateToneScaleValues(namePrefix: string, opts: GenerateTokenScaleOpts): Array<TokenScaleValues> {
  const seedHue = typeof opts.seedOklch.h === 'number' ? opts.seedOklch.h : 0
  const lightnessRange = lightnessRangeForChroma(opts.seedOklch.c)

  return samplePositions(opts.steps).map((position, index) => {
    const lightness =
      opts.lightnessCurve === 'tailwind-like'
        ? tailwindLikeLightness(position, lightnessRange)
        : lerp(lightnessRange.max, lightnessRange.min, position)
    const chroma = opts.seedOklch.c * endpointChromaMultiplier(position)
    const candidate = { mode: 'oklch', l: lightness, c: chroma, h: seedHue, alpha: opts.seedOklch.alpha }

    return generatedSwatch(`${namePrefix} ${index + 1}`, {
      token: `--generated-${opts.tokenSlug}-${index + 1}`,
      candidate,
      sourceTokens: opts.sourceTokens,
    })
  })
}

function generatedSwatch(name: string, opts: GenerateSwatchOpts): { swatch: ColorSwatch; meta: GeneratedSwatchMeta } {
  const fitted = fitOklchToSrgb(opts.candidate)
  const clipped = !isSrgbDisplayable(fitted.color)
  const mapped = C.toRgbGamut(fitted.color)
  const hex = formatHex(mapped)
  if (!hex) throw new Error(`Unable to format generated color: ${opts.token}`)

  return {
    swatch: { name, token: opts.token, value: { space: 'hex', value: hex } },
    meta: {
      token: opts.token,
      sourceTokens: opts.sourceTokens,
      clipped,
      deltaE: roundMetric(C.diff(fitted.color, mapped)),
      contrastWithBlack: roundMetric(wcagContrast(mapped, '#000')),
      contrastWithWhite: roundMetric(wcagContrast(mapped, '#fff')),
    },
  }
}

function findSwatchByToken(palette: Palette, token: string): ColorSwatch {
  const swatch = palette.groups.flatMap((group) => group.swatches).find((candidate) => candidate.token === token)
  if (!swatch) throw new Error(`Unknown swatch token: ${token}`)
  if (!parseColorValue(swatch.value)) throw new Error(`Swatch is not parseable: ${token}`)
  return swatch
}

function parseableColorValue(value: ColorValue): string {
  const parsed = parseColorValue(value)
  if (!parsed) throw new Error(`Unsupported color value: ${value.value}`)
  return value.value
}

function parseColorValue(value: ColorValue): CuloriColor | undefined {
  if (value.space === 'keyword') return undefined
  return parse(value.value)
}

function colorToOklch(value: ColorValue): OklchColor {
  const oklch = C.toOklch(parseableColorValue(value))
  if (!oklch || typeof oklch.l !== 'number' || typeof oklch.c !== 'number') {
    throw new Error(`Unable to convert color to OKLCH: ${value.value}`)
  }
  return oklch as OklchColor
}

function parseableColor(value: ColorValue): CuloriColor {
  const parsed = parseColorValue(value)
  if (!parsed) throw new Error(`Unsupported color value: ${value.value}`)
  return parsed
}

function assertValidSteps(steps: number): void {
  if (!Number.isInteger(steps) || steps < MIN_STEPS || steps > MAX_STEPS) {
    throw new RangeError(`Recipe steps must be an integer from ${MIN_STEPS} to ${MAX_STEPS}.`)
  }
}

function samplePositions(steps: number): number[] {
  if (steps === 1) return [0]
  return Array.from({ length: steps }, (_, index) => index / (steps - 1))
}

function harmonyOffsets(harmony: HarmonyKind): { label: string; slug: string; offset: number; chromaScale: number }[] {
  switch (harmony) {
    case 'complementary': {
      return [
        { label: 'base', slug: 'base', offset: 0, chromaScale: 1 },
        { label: 'complement', slug: 'complement', offset: 180, chromaScale: 0.9 },
      ]
    }
    case 'analogous': {
      return [
        { label: 'left', slug: 'left', offset: -30, chromaScale: 0.96 },
        { label: 'base', slug: 'base', offset: 0, chromaScale: 1 },
        { label: 'right', slug: 'right', offset: 30, chromaScale: 0.96 },
      ]
    }
    case 'triadic': {
      return [
        { label: 'base', slug: 'base', offset: 0, chromaScale: 1 },
        { label: 'triad 1', slug: 'triad-1', offset: 120, chromaScale: 0.88 },
        { label: 'triad 2', slug: 'triad-2', offset: 240, chromaScale: 0.88 },
      ]
    }
    case 'tetradic': {
      return [
        { label: 'base', slug: 'base', offset: 0, chromaScale: 1 },
        { label: 'tetrad 1', slug: 'tetrad-1', offset: 90, chromaScale: 0.84 },
        { label: 'opposite', slug: 'opposite', offset: 180, chromaScale: 0.9 },
        { label: 'tetrad 2', slug: 'tetrad-2', offset: 270, chromaScale: 0.84 },
      ]
    }
    default: {
      return [
        { label: 'base', slug: 'base', offset: 0, chromaScale: 1 },
        { label: 'split 1', slug: 'split-1', offset: 150, chromaScale: 0.88 },
        { label: 'split 2', slug: 'split-2', offset: 210, chromaScale: 0.88 },
      ]
    }
  }
}

function safeOklch(color: CuloriColor): OklchColor | undefined {
  const oklch = C.toOklch(color)
  if (!oklch || typeof oklch.l !== 'number' || typeof oklch.c !== 'number') return undefined

  return {
    ...oklch,
    l: clamp(oklch.l, 0, 1),
    c: Math.max(0, oklch.c),
    h: typeof oklch.h === 'number' ? wrapHue(oklch.h) : 0,
  } as OklchColor
}

function isDisplaySafe(color: CuloriColor): boolean {
  if (!isSrgbDisplayable(color)) return false
  return C.diff(color, C.toRgbGamut(color)) < MAX_POST_MAP_DELTA_E
}

function isSrgbDisplayable(color: CuloriColor): boolean {
  const rgb = C.toRgb(color)
  if (!rgb) return false
  if (displayable(rgb)) return true

  const red = typeof rgb.r === 'number' ? rgb.r : Number.NaN
  const green = typeof rgb.g === 'number' ? rgb.g : Number.NaN
  const blue = typeof rgb.b === 'number' ? rgb.b : Number.NaN

  return [red, green, blue].every(
    (channel) => channel >= -RGB_CHANNEL_TOLERANCE && channel <= 1 + RGB_CHANNEL_TOLERANCE,
  )
}

function lightnessRangeForChroma(chroma: number): { min: number; max: number } {
  const risk = clamp(chroma / 0.28, 0, 1)
  return { min: lerp(0.22, 0.28, risk), max: lerp(0.94, 0.88, risk) }
}

function tailwindLikeLightness(position: number, range: { min: number; max: number }): number {
  return lerp(range.max, range.min, Math.pow(position, 0.86))
}

function endpointChromaMultiplier(position: number): number {
  return 0.12 + 0.88 * Math.pow(Math.sin(Math.PI * position), 1.15)
}

const lerp = (from: number, to: number, position: number): number => from + (to - from) * position

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

const roundMetric = (value: number): number => Number(value.toFixed(4))

const wrapHue = (hue: number): number => ((hue % 360) + 360) % 360
