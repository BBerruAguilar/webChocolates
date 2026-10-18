import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ChevronIcon } from '@/components/icons/Icons'
import { families } from '@/data/families'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { filterCatalog } from '@/services/catalog'
import type { CatalogFilter, Product } from '@/types/product'
import './Catalog.css'

type CatalogProps = {
  products: Product[]
  filter: CatalogFilter
  onFilterChange: (filter: CatalogFilter) => void
  onZoom: (product: Product) => void
  /** Producto que debe quedar a la vista aunque esté más allá de las filas mostradas (búsqueda). */
  revealProductId?: number | null
}

/** Filas que se muestran al inicio y que agrega cada "Ver más". */
const ROWS_PER_STEP = 2

/** Cuántas columnas tiene la grilla ahora (depende del ancho: la grilla usa auto-fill). */
function useGridColumns(gridRef: RefObject<HTMLDivElement | null>, remountKey: string) {
  const [columns, setColumns] = useState(4)

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const measure = () => setColumns(Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(' ').length))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(grid)
    return () => observer.disconnect()
  }, [gridRef, remountKey])

  return columns
}

export function Catalog({ products, filter, onFilterChange, onZoom, revealProductId }: CatalogProps) {
  const visible = filterCatalog(products, filter)
  const gridRef = useRef<HTMLDivElement>(null)
  const columns = useGridColumns(gridRef, filter)
  const step = columns * ROWS_PER_STEP

  // Las filas abiertas se recuerdan por filtro: al cambiar de filtro se vuelve a empezar.
  const [expanded, setExpanded] = useState({ filter, steps: 1 })
  const revealIndex = revealProductId ? visible.findIndex(product => product.id === revealProductId) : -1
  const steps = Math.max(expanded.filter === filter ? expanded.steps : 1, Math.ceil((revealIndex + 1) / step))
  const shown = visible.slice(0, steps * step)
  const remaining = visible.length - shown.length

  function showMore() {
    setExpanded({ filter, steps: steps + 1 })
  }

  /** Elige el filtro y, si la repisa se desliza (celular), lo centra para que se vea completo. */
  function choose(next: CatalogFilter, button: HTMLElement) {
    onFilterChange(next)
    button.scrollIntoView({ inline: 'center', block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <section id="catalogo" className="catalog" aria-labelledby="catalog-title">
      <header className="catalog-header">
        <h2 id="catalog-title">Elige tu chocolate</h2>
      </header>

      {/*
        Repisa de filtros: cada producto principal parado sobre una línea fina, con su nombre.
        El elegido se eleva; "Todos" muestra tres productos juntos.
      */}
      <div className="catalog-shelf" role="group" aria-label="Filtrar por tipo de producto">
        <button
          type="button"
          className={`catalog-filter is-all${filter === 'todos' ? ' is-active' : ''}`}
          aria-pressed={filter === 'todos'}
          onClick={event => choose('todos', event.currentTarget)}
        >
          <span className="catalog-filter-figure">
            {families.slice(0, 3).map(family => (
              <img key={family.id} src={family.image} alt="" loading="lazy" />
            ))}
          </span>
          <span className="catalog-filter-name">Todos</span>
        </button>
        {families.map(family => (
          <button
            key={family.id}
            type="button"
            className={`catalog-filter${filter === family.id ? ' is-active' : ''}`}
            aria-pressed={filter === family.id}
            onClick={event => choose(family.id, event.currentTarget)}
          >
            <span className="catalog-filter-figure">
              <img src={family.image} alt="" loading="lazy" />
            </span>
            <span className="catalog-filter-name">{family.name}</span>
          </button>
        ))}
      </div>

      {/* La clave cambia con el filtro: las tarjetas vuelven a entrar escalonadas. */}
      <div
        key={filter}
        ref={gridRef}
        id="product-grid"
        className={`product-grid${remaining > 0 ? ' is-truncated' : ''}`}
      >
        {shown.map((product, index) => (
          // Las tarjetas que llegan con "Ver más" entran escalonadas desde la primera nueva.
          <div key={product.id} className="product-grid-item" style={{ '--i': Math.min(index % step, 8) } as CSSProperties}>
            <ProductCard product={product} onZoom={onZoom} />
          </div>
        ))}
      </div>

      {/* Al final de las filas mostradas, sobre la última fila desvanecida. */}
      {remaining > 0 && (
        <div className="product-more">
          <button type="button" onClick={showMore} aria-controls="product-grid">
            Ver más
            <ChevronIcon direction="down" className="icon" />
          </button>
        </div>
      )}
    </section>
  )
}
