import type { BeanTone } from '@/components/illustrations/CacaoIllustrations'
import { families } from '@/data/families'

// Fotos del proceso en src/resources/viajeCacao/. Se detectan por el nombre del archivo:
//   "fruto" o "mazorca"         → mazorca entera            (ej. cacao_fruto.png)
//   "abierto/a" o "partido/a"   → mazorca abierta con granos (ej. fruto_abierto.png)
//   "pepa", "grano" o "semilla" → grano de cacao            (ej. pepa.png)
//   "tronco" o "arbol"          → foto del fruto en el árbol (ej. mazorca_tronco.jpg):
//                                  reemplaza a la mazorca suelta en la etapa de cosecha.
//   "interior"                  → tableta abierta en su envoltorio (ej. interior de chocolate.png):
//                                  es la foto de la etapa final; sin ella se usa el empaque.
// Si falta alguna, se usa una ilustración plana provisional.
const files = import.meta.glob<string>('../resources/viajeCacao/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}', {
  eager: true,
  import: 'default',
})

type PhotoKind = 'fruto' | 'abierto' | 'grano' | 'escena' | 'interior'

const OPEN_PATTERN = /abiert|partid/i
const SCENE_PATTERN = /tronco|arbol|árbol/i
const PATTERNS: Record<PhotoKind, RegExp> = {
  abierto: OPEN_PATTERN,
  escena: SCENE_PATTERN,
  fruto: /fruto|mazorca/i,
  grano: /pepa|grano|semilla/i,
  interior: /interior/i,
}

function findPhoto(kind: PhotoKind) {
  const matches = Object.entries(files).filter(([path]) => {
    const name = path.split('/').pop() ?? ''
    // "mazorca_abierta" y "mazorca_tronco" no son la mazorca suelta.
    if (kind !== 'abierto' && OPEN_PATTERN.test(name)) return false
    if (kind !== 'escena' && SCENE_PATTERN.test(name)) return false
    return PATTERNS[kind].test(name)
  })
  // Si existe la versión optimizada .webp (scripts/optimize-images.py), se prefiere.
  return (matches.find(([path]) => path.endsWith('.webp')) ?? matches[0])?.[1]
}

/**
 * Foto ambiental que ocupa toda la sección, desvanecida hacia los bordes.
 * `focus` es el punto de la foto (en %) que queda en el centro del círculo.
 */
export type JourneyScene = { photo: string; focus: { x: number; y: number } }

export type JourneyVisual =
  | { kind: 'escena'; scene: JourneyScene }
  | { kind: 'fruto'; photo?: string }
  | { kind: 'abierto'; photo?: string }
  | { kind: 'grano'; tone: BeanTone; photo?: string }
  | { kind: 'producto'; photo: string }

export type JourneyStage = {
  id: string
  number: string
  title: string
  text: string
  /** Fondo de la sección en esta etapa: tonos claros y poco saturados. */
  tint: string
  visual: JourneyVisual
}

const beanPhoto = findPhoto('grano')
const harvestScene = findPhoto('escena')
const finalProduct = families.find(family => family.id === 'leche-80') ?? families[0]
const openBarPhoto = findPhoto('interior') ?? finalProduct.image

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'cosecha',
    number: '01',
    title: 'Cosecha',
    tint: '#eef0e0', // verde hoja muy claro
    text: 'Cosechamos a mano las mazorcas maduras en las chacras de Tingo María, donde nace el cacao fino de aroma.',
    visual: harvestScene
      ? // Punto donde está la mazorca en mazorca_tronco.jpg; si cambias la foto, ajusta estos valores.
        { kind: 'escena', scene: { photo: harvestScene, focus: { x: 50.8, y: 53.4 } } }
      : { kind: 'fruto', photo: findPhoto('fruto') },
  },
  {
    id: 'desgrane',
    number: '02',
    title: 'Desgrane',
    tint: '#f6ecd8', // crema de la pulpa
    text: 'Abrimos cada mazorca y separamos los granos, cubiertos de una pulpa blanca y dulce.',
    visual: { kind: 'abierto', photo: findPhoto('abierto') },
  },
  {
    id: 'fermentado',
    number: '03',
    title: 'Fermentado',
    tint: '#f4e4dc', // rosado arcilla
    text: 'Los granos reposan varios días en cajones de madera cubiertos con hojas de plátano. Aquí empieza a nacer el aroma.',
    visual: { kind: 'grano', tone: 'fermentado', photo: beanPhoto },
  },
  {
    id: 'secado',
    number: '04',
    title: 'Secado',
    tint: '#f7ebcf', // arena al sol
    text: 'Se extienden al sol y se remueven a mano hasta que pierden la humedad y toman su color marrón.',
    visual: { kind: 'grano', tone: 'seco', photo: beanPhoto },
  },
  {
    id: 'tostado',
    number: '05',
    title: 'Tostado',
    tint: '#efe1d1', // beige tostado
    text: 'Los tostamos a fuego lento y les retiramos la cáscara: así obtenemos los nibs y la cascarilla para infusión.',
    visual: { kind: 'grano', tone: 'tostado', photo: beanPhoto },
  },
  {
    id: 'chocolate',
    number: '06',
    title: 'Chocolate',
    tint: '#ecdcd2', // cacao con leche
    text: 'Molemos, refinamos y templamos el cacao hasta formar la barra que llega a tus manos.',
    visual: { kind: 'producto', photo: openBarPhoto },
  },
]
