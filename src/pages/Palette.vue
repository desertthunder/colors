<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CopyMode } from '../lib/copy'
import type { GeneratedPalette } from '../lib/generate'
import type { Palette } from '../lib/colors'
import type { AppRoute } from '../lib/router'
import ColorGroup from '../components/ColorGroup.vue'
import ColorGroupNav from '../components/ColorGroupNav.vue'
import ColorSearch from '../components/ColorSearch.vue'
import FormatControl from '../components/FormatControl.vue'
import GenerateExportDrawer from '../components/GenerateExportDrawer.vue'
import PaletteTabs from '../components/PaletteTabs.vue'
import { downloadPaletteJson } from '../lib/export'
import { Warning } from '../lib/generate/warnings'
import { writeHashRoute } from '../lib/router'
import { slugify } from '../lib/slug'

const props = defineProps<{ palette: Palette; route: AppRoute; generateRequestId?: number }>()
const copyMode = ref<CopyMode>('value')
const activeGroupId = ref('')
const generatedDrawerOpen = ref(false)
const generatedPalette = ref<GeneratedPalette | null>(null)
const openGeneratedGroupIds = ref(new Set<string>())
const openGroupIds = ref(new Set<string>())
const workspaceMode = ref<PaletteWorkspaceMode>('browse')
const densityMode = ref<PaletteDensityMode>('overview')

let scrollFrame = 0

type PaletteWorkspaceMode = 'browse' | 'generate' | 'compare'
type PaletteDensityMode = 'overview' | 'detailed'

const copyOpts = [
  { label: 'Raw value', value: 'value' },
  { label: 'CSS variable', value: 'css' },
  { label: 'Object entry', value: 'object' },
] satisfies { label: string; value: CopyMode }[]

const workspaceModes = [
  { label: 'Browse', value: 'browse' },
  { label: 'Generate', value: 'generate' },
  { label: 'Compare', value: 'compare' },
] satisfies { label: string; value: PaletteWorkspaceMode }[]

const densityModes = [
  { label: 'Overview', value: 'overview' },
  { label: 'Detailed', value: 'detailed' },
] satisfies { label: string; value: PaletteDensityMode }[]

const sourceGroupIds = computed(() => props.palette.groups.map((group) => paletteGroupId(props.palette.id, group.name)))
const visiblePalette = computed(() =>
  workspaceMode.value === 'generate' && generatedPalette.value ? generatedPalette.value : props.palette,
)
const visibleIsGenerated = computed(() => visiblePalette.value.id === generatedPalette.value?.id)
const visibleGroupIds = computed(() =>
  visiblePalette.value.groups.map((group) => paletteGroupId(visiblePalette.value.id, group.name)),
)
const showPaletteNav = computed(
  () => workspaceMode.value === 'browse' || (workspaceMode.value === 'generate' && Boolean(generatedPalette.value)),
)
const generatedWarnings = computed(() => (generatedPalette.value ? Warning.forPalette(generatedPalette.value) : []))
const generatedSwatchCount = computed(
  () => generatedPalette.value?.groups.reduce((count, group) => count + group.swatches.length, 0) ?? 0,
)
const generatedRecipeLabel = computed(() =>
  generatedPalette.value ? formatRecipeMode(generatedPalette.value.recipe.mode) : '',
)

const paletteGroupId = (paletteId: string, groupName: string): string => `${paletteId}-${slugify(groupName)}`
const groupId = (groupName: string): string => paletteGroupId(props.palette.id, groupName)
const generatedGroupId = (groupName: string): string =>
  paletteGroupId(generatedPalette.value?.id ?? 'generated', groupName)

function resetOpenGroups(): void {
  openGroupIds.value = densityMode.value === 'detailed' ? new Set(sourceGroupIds.value) : new Set()
}

function resetGeneratedOpenGroups(palette: GeneratedPalette): void {
  const ids = palette.groups.map((group) => `${palette.id}-${slugify(group.name)}`)
  openGeneratedGroupIds.value = densityMode.value === 'detailed' ? new Set(ids) : new Set()
}

const isGroupOpen = (id: string): boolean => openGroupIds.value.has(id)
const isGeneratedGroupOpen = (id: string): boolean => openGeneratedGroupIds.value.has(id)
const isVisibleGroupOpen = (id: string): boolean =>
  visibleIsGenerated.value ? isGeneratedGroupOpen(id) : isGroupOpen(id)

function toggleGroup(id: string): void {
  const next = new Set(openGroupIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  openGroupIds.value = next

  void nextTick(updateActiveGroup)
}

function toggleGeneratedGroup(id: string): void {
  const next = new Set(openGeneratedGroupIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  openGeneratedGroupIds.value = next
}

function toggleVisibleGroup(id: string): void {
  if (visibleIsGenerated.value) {
    toggleGeneratedGroup(id)
  } else {
    toggleGroup(id)
  }
}

function setGeneratedPalette(palette: GeneratedPalette): void {
  generatedPalette.value = palette
  resetGeneratedOpenGroups(palette)
  workspaceMode.value = 'generate'
  void nextTick(updateActiveGroup)
}

function showGeneratedPalette(): void {
  if (!generatedPalette.value) return
  workspaceMode.value = 'generate'
  void nextTick(updateActiveGroup)
}

function startGenerating(): void {
  workspaceMode.value = 'generate'
  generatedDrawerOpen.value = true
}

function setWorkspaceMode(mode: PaletteWorkspaceMode): void {
  workspaceMode.value = mode
  void nextTick(updateActiveGroup)
}

function setDensityMode(mode: PaletteDensityMode): void {
  densityMode.value = mode
  resetOpenGroups()
  if (generatedPalette.value) resetGeneratedOpenGroups(generatedPalette.value)
  void nextTick(updateActiveGroup)
}

function handleRouteDownload(): void {
  if (props.route.download !== 'json') return

  downloadPaletteJson(props.palette)
  writeHashRoute({ ...props.route, download: null })
}

function selectGroup(id: string): void {
  if (visibleIsGenerated.value) {
    if (!openGeneratedGroupIds.value.has(id)) {
      openGeneratedGroupIds.value = new Set([...openGeneratedGroupIds.value, id])
    }
  } else if (!openGroupIds.value.has(id)) {
    openGroupIds.value = new Set([...openGroupIds.value, id])
  }

  void nextTick(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    updateActiveGroup()
  })
}

function queueActiveGroupUpdate(): void {
  if (scrollFrame) return

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    updateActiveGroup()
  })
}

function updateActiveGroup(): void {
  if (workspaceMode.value === 'compare') {
    activeGroupId.value = ''
    return
  }

  const ids = visibleGroupIds.value
  const lastGroupId = ids.at(-1)
  const scrollBottom = window.scrollY + window.innerHeight
  const documentBottom = document.documentElement.scrollHeight

  if (lastGroupId && scrollBottom >= documentBottom - 2) {
    activeGroupId.value = lastGroupId
    return
  }

  const marker = Math.min(window.innerHeight * 0.28, 220)
  let activeId = ids[0] ?? ''

  for (const id of ids) {
    const section = document.getElementById(id)
    if (!section) continue
    if (section.getBoundingClientRect().top <= marker) activeId = id
  }

  activeGroupId.value = activeId
}

function focusSwatch(swatchName: string): void {
  workspaceMode.value = 'browse'
  // Find the group containing this swatch and open it.
  const group = props.palette.groups.find((g) => g.swatches.some((s) => s.name === swatchName))
  if (!group) return

  const gId = groupId(group.name)
  if (!openGroupIds.value.has(gId)) {
    openGroupIds.value = new Set([...openGroupIds.value, gId])
  }

  void nextTick(() => {
    const swatchEl = document.querySelector<HTMLElement>(`[data-swatch="${swatchName}"]`)
    if (!swatchEl) return

    // Account for the sticky palette-nav height so the swatch isn't hidden behind it.
    const navEl = document.querySelector<HTMLElement>('.palette-nav')
    const navHeight = (navEl?.offsetHeight ?? 0) + 16
    const rect = swatchEl.getBoundingClientRect()
    const targetY = window.scrollY + rect.top - navHeight - (window.innerHeight - rect.height) / 2

    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })
    updateActiveGroup()
  })
}

function formatRecipeMode(mode: GeneratedPalette['recipe']['mode']): string {
  return mode
    .split('-')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

onMounted(() => {
  resetOpenGroups()
  handleRouteDownload()
  void nextTick(() => {
    if (props.route.swatch) focusSwatch(props.route.swatch)
    else updateActiveGroup()
  })
  window.addEventListener('scroll', queueActiveGroupUpdate, { passive: true })
  window.addEventListener('resize', queueActiveGroupUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', queueActiveGroupUpdate)
  window.removeEventListener('resize', queueActiveGroupUpdate)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
})

watch(
  () => props.palette.id,
  () => {
    generatedPalette.value = null
    openGeneratedGroupIds.value = new Set()
    workspaceMode.value = 'browse'
    resetOpenGroups()
    void nextTick(() => {
      if (props.route.swatch) focusSwatch(props.route.swatch)
      else updateActiveGroup()
    })
  },
)

watch(
  () => props.generateRequestId,
  (requestId) => {
    if (requestId) startGenerating()
  },
)

watch(
  () => [props.palette.id, props.route.download] as const,
  () => handleRouteDownload(),
)
</script>

<template>
  <section class="palette-view" :aria-labelledby="`${palette.id}-title`">
    <div class="palette-toolbar">
      <h2 :id="`${palette.id}-title`" class="sr-only">{{ palette.name }}</h2>

      <PaletteTabs
        :route="route"
        :generated-palette="generatedPalette"
        :active-generated="workspaceMode === 'generate' && Boolean(generatedPalette)"
        @select-generated="showGeneratedPalette" />

      <div class="toolbar-controls">
        <fieldset class="view-control" aria-label="Palette workspace mode">
          <legend>View</legend>
          <div class="view-options">
            <label
              v-for="mode in workspaceModes"
              :key="mode.value"
              :class="{ 'is-active': workspaceMode === mode.value }">
              <input
                type="radio"
                name="palette-workspace-mode"
                :value="mode.value"
                :checked="workspaceMode === mode.value"
                @change="setWorkspaceMode(mode.value)" />
              <span>{{ mode.label }}</span>
            </label>
          </div>
        </fieldset>

        <fieldset class="density-control" aria-label="Palette density mode">
          <legend>Density</legend>
          <div class="view-options density-options">
            <label v-for="mode in densityModes" :key="mode.value" :class="{ 'is-active': densityMode === mode.value }">
              <input
                type="radio"
                name="palette-density-mode"
                :value="mode.value"
                :checked="densityMode === mode.value"
                @change="setDensityMode(mode.value)" />
              <span>{{ mode.label }}</span>
            </label>
          </div>
        </fieldset>

        <FormatControl :route="route" />

        <fieldset class="copy-control">
          <label for="copy-mode">Copy as</label>
          <select id="copy-mode" v-model="copyMode">
            <option v-for="option in copyOpts" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </fieldset>
      </div>
    </div>

    <div v-if="showPaletteNav" class="palette-nav">
      <ColorSearch :route="route" />

      <ColorGroupNav :palette="visiblePalette" :active-group-id="activeGroupId" @select-group="selectGroup" />
    </div>

    <section
      v-if="workspaceMode === 'generate' && generatedPalette"
      class="generated-results"
      :aria-labelledby="`${generatedPalette.id}-title`">
      <header class="generated-header">
        <div>
          <h2 :id="`${generatedPalette.id}-title`">{{ generatedPalette.name }}</h2>
          <p>{{ generatedRecipeLabel }} · {{ generatedSwatchCount }} swatches</p>
        </div>

        <div class="generated-actions">
          <button type="button" class="generated-edit" @click="generatedDrawerOpen = true">Edit recipe</button>
          <button type="button" class="generated-edit secondary-action" @click="generatedDrawerOpen = true">
            Export
          </button>
        </div>
      </header>

      <ul v-if="generatedWarnings.length" class="generated-warnings" aria-label="Generated palette warnings">
        <li v-for="warning in generatedWarnings" :key="warning.kind">
          <strong>{{ warning.message }}</strong>
          <span>{{ warning.tokens.join(', ') }}</span>
        </li>
      </ul>

      <ColorGroup
        v-for="group in generatedPalette.groups"
        :key="group.name"
        :palette-id="generatedPalette.id"
        :group="group"
        :format="route.format"
        :copy-mode="copyMode"
        :is-active="activeGroupId === generatedGroupId(group.name)"
        :is-open="isGeneratedGroupOpen(generatedGroupId(group.name))"
        @toggle="toggleGeneratedGroup(generatedGroupId(group.name))" />
    </section>

    <section
      v-else-if="workspaceMode === 'generate'"
      class="generate-empty"
      :aria-labelledby="`${palette.id}-generate-title`">
      <div>
        <h2 :id="`${palette.id}-generate-title`">Generate from {{ palette.name }}</h2>
        <p>Create a tone scale, harmony, blend ramp, or smoothed group from this palette.</p>
      </div>

      <button type="button" class="generated-edit" @click="generatedDrawerOpen = true">Open generator</button>
    </section>

    <section
      v-else-if="workspaceMode === 'compare'"
      class="compare-view"
      :aria-labelledby="`${palette.id}-compare-title`">
      <header class="generated-header">
        <div>
          <h2 :id="`${palette.id}-compare-title`">Compare palettes</h2>
          <p v-if="generatedPalette">{{ palette.name }} against {{ generatedRecipeLabel }}</p>
          <p v-else>Generate a palette first to compare it with {{ palette.name }}.</p>
        </div>

        <button type="button" class="generated-edit" @click="startGenerating">
          {{ generatedPalette ? 'Edit recipe' : 'Open generator' }}
        </button>
      </header>

      <div v-if="generatedPalette" class="compare-columns">
        <section class="compare-column" :aria-labelledby="`${palette.id}-source-compare-title`">
          <h3 :id="`${palette.id}-source-compare-title`">{{ palette.name }}</h3>
          <ColorGroup
            v-for="group in palette.groups"
            :key="group.name"
            :palette-id="palette.id"
            :group="group"
            :format="route.format"
            :copy-mode="copyMode"
            :is-active="false"
            :is-open="isGroupOpen(groupId(group.name))"
            @toggle="toggleGroup(groupId(group.name))" />
        </section>

        <section class="compare-column" :aria-labelledby="`${generatedPalette.id}-compare-title`">
          <h3 :id="`${generatedPalette.id}-compare-title`">Generated</h3>
          <ColorGroup
            v-for="group in generatedPalette.groups"
            :key="group.name"
            :palette-id="generatedPalette.id"
            :group="group"
            :format="route.format"
            :copy-mode="copyMode"
            :is-active="false"
            :is-open="isGeneratedGroupOpen(generatedGroupId(group.name))"
            @toggle="toggleGeneratedGroup(generatedGroupId(group.name))" />
        </section>
      </div>
    </section>

    <div v-else class="palette-groups">
      <ColorGroup
        v-for="group in visiblePalette.groups"
        :key="group.name"
        :palette-id="visiblePalette.id"
        :group="group"
        :format="route.format"
        :copy-mode="copyMode"
        :is-active="activeGroupId === paletteGroupId(visiblePalette.id, group.name)"
        :is-open="isVisibleGroupOpen(paletteGroupId(visiblePalette.id, group.name))"
        @toggle="toggleVisibleGroup(paletteGroupId(visiblePalette.id, group.name))" />
    </div>

    <GenerateExportDrawer
      v-model:open="generatedDrawerOpen"
      :palette="palette"
      :format="route.format"
      :generated-palette="generatedPalette"
      @generated="setGeneratedPalette" />
  </section>
</template>

<style scoped>
.palette-view {
  display: grid;
  gap: var(--space-6);
}

.palette-toolbar {
  display: grid;
  gap: var(--space-4);
}

.palette-nav {
  position: sticky;
  top: 0;
  z-index: 2;
  display: grid;
  gap: var(--space-3);
  border-block-end: 1px solid var(--color-chrome);
  background: color-mix(in srgb, var(--color-page) 92%, transparent);
  padding-block: var(--space-3);
}

.sr-only {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.toolbar-controls {
  display: grid;
  grid-template-columns: minmax(16rem, auto) minmax(11rem, auto) auto minmax(10rem, auto);
  align-items: end;
  justify-content: space-between;
  gap: var(--space-4);
}

.view-control,
.density-control,
.copy-control {
  display: grid;
  align-content: end;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  border: 0;
}

.view-control legend,
.density-control legend,
.copy-control label {
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.view-options {
  display: flex;
  min-block-size: 2.75rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}

.view-options label {
  display: grid;
  place-items: center;
  min-inline-size: 5.25rem;
  padding-inline: var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
  cursor: pointer;
}

.density-options label {
  min-inline-size: 5.75rem;
}

.view-options label + label {
  border-inline-start: 1px solid var(--color-border);
}

.view-options label:hover,
.view-options label:focus-within,
.view-options label.is-active {
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.view-options input {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.copy-control select {
  block-size: 2.75rem;
  inline-size: 10rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-strong);
  background: var(--color-surface);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.copy-control select:hover,
.copy-control select:focus-visible {
  border-color: var(--color-accent);
}

.generated-edit {
  align-self: end;
  min-block-size: 2.75rem;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-4);
  color: var(--color-page);
  background: var(--color-accent-strong);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.generated-edit:hover,
.generated-edit:focus-visible {
  box-shadow: var(--shadow-soft);
}

.secondary-action {
  color: var(--color-accent-strong);
  background: var(--color-surface);
}

.palette-groups {
  display: grid;
  gap: var(--space-6);
}

.compare-view,
.generate-empty,
.generated-results {
  display: grid;
  gap: var(--space-4);
}

.generated-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-4);
}

.generated-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: var(--space-2);
}

.generated-header h2 {
  font-size: var(--size-xl);
  line-height: var(--line-xl);
}

.generated-header p {
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.generated-warnings {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.generated-warnings li {
  display: grid;
  gap: var(--space-1);
  border-inline-start: 3px solid var(--color-accent);
  padding: var(--space-2) var(--space-3);
  background: var(--color-accent-soft);
}

.generated-warnings strong,
.generated-warnings span {
  overflow-wrap: anywhere;
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.generated-warnings span {
  color: var(--color-text-muted);
}

.generate-empty {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-5);
  background: var(--color-surface);
}

.generate-empty h2,
.compare-column h3 {
  color: var(--color-text-strong);
  font-family: var(--font-display);
  font-size: var(--size-xl);
  line-height: var(--line-xl);
  text-wrap: balance;
}

.generate-empty p {
  margin-block-start: var(--space-1);
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.compare-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  align-items: start;
}

.compare-column {
  display: grid;
  gap: var(--space-4);
  min-inline-size: 0;
}

@media (max-width: 48rem) {
  .palette-toolbar {
    grid-template-columns: 1fr;
  }

  .toolbar-controls {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: stretch;
  }

  .view-options label {
    min-inline-size: 0;
    inline-size: 100%;
  }

  .compare-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 34rem) {
  .toolbar-controls {
    gap: var(--space-2);
  }

  .copy-control select {
    inline-size: 100%;
  }

  .generated-header {
    display: grid;
    align-items: stretch;
  }

  .generated-actions,
  .generate-empty {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
