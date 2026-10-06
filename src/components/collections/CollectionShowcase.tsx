import { collections } from '@/data/collections'
import { cloudinarySrcSet, cloudinaryUrl } from '@/services/cloudinary'
import type { Brand } from '@/types/product'
import './CollectionShowcase.css'

type CollectionShowcaseProps = {
  onSelectBrand: (brand: Brand) => void
}

export function CollectionShowcase({ onSelectBrand }: CollectionShowcaseProps) {
  return (
    <section className="collection-showcase">
      <div className="section-heading">
        <p>Descubre por colección</p>
        <h2>Una expresión distinta del cacao</h2>
      </div>
      <div className="collection-grid">
        {collections.map(collection => (
          <button key={collection.title} type="button" className="collection-card" onClick={() => onSelectBrand(collection.brand)}>
            <img
              src={cloudinaryUrl(collection.image, 800)}
              srcSet={cloudinarySrcSet(collection.image)}
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              alt=""
              loading="lazy"
              decoding="async"
              style={{ objectPosition: collection.position }}
            />
            <span className="collection-shade" />
            <span className="collection-text">
              <small>{collection.eyebrow}</small>
              <strong>{collection.title}</strong>
              <span>Ver productos →</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
