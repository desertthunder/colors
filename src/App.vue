<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppShell from './components/AppShell.vue'
import { defaultRoute, parseHashRoute, writeHashRoute } from './lib/router'

const route = ref(parseHashRoute(window.location.hash))

function syncRoute() {
  route.value = parseHashRoute(window.location.hash)
}

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
  <AppShell :route="route" />
</template>
