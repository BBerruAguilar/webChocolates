import { useRef } from 'react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { cloudinarySrcSet, cloudinaryUrl } from '@/services/cloudinary'
import { formatPrice } from '@/services/pricing'
import type { Product } from '@/types/product'

type ProductCardProps = {
  product: Product
  onZoom: (product: Product) => void
}

export function ProductCard({ product, onZoom }: ProductCardProps) {
  const imageRef = useRef<HTMLButtonElement>(null)

  return (
    <article className="product-card">
      <button
        ref={imageRef}
        className="product-image-panel"
        type="button"
        aria-label={`Ampliar foto de ${product.name}`}
        onClick={() => onZoom(product)}
      >
        <img
          src={cloudinaryUrl(product.image, 800)}
          srcSet={cloudinarySrcSet(product.image)}
          sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 400px"
          alt={product.name}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: product.imgPosition }}
        />
        <div className="product-hover-description">
          <p>{product.description}</p>
        </div>
        <div className="product-brand-badge">{product.brand}</div>
        {product.weight && <div className="product-weight">{product.weight}</div>}
      </button>

      <div className="product-info">
        <div className="product-tags">
          {product.tags.map(tag => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <h3 className="product-name">{product.name}</h3>
        <p className="product-subtitle">{product.subtitle}</p>

        <div className="product-buy">
          <span className="product-price">{formatPrice(product.price)}</span>
          <AddToCartButton product={product} sourceRef={imageRef} />
        </div>
      </div>
    </article>
  )
}
