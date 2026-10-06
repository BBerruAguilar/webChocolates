import { useEffect, useState, type RefObject } from 'react'

/** true mientras el elemento esté en pantalla y la pestaña esté visible. Sirve para pausar animaciones. */
export function useIsVisible(ref: RefObject<Element | null>) {
  const [onScreen, setOnScreen] = useState(true)
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState === 'visible')

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  useEffect(() => {
    const update = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  return onScreen && tabVisible
}
