import { products } from '@/data/products'

/** Tamaños de caja disponibles (cantidad de tabletas). */
export const GIFT_BOX_SIZES = [3, 6, 9] as const
export type GiftBoxSize = (typeof GIFT_BOX_SIZES)[number]

/** Productos que se pueden poner en la caja: todas las tabletas del catálogo. */
export const GIFT_BOX_PRODUCTS = products.filter(product => product.category === 'tableta')

export const DEDICATION_MAX_LENGTH = 180

