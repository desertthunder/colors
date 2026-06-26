<script setup lang="ts">
import type { ColorFormat } from '../lib/color'
import type { CopyMode } from '../lib/copy'
import type { ColorGroup } from '../lib/colors'
import ColorSwatch from './ColorSwatch.vue'

defineProps<{ group: ColorGroup; format: ColorFormat; copyMode: CopyMode }>()
</script>

<template>
  <section class="color-group" :aria-labelledby="`${group.name}-title`">
    <h3 :id="`${group.name}-title`">{{ group.name }}</h3>

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
}

.color-group h3 {
  font-size: var(--size-lg);
  line-height: var(--line-lg);
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  gap: var(--space-3);
}
</style>
