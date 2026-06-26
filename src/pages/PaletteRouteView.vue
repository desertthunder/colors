<script setup lang="ts">
import type { Palette } from '../lib/colors'
import type { AppRoute } from '../lib/router'
import PaletteView from '../components/PaletteView.vue'

defineProps<{ palette: Palette; route: AppRoute }>()
</script>

<template>
  <PaletteView :palette="palette" :route="route" />
</template>
