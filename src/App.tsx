import { useCallback, useState } from 'react'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Catalog } from '@/components/catalog/Catalog'
import { CollectionShowcase } from '@/components/collections/CollectionShowcase'
import { ProductFlight, type FlightPhase } from '@/components/flight/ProductFlight'
import { HeroShowcase } from '@/components/hero/HeroShowcase'
import { AnimatedBackground } from '@/components/layout/AnimatedBackground'
import { Footer, OriginStrip } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { ProductLightbox } from '@/components/product/ProductLightbox'
import { ProductSpotlight } from '@/components/spotlight/ProductSpotlight'
import { CartProvider } from '@/context/CartProvider'
import { families } from '@/data/families'
import { products } from '@/data/products'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { BrandFilter, Product, ProductFamily } from '@/types/product'

export default function App() {
  const [filter, setFilter] = useState<BrandFilter>('Todos')
  const [zoomedProduct, setZoomedProduct] = useState<Product | null>(null)
  // El producto al frente del carrusel "salta" a la sección destacada al hacer scroll.
  const [activeFamily, setActiveFamily] = useState<ProductFamily>(families[0])
  const [flightPhase, setFlightPhase] = useState<FlightPhase>('idle')

  const showCatalog = useCallback((nextFilter: BrandFilter = 'Todos') => {
    setFilter(nextFilter)
    window.setTimeout(() => {
      document.querySelector('#catalogo')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }, 0)
  }, [])

  const closeZoom = useCallback(() => setZoomedProduct(null), [])

  return (
    <CartProvider products={products}>
      <div className="app-shell" data-flight={flightPhase}>
        <AnimatedBackground />
        <Navbar />
        <WhatsAppButton />

        <main>
          <HeroShowcase
            families={families}
            onActiveChange={setActiveFamily}
            autoplayPaused={flightPhase === 'flying' || flightPhase === 'landed'}
          />
          <ProductSpotlight key={activeFamily.id} family={activeFamily} onZoom={setZoomedProduct} />
          <CollectionShowcase onSelectBrand={showCatalog} />
          <Catalog products={products} filter={filter} onFilterChange={setFilter} onZoom={setZoomedProduct} />
          <OriginStrip />
        </main>

        <Footer />
        <ProductFlight family={activeFamily} onPhaseChange={setFlightPhase} />
        <ProductLightbox product={zoomedProduct} onClose={closeZoom} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
