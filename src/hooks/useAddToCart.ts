import { useCallback } from 'react'
import { useCart } from '@/context/cart-context'
import { throwToCart } from '@/services/cartAnimation'
import { cloudinaryUrl } from '@/services/cloudinary'
import type { Product } from '@/types/product'

/**
 * Agrega al carrito con la animación de tiro. El contador sube cuando la imagen
 * "cae" en el carrito; sin elemento de origen (o con movimiento reducido) se agrega al instante.
 */
export function useAddToCart() {
  const { add } = useCart()

  return useCallback(
    (product: Product, source?: Element | null) => {
      if (!source) return add(product.id)
      void throwToCart(cloudinaryUrl(product.image, 400), source).finally(() => add(product.id))
    },
    [add],
  )
}
