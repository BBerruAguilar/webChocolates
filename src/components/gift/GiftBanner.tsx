import { useEffect, useRef, useState } from 'react'
import { CacaoShape } from '@/components/decor/CacaoShape'
import { GiftBox3D, type GiftSlot } from '@/components/gift/GiftBox3D'
import { GiftIcon } from '@/components/icons/Icons'
import { GIFT_BOX_PRODUCTS } from '@/data/giftBox'
import { ROUTE_HREF } from '@/hooks/useHashRoute'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import './GiftBanner.css'

/** Tabletas de muestra que se ven dentro de la caja antes de cerrarse. */
const SAMPLE_SLOTS: GiftSlot[] = GIFT_BOX_PRODUCTS.slice(0, 6).map(product => ({ product, landed: true }))

/** Pausa entre que la sección aparece en pantalla y la tapa empieza a cerrarse. */
const PACK_DELAY_MS = 600

function openGiftPage() {
  window.location.hash = ROUTE_HREF.regalo
}

/**
 * Invitación a la página "Arma tu caja de regalo". La caja aparece abierta con tabletas y,
 * al entrar en pantalla, se cierra y se ata el lazo: anticipa lo que pasa en la página.
 */
export function GiftBanner() {
  const sectionRef = useRef<HTMLElement>(null)
  const [packed, setPacked] = useState(prefersReducedMotion)

  useEffect(() => {
    const section = sectionRef.current
    if (packed || !section) return

    let timer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        timer = window.setTimeout(() => setPacked(true), PACK_DELAY_MS)
      },
      { threshold: 0.45 },
    )
    observer.observe(section)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [packed])

  return (
    <section ref={sectionRef} className="gift-banner" aria-labelledby="gift-banner-title">
      <CacaoShape type="leaf" className="gift-banner-leaf is-large" />
      <CacaoShape type="pod" className="gift-banner-leaf is-pod" />

      <div className="gift-banner-inner">
        <div className="gift-banner-copy">
          <h2 id="gift-banner-title">
            Arma tu caja <em>de regalo</em>
          </h2>
          <p>
            Elige 3, 6 o 9 chocolates, escribe una dedicatoria y nosotros la empaquetamos con lazo dorado. Ideal para
            cumpleaños, aniversarios y Navidad.
          </p>
          <a className="gift-banner-link" href={ROUTE_HREF.regalo}>
            <GiftIcon className="icon" />
            Armar mi caja
          </a>
        </div>

        {/* La caja es decorativa: el enlace de arriba es la acción accesible. */}
        <div className="gift-banner-box" aria-hidden="true" inert onClick={openGiftPage}>
          <GiftBox3D
            slots={SAMPLE_SLOTS}
            closed={packed}
            ribbon={packed}
            recipient="ti"
            effect="none"
            onEffectEnd={() => {}}
            onRemove={() => {}}
            onLidClick={openGiftPage}
          />
        </div>
      </div>
    </section>
  )
}
