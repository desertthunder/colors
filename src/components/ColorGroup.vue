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
    <h3 :id="`${paletteId}-${slugify(group.name)}-title`">{{ group.name }}</h3>

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

.color-group h3 {
  font-size: var(--size-lg);
  line-height: var(--line-lg);
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, max(8.5rem, calc((100% - 5 * var(--space-2)) / 6))), 1fr));
  gap: var(--space-2);
}
</style>
