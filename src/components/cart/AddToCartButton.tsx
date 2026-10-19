import type { RefObject } from 'react'
import { CartPlusIcon } from '@/components/icons/Icons'
import { useCart } from '@/context/cart-context'
import { useAddToCart } from '@/hooks/useAddToCart'
import type { Product } from '@/types/product'
import './cart.css'

type AddToCartButtonProps = {
  product: Product
  /** Imagen desde donde "sale" el tiro hacia el carrito. */
  sourceRef: RefObject<HTMLElement | null>
  className?: string
}

export function AddToCartButton({ product, sourceRef, className = '' }: AddToCartButtonProps) {
  const addToCart = useAddToCart()
  const { quantityOf } = useCart()
  const quantity = quantityOf(product.id)

  return (
    <button
      type="button"
      className={`add-to-cart ${className}`}
      onClick={() => addToCart(product, sourceRef.current)}
      aria-label={`Agregar ${product.name} al carrito`}
      title="Agregar al carrito"
    >
      <CartPlusIcon className="add-to-cart-icon" />
      {quantity > 0 && <span className="add-to-cart-count">{quantity}</span>}
    </button>
  )
}
