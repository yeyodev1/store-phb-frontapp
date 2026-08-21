// Central brand / site configuration for the PHB — Agua Kangen store.

export const site = {
  brand: 'PowerHouse Biotech',
  storeName: 'Agua Kangen',
  tagline: 'Cambia tu Agua, Cambia tu Vida',
  description:
    'Ionizadores Kangen originales Enagic. Agua alcalina rica en hidrógeno, antioxidante y micro-agrupada, con tecnología médica japonesa.',
  contact: {
    person: 'Juan Román Garza Delgado',
    phone: '+1 786-602-0942',
    whatsapp: '17866020942',
    email: 'juan.garza@powerhousebiotech.com',
  },
  currency: 'USD',
  freeShippingNote: 'Envío y asesoría personalizada incluidos',
}

export const waterTypes = [
  { name: 'Súper Alcalina', ph: '11.5', use: 'Limpieza de alimentos y superficies', potable: false, tone: '#0E7C5A' },
  { name: 'Alcalina Kangen', ph: '8.5 – 9.5', use: 'Para beber e hidratar cada día', potable: true, tone: '#21BCFB' },
  { name: 'Neutra / Purificada', ph: '7.0', use: 'Bebés, mascotas y medicamentos', potable: true, tone: '#8AA0B6' },
  { name: 'Beauty / Ácida', ph: '4.0 – 6.0', use: 'Tónico para piel y cabello', potable: false, tone: '#C9A96A' },
  { name: 'Súper Ácida', ph: '2.5', use: 'Higiene y desinfección', potable: false, tone: '#E4785A' },
]

export const trustBadges = [
  'Tecnología médica japonesa',
  'Certificación Enagic desde 1974',
  'Garantía oficial hasta 5 años',
  'Asesoría personalizada',
]
