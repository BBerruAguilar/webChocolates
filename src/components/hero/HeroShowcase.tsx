import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from 'react'
import { HeroItem } from '@/components/hero/HeroItem'
import { HeroParticles } from '@/components/hero/HeroParticles'
import { ringOffset, useCarousel } from '@/components/hero/useCarousel'
import { ChevronIcon } from '@/components/icons/Icons'
import { useIsVisible } from '@/hooks/useIsVisible'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { ProductFamily } from '@/types/product'
import './HeroShowcase.css'

const AUTOPLAY_MS = 5200
const SWIPE_THRESHOLD = 45
/** Partículas de polvo que flotan dentro del haz. */
const MOTES = 12

type HeroShowcaseProps = {
  families: ProductFamily[]
  /** Avisa qué producto está al frente (la sección destacada muestra el mismo). */
  onActiveChange: (family: ProductFamily) => void
  /** Pausa externa del autoplay, p. ej. mientras el producto "vuela" a la siguiente sección. */
  autoplayPaused?: boolean
}

const brandWord = (family: ProductFamily) => (family.brand === 'Wayu Chocolates' ? 'Wayu' : 'Mikhuna')

function scrollToSpotlight() {
  document.getElementById('destacado')?.scrollIntoView({ behavior: 'smooth' })
}

export function HeroShowcase({ families, onActiveChange, autoplayPaused = false }: HeroShowcaseProps) {
  const heroRef = useRef<HTMLElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [interacting, setInteracting] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const visible = useIsVisible(heroRef)

  const paused = interacting || reducedMotion || !visible || autoplayPaused
  const { active, previous, goTo, step } = useCarousel(families.length, { interval: AUTOPLAY_MS, paused })

  useEffect(() => onActiveChange(families[active]), [active, families, onActiveChange])

  const family = families[active]
  const previousFamily = families[previous]
  const movedBy = ringOffset(active, previous, families.length)
  const spotAimClass = `hero-spot-aim${movedBy === 0 ? ' is-turning-on' : ''}`
  const spotAimStyle = { '--aim-from': `${movedBy > 0 ? -12 : 12}deg` } as CSSProperties

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') step(-1)
    else if (event.key === 'ArrowRight') step(1)
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
    setInteracting(true)
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStart.current
    const touch = event.changedTouches[0]
    touchStart.current = null
    setInteracting(false)
    if (!start || !touch) return

    const distanceX = touch.clientX - start.x
    const distanceY = touch.clientY - start.y
    if (Math.abs(distanceX) < SWIPE_THRESHOLD || Math.abs(distanceX) <= Math.abs(distanceY)) return
    step(distanceX < 0 ? 1 : -1)
  }

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="hero"
      data-flight-stage
      style={{ '--hero-accent': family.accentColor, '--hero-bg': family.background } as CSSProperties}
      aria-roledescription="carrusel"
      aria-label="Productos principales"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false)
      }}
    >
      {/* Capa 1: el producto activo, enorme y desenfocado, tiñe todo el fondo. */}
      <div className="hero-backdrop" aria-hidden="true">
        <img key={`prev-${previousFamily.id}`} src={previousFamily.image} alt="" />
        <img key={family.id} className="is-entering" src={family.image} alt="" />
      </div>
      <div className="hero-glow" aria-hidden="true" />

      {/* Capa 2: marca gigante en contorno, como letras en el telón que solo revela el foco. */}
      <div className="hero-word" aria-hidden="true">
        <span key={brandWord(family)}>{brandWord(family)}</span>
      </div>

      <HeroParticles />

      {/*
        Foco de teatro, en dos capas: detrás del producto (cono, punto de luz y círculo en el piso)
        y delante (un velo tenue con polvo en el aire). El punto de luz queda fijo arriba; el haz
        gira desde él siguiendo el vaivén del producto y, al cambiar de producto, baja la intensidad
        y se reorienta desde el lado por el que llega el nuevo.
      */}
      <div className="hero-spot is-back" aria-hidden="true">
        <div className="hero-spot-swing">
          <div key={family.id} className={spotAimClass} style={spotAimStyle}>
            <span className="hero-beam">
              <span className="hero-beam-cone" />
            </span>
            <span className="hero-pool" />
          </div>
        </div>
        <span className="hero-lamp" />
      </div>

      {/* Capa 3: anillo 3D de productos sin fondo. */}
      <div className="hero-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => setInteracting(false)}>
        <div className="hero-ring">
          <div className="hero-ring-sway">
            {families.map((item, index) => {
              const offset = ringOffset(index, active, families.length)
              const wrapping = offset !== ringOffset(index, previous, families.length) - movedBy

              return (
                <HeroItem
                  key={item.id}
                  family={item}
                  index={index}
                  offset={offset}
                  wrapping={wrapping}
                  priority={index === 0}
                  onSelect={() => (offset === 0 ? scrollToSpotlight() : goTo(index))}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="hero-spot is-front" aria-hidden="true">
        <div className="hero-spot-swing">
          <div key={family.id} className={spotAimClass} style={spotAimStyle}>
            <span className="hero-beam">
              <span className="hero-beam-cone" />
            </span>
            <span className="hero-motes">
              {Array.from({ length: MOTES }, (_, index) => (
                <span key={index} className="hero-mote" style={{ '--mote': index } as CSSProperties} />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="hero-scrim" aria-hidden="true" />

      {/* Capa 4: contenido. */}
      <header className="hero-intro">
        <h1 className="hero-title">
          El sabor que nace <em>de la selva</em>
        </h1>
      </header>

      <div className="hero-bottom">
        <div className="hero-product" aria-live={paused ? 'polite' : 'off'}>
          <div key={family.id} className="hero-product-content">
            <h2 className="hero-product-name">{family.name}</h2>
            <p className="hero-product-description">{family.summary}</p>
          </div>
        </div>

        {/* Centro inferior: anterior, indicador para bajar y siguiente. */}
        <div className="hero-controls">
          <button type="button" className="hero-arrow" onClick={() => step(-1)} aria-label="Producto anterior">
            <ChevronIcon direction="left" />
          </button>
          <a className="hero-scroll" href="#destacado" aria-label="Ver el producto en detalle">
            <span />
          </a>
          <button type="button" className="hero-arrow" onClick={() => step(1)} aria-label="Producto siguiente">
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  )
}
