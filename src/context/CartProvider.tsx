import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CartContext, type CartContextValue } from '@/context/cart-context'
import { loadCart, saveCart, type CartState } from '@/services/cartStorage'
import { cartCount, cartTotal } from '@/services/pricing'
import type { Product } from '@/types/product'

type CartProviderProps = {
  products: Product[]
  children: ReactNode
}

export function CartProvider({ products, children }: CartProviderProps) {
  const [cart, setCart] = useState<CartState>(() => loadCart(new Set(products.map(product => product.id))))
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => saveCart(cart), [cart])

  const changeQuantity = useCallback((productId: number, change: number) => {
    setCart(previous => {
      const nextQuantity = (previous[productId] ?? 0) + change
      const next = { ...previous }

      if (nextQuantity <= 0) delete next[productId]
      else next[productId] = nextQuantity

      return next
    })
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const lines = products
      .filter(product => cart[product.id])
      .map(product => ({ product, quantity: cart[product.id] }))

    return {
      lines,
      count: cartCount(lines),
      total: cartTotal(lines),
      quantityOf: productId => cart[productId] ?? 0,
      add: productId => changeQuantity(productId, 1),
      changeQuantity,
      remove: productId => changeQuantity(productId, -(cart[productId] ?? 0)),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }
  }, [cart, changeQuantity, isOpen, products])

  return <CartContext value={value}>{children}</CartContext>
}
