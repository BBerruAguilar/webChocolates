import { useCallback, useEffect, useState } from 'react'

export function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total
}

/** Distancia más corta (con signo) de `index` a `active` dentro de un anillo de `total` elementos. */
export function ringOffset(index: number, active: number, total: number) {
  let offset = wrapIndex(index - active, total)
  if (offset >= total / 2) offset -= total
  return offset
}

type CarouselOptions = {
  interval: number
  paused: boolean
}

/**
 * Estado del carrusel. Recuerda el índice anterior para saber qué elementos
 * "dan la vuelta" al anillo y deben saltar sin animación.
 * El temporizador se reinicia en cada cambio, así la navegación manual no se pisa con el autoplay.
 */
export function useCarousel(total: number, { interval, paused }: CarouselOptions) {
  const [state, setState] = useState({ active: 0, previous: 0 })

  const goTo = useCallback(
    (index: number) =>
      setState(current => {
        const next = wrapIndex(index, total)
        return next === current.active ? current : { active: next, previous: current.active }
      }),
    [total],
  )

  const step = useCallback(
    (delta: number) => setState(current => ({ active: wrapIndex(current.active + delta, total), previous: current.active })),
    [total],
  )

  useEffect(() => {
    if (paused || total < 2) return
    const timer = window.setTimeout(() => step(1), interval)
    return () => window.clearTimeout(timer)
  }, [paused, interval, step, total, state.active])

  return { active: state.active, previous: state.previous, goTo, step }
}
