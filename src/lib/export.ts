import type { ColorFormat } from './color'
import { formatColorValue } from './color'
import type { ColorGroup, ColorSwatch } from './colors'
import { slugify } from './slug'

type FormatSvgOpts = { swatch: ColorSwatch; index: number; format: ColorFormat; sheet: ResolvedSwatchSheetOptions }

export type ExportablePalette = { id: string; name: string; sourceUrl?: string; groups: ColorGroup[] }

export type SwatchSheetOptions = {
  columns?: number
  swatchWidth?: number
  swatchHeight?: number
  gap?: number
  padding?: number
  headerHeight?: number
}

type ResolvedSwatchSheetOptions = Required<SwatchSheetOptions>

const defaultSheetOptions = {
  columns: 4,
  swatchWidth: 200,
  swatchHeight: 96,
  gap: 16,
  padding: 24,
  headerHeight: 64,
} satisfies ResolvedSwatchSheetOptions

/** Formats a complete palette as CSS custom properties in the selected color format. */
export function formatCssVariables(palette: ExportablePalette, format: ColorFormat): string {
  return formatCssRootBlock(palette.groups.flatMap((group) => formatCssVariableGroupLines(group, format)))
}

/** Formats one palette group as CSS custom properties in the selected color format. */
export function formatCssVariableGroup(_paletteId: string, group: ColorGroup, format: ColorFormat): string {
  return formatCssRootBlock(formatCssVariableGroupLines(group, format))
}

/** Builds a deterministic standalone SVG swatch sheet for a palette. */
export function formatSvgSwatchSheet(
  palette: ExportablePalette,
  format: ColorFormat,
  options: SwatchSheetOptions = {},
): string {
  const sheet = resolveSheetOptions(options)
  const swatches = palette.groups.flatMap((group) => group.swatches.map((swatch) => ({ group, swatch })))
  const rowCount = Math.ceil(swatches.length / sheet.columns)
  const width = sheet.padding * 2 + sheet.columns * sheet.swatchWidth + Math.max(0, sheet.columns - 1) * sheet.gap
  const height =
    sheet.padding * 2 + sheet.headerHeight + rowCount * sheet.swatchHeight + Math.max(0, rowCount - 1) * sheet.gap
  const titleId = `${slugify(palette.name) || palette.id}-title`
  const sourceText = palette.sourceUrl ? `Source: ${palette.sourceUrl}` : `Palette: ${palette.id}`
  const cells = swatches.map(({ group, swatch }, index) => formatSvgSwatch(group, { swatch, index, format, sheet }))

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${escapeXml(titleId)}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<title id="${escapeXml(titleId)}">${escapeXml(palette.name)} swatches</title>`,
    `<rect width="${width}" height="${height}" fill="#ffffff"/>`,
    `<text x="${sheet.padding}" y="${sheet.padding + 22}" fill="#111827" font-family="Arial, sans-serif" font-size="22" font-weight="700">${escapeXml(palette.name)}</text>`,
    `<text x="${sheet.padding}" y="${sheet.padding + 46}" fill="#4b5563" font-family="Arial, sans-serif" font-size="12">${escapeXml(sourceText)}</text>`,
    ...cells,
    '</svg>',
  ].join('\n')
}

/** Returns a stable export filename for a palette swatch sheet. */
export function getSwatchSheetFilename(
  palette: Pick<ExportablePalette, 'id' | 'name'>,
  extension: 'svg' | 'png',
): string {
  const slug = slugify(palette.name) || slugify(palette.id) || 'palette'
  return `${slug}-swatches.${extension}`
}

/** Downloads the generated SVG by using a browser Blob URL. */
export function downloadSvgSwatchSheet(
  palette: ExportablePalette,
  format: ColorFormat,
  options?: SwatchSheetOptions,
): void {
  const svg = formatSvgSwatchSheet(palette, format, options)
  downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), getSwatchSheetFilename(palette, 'svg'))
}

/** Browser-only PNG export path that paints the generated SVG into a canvas before downloading. */
export async function downloadPngSwatchSheet(
  palette: ExportablePalette,
  format: ColorFormat,
  options?: SwatchSheetOptions,
): Promise<void> {
  assertBrowserExport()

  const svg = formatSvgSwatchSheet(palette, format, options)
  const dimensions = getSvgDimensions(svg)
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))

  try {
    const image = await loadImage(svgUrl)
    const canvas = document.createElement('canvas')
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D rendering is unavailable.')

    context.drawImage(image, 0, 0)
    const png = await canvasToPngBlob(canvas)
    downloadBlob(png, getSwatchSheetFilename(palette, 'png'))
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

function formatCssVariableGroupLines(group: ColorGroup, format: ColorFormat): string[] {
  return group.swatches.map((swatch) => `  ${swatch.token}: ${formatColorValue(swatch.value, format)};`)
}

const formatCssRootBlock = (lines: string[]): string => [':root {', ...lines, '}'].join('\n')

function formatSvgSwatch(group: ColorGroup, { swatch, index, format, sheet }: FormatSvgOpts): string {
  const column = index % sheet.columns
  const row = Math.floor(index / sheet.columns)
  const x = sheet.padding + column * (sheet.swatchWidth + sheet.gap)
  const y = sheet.padding + sheet.headerHeight + row * (sheet.swatchHeight + sheet.gap)
  const value = formatColorValue(swatch.value, format)
  const label = `${group.name} / ${swatch.name}`

  return [
    `<g transform="translate(${x} ${y})">`,
    `<rect width="${sheet.swatchWidth}" height="${sheet.swatchHeight}" rx="6" fill="${escapeXml(value)}" stroke="#d1d5db"/>`,
    `<rect y="${sheet.swatchHeight - 42}" width="${sheet.swatchWidth}" height="42" fill="rgba(255,255,255,0.92)"/>`,
    `<text x="12" y="${sheet.swatchHeight - 24}" fill="#111827" font-family="Arial, sans-serif" font-size="12" font-weight="700">${escapeXml(label)}</text>`,
    `<text x="12" y="${sheet.swatchHeight - 10}" fill="#374151" font-family="Arial, sans-serif" font-size="11">${escapeXml(swatch.token)} - ${escapeXml(value)}</text>`,
    '</g>',
  ].join('\n')
}

function resolveSheetOptions(options: SwatchSheetOptions): ResolvedSwatchSheetOptions {
  const sheet = { ...defaultSheetOptions, ...options }
  if (!Number.isInteger(sheet.columns) || sheet.columns < 1)
    throw new RangeError('SVG sheet columns must be at least 1.')
  if (sheet.swatchWidth < 1 || sheet.swatchHeight < 1)
    throw new RangeError('SVG sheet swatches must have positive dimensions.')
  if (sheet.gap < 0 || sheet.padding < 0 || sheet.headerHeight < 0) {
    throw new RangeError('SVG sheet spacing values cannot be negative.')
  }

  return sheet
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getSvgDimensions(svg: string): { width: number; height: number } {
  const width = svg.match(/\swidth="(\d+)"/)?.[1]
  const height = svg.match(/\sheight="(\d+)"/)?.[1]
  if (!width || !height) throw new Error('SVG dimensions are missing.')
  return { width: Number(width), height: Number(height) }
}

function assertBrowserExport(): void {
  if (typeof document === 'undefined' || typeof Image === 'undefined') {
    throw new Error('PNG swatch export is only available in a browser.')
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Unable to load generated SVG for PNG export.'))
    image.src = url
  })
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
        return
      }

      reject(new Error('Unable to encode swatch sheet PNG.'))
    }, 'image/png')
  })
}

function downloadBlob(blob: Blob, filename: string): void {
  assertBrowserExport()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
