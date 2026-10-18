import { WhatsAppIcon } from '@/components/icons/Icons'
import { SITE } from '@/config/site'
import { WHATSAPP_CONTACT_URL } from '@/services/whatsapp'
import './Footer.css'

const ORIGIN_FACTS = [
  { label: 'Origen', value: 'Tingo María, Perú' },
  { label: 'Proceso', value: 'Del grano a la barra' },
  { label: 'Cacao', value: 'Fino de Aroma' },
]

export function OriginStrip() {
  return (
    <section id="nosotros" className="origin-strip" aria-label="Sobre nosotros">
      {ORIGIN_FACTS.map(fact => (
        <p key={fact.label} className="origin-value">
          {fact.value}
        </p>
      ))}
    </section>
  )
}

export function Footer() {
  return (
    <footer id="contacto" className="site-footer">
      <span className="site-footer-brand">Wayu Chocolates y Choco Mikhuna © 2026</span>
      <a className="site-footer-contact" href={WHATSAPP_CONTACT_URL} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon className="icon" />
        {SITE.whatsappDisplay}
      </a>
      <p className="site-footer-origin">Un placer natural de {SITE.origin}</p>
    </footer>
  )
}
