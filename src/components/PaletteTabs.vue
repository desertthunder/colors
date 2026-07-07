<script setup lang="ts">
import { palettes } from '../lib/colors'
import type { GeneratedPalette } from '../lib/generate'
import { formatHashRoute, type AppRoute } from '../lib/router'

defineProps<{ route: AppRoute; generatedPalette?: GeneratedPalette | null; activeGenerated?: boolean }>()
defineEmits<{ selectGenerated: [] }>()
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
        :href="formatHashRoute({ ...route, page: palette.id })"
        :aria-current="route.page === palette.id ? 'page' : undefined">
        <span>{{ palette.name }}</span>
        <small>{{ palette.groups.length }} groups</small>
      </a>
      <span class="palette-actions">
        <a class="palette-action" :href="palette.sourceUrl" target="_blank" rel="noreferrer">Source</a>
        <a
          class="palette-action"
          :href="formatHashRoute({ ...route, page: palette.id, search: '', swatch: null, download: 'json' })">
          JSON
        </a>
      </span>
    </article>

    <article v-if="generatedPalette" class="palette-card" :data-active="activeGenerated ? '' : undefined">
      <button
        type="button"
        class="palette-link generated-tab"
        :aria-current="activeGenerated ? 'page' : undefined"
        @click="$emit('selectGenerated')">
        <span>Generated</span>
        <small>{{ generatedPalette.groups.length }} groups</small>
      </button>
      <button type="button" class="palette-action generated-source" @click="$emit('selectGenerated')">Open</button>
    </article>
  </nav>
</template>

<style scoped>
.palette-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: var(--space-2);
}

.palette-card {
  display: grid;
  gap: var(--space-2);
  min-block-size: 4.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  /* padding: var(--space-3); */
  color: var(--color-text-muted);
  background: var(--color-surface);
}

.palette-link {
  display: grid;
  gap: var(--space-1);
  inline-size: 100%;
  border: 0;
  text-decoration: none;
  border-bottom: 2px dotted var(--color-text-muted);
  padding: var(--space-3);
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: start;
}

.palette-link span {
  color: var(--color-text-strong);
  font-family: var(--font-display);
  font-size: var(--size-base);
  font-weight: 700;
  line-height: var(--line-base);
}

.palette-link small,
.palette-action {
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.palette-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.palette-action {
  text-align: center;
  color: var(--color-text-muted);
  font-weight: 700;
  text-underline-offset: 0.2em;
  inline-size: 100%;
  border: 0;
  padding-inline: var(--space-2);
  padding-bottom: var(--space-3);
  background: transparent;
  font: inherit;
}

.generated-tab,
.generated-source {
  cursor: pointer;
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
.palette-action:hover,
.palette-action:focus-visible {
  color: var(--color-accent-strong);
}

@media (max-width: 48rem) {
  .palette-tabs {
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    overflow-x: auto;
    padding-block-end: var(--space-1);
    scrollbar-width: thin;
  }
}
</style>
