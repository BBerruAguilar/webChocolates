import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { ProductFamily } from '@/types/product'
import './ProductFlight.css'

/**
 * - off: animación desactivada (movimiento reducido o falta un extremo); origen y destino visibles.
 * - idle: arriba del todo; el producto está en el carrusel.
 * - flying: entre secciones; solo se ve el clon que vuela.
 * - landed: el producto ya está en la sección destacada.
 */
export type FlightPhase = 'off' | 'idle' | 'flying' | 'landed'

type ProductFlightProps = {
  /** Producto al frente del carrusel, el mismo que muestra la sección destacada. */
  family: ProductFamily
  onPhaseChange: (phase: FlightPhase) => void
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const lerp = (from: number, to: number, t: number) => from + (to - from) * t
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

function currentScroll() {
  return Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop)
}

/**
 * Clon fijo en pantalla que, según el scroll, viaja desde el producto del carrusel
 * ([data-flight-source]) hasta el centro de la sección destacada ([data-flight-target]).
 * Recorre un arco hacia arriba girando, y al llegar cede su lugar al producto real.
 * Todo se actualiza directo en el DOM con requestAnimationFrame, sin re-renderizar React.
 */
export function ProductFlight({ family, onPhaseChange }: ProductFlightProps) {
  const flyerRef = useRef<HTMLDivElement>(null)
  const onPhaseChangeRef = useRef(onPhaseChange)
  onPhaseChangeRef.current = onPhaseChange
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const flyer = flyerRef.current
    if (!flyer) return

    let phase: FlightPhase | null = null
    const setPhase = (next: FlightPhase) => {
      if (next === phase) return
      phase = next
      onPhaseChangeRef.current(next)
      if (next !== 'flying') flyer.style.visibility = 'hidden'
    }

    if (reducedMotion) {
      setPhase('off')
      return
    }

    let frame = 0

    const update = () => {
      frame = 0
      const stage = document.querySelector<HTMLElement>('[data-flight-stage]')
      const source = stage?.querySelector<HTMLElement>('[data-flight-source]')
      const target = document.querySelector<HTMLElement>('[data-flight-target]')
      if (!stage || !source || !target) return setPhase('off')

      // El hero es la primera sección: el vuelo dura exactamente lo que tarda en salir de pantalla.
      const progress = clamp01(currentScroll() / stage.offsetHeight)
      if (progress <= 0) return setPhase('idle')
      if (progress >= 1) return setPhase('landed')
      setPhase('flying')

      const start = source.getBoundingClientRect()
      const end = target.getBoundingClientRect()
      const t = easeInOutCubic(progress)
      const arc = Math.sin(Math.PI * progress)
      const lift = Math.min(window.innerHeight * 0.18, 160) * arc

      flyer.style.visibility = 'visible'
      flyer.style.width = `${lerp(start.width, end.width, t)}px`
      flyer.style.height = `${lerp(start.height, end.height, t)}px`
      flyer.style.transform =
        `translate3d(${lerp(start.left, end.left, t)}px, ${lerp(start.top, end.top, t) - lift}px, 0) ` +
        `rotate(${-8 * arc}deg) scale(${1 + 0.1 * arc})`
      flyer.style.setProperty('--flight-tilt', `${Math.sin(progress * Math.PI * 2) * 28}deg`)
      flyer.style.setProperty('--flight-arc', arc.toFixed(3))
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
  }, [reducedMotion, family.id])

  return (
    <div ref={flyerRef} className="flight" aria-hidden="true">
      <div className="flight-body">
        <img src={family.image} alt="" />
      </div>
    </div>
  )
}
