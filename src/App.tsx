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

  /** Filtra el catálogo, baja hasta él y, si se indica, resalta la tarjeta del producto. */
  const goToCatalog = useCallback(
    (nextFilter: CatalogFilter, productId?: number) => {
      setSearchOpen(false)
      setFilter(nextFilter)
      setRevealProductId(productId ?? null)

      const leavingGiftPage = route !== 'home'
      if (leavingGiftPage) window.location.hash = '#catalogo'

      // Espera a que el catálogo se dibuje con el nuevo filtro (y la página, si venía del regalo).
      window.setTimeout(
        () => {
          const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
          const card = productId ? document.querySelector<HTMLElement>(`[data-product-id="${productId}"]`) : null
          if (!card) {
            document.getElementById('catalogo')?.scrollIntoView({ behavior })
            return
          }
          card.scrollIntoView({ behavior, block: 'center' })
          card.classList.remove('is-highlighted')
          void card.offsetWidth // reinicia la animación si se busca dos veces el mismo
          card.classList.add('is-highlighted')
          window.setTimeout(() => card.classList.remove('is-highlighted'), 2400)
        },
        leavingGiftPage ? 450 : 60,
      )
    },
    [route],
  )

  const selectSearchProduct = useCallback(
    (product: Product) => goToCatalog(getFamilyOf(product.id)?.id ?? 'todos', product.id),
    [goToCatalog],
  )
  const selectSearchFamily = useCallback((family: ProductFamily) => goToCatalog(family.id), [goToCatalog])

  // Enlace directo a un producto (botón "Compartir"): lleva a su tarjeta en el catálogo y la resalta.
  useEffect(() => {
    const openSharedProduct = () => {
      const id = productIdFromHash()
      if (id === null || !products.some(product => product.id === id)) return
      goToCatalog(getFamilyOf(id)?.id ?? 'todos', id)
      // La dirección queda en el catálogo: recargar la página no vuelve a saltar al producto.
      if (productIdFromHash() !== null) window.history.replaceState(null, '', '#catalogo')
    }
    // Al abrir el enlace se espera a que la página termine de cargar: así el resaltado se ve.
    let timer = 0
    const openAfterLoad = () => {
      timer = window.setTimeout(openSharedProduct, 300)
    }
    if (document.readyState === 'complete') openAfterLoad()
    else window.addEventListener('load', openAfterLoad, { once: true })
    window.addEventListener('hashchange', openSharedProduct)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('load', openAfterLoad)
      window.removeEventListener('hashchange', openSharedProduct)
    }
  }, [goToCatalog])

  return (
    <CartProvider products={products}>
      <div className="app-shell" data-flight={flightPhase}>
        <AnimatedBackground />
        <Navbar solid={route === 'regalo'} onSearch={() => setSearchOpen(true)} />
        <WhatsAppButton />

        {route === 'regalo' ? (
          <GiftBoxPage />
        ) : (
          <main>
            <HeroShowcase
              families={families}
              onActiveChange={setActiveFamily}
              autoplayPaused={flightPhase === 'flying' || flightPhase === 'landed'}
            />
            <ProductSpotlight
              key={activeFamily.id}
              family={activeFamily}
              onZoom={setZoomedProduct}
              onUnwrap={setUnwrapFamily}
            />
            <GiftBanner />
            <Catalog
              products={products}
              filter={filter}
              onFilterChange={setFilter}
              onZoom={setZoomedProduct}
              revealProductId={revealProductId}
            />
            <CacaoJourney />
            <OriginStrip />
          </main>
        )}

        <Footer />
        {route === 'home' && <ProductFlight family={activeFamily} onPhaseChange={setFlightPhase} />}
        <ProductLightbox product={zoomedProduct} onClose={closeZoom} />
        <UnwrapViewer family={unwrapFamily} onClose={closeUnwrap} />
        <SearchOverlay
          open={searchOpen}
          onClose={closeSearch}
          onSelectProduct={selectSearchProduct}
          onSelectFamily={selectSearchFamily}
        />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
