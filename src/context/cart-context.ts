import { createContext, useContext } from 'react'
import type { CartLine } from '@/types/product'

export type CartContextValue = {
  lines: CartLine[]
  count: number
  total: number
  quantityOf: (productId: number) => number
  add: (productId: number) => void
  changeQuantity: (productId: number, change: number) => void
  remove: (productId: number) => void
  isOpen: boolean
  open: () => void
  close: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return context
}
