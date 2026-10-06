import { getProduct } from '@/data/products'
import cacaoPolvo from '@/resources/imagenesPrincipal/cacao_polvo.png'
import cascarilla from '@/resources/imagenesPrincipal/cascarilla_cacao.png'
import delicia30 from '@/resources/imagenesPrincipal/choco_mikunaa.png'
import leche30 from '@/resources/imagenesPrincipal/chocolate_leche_30gr.png'
import leche80 from '@/resources/imagenesPrincipal/chocolate_leche_80gr.png'
import grageas from '@/resources/imagenesPrincipal/grageas_aguaymanto_60_por_ciento-removebg-preview.png'
import blanco from '@/resources/imagenesPrincipal/wayu_fresa_desidratada.png'
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
    accentColor: '#91c66d',
    background: '#1f3310',
  },
]

export function getPresentations(family: ProductFamily): Product[] {
  return family.presentationIds.map(getProduct).filter((product): product is Product => Boolean(product))
}
