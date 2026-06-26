<script setup lang="ts">
import { ref } from 'vue'
import type { ColorFormat } from '../lib/color'
import { copyModes, type CopyMode } from '../lib/copy'
import type { Palette } from '../lib/colors'
import ColorGroup from './ColorGroup.vue'

defineProps<{ palette: Palette; format: ColorFormat }>()

const copyMode = ref<CopyMode>('value')
</script>

<template>
  <section class="palette-view" :aria-labelledby="`${palette.id}-title`">
    <div class="palette-toolbar">
      <div>
        <h2 :id="`${palette.id}-title`">{{ palette.name }}</h2>
        <a :href="palette.sourceUrl" target="_blank" rel="noreferrer">Source</a>
      </div>

      <fieldset class="copy-control">
        <legend>Copy</legend>
        <div class="copy-options">
          <button
            v-for="mode in copyModes"
            :key="mode"
            type="button"
            :aria-pressed="copyMode === mode"
            @click="copyMode = mode">
            {{ mode }}
          </button>
        </div>
      </fieldset>
    </div>

    <div class="palette-groups">
      <ColorGroup
        v-for="group in palette.groups"
        :key="group.name"
        :group="group"
        :format="format"
        :copy-mode="copyMode" />
    </div>
  </section>
</template>

<style scoped>
.palette-view {
  display: grid;
  gap: var(--space-6);
  padding-block-start: var(--space-6);
}

.palette-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-5);
}

.palette-toolbar h2 {
  font-size: var(--size-xl);
  line-height: var(--line-xl);
}

.palette-toolbar a {
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.copy-control {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  border: 0;
}

.copy-control legend {
  margin-block-end: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.copy-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.copy-options button {
  min-inline-size: 4.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  background: var(--color-surface);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.copy-options button:hover,
.copy-options button:focus-visible,
.copy-options button[aria-pressed='true'] {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.palette-groups {
  display: grid;
  gap: var(--space-6);
}

@media (max-width: 48rem) {
  .palette-toolbar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
