import { SITE } from '@/config/site'
import type { CartLine } from '@/types/product'

export function formatPrice(amount: number) {
  return `${SITE.currency} ${amount.toFixed(2)}`
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((total, { product, quantity }) => total + product.price * quantity, 0)
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((total, { quantity }) => total + quantity, 0)
}
