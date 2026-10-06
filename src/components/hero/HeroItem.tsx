import type { CSSProperties } from 'react'
import type { ProductFamily } from '@/types/product'

/** A partir de esta distancia los productos quedan "estacionados" detrás del anillo y ocultos. */
const HIDDEN_DEPTH = 3

type HeroItemProps = {
  family: ProductFamily
  index: number
  offset: number
  /** El elemento cruzó al otro lado del anillo: se mueve sin transición para no atravesar la escena. */
  wrapping: boolean
  priority: boolean
  onSelect: () => void
}

/** Producto sin fondo sobre el anillo 3D, con su sombra en el piso. */
export function HeroItem({ family, index, offset, wrapping, priority, onSelect }: HeroItemProps) {
  const depth = Math.min(Math.abs(offset), HIDDEN_DEPTH)
  const parked = Math.max(-HIDDEN_DEPTH, Math.min(HIDDEN_DEPTH, offset))
  const isFront = offset === 0

  return (
    <button
      type="button"
      className={`hero-item${wrapping ? ' is-wrapping' : ''}`}
      data-depth={depth}
      style={{ '--offset': parked } as CSSProperties}
      onClick={onSelect}
      tabIndex={isFront ? 0 : -1}
      aria-hidden={!isFront}
      aria-label={isFront ? `Ver presentaciones de ${family.name}` : `Ver ${family.name}`}
    >
      <span className="hero-item-shadow" />
      {/* Retraso fijo por índice: cada producto gira lentamente desfasado de los demás. */}
      <span className="hero-item-body" style={{ animationDelay: `${index * -1.7}s` }}>
        <img
          className="hero-item-image"
          src={family.image}
          alt=""
          draggable={false}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          {...(isFront ? { 'data-flight-source': '' } : {})}
        />
      </span>
    </button>
  )
}
