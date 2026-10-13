import { GiftIcon } from '@/components/icons/Icons'
import { ROUTE_HREF } from '@/hooks/useHashRoute'
import './GiftBanner.css'

/** Franja en el inicio que lleva a la página "Arma tu caja de regalo". */
export function GiftBanner() {
  return (
    <section className="gift-banner" aria-labelledby="gift-banner-title">
      <div className="gift-banner-inner">
        <div>
          <p className="gift-banner-eyebrow">Para regalar</p>
          <h2 id="gift-banner-title">Arma tu caja de regalo</h2>
          <p className="gift-banner-text">Elige 3, 6 o 9 chocolates, agrega una dedicatoria y te la preparamos.</p>
        </div>
        <a className="gift-banner-link" href={ROUTE_HREF.regalo}>
          <GiftIcon className="icon" />
          Armar mi caja
        </a>
      </div>
    </section>
  )
}
