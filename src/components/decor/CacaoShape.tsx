import type { CSSProperties } from 'react'
import type { CacaoShapeType } from '@/data/backgroundShapes'

type CacaoShapeProps = {
  type: CacaoShapeType
  className?: string
  style?: CSSProperties
}

/** Hoja, mazorca o grano de cacao en SVG. Toma el color de `currentColor`. */
export function CacaoShape({ type, className, style }: CacaoShapeProps) {
  if (type === 'leaf') {
    return (
      <svg className={className} style={style} viewBox="-50 -100 100 200" aria-hidden="true">
        <path d="M0 -92 C 42 -52 42 52 0 92 C -42 52 -42 -52 0 -92 Z" fill="currentColor" />
        <path d="M0 -80 L0 84 M0 -40 L18 -58 M0 -10 L24 -30 M0 22 L22 4 M0 -40 L-18 -58 M0 -10 L-24 -30 M0 22 L-22 4" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'pod') {
    return (
      <svg className={className} style={style} viewBox="-50 -105 100 210" aria-hidden="true">
        <path d="M0 -98 C 34 -72 46 -10 31 50 C 23 80 8 96 0 102 C -8 96 -23 80 -31 50 C -46 -10 -34 -72 0 -98 Z" fill="currentColor" />
        <path d="M0 -92 C 11 -30 11 40 0 96 M-19 -72 C -28 -10 -22 50 -11 86 M19 -72 C 28 -10 22 50 11 86" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className={className} style={style} viewBox="-40 -60 80 120" aria-hidden="true">
      <ellipse cx="0" cy="0" rx="30" ry="48" fill="currentColor" />
      <path d="M-6 -40 C 9 -14 9 14 -6 40" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
