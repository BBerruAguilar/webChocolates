// src/data/products.ts

// Imágenes alojadas en Cloudinary.
const cld = (url: string, width = 1200) =>
  url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
const CLOUDINARY = 'https://res.cloudinary.com/ytmafyip/image/upload/'

export const imgWayuLeche40Box = cld(CLOUDINARY + 'v1791150364/WhatsApp_Image_2026-09-26_at_15.29.11.jpg')
export const imgChocoMikhunaBars = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-27_at_15.12.11.jpg')
export const imgChocoMikhunaPeq = cld(CLOUDINARY + 'v1791150364/WhatsApp_Image_2026-09-27_at_15.46.51.jpg')
export const imgWayuBitter75 = cld(CLOUDINARY + 'v1791155195/WhatsApp_Image_2026-10-04_at_18.02.11.jpg')
export const imgMikhunaCremaManiVenado = cld(CLOUDINARY + 'v1791150366/WhatsApp_Image_2026-09-20_at_22.20.43.jpg')
export const imgMikhunaBitterAguaymanto = cld(CLOUDINARY + 'v1791150366/WhatsApp_Image_2026-09-20_at_22.20.41_2.jpg')
export const imgMikhunaCafe = cld(CLOUDINARY + 'v1791150366/WhatsApp_Image_2026-09-20_at_22.20.42.jpg')
export const imgMikhunasManiSplash = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-20_at_22.20.43_1.jpg')
export const imgMikhunaMono = cld(CLOUDINARY + 'v1791150366/WhatsApp_Image_2026-09-20_at_22.20.41.jpg')
export const imgGrageasAguaymanto = cld(CLOUDINARY + 'v1791150364/WhatsApp_Image_2026-09-26_at_15.17.08.jpg')
export const imgGrageasArandanoNueva = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.16.42.jpg')
export const imgGrageasFresa = cld(CLOUDINARY + 'v1791150364/WhatsApp_Image_2026-09-26_at_15.16.11.jpg')
export const imgGrageasMango = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.15.31.jpg')
export const imgGrageasPina = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.15.00.jpg')
export const imgGrageasPasas = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.14.33.jpg')
export const imgMiniTabletasWayu = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-27_at_15.12.11.jpg')
export const imgColeccionGrageas = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.07.54_2.jpg')
export const imgCascarillaMikhuna = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.07.54_1.jpg')
export const imgCacaoPolvo = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.07.54.jpg')
export const imgMikhunaCaja30 = cld(CLOUDINARY + 'v1791156267/WhatsApp_Image_2026-09-29_at_20.29.42.jpg')
export const imgMikhunaCafeLeche60 = cld(CLOUDINARY + 'v1791156267/WhatsApp_Image_2026-09-29_at_20.22.50.jpg')
export const imgMikhunaColeccion60 = cld(CLOUDINARY + 'v1791156267/WhatsApp_Image_2026-09-29_at_12.18.41.jpg')

export type HeroSlide = {
  image: string
  alt: string
  brand: string
  title: string
  position: string
  contact?: string
}

export type Product = {
  id: number
  brand: 'Wayu Chocolates' | 'Choco Mikhuna'
  name: string
  subtitle: string
  price: string
  origin: string
  description: string
  tags: string[]
  image: string
  cardBg: string
  spotColor: string
  accentColor: string
  vignetteColor: string | null
  imgPosition: string
}

export const products: Product[] = [
  // ── WAYU ──────────────────────────────────────────────────────
  {
    id: 2,
    brand: 'Wayu Chocolates',
    name: 'Grageas con Arándano',
    subtitle: '60% Cacao · Tingo María',
    price: 'S/. 16.50',
    origin: 'Tingo María · Perú',
    description: 'Arándanos frescos cubiertos en chocolate 60% cacao fino de aroma. Explosión de sabor agridulce.',
    tags: ['60% Cacao', 'Arándano', 'Antioxidante'],
    image: imgGrageasArandanoNueva,
    cardBg: 'linear-gradient(135deg, #0c0a1f 0%, #1a1540 100%)',
    spotColor: 'rgba(100,100,255,0.25)',
    accentColor: '#9fa8da',
    vignetteColor: '#0c0a1f',
    imgPosition: 'center 50%',
  },
  {
    id: 3,
    brand: 'Wayu Chocolates',
    name: 'Chocolate con Leche',
    subtitle: '40% Cacao · Caja 80 gr',
    price: 'S/. 15.00',
    origin: 'Tingo María · Perú',
    description: 'Chocolate con leche 40% cacao fino de aroma. Elaborado artesanalmente del grano a la barra. Notas dulces y equilibradas.',
    tags: ['40% Cacao', '80 gr', 'Del grano a la barra'],
    image: imgWayuLeche40Box,
    cardBg: 'linear-gradient(135deg, #1a0a10 0%, #2d1020 100%)',
    spotColor: 'rgba(255,100,160,0.18)',
    accentColor: '#f48fb1',
    vignetteColor: '#1a0a10',
    imgPosition: 'center center',
  },
  {
    id: 5,
    brand: 'Wayu Chocolates',
    name: 'Chocolate Bitter Cítrico',
    subtitle: '75% Cacao · Arándano · 80 gr',
    price: 'S/. 15.00',
    origin: 'Tingo María · Perú',
    description: 'Intenso chocolate oscuro 75% cacao con notas cítricas y arándano. Para los amantes del chocolate puro.',
    tags: ['75% Cacao', 'Arándano', 'Bitter'],
    image: imgWayuBitter75,
    cardBg: 'linear-gradient(135deg, #0d0a1a 0%, #1a1438 100%)',
    spotColor: 'rgba(140,100,255,0.18)',
    accentColor: '#b39ddb',
    vignetteColor: '#0d0a1a',
    imgPosition: 'center 30%',
  },
  // ── CHOCO MIKHUNA ─────────────────────────────────────────────
  {
    id: 8,
    brand: 'Choco Mikhuna',
    name: 'Chocolate con Leche · Crema de Maní',
    subtitle: '60% Cacao · Venado Rojo · 80 gr',
    price: 'S/. 15.00',
    origin: 'Tingo María · Perú',
    description: 'La combinación perfecta de chocolate con leche 60% y crema de maní. Ilustrado con el Venado Rojo entre flores silvestres.',
    tags: ['60% Cacao', 'Crema Maní', '80 gr'],
    image: imgMikhunaCremaManiVenado,
    cardBg: 'linear-gradient(135deg, #1a1205 0%, #2e2010 100%)',
    spotColor: 'rgba(220,180,80,0.15)',
    accentColor: '#ffe082',
    vignetteColor: null,
    imgPosition: 'center center',
  },
  {
    id: 9,
    brand: 'Choco Mikhuna',
    name: 'Chocolate Bitter · Aguaymanto',
    subtitle: '75% Cacao · 80 gr',
    price: 'S/. 15.00',
    origin: 'Tingo María · Perú',
    description: 'Cacao intenso al 75% con el toque exótico del aguaymanto. Un placer único que mezcla lo amargo con lo tropical.',
    tags: ['75% Cacao', 'Aguaymanto', 'Bitter'],
    image: imgMikhunaBitterAguaymanto,
    cardBg: 'linear-gradient(135deg, #1f0d00 0%, #3d1e00 100%)',
    spotColor: 'rgba(255,160,20,0.2)',
    accentColor: '#ffb74d',
    vignetteColor: null,
    imgPosition: 'center center',
  },
  {
    id: 10,
    brand: 'Choco Mikhuna',
    name: 'Chocolate con Leche · Café',
    subtitle: '60% Cacao · Perezoso · 80 gr',
    price: 'S/. 15.00',
    origin: 'Tingo María · Perú',
    description: 'Chocolate con leche 60% con granos de café de la selva. El simpático Perezoso de Tres Dedos da la bienvenida en cada caja.',
    tags: ['60% Cacao', 'Café', '80 gr'],
    image: imgMikhunaCafe,
    cardBg: 'linear-gradient(135deg, #150a00 0%, #2e1800 100%)',
    spotColor: 'rgba(180,120,40,0.2)',
    accentColor: '#d4a24a',
    vignetteColor: null,
    imgPosition: 'center center',
  },
  {
    id: 12,
    brand: 'Choco Mikhuna',
    name: 'Chocolate con Leche · Maní',
    subtitle: '60% Cacao · Edición Splash · 80 gr',
    price: 'S/. 15.00',
    origin: 'Tingo María · Perú',
    description: '¡El placer del chocolate se une a la delicia del maní! Presentación con splash de chocolate. Gallito de las Rocas.',
    tags: ['60% Cacao', 'Maní', 'Edición Especial'],
    image: imgMikhunasManiSplash,
    cardBg: 'linear-gradient(135deg, #1a0800 0%, #3a1500 100%)',
    spotColor: 'rgba(200,100,30,0.2)',
    accentColor: '#ff8a65',
    vignetteColor: null,
    imgPosition: 'center center',
  },
  {
    id: 13,
    brand: 'Choco Mikhuna',
    name: 'Chocolate con Leche · 50% Cacao',
    subtitle: 'Mono Ardilla · 80 gr',
    price: 'S/. 15.00',
    origin: 'Tingo María · Perú',
    description: 'Chocolate con leche 50% cacao fino de aroma. El adorable Mono Ardilla de la Amazonía peruana es el protagonista de este sabor.',
    tags: ['50% Cacao', 'Leche', '80 gr'],
    image: imgMikhunaMono,
    cardBg: 'linear-gradient(135deg, #061525 0%, #0a2540 100%)',
    spotColor: 'rgba(60,160,220,0.2)',
    accentColor: '#80deea',
    vignetteColor: null,
    imgPosition: 'center center',
  },
  {
    id: 25,
    brand: 'Choco Mikhuna',
    name: 'Caja de Chocolate · Sabores Variados',
    subtitle: 'Chocolate con leche · Caja 30 gr',
    price: 'S/. 6.00',
    origin: 'Tingo María · Perú',
    description: 'Caja individual de chocolate artesanal en diferentes sabores, entre ellos café, crema de maní y maní.',
    tags: ['Sabores Variados', '30 gr', 'Artesanal'],
    image: imgMikhunaCaja30,
    cardBg: 'linear-gradient(135deg, #24120a 0%, #4a2715 100%)',
    spotColor: 'rgba(230,160,90,0.2)',
    accentColor: '#e0ad72',
    vignetteColor: null,
    imgPosition: 'center center',
  },
  {
    id: 15,
    brand: 'Wayu Chocolates',
    name: 'Chocolate Blanco · 9 Sabores',
    subtitle: '30 gr · Del grano a la barra',
    price: 'S/. 6.50',
    origin: 'Del grano a la barra · Artesanal',
    description: 'Chocolate blanco artesanal en 9 sabores: café, nibs, maní, ajonjolí, piña, aguaymanto, arándano, limón y fresa.',
    tags: ['9 Sabores', 'Blanco', '30 gr', 'Artesanal'],
    image: imgChocoMikhunaBars,
    cardBg: 'linear-gradient(135deg, #1c1508 0%, #2e2210 100%)',
    spotColor: 'rgba(220,180,80,0.15)',
    accentColor: '#e6c84a',
    vignetteColor: '#1c1508',
    imgPosition: 'center 20%',
  },
  {
    id: 16,
    brand: 'Choco Mikhuna',
    name: 'Choco Arcah · Mini Tableta',
    subtitle: '60% Cacao · 10 gr',
    price: 'S/. 2.00',
    origin: 'Tingo María · Perú',
    description: 'Mini tableta de chocolate con leche 60% cacao, presentada en una práctica bolsita individual de 10 gramos.',
    tags: ['60% Cacao', 'Mini Tableta', '10 gr'],
    image: imgChocoMikhunaPeq,
    cardBg: 'linear-gradient(135deg, #071a08 0%, #0f2e10 100%)',
    spotColor: 'rgba(100,200,80,0.12)',
    accentColor: '#81c784',
    vignetteColor: '#071a08',
    imgPosition: 'center 40%',
  },
  {
    id: 17,
    brand: 'Wayu Chocolates',
    name: 'Grageas con Aguaymanto',
    subtitle: '60% Cacao · Fruta tropical',
    price: 'S/. 16.50',
    origin: 'Tingo María · Perú',
    description: 'Aguaymanto cubierto con chocolate 60% cacao. Una combinación vibrante, frutal y ligeramente ácida.',
    tags: ['60% Cacao', 'Aguaymanto', 'Natural'],
    image: imgGrageasAguaymanto,
    cardBg: 'linear-gradient(135deg, #291306 0%, #542408 100%)',
    spotColor: 'rgba(255,170,45,0.24)',
    accentColor: '#f1a24c',
    vignetteColor: '#291306',
    imgPosition: 'center 48%',
  },
  {
    id: 18,
    brand: 'Wayu Chocolates',
    name: 'Grageas con Fresa',
    subtitle: '60% Cacao · Fruta deshidratada',
    price: 'S/. 16.50',
    origin: 'Tingo María · Perú',
    description: 'Fresa frutal cubierta con chocolate artesanal al 60%. Dulce, fresca y perfecta para compartir.',
    tags: ['60% Cacao', 'Fresa', 'Artesanal'],
    image: imgGrageasFresa,
    cardBg: 'linear-gradient(135deg, #280809 0%, #521416 100%)',
    spotColor: 'rgba(240,100,105,0.22)',
    accentColor: '#ef8b86',
    vignetteColor: '#280809',
    imgPosition: 'center 45%',
  },
  {
    id: 19,
    brand: 'Wayu Chocolates',
    name: 'Grageas con Mango',
    subtitle: '60% Cacao · Fruta tropical',
    price: 'S/. 16.50',
    origin: 'Tingo María · Perú',
    description: 'Mango tropical cubierto con chocolate 60% cacao fino de aroma. Suave, jugoso y naturalmente peruano.',
    tags: ['60% Cacao', 'Mango', 'Tropical'],
    image: imgGrageasMango,
    cardBg: 'linear-gradient(135deg, #241403 0%, #493006 100%)',
    spotColor: 'rgba(245,187,55,0.22)',
    accentColor: '#e9b94e',
    vignetteColor: '#241403',
    imgPosition: 'center 46%',
  },
  {
    id: 20,
    brand: 'Wayu Chocolates',
    name: 'Grageas con Piña',
    subtitle: '60% Cacao · Fruta tropical',
    price: 'S/. 16.50',
    origin: 'Tingo María · Perú',
    description: 'Piña tropical bañada en chocolate 60% cacao. Un contraste luminoso entre dulzor, acidez y cacao.',
    tags: ['60% Cacao', 'Piña', 'Tropical'],
    image: imgGrageasPina,
    cardBg: 'linear-gradient(135deg, #102009 0%, #203c0e 100%)',
    spotColor: 'rgba(135,205,70,0.2)',
    accentColor: '#a8cf6a',
    vignetteColor: '#102009',
    imgPosition: 'center 48%',
  },
  {
    id: 21,
    brand: 'Wayu Chocolates',
    name: 'Grageas con Pasas',
    subtitle: '60% Cacao · Fruta deshidratada',
    price: 'S/. 16.50',
    origin: 'Tingo María · Perú',
    description: 'Pasas seleccionadas cubiertas con chocolate artesanal al 60%. Un clásico intenso y equilibrado.',
    tags: ['60% Cacao', 'Pasas', 'Clásico'],
    image: imgGrageasPasas,
    cardBg: 'linear-gradient(135deg, #21160e 0%, #3d2a1d 100%)',
    spotColor: 'rgba(225,205,170,0.16)',
    accentColor: '#ddc7a4',
    vignetteColor: '#21160e',
    imgPosition: 'center 44%',
  },
  {
    id: 23,
    brand: 'Choco Mikhuna',
    name: 'Cascarilla de Cacao',
    subtitle: '100% Cacao · 250 gr',
    price: 'S/. 14.00',
    origin: 'Tingo María · Perú',
    description: 'Cascarilla de cacao de aroma profundo, ideal para preparar una infusión cálida y naturalmente reconfortante.',
    tags: ['100% Cacao', 'Infusión', '250 gr'],
    image: imgCascarillaMikhuna,
    cardBg: 'linear-gradient(135deg, #101b08 0%, #233713 100%)',
    spotColor: 'rgba(95,175,65,0.18)',
    accentColor: '#91c66d',
    vignetteColor: '#101b08',
    imgPosition: 'center 48%',
  },
  {
    id: 24,
    brand: 'Wayu Chocolates',
    name: 'Cacao en Polvo',
    subtitle: 'Cacao puro · Presentación artesanal',
    price: 'S/. 25.00',
    origin: 'Tingo María · Perú',
    description: 'Cacao en polvo de aroma intenso, ideal para bebidas, postres y preparaciones de repostería.',
    tags: ['Cacao en Polvo', 'Natural', 'Repostería'],
    image: imgCacaoPolvo,
    cardBg: 'linear-gradient(135deg, #21140a 0%, #4a2e16 100%)',
    spotColor: 'rgba(210,160,75,0.18)',
    accentColor: '#d8ad66',
    vignetteColor: '#21140a',
    imgPosition: 'center 48%',
  },
]

export type Filter = 'Todos' | 'Wayu Chocolates' | 'Choco Mikhuna'

export const heroSlides: HeroSlide[] = [
  {
    image: imgColeccionGrageas,
    alt: 'Colección de grageas artesanales Wayu',
    brand: 'Wayu Chocolates',
    title: 'Seis sabores tropicales',
    position: 'center',
  },
  {
    image: imgChocoMikhunaBars,
    alt: 'Colección de chocolates blancos artesanales Wayu',
    brand: 'Wayu Chocolates',
    title: 'Chocolate blanco en nueve sabores',
    position: 'center',
  },
  {
    image: imgMikhunaCremaManiVenado,
    alt: 'Chocolate Choco Mikhuna con crema de maní',
    brand: 'Choco Mikhuna',
    title: 'Cacao y crema de maní',
    position: 'center',
  },
  {
    image: imgMikhunaColeccion60,
    alt: 'Colección de chocolates con leche Choco Mikhuna al 60% cacao',
    brand: 'Choco Mikhuna',
    title: 'Siente la magia del 60% cacao',
    position: 'center top',
    contact: '923 400 158',
  },
  {
    image: imgMikhunaCafeLeche60,
    alt: 'Chocolates con leche Choco Mikhuna de café y cacao al 60%',
    brand: 'Choco Mikhuna',
    title: 'Café y chocolate con leche al 60%',
    position: 'center top',
  },
  {
    image: imgMikhunaBitterAguaymanto,
    alt: 'Chocolate bitter Choco Mikhuna con aguaymanto',
    brand: 'Choco Mikhuna',
    title: 'Bitter 75% con aguaymanto',
    position: 'center',
  },
  {
    image: imgCacaoPolvo,
    alt: 'Cacao en polvo artesanal Wayu',
    brand: 'Wayu Chocolates',
    title: 'Cacao puro de aroma intenso',
    position: 'center 48%',
  },
  {
    image: imgMikhunaMono,
    alt: 'Chocolate con leche Choco Mikhuna con ilustración de mono ardilla',
    brand: 'Choco Mikhuna',
    title: 'Chocolate con leche 50% cacao',
    position: 'center',
  },
]

export type FondoForma = {
  tipo: 'leaf' | 'pod' | 'bean'
  left: string
  top: string
  width: number
  dx: string
  dy: string
  r0: string
  r1: string
  duracion: string
  retraso: string
  ocultarEnCelular?: boolean
}

export const fondoFormas: FondoForma[] = [
  { tipo: 'leaf', left: '3%', top: '12%', width: 120, dx: '40px', dy: '-60px', r0: '-25deg', r1: '10deg', duracion: '52s', retraso: '-8s' },
  { tipo: 'pod', left: '88%', top: '20%', width: 110, dx: '-50px', dy: '40px', r0: '20deg', r1: '-10deg', duracion: '60s', retraso: '-30s' },
  { tipo: 'leaf', left: '10%', top: '72%', width: 150, dx: '60px', dy: '-30px', r0: '35deg', r1: '60deg', duracion: '58s', retraso: '-20s' },
  { tipo: 'bean', left: '82%', top: '70%', width: 56, dx: '-30px', dy: '-50px', r0: '15deg', r1: '-30deg', duracion: '44s', retraso: '-5s' },
  { tipo: 'leaf', left: '66%', top: '6%', width: 100, dx: '30px', dy: '50px', r0: '-50deg', r1: '-20deg', duracion: '56s', retraso: '-40s', ocultarEnCelular: true },
  { tipo: 'pod', left: '42%', top: '80%', width: 95, dx: '40px', dy: '-40px', r0: '-35deg', r1: '-5deg', duracion: '64s', retraso: '-15s', ocultarEnCelular: true },
  { tipo: 'bean', left: '24%', top: '38%', width: 48, dx: '25px', dy: '45px', r0: '40deg', r1: '70deg', duracion: '48s', retraso: '-26s', ocultarEnCelular: true },
]