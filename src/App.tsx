import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react'

// Imágenes alojadas en Cloudinary.
// cld() agrega formato y calidad automáticos y limita el ancho para que carguen más rápido.
const cld = (url: string, width = 1200) =>
  url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
const CLOUDINARY = 'https://res.cloudinary.com/ytmafyip/image/upload/'

const imgWayuLeche40Box = cld(CLOUDINARY + 'v1791150364/WhatsApp_Image_2026-09-26_at_15.29.11.jpg')
const imgChocoMikhunaBars = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-27_at_15.12.11.jpg')
const imgChocoMikhunaPeq = cld(CLOUDINARY + 'v1791150364/WhatsApp_Image_2026-09-27_at_15.46.51.jpg')
const imgWayuBitter75 = cld(CLOUDINARY + 'v1791155195/WhatsApp_Image_2026-10-04_at_18.02.11.jpg')
const imgMikhunaCremaManiVenado = cld(CLOUDINARY + 'v1791150366/WhatsApp_Image_2026-09-20_at_22.20.43.jpg')
const imgMikhunaBitterAguaymanto = cld(CLOUDINARY + 'v1791150366/WhatsApp_Image_2026-09-20_at_22.20.41_2.jpg')
const imgMikhunaCafe = cld(CLOUDINARY + 'v1791150366/WhatsApp_Image_2026-09-20_at_22.20.42.jpg')
const imgMikhunasManiSplash = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-20_at_22.20.43_1.jpg')
const imgMikhunaMono = cld(CLOUDINARY + 'v1791150366/WhatsApp_Image_2026-09-20_at_22.20.41.jpg')
const imgGrageasAguaymanto = cld(CLOUDINARY + 'v1791150364/WhatsApp_Image_2026-09-26_at_15.17.08.jpg')
const imgGrageasArandanoNueva = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.16.42.jpg')
const imgGrageasFresa = cld(CLOUDINARY + 'v1791150364/WhatsApp_Image_2026-09-26_at_15.16.11.jpg')
const imgGrageasMango = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.15.31.jpg')
const imgGrageasPina = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.15.00.jpg')
const imgGrageasPasas = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.14.33.jpg')
const imgMiniTabletasWayu = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-27_at_15.12.11.jpg')
const imgColeccionGrageas = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.07.54_2.jpg')
const imgCascarillaMikhuna = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.07.54_1.jpg')
const imgCacaoPolvo = cld(CLOUDINARY + 'v1791150365/WhatsApp_Image_2026-09-26_at_15.07.54.jpg')
const imgMikhunaCaja30 = cld(CLOUDINARY + 'v1791156267/WhatsApp_Image_2026-09-29_at_20.29.42.jpg')
const imgMikhunaCafeLeche60 = cld(CLOUDINARY + 'v1791156267/WhatsApp_Image_2026-09-29_at_20.22.50.jpg')
const imgMikhunaColeccion60 = cld(CLOUDINARY + 'v1791156267/WhatsApp_Image_2026-09-29_at_12.18.41.jpg')

type HeroSlide = {
  image: string
  alt: string
  brand: string
  title: string
  position: string
  contact?: string
}

type Product = {
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
  vignetteColor: string | null   // null = image already has nice bg, no vignette
  imgPosition: string
}

const products: Product[] = [
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

type Filter = 'Todos' | 'Wayu Chocolates' | 'Choco Mikhuna'

const WHATSAPP_NUMBER = '51923400158'
const WHATSAPP_CONTACT_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hola, quisiera recibir información sobre sus chocolates artesanales.',
)}`

const heroSlides: HeroSlide[] = [
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

function parsePrice(price: string) {
  const amount = price.match(/\d+(?:[.,]\d+)?/)?.[0]
  return amount ? Number(amount.replace(',', '.')) : 0
}

function getProductWeight(product: Product) {
  return [...product.tags, product.subtitle]
    .map(value => value.match(/\b\d+\s*(?:gr|g)\b/i)?.[0])
    .find(Boolean)
}

function productCategoryOrder(product: Product) {
  if (product.name.startsWith('Grageas')) return 1
  if (product.name === 'Cacao en Polvo' || product.name === 'Cascarilla de Cacao') return 2
  return 0
}

type FondoForma = {
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

const fondoFormas: FondoForma[] = [
  { tipo: 'leaf', left: '3%', top: '12%', width: 120, dx: '40px', dy: '-60px', r0: '-25deg', r1: '10deg', duracion: '52s', retraso: '-8s' },
  { tipo: 'pod', left: '88%', top: '20%', width: 110, dx: '-50px', dy: '40px', r0: '20deg', r1: '-10deg', duracion: '60s', retraso: '-30s' },
  { tipo: 'leaf', left: '10%', top: '72%', width: 150, dx: '60px', dy: '-30px', r0: '35deg', r1: '60deg', duracion: '58s', retraso: '-20s' },
  { tipo: 'bean', left: '82%', top: '70%', width: 56, dx: '-30px', dy: '-50px', r0: '15deg', r1: '-30deg', duracion: '44s', retraso: '-5s' },
  { tipo: 'leaf', left: '66%', top: '6%', width: 100, dx: '30px', dy: '50px', r0: '-50deg', r1: '-20deg', duracion: '56s', retraso: '-40s', ocultarEnCelular: true },
  { tipo: 'pod', left: '42%', top: '80%', width: 95, dx: '40px', dy: '-40px', r0: '-35deg', r1: '-5deg', duracion: '64s', retraso: '-15s', ocultarEnCelular: true },
  { tipo: 'bean', left: '24%', top: '38%', width: 48, dx: '25px', dy: '45px', r0: '40deg', r1: '70deg', duracion: '48s', retraso: '-26s', ocultarEnCelular: true },
]

function FormaFondo({ forma }: { forma: FondoForma }) {
  const estilo = {
    left: forma.left,
    top: forma.top,
    width: forma.width,
    '--dx': forma.dx,
    '--dy': forma.dy,
    '--r0': forma.r0,
    '--r1': forma.r1,
    animationDuration: forma.duracion,
    animationDelay: forma.retraso,
  } as CSSProperties
  const clase = `site-bg-shape ${forma.tipo}${forma.ocultarEnCelular ? ' hide-mobile' : ''}`

  if (forma.tipo === 'leaf') {
    return (
      <svg className={clase} style={estilo} viewBox="-50 -100 100 200" aria-hidden="true">
        <path d="M0 -92 C 42 -52 42 52 0 92 C -42 52 -42 -52 0 -92 Z" fill="currentColor" />
        <path d="M0 -80 L0 84 M0 -40 L18 -58 M0 -10 L24 -30 M0 22 L22 4 M0 -40 L-18 -58 M0 -10 L-24 -30 M0 22 L-22 4" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  if (forma.tipo === 'pod') {
    return (
      <svg className={clase} style={estilo} viewBox="-50 -105 100 210" aria-hidden="true">
        <path d="M0 -98 C 34 -72 46 -10 31 50 C 23 80 8 96 0 102 C -8 96 -23 80 -31 50 C -46 -10 -34 -72 0 -98 Z" fill="currentColor" />
        <path d="M0 -92 C 11 -30 11 40 0 96 M-19 -72 C -28 -10 -22 50 -11 86 M19 -72 C 28 -10 22 50 11 86" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className={clase} style={estilo} viewBox="-40 -60 80 120" aria-hidden="true">
      <ellipse cx="0" cy="0" rx="30" ry="48" fill="currentColor" />
      <path d="M-6 -40 C 9 -14 9 14 -6 40" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function FondoAnimado() {
  return (
    <div className="site-bg" aria-hidden="true">
      <div className="site-bg-layer site-bg-b" />
      <div className="site-bg-layer site-bg-c" />
      <div className="site-bg-glow" />
      {fondoFormas.map((forma, indice) => (
        <FormaFondo key={indice} forma={forma} />
      ))}
    </div>
  )
}

function CartIcon() {
  return (
    <svg
      className="cart-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

export default function App() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>('Todos')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [heroSlide, setHeroSlide] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  const [cartFloating, setCartFloating] = useState(false)
  const heroTouchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!selectedProduct && !cartOpen) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (selectedProduct) setSelectedProduct(null)
      else setCartOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedProduct, cartOpen])

  useEffect(() => {
    if (heroPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      setHeroSlide(current => (current + 1) % heroSlides.length)
    }, 4300)

    return () => window.clearInterval(interval)
  }, [heroPaused])

  useEffect(() => {
    const updateCartPosition = () => {
      const scrollTop = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      )
      setCartFloating(scrollTop > 120)
    }

    updateCartPosition()
    window.addEventListener('scroll', updateCartPosition, { passive: true, capture: true })
    document.addEventListener('scroll', updateCartPosition, { passive: true, capture: true })

    return () => {
      window.removeEventListener('scroll', updateCartPosition, true)
      document.removeEventListener('scroll', updateCartPosition, true)
    }
  }, [])

  function addToCart(id: number) {
    setCart(previous => ({ ...previous, [id]: (previous[id] ?? 0) + 1 }))
  }

  function changeHeroSlide(direction: -1 | 1) {
    setHeroSlide(current => (current + direction + heroSlides.length) % heroSlides.length)
  }

  function handleHeroTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0]
    heroTouchStart.current = { x: touch.clientX, y: touch.clientY }
    setHeroPaused(true)
  }

  function handleHeroTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = heroTouchStart.current
    const touch = event.changedTouches[0]
    heroTouchStart.current = null
    setHeroPaused(false)

    if (!start || !touch) return

    const distanceX = touch.clientX - start.x
    const distanceY = touch.clientY - start.y

    if (Math.abs(distanceX) < 45 || Math.abs(distanceX) <= Math.abs(distanceY)) return
    changeHeroSlide(distanceX < 0 ? 1 : -1)
  }

  function updateQuantity(id: number, change: number) {
    setCart(previous => {
      const nextQuantity = (previous[id] ?? 0) + change
      const nextCart = { ...previous }

      if (nextQuantity <= 0) delete nextCart[id]
      else nextCart[id] = nextQuantity

      return nextCart
    })
  }

  function sendWhatsAppOrder() {
    if (cartItems.length === 0) return

    const productLines = cartItems.map(({ product, quantity }) => {
      const subtotal = parsePrice(product.price) * quantity
      return `- ${quantity} x ${product.name} (${product.subtitle}) — S/. ${subtotal.toFixed(2)}`
    })
    const message = [
      'Hola, quisiera realizar el siguiente pedido:',
      '',
      ...productLines,
      '',
      `Total: S/. ${cartTotal.toFixed(2)}`,
      '',
      '¿Podrían confirmarme la disponibilidad, por favor?',
    ].join('\n')

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const filtered = (filter === 'Todos' ? [...products] : products.filter(p => p.brand === filter))
    .sort((a, b) => productCategoryOrder(a) - productCategoryOrder(b))
  const cartItems = products
    .filter(product => cart[product.id])
    .map(product => ({ product, quantity: cart[product.id] }))
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce((total, { product, quantity }) => {
    return total + parsePrice(product.price) * quantity
  }, 0)

  function showCollection(nextFilter: Filter = 'Todos') {
    setFilter(nextFilter)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(() => document.querySelector('#catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 0)
  }

  return (
    <div className="app-shell" style={{ minHeight: '100vh', backgroundColor: 'transparent', fontFamily: "'DM Sans', sans-serif" }}>
      <FondoAnimado />

      {/* Nav */}
      <nav className="site-nav" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid var(--c-linea)',
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'rgba(207,184,148,0.9)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}>
        <div className="site-brand">
          <div className="site-brand-title" style={{ fontFamily: "'Fraunces', serif", fontSize: '1.4rem', fontWeight: 400, color: 'var(--c-cacao)', letterSpacing: '0.02em' }}>
            Wayu & Mikhuna
          </div>
          <div className="site-brand-subtitle" style={{ fontSize: '0.6rem', color: 'var(--c-texto-suave)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1px' }}>
            Chocolates Artesanales · Perú
          </div>
        </div>
        <div className="site-nav-actions">
          <div className="site-nav-links" style={{ display: 'flex', gap: '2rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--c-texto-suave)' }}>
            {(['Colección', 'Nosotros', 'Contacto'] as const).map(item => (
              <a key={item} href="#" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-cacao)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-texto-suave)')}>
                {item}
              </a>
            ))}
          </div>
          <button
            type="button"
            className={`cart-summary cart-summary-nav${cartFloating ? ' is-hidden' : ''}`}
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir carrito con ${cartCount} productos`}
            title="Ver carrito"
            aria-hidden={cartFloating}
            tabIndex={cartFloating ? -1 : undefined}
          >
            <CartIcon />
            {cartCount > 0 && <span className="cart-count" aria-live="polite">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {cartFloating && (
        <button
          type="button"
          className="cart-summary is-floating"
          onClick={() => setCartOpen(true)}
          aria-label={`Abrir carrito con ${cartCount} productos`}
          title="Ver carrito"
        >
          <CartIcon />
          {cartCount > 0 && <span className="cart-count" aria-live="polite">{cartCount}</span>}
        </button>
      )}

      <a
        className="whatsapp-float"
        href={WHATSAPP_CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Comunicarse directamente con el vendedor por WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.04 2a9.84 9.84 0 0 0-8.42 14.93L2.2 22l5.19-1.36A9.98 9.98 0 1 0 12.04 2Zm0 17.96a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.08.81.82-3-.2-.31a8.13 8.13 0 1 1 6.89 3.81Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.23-.08-.39-.12-.56.12-.16.25-.63.79-.77.95-.14.17-.29.19-.53.07-.24-.12-1.03-.38-1.96-1.21a7.37 7.37 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.41.08-.16.04-.3-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.41-.41-.56-.42h-.47a.9.9 0 0 0-.65.3c-.22.24-.85.83-.85 2.03 0 1.19.88 2.35 1 2.51.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.59.18 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
        </svg>
        <span className="whatsapp-tooltip" role="tooltip">
          Comunícate directamente con el vendedor
        </span>
      </a>

      {/* Hero */}
      <section className="hero-layout">
        <div className="hero-copy">
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--c-verde-texto)', marginBottom: '1.5rem' }}>
            Cacao Fino de Aroma · Tingo María, Perú
          </p>
          <h1 className="hero-title" style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 300, lineHeight: 1.06,
            color: 'var(--c-cacao)', marginBottom: '1.5rem', letterSpacing: '-0.02em',
          }}>
            El sabor que nace<br />
            <em style={{ fontStyle: 'italic', color: 'var(--c-verde-texto)' }}>de la selva</em>
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--c-texto-suave)', maxWidth: '460px', lineHeight: 1.75, marginBottom: '2rem' }}>
            Chocolates artesanales elaborados del grano a la barra con cacao fino de aroma
            de Tingo María. Naturaleza convertida en placer.
          </p>
          <button className="hero-button" onClick={() => showCollection()}>
            Explorar la colección
          </button>
        </div>
        <div
          className={`hero-image${heroSlides[heroSlide].contact ? ' has-contact' : ''}`}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Productos destacados"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          onTouchStart={handleHeroTouchStart}
          onTouchEnd={handleHeroTouchEnd}
          onTouchCancel={() => {
            heroTouchStart.current = null
            setHeroPaused(false)
          }}
          onFocusCapture={() => setHeroPaused(true)}
          onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroPaused(false)
          }}
        >
          {heroSlides.map((slide, index) => (
            <img
              className={`hero-slide${slide.contact ? ' hero-slide-contact' : ''}${index === heroSlide ? ' is-active' : ''}`}
              key={slide.title}
              src={slide.image}
              alt={index === heroSlide ? slide.alt : ''}
              draggable={false}
              style={{ objectPosition: slide.position }}
            />
          ))}
          <div className="hero-vignette" />
          {heroSlides[heroSlide].contact && (
            <div className="hero-contact">
              <span>Pedidos directos</span>
              <strong>{heroSlides[heroSlide].contact}</strong>
            </div>
          )}
          <div className="hero-caption">
            <span>{heroSlides[heroSlide].brand}</span>
            <strong>{heroSlides[heroSlide].title}</strong>
          </div>
          <button
            className="hero-arrow hero-arrow-previous"
            type="button"
            onClick={() => changeHeroSlide(-1)}
            aria-label="Ver imagen anterior"
          >
            ‹
          </button>
          <button
            className="hero-arrow hero-arrow-next"
            type="button"
            onClick={() => changeHeroSlide(1)}
            aria-label="Ver imagen siguiente"
          >
            ›
          </button>
        </div>
      </section>

      {/* Featured collections */}
      <section className="collection-showcase">
        <div className="section-heading">
          <p>Descubre por colección</p>
          <h2>Una expresión distinta del cacao</h2>
        </div>
        <div className="collection-grid">
          {[
            {
              title: 'Mini tabletas',
              eyebrow: 'Wayu · 9 sabores',
              image: imgMiniTabletasWayu,
              position: 'center 45%',
              action: () => showCollection('Wayu Chocolates'),
            },
            {
              title: 'Del cacao a la taza',
              eyebrow: 'Choco Mikhuna · Cascarilla',
              image: imgCascarillaMikhuna,
              position: 'center 48%',
              action: () => showCollection('Choco Mikhuna'),
            },
            {
              title: 'Cacao en polvo',
              eyebrow: 'Wayu · Cacao puro',
              image: imgCacaoPolvo,
              position: 'center 48%',
              action: () => showCollection('Wayu Chocolates'),
            },
          ].map(collection => (
            <button key={collection.title} className="collection-card" onClick={collection.action}>
              <img src={collection.image} alt="" loading="lazy" decoding="async" style={{ objectPosition: collection.position }} />
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

      {/* Divider */}
      <div className="catalog-divider" style={{ margin: '0 2.5rem 0', height: '1px', background: 'linear-gradient(to right, var(--c-linea), transparent)' }} />

      {/* Filter tabs */}
      <div id="catalogo" className="catalog-filters" style={{ padding: '2rem 2.5rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', scrollMarginTop: '6rem' }}>
        {(['Todos', 'Wayu Chocolates', 'Choco Mikhuna'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.4rem',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border: filter === f ? '1px solid var(--c-verde)' : '1px solid var(--c-linea-fuerte)',
              backgroundColor: filter === f ? 'var(--c-verde)' : 'transparent',
              color: filter === f ? 'var(--c-hueso)' : 'var(--c-texto-suave)',
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f} {f !== 'Todos' && `(${products.filter(p => p.brand === f).length})`}
          </button>
        ))}
        <span className="product-count" style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--c-texto-suave)', alignSelf: 'center', letterSpacing: '0.05em' }}>
          {filtered.length} productos
        </span>
      </div>

      {/* Grid */}
      <section className="catalog-section" style={{ padding: '2.5rem 1.5rem 6rem' }}>
        <div className="product-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1.25rem',
          maxWidth: '1360px',
          margin: '0 auto',
        }}>
          {filtered.map(p => (
            <article
              className="product-card"
              key={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--c-linea)',
                backgroundColor: 'var(--c-hueso)',
                cursor: 'pointer',
                transition: 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.45s ease',
                transform: hovered === p.id ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hovered === p.id
                  ? '0 18px 40px rgba(58,37,24,0.18)'
                  : '0 2px 12px rgba(58,37,24,0.08)',
              }}
            >
              {/* Image panel */}
              <button
                className="product-image-panel"
                type="button"
                aria-label={`Ampliar foto de ${p.name}`}
                onClick={() => setSelectedProduct(p)}
                style={{
                  position: 'relative', display: 'block', flexShrink: 0, width: '100%', height: '360px',
                  padding: 0, border: 0, background: 'var(--c-linea)', overflow: 'hidden',
                  cursor: 'zoom-in', textAlign: 'left',
                }}
              >

                {/* Product image */}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    objectPosition: p.imgPosition,
                    transform: hovered === p.id ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                    zIndex: 2,
                  }}
                />

                {/* Hover description overlay */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 8,
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: '1.5rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 52%)',
                  opacity: hovered === p.id ? 1 : 0,
                  transition: 'opacity 0.35s ease',
                }}>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.65 }}>
                    {p.description}
                  </p>
                </div>

                {/* Brand badge */}
                <div style={{
                  position: 'absolute', top: '1rem', left: '1rem', zIndex: 10,
                  padding: '0.28rem 0.7rem',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '2px',
                  fontSize: '0.58rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#fffaf2',
                }}>
                  {p.brand}
                </div>

                {getProductWeight(p) && (
                  <div
                    className="product-weight"
                    style={{
                      borderColor: 'rgba(255,250,242,0.55)',
                      color: '#fffaf2',
                    }}
                  >
                    {getProductWeight(p)}
                  </div>
                )}
              </button>

              {/* Info panel */}
              <div className="product-info" style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                padding: '1.25rem 1.4rem 1.5rem',
                backgroundColor: 'var(--c-hueso)',
                borderTop: '1px solid var(--c-linea)',
              }}>
                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                  {p.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '0.22rem 0.55rem',
                      border: '1px solid rgba(79,107,58,0.4)',
                      color: 'var(--c-verde)',
                      borderRadius: '1px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="product-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                  <h2 style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: '1.15rem', fontWeight: 400,
                    color: 'var(--c-cacao)', lineHeight: 1.25, flex: 1,
                  }}>
                    {p.name}
                  </h2>
                  <span style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: '1.1rem', fontWeight: 400,
                    color: 'var(--c-terracota)',
                    whiteSpace: 'nowrap', marginLeft: '1rem', marginTop: '2px',
                  }}>
                    {p.price}
                  </span>
                </div>

                <p style={{ fontSize: '0.73rem', color: 'var(--c-texto-suave)', marginBottom: '1.1rem', letterSpacing: '0.04em', lineHeight: 1.5 }}>
                  {p.subtitle} · {p.origin}
                </p>

                <button
                  onClick={() => addToCart(p.id)}
                  style={{
                    marginTop: 'auto',
                    width: '100%', padding: '0.7rem',
                    fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '2px',
                    border: '1px solid var(--c-verde)',
                    backgroundColor: cart[p.id] ? 'var(--c-verde)' : 'transparent',
                    color: cart[p.id] ? 'var(--c-hueso)' : 'var(--c-verde)',
                    fontWeight: cart[p.id] ? 600 : 400,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {cart[p.id] ? `Agregar otro · ${cart[p.id]} en carrito` : 'Agregar al carrito'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Origin strip */}
      <section className="origin-strip" style={{
        padding: '3.5rem 2.5rem',
        borderTop: '1px solid var(--c-linea)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '2rem',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        {[
          { label: 'Origen', value: 'Tingo María, Perú' },
          { label: 'Proceso', value: 'Del grano a la barra' },
          { label: 'Cacao', value: 'Fino de Aroma' },
          { label: 'Productos', value: `${products.length} variedades` },
        ].map(item => (
          <div key={item.label}>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--c-verde-texto)', marginBottom: '0.5rem' }}>
              {item.label}
            </p>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: '1.05rem', fontWeight: 300, color: 'var(--c-cacao)' }}>
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="site-footer" style={{
        borderTop: '1px solid var(--c-linea)',
        padding: '2rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: '0.9rem', fontWeight: 300, color: 'var(--c-texto-suave)' }}>
          Wayu Chocolates & Choco Mikhuna © 2026
        </span>
        <p style={{ fontSize: '0.65rem', color: 'var(--c-texto-suave)', letterSpacing: '0.1em' }}>
          Un Placer Natural · Tingo María · Huánuco · Perú
        </p>
      </footer>

      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada de ${selectedProduct.name}`}
          onClick={() => setSelectedProduct(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(1rem, 4vw, 3rem)',
            backgroundColor: 'rgba(40,26,17,0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            cursor: 'zoom-out',
          }}
        >
          <div
            onClick={event => event.stopPropagation()}
            style={{
              position: 'relative',
              display: 'flex', flexDirection: 'column',
              maxWidth: 'min(92vw, 1100px)', maxHeight: '92vh',
              cursor: 'default',
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Cerrar imagen ampliada"
              style={{
                alignSelf: 'flex-end', marginBottom: '0.75rem',
                padding: '0.55rem 0.9rem',
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: '2px',
                background: 'rgba(10,6,2,0.7)',
                color: '#f5ede0',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Cerrar
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{
                display: 'block',
                maxWidth: '100%', maxHeight: 'calc(92vh - 5rem)',
                objectFit: 'contain',
                borderRadius: '3px',
                boxShadow: '0 30px 90px rgba(0,0,0,0.7)',
              }}
            />
            <p style={{
              marginTop: '0.8rem',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: "'Fraunces', serif",
              fontSize: '1rem', fontWeight: 300, textAlign: 'center',
            }}>
              {selectedProduct.name}
            </p>
          </div>
        </div>
      )}

      {cartOpen && (
        <div
          className="cart-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Carrito de compras"
          onClick={() => setCartOpen(false)}
        >
          <aside className="cart-panel" onClick={event => event.stopPropagation()}>
            <div className="cart-header">
              <div>
                <p>Tu pedido</p>
                <h2>Carrito</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">
                Cerrar
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <p>Tu carrito está vacío.</p>
                  <button type="button" onClick={() => setCartOpen(false)}>
                    Ver productos
                  </button>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <article className="cart-item" key={product.id}>
                    <img src={product.image} alt="" loading="lazy" decoding="async" />
                    <div className="cart-item-info">
                      <h3>{product.name}</h3>
                      <p>{product.subtitle}</p>
                      <strong>{product.price}</strong>
                      <div className="quantity-controls" aria-label={`Cantidad de ${product.name}`}>
                        <button type="button" onClick={() => updateQuantity(product.id, -1)} aria-label={`Restar una unidad de ${product.name}`}>
                          −
                        </button>
                        <span aria-live="polite">{quantity}</span>
                        <button type="button" onClick={() => updateQuantity(product.id, 1)} aria-label={`Agregar una unidad de ${product.name}`}>
                          +
                        </button>
                        <button className="remove-item" type="button" onClick={() => updateQuantity(product.id, -quantity)}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div>
                  <span>Total estimado</span>
                  <strong>S/. {cartTotal.toFixed(2)}</strong>
                </div>
                <button type="button" onClick={sendWhatsAppOrder}>
                  Pedir por WhatsApp
                </button>
                <small>Se abrirá WhatsApp con el detalle y las cantidades de tu pedido.</small>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}