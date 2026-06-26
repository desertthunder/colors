<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import IntroSection from './IntroSection.vue'
import type { AppRoute } from '../lib/router'

defineProps<{ route: AppRoute }>()
</script>

<template>
  <div class="app-shell">
    <AppHeader :route="route" />

    <main class="app-main">
      <IntroSection :route="route" />
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
  padding-block: var(--space-8);
}

@media (max-width: 48rem) {
  .app-shell {
    padding-inline: var(--space-4);
  }
}
</style>
