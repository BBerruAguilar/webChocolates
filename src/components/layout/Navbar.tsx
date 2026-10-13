import { CartButton } from '@/components/cart/CartButton'
import { BagIcon, GiftIcon, LeafIcon, WhatsAppIcon } from '@/components/icons/Icons'
import { NAV_LINKS, SITE } from '@/config/site'
import { useScrolledPast } from '@/hooks/useScrolledPast'
import { WHATSAPP_CONTACT_URL } from '@/services/whatsapp'
import './Navbar.css'

const NAV_ICONS = { bag: BagIcon, gift: GiftIcon, leaf: LeafIcon }

type NavbarProps = {
  /** Fondo siempre visible (en páginas de fondo claro, donde el menú transparente no se leería). */
  solid?: boolean
}

export function Navbar({ solid = false }: NavbarProps) {
  // Transparente sobre el inicio; al bajar toma un fondo de vidrio para seguir siendo legible.
  const scrolled = useScrolledPast(40) || solid

  return (
    <nav className={`site-nav${scrolled ? ' is-scrolled' : ''}${solid ? ' is-solid' : ''}`}>
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
