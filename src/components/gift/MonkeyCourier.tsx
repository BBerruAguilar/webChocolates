import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import './MonkeyCourier.css'

type MonkeyCourierProps = {
  /** Al activarse, el mono entra, agarra la caja y se la lleva. */
  active: boolean
  /** La caja que se lleva (se anima junto con el mono). */
  boxRef: RefObject<HTMLElement | null>
  onDone: () => void
}

type Geometry = {
  width: number
  height: number
  /** Punto de la caja donde la agarra (el lazo), en coordenadas de pantalla. */
  gripX: number
  /** Punto fijo de la liana, por encima de la pantalla. */
  pivotY: number
  length: number
  box: DOMRect
}

/** Un fotograma de péndulo: desplazamiento horizontal de la liana y ángulo de balanceo. */
type Swing = [offset: number, translateX: number, angle: number]

const toFrames = (swings: Swing[]): Keyframe[] =>
  swings.map(([offset, x, angle]) => ({
    offset,
    transform: `translateX(${x}px) rotate(${angle}deg)`,
    easing: 'ease-in-out',
  }))

/** Mono ilustrado, colgado de una mano; los pies juntos al fondo sujetan la caja. */
function MonkeyArt() {
  return (
    <svg className="monkey-art" viewBox="0 0 200 300" aria-hidden="true">
      <path className="monkey-tail" d="M80 176 C40 190 34 242 62 248 C80 252 82 232 68 230" />
      <circle className="monkey-fur" cx="56" cy="90" r="11" />
      <circle className="monkey-skin" cx="56" cy="90" r="5" />
      <circle className="monkey-fur" cx="111" cy="84" r="10" />
      <path className="monkey-limb" d="M95 198 C92 230 94 256 97 280" />
      <path className="monkey-limb" d="M114 198 C116 230 112 256 105 280" />
      <ellipse className="monkey-fur" cx="104" cy="164" rx="30" ry="42" />
      <ellipse className="monkey-skin" cx="104" cy="172" rx="17" ry="27" />
      <circle className="monkey-fur" cx="84" cy="92" r="30" />
      <ellipse className="monkey-skin" cx="84" cy="101" rx="21" ry="18" />
      <circle className="monkey-eye" cx="76" cy="94" r="3.5" />
      <circle className="monkey-eye" cx="92" cy="94" r="3.5" />
      <path className="monkey-mouth" d="M77 106 Q84 112 91 106" />
      <path className="monkey-limb" d="M126 146 C140 176 142 200 138 222" />
      <circle className="monkey-hand" cx="138" cy="226" r="8" />
      <path className="monkey-limb" d="M112 120 C108 82 102 42 100 14" />
      <circle className="monkey-hand" cx="100" cy="12" r="9" />
      <ellipse className="monkey-hand" cx="101" cy="286" rx="15" ry="7" />
    </svg>
  )
}

/**
 * Mensajero de la selva: entra desde la izquierda balanceándose en una liana, agarra la
 * caja por el lazo y se la lleva hacia la derecha. La caja se anima con el mismo
 * movimiento de péndulo (mismo punto de giro), así parece colgar de sus pies.
 */
export function MonkeyCourier({ active, boxRef, onDone }: MonkeyCourierProps) {
  const rigRef = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  // 1) Medir dónde está la caja y preparar la liana.
  useLayoutEffect(() => {
    if (!active) {
      setGeometry(null)
      return
    }
    const box = boxRef.current
    if (!box) return onDoneRef.current()

    const rect = box.getBoundingClientRect()
    const width = Math.max(120, Math.min(190, rect.width * 0.42))
    const height = width * 1.5
    const gripX = rect.left + rect.width * 0.77 // sobre el lazo
    const gripY = rect.top + rect.height * 0.24
    const pivotY = Math.min(-40, gripY - height - 90)
    setGeometry({ width, height, gripX, pivotY, length: gripY - pivotY, box: rect })
  }, [active, boxRef])

  // 2) Entrar, agarrar y llevarse la caja.
  useLayoutEffect(() => {
    const rig = rigRef.current
    const box = boxRef.current
    if (!geometry || !rig || !box) return

    let cancelled = false
    const { gripX, pivotY, length, box: rect } = geometry
    const exitX = window.innerWidth - gripX + length * 0.8 + 200

    const enter = rig.animate(
      toFrames([
        [0, -gripX - 260, 42],
        [0.62, -30, -16],
        [0.82, 0, 7],
        [1, 0, 0],
      ]),
      { duration: 1500, fill: 'forwards' },
    )

    const carry: Keyframe[] = toFrames([
      [0, 0, 0],
      [0.32, -140, 26], // toma impulso balanceándose hacia atrás con la caja
      [0.72, exitX * 0.4, -28],
      [1, exitX, -55],
    ])
    const carryTiming: KeyframeAnimationOptions = { duration: 2400, delay: 250, fill: 'forwards' }

    enter.finished
      .then(() => {
        if (cancelled) return
        box.style.transformOrigin = `${gripX - rect.left}px ${pivotY - rect.top}px`
        rig.animate(carry, carryTiming)
        return box.animate(carry, carryTiming).finished
      })
      .then(() => {
        if (!cancelled) onDoneRef.current()
      })
      .catch(() => {})

    return () => {
      cancelled = true
      rig.getAnimations().forEach(animation => animation.cancel())
      box.getAnimations().forEach(animation => animation.cancel())
      box.style.transformOrigin = ''
    }
  }, [geometry, boxRef])

  if (!geometry) return null

  return (
    <div
      ref={rigRef}
      className="monkey-rig"
      style={
        {
          top: geometry.pivotY,
          left: geometry.gripX - geometry.width / 2,
          width: geometry.width,
          height: geometry.length,
          '--monkey-height': `${geometry.height}px`,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <span className="monkey-vine">
        <span className="monkey-leaf is-left" />
        <span className="monkey-leaf is-right" />
      </span>
      <MonkeyArt />
    </div>
  )
}
