import { useCallback, useState } from 'react'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Catalog } from '@/components/catalog/Catalog'
import { CollectionShowcase } from '@/components/collections/CollectionShowcase'
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
import { ProductSpotlight } from '@/components/spotlight/ProductSpotlight'
import { UnwrapViewer } from '@/components/unwrap/UnwrapViewer'
import { CartProvider } from '@/context/CartProvider'
import { families } from '@/data/families'
import { products } from '@/data/products'
import { useHashRoute } from '@/hooks/useHashRoute'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { BrandFilter, Product, ProductFamily } from '@/types/product'

export default function App() {
  const route = useHashRoute()
  const [filter, setFilter] = useState<BrandFilter>('Todos')
  const [zoomedProduct, setZoomedProduct] = useState<Product | null>(null)
  // El producto al frente del carrusel "salta" a la sección destacada al hacer scroll.
  const [activeFamily, setActiveFamily] = useState<ProductFamily>(families[0])
  const [flightPhase, setFlightPhase] = useState<FlightPhase>('idle')
  const [unwrapFamily, setUnwrapFamily] = useState<ProductFamily | null>(null)

  const showCatalog = useCallback((nextFilter: BrandFilter = 'Todos') => {
    setFilter(nextFilter)
    window.setTimeout(() => {
      document.querySelector('#catalogo')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }, 0)
  }, [])

  const closeZoom = useCallback(() => setZoomedProduct(null), [])
  const closeUnwrap = useCallback(() => setUnwrapFamily(null), [])

  return (
    <CartProvider products={products}>
      <div className="app-shell" data-flight={flightPhase}>
        <AnimatedBackground />
        <Navbar solid={route === 'regalo'} />
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
            <CollectionShowcase onSelectBrand={showCatalog} />
            <Catalog products={products} filter={filter} onFilterChange={setFilter} onZoom={setZoomedProduct} />
            <CacaoJourney />
            <OriginStrip />
          </main>
        )}

        <Footer />
        {route === 'home' && <ProductFlight family={activeFamily} onPhaseChange={setFlightPhase} />}
        <ProductLightbox product={zoomedProduct} onClose={closeZoom} />
        <UnwrapViewer family={unwrapFamily} onClose={closeUnwrap} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
