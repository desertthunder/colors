import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'colors-theme'

const prefersDark = (): boolean => window.matchMedia('(prefers-color-scheme: dark)').matches

function readTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return prefersDark() ? 'dark' : 'light'
}

/** Reactive theme state, seeded from the attribute set by the inline boot script. */
const theme = ref<Theme>((document.documentElement.dataset.theme as Theme | undefined) ?? readTheme())

watch(theme, (value) => {
  document.documentElement.dataset.theme = value
  localStorage.setItem(STORAGE_KEY, value)
})

/** Toggles between light and dark, persisting the choice to localStorage. */
export function toggleTheme(): void {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

/** Reactive theme state and toggle for use in components. */
export const useTheme = () => ({ theme, toggleTheme })
