<template>
  <section class="about-view" aria-labelledby="about-title">
    <p class="eyebrow">About</p>
    <h1 id="about-title">A copy-friendly reference for practical color systems.</h1>
    <p>
      This project brings Tailwind v3, uchu, and Reasonable Colors into one browser for inspecting, converting, and
      copying palette values.
    </p>

    <div class="source-list" aria-label="Palette sources">
      <a href="https://v3.tailwindcss.com/docs/customizing-colors" target="_blank" rel="noreferrer">
        <span>Tailwind v3</span>
        <small>Hex color scale used by Tailwind CSS v3.</small>
      </a>
      <a href="https://code.webb.page/nevercease/uchu.git/about/" target="_blank" rel="noreferrer">
        <span>uchu</span>
        <small>OKLCH palette for internet lovers.</small>
      </a>
      <a href="https://github.com/matthewhowell/reasonable-colors" target="_blank" rel="noreferrer">
        <span>Reasonable Colors</span>
        <small>Contrast-oriented palette with six steps per hue.</small>
      </a>
    </div>
  </section>
</template>

<style scoped>
.about-view {
  display: grid;
  gap: var(--space-5);
  /*max-inline-size: 48rem;*/
}

.eyebrow {
  color: var(--color-accent-strong);
  font-size: var(--size-sm);
  font-weight: 700;
  line-height: var(--line-sm);
  text-transform: uppercase;
}

.about-view h1 {
  font-size: var(--size-2xl);
  line-height: var(--line-2xl);
}

.about-view > p:not(.eyebrow) {
  color: var(--color-text-muted);
  font-size: var(--size-lg);
  line-height: var(--line-lg);
}

.source-list {
  display: grid;
  gap: var(--space-3);
  padding-block-start: var(--space-3);
}

.source-list a {
  display: grid;
  gap: var(--space-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  color: var(--color-text-muted);
  background: var(--color-surface);
  text-decoration: none;
}

.source-list a:hover,
.source-list a:focus-visible {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}

.source-list span {
  color: var(--color-text-strong);
  font-family: var(--font-display);
  font-size: var(--size-lg);
  font-weight: 700;
  line-height: var(--line-lg);
}

.source-list small {
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}
</style>
