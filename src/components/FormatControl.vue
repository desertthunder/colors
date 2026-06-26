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
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  padding: var(--space-1);
}

.format-options button {
  min-inline-size: 3.75rem;
  border: 0;
  border-radius: 999px;
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  background: transparent;
  font-family: var(--font-code);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.format-options button:hover,
.format-options button:focus-visible,
.format-options button[aria-pressed='true'] {
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

@media (max-width: 34rem) {
  .format-options {
    inline-size: 100%;
  }

  .format-options button {
    flex: 1 1 0;
    min-inline-size: 0;
  }
}
</style>
