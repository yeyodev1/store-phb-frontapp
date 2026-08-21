import type { Directive } from 'vue'

// v-reveal: adds `.is-visible` when the element scrolls into view.
// Usage: <div v-reveal> or <div v-reveal="{ delay: 120 }">
export const reveal: Directive<HTMLElement, { delay?: number } | undefined> = {
  mounted(el, binding) {
    const delay = binding.value?.delay ?? 0
    el.classList.add('reveal')
    if (delay) el.style.transitionDelay = `${delay}ms`

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    ;(el as unknown as { _io?: IntersectionObserver })._io = io
  },
  unmounted(el) {
    ;(el as unknown as { _io?: IntersectionObserver })._io?.disconnect()
  },
}
