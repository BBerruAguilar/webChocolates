import { SITE } from '@/config/site'
import { normalize } from '@/services/search'
import type { Product } from '@/types/product'

/** Enlaces directos a un producto: "#/producto/12-chocolate-con-leche-y-mani-80-gr". */
const PRODUCT_HASH = /^#\/producto\/(\d+)/

export function productUrl(product: Product) {
  // El texto después del número solo hace legible el enlace; la tienda usa el número.
  const slug = normalize(`${product.name} ${product.weight ?? ''}`)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${window.location.origin}${window.location.pathname}#/producto/${product.id}-${slug}`
}

/** Número del producto si la dirección actual es un enlace directo; si no, null. */
export function productIdFromHash(hash = window.location.hash) {
  const match = PRODUCT_HASH.exec(hash)
  return match ? Number(match[1]) : null
}

/**
 * En celular abre el menú de compartir del sistema (WhatsApp, Instagram…); en computadora,
 * o si no está disponible, copia el enlace.
 */
export async function shareProduct(product: Product): Promise<'shared' | 'copied' | 'cancelled'> {
  const url = productUrl(product)
  const touch = window.matchMedia('(pointer: coarse)').matches

  if (touch && navigator.share) {
    try {
      await navigator.share({ title: product.name, text: `Mira este chocolate de ${SITE.name}: ${product.name}`, url })
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    }
  }

  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // Sin permiso para el portapapeles (o sin HTTPS): se muestra para copiarlo a mano.
    window.prompt('Copia el enlace del producto:', url)
  }
  return 'copied'
}
