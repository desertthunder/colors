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

const minSteps = 2
const maxSteps = 32
const toOklch = converter('oklch')
const toRgbGamut = clampGamut('rgb')
const colorDifference = differenceCiede2000()

type OklchColor = CuloriColor & { l: number; c: number }

type LightnessCurve = 'linear' | 'tailwind-like'

type GeneratedPaletteOpts = {
  recipe: PaletteRecipe
  slug: string
  group: ColorGroup
  values: { meta: GeneratedSwatchMeta }[]
}

type GenerateSwatchOpts = { token: string; candidate: CuloriColor; sourceTokens: string[] }

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

export type PaletteRecipe = ToneScaleRecipe | BlendRampRecipe | GroupSmoothingRecipe

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
  const seedHue = typeof seedOklch.h === 'number' ? seedOklch.h : 0
  const slug = slugify(seed.name || seed.token)
  const values = samplePositions(recipe.steps).map((position, index) => {
    const lightness =
      recipe.lightnessCurve === 'tailwind-like' ? tailwindLikeLightness(position) : lerp(0.96, 0.18, position)

    const chroma = seedOklch.c * endpointChromaMultiplier(position)
    const candidate = { mode: 'oklch', l: lightness, c: chroma, h: seedHue, alpha: seedOklch.alpha }
    return generatedSwatch(`${seed.name} ${index + 1}`, {
      token: `--generated-${slug}-${index + 1}`,
      candidate,
      sourceTokens: [seed.token],
    })
  })

  const group = { name: `${seed.name} scale`, swatches: values.map((value) => value.swatch) } satisfies ColorGroup
  return generatedPalette(source, { recipe, slug, group, values })
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
  return generatedPalette(source, { recipe, slug, group, values })
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
  return generatedPalette(source, { recipe, slug, group: generatedGroup, values })
}

function generatedPalette(source: Palette, { recipe, slug, group, values }: GeneratedPaletteOpts): GeneratedPalette {
  return {
    id: `generated-${source.id}-${recipe.mode}-${slug}`,
    name: `${source.name} ${group.name}`,
    sourcePaletteId: source.id,
    recipe,
    groups: [group],
    swatches: values.map((value) => value.meta),
  }
}

function generatedSwatch(
  name: string,
  { candidate, token, sourceTokens }: GenerateSwatchOpts,
): { swatch: ColorSwatch; meta: GeneratedSwatchMeta } {
  const clipped = !displayable(candidate)
  const mapped = toRgbGamut(candidate)
  const hex = formatHex(mapped)
  if (!hex) throw new Error(`Unable to format generated color: ${token}`)

  return {
    swatch: { name, token, value: { space: 'hex', value: hex } },
    meta: {
      token,
      sourceTokens,
      clipped,
      deltaE: roundMetric(colorDifference(candidate, mapped)),
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
  const oklch = toOklch(parseableColorValue(value))
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
  if (!Number.isInteger(steps) || steps < minSteps || steps > maxSteps) {
    throw new RangeError(`Recipe steps must be an integer from ${minSteps} to ${maxSteps}.`)
  }
}

function samplePositions(steps: number): number[] {
  if (steps === 1) return [0]
  return Array.from({ length: steps }, (_, index) => index / (steps - 1))
}

const tailwindLikeLightness = (position: number): number => lerp(0.97, 0.16, Math.pow(position, 0.86))

const endpointChromaMultiplier = (position: number): number => 0.24 + 0.76 * Math.sin(Math.PI * position)

const lerp = (from: number, to: number, position: number): number => from + (to - from) * position

const roundMetric = (value: number): number => Number(value.toFixed(4))
