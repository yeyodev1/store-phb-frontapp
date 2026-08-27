import type { Product, Theme } from '@/types'

/** Etiqueta legible para cada eje temático del catálogo. */
export const THEME_LABELS: Record<Theme, string> = {
  biomarcadores: 'Biomarcadores',
  prevencion: 'Prevención',
  comportamiento: 'Comportamiento',
  regeneracion: 'Regeneración',
  longevidad: 'Longevidad',
  innovacion: 'Innovación',
}

/**
 * Blindaje de negocio: un producto clínico, o cualquiera marcado con
 * requiresEvaluation, jamás se compra directo — se evalúa. No confiar
 * solo en el dato que manda el backend (isPurchasable): recalcular acá.
 */
export function requiresGate(product: Product): boolean {
  return product.productType === 'clinical' || !!product.requiresEvaluation
}

/** true si el producto es un "imán de leads" (gratis, sin cobro). */
export function isLeadMagnet(product: Product): boolean {
  return !!product.isLeadMagnet
}

/** true solo para el catálogo físico Kangen — specs/stock/envío aplican. */
export function isPhysical(product: Product): boolean {
  return product.productType === 'physical'
}

/** El negocio aún no fijó precio: no se cobra hasta que lo defina. */
export function isPriceOnRequest(product: Product): boolean {
  return !!product.priceOnRequest
}

/** Puede agregarse al carrito y pasar por checkout normal. */
export function canAddToCart(product: Product): boolean {
  if (requiresGate(product)) return false
  if (isLeadMagnet(product)) return false
  if (isPriceOnRequest(product)) return false
  if (product.isPurchasable === false) return false
  return true
}

/** Se muestra precio solo cuando el producto realmente se cobra. */
export function showsPrice(product: Product): boolean {
  return !requiresGate(product) && !isLeadMagnet(product) && !isPriceOnRequest(product)
}

/** Fallback local del CTA — misma lógica que debería resolver el backend. */
export function getCtaLabel(product: Product): string {
  if (product.resolvedCtaLabel) return product.resolvedCtaLabel
  if (requiresGate(product)) return 'Evaluar mi candidatura'
  if (isLeadMagnet(product)) return 'Descargar gratis'
  if (isPriceOnRequest(product)) return 'Más información'
  if (product.ctaLabel) return product.ctaLabel
  if (product.productType === 'assessment') return 'Comenzar evaluación'
  if (product.productType === 'program') return 'Inscribirme'
  if (product.deliveryMethod === 'download') return 'Descargar ahora'
  if (product.deliveryMethod === 'platform-access') return 'Obtener acceso'
  if (product.deliveryMethod === 'scheduled-consultation') return 'Agendar consulta'
  return 'Agregar al carrito'
}

/** A dónde navega el CTA cuando el producto está blindado (no se compra). */
export function getGateTarget(product: Product): string {
  return product.evaluationUrl || `/producto/${product.slug}`
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}
