<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { writeHashRoute, type AppRoute } from '../lib/router'
import { searchColors, type ColorSearchResult } from '../lib/search'

const props = defineProps<{ route: AppRoute }>()

const localQuery = ref(props.route.search)
const isOpen = ref(false)
const activeIndex = ref(0)

// Keep the input synced when the URL changes externally (e.g. back/forward).
watch(
  () => props.route.search,
  (value) => {
    localQuery.value = value
  },
)

const results = computed<ColorSearchResult[]>(() => searchColors(localQuery.value, props.route.format, 25))

const hasResults = computed(() => results.value.length > 0)

function commitQuery(): void {
  writeHashRoute({ ...props.route, search: localQuery.value, swatch: null })
}

function selectResult(result: ColorSearchResult): void {
  writeHashRoute({ ...props.route, search: '', swatch: result.name, page: result.paletteId })
  isOpen.value = false
}

function navigate(delta: number): void {
  if (!hasResults.value) return
  activeIndex.value = (activeIndex.value + delta + results.value.length) % results.value.length
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    navigate(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    navigate(-1)
  } else if (event.key === 'Enter' && hasResults.value) {
    event.preventDefault()
    selectResult(results.value[activeIndex.value]!)
  } else if (event.key === 'Escape') {
    isOpen.value = false
  }
}

function onBlur(): void {
  window.setTimeout(() => {
    isOpen.value = false
  }, 150)
}

function onSearchInput() {
  activeIndex.value = 0
  commitQuery()
}
</script>

<template>
  <div class="color-search" role="search">
    <input
      v-model="localQuery"
      type="search"
      class="search-input"
      placeholder="Search colors…"
      aria-label="Search colors across all palettes"
      autocomplete="off"
      @focus="isOpen = true"
      @blur="onBlur"
      @keydown="onKeydown"
      @input="onSearchInput" />

    <ul v-if="isOpen && localQuery.trim() && hasResults" class="search-results" role="listbox">
      <li v-for="(result, index) in results" :key="result.token" role="option" :aria-selected="index === activeIndex">
        <button
          type="button"
          class="result-button"
          :class="{ 'is-active': index === activeIndex }"
          @mousedown.prevent="selectResult(result)"
          @mouseenter="activeIndex = index">
          <span class="result-chip" :style="{ backgroundColor: result.value.value }" aria-hidden="true"></span>
          <span class="result-name">{{ result.name }}</span>
          <code class="result-value">{{ result.formatted }}</code>
          <small class="result-meta">{{ result.paletteName }} · {{ result.groupName }}</small>
        </button>
      </li>
    </ul>

    <p v-else-if="isOpen && localQuery.trim() && !hasResults" class="search-empty">No colors found.</p>
  </div>
</template>

<style scoped>
.color-search {
  position: relative;
  inline-size: 100%;
}

.search-input {
  inline-size: 100%;
  block-size: 2.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-strong);
  background: var(--color-surface);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -1px;
  border-color: var(--color-accent);
}

.search-results {
  position: absolute;
  z-index: 3;
  inset-block-start: calc(100% + var(--space-1));
  inline-size: 100%;
  max-block-size: 24rem;
  overflow-y: auto;
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-1);
  list-style: none;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  scrollbar-width: thin;
}

.result-button {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: var(--space-2);
  inline-size: 100%;
  border: 0;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text);
  background: transparent;
  font-size: var(--size-sm);
  line-height: var(--line-sm);
  text-align: start;
}

.result-button:hover,
.result-button:focus-visible,
.result-button.is-active {
  background: var(--color-accent-soft);
}

.result-chip {
  inline-size: 1rem;
  block-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.result-name {
  color: var(--color-text-strong);
  font-weight: 700;
}

.result-value {
  min-inline-size: 0;
  overflow-wrap: anywhere;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: var(--size-xs);
}

.result-meta {
  color: var(--color-text-muted);
  font-size: var(--size-xs);
  white-space: nowrap;
}

.search-empty {
  position: absolute;
  inset-block-start: calc(100% + var(--space-1));
  inline-size: 100%;
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  color: var(--color-text-muted);
  background: var(--color-surface);
  font-size: var(--size-sm);
  text-align: center;
}
</style>
