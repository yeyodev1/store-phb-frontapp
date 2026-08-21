import type { Router } from 'vue-router'
import { gsap } from '@/composables/useSmoothScroll'

// A brand "water curtain" that wipes across on every route change.
// The PageCurtain component registers its elements here; the router drives it.
interface CurtainEls {
  root: HTMLElement
  panel: HTMLElement
  center: HTMLElement
  drop: HTMLElement
}

let els: CurtainEls | null = null
let installed = false

export function registerCurtain(next: CurtainEls) {
  els = next
  gsap.set(els.root, { autoAlpha: 0 })
  gsap.set(els.panel, { scaleY: 0, transformOrigin: 'bottom' })
  gsap.set(els.center, { autoAlpha: 0, y: 16 })
}

const reduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function cover(): Promise<void> {
  return new Promise((resolve) => {
    if (!els || reduce()) return resolve()
    let done = false
    const finish = () => {
      if (done) return
      done = true
      resolve()
    }
    // Hard safety cap so navigation never blocks if the ticker is paused.
    const guard = setTimeout(finish, 1200)
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(guard)
        finish()
      },
    })
    tl.set(els.root, { autoAlpha: 1, pointerEvents: 'auto' })
      .fromTo(els.panel, { scaleY: 0, transformOrigin: 'bottom' }, { scaleY: 1, duration: 0.5, ease: 'power3.inOut' })
      .to(els.center, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
      .to(els.drop, { scale: 1.12, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '-=0.35')
  })
}

function reveal() {
  if (!els || reduce()) {
    if (els) gsap.set(els.root, { autoAlpha: 0, pointerEvents: 'none' })
    return
  }
  const tl = gsap.timeline()
  tl.to(els.center, { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power2.in' })
    .to(els.panel, { scaleY: 0, transformOrigin: 'top', duration: 0.55, ease: 'power3.inOut' }, '-=0.1')
    .set(els.root, { autoAlpha: 0, pointerEvents: 'none' })
    .set(els.panel, { transformOrigin: 'bottom' })
}

export function installPageTransition(router: Router) {
  if (installed) return
  installed = true

  // Skip the cinematic curtain inside the admin panel — keep CRUD snappy.
  const isAdminNav = (to: { meta: Record<string, unknown> }, from: { meta: Record<string, unknown> }) =>
    !!to.meta.admin && !!from.meta.admin

  router.beforeResolve(async (to, from) => {
    if (from.name && to.fullPath !== from.fullPath && !isAdminNav(to, from)) {
      await cover()
    }
  })

  router.afterEach((to, from) => {
    if (!from.name || isAdminNav(to, from)) return
    // New view is mounting behind the curtain; reset scroll, then reveal it.
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      requestAnimationFrame(reveal)
    })
  })
}
