<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppShell from './components/AppShell.vue'
import Helmet from './components/Helmet.vue'
import { getPalette } from './lib/colors'
import type { Palette } from './lib/colors'
import { defaultRoute, parseHashRoute, writeHashRoute } from './lib/router'

const route = ref(parseHashRoute(window.location.hash))

function syncRoute() {
  route.value = parseHashRoute(window.location.hash)
}

const activePalette = computed<Palette | null>(() =>
  route.value.page === 'about' ? null : getPalette(route.value.page),
)

const seoTitle = computed(() => {
  if (route.value.page === 'about') return 'About — Colors'
  return activePalette.value ? `${activePalette.value.name} palette — Colors` : 'Colors'
})

const seoDescription = computed(() => {
  if (route.value.page === 'about') {
    return 'About Colors, a practical little color palette viewer built by Desert Thunder.'
  }
  if (activePalette.value) {
    return `Browse the ${activePalette.value.name} color palette and copy hex, RGB, HSL, and OKLCH values.`
  }
  return 'A practical little color palette viewer.'
})

onMounted(() => {
  if (!window.location.hash) {
    writeHashRoute(defaultRoute)
  } else {
    syncRoute()
  }

  window.addEventListener('hashchange', syncRoute)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncRoute)
})
</script>

<template>
  <Helmet :title="seoTitle" :description="seoDescription" />
  <AppShell :route="route" />
</template>
