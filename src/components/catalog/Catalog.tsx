import { ProductCard } from '@/components/catalog/ProductCard'
import { BRAND_FILTERS, countByBrand, filterCatalog } from '@/services/catalog'
import type { BrandFilter, Product } from '@/types/product'
import './Catalog.css'

type CatalogProps = {
  products: Product[]
  filter: BrandFilter
  onFilterChange: (filter: BrandFilter) => void
  onZoom: (product: Product) => void
}

export function Catalog({ products, filter, onFilterChange, onZoom }: CatalogProps) {
  const visible = filterCatalog(products, filter)

  return (
    <>
      <div className="catalog-divider" />

      <div id="catalogo" className="catalog-filters" role="group" aria-label="Filtrar por marca">
        {BRAND_FILTERS.map(option => (
          <button
            key={option}
            type="button"
            className={`catalog-filter${filter === option ? ' is-active' : ''}`}
            aria-pressed={filter === option}
            onClick={() => onFilterChange(option)}
          >
            {option} {option !== 'Todos' && `(${countByBrand(products, option)})`}
          </button>
        ))}
        <span className="product-count">{visible.length} productos</span>
      </div>

      <section className="catalog-section" aria-label="Catálogo de productos">
        <div className="product-grid">
          {visible.map(product => (
            <ProductCard key={product.id} product={product} onZoom={onZoom} />
          ))}
        </div>
      </section>
    </>
  )
}
