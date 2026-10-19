// Ilustraciones planas (sin degradados) que sirven de imagen provisional mientras
// no haya fotos reales. Paleta tomada de los tonos del cacao y del empaque kraft.

type IllustrationProps = { className?: string }

export function PodIllustration({ className }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 200 300" aria-hidden="true">
      <path d="M100 18 C150 50 166 130 152 205 C142 258 118 285 100 292 C82 285 58 258 48 205 C34 130 50 50 100 18Z" fill="#d98e2b" />
      <path
        d="M100 28 C112 100 112 210 100 284 M70 52 C58 120 62 210 82 270 M130 52 C142 120 138 210 118 270"
        stroke="#b8711c"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M100 20 V4" stroke="#5c3a1e" strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

export function OpenPodIllustration({ className }: IllustrationProps) {
  const beans = [
    [100, 70], [80, 98], [120, 98], [100, 126], [80, 154], [120, 154], [100, 182], [82, 210], [118, 210], [100, 236],
  ]
  return (
    <svg className={className} viewBox="0 0 200 300" aria-hidden="true">
      <path d="M100 18 C150 50 166 130 152 205 C142 258 118 285 100 292 C82 285 58 258 48 205 C34 130 50 50 100 18Z" fill="#c27a22" />
      <path d="M100 36 C138 64 148 132 138 198 C130 246 114 268 100 274 C86 268 70 246 62 198 C52 132 62 64 100 36Z" fill="#f4ecdc" />
      {beans.map(([cx, cy]) => (
        <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="15" ry="11" fill="#e6d7bb" stroke="#cdb894" strokeWidth="2" />
      ))}
    </svg>
  )
}

/** Tonos del grano según la etapa: así un mismo dibujo cuenta el proceso. */
export const BEAN_TONES = {
  fresco: ['#eadfc8', '#cdb894'],
  fermentado: ['#9b5b4a', '#6f3b2e'],
  seco: ['#7b4a30', '#58331f'],
  tostado: ['#4a2a17', '#2e190c'],
} as const

export type BeanTone = keyof typeof BEAN_TONES

export function BeansIllustration({ className, tone }: IllustrationProps & { tone: BeanTone }) {
  const [fill, crease] = BEAN_TONES[tone]
  const beans = [
    [70, 70, -20], [125, 58, 15], [178, 80, 40], [95, 120, 30], [150, 118, -10], [62, 158, 10], [125, 165, -35], [185, 150, 20],
  ]
  return (
    <svg className={className} viewBox="0 0 240 220" aria-hidden="true">
      {beans.map(([cx, cy, angle]) => (
        <g key={`${cx}-${cy}`} transform={`rotate(${angle} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx="30" ry="20" fill={fill} />
          <path d={`M${cx - 20} ${cy} Q${cx} ${cy - 6} ${cx + 20} ${cy}`} stroke={crease} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  )
}

export function ChocolateBarIllustration({ className }: IllustrationProps) {
  const pieces = []
  for (let row = 0; row < 6; row++) {
    for (let column = 0; column < 3; column++) {
      // La esquina superior derecha falta: la tableta ya fue "probada".
      if (row === 0 && column === 2) continue
      pieces.push(<rect key={`${row}-${column}`} x={22 + column * 54} y={22 + row * 52} width="46" height="44" rx="4" fill="#5c3520" />)
    }
  }
  return (
    <svg className={className} viewBox="0 0 200 340" aria-hidden="true">
      <path d="M14 14 H130 V70 H186 V326 H14Z" fill="#43261a" />
      {pieces}
    </svg>
  )
}

export function GrageasIllustration({ className }: IllustrationProps) {
  const grageas = [
    [60, 70, 20], [110, 55, -15], [160, 75, 35], [80, 115, -30], [135, 112, 10], [55, 158, 5], [105, 160, 40], [158, 155, -20],
  ]
  return (
    <svg className={className} viewBox="0 0 220 210" aria-hidden="true">
      {grageas.map(([cx, cy, angle]) => (
        <g key={`${cx}-${cy}`} transform={`rotate(${angle} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx="26" ry="19" fill="#3d2314" />
          <ellipse cx={cx - 8} cy={cy - 7} rx="7" ry="4" fill="#5a3826" />
        </g>
      ))}
    </svg>
  )
}

export function PowderIllustration({ className }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 240 180" aria-hidden="true">
      <path d="M20 160 C60 150 80 60 120 40 C160 60 180 150 220 160Z" fill="#7a4a2c" />
      <path d="M95 75 C108 62 132 62 145 75" stroke="#8f5a37" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="120" cy="164" rx="104" ry="10" fill="#6a3f25" />
    </svg>
  )
}

export function CascarillaIllustration({ className }: IllustrationProps) {
  const flakes = [
    'M40 90 l30 -18 l22 14 l-14 26z', 'M98 60 l34 -6 l10 26 l-30 10z', 'M150 88 l30 -10 l12 30 l-34 6z',
    'M60 140 l28 -12 l18 22 l-30 12z', 'M118 120 l32 -4 l6 28 l-32 4z', 'M168 140 l26 -14 l14 24 l-28 10z',
  ]
  return (
    <svg className={className} viewBox="0 0 230 200" aria-hidden="true">
      {flakes.map((d, index) => (
        <path key={d} d={d} fill={index % 2 === 0 ? '#6b4226' : '#8a5a36'} />
      ))}
    </svg>
  )
}
