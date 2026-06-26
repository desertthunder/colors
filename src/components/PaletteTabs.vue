<script setup lang="ts">
import { palettes } from '../lib/colors'
import { formatHashRoute, type AppRoute } from '../lib/router'

defineProps<{ route: AppRoute }>()
</script>

<template>
  <nav class="palette-tabs" aria-label="Palette navigation">
    <a
      v-for="palette in palettes"
      :key="palette.id"
      :href="formatHashRoute({ page: palette.id, format: route.format })"
      :aria-current="route.page === palette.id ? 'page' : undefined">
      {{ palette.name }}
    </a>
  </nav>
</template>

<style scoped>
.palette-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-block: var(--space-5);
  border-block: 1px solid var(--color-border);
}

.palette-tabs a {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  background: var(--color-surface);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
  text-decoration: none;
}

.palette-tabs a:hover,
.palette-tabs a:focus-visible,
.palette-tabs a[aria-current='page'] {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}
</style>
