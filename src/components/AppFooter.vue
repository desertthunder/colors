<script setup lang="ts">
import { useTheme } from '../lib/theme'
import darkModeIcon from '../assets/dark-mode.svg'
import lightModeIcon from '../assets/light-mode.svg'

const appVersion = __APP_VERSION__
const { theme, toggleTheme } = useTheme()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-primary">
      <p>
        Built by
        <a href="https://desertthunder.dev" target="_blank" rel="noreferrer">Owais </a> in Austin, TX.
      </p>
      <p>License: <a href="https://spdx.org/licenses/MIT" target="_blank">MIT</a></p>
      <p :title="appVersion.commit">Version: {{ appVersion.display }}</p>
    </div>

    <div class="footer-secondary">
      <nav class="footer-links" aria-label="Developer links">
        <a href="https://github.com/desertthunder/colors" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://desertthunder.dev" target="_blank" rel="noreferrer">Website</a>
      </nav>
      <div>
        <button
          type="button"
          class="theme-toggle"
          :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
          @click="toggleTheme">
          <img class="theme-icon" :src="theme === 'dark' ? lightModeIcon : darkModeIcon" alt="" aria-hidden="true" />
          <span>{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  inline-size: 100%;
  background: var(--color-chrome);
  padding-inline: max(var(--space-5), calc((100vw - var(--measure)) / 2 + var(--space-5)));
  padding-block: var(--space-5);
  border-block-start: 1px solid var(--color-chrome);
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.footer-primary {
  display: grid;
  gap: var(--space-1);
}

.footer-secondary {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-strong);
  background: var(--color-surface);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.theme-toggle:hover {
  cursor: pointer;
}

.theme-toggle:hover,
.theme-toggle:focus-visible {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.theme-icon {
  inline-size: 1rem;
  block-size: 1rem;
}

.app-footer a {
  color: var(--color-text-strong);
  font-weight: 700;
  text-decoration-color: color-mix(in srgb, var(--color-accent) 45%, transparent);
  text-underline-offset: 0.2em;
}

.app-footer a:hover,
.app-footer a:focus-visible {
  color: var(--color-accent-strong);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 48rem) {
  .app-footer {
    align-items: flex-start;
    flex-direction: column;
    padding-inline: var(--space-4);
  }

  .footer-links {
    flex: 1;
  }

  .footer-secondary {
    flex-direction: row;
    align-items: center;
    justify-content: justify-between;
    width: 100%;
    padding: var(--space-1) var(--space-2) 0 0;
  }
}
</style>
