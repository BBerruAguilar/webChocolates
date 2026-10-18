import { useEffect, useState, type CSSProperties } from 'react'
import { CartButton } from '@/components/cart/CartButton'
import { BagIcon, GiftIcon, LeafIcon, SearchIcon, WhatsAppIcon } from '@/components/icons/Icons'
import { NAV_LINKS, SITE } from '@/config/site'
import { useModalBehavior } from '@/hooks/useModalBehavior'
import { useScrolledPast } from '@/hooks/useScrolledPast'
import { WHATSAPP_CONTACT_URL } from '@/services/whatsapp'
import './Navbar.css'

const NAV_ICONS = { bag: BagIcon, gift: GiftIcon, leaf: LeafIcon }

/** Ancho desde el que se usa el menú hamburguesa (igual que en Navbar.css). */
const MOBILE_QUERY = '(max-width: 600px)'

type NavbarProps = {
  /** Fondo siempre visible (en páginas de fondo claro, donde el menú transparente no se leería). */
  solid?: boolean
  onSearch: () => void
}

/** Nombre del ícono: sale deslizándose hacia la izquierda al pasar el mouse. */
function NavLabel({ children }: { children: string }) {
  return (
    <span className="site-nav-label" aria-hidden="true">
      {children}
    </span>
  )
}

export function Navbar({ solid = false, onSearch }: NavbarProps) {
  // Transparente sobre el inicio; al bajar toma un fondo de vidrio para seguir siendo legible.
  const scrolled = useScrolledPast(40) || solid
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  useModalBehavior(menuOpen, closeMenu)

  // Si la pantalla se agranda con el menú abierto (girar el celular), el menú ya no aplica.
  useEffect(() => {
    if (!menuOpen) return
    const media = window.matchMedia(MOBILE_QUERY)
    const close = () => !media.matches && setMenuOpen(false)
    media.addEventListener('change', close)
    return () => media.removeEventListener('change', close)
  }, [menuOpen])

  return (
    <>
      <nav className={`site-nav${scrolled ? ' is-scrolled' : ''}${solid ? ' is-solid' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
        <a className="site-brand" href="#inicio" onClick={closeMenu}>
          {SITE.name}
        </a>
        <div className="site-nav-actions">
          <button
            type="button"
            className="site-nav-icon"
            onClick={() => {
              closeMenu()
              onSearch()
            }}
            aria-label="Buscar productos"
            aria-keyshortcuts="/"
          >
            <NavLabel>Buscar</NavLabel>
            <SearchIcon className="icon" />
          </button>
          {NAV_LINKS.map(link => {
            const Icon = NAV_ICONS[link.icon]
            return (
              <a key={link.href} className="site-nav-icon is-link" href={link.href} aria-label={link.label}>
                <NavLabel>{link.label}</NavLabel>
                <Icon className="icon" />
              </a>
            )
          })}
          <a
            className="site-nav-icon is-whatsapp"
            href={WHATSAPP_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contacto por WhatsApp"
          >
            <NavLabel>Contacto</NavLabel>
            <WhatsAppIcon className="icon" />
          </a>
          <CartButton label={<NavLabel>Carrito</NavLabel>} />
          <button
            type="button"
            className="site-nav-toggle"
            onClick={() => setMenuOpen(open => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Menú de celular: los enlaces con su nombre, a pantalla completa bajo la barra. */}
      <div id="mobile-menu" className={`mobile-menu${menuOpen ? ' is-open' : ''}`} inert={!menuOpen} onClick={closeMenu}>
        <ul>
          {NAV_LINKS.map((link, index) => {
            const Icon = NAV_ICONS[link.icon]
            return (
              <li key={link.href} style={{ '--i': index } as CSSProperties}>
                <a href={link.href}>
                  <Icon className="icon" />
                  {link.label}
                </a>
              </li>
            )
          })}
          <li style={{ '--i': NAV_LINKS.length } as CSSProperties}>
            <a href={WHATSAPP_CONTACT_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="icon" />
              Contacto
            </a>
          </li>
        </ul>
        <p className="mobile-menu-foot">{SITE.origin}</p>
      </div>
    </>
  )
}
