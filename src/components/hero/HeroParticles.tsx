import type { CSSProperties } from 'react'
import { CacaoShape } from '@/components/decor/CacaoShape'
import { heroParticles } from '@/data/backgroundShapes'

/** Granos y hojas a distintas profundidades: los cercanos se ven grandes y desenfocados. */
export function HeroParticles() {
  return (
    <div className="hero-particles" aria-hidden="true">
      {heroParticles.map((particle, index) => (
        <span
          key={index}
          className="hero-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.width,
            // Las partículas "cercanas" pasan por delante del anillo de óvalos.
            zIndex: particle.depth > 1 ? 3 : 0,
            '--depth': particle.depth,
            '--blur': `${Math.max(0, particle.depth - 1) * 6}px`,
          } as CSSProperties}
        >
          <CacaoShape
            type={particle.type}
            className="hero-particle-shape"
            style={{
              '--rotate': particle.rotate,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
            } as CSSProperties}
          />
        </span>
      ))}
    </div>
  )
}
