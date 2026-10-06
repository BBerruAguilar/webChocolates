/** Cantidades por id de producto. */
export type CartState = Record<number, number>

const STORAGE_KEY = 'wayu-mikhuna:cart:v1'

/** Restaura el carrito guardado, descartando ids que ya no existen en el catálogo. */
export function loadCart(validIds: Set<number>): CartState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}

    const cart: CartState = {}
    for (const [key, value] of Object.entries(parsed)) {
      const id = Number(key)
      if (validIds.has(id) && Number.isInteger(value) && (value as number) > 0) cart[id] = value as number
    }
    return cart
  } catch {
    return {}
  }
}

export function saveCart(cart: CartState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // Modo privado o almacenamiento bloqueado: el carrito sigue funcionando en memoria.
  }
}
