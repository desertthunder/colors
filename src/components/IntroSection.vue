<script setup lang="ts">
import { computed } from 'vue'
import { getPalette } from '../lib/colors'
import type { AppRoute } from '../lib/router'

const props = defineProps<{ route: AppRoute }>()

const pageTitle = computed(() => {
  if (props.route.page === 'about') return 'About this color reference.'
  return `${getPalette(props.route.page).name} colors.`
})

const pageDescription = computed(() => {
  if (props.route.page === 'about') {
    return 'A copy-friendly browser for Tailwind v3, uchu, and Reasonable Colors.'
  }

  return `Showing ${getPalette(props.route.page).groups.length} groups with ${props.route.format} output selected.`
})
</script>

<template>
  <section class="intro" aria-labelledby="page-title">
    <p class="eyebrow">Palette reference</p>
    <h1 id="page-title">{{ pageTitle }}</h1>
    <p>{{ pageDescription }}</p>
  </section>
</template>

<style scoped>
.intro {
  display: grid;
  gap: var(--space-4);
  max-inline-size: 42rem;
}

.eyebrow {
  color: var(--color-accent-strong);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
  text-transform: uppercase;
}

.intro h1 {
  font-size: var(--size-2xl);
  line-height: var(--line-2xl);
}

.intro p:not(.eyebrow) {
  color: var(--color-text-muted);
  font-size: var(--size-lg);
  line-height: var(--line-lg);
}
</style>
