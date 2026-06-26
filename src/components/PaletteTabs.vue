<script setup lang="ts">
import { palettes } from '../lib/colors'
import { formatHashRoute, type AppRoute } from '../lib/router'

defineProps<{ route: AppRoute }>()
</script>

<template>
  <nav class="palette-tabs" aria-label="Palette navigation">
    <article
      v-for="palette in palettes"
      :key="palette.id"
      class="palette-card"
      :data-active="route.page === palette.id ? '' : undefined">
      <a
        class="palette-link"
        :href="formatHashRoute({ page: palette.id, format: route.format })"
        :aria-current="route.page === palette.id ? 'page' : undefined">
        <span>{{ palette.name }}</span>
        <small>{{ palette.groups.length }} groups</small>
      </a>
      <a class="source-link" :href="palette.sourceUrl" target="_blank" rel="noreferrer">Source</a>
    </article>
  </nav>
</template>

<style scoped>
.palette-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
}

.palette-card {
  display: grid;
  gap: var(--space-2);
  min-block-size: 4.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  color: var(--color-text-muted);
  background: var(--color-surface);
}

.palette-link {
  display: grid;
  gap: var(--space-1);
  text-decoration: none;
}

.palette-link span {
  color: var(--color-text-strong);
  font-family: var(--font-display);
  font-size: var(--size-base);
  font-weight: 700;
  line-height: var(--line-base);
}

.palette-link small,
.source-link {
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.source-link {
  justify-self: start;
  color: var(--color-text-muted);
  font-weight: 700;
  text-underline-offset: 0.2em;
}

.palette-card:hover,
.palette-card:focus-within,
.palette-card[data-active] {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.palette-card:hover .palette-link span,
.palette-card:focus-within .palette-link span,
.palette-card[data-active] .palette-link span,
.source-link:hover,
.source-link:focus-visible {
  color: var(--color-accent-strong);
}

@media (max-width: 48rem) {
  .palette-tabs {
    grid-template-columns: repeat(3, minmax(11rem, 1fr));
    overflow-x: auto;
    padding-block-end: var(--space-1);
    scrollbar-width: thin;
  }
}
</style>
