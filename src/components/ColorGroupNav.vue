<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { Palette } from '../lib/colors'
import { slugify } from '../lib/slug'

const props = defineProps<{ palette: Palette; activeGroupId: string }>()
const emit = defineEmits<{ selectGroup: [id: string] }>()
const navRef = ref<HTMLElement>()

function groupId(palette: Palette, groupName: string): string {
  return `${palette.id}-${slugify(groupName)}`
}

watch(
  () => props.activeGroupId,
  (id) => {
    if (!id) return
    void nextTick(() => {
      const nav = navRef.value
      const active = nav?.querySelector<HTMLElement>("button[aria-current='true']")
      if (!nav || !active) return

      const navEdge = nav.getBoundingClientRect()
      const buttonEdge = active.getBoundingClientRect()
      const overflow = buttonEdge.left - navEdge.left

      if (overflow < 0) {
        nav.scrollLeft += overflow - 8
      } else if (overflow + active.offsetWidth > nav.clientWidth) {
        nav.scrollLeft += overflow + active.offsetWidth - nav.clientWidth + 8
      }
    })
  },
)
</script>

<template>
  <nav ref="navRef" class="color-group-nav" aria-label="Color groups">
    <button
      v-for="group in palette.groups"
      :key="group.name"
      type="button"
      :aria-current="activeGroupId === groupId(palette, group.name) ? 'true' : undefined"
      @click="emit('selectGroup', groupId(palette, group.name))">
      {{ group.name }}
    </button>
  </nav>
</template>

<style scoped>
.color-group-nav {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  border-bottom: 1px solid var(--color-chrome);
  background: color-mix(in srgb, var(--color-page) 92%, transparent);
  padding-block: var(--space-3);
  scrollbar-width: thin;
}

.color-group-nav button {
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  background: var(--color-surface);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
}

.color-group-nav button:hover,
.color-group-nav button:focus-visible,
.color-group-nav button[aria-current='true'] {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.color-group-nav button[aria-current='true'] {
  box-shadow: inset 0 0 0 1px var(--color-accent);
}
</style>
