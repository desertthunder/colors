<template>
  <footer class="app-footer">
    <p>Sources: Tailwind v3, uchu, and Reasonable Colors.</p>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-5);
  border-block-start: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

@media (max-width: 48rem) {
  .app-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
