import { useEffect, useRef, useState } from 'react'
import { GiftBox3D, giftThumbnail, type GiftSlot } from '@/components/gift/GiftBox3D'
import { ChevronIcon, WhatsAppIcon } from '@/components/icons/Icons'
import {
  DEDICATION_MAX_LENGTH,
  GIFT_BOX_PRICES,
  GIFT_BOX_PRODUCTS,
  GIFT_BOX_SIZES,
  type GiftBoxSize,
} from '@/data/giftBox'
import { ROUTE_HREF } from '@/hooks/useHashRoute'
import { cartTotal, formatPrice } from '@/services/pricing'
import { throwImage } from '@/services/throwAnimation'
import { sendWhatsAppGift } from '@/services/whatsapp'
import type { CartLine, Product } from '@/types/product'
import './GiftBoxPage.css'

type Slot = GiftSlot
const thumbnail = giftThumbnail

/** Agrupa los espacios llenos en líneas "cantidad x producto" para el resumen y el pedido. */
function toLines(slots: Slot[]): CartLine[] {
  const lines = new Map<number, CartLine>()
  for (const slot of slots) {
    if (!slot) continue
    const line = lines.get(slot.product.id)
    if (line) line.quantity += 1
    else lines.set(slot.product.id, { product: slot.product, quantity: 1 })
  }
  return [...lines.values()]
}

export function GiftBoxPage() {
  const [size, setSize] = useState<GiftBoxSize>(6)
  const [slots, setSlots] = useState<Slot[]>(() => Array(6).fill(null))
  // Copia sincrónica del estado: dos toques rápidos no deben caer en el mismo espacio.
  const slotsRef = useRef(slots)
  const boxRef = useRef<HTMLDivElement>(null)
  const [effect, setEffect] = useState<'none' | 'bump' | 'shake'>('none')
  // La tapa empieza cerrada y se abre al entrar; al completar la caja se cierra sola.
  const [introDone, setIntroDone] = useState(false)
  const [peeking, setPeeking] = useState(false)
  const [to, setTo] = useState('')
  const [from, setFrom] = useState('')
  const [message, setMessage] = useState('')

  const commit = (next: Slot[]) => {
    slotsRef.current = next
    setSlots(next)
  }

  const filled = slots.filter(Boolean).length
  const lines = toLines(slots)
  const chocolatesTotal = cartTotal(lines)
  const boxPrice = GIFT_BOX_PRICES[size]
  const complete = filled === size
  const allLanded = slots.every(slot => slot?.landed)
  const closed = !introDone || (complete && allLanded && !peeking)

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), 450)
    return () => window.clearTimeout(timer)
  }, [])

  // Si cambia el contenido, la caja vuelve a su comportamiento normal (se cierra al completarse).
  useEffect(() => setPeeking(false), [filled])

  function changeSize(next: GiftBoxSize) {
    setSize(next)
    commit(Array.from({ length: next }, (_, index) => slotsRef.current[index] ?? null))
  }

  function addProduct(product: Product, source: HTMLElement) {
    const index = slotsRef.current.findIndex(slot => slot === null)
    if (index === -1) {
      setEffect('shake') // caja llena: se sacude
      return
    }

    commit(slotsRef.current.map((slot, i) => (i === index ? { product, landed: false } : slot)))
    const land = () => {
      commit(slotsRef.current.map((slot, i) => (i === index && slot?.product.id === product.id ? { ...slot, landed: true } : slot)))
      setEffect('bump') // la caja se hunde un poco al recibir la tableta
    }

    const target = boxRef.current?.querySelector(`[data-gift-slot="${index}"]`)
    if (!target) return land()

    const slotRect = target.getBoundingClientRect()
    void throwImage({
      src: thumbnail(product),
      from: source.getBoundingClientRect(),
      // Llega sobre la caja y la tableta real termina de caer adentro (animación "drop").
      to: { x: slotRect.x, y: slotRect.y - slotRect.height * 0.45, width: slotRect.width, height: slotRect.height },
      peak: 160,
      duration: 750,
      tilt: index % 2 === 0 ? -18 : 18,
      fit: 'cover',
      objectPosition: product.imgPosition,
      radius: '3px',
      className: 'is-gift',
    }).then(land)
  }

  function removeAt(index: number) {
    commit(slotsRef.current.map((slot, i) => (i === index ? null : slot)))
  }

  return (
    <main className="gift-page">
      <header className="gift-header">
        <a className="gift-back" href={ROUTE_HREF.home}>
          <ChevronIcon direction="left" className="icon" />
          Volver a la tienda
        </a>
        <h1>Arma tu caja de regalo</h1>
        <p>Elige el tamaño, llénala con tus chocolates favoritos y agrega una dedicatoria.</p>
      </header>

      <div className="gift-layout">
        {/* ===== La caja ===== */}
        <section className="gift-builder" aria-label="Tu caja">
          <div className="gift-sizes" role="radiogroup" aria-label="Tamaño de la caja">
            {GIFT_BOX_SIZES.map(option => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={size === option}
                className={size === option ? 'is-active' : ''}
                onClick={() => changeSize(option)}
              >
                <strong>{option}</strong> tabletas
              </button>
            ))}
          </div>

          <GiftBox3D
            ref={boxRef}
            slots={slots}
            closed={closed}
            ribbon={closed && introDone}
            recipient={to}
            effect={effect}
            onEffectEnd={() => setEffect('none')}
            onRemove={removeAt}
            onLidClick={() => setPeeking(true)}
          />

          <p className="gift-count">
            {closed && introDone ? (
              <>
                <strong className="gift-ready">¡Lista para regalar!</strong>
                <span>Toca la caja si quieres abrirla y cambiar algo</span>
              </>
            ) : (
              <>
                {filled} de {size} tabletas
                {filled > 0 && <span>Toca una tableta de la caja para quitarla</span>}
              </>
            )}
          </p>

          {(to || message) && (
            <div className="gift-card" aria-label="Vista previa de la dedicatoria">
              {to && <p className="gift-card-to">Para {to}</p>}
              {message && <p className="gift-card-message">{message}</p>}
              {from && <p className="gift-card-from">De {from}</p>}
            </div>
          )}
        </section>

        {/* ===== Opciones ===== */}
        <div className="gift-options">
          <section aria-labelledby="gift-step-1">
            <h2 id="gift-step-1">
              <span>1</span> Elige tus chocolates
            </h2>
            <div className="gift-products">
              {GIFT_BOX_PRODUCTS.map(product => {
                const count = slots.filter(slot => slot?.product.id === product.id).length
                return (
                  <button
                    key={product.id}
                    type="button"
                    className="gift-product"
                    onClick={event => addProduct(product, event.currentTarget.querySelector('img') ?? event.currentTarget)}
                    aria-label={`Agregar ${product.name} a la caja`}
                  >
                    <img src={thumbnail(product)} alt="" loading="lazy" style={{ objectPosition: product.imgPosition }} />
                    <span className="gift-product-name">{product.name}</span>
                    <span className="gift-product-detail">
                      {product.weight} <strong>{formatPrice(product.price)}</strong>
                    </span>
                    {count > 0 && <span className="gift-product-count">{count}</span>}
                  </button>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="gift-step-2">
            <h2 id="gift-step-2">
              <span>2</span> Dedicatoria
            </h2>
            <div className="gift-fields">
              <label>
                Para
                <input value={to} onChange={event => setTo(event.target.value)} maxLength={40} placeholder="Nombre" />
              </label>
              <label>
                De
                <input value={from} onChange={event => setFrom(event.target.value)} maxLength={40} placeholder="Tu nombre" />
              </label>
              <label className="gift-field-wide">
                Mensaje
                <textarea
                  value={message}
                  onChange={event => setMessage(event.target.value)}
                  maxLength={DEDICATION_MAX_LENGTH}
                  rows={3}
                  placeholder="Escribe unas palabras para acompañar tu regalo"
                />
                <small>
                  {message.length}/{DEDICATION_MAX_LENGTH}
                </small>
              </label>
            </div>
          </section>

          <section aria-labelledby="gift-step-3">
            <h2 id="gift-step-3">
              <span>3</span> Resumen
            </h2>
            <ul className="gift-summary">
              {lines.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span>
                    {quantity} x {product.name}
                  </span>
                  <span>{formatPrice(product.price * quantity)}</span>
                </li>
              ))}
              <li>
                <span>Caja de {size}</span>
                <span>{boxPrice > 0 ? formatPrice(boxPrice) : 'Por confirmar'}</span>
              </li>
              <li className="gift-summary-total">
                <span>Total</span>
                <strong>{formatPrice(chocolatesTotal + boxPrice)}</strong>
              </li>
            </ul>
            <button
              type="button"
              className="gift-order"
              disabled={!complete}
              onClick={() => sendWhatsAppGift({ size, lines, boxPrice, to, from, message })}
            >
              <WhatsAppIcon className="icon" />
              {complete ? 'Pedir por WhatsApp' : `Completa tu caja (${filled}/${size})`}
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}
