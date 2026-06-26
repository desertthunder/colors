<script setup lang="ts">
import { computed } from 'vue'
import aboutCopy from '../content/about.md?raw'
import { parseMarkdownCopy } from '../lib/markdown'
const blocks = computed(() => parseMarkdownCopy(aboutCopy))
</script>

<template>
  <section class="about-view" aria-labelledby="about-title">
    <template v-for="(block, blockIndex) in blocks" :key="blockIndex">
      <component
        :is="`h${block.level}`"
        v-if="block.type === 'heading'"
        :id="block.level === 1 ? 'about-title' : undefined"
        :class="`heading-${block.level}`">
        <template v-for="(part, partIndex) in block.content" :key="partIndex">
          <a v-if="part.type === 'link'" :href="part.href" target="_blank" rel="noreferrer">{{ part.text }}</a>
          <code v-else-if="part.type === 'code'">{{ part.text }}</code>
          <template v-else>{{ part.text }}</template>
        </template>
      </component>

      <p v-else>
        <template v-for="(part, partIndex) in block.content" :key="partIndex">
          <a v-if="part.type === 'link'" :href="part.href" target="_blank" rel="noreferrer">{{ part.text }}</a>
          <code v-else-if="part.type === 'code'">{{ part.text }}</code>
          <template v-else>{{ part.text }}</template>
        </template>
      </p>
    </template>
  </section>
</template>

<style scoped>
.about-view {
  display: grid;
  gap: var(--space-4);
  inline-size: min(100%, 88ch);
  margin: auto;
  overflow-wrap: normal;
  text-wrap: pretty;
  word-break: normal;
}

.heading-1 {
  font-size: var(--size-2xl);
  line-height: var(--line-2xl);
}

.heading-2 {
  margin-block-start: var(--space-5);
  border-block-start: 1px solid var(--color-border);
  padding-block-start: var(--space-5);
  font-size: var(--size-xl);
  line-height: var(--line-xl);
}

.heading-3 {
  margin-block-start: var(--space-3);
  font-size: var(--size-lg);
  line-height: var(--line-lg);
}

.about-view p {
  color: var(--color-text-muted);
  font-size: var(--size-base);
  line-height: var(--line-base);
}

.about-view a {
  color: var(--color-accent-strong);
  font-weight: 700;
  text-underline-offset: 0.2em;
}

.about-view a:hover,
.about-view a:focus-visible {
  color: var(--color-text-strong);
}

.about-view code {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-1);
  color: var(--color-text-strong);
  background: var(--color-surface);
  font-family: var(--font-code);
  font-size: 0.9em;
  white-space: normal;
}
</style>
