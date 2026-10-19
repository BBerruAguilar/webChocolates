import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { CloseIcon, SearchIcon } from '@/components/icons/Icons'
import { families } from '@/data/families'
import { products } from '@/data/products'
import { useModalBehavior } from '@/hooks/useModalBehavior'
import { cloudinaryUrl } from '@/services/cloudinary'
import { formatPrice } from '@/services/pricing'
import { searchProducts } from '@/services/search'
import type { Product, ProductFamily } from '@/types/product'
import './SearchOverlay.css'

type SearchOverlayProps = {
  open: boolean
  onClose: () => void
  /** Lleva al producto en el catálogo. */
  onSelectProduct: (product: Product) => void
  /** Filtra el catálogo por un producto principal. */
  onSelectFamily: (family: ProductFamily) => void
}

const SUGGESTIONS = ['Maní', 'Café', 'Bitter', 'Grageas', 'Cacao']

export function SearchOverlay({ open, ...props }: SearchOverlayProps) {
  useModalBehavior(open, props.onClose)
  return open ? <SearchPanel {...props} /> : null
}

function SearchPanel({ onClose, onSelectProduct, onSelectFamily }: Omit<SearchOverlayProps, 'open'>) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const results = useMemo(() => searchProducts(products, query), [query])
  const hasQuery = query.trim().length > 0
  const inputRef = useRef<HTMLInputElement>(null)

  /** Cambia el texto buscado y devuelve el foco al campo para seguir escribiendo. */
  function search(text: string) {
    setQuery(text)
    setActive(0)
    inputRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive(index => (index + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive(index => (index - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      onSelectProduct(results[active])
    }
  }

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Buscar productos" onClick={onClose}>
      <div className="search-panel" onClick={event => event.stopPropagation()}>
        <div className="search-field">
          <label className="search-box">
            <SearchIcon className="icon search-field-icon" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={event => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Busca un chocolate, sabor o ingrediente"
              aria-label="Buscar productos"
              aria-controls="search-results"
              aria-activedescendant={results.length ? `search-result-${results[active].id}` : undefined}
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
            {hasQuery ? (
              <button type="button" className="search-clear" onClick={() => search('')} aria-label="Borrar búsqueda" title="Borrar">
                <CloseIcon className="icon" />
              </button>
            ) : (
              <kbd className="search-hint" aria-hidden="true">
                Esc
              </kbd>
            )}
          </label>
          <button type="button" className="search-close" onClick={onClose} aria-label="Cerrar búsqueda" title="Cerrar">
            <CloseIcon className="icon" />
          </button>
        </div>

        {!hasQuery && (
          <div className="search-start">
            <div className="search-suggestions" aria-label="Búsquedas sugeridas">
              {SUGGESTIONS.map(word => (
                <button key={word} type="button" onClick={() => search(word)}>
                  {word}
                </button>
              ))}
            </div>
            <div className="search-families">
              {families.map(family => (
                <button key={family.id} type="button" className="search-family" onClick={() => onSelectFamily(family)}>
                  <img src={family.image} alt="" loading="lazy" />
                  <span>{family.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {hasQuery && results.length === 0 && (
          <p className="search-empty">
            No encontramos "{query.trim()}". Prueba con un sabor como maní, café o fresa.
          </p>
        )}

        {results.length > 0 && (
          <ul id="search-results" className="search-results" role="listbox" aria-label="Resultados">
            {results.map((product, index) => (
              <SearchResult
                key={product.id}
                product={product}
                active={index === active}
                onHover={() => setActive(index)}
                onSelect={() => onSelectProduct(product)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

type SearchResultProps = {
  product: Product
  active: boolean
  onHover: () => void
  onSelect: () => void
}

function SearchResult({ product, active, onHover, onSelect }: SearchResultProps) {
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <li
      id={`search-result-${product.id}`}
      className={`search-result${active ? ' is-active' : ''}`}
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
    >
      <button type="button" className="search-result-main" onClick={onSelect}>
        <img
          ref={imageRef}
          src={cloudinaryUrl(product.image, 200)}
          alt=""
          style={{ objectPosition: product.imgPosition }}
        />
        <span className="search-result-text">
          <strong>{product.name}</strong>
          <span>
            {product.brand}, {product.subtitle}
          </span>
        </span>
        <span className="search-result-price">{formatPrice(product.price)}</span>
      </button>
      <AddToCartButton product={product} sourceRef={imageRef} />
    </li>
  )
}
