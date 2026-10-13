import { products } from '@/data/products'

/** Tamaños de caja disponibles (cantidad de tabletas). */
export const GIFT_BOX_SIZES = [3, 6, 9] as const
export type GiftBoxSize = (typeof GIFT_BOX_SIZES)[number]

/**
 * Precio de cada caja vacía en soles.
 * TODO: confirmar precios reales. Con 0 se muestra "por confirmar" y se avisa en el pedido.
 */
export const GIFT_BOX_PRICES: Record<GiftBoxSize, number> = {
  3: 0,
  6: 0,
  9: 0,
}

/** Productos que se pueden poner en la caja: todas las tabletas del catálogo. */
export const GIFT_BOX_PRODUCTS = products.filter(product => product.category === 'tableta')

export const DEDICATION_MAX_LENGTH = 180
