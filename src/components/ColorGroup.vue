<script setup lang="ts">
import { computed } from 'vue'
import { getLightestSwatchValue, type ColorFormat } from '../lib/color'
import type { CopyMode } from '../lib/copy'
import type { ColorGroup, PaletteId } from '../lib/colors'
import { slugify } from '../lib/slug'
import ColorSwatch from './ColorSwatch.vue'

const props = defineProps<{
  paletteId: PaletteId
  group: ColorGroup
  format: ColorFormat
  copyMode: CopyMode
  isActive: boolean
  isOpen: boolean
}>()

defineEmits<{ toggle: [] }>()

const bodyBackground = computed(() => getLightestSwatchValue(props.group.swatches) ?? 'var(--color-surface)')
</script>

<template>
  <section
    class="color-group"
    :class="{ 'is-active': isActive }"
    :id="`${paletteId}-${slugify(group.name)}`"
    :aria-labelledby="`${paletteId}-${slugify(group.name)}-title`">
    <h3 class="group-heading">
      <button
        :id="`${paletteId}-${slugify(group.name)}-title`"
        type="button"
        class="group-toggle"
        :aria-expanded="isOpen"
        :aria-controls="`${paletteId}-${slugify(group.name)}-panel`"
        @click="$emit('toggle')">
        <span class="group-summary">
          <span class="group-title">{{ group.name }}</span>
          <span class="group-count">{{ group.swatches.length }}</span>
          <span class="group-ramp" aria-hidden="true">
            <span
              v-for="swatch in group.swatches"
              :key="swatch.name"
              class="group-ramp-swatch"
              :style="{ backgroundColor: swatch.value.value }"></span>
          </span>
        </span>
        <span class="group-chevron" aria-hidden="true"></span>
      </button>
    </h3>

    <div
      v-show="isOpen"
      :id="`${paletteId}-${slugify(group.name)}-panel`"
      class="swatch-grid"
      :style="{ '--group-body-background': bodyBackground }">
      <ColorSwatch
        v-for="swatch in group.swatches"
        :key="swatch.name"
        :swatch="swatch"
        :format="format"
        :copy-mode="copyMode" />
    </div>
  </section>
</template>

<style scoped>
.color-group {
  display: grid;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  scroll-margin-block-start: var(--space-8);
}

.color-group.is-active {
  border-color: var(--color-accent);
}

.group-heading {
  position: relative;
  font-size: var(--size-lg);
  line-height: var(--line-lg);
}

.group-toggle {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1rem;
  align-items: center;
  gap: var(--space-3);
  inline-size: 100%;
  border: 0;
  border-block-end: 1px solid var(--color-border);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  padding: var(--space-3);
  color: var(--color-text-strong);
  background: var(--color-surface);
  text-align: start;
}

.group-toggle:hover,
.group-toggle:focus-visible {
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.is-active .group-toggle {
  border-block-end-color: var(--color-accent);
  background: var(--color-accent-soft);
}

.group-summary {
  display: grid;
  grid-template-columns: max-content 2.5rem minmax(8rem, 12rem);
  align-items: center;
  justify-content: start;
  gap: var(--space-3);
  min-inline-size: 0;
}

.group-title {
  font-family: var(--font-display);
  font-weight: 700;
}

.group-ramp {
  display: grid;
  grid-auto-columns: minmax(0.75rem, 1fr);
  grid-auto-flow: column;
  inline-size: 100%;
  block-size: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 999px;
}

.group-ramp-swatch {
  min-inline-size: 0.5rem;
}

.group-count {
  inline-size: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-2);
  color: var(--color-text-muted);
  background: var(--color-page);
  font-size: var(--size-xs);
  font-weight: 700;
  line-height: var(--line-xs);
  text-align: center;
}

.group-chevron {
  justify-self: end;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-inline-end: 2px solid currentColor;
  border-block-end: 2px solid currentColor;
  color: var(--color-text-muted);
  transform: rotate(45deg);
  transition: transform 160ms ease;
}

.group-toggle[aria-expanded='true'] .group-chevron {
  transform: translateY(0.125rem) rotate(225deg);
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, max(8.5rem, calc((100% - 5 * var(--space-2)) / 6))), 1fr));
  gap: var(--space-2);
  padding: var(--space-2);
  background: var(--group-body-background);
}

@media (max-width: 34rem) {
  .group-summary {
    grid-template-columns: minmax(0, max-content) 2.5rem minmax(3rem, 5rem);
  }

  .group-ramp {
    grid-column: auto;
    grid-row: auto;
  }
}
</style>
