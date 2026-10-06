import { CartIcon } from '@/components/icons/Icons'
import { useCart } from '@/context/cart-context'
import { CART_TARGET_ATTRIBUTE } from '@/services/cartAnimation'
import './cart.css'

export function CartButton() {
  const { count, open } = useCart()

  return (
    <button
      type="button"
      className="cart-summary"
      onClick={open}
      aria-label={`Abrir carrito con ${count} productos`}
      title="Ver carrito"
      {...{ [CART_TARGET_ATTRIBUTE]: '' }}
    >
      <CartIcon />
      {count > 0 && (
        <span key={count} className="cart-count" aria-live="polite">
          {count}
        </span>
      )}
    </button>
  )
}
