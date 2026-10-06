import type { Brand, BrandFilter, Product, ProductCategory } from '@/types/product'

const CATEGORY_ORDER: Record<ProductCategory, number> = {
  tableta: 0,
  grageas: 1,
  cacao: 2,
}

export const BRAND_FILTERS: BrandFilter[] = ['Todos', 'Wayu Chocolates', 'Choco Mikhuna']

export function filterCatalog(products: Product[], filter: BrandFilter) {
  return products
    .filter(product => filter === 'Todos' || product.brand === filter)
    .sort((a, b) => CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category])
}

export function countByBrand(products: Product[], brand: Brand) {
  return products.filter(product => product.brand === brand).length
}
