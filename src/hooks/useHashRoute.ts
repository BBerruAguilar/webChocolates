import { useEffect, useRef, useState } from 'react'

/**
 * Rutas por hash ("#/regalo"), sin dependencias: funcionan en cualquier hosting estático.
 * Los anclas normales ("#catalogo") siguen siendo secciones de la página de inicio.
 */
export type Route = 'home' | 'regalo'

export const ROUTE_HREF: Record<Route, string> = {
  home: '#/',
  regalo: '#/regalo',
}

function parseRoute(): Route {
  return window.location.hash.startsWith(ROUTE_HREF.regalo) ? 'regalo' : 'home'
}

export function useHashRoute() {
  const [route, setRoute] = useState(parseRoute)
  const previousRoute = useRef(route)

  useEffect(() => {
    const update = () => setRoute(parseRoute())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  // Al cambiar de página: arriba del todo, o a la sección pedida (ej. "#catalogo" desde el regalo).
  useEffect(() => {
    if (previousRoute.current === route) return
    previousRoute.current = route
    const hash = window.location.hash
    const anchor = hash.length > 1 && !hash.startsWith('#/') ? document.querySelector(hash) : null
    if (anchor) anchor.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [route])

  return route
}
