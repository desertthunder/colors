<script setup lang="ts">
import { computed, nextTick, ref, useSlots, watch } from 'vue'

const props = withDefaults(
  defineProps<{ open: boolean; title: string; description?: string; placement?: 'center' | 'drawer' }>(),
  { description: '', placement: 'center' },
)

const emit = defineEmits<{ 'update:open': [open: boolean]; close: [] }>()
const slots = useSlots()
const dialog = ref<HTMLDialogElement | null>(null)
const titleId = computed(() => `${slugId(props.title)}-dialog-title`)
const descriptionId = computed(() => (props.description ? `${slugId(props.title)}-dialog-description` : undefined))

watch(
  () => props.open,
  (open) => {
    void syncDialog(open)
  },
  { immediate: true },
)

async function syncDialog(open: boolean): Promise<void> {
  await nextTick()
  const element = dialog.value
  if (!element) return

  if (open && !element.open) {
    element.showModal()
  } else if (!open && element.open) {
    element.close()
  }
}

function requestClose(): void {
  emit('update:open', false)
}

function handleCancel(event: Event): void {
  event.preventDefault()
  requestClose()
}

function handleClose(): void {
  emit('update:open', false)
  emit('close')
}

function slugId(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'app'
  )
}
</script>

<template>
  <dialog
    ref="dialog"
    class="app-dialog"
    :class="`app-dialog--${placement}`"
    :aria-labelledby="titleId"
    :aria-describedby="descriptionId"
    @cancel="handleCancel"
    @click.self="requestClose"
    @close="handleClose">
    <section class="dialog-panel">
      <header class="dialog-header">
        <div class="dialog-title-group">
          <h2 :id="titleId">{{ title }}</h2>
          <p v-if="description" :id="descriptionId">{{ description }}</p>
        </div>

        <button type="button" class="dialog-close" aria-label="Close dialog" @click="requestClose">
          <span aria-hidden="true"></span>
        </button>
      </header>

      <div class="dialog-body">
        <slot />
      </div>

      <footer v-if="slots.footer" class="dialog-footer">
        <slot name="footer" />
      </footer>
    </section>
  </dialog>
</template>

<style scoped>
.app-dialog {
  inline-size: min(100%, 34rem);
  max-inline-size: calc(100vi - var(--space-4));
  max-block-size: calc(100dvb - var(--space-4));
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0;
  color: var(--color-text);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.app-dialog::backdrop {
  background: rgb(15 23 42 / 0.48);
}

.app-dialog[open] {
  animation: dialog-enter 180ms ease-out;
}

.app-dialog[open]::backdrop {
  animation: backdrop-enter 180ms ease-out;
}

.app-dialog--drawer {
  inline-size: min(100%, 31rem);
  block-size: 100dvb;
  max-inline-size: 100vi;
  max-block-size: 100dvb;
  margin: 0 0 0 auto;
  border-block: 0;
  border-inline-end: 0;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.app-dialog--drawer[open] {
  animation-name: drawer-enter;
}

.dialog-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  block-size: 100%;
  min-block-size: 0;
}

.dialog-header,
.dialog-footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}

.dialog-header {
  justify-content: space-between;
  border-block-end: 1px solid var(--color-border);
}

.dialog-footer {
  flex-wrap: wrap;
  justify-content: end;
  border-block-start: 1px solid var(--color-border);
}

.dialog-title-group {
  display: grid;
  gap: var(--space-1);
  min-inline-size: 0;
}

.dialog-title-group h2 {
  font-size: var(--size-xl);
  line-height: var(--line-xl);
}

.dialog-title-group p {
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.dialog-close {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  background: var(--color-surface);
}

.dialog-close:hover,
.dialog-close:focus-visible {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.dialog-close span {
  position: relative;
  inline-size: 0.875rem;
  block-size: 0.875rem;
}

.dialog-close span::before,
.dialog-close span::after {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 0;
  inline-size: 100%;
  block-size: 2px;
  border-radius: 999px;
  background: currentColor;
  content: '';
}

.dialog-close span::before {
  transform: rotate(45deg);
}

.dialog-close span::after {
  transform: rotate(-45deg);
}

.dialog-body {
  min-block-size: 0;
  overflow: auto;
  padding: var(--space-4);
}

@media (max-width: 34rem) {
  .app-dialog,
  .app-dialog--drawer {
    inline-size: 100vi;
    max-inline-size: 100vi;
    block-size: 100dvb;
    max-block-size: 100dvb;
    margin: 0;
    border: 0;
    border-radius: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-dialog[open],
  .app-dialog[open]::backdrop {
    animation: none;
  }
}

@keyframes dialog-enter {
  from {
    opacity: 0;
    transform: translateY(0.5rem) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes drawer-enter {
  from {
    opacity: 0;
    transform: translateX(1.5rem);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes backdrop-enter {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
