<script setup lang="ts">
import type { ColorFormat } from '../lib/color'
import type { CopyMode } from '../lib/copy'
import type { ColorGroup, PaletteId } from '../lib/colors'
import { slugify } from '../lib/slug'
import ColorSwatch from './ColorSwatch.vue'

defineProps<{ paletteId: PaletteId; group: ColorGroup; format: ColorFormat; copyMode: CopyMode }>()
</script>

<template>
  <section
    class="color-group"
    :id="`${paletteId}-${slugify(group.name)}`"
    :aria-labelledby="`${paletteId}-${slugify(group.name)}-title`">
    <h3 :id="`${paletteId}-${slugify(group.name)}-title`" class="group-heading">
      <span>{{ group.name }}</span>
      <span class="group-ramp" aria-hidden="true">
        <span
          v-for="swatch in group.swatches"
          :key="swatch.name"
          class="group-ramp-swatch"
          :style="{ backgroundColor: swatch.value.value }"></span>
      </span>
    </h3>

    <div class="swatch-grid">
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
  gap: var(--space-3);
  scroll-margin-block-start: var(--space-8);
}

.group-heading {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--size-lg);
  line-height: var(--line-lg);
}

.group-ramp {
  display: grid;
  grid-auto-columns: minmax(0.75rem, 1fr);
  grid-auto-flow: column;
  inline-size: min(12rem, 45vw);
  block-size: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 999px;
}

.group-ramp-swatch {
  min-inline-size: 0.5rem;
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, max(8.5rem, calc((100% - 5 * var(--space-2)) / 6))), 1fr));
  gap: var(--space-2);
}

@media (max-width: 34rem) {
  .group-heading {
    align-items: start;
    flex-direction: column;
  }

  .group-ramp {
    inline-size: 100%;
  }
}
</style>
