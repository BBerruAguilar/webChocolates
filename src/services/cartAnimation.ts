import { throwImage } from '@/services/throwAnimation'

/** El botón del carrito del menú se marca con este atributo para ser el "aro" del tiro. */
export const CART_TARGET_ATTRIBUTE = 'data-cart-target'

const RECEIVE_CLASS = 'is-receiving'
const CATCH_CLASS = 'is-catching'
const RELEASE_CLASS = 'is-releasing'

function findCart() {
  return document.querySelector<HTMLElement>(`[${CART_TARGET_ATTRIBUTE}]`)
}

/** Sacude el carrito como si se abriera para soltar su contenido. */
export function shakeCart() {
  const cart = findCart()
  if (!cart) return
  cart.classList.remove(RELEASE_CLASS)
  void cart.offsetWidth // reinicia la animación si se abre varias veces seguidas
  cart.classList.add(RELEASE_CLASS)
  window.setTimeout(() => cart.classList.remove(RELEASE_CLASS), 550)
}

/**
 * Lo inverso del tiro: una imagen se "desprende" del carrito y cae en `target`
 * (la foto del producto dentro del panel del carrito).
 */
export function throwFromCart(src: string, target: Element, tilt: number) {
  const cart = findCart()
  if (!cart) return Promise.resolve()

  const from = cart.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  // Sale casi del tamaño del ícono; el carrito está arriba, así que el salto es corto y luego cae.
  const startWidth = from.width * 0.85
  const startHeight = startWidth * (to.height / to.width)

  return throwImage({
    src,
    from: {
      x: from.x + (from.width - startWidth) / 2,
      y: from.y + (from.height - startHeight) / 2,
      width: startWidth,
      height: startHeight,
    },
    to,
    peak: 28,
    duration: 850,
    tilt,
    squash: true,
    fit: 'cover',
    radius: '4px',
    className: 'is-cart-release',
  })
}

/**
 * Tiro "estilo basketball": la imagen sale desde `source`, sube en arco girando y cae
 * dentro del carrito, haciéndose más pequeña. El carrito crece para recibirla y rebota al llegar.
 */
export async function throwToCart(src: string, source: Element) {
  const cart = findCart()
  if (!cart) return

  const from = source.getBoundingClientRect()
  const hoop = cart.getBoundingClientRect()
  // La imagen arranca a un tamaño cómodo (máx. 180 px) y termina más chica que el botón.
  const startWidth = Math.min(from.width, 180)
  const startHeight = startWidth * (from.height / from.width)
  const endSize = hoop.width * 0.45

  cart.classList.remove(CATCH_CLASS)
  cart.classList.add(RECEIVE_CLASS)

  await throwImage({
    src,
    from: {
      x: from.x + (from.width - startWidth) / 2,
      y: from.y + (from.height - startHeight) / 2,
      width: startWidth,
      height: startHeight,
    },
    to: {
      x: hoop.x + (hoop.width - endSize) / 2,
      y: hoop.y + (hoop.height - endSize) / 2,
      width: endSize,
      height: endSize * (startHeight / startWidth),
    },
    peak: 160,
    duration: 950,
    spin: 540,
    fit: 'cover',
    radius: '14px',
    className: 'is-cart-throw',
  })

  cart.classList.remove(RECEIVE_CLASS)
  cart.classList.add(CATCH_CLASS)
  window.setTimeout(() => cart.classList.remove(CATCH_CLASS), 500)
}
