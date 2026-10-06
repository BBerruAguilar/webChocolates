import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { PlusIcon } from '@/components/icons/Icons'
import { PresentationGrid } from '@/components/spotlight/PresentationGrid'
import { getPresentations } from '@/data/families'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { Product, ProductFamily } from '@/types/product'
import './ProductSpotlight.css'

type ProductSpotlightProps = {
  family: ProductFamily
  onZoom: (product: Product) => void
}

/**
 * Sección que recibe al producto que "salta" desde el carrusel: descripción a un lado,
 * nombre al otro y, en la esquina, el botón que expulsa sus presentaciones hacia las tarjetas.
 * Se monta con `key={family.id}`, así al cambiar de producto vuelve a su estado inicial.
 */
export function ProductSpotlight({ family, onZoom }: ProductSpotlightProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const figureRef = useRef<HTMLImageElement>(null)
  const [open, setOpen] = useState(false)
  // Referencia estable: la animación de expulsión depende de esta lista.
  const presentations = useMemo(() => getPresentations(family), [family])
  const count = presentations.length

  function toggle() {
    const next = !open
    setOpen(next)
    if (next) sectionRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <section
      id="destacado"
      ref={sectionRef}
      className={`spotlight${open ? ' is-open' : ''}`}
      style={{ '--spot-accent': family.accentColor, '--spot-bg': family.background } as CSSProperties}
      aria-labelledby="spotlight-name"
    >
      <div className="spotlight-stage">
        <div className="spotlight-copy spotlight-copy-start">
          <p className="spotlight-eyebrow">{family.brand}</p>
          <p className="spotlight-description">{family.summary}</p>
        </div>

        <div className="spotlight-figure">
          <span className="spotlight-glow" aria-hidden="true" />
          <img ref={figureRef} className="spotlight-image" src={family.image} alt={family.name} data-flight-target />
          <span className="spotlight-floor" aria-hidden="true" />
        </div>

        <div className="spotlight-copy spotlight-copy-end">
          <h2 id="spotlight-name" className="spotlight-name">
            {family.name}
          </h2>
          <p className="spotlight-count">
            {count === 1 ? '1 presentación' : `${count} presentaciones`}
          </p>
        </div>

        <button
          type="button"
          className="spotlight-toggle"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="presentaciones"
        >
          <span className="spotlight-toggle-label">{open ? 'Ocultar presentaciones' : 'Ver presentaciones'}</span>
          {/* El "+" gira 45° y se convierte en "×" al abrir. */}
          <span className="spotlight-toggle-icon" aria-hidden="true">
            <PlusIcon className="icon" />
          </span>
        </button>
      </div>

      {open && <PresentationGrid products={presentations} sourceRef={figureRef} onZoom={onZoom} />}
    </section>
  )
}
