import { forwardRef, type AnimationEvent, type CSSProperties } from 'react'
import { cloudinaryUrl } from '@/services/cloudinary'
import type { Product } from '@/types/product'
import './GiftBox3D.css'

/** Un espacio de la caja: vacío o con una tableta (que puede ir todavía "en el aire"). */
export type GiftSlot = { product: Product; landed: boolean } | null

/** Inclinación de cada tableta dentro de la caja: así se ven acomodadas a mano. */
const TILTS = [-4, 2, -2, 3, -3, 4, -1, 2, -3]
const COLUMNS = ['22%', '50%', '78%']

export const giftThumbnail = (product: Product) => cloudinaryUrl(product.image, 300)

type GiftBox3DProps = {
  slots: GiftSlot[]
  /** Tapa cerrada: al completar la caja (o al inicio, antes de abrirse). */
  closed: boolean
  ribbon: boolean
  recipient: string
  effect: 'none' | 'bump' | 'shake'
  onEffectEnd: () => void
  onRemove: (index: number) => void
  onLidClick: () => void
}

/**
 * Caja de cartón vista de frente y un poco desde arriba: interior, tabletas paradas que
 * asoman sobre el frente, tapa con bisagra en 3D y lazo que se ata al cerrarla.
 * Los espacios vacíos también se dibujan (invisibles) para saber dónde debe caer cada tiro.
 */
export const GiftBox3D = forwardRef<HTMLDivElement, GiftBox3DProps>(function GiftBox3D(
  { slots, closed, ribbon, recipient, effect, onEffectEnd, onRemove, onLidClick },
  ref,
) {
  // Primero se dibujan las filas del fondo para que las de adelante las tapen.
  const order = slots.map((_, index) => index).sort((a, b) => Math.floor(b / 3) - Math.floor(a / 3))

  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onEffectEnd()
  }

  return (
    <div
      ref={ref}
      className={`box3d${closed ? ' is-closed' : ''}${ribbon ? ' has-ribbon' : ''}${effect !== 'none' ? ` is-${effect}` : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className="box3d-shadow" aria-hidden="true" />
      <span className="box3d-back" aria-hidden="true" />
      <span className="box3d-floor" aria-hidden="true" />

      {order.map(index => {
        const slot = slots[index]
        const depth = Math.floor(index / 3) // 0 = fila de adelante
        const style = {
          '--x': COLUMNS[index % 3],
          '--bottom': `${64 - depth * 5}%`,
          '--scale': 1 - depth * 0.1,
          '--tilt': `${TILTS[index % TILTS.length]}deg`,
        } as CSSProperties

        if (!slot) return <span key={index} className="box3d-item is-empty" data-gift-slot={index} style={style} aria-hidden="true" />

        return (
          <button
            key={index}
            type="button"
            className={`box3d-item${slot.landed ? ' is-landed' : ''}`}
            data-gift-slot={index}
            style={style}
            onClick={() => onRemove(index)}
            aria-label={`Quitar ${slot.product.name} de la caja`}
            title="Quitar"
            tabIndex={closed ? -1 : 0}
          >
            <img src={giftThumbnail(slot.product)} alt="" style={{ objectPosition: slot.product.imgPosition }} />
          </button>
        )
      })}

      {/* Papel de seda que asoma entre las tabletas. */}
      <span className="box3d-tissue" aria-hidden="true" />

      <span className="box3d-front" aria-hidden="true">
        <svg className="box3d-seal" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" />
          <path d="M24 9c6 4 8 11 7 18-1 6-4 10-7 12-3-2-6-6-7-12-1-7 1-14 7-18Z" />
          <path d="M24 11v26M20 14c-2 7-2 15 1 21M28 14c2 7 2 15-1 21" />
        </svg>
        <span className="box3d-brand">Wayu & Mikhuna</span>
        <span className="box3d-brand-sub">Chocolates artesanales</span>
      </span>

      <button
        type="button"
        className="box3d-lid"
        onClick={onLidClick}
        tabIndex={closed ? 0 : -1}
        aria-label={closed ? 'Abrir la caja' : undefined}
        aria-hidden={!closed}
      >
        <span className="box3d-lid-print">Wayu & Mikhuna</span>
      </button>

      <span className="box3d-ribbon" aria-hidden="true">
        <span className="box3d-ribbon-v" />
        <span className="box3d-ribbon-h" />
        <svg className="box3d-bow" viewBox="0 0 120 60">
          <path d="M60 30 C40 4 8 4 10 26 C12 44 40 40 60 30Z" />
          <path d="M60 30 C80 4 112 4 110 26 C108 44 80 40 60 30Z" />
          <path d="M60 30 L44 58 L54 56 Z M60 30 L76 58 L66 56 Z" />
          <circle cx="60" cy="30" r="8" />
        </svg>
        {recipient && <span className="box3d-tag">Para {recipient}</span>}
      </span>
    </div>
  )
})
