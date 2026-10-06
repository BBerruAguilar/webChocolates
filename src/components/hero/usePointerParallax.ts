import { useCallback, useEffect, useRef, type PointerEvent, type RefObject } from 'react'

/**
 * Escribe la posición del puntero (de -1 a 1) en las variables CSS --px y --py del elemento.
 * Se actualiza directo en el DOM con requestAnimationFrame para no re-renderizar React en cada movimiento.
 */
export function usePointerParallax(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  const frame = useRef(0)

  const write = useCallback(
    (x: number, y: number) => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        ref.current?.style.setProperty('--px', x.toFixed(3))
        ref.current?.style.setProperty('--py', y.toFixed(3))
      })
    },
    [ref],
  )

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!enabled || event.pointerType !== 'mouse') return
      const bounds = event.currentTarget.getBoundingClientRect()
      write(((event.clientX - bounds.left) / bounds.width) * 2 - 1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1)
    },
    [enabled, write],
  )

  const onPointerLeave = useCallback(() => write(0, 0), [write])

  return { onPointerMove, onPointerLeave }
}
