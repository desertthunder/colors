<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ColorFormat } from '../lib/color'
import { formatColorValue } from '../lib/color'
import type { CopyMode } from '../lib/copy'
import { formatCopyValue } from '../lib/copy'
import type { ColorSwatch } from '../lib/colors'

const props = defineProps<{ swatch: ColorSwatch; format: ColorFormat; copyMode: CopyMode }>()

const copied = ref(false)
const displayedValue = computed(() => formatColorValue(props.swatch.value, props.format))
const copiedValue = computed(() => formatCopyValue(props.swatch, props.format, props.copyMode))
const swatchStyle = computed(() => ({ '--swatch-color': props.swatch.value.value }))

async function copySwatch(): Promise<void> {
  await navigator.clipboard.writeText(copiedValue.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1200)
}
</script>

<template>
  <button type="button" class="color-swatch" :style="swatchStyle" @click="copySwatch">
    <span class="swatch-meta">
      <span class="swatch-name">{{ swatch.name }}</span>
      <code>{{ displayedValue }}</code>
      <span class="copy-state" aria-live="polite">{{ copied ? 'Copied' : copyMode }}</span>
    </span>
    <span class="sample" aria-hidden="true"></span>
  </button>
</template>

<style scoped>
.color-swatch {
  display: grid;
  gap: var(--space-2);
  min-block-size: 4.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2);
  color: var(--color-text);
  background: var(--color-surface);
  text-align: start;
}

.color-swatch:hover,
.color-swatch:focus-visible {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-soft);
}

.swatch-meta {
  display: grid;
  gap: var(--space-1);
  align-items: start;
}

.sample {
  block-size: 1.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--swatch-color);
}

.swatch-name,
.color-swatch code,
.copy-state {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

.swatch-name {
  color: var(--color-text-strong);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.color-swatch code {
  overflow-wrap: anywhere;
  color: var(--color-text-muted);
  font-size: var(--size-xs);
  line-height: var(--line-xs);
}

.copy-state {
  color: var(--color-accent-strong);
  font-size: var(--size-xs);
  font-weight: 700;
  line-height: var(--line-xs);
  text-transform: uppercase;
}
</style>
