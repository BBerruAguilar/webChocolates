import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { ExpandIcon } from '@/components/icons/Icons'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cloudinaryUrl } from '@/services/cloudinary'
import { formatPrice } from '@/services/pricing'
import { throwImage } from '@/services/throwAnimation'
import type { Product } from '@/types/product'
import './PresentationGrid.css'

/** Espera a que el producto central termine de achicarse antes de expulsar las presentaciones. */
const EJECT_DELAY_MS = 520
/** Separación entre cada presentación expulsada. */
const EJECT_STAGGER_MS = 170

type PresentationGridProps = {
  products: Product[]
  /** Producto central desde donde "salen" las presentaciones. */
  sourceRef: RefObject<HTMLElement | null>
  onZoom: (product: Product) => void
}

const imageUrl = (product: Product) => cloudinaryUrl(product.image, 600)

/**
 * Tarjetas de presentaciones. Al montarse, cada imagen sale disparada desde el producto
 * central, sube en arco y cae en su tarjeta (una por una), con un pequeño rebote al aterrizar.
 */
export function PresentationGrid({ products, sourceRef, onZoom }: PresentationGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [landed, setLanded] = useState<ReadonlySet<number>>(() => new Set())

  useEffect(() => {
    const source = sourceRef.current
    const grid = gridRef.current
    if (!source || !grid || prefersReducedMotion()) {
      setLanded(new Set(products.map(product => product.id)))
      return
    }

    let cancelled = false
    const timers: number[] = []
    const markLanded = (id: number) => {
      if (!cancelled) setLanded(previous => new Set(previous).add(id))
    }

    timers.push(
      window.setTimeout(() => {
        const slots = grid.querySelectorAll<HTMLElement>('[data-presentation-slot]')

        products.forEach((product, index) => {
          timers.push(
            window.setTimeout(() => {
              const slot = slots[index]
              if (cancelled || !slot) return

              const from = source.getBoundingClientRect()
              const to = slot.getBoundingClientRect()
              const startWidth = to.width * 0.3
              const startHeight = to.height * 0.3

              void throwImage({
                src: imageUrl(product),
                // Sale desde el centro del producto, pequeña, como expulsada desde adentro.
                from: {
                  x: from.x + from.width / 2 - startWidth / 2,
                  y: from.y + from.height * 0.45 - startHeight / 2,
                  width: startWidth,
                  height: startHeight,
                },
                to,
                peak: 120 + (index % 3) * 50,
                duration: 900,
                tilt: index % 2 === 0 ? -28 : 28,
                squash: true,
                fit: 'cover',
                objectPosition: product.imgPosition,
                radius: '14px',
                className: 'is-ejected',
              }).then(() => markLanded(product.id))
            }, index * EJECT_STAGGER_MS),
          )
        })
      }, EJECT_DELAY_MS),
    )

    return () => {
      cancelled = true
      timers.forEach(timer => window.clearTimeout(timer))
    }
  }, [products, sourceRef])

  return (
    <div id="presentaciones" ref={gridRef} className="presentation-grid">
      {products.map((product, index) => (
        <PresentationCard
          key={product.id}
          product={product}
          index={index}
          landed={landed.has(product.id)}
          onZoom={onZoom}
        />
      ))}
    </div>
  )
}

type PresentationCardProps = {
  product: Product
  index: number
  landed: boolean
  onZoom: (product: Product) => void
}

function PresentationCard({ product, index, landed, onZoom }: PresentationCardProps) {
  const mediaRef = useRef<HTMLButtonElement>(null)

  return (
    <article className={`presentation-card${landed ? ' is-landed' : ''}`} style={{ '--i': index } as CSSProperties}>
      <button
        ref={mediaRef}
        type="button"
        className="presentation-media"
        data-presentation-slot
        onClick={() => onZoom(product)}
        aria-label={`Ampliar foto de ${product.name}`}
      >
        <img src={imageUrl(product)} alt={product.name} decoding="async" style={{ objectPosition: product.imgPosition }} />
        <span className="presentation-zoom" aria-hidden="true">
          <ExpandIcon className="icon" />
        </span>
        {product.weight && <span className="presentation-weight">{product.weight}</span>}
      </button>

      <div className="presentation-info">
        <p className="presentation-brand">{product.brand}</p>
        <h3 className="presentation-name">{product.name}</h3>
        <p className="presentation-subtitle">{product.subtitle}</p>
        {product.flavors && (
          <ul className="presentation-flavors" aria-label="Sabores">
            {product.flavors.map(flavor => (
              <li key={flavor}>{flavor}</li>
            ))}
          </ul>
        )}
        <div className="presentation-buy">
          <strong>{formatPrice(product.price)}</strong>
          <AddToCartButton product={product} sourceRef={mediaRef} />
        </div>
      </div>
    </article>
  )
}
