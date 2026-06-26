<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CopyMode } from '../lib/copy'
import type { Palette } from '../lib/colors'
import type { AppRoute } from '../lib/router'
import ColorGroup from '../components/ColorGroup.vue'
import ColorGroupNav from '../components/ColorGroupNav.vue'
import FormatControl from '../components/FormatControl.vue'
import PaletteTabs from '../components/PaletteTabs.vue'
import { slugify } from '../lib/slug'

const props = defineProps<{ palette: Palette; route: AppRoute }>()

const copyMode = ref<CopyMode>('value')
const activeGroupId = ref('')
let observer: IntersectionObserver | null = null

const copyOptions = [
  { label: 'Raw value', value: 'value' },
  { label: 'CSS variable', value: 'css' },
  { label: 'Object entry', value: 'object' },
] satisfies { label: string; value: CopyMode }[]

const groupIds = computed(() => props.palette.groups.map((group) => groupId(group.name)))

function groupId(groupName: string): string {
  return `${props.palette.id}-${slugify(groupName)}`
}

function observeColorGroups(): void {
  observer?.disconnect()
  activeGroupId.value = groupIds.value[0] ?? ''

  observer = new IntersectionObserver(updateActiveGroup, { rootMargin: '-22% 0px -68% 0px', threshold: 0 })

  for (const id of groupIds.value) {
    const section = document.getElementById(id)
    if (section) observer.observe(section)
  }
}

function updateActiveGroup(entries: IntersectionObserverEntry[]): void {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)

  if (visible[0]?.target.id) {
    activeGroupId.value = visible[0].target.id
  }
}

onMounted(() => {
  void nextTick(observeColorGroups)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

watch(
  () => props.palette.id,
  () => {
    void nextTick(observeColorGroups)
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
            <option v-for="option in copyOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </fieldset>
      </div>
    </div>

    <ColorGroupNav :palette="palette" :active-group-id="activeGroupId" />

    <div class="palette-groups">
      <ColorGroup
        v-for="group in palette.groups"
        :key="group.name"
        :palette-id="palette.id"
        :group="group"
        :format="route.format"
        :copy-mode="copyMode" />
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
  align-items: end;
  justify-content: end;
  gap: var(--space-4);
}

.copy-control {
  display: grid;
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
    flex-wrap: wrap;
    justify-content: start;
  }
}

@media (max-width: 34rem) {
  .toolbar-controls {
    display: grid;
  }

  .copy-control select {
    inline-size: 100%;
  }
}
</style>
