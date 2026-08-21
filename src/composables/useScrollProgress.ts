import { onMounted, onUnmounted, ref, type Ref } from 'vue'

// Tracks how far a given element has scrolled through the viewport.
// progress = 0 when the element's top hits the bottom of the viewport,
// progress = 1 when the element's bottom leaves the top of the viewport.
export function useScrollProgress(target: Ref<HTMLElement | null>) {
  const progress = ref(0)
  let raf = 0

  function update() {
    const el = target.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const total = rect.height + vh
    const seen = vh - rect.top
    progress.value = Math.min(1, Math.max(0, seen / total))
  }

  function onScroll() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(update)
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })
  onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return { progress }
}
