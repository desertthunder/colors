<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CopyMode } from '../lib/copy'
import type { Palette } from '../lib/colors'
import type { AppRoute } from '../lib/router'
import ColorGroup from '../components/ColorGroup.vue'
import ColorGroupNav from '../components/ColorGroupNav.vue'
import ColorSearch from '../components/ColorSearch.vue'
import FormatControl from '../components/FormatControl.vue'
import PaletteTabs from '../components/PaletteTabs.vue'
import { slugify } from '../lib/slug'

const props = defineProps<{ palette: Palette; route: AppRoute }>()
const copyMode = ref<CopyMode>('value')
const activeGroupId = ref('')
const openGroupIds = ref(new Set<string>())

let scrollFrame = 0

const copyOpts = [
  { label: 'Raw value', value: 'value' },
  { label: 'CSS variable', value: 'css' },
  { label: 'Object entry', value: 'object' },
] satisfies { label: string; value: CopyMode }[]

const groupIds = computed(() => props.palette.groups.map((group) => groupId(group.name)))

const groupId = (groupName: string): string => `${props.palette.id}-${slugify(groupName)}`

function resetOpenGroups(): void {
  openGroupIds.value = new Set(groupIds.value)
}

const isGroupOpen = (id: string): boolean => openGroupIds.value.has(id)

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

function selectGroup(id: string): void {
  if (!openGroupIds.value.has(id)) {
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
  const lastGroupId = groupIds.value.at(-1)
  const scrollBottom = window.scrollY + window.innerHeight
  const documentBottom = document.documentElement.scrollHeight

  if (lastGroupId && scrollBottom >= documentBottom - 2) {
    activeGroupId.value = lastGroupId
    return
  }

  const marker = Math.min(window.innerHeight * 0.28, 220)
  let activeId = groupIds.value[0] ?? ''

  for (const id of groupIds.value) {
    const section = document.getElementById(id)
    if (!section) continue
    if (section.getBoundingClientRect().top <= marker) activeId = id
  }

  activeGroupId.value = activeId
}

function focusSwatch(swatchName: string): void {
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

onMounted(() => {
  resetOpenGroups()
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
    resetOpenGroups()
    void nextTick(() => {
      if (props.route.swatch) focusSwatch(props.route.swatch)
      else updateActiveGroup()
    })
  },
)
</script>

<template>
  <section class="palette-view" :aria-labelledby="`${palette.id}-title`">
    <div class="palette-toolbar">
      <h2 :id="`${palette.id}-title`" class="sr-only">{{ palette.name }}</h2>

      <PaletteTabs :route="route" />

      <div class="toolbar-controls">
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

    <div class="palette-nav">
      <ColorSearch :route="route" />

      <ColorGroupNav :palette="palette" :active-group-id="activeGroupId" @select-group="selectGroup" />
    </div>

    <div class="palette-groups">
      <ColorGroup
        v-for="group in palette.groups"
        :key="group.name"
        :palette-id="palette.id"
        :group="group"
        :format="route.format"
        :copy-mode="copyMode"
        :is-active="activeGroupId === groupId(group.name)"
        :is-open="isGroupOpen(groupId(group.name))"
        @toggle="toggleGroup(groupId(group.name))" />
    </div>
  </section>
</template>

<style scoped>
.palette-view {
  display: grid;
  gap: var(--space-6);
}

.palette-toolbar {
  display: grid;
  grid-template-columns: minmax(24rem, 1fr) auto;
  align-items: center;
  gap: var(--space-5);
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
  display: flex;
  align-items: stretch;
  justify-content: end;
  gap: var(--space-4);
}

.copy-control {
  display: grid;
  align-content: end;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  border: 0;
}

.copy-control label {
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
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

.palette-groups {
  display: grid;
  gap: var(--space-6);
}

@media (max-width: 48rem) {
  .palette-toolbar {
    align-items: stretch;
    grid-template-columns: 1fr;
  }

  .toolbar-controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(8rem, auto);
    justify-content: stretch;
  }
}

@media (max-width: 34rem) {
  .toolbar-controls {
    gap: var(--space-2);
  }

  .copy-control select {
    inline-size: 100%;
  }
}
</style>
