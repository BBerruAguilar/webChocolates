import { IMAGES } from '@/data/images'
import type { Brand } from '@/types/product'

export type Collection = {
  title: string
  eyebrow: string
  image: string
  position: string
  brand: Brand
}

export const collections: Collection[] = [
  {
    title: 'Mini tabletas',
    eyebrow: 'Wayu en 9 sabores',
    image: IMAGES.wayuBlanco9Sabores,
    position: 'center 45%',
    brand: 'Wayu Chocolates',
  },
  {
    title: 'Del cacao a la taza',
    eyebrow: 'Cascarilla Choco Mikhuna',
    image: IMAGES.cascarillaMikhuna,
    position: 'center 48%',
    brand: 'Choco Mikhuna',
  },
  {
    title: 'Cacao en polvo',
    eyebrow: 'Cacao puro Wayu',
    image: IMAGES.cacaoPolvo,
    position: 'center 48%',
    brand: 'Wayu Chocolates',
  },
]
