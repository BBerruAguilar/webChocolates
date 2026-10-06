export const SITE = {
  name: 'Wayu & Mikhuna',
  origin: 'Tingo María, Huánuco, Perú',
  whatsappNumber: '51923400158',
  whatsappDisplay: '923 400 158',
  contactMessage: 'Hola, quisiera recibir información sobre sus chocolates artesanales.',
  currency: 'S/.',
} as const

/** Enlaces del menú: se muestran como íconos, el texto queda como etiqueta accesible y tooltip. */
export const NAV_LINKS = [
  { label: 'Colección', href: '#catalogo', icon: 'bag' },
  { label: 'Nosotros', href: '#nosotros', icon: 'leaf' },
] as const
