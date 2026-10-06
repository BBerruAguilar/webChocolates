import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export type Box = { x: number; y: number; width: number; height: number }

type ThrowOptions = {
  src: string
  /** Caja inicial y final en coordenadas de pantalla (getBoundingClientRect). */
  from: Box
  to: Box
  /** Cuánto sube el arco por encima del punto más alto del recorrido, en px. */
  peak: number
  duration: number
  /** Giro total en grados (ej. 540 = vuelta y media, como un balón). */
  spin?: number
  /** Inclinación que sube y vuelve a 0 a mitad del vuelo. */
  tilt?: number
  /** Al llegar se aplasta un poco y rebota, como si cayera sobre la tarjeta. */
  squash?: boolean
  fit?: 'cover' | 'contain'
  radius?: string
  objectPosition?: string
  className?: string
}

const STEPS = 28

/**
 * Lanza una copia de una imagen desde `from` hasta `to` describiendo una parábola
 * (curva de Bézier cuadrática: velocidad horizontal constante, como un tiro real).
 * La copia vive en <body> con position: fixed y se elimina al terminar.
 */
export function throwImage(options: ThrowOptions): Promise<void> {
  if (prefersReducedMotion()) return Promise.resolve()

  const { from, to, peak, duration, spin = 0, tilt = 0, squash = false } = options
  // El elemento tiene el tamaño final; el tamaño inicial se logra con scale.
  const width = to.width
  const height = to.height
  const startScale = from.width / width
  const start = { x: from.x + from.width / 2, y: from.y + from.height / 2 }
  const end = { x: to.x + to.width / 2, y: to.y + to.height / 2 }
  const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - peak }

  const travelEnd = squash ? 0.86 : 1
  const keyframes: Keyframe[] = []

  for (let step = 0; step <= STEPS; step++) {
    const t = step / STEPS
    const u = 1 - t
    const x = u * u * start.x + 2 * u * t * control.x + t * t * end.x
    const y = u * u * start.y + 2 * u * t * control.y + t * t * end.y
    const scale = startScale + (1 - startScale) * t
    const rotate = spin * t + tilt * Math.sin(Math.PI * t)
    keyframes.push({
      offset: t * travelEnd,
      transform: `translate3d(${x - width / 2}px, ${y - height / 2}px, 0) rotate(${rotate}deg) scale(${scale})`,
    })
  }

  if (squash) {
    const base = `translate3d(${to.x}px, ${to.y}px, 0) rotate(${spin}deg)`
    keyframes.push(
      { offset: 0.93, transform: `${base} scale(1.08, 0.9)` },
      { offset: 1, transform: `${base} scale(1)` },
    )
  }

  const image = document.createElement('img')
  image.src = options.src
  image.alt = ''
  image.className = `thrown-image ${options.className ?? ''}`
  Object.assign(image.style, {
    width: `${width}px`,
    height: `${height}px`,
    objectFit: options.fit ?? 'cover',
    objectPosition: options.objectPosition ?? 'center',
    borderRadius: options.radius ?? '0',
  })
  document.body.appendChild(image)

  const animation = image.animate(keyframes, { duration, easing: 'linear', fill: 'forwards' })
  return animation.finished.then(
    () => image.remove(),
    () => image.remove(),
  )
}
