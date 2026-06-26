<script setup lang="ts">
import { colorFormats, type ColorFormat } from '../lib/color'
import type { AppRoute } from '../lib/router'
import { writeHashRoute } from '../lib/router'

const props = defineProps<{ route: AppRoute }>()

function selectFormat(format: ColorFormat): void {
  writeHashRoute({ page: props.route.page, format })
}
</script>

<template>
  <fieldset class="format-control">
    <legend>Format</legend>

    <div class="format-options">
      <button
        v-for="format in colorFormats"
        :key="format"
        type="button"
        :aria-pressed="route.format === format"
        @click="selectFormat(format)">
        {{ format }}
      </button>
    </div>
  </fieldset>
</template>

<style scoped>
.format-control {
  display: grid;
  gap: var(--space-2);
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.format-control legend {
  margin-block-end: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.format-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.format-options button {
  min-inline-size: 4.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  background: var(--color-surface);
  font-family: var(--font-code);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.format-options button:hover,
.format-options button:focus-visible,
.format-options button[aria-pressed='true'] {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}
</style>
