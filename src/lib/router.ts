import type { PaletteId } from './colors'
import type { ColorFormat } from './color'
import { isColorFormat } from './color'

export type AppPage = PaletteId | 'about'

export type AppRoute = { page: AppPage; format: ColorFormat }

export const defaultRoute = { page: 'tailwind', format: 'hex' } satisfies AppRoute

const appPages = ['tailwind', 'uchu', 'reasonable', 'about'] satisfies AppPage[]

export function parseHashRoute(hash: string): AppRoute {
  const value = hash.replace(/^#/, '')
  const [path = '', query = ''] = value.split('?')
  const page = path.replace(/^\/+/, '')
  const params = new URLSearchParams(query)
  const format = params.get('format')

  return {
    page: isAppPage(page) ? page : defaultRoute.page,
    format: isColorFormat(format) ? format : defaultRoute.format,
  }
}

export function formatHashRoute(route: AppRoute): string {
  return `#/${route.page}?format=${route.format}`
}

export function writeHashRoute(route: AppRoute): void {
  const nextHash = formatHashRoute(route)
  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash
  }
}

function isAppPage(value: string): value is AppPage {
  return appPages.includes(value as AppPage)
}
