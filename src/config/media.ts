/**
 * Fotografía oficial de Juan Román Garza.
 * Misma biblioteca Cloudinary que usa juanromangarza.com, servida con
 * transformaciones para no cargar el original.
 */
const CLD = 'https://res.cloudinary.com/drw5sn8qw/image/upload'
const img = (path: string, t = 'q_auto,f_auto') => `${CLD}/${t}/${path}`

export const JUAN = {
  /** Retrato de estudio, fondo claro. Autoridad. */
  portrait: img(
    'v1780095160/assets-juan/1fdb1f14-5799-4c12-ba46-8590a824770b.jpg',
    'w_900,q_auto,f_auto',
  ),
  /** Cuerpo completo sentado, fondo blanco. */
  seated: img(
    'v1780095164/assets-juan/5e7c35cb-17e2-4244-ab47-c3f4d3edff54.jpg',
    'w_780,q_auto,f_auto',
  ),
  /** En escenario: "Longevidad Regenerativa". */
  stage: img(
    'v1780095165/assets-juan/71a520fc-beb0-4eb0-b7b6-3e97fef04266.jpg',
    'w_1200,q_auto,f_auto',
  ),
  /** Auditorio lleno. Prueba social. */
  auditorium: img(
    'v1780095166/assets-juan/c875b275-008f-42eb-8828-799b8d573ae1.jpg',
    'w_1400,q_auto,f_auto',
  ),
  /** Masterclass "La medicina del futuro · El potencial de las células madre". */
  masterclass: img(
    'v1780095163/assets-juan/5dfa62f2-170e-42eb-867b-f98a1c816781.jpg',
    'w_1200,q_auto,f_auto',
  ),
  /** Presentación ejecutiva. */
  executive: img(
    'v1780095164/assets-juan/65feeba0-0dce-4cff-b63d-eb15952be89c.jpg',
    'w_1200,q_auto,f_auto',
  ),
} as const

/** Medios donde ha aparecido. PNG blancos sobre transparente. */
export const PRESS = [
  '/img/press/press-1.png',
  '/img/press/press-2.png',
  '/img/press/press-3.png',
  '/img/press/press-4.png',
  '/img/press/press-5.png',
  '/img/press/press-6.png',
] as const
