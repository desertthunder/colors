// @vitest-environment happy-dom

import { createApp, nextTick, ref } from 'vue'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import AppDialog from '../AppDialog.vue'

let roots: HTMLElement[] = []

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true
  }

  HTMLDialogElement.prototype.close = function close() {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
})

afterEach(() => {
  for (const root of roots) {
    root.remove()
  }
  roots = []
})

describe('AppDialog', () => {
  it('opens a native dialog and renders title, description, body, and footer slots', async () => {
    const { root } = mountDialog(true)
    await nextTick()
    await nextTick()

    const dialog = root.querySelector('dialog')
    expect(dialog?.open).toBe(true)
    expect(dialog?.classList.contains('app-dialog--drawer')).toBe(true)
    expect(root.querySelector('h2')?.textContent).toBe('Generate exports')
    expect(root.querySelector('p')?.textContent).toBe('Palette tools')
    expect(root.querySelector('[data-test="body"]')?.textContent).toBe('Body content')
    expect(root.querySelector('[data-test="footer"]')?.textContent).toBe('Footer content')
  })

  it('emits close and model updates when the close button is clicked', async () => {
    const { root, closeSpy } = mountDialog(true)
    await nextTick()
    await nextTick()

    root.querySelector<HTMLButtonElement>('.dialog-close')?.click()
    await nextTick()
    await nextTick()

    expect(root.querySelector('dialog')?.open).toBe(false)
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('prevents native cancel and requests close through v-model', async () => {
    const { root, closeSpy } = mountDialog(true)
    await nextTick()
    await nextTick()

    const dialog = root.querySelector('dialog')
    const event = new Event('cancel', { cancelable: true })
    dialog?.dispatchEvent(event)
    await nextTick()
    await nextTick()

    expect(event.defaultPrevented).toBe(true)
    expect(dialog?.open).toBe(false)
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })
})

function mountDialog(openByDefault: boolean): { root: HTMLElement; closeSpy: ReturnType<typeof vi.fn> } {
  const root = document.createElement('div')
  const closeSpy = vi.fn()
  document.body.append(root)
  roots.push(root)

  createApp({
    components: { AppDialog },
    setup() {
      const open = ref(openByDefault)
      return { closeSpy, open }
    },
    template: `
      <AppDialog v-model:open="open" title="Generate exports" description="Palette tools" placement="drawer" @close="closeSpy">
        <span data-test="body">Body content</span>
        <template #footer>
          <span data-test="footer">Footer content</span>
        </template>
      </AppDialog>
    `,
  }).mount(root)

  return { root, closeSpy }
}
