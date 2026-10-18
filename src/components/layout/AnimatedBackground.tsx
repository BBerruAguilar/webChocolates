import type { CSSProperties } from 'react'
import { CacaoShape } from '@/components/decor/CacaoShape'
import { backgroundShapes } from '@/data/backgroundShapes'
import './AnimatedBackground.css'

/** Fondo fijo que cambia de tono despacio mientras flotan hojas, mazorcas y granos. */
export function AnimatedBackground() {
  return (
    <div className="site-bg" aria-hidden="true">
      <div className="site-bg-layer site-bg-b" />
      <div className="site-bg-layer site-bg-c" />
      <div className="site-bg-glow" />
      {backgroundShapes.map((shape, index) => (
        <CacaoShape
          key={index}
          type={shape.type}
          className={`site-bg-shape ${shape.type}${shape.hideOnMobile ? ' hide-mobile' : ''}`}
          style={{
            left: shape.left,
            top: shape.top,
            width: shape.width,
            '--dx': shape.dx,
            '--dy': shape.dy,
            '--r0': shape.r0,
            '--r1': shape.r1,
            animationDuration: shape.duration,
            animationDelay: shape.delay,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}
