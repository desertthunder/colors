<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatColorValue, type ColorFormat } from '../lib/color'
import type { Palette } from '../lib/colors'
import {
  downloadPngSwatchSheet,
  downloadSvgSwatchSheet,
  formatCssVariableGroup,
  formatCssVariables,
} from '../lib/export'
import { generatePalette, getGenerateableSwatches, type GeneratedPalette, type PaletteRecipe } from '../lib/generate'
import { getGeneratedWarnings } from '../lib/generate/warnings'
import AppDialog from './AppDialog.vue'

const props = defineProps<{
  open: boolean
  palette: Palette
  format: ColorFormat
  generatedPalette: GeneratedPalette | null
}>()

const emit = defineEmits<{ 'update:open': [open: boolean]; generated: [palette: GeneratedPalette] }>()

const mode = ref<PaletteRecipe['mode']>('tone-scale')
const seedToken = ref('')
const fromToken = ref('')
const toToken = ref('')
const groupName = ref('')
const steps = ref(6)
const lightnessCurve = ref<'linear' | 'tailwind-like'>('tailwind-like')
const error = ref('')
const copiedTarget = ref('')

let copiedTimer = 0

const swatches = computed(() => getGenerateableSwatches(props.palette))
const groups = computed(() =>
  props.palette.groups.filter(
    (group) => group.swatches.filter((swatch) => swatch.value.space !== 'keyword').length >= 2,
  ),
)
const warnings = computed(() => (props.generatedPalette ? getGeneratedWarnings(props.generatedPalette) : []))
const hasGeneratedPalette = computed(() => Boolean(props.generatedPalette))
const generatedSwatches = computed(() => props.generatedPalette?.groups.flatMap((group) => group.swatches) ?? [])
const previewSwatches = computed(() => generatedSwatches.value.slice(0, 12))

watch(
  () => props.palette.id,
  () => {
    resetDefaults()
  },
  { immediate: true },
)

function resetDefaults(): void {
  const firstSwatch = swatches.value[0]
  const secondSwatch = swatches.value[1] ?? firstSwatch

  seedToken.value = firstSwatch?.token ?? ''
  fromToken.value = firstSwatch?.token ?? ''
  toToken.value = secondSwatch?.token ?? ''
  groupName.value = groups.value[0]?.name ?? ''
  steps.value = 6
  lightnessCurve.value = 'tailwind-like'
  error.value = ''
  copiedTarget.value = ''
}

function currentRecipe(): PaletteRecipe {
  if (mode.value === 'tone-scale') {
    return { mode: 'tone-scale', seedToken: seedToken.value, steps: steps.value, lightnessCurve: lightnessCurve.value }
  }

  if (mode.value === 'blend-ramp') {
    return { mode: 'blend-ramp', fromToken: fromToken.value, toToken: toToken.value, steps: steps.value }
  }

  return { mode: 'group-smoothing', groupName: groupName.value, steps: steps.value }
}

function generate(): void {
  try {
    error.value = ''
    emit('generated', generatePalette(props.palette, currentRecipe()))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to generate palette.'
  }
}

async function copyGeneratedCss(): Promise<void> {
  if (!props.generatedPalette) return
  await copyText(formatCssVariables(props.generatedPalette, props.format), 'palette-css')
}

async function copyGeneratedGroupCss(groupName: string): Promise<void> {
  const group = props.generatedPalette?.groups.find((candidate) => candidate.name === groupName)
  if (!props.generatedPalette || !group) return
  await copyText(formatCssVariableGroup(props.generatedPalette.id, group, props.format), `group-css-${groupName}`)
}

function downloadGeneratedSvg(): void {
  if (!props.generatedPalette) return
  downloadSvgSwatchSheet(props.generatedPalette, props.format)
}

async function downloadGeneratedPng(): Promise<void> {
  if (!props.generatedPalette) return
  await downloadPngSwatchSheet(props.generatedPalette, props.format)
}

async function copyText(value: string, target: string): Promise<void> {
  await navigator.clipboard.writeText(value)
  copiedTarget.value = target
  if (copiedTimer) window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => {
    copiedTarget.value = ''
  }, 1200)
}
</script>

<template>
  <AppDialog
    :open="open"
    title="Generate and export"
    :description="palette.name"
    placement="drawer"
    @update:open="$emit('update:open', $event)">
    <div class="drawer-stack">
      <form class="generator-form" @submit.prevent="generate">
        <fieldset>
          <legend>Recipe</legend>

          <label>
            <span>Mode</span>
            <select v-model="mode">
              <option value="tone-scale">Tone scale</option>
              <option value="blend-ramp">Blend ramp</option>
              <option value="group-smoothing">Group smoothing</option>
            </select>
          </label>

          <label v-if="mode === 'tone-scale'">
            <span>Seed</span>
            <select v-model="seedToken">
              <option v-for="swatch in swatches" :key="swatch.token" :value="swatch.token">
                {{ swatch.name }}
              </option>
            </select>
          </label>

          <template v-if="mode === 'blend-ramp'">
            <label>
              <span>From</span>
              <select v-model="fromToken">
                <option v-for="swatch in swatches" :key="swatch.token" :value="swatch.token">
                  {{ swatch.name }}
                </option>
              </select>
            </label>

            <label>
              <span>To</span>
              <select v-model="toToken">
                <option v-for="swatch in swatches" :key="swatch.token" :value="swatch.token">
                  {{ swatch.name }}
                </option>
              </select>
            </label>
          </template>

          <label v-if="mode === 'group-smoothing'">
            <span>Group</span>
            <select v-model="groupName">
              <option v-for="group in groups" :key="group.name" :value="group.name">
                {{ group.name }}
              </option>
            </select>
          </label>

          <label v-if="mode === 'tone-scale'">
            <span>Curve</span>
            <select v-model="lightnessCurve">
              <option value="tailwind-like">Tailwind-like</option>
              <option value="linear">Linear</option>
            </select>
          </label>

          <label>
            <span>Steps</span>
            <input v-model.number="steps" type="number" min="2" max="32" step="1" />
          </label>
        </fieldset>

        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      </form>

      <section class="palette-preview" :aria-disabled="!hasGeneratedPalette">
        <div class="section-heading">
          <h3>Generated palette</h3>
          <p v-if="generatedPalette">{{ generatedSwatches.length }} swatches</p>
        </div>

        <div v-if="generatedPalette" class="swatch-preview" aria-label="Generated swatches">
          <article v-for="swatch in previewSwatches" :key="swatch.token" class="preview-swatch">
            <span class="preview-chip" :style="{ backgroundColor: swatch.value.value }" aria-hidden="true"></span>
            <span class="preview-text">
              <strong>{{ swatch.name }}</strong>
              <code>{{ swatch.token }}</code>
              <code>{{ formatColorValue(swatch.value, format) }}</code>
            </span>
          </article>
        </div>

        <p v-else class="empty-state">Generate a palette to preview swatches and formatted values.</p>
      </section>

      <section v-if="generatedPalette" class="css-preview" aria-labelledby="css-preview-title">
        <div class="section-heading">
          <h3 id="css-preview-title">CSS variables</h3>
          <p>{{ format }}</p>
        </div>

        <pre><code>{{ formatCssVariables(generatedPalette, format) }}</code></pre>
      </section>

      <section class="warning-panel">
        <ul v-if="warnings.length" class="warning-list" aria-label="Generated palette warnings">
          <li v-for="warning in warnings" :key="warning.type">
            <strong>{{ warning.message }}</strong>
            <span>{{ warning.tokens.join(', ') }}</span>
          </li>
        </ul>

        <p v-else class="empty-state">
          {{ generatedPalette ? 'No generated warnings.' : 'Warnings appear after generation.' }}
        </p>
      </section>
    </div>

    <template #footer>
      <button type="button" class="primary-action" @click="generate">Generate</button>

      <button type="button" :disabled="!generatedPalette" @click="copyGeneratedCss">
        {{ copiedTarget === 'palette-css' ? 'Copied CSS' : 'Copy CSS' }}
      </button>
      <button type="button" :disabled="!generatedPalette" @click="downloadGeneratedSvg">SVG</button>
      <button type="button" :disabled="!generatedPalette" @click="downloadGeneratedPng">PNG</button>

      <button
        v-for="group in generatedPalette?.groups ?? []"
        :key="group.name"
        type="button"
        @click="copyGeneratedGroupCss(group.name)">
        {{ copiedTarget === `group-css-${group.name}` ? 'Copied group' : 'Group CSS' }}
      </button>
    </template>
  </AppDialog>
</template>

<style scoped>
.drawer-stack {
  display: grid;
  gap: var(--space-5);
}

.generator-form,
.palette-preview,
.css-preview,
.warning-panel {
  display: grid;
  gap: var(--space-4);
}

.generator-form fieldset {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  border: 0;
}

.generator-form legend,
.section-heading h3 {
  margin-block-end: var(--space-1);
  color: var(--color-text-strong);
  font-family: var(--font-display);
  font-size: var(--size-lg);
  font-weight: 700;
  line-height: var(--line-lg);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-3);
}

.section-heading p {
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: var(--size-xs);
  line-height: var(--line-xs);
}

.generator-form label {
  display: grid;
  gap: var(--space-2);
}

.generator-form label span {
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.generator-form select,
.generator-form input {
  block-size: 2.75rem;
  inline-size: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-strong);
  background: var(--color-surface);
  font-size: var(--size-sm);
}

.generator-form select:hover,
.generator-form select:focus-visible,
.generator-form input:hover,
.generator-form input:focus-visible {
  border-color: var(--color-accent);
}

:global(.dialog-footer button) {
  min-block-size: 2.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-strong);
  background: var(--color-surface);
  font-size: var(--size-sm);
  font-weight: 700;
}

:global(.dialog-footer .primary-action) {
  border-color: var(--color-accent);
  color: var(--color-page);
  background: var(--color-accent-strong);
}

:global(.dialog-footer button:hover),
:global(.dialog-footer button:focus-visible) {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-soft);
}

:global(.dialog-footer button:disabled) {
  cursor: not-allowed;
  opacity: 0.55;
}

.swatch-preview {
  display: grid;
  gap: var(--space-2);
}

.preview-swatch {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-items: stretch;
  gap: var(--space-2);
  min-block-size: 4rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface);
}

.preview-chip {
  min-block-size: 100%;
}

.preview-text {
  display: grid;
  align-content: center;
  gap: var(--space-1);
  min-inline-size: 0;
  padding: var(--space-2);
}

.preview-text strong,
.preview-text code {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

.preview-text strong {
  color: var(--color-text-strong);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.preview-text code {
  color: var(--color-text-muted);
  font-size: var(--size-xs);
  line-height: var(--line-xs);
}

.css-preview pre {
  max-block-size: 14rem;
  overflow: auto;
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  color: var(--color-text);
  background: var(--color-page);
  font-size: var(--size-xs);
  line-height: var(--line-xs);
}

.warning-list {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.warning-list li {
  display: grid;
  gap: var(--space-1);
  border-inline-start: 3px solid var(--color-accent);
  padding: var(--space-2) var(--space-3);
  background: var(--color-accent-soft);
}

.warning-list strong,
.warning-list span,
.empty-state,
.form-error {
  overflow-wrap: anywhere;
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.warning-list span,
.empty-state {
  color: var(--color-text-muted);
}

.form-error {
  color: var(--color-accent-strong);
  font-weight: 700;
}

@media (max-width: 34rem) {
  .section-heading {
    display: grid;
    align-items: start;
  }
}
</style>
