import { families } from '@/data/families'
import type { CatalogFilter, Product } from '@/types/product'

/**
 * Productos del catálogo agrupados por producto principal, en el mismo orden del carrusel.
 * Con "todos", al final se agregan los que aún no pertenecen a ninguna familia.
 */
export function filterCatalog(products: Product[], filter: CatalogFilter) {
  const byId = new Map(products.map(product => [product.id, product]))
  const groups = filter === 'todos' ? families : families.filter(family => family.id === filter)
  const grouped = groups.flatMap(family =>
    family.presentationIds.map(id => byId.get(id)).filter((product): product is Product => Boolean(product)),
  )

  if (filter !== 'todos') return grouped
  const included = new Set(grouped.map(product => product.id))
  return [...grouped, ...products.filter(product => !included.has(product.id))]
}
