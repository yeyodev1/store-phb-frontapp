#!/usr/bin/env node
/**
 * Genera las portadas de los productos del catálogo como SVG.
 *
 * Para una tienda de conocimiento la portada tipográfica funciona mejor que
 * el banco de imágenes: es consistente, no depende de licencias y se regenera
 * cuando cambia el catálogo.
 *
 *   node scripts/generate-covers.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/img/products')
mkdirSync(OUT, { recursive: true })

// Paleta de marca — misma que src/styles/colorVariables.module.scss
const INK = '#010D27'
const NAVY = '#0A1533'
const DEEP = '#14224A'
const CYAN = '#21BCFB'
const GOLD = '#C9A96A'
const GOLD_SOFT = '#E4CE9E'
const WHITE = '#FFFFFF'

/** Cada mundo tiene su glifo geométrico. Nada de gotas. */
const GLYPHS = {
  aprende: `<g stroke="${GOLD}" stroke-width="3" fill="none" stroke-linecap="round">
      <path d="M0 -34 L0 34" opacity=".35"/>
      <path d="M-38 -26 q38 -10 38 8 v46 q0 -16 -38 -6 z"/>
      <path d="M38 -26 q-38 -10 -38 8 v46 q0 -16 38 -6 z"/>
    </g>`,
  formate: `<g stroke="${GOLD}" stroke-width="3" fill="none" stroke-linejoin="round">
      <path d="M-42 -12 L0 -32 L42 -12 L0 8 Z"/>
      <path d="M-24 -2 v22 q24 14 48 0 v-22"/>
    </g>`,
  evaluate: `<g stroke="${GOLD}" stroke-width="3" fill="none" stroke-linecap="round">
      <path d="M-40 26 h80" opacity=".4"/>
      <rect x="-34" y="-4" width="16" height="30" rx="3"/>
      <rect x="-8" y="-26" width="16" height="52" rx="3"/>
      <rect x="18" y="-14" width="16" height="40" rx="3"/>
    </g>`,
  actua: `<g stroke="${GOLD}" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round">
      <path d="M6 -34 L-20 4 h18 L-6 34 L22 -6 H4 Z"/>
    </g>`,
  regeneracion: `<g stroke="${GOLD}" stroke-width="3" fill="none" stroke-linecap="round">
      <path d="M-26 -32 q52 22 0 64"/>
      <path d="M26 -32 q-52 22 0 64"/>
      <path d="M-20 -14 h40 M-24 0 h48 M-20 14 h40" opacity=".55"/>
    </g>`,
}

function cover({ slug, world, eyebrow, title, note }) {
  const glyph = GLYPHS[world] ?? GLYPHS.aprende
  // Corta el título en líneas de ~18 caracteres sin partir palabras.
  const words = title.split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > 18 && cur) {
      lines.push(cur.trim())
      cur = w
    } else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur)
  const shown = lines.slice(0, 4)
  const size = shown.length > 3 ? 42 : shown.length > 2 ? 48 : 54
  const startY = 300 - ((shown.length - 1) * size * 1.16) / 2

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${DEEP}"/>
      <stop offset=".55" stop-color="${NAVY}"/>
      <stop offset="1" stop-color="${INK}"/>
    </linearGradient>
    <radialGradient id="glow" cx=".78" cy=".12" r=".62">
      <stop offset="0" stop-color="${CYAN}" stop-opacity=".22"/>
      <stop offset="1" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bg)"/>
  <rect width="800" height="600" fill="url(#glow)"/>
  <rect x="18" y="18" width="764" height="564" fill="none" stroke="${GOLD}" stroke-opacity=".28"/>

  <g transform="translate(672,132)" opacity=".9">${glyph}</g>

  <text x="64" y="112" fill="${GOLD_SOFT}" font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
        font-size="17" font-weight="600" letter-spacing="5.5">${esc(eyebrow.toUpperCase())}</text>

  <g font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-weight="700" fill="${WHITE}">
    ${shown
      .map(
        (l, i) =>
          `<text x="64" y="${startY + i * size * 1.16}" font-size="${size}" letter-spacing="-1">${esc(l)}</text>`
      )
      .join('\n    ')}
  </g>

  <line x1="64" y1="452" x2="188" y2="452" stroke="${GOLD}" stroke-width="3"/>

  ${
    note
      ? `<text x="64" y="492" fill="#A9B6CC" font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
        font-size="19">${esc(note)}</text>`
      : ''
  }

  <text x="64" y="546" fill="${WHITE}" fill-opacity=".72" font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
        font-size="15" font-weight="600" letter-spacing="3.4">JUAN ROMÁN GARZA</text>
  <text x="286" y="546" fill="${CYAN}" font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
        font-size="15" font-weight="700" letter-spacing="3.4">× PHB</text>
</svg>
`
  writeFileSync(`${OUT}/${slug}.svg`, svg)
  return `${slug}.svg`
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const COVERS = [
  { slug: 'phb-health-check', world: 'evaluate', eyebrow: 'Evaluación gratuita', title: 'PHB Health Check', note: '10–15 preguntas · sin costo' },
  { slug: 'todavia-no-estoy-tan-mal', world: 'aprende', eyebrow: 'PDF / E-book', title: 'Todavía no estoy tan mal', note: 'Guía de señales tempranas' },
  { slug: '50-biomarcadores', world: 'aprende', eyebrow: 'Guía digital', title: '50 biomarcadores que deberías conocer', note: '42 páginas · lectura 60 min' },
  { slug: 'entender-analisis-clinicos', world: 'aprende', eyebrow: 'Masterclass', title: 'Cómo entender tus análisis clínicos', note: 'Qué preguntar y qué buscar' },
  { slug: 'phb-health-intelligence', world: 'formate', eyebrow: 'Curso', title: 'PHB Health Intelligence', note: 'Perspectiva multisistémica' },
  { slug: 'phb-basic', world: 'evaluate', eyebrow: 'Evaluación PHB', title: 'PHB Basic', note: 'Tu primera fotografía de salud' },
  { slug: 'phb-biomarkers', world: 'evaluate', eyebrow: 'Evaluación PHB', title: 'PHB Biomarkers', note: 'Interpreta tus estudios' },
  { slug: 'phb-multisystem', world: 'evaluate', eyebrow: 'Evaluación PHB', title: 'PHB Multisystem', note: 'Tu salud como sistema' },
  { slug: 'phb-regenerative-capacity', world: 'regeneracion', eyebrow: 'Evaluación PHB', title: 'PHB Regenerative Capacity', note: 'Evalúa antes de regenerar' },
  { slug: 'phb-longevity', world: 'evaluate', eyebrow: 'Evaluación PHB', title: 'PHB Longevity', note: 'Riesgo, prevención y longevidad' },
  { slug: 'phb-precision', world: 'evaluate', eyebrow: 'Evaluación insignia', title: 'PHB Precision', note: 'La evaluación más completa' },
  { slug: 'phb-actua-30', world: 'actua', eyebrow: 'Programa · 30 días', title: 'PHB ACTÚA 30', note: 'De la conciencia a la acción' },
  { slug: 'programa-regenerativo-metabolico', world: 'regeneracion', eyebrow: 'Programa clínico', title: 'Programa Regenerativo Metabólico', note: 'Requiere evaluación previa' },
]

for (const c of COVERS) console.log('generada:', cover(c))
console.log(`\n${COVERS.length} portadas en public/img/products/`)
