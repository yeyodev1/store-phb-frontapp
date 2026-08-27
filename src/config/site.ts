// Configuración de marca de la tienda del ecosistema Juan Román Garza × PHB.
// Todo el copy de este archivo sale de los documentos del cliente.

export const site = {
  brand: 'Juan Román Garza',
  storeName: 'PHB',
  /** BRIEF §14 */
  tagline: 'Entiende tu salud. Decide mejor. Actúa antes.',
  /** BRIEF §1 */
  description:
    'Conferencias, cursos, evaluaciones, herramientas y programas diseñados para ayudarte a entender tu salud, actuar oportunamente y construir una estrategia personal de prevención y regeneración.',
  contact: {
    person: 'Juan Román Garza',
    phone: '+52 1 55 5351 8114',
    whatsapp: '5215553518114',
    email: 'info@powerhousebiotech.com',
  },
  currency: 'MXN',
  freeShippingNote: 'Acceso inmediato tras la compra',
  /** Hub del ecosistema y app de evaluación. */
  links: {
    hub: 'https://salud.powerhousebiotech.com',
    evaluacion: 'https://evaluacion.powerhousebiotech.com',
  },
}

/** PDF-1: la filosofía que recorre todo el ecosistema. */
export const method = ['Comprender', 'Decidir', 'Actuar', 'Medir', 'Regenerar']

/** BRIEF §2: los mundos del catálogo. Cada uno es una categoría real en la base. */
export const worlds = [
  {
    slug: 'aprende',
    name: 'Aprende',
    claim: 'Comprender',
    copy: 'Libros, guías, masterclasses y contenidos para entender tu cuerpo y reconocer riesgos a tiempo.',
    icon: 'fa-solid fa-book-open',
  },
  {
    slug: 'formate',
    name: 'Fórmate',
    claim: 'Profundizar',
    copy: 'Cursos para interpretar tu salud desde una perspectiva multisistémica.',
    icon: 'fa-solid fa-graduation-cap',
  },
  {
    slug: 'evaluate',
    name: 'Evalúate',
    claim: 'Medir',
    copy: 'Evaluaciones PHB que convierten síntomas, antecedentes y biomarcadores en prioridades claras.',
    icon: 'fa-solid fa-chart-simple',
  },
  {
    slug: 'actua',
    name: 'Actúa',
    claim: 'Cambiar',
    copy: 'Programas para convertir intención en comportamiento sostenido.',
    icon: 'fa-solid fa-bolt',
  },
  {
    slug: 'regeneracion',
    name: 'Regeneración',
    claim: 'Intervenir',
    copy: 'Programas clínicos que se evalúan antes de proponerse. Nunca se compran a ciegas.',
    icon: 'fa-solid fa-dna',
  },
]

/**
 * PDF-2 §03: el visitante entra por su preocupación, no por el nombre del producto.
 * Coincide con el campo `themes` del modelo de producto.
 */
export const themes = [
  {
    slug: 'biomarcadores',
    name: 'Mis biomarcadores',
    icon: 'fa-solid fa-vial',
    copy: 'Aprende qué información pueden aportar glucosa, insulina, HbA1c, inflamación, lípidos, función renal, hormonas y otros indicadores.',
  },
  {
    slug: 'prevencion',
    name: 'Mi riesgo de enfermedad',
    icon: 'fa-solid fa-heart-pulse',
    copy: 'Comprende cómo ciertos factores pueden acumularse durante años antes de convertirse en enfermedad manifiesta.',
  },
  {
    slug: 'comportamiento',
    name: 'Mi comportamiento',
    icon: 'fa-solid fa-brain',
    copy: 'Entiende por qué saber que necesitas cambiar no necesariamente significa que vas a hacerlo.',
  },
  {
    slug: 'regeneracion',
    name: 'Mi capacidad de recuperación',
    icon: 'fa-solid fa-dna',
    copy: 'Conoce los factores relacionados con adaptación, reparación, función y medicina regenerativa.',
  },
  {
    slug: 'longevidad',
    name: 'Mi longevidad',
    icon: 'fa-solid fa-hourglass-half',
    copy: 'Aprende a pensar más allá de vivir más años: preservar energía, función, autonomía y productividad.',
  },
  {
    slug: 'innovacion',
    name: 'Nuevas tecnologías y tratamientos',
    icon: 'fa-solid fa-microscope',
    copy: 'Explora avances en prevención, diagnóstico, tecnología, terapias y medicina regenerativa.',
  },
]

/** PDF-2: los cuatro datos que toda ficha muestra siempre. */
export const trustBadges = [
  'Qué es',
  'Qué aprenderás',
  'Para quién es',
  'Cuánto tiempo necesitas',
]
