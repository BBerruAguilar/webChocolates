export type Brand = 'Wayu Chocolates' | 'Choco Mikhuna'

/** Define el orden en el catálogo: tabletas, luego grageas y al final derivados del cacao. */
export type ProductCategory = 'tableta' | 'grageas' | 'cacao'

/** Una presentación concreta que se vende (tiene precio y va al carrito). */
export type Product = {
  id: number
  brand: Brand
  category: ProductCategory
  name: string
  /** Detalle corto, sin separadores con punto (ej. "60% cacao con café"). */
  subtitle: string
  /** Precio en soles. Se formatea con formatPrice() al mostrarlo. */
  price: number
  /** Peso visible en la etiqueta de la tarjeta (ej. "80 gr"). */
  weight?: string
  origin: string
  description: string
  tags: string[]
  /** Sabores dentro de un mismo producto (ej. la caja surtida). */
  flavors?: string[]
  /** Ruta de Cloudinary o URL de una imagen local importada. */
  image: string
  imgPosition: string
}

/**
 * Producto principal del carrusel: una imagen sin fondo que agrupa varias presentaciones.
 * Ej. "Chocolate con Leche 30 gr" agrupa las tabletas del elefante, mono, tapir, etc.
 */
export type ProductFamily = {
  id: string
  brand: Brand
  name: string
  /** Descripción breve que acompaña al nombre en el carrusel y en la sección destacada. */
  summary: string
  /** Imagen SIN fondo (src/resources/imagenesPrincipal). */
  image: string
  /** Ids de las presentaciones (data/products.ts), en el orden en que se muestran. */
  presentationIds: number[]
  /** Qué aparece al "desenvolver" el empaque (se dibuja si no hay foto en resources/desenvuelto). */
  contents: FamilyContents
  /**
   * Ajuste de tamaño en el carrusel y la sección destacada (1 = normal, 0.8 = 20% más chico).
   * Sirve para igualar productos cuya foto se ve más grande o más chica que el resto.
   */
  heroScale?: number
  accentColor: string
  background: string
}

export type FamilyContents = 'tableta' | 'grageas' | 'polvo' | 'cascarilla'

/** Filtro del catálogo: todos los productos o los de un producto principal (familia). */
export type CatalogFilter = 'todos' | ProductFamily['id']

export type CartLine = {
  product: Product
  quantity: number
}
