<template>
  <header class="app-header">
    <a class="brand" href="#/tailwind?format=hex" aria-label="Colors home">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>Colors</span>
    </a>

    <nav class="app-nav" aria-label="Main navigation">
      <a href="#/tailwind?format=hex">Palettes</a>
      <a href="#/about">About</a>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-5);
  border-block-end: 1px solid var(--color-border);
}

.brand,
.app-nav {
  display: flex;
  align-items: center;
}

.brand {
  gap: var(--space-3);
  color: var(--color-text-strong);
  font-family: var(--font-display);
  font-size: var(--size-lg);
  font-weight: 700;
  line-height: var(--line-lg);
  text-decoration: none;
}

.brand-mark {
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border: 1px solid var(--color-accent-strong);
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, transparent 50%, var(--color-accent-soft) 0), var(--color-accent);
}

.app-nav {
  gap: var(--space-2);
}

.app-nav a {
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  font-weight: 600;
  line-height: var(--line-sm);
  text-decoration: none;
}

.app-nav a:hover,
.app-nav a:focus-visible {
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

@media (max-width: 48rem) {
  .app-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
