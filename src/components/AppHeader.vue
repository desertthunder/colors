<script setup lang="ts">
import { formatHashRoute, type AppRoute } from '../lib/router'

const props = defineProps<{ route: AppRoute }>()

function href(page: AppRoute['page']): string {
  return formatHashRoute({ page, format: props.route.format })
}
</script>

<template>
  <header class="app-header">
    <a class="brand" :href="href('tailwind')" aria-label="Colors home">
      <img class="brand-mark" src="/favicon.svg" alt="" aria-hidden="true" />
      <span>Colors</span>
    </a>

    <nav class="app-nav" aria-label="Main navigation">
      <a :href="href('tailwind')" :aria-current="route.page !== 'about' ? 'page' : undefined">Palettes</a>
      <a :href="href('about')" :aria-current="route.page === 'about' ? 'page' : undefined">About</a>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  inline-size: 100%;
  background: var(--color-chrome);
  padding-inline: max(var(--space-5), calc((100vw - var(--measure)) / 2 + var(--space-5)));
  padding-block: var(--space-5);
  border-block-end: 1px solid var(--color-chrome);
}

.brand,
.app-nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-strong);
  font-family: var(--font-display);
  font-size: var(--size-lg);
  font-weight: 700;
  line-height: var(--line-lg);
  text-decoration: none;
}

.brand-mark {
  inline-size: 1.25rem;
  block-size: 1.25rem;
}

.app-nav {
  gap: var(--space-2);
}

.app-nav a {
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  font-weight: 600;
  line-height: var(--line-sm);
  text-decoration: none;
}

.app-nav a:hover,
.app-nav a:focus-visible,
.app-nav a[aria-current='page'] {
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

@media (max-width: 48rem) {
  .app-header {
    align-items: center;
    flex-direction: column;
    padding-inline: var(--space-4);
    text-align: center;
  }

  .brand {
    justify-content: center;
  }
}
</style>
