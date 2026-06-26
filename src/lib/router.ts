import type { PaletteId } from './colors'
import type { ColorFormat } from './color'
import { isColorFormat } from './color'

/** Hash-routed pages supported by the app. */
export type AppPage = PaletteId | 'about'

/** Parsed route state derived from the URL hash. */
export type AppRoute = { page: AppPage; format: ColorFormat; search: string; swatch: string | null }

/** Route used when the current hash is empty or invalid. */
export const defaultRoute = { page: 'tailwind', format: 'hex', search: '', swatch: null } satisfies AppRoute

const appPages = ['tailwind', 'uchu', 'reasonable', 'about'] satisfies AppPage[]

/** Parses a URL hash into validated app route state. */
export function parseHashRoute(hash: string): AppRoute {
  const value = hash.replace(/^#/, '')
  const [path = '', query = ''] = value.split('?')
  const page = path.replace(/^\/+/, '')
  const params = new URLSearchParams(query)
  const format = params.get('format')
  const search = params.get('search') ?? ''
  const swatch = params.get('swatch')

  return {
    page: isAppPage(page) ? page : defaultRoute.page,
    format: isColorFormat(format) ? format : defaultRoute.format,
    search,
    swatch: swatch || null,
  }
}

/** Formats app route state as a URL hash. */
export function formatHashRoute(route: AppRoute): string {
  const params = new URLSearchParams({ format: route.format })
  if (route.search) params.set('search', route.search)
  if (route.swatch) params.set('swatch', route.swatch)
  return `#/${route.page}?${params.toString()}`
}

/** Writes route state to `window.location.hash` when it has changed. */
export function writeHashRoute(route: AppRoute): void {
  const nextHash = formatHashRoute(route)
  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash
  }
}

const isAppPage = (value: string): value is AppPage => appPages.includes(value as AppPage)
