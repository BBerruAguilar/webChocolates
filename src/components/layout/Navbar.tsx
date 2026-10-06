import { CartButton } from '@/components/cart/CartButton'
import { BagIcon, LeafIcon, WhatsAppIcon } from '@/components/icons/Icons'
import { NAV_LINKS, SITE } from '@/config/site'
import { useScrolledPast } from '@/hooks/useScrolledPast'
import { WHATSAPP_CONTACT_URL } from '@/services/whatsapp'
import './Navbar.css'

const NAV_ICONS = { bag: BagIcon, leaf: LeafIcon }

export function Navbar() {
  // Transparente sobre el inicio; al bajar toma un fondo de vidrio para seguir siendo legible.
  const scrolled = useScrolledPast(40)

  return (
    <nav className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
      <a className="site-brand" href="#inicio">
        {SITE.name}
      </a>
      <div className="site-nav-actions">
        {NAV_LINKS.map(link => {
          const Icon = NAV_ICONS[link.icon]
          return (
            <a key={link.href} className="site-nav-icon" href={link.href} aria-label={link.label} data-tooltip={link.label}>
              <Icon className="icon" />
            </a>
          )
        })}
        <a
          className="site-nav-icon"
          href={WHATSAPP_CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacto por WhatsApp"
          data-tooltip="Contacto"
        >
          <WhatsAppIcon className="icon" />
        </a>
        <CartButton />
      </div>
    </nav>
  )
}
