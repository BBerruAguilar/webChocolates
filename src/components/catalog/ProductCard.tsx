import { useEffect, useRef, useState } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { CheckIcon, ShareIcon } from '@/components/icons/Icons'
import { cloudinarySrcSet, cloudinaryUrl } from '@/services/cloudinary'
import { formatPrice } from '@/services/pricing'
import { shareProduct } from '@/services/share'
import type { Product } from '@/types/product'

/** Comparte el enlace directo al producto; en computadora lo copia y lo confirma un momento. */
function ShareButton({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function share() {
    if ((await shareProduct(product)) === 'copied') setCopied(true)
  }

  return (
    <button
      type="button"
      className={`product-share${copied ? ' is-copied' : ''}`}
      onClick={share}
      aria-label={`Compartir ${product.name}`}
      title="Compartir"
    >
      {copied ? <CheckIcon className="icon" /> : <ShareIcon className="icon" />}
      <span className="product-share-toast" role="status">
        {copied ? 'Enlace copiado' : ''}
      </span>
    </button>
  )
}

type ProductCardProps = {
  product: Product
  onZoom: (product: Product) => void
}

export function ProductCard({ product, onZoom }: ProductCardProps) {
  const imageRef = useRef<HTMLButtonElement>(null)

  return (
    <article className="product-card" data-product-id={product.id}>
      <button
        ref={imageRef}
        className="product-media"
        type="button"
        aria-label={`Ampliar foto de ${product.name}`}
        onClick={() => onZoom(product)}
      >
        <img
          src={cloudinaryUrl(product.image, 800)}
          srcSet={cloudinarySrcSet(product.image)}
          sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 300px"
          alt={product.name}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: product.imgPosition }}
        />
        {product.weight && <span className="product-weight">{product.weight}</span>}
      </button>
      <ShareButton product={product} />

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-subtitle">{product.subtitle}</p>
        <p className="product-description">{product.description}</p>

        <div className="product-buy">
          <span className="product-price">{formatPrice(product.price)}</span>
          <AddToCartButton product={product} sourceRef={imageRef} />
        </div>
      </div>
    </article>
  )
}
