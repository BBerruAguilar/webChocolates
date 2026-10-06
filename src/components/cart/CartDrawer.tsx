import { useEffect, useRef, useState } from 'react'
import { CloseIcon, TrashIcon, WhatsAppIcon } from '@/components/icons/Icons'
import { useCart } from '@/context/cart-context'
import { useModalBehavior } from '@/hooks/useModalBehavior'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { shakeCart, throwFromCart } from '@/services/cartAnimation'
import { cloudinaryUrl } from '@/services/cloudinary'
import { formatPrice } from '@/services/pricing'
import { sendWhatsAppOrder } from '@/services/whatsapp'
import type { CartLine } from '@/types/product'
import './cart.css'

/** Espera a que el panel termine de deslizarse antes de soltar los productos. */
const RELEASE_DELAY_MS = 300
const RELEASE_STAGGER_MS = 110
/** Más allá de esto los productos quedan fuera de vista en la lista: aparecen sin animación. */
const MAX_RELEASED = 6

const thumbnailUrl = (line: CartLine) => cloudinaryUrl(line.product.image, 240)

function CartLineItem({ line, waiting }: { line: CartLine; waiting: boolean }) {
  const { changeQuantity, remove } = useCart()
  const { product, quantity } = line

  return (
    <article className={`cart-item${waiting ? ' is-waiting' : ''}`}>
      <img src={thumbnailUrl(line)} alt="" decoding="async" data-cart-slot={product.id} />
      <div className="cart-item-info">
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <strong>{formatPrice(product.price)}</strong>
        <div className="quantity-controls" aria-label={`Cantidad de ${product.name}`}>
          <button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label={`Restar una unidad de ${product.name}`}>
            −
          </button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Agregar una unidad de ${product.name}`}>
            +
          </button>
          <button className="remove-item" type="button" onClick={() => remove(product.id)} aria-label={`Quitar ${product.name} del carrito`} title="Quitar">
            <TrashIcon className="icon" />
          </button>
        </div>
      </div>
    </article>
  )
}

/**
 * Panel del carrito. Al abrirse, el ícono del carrito se sacude y cada producto
 * "se desprende" de él y cae en su lugar de la lista, uno por uno.
 */
function CartPanel() {
  const { lines, total, close } = useCart()
  const itemsRef = useRef<HTMLDivElement>(null)
  // Productos que todavía van en el aire (se calculan una sola vez, al abrir).
  const [waiting, setWaiting] = useState<ReadonlySet<number>>(() =>
    prefersReducedMotion() ? new Set() : new Set(lines.slice(0, MAX_RELEASED).map(line => line.product.id)),
  )

  useEffect(() => {
    const released = lines.slice(0, MAX_RELEASED)
    if (released.length === 0 || prefersReducedMotion()) return

    let cancelled = false
    const timers: number[] = []
    shakeCart()

    released.forEach((line, index) => {
      timers.push(
        window.setTimeout(() => {
          const slot = itemsRef.current?.querySelector(`[data-cart-slot="${line.product.id}"]`)
          const land = () => {
            if (!cancelled) {
              setWaiting(previous => {
                const next = new Set(previous)
                next.delete(line.product.id)
                return next
              })
            }
          }
          if (cancelled || !slot) return land()
          void throwFromCart(thumbnailUrl(line), slot, index % 2 === 0 ? -22 : 22).then(land)
        }, RELEASE_DELAY_MS + index * RELEASE_STAGGER_MS),
      )
    })

    return () => {
      cancelled = true
      timers.forEach(timer => window.clearTimeout(timer))
    }
    // Solo al abrir: los productos que se agreguen con el panel abierto aparecen directo.
  }, [])

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Carrito de compras" onClick={close}>
      <aside className="cart-panel" onClick={event => event.stopPropagation()}>
        <div className="cart-header">
          <div>
            <p>Tu pedido</p>
            <h2>Carrito</h2>
          </div>
          <button type="button" className="icon-button" onClick={close} aria-label="Cerrar carrito" title="Cerrar" autoFocus>
            <CloseIcon className="icon" />
          </button>
        </div>

        <div ref={itemsRef} className="cart-items">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío.</p>
              <button type="button" onClick={close}>
                Ver productos
              </button>
            </div>
          ) : (
            lines.map(line => <CartLineItem key={line.product.id} line={line} waiting={waiting.has(line.product.id)} />)
          )}
        </div>

        {lines.length > 0 && (
          <div className="cart-footer">
            <div>
              <span>Total estimado</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button type="button" onClick={() => sendWhatsAppOrder(lines)}>
              <WhatsAppIcon className="icon" />
              Pedir por WhatsApp
            </button>
            <small>Se abrirá WhatsApp con el detalle y las cantidades de tu pedido.</small>
          </div>
        )}
      </aside>
    </div>
  )
}

export function CartDrawer() {
  const { isOpen, close } = useCart()
  useModalBehavior(isOpen, close)

  return isOpen ? <CartPanel /> : null
}
