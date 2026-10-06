import { CloseIcon } from '@/components/icons/Icons'
import { useModalBehavior } from '@/hooks/useModalBehavior'
import { cloudinaryUrl } from '@/services/cloudinary'
import type { Product } from '@/types/product'
import './ProductLightbox.css'

type ProductLightboxProps = {
  product: Product | null
  onClose: () => void
}

export function ProductLightbox({ product, onClose }: ProductLightboxProps) {
  useModalBehavior(product !== null, onClose)

  if (!product) return null

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ampliada de ${product.name}`}
      onClick={onClose}
    >
      <div className="lightbox-content" onClick={event => event.stopPropagation()}>
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="Cerrar imagen ampliada" title="Cerrar" autoFocus>
          <CloseIcon className="icon" />
        </button>
        <img src={cloudinaryUrl(product.image, 1600)} alt={product.name} />
        <p>{product.name}</p>
      </div>
    </div>
  )
}
