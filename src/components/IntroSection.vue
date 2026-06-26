<template>
  <section class="intro" aria-labelledby="page-title">
    <p class="eyebrow">Palette reference</p>
    <h1 id="page-title">Copy-ready color systems in one place.</h1>
    <p>Browse Tailwind v3, uchu, and Reasonable Colors with matching route, format, and copy controls.</p>
  </section>
</template>

<style scoped>
.intro {
  display: grid;
  gap: var(--space-4);
  max-inline-size: 42rem;
}

.eyebrow {
  color: var(--color-accent-strong);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
  text-transform: uppercase;
}

.intro h1 {
  font-size: var(--size-2xl);
  line-height: var(--line-2xl);
}

.intro p:not(.eyebrow) {
  color: var(--color-text-muted);
  font-size: var(--size-lg);
  line-height: var(--line-lg);
}
</style>
