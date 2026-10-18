import type { ReactNode } from 'react'

type IconProps = { className?: string }

/** Base para íconos de línea (24×24, trazo redondeado), toman el color de `currentColor`. */
function StrokeIcon({ className = 'icon', children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const CART_PATHS = (
  <>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </>
)

export function CartIcon({ className = 'cart-icon' }: IconProps) {
  return <StrokeIcon className={className}>{CART_PATHS}</StrokeIcon>
}

export function CartPlusIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      {CART_PATHS}
      <path d="M13.5 7.5v5M11 10h5" />
    </StrokeIcon>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </StrokeIcon>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
    </StrokeIcon>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <path d="M12 5v14M5 12h14" />
    </StrokeIcon>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </StrokeIcon>
  )
}

/** Caja de regalo con lazo. */
export function GiftIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </StrokeIcon>
  )
}

/** Bolsa de compras: enlace a la colección. */
export function BagIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </StrokeIcon>
  )
}

/** Hoja: enlace a "Nosotros". */
export function LeafIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </StrokeIcon>
  )
}

export function ExpandIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </StrokeIcon>
  )
}

/** Compartir: tres nodos unidos. */
export function ShareIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 13.3 7.6 4.4M15.8 6.3l-7.6 4.4" />
    </StrokeIcon>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <StrokeIcon className={className}>
      <path d="M5 12.5 10 17.5 19 7" />
    </StrokeIcon>
  )
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2a9.84 9.84 0 0 0-8.42 14.93L2.2 22l5.19-1.36A9.98 9.98 0 1 0 12.04 2Zm0 17.96a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.08.81.82-3-.2-.31a8.13 8.13 0 1 1 6.89 3.81Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.23-.08-.39-.12-.56.12-.16.25-.63.79-.77.95-.14.17-.29.19-.53.07-.24-.12-1.03-.38-1.96-1.21a7.37 7.37 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.41.08-.16.04-.3-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.41-.41-.56-.42h-.47a.9.9 0 0 0-.65.3c-.22.24-.85.83-.85 2.03 0 1.19.88 2.35 1 2.51.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.59.18 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}

const CHEVRON_PATHS = { left: 'M15 5l-7 7 7 7', right: 'M9 5l7 7-7 7', down: 'M5 9l7 7 7-7' }

export function ChevronIcon({ direction, className }: IconProps & { direction: keyof typeof CHEVRON_PATHS }) {
  return (
    <StrokeIcon className={className}>
      <path d={CHEVRON_PATHS[direction]} />
    </StrokeIcon>
  )
}
