<script setup lang="ts">
import { computed } from 'vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import { getPalette } from '../lib/colors'
import type { AppRoute } from '../lib/router'
import AboutView from '../pages/About.vue'
import PaletteRouteView from '../pages/Palette.vue'

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
      <AboutView v-if="route.page === 'about'" />
      <PaletteRouteView v-else-if="activePalette" :palette="activePalette" :route="route" />
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
  padding-block: var(--space-6);
}

@media (max-width: 48rem) {
  .app-shell {
    padding-inline: var(--space-4);
  }
}
</style>
