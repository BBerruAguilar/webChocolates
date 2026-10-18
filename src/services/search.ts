import { getFamilyOf } from '@/data/families'
import type { Product } from '@/types/product'

const MAX_RESULTS = 8

/** Minúsculas y sin tildes: "Maní" y "mani" encuentran lo mismo. */
export function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

type Indexed = { product: Product; name: string; all: string }

function index(products: Product[]): Indexed[] {
  return products.map(product => ({
    product,
    name: normalize(product.name),
    all: normalize(
      [
        product.name,
        product.subtitle,
        product.brand,
        product.description,
        product.weight ?? '',
        getFamilyOf(product.id)?.name ?? '',
        ...product.tags,
        ...(product.flavors ?? []),
      ].join(' '),
    ),
  }))
}

/**
 * Busca productos que contengan todas las palabras escritas, en cualquier campo.
 * Primero van los que coinciden en el nombre. `limit` acota cuántos se devuelven.
 */
export function searchProducts(products: Product[], query: string, limit = MAX_RESULTS) {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  return index(products)
    .filter(item => words.every(word => item.all.includes(word)))
    .map(item => ({ item, score: words.filter(word => item.name.includes(word)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item.product)
}
