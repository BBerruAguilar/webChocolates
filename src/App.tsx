import { useCallback, useEffect, useState } from 'react'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Catalog } from '@/components/catalog/Catalog'
import { ProductFlight, type FlightPhase } from '@/components/flight/ProductFlight'
import { GiftBanner } from '@/components/gift/GiftBanner'
import { GiftBoxPage } from '@/components/gift/GiftBoxPage'
import { HeroShowcase } from '@/components/hero/HeroShowcase'
import { CacaoJourney } from '@/components/journey/CacaoJourney'
import { AnimatedBackground } from '@/components/layout/AnimatedBackground'
import { Footer, OriginStrip } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { ProductLightbox } from '@/components/product/ProductLightbox'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { ProductSpotlight } from '@/components/spotlight/ProductSpotlight'
import { UnwrapViewer } from '@/components/unwrap/UnwrapViewer'
import { CartProvider } from '@/context/CartProvider'
import { families, getFamilyOf } from '@/data/families'
import { products } from '@/data/products'
import { useHashRoute } from '@/hooks/useHashRoute'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { productIdFromHash } from '@/services/share'
import type { CatalogFilter, Product, ProductFamily } from '@/types/product'

export default function App() {
  const route = useHashRoute()
  const [filter, setFilter] = useState<CatalogFilter>('todos')
  const [zoomedProduct, setZoomedProduct] = useState<Product | null>(null)
  // El producto al frente del carrusel "salta" a la sección destacada al hacer scroll.
  const [activeFamily, setActiveFamily] = useState<ProductFamily>(families[0])
  const [flightPhase, setFlightPhase] = useState<FlightPhase>('idle')
  const [unwrapFamily, setUnwrapFamily] = useState<ProductFamily | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  // Producto elegido en la búsqueda: el catálogo abre las filas necesarias para mostrarlo.
  const [revealProductId, setRevealProductId] = useState<number | null>(null)

  const closeZoom = useCallback(() => setZoomedProduct(null), [])
  const closeUnwrap = useCallback(() => setUnwrapFamily(null), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  // Atajos del buscador: "/" o Ctrl+K (Cmd+K en Mac), salvo que se esté escribiendo en un campo.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const typing = target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')
      const shortcut = (event.key === '/' && !typing) || (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey))
      if (!shortcut) return
      event.preventDefault()
      setSearchOpen(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
