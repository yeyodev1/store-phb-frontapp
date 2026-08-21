import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

// Lenis smooth scroll wired into the GSAP ticker so ScrollTrigger stays in sync.
// No-ops (native scroll) when the user prefers reduced motion.
export function initSmoothScroll(): Lenis | null {
  if (lenis) return lenis
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return null

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function destroySmoothScroll() {
  lenis?.destroy()
  lenis = null
}

export { gsap, ScrollTrigger }
