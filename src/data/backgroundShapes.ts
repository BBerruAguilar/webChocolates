export type CacaoShapeType = 'leaf' | 'pod' | 'bean'

export type BackgroundShape = {
  type: CacaoShapeType
  left: string
  top: string
  width: number
  dx: string
  dy: string
  r0: string
  r1: string
  duration: string
  delay: string
  hideOnMobile?: boolean
}

export const backgroundShapes: BackgroundShape[] = [
  { type: 'leaf', left: '3%', top: '12%', width: 120, dx: '40px', dy: '-60px', r0: '-25deg', r1: '10deg', duration: '52s', delay: '-8s' },
  { type: 'pod', left: '88%', top: '20%', width: 110, dx: '-50px', dy: '40px', r0: '20deg', r1: '-10deg', duration: '60s', delay: '-30s' },
  { type: 'leaf', left: '10%', top: '72%', width: 150, dx: '60px', dy: '-30px', r0: '35deg', r1: '60deg', duration: '58s', delay: '-20s' },
  { type: 'bean', left: '82%', top: '70%', width: 56, dx: '-30px', dy: '-50px', r0: '15deg', r1: '-30deg', duration: '44s', delay: '-5s' },
  { type: 'leaf', left: '66%', top: '6%', width: 100, dx: '30px', dy: '50px', r0: '-50deg', r1: '-20deg', duration: '56s', delay: '-40s', hideOnMobile: true },
  { type: 'pod', left: '42%', top: '80%', width: 95, dx: '40px', dy: '-40px', r0: '-35deg', r1: '-5deg', duration: '64s', delay: '-15s', hideOnMobile: true },
  { type: 'bean', left: '24%', top: '38%', width: 48, dx: '25px', dy: '45px', r0: '40deg', r1: '70deg', duration: '48s', delay: '-26s', hideOnMobile: true },
]

/** Partículas del hero: `depth` controla cuánto se mueven con el puntero y su desenfoque. */
export type HeroParticle = {
  type: CacaoShapeType
  left: string
  top: string
  width: number
  depth: number
  rotate: string
  duration: string
  delay: string
}

export const heroParticles: HeroParticle[] = [
  { type: 'bean', left: '8%', top: '62%', width: 34, depth: 0.4, rotate: '30deg', duration: '18s', delay: '-4s' },
  { type: 'leaf', left: '18%', top: '14%', width: 58, depth: 0.6, rotate: '-40deg', duration: '22s', delay: '-9s' },
  { type: 'bean', left: '78%', top: '18%', width: 26, depth: 0.3, rotate: '-20deg', duration: '16s', delay: '-2s' },
  { type: 'pod', left: '88%', top: '58%', width: 70, depth: 0.8, rotate: '24deg', duration: '26s', delay: '-12s' },
  { type: 'bean', left: '64%', top: '80%', width: 92, depth: 1.4, rotate: '60deg', duration: '20s', delay: '-6s' },
  { type: 'leaf', left: '-2%', top: '30%', width: 150, depth: 1.8, rotate: '20deg', duration: '28s', delay: '-15s' },
]
