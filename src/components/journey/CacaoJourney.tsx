import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  BeansIllustration,
  OpenPodIllustration,
  PodIllustration,
} from '@/components/illustrations/CacaoIllustrations'
import { JOURNEY_STAGES, type JourneyVisual } from '@/data/journey'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import './CacaoJourney.css'

/** Varios granos sueltos: con una sola foto de pepa se arma un "montón". */
const BEAN_PILE = [
  { left: '14%', top: '20%', rotate: -30 },
  { left: '40%', top: '10%', rotate: 12 },
  { left: '64%', top: '22%', rotate: 40 },
  { left: '24%', top: '46%', rotate: 70 },
  { left: '50%', top: '40%', rotate: -18 },
  { left: '70%', top: '54%', rotate: 22 },
  { left: '38%', top: '64%', rotate: -52 },
]

function StageVisual({ visual }: { visual: JourneyVisual }) {
  // La escena se dibuja aparte, a pantalla completa detrás del círculo.
  if (visual.kind === 'escena') return null
  if (visual.kind === 'producto') return <img className="journey-photo" src={visual.photo} alt="" />

  if (visual.kind === 'grano') {
    if (!visual.photo) return <BeansIllustration className="journey-illustration" tone={visual.tone} />
    return (
      <div className={`journey-pile tone-${visual.tone}`}>
        {BEAN_PILE.map((bean, index) => (
          <img
            key={index}
            src={visual.photo}
            alt=""
            style={{ left: bean.left, top: bean.top, '--rotate': `${bean.rotate}deg` } as CSSProperties}
          />
        ))}
      </div>
    )
  }

  if (visual.photo) return <img className="journey-photo" src={visual.photo} alt="" />
  return visual.kind === 'fruto' ? (
    <PodIllustration className="journey-illustration" />
  ) : (
    <OpenPodIllustration className="journey-illustration" />
  )
}

function currentScroll() {
  return Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop)
}

/**
 * "Del grano a la barra": la sección queda fija mientras se hace scroll y avanza por
 * las etapas del proceso. La imagen de cada etapa reemplaza a la anterior.
 */
export function CacaoJourney() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const stage = JOURNEY_STAGES[active]
  const total = JOURNEY_STAGES.length

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
      section.style.setProperty('--journey-progress', progress.toFixed(4))
      setActive(Math.min(total - 1, Math.floor(progress * total)))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    document.addEventListener('scroll', schedule, { passive: true, capture: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [total])

  /** Lleva el scroll al centro del tramo de la etapa elegida. */
  function goTo(index: number) {
    const section = sectionRef.current
    if (!section) return
    const top = section.getBoundingClientRect().top + currentScroll()
    const scrollable = section.offsetHeight - window.innerHeight
    window.scrollTo({
      top: top + (scrollable * (index + 0.5)) / total,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="journey"
      style={{ '--journey-steps': total, '--journey-bg': stage.tint } as CSSProperties}
      aria-labelledby="journey-title"
    >
      <div className="journey-sticky">
        <header className="journey-header">
          <p className="journey-eyebrow">Nosotros</p>
          <h2 id="journey-title" className="journey-title">
            Del grano a la barra
          </h2>
        </header>

        <ol className="journey-steps">
          {JOURNEY_STAGES.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className={index === active ? 'is-active' : index < active ? 'is-done' : ''}
                aria-current={index === active ? 'step' : undefined}
                onClick={() => goTo(index)}
              >
                <span>{item.number}</span>
                {item.title}
              </button>
            </li>
          ))}
        </ol>

        <div className="journey-visual" aria-hidden="true">
          {/* Fotos ambientales: el punto de interés queda en el centro del círculo y el resto se desvanece. */}
          {JOURNEY_STAGES.map((item, index) =>
            item.visual.kind === 'escena' ? (
              <img
                key={`scene-${item.id}`}
                className={`journey-scene${index === active ? ' is-active' : ''}`}
                src={item.visual.scene.photo}
                alt=""
                style={{
                  '--focus-x': `${item.visual.scene.focus.x}%`,
                  '--focus-y': `${item.visual.scene.focus.y}%`,
                } as CSSProperties}
              />
            ) : null,
          )}
          <span className="journey-ring" />
          {JOURNEY_STAGES.map((item, index) => (
            <div
              key={item.id}
              className={`journey-figure ${index < active ? 'is-past' : index === active ? 'is-active' : 'is-next'}`}
            >
              <StageVisual visual={item.visual} />
            </div>
          ))}
        </div>

        <div className="journey-copy" aria-live="polite">
          <div key={stage.id} className="journey-copy-inner">
            <span className="journey-number">
              {stage.number} <small>/ {String(total).padStart(2, '0')}</small>
            </span>
            <h3>{stage.title}</h3>
            <p>{stage.text}</p>
          </div>
        </div>

        <div className="journey-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
