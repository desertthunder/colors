<script setup lang="ts">
import { computed } from 'vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import FormatControl from './FormatControl.vue'
import IntroSection from './IntroSection.vue'
import PaletteTabs from './PaletteTabs.vue'
import PaletteView from './PaletteView.vue'
import { getPalette } from '../lib/colors'
import type { AppRoute } from '../lib/router'

const props = defineProps<{ route: AppRoute }>()

const activePalette = computed(() => {
  if (props.route.page === 'about') return null
  return getPalette(props.route.page)
})
</script>

<template>
  <div class="app-shell">
    <AppHeader :route="route" />

    <main class="app-main">
      <IntroSection :route="route" />
      <div v-if="activePalette" class="palette-workspace">
        <div class="palette-controls">
          <PaletteTabs :route="route" />
          <FormatControl :route="route" />
        </div>

        <PaletteView :palette="activePalette" :format="route.format" />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-block-size: 100svh;
  inline-size: min(100%, var(--measure));
  margin-inline: auto;
  padding-inline: var(--space-5);
}

.app-main {
  display: grid;
  align-content: start;
  gap: var(--space-7);
  padding-block: var(--space-8);
}

.palette-workspace {
  display: grid;
  gap: var(--space-6);
}

.palette-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: var(--space-5);
}

@media (max-width: 48rem) {
  .app-shell {
    padding-inline: var(--space-4);
  }

  .palette-controls {
    grid-template-columns: 1fr;
  }
}
</style>
