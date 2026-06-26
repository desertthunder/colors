<script setup lang="ts">
const appVersion = __APP_VERSION__
</script>

<template>
  <footer class="app-footer">
    <div class="footer-primary">
      <p>
        Built by
        <a href="https://desertthunder.dev" target="_blank" rel="noreferrer">Owais </a> in Austin, TX.
      </p>
      <p>License: <a href="https://spdx.org/licenses/MIT" target="_blank">MIT</a></p>
      <p :title="appVersion.commit">Version: {{ appVersion.display }}</p>
    </div>

    <nav class="footer-links" aria-label="Developer links">
      <a href="https://github.com/desertthunder" target="_blank" rel="noreferrer">GitHub</a>
      <a href="https://desertthunder.dev" target="_blank" rel="noreferrer">Website</a>
    </nav>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  inline-size: 100%;
  background: var(--color-chrome);
  padding-inline: max(var(--space-5), calc((100vw - var(--measure)) / 2 + var(--space-5)));
  padding-block: var(--space-5);
  border-block-start: 1px solid var(--color-chrome);
  color: var(--color-text-muted);
  font-size: var(--size-sm);
  line-height: var(--line-sm);
}

.footer-primary {
  display: grid;
  gap: var(--space-1);
}

.app-footer a {
  color: var(--color-text-strong);
  font-weight: 700;
  text-decoration-color: color-mix(in srgb, var(--color-accent) 45%, transparent);
  text-underline-offset: 0.2em;
}

.app-footer a:hover,
.app-footer a:focus-visible {
  color: var(--color-accent-strong);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 48rem) {
  .app-footer {
    align-items: flex-start;
    flex-direction: column;
    padding-inline: var(--space-4);
  }
}
</style>
