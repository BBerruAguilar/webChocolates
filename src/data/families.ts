import { getProduct } from '@/data/products'
import cacaoPolvo from '@/resources/imagenesPrincipal/cacao_polvo.webp'
import cascarilla from '@/resources/imagenesPrincipal/cascarilla_cacao.webp'
import delicia30 from '@/resources/imagenesPrincipal/choco_mikunaa.webp'
import leche30 from '@/resources/imagenesPrincipal/chocolate_leche_30gr.webp'
import leche80 from '@/resources/imagenesPrincipal/chocolate_leche_80gr.webp'
import grageas from '@/resources/imagenesPrincipal/grageas_aguaymanto_60_por_ciento-removebg-preview.webp'
import blanco from '@/resources/imagenesPrincipal/wayu_fresa_desidratada.webp'
import type { Product, ProductFamily } from '@/types/product'

/**
 * Productos principales del carrusel, en este orden. Cada uno usa una imagen sin fondo
 * de src/resources/imagenesPrincipal y agrupa sus presentaciones (ids de data/products.ts).
 * Para agregar uno nuevo: importa su imagen arriba y añade un objeto aquí.
 */
export const families: ProductFamily[] = [
  {
    id: 'leche-30',
    brand: 'Choco Mikhuna',
    name: 'Chocolate con Leche 30 gr',
    summary: 'Tabletas individuales ilustradas con la fauna de la Amazonía peruana.',
    image: leche30,
    presentationIds: [33, 34, 30, 31, 32],
    contents: 'tableta',
    heroScale: 0.85,
    accentColor: '#ff8a80',
    background: '#3a1414',
  },
  {
    id: 'leche-80',
    brand: 'Choco Mikhuna',
    name: 'Tabletas de 80 gr',
    summary: 'Chocolate con leche y bitter en sabores de la selva: maní, café, crema de maní y aguaymanto.',
    image: leche80,
    presentationIds: [12, 8, 10, 13, 9, 3, 5],
    contents: 'tableta',
    heroScale: 0.85,
    accentColor: '#ffb74d',
    background: '#3a1f05',
  },
  {
    id: 'delicia-30',
    brand: 'Choco Mikhuna',
    name: 'Delicia Natural',
    summary: 'Chocolate con leche 60% cacao en formato individual para llevar a todas partes.',
    image: delicia30,
    presentationIds: [25, 16],
    contents: 'tableta',
    accentColor: '#d7b98a',
    background: '#33220f',
  },
  {
    id: 'grageas',
    brand: 'Wayu Chocolates',
    name: 'Grageas de Fruta',
    summary: 'Frutas peruanas cubiertas con chocolate 60% cacao fino de aroma.',
    image: grageas,
    presentationIds: [17, 2, 18, 19, 20, 21],
    contents: 'grageas',
    heroScale: 0.8,
    accentColor: '#f1a24c',
    background: '#4a2408',
  },
  {
    id: 'blanco',
    brand: 'Wayu Chocolates',
    name: 'Chocolate Blanco',
    summary: 'Chocolate blanco artesanal con fruta deshidratada en nueve sabores.',
    image: blanco,
    presentationIds: [15],
    contents: 'tableta',
    accentColor: '#f48fb1',
    background: '#3d1424',
  },
  {
    id: 'cacao-polvo',
    brand: 'Wayu Chocolates',
    name: 'Cacao en Polvo',
    summary: 'Cacao 100% natural para bebidas, postres y repostería.',
    image: cacaoPolvo,
    presentationIds: [24],
    contents: 'polvo',
    heroScale: 0.8,
    accentColor: '#d8ad66',
    background: '#3f2412',
  },
  {
    id: 'cascarilla',
    brand: 'Choco Mikhuna',
    name: 'Cascarilla de Cacao',
    summary: 'La cáscara del grano tostado para una infusión cálida y aromática.',
    image: cascarilla,
    presentationIds: [23],
    contents: 'cascarilla',
    heroScale: 0.8,
    accentColor: '#91c66d',
    background: '#1f3310',
  },
]

// Fotos del producto SIN envoltura para el efecto "desenvolver".
// Colócalas en src/resources/desenvuelto/ con el id del producto como nombre:
//   leche-30.png, leche-80.png, delicia-30.png, grageas.png, blanco.png, cacao-polvo.png, cascarilla.png
// (corre `python scripts/optimize-images.py` y se usará la versión .webp).
const unwrappedFiles = import.meta.glob<string>('../resources/desenvuelto/*.{png,PNG,jpg,JPG,jpeg,webp,WEBP}', {
  eager: true,
  import: 'default',
})

export function getUnwrappedImage(family: ProductFamily) {
  const matches = Object.entries(unwrappedFiles).filter(([path]) => {
    const name = path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase()
    return name === family.id
  })
  // Si existe la versión optimizada .webp, se prefiere.
  return (matches.find(([path]) => path.endsWith('.webp')) ?? matches[0])?.[1]
}

/** Producto principal al que pertenece una presentación (para filtrar el catálogo). */
export function getFamilyOf(productId: number) {
  return families.find(family => family.presentationIds.includes(productId))
}

export function getPresentations(family: ProductFamily): Product[] {
  return family.presentationIds.map(getProduct).filter((product): product is Product => Boolean(product))
}
