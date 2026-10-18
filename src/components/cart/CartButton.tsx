import type { ReactNode } from 'react'
import { CartIcon } from '@/components/icons/Icons'
import { useCart } from '@/context/cart-context'
import { CART_TARGET_ATTRIBUTE } from '@/services/cartAnimation'
import './cart.css'

type CartButtonProps = {
  /** Texto que el menú muestra junto al ícono al pasar el mouse. */
  label?: ReactNode
}

export function CartButton({ label }: CartButtonProps) {
  const { count, open } = useCart()

  return (
    <button
      type="button"
      className="cart-summary"
      onClick={open}
      aria-label={`Abrir carrito con ${count} productos`}
      {...{ [CART_TARGET_ATTRIBUTE]: '' }}
    >
      {label}
      <CartIcon />
      {count > 0 && (
        <span key={count} className="cart-count" aria-live="polite">
          {count}
        </span>
      )}
    </button>
  )
}
