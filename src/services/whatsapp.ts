import { SITE } from '@/config/site'
import { cartTotal, formatPrice } from '@/services/pricing'
import type { CartLine } from '@/types/product'

export function whatsappUrl(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_CONTACT_URL = whatsappUrl(SITE.contactMessage)

export function buildOrderMessage(lines: CartLine[]) {
  const productLines = lines.map(({ product, quantity }) =>
    `- ${quantity} x ${product.name} (${product.subtitle}) — ${formatPrice(product.price * quantity)}`,
  )

  return [
    'Hola, quisiera realizar el siguiente pedido:',
    '',
    ...productLines,
    '',
    `Total: ${formatPrice(cartTotal(lines))}`,
    '',
    '¿Podrían confirmarme la disponibilidad, por favor?',
  ].join('\n')
}

export type GiftOrder = {
  size: number
  lines: CartLine[]
  boxPrice: number
  to: string
  from: string
  message: string
}

export function buildGiftMessage({ size, lines, boxPrice, to, from, message }: GiftOrder) {
  const chocolates = cartTotal(lines)
  const dedication = [
    to && `Para: ${to}`,
    from && `De: ${from}`,
    message && `Mensaje: ${message}`,
  ].filter(Boolean)

  return [
    `Hola, quiero armar una caja de regalo de ${size} tabletas:`,
    '',
    ...lines.map(({ product, quantity }) => `- ${quantity} x ${product.name} (${product.subtitle}) — ${formatPrice(product.price * quantity)}`),
    '',
    ...(dedication.length ? ['Dedicatoria', ...dedication, ''] : []),
    `Chocolates: ${formatPrice(chocolates)}`,
    boxPrice > 0 ? `Caja: ${formatPrice(boxPrice)}` : 'Caja: por confirmar',
    boxPrice > 0 ? `Total: ${formatPrice(chocolates + boxPrice)}` : '',
    '',
    '¿Me confirman la disponibilidad y el total, por favor?',
  ]
    .filter((line, index, all) => line !== '' || all[index - 1] !== '')
    .join('\n')
}

export function sendWhatsAppGift(order: GiftOrder) {
  window.open(whatsappUrl(buildGiftMessage(order)), '_blank', 'noopener,noreferrer')
}

export function sendWhatsAppOrder(lines: CartLine[]) {
  if (lines.length === 0) return
  window.open(whatsappUrl(buildOrderMessage(lines)), '_blank', 'noopener,noreferrer')
}
