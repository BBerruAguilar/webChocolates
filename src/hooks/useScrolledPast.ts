import { useEffect, useState } from 'react'

/**
 * true cuando la página bajó más de `offset` px. Escucha en fase de captura para
 * detectar también el scroll del body dentro del iframe de vista previa de Figma Make.
 */
export function useScrolledPast(offset: number) {
  const [scrolledPast, setScrolledPast] = useState(false)

  useEffect(() => {
    const update = () => {
      const scrollTop = Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop)
      setScrolledPast(scrollTop > offset)
    }

    update()
    document.addEventListener('scroll', update, { passive: true, capture: true })
    return () => document.removeEventListener('scroll', update, true)
  }, [offset])

  return scrolledPast
}
