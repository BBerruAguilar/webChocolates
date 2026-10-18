import { useState } from 'react'
import { CloseIcon } from '@/components/icons/Icons'
import {
  CascarillaIllustration,
  ChocolateBarIllustration,
  GrageasIllustration,
  PowderIllustration,
} from '@/components/illustrations/CacaoIllustrations'
import { getUnwrappedImage } from '@/data/families'
import { useModalBehavior } from '@/hooks/useModalBehavior'
import type { FamilyContents, ProductFamily } from '@/types/product'
import './UnwrapViewer.css'

const CONTENT_ILLUSTRATIONS: Record<FamilyContents, typeof ChocolateBarIllustration> = {
  tableta: ChocolateBarIllustration,
  grageas: GrageasIllustration,
  polvo: PowderIllustration,
  cascarilla: CascarillaIllustration,
}

type UnwrapViewerProps = {
  family: ProductFamily | null
  onClose: () => void
}

/**
 * "Desenvolver el chocolate": el empaque se parte en dos y se abre como un par de solapas,
 * dejando ver lo que hay dentro. Se toca otra vez para cerrarlo.
 */
export function UnwrapViewer({ family, onClose }: UnwrapViewerProps) {
  useModalBehavior(family !== null, onClose)
  if (!family) return null
  return <UnwrapDialog key={family.id} family={family} onClose={onClose} />
}

function UnwrapDialog({ family, onClose }: { family: ProductFamily; onClose: () => void }) {
  const [opened, setOpened] = useState(false)
  const unwrapped = getUnwrappedImage(family)
  const Illustration = CONTENT_ILLUSTRATIONS[family.contents]

  return (
    <div className="unwrap" role="dialog" aria-modal="true" aria-label={`Abrir empaque de ${family.name}`} onClick={onClose}>
      <div className="unwrap-content" onClick={event => event.stopPropagation()}>
        <button type="button" className="unwrap-close" onClick={onClose} aria-label="Cerrar" title="Cerrar" autoFocus>
          <CloseIcon className="icon" />
        </button>

        <button
          type="button"
          className={`unwrap-stage${opened ? ' is-open' : ''}`}
          onClick={() => setOpened(value => !value)}
          aria-pressed={opened}
          aria-label={opened ? 'Cerrar el empaque' : 'Abrir el empaque'}
        >
          <span className="unwrap-inside">
            {unwrapped ? <img src={unwrapped} alt="" /> : <Illustration className="unwrap-illustration" />}
          </span>
          {/* El empaque es la misma imagen recortada en dos mitades que giran hacia afuera. */}
          <span className="unwrap-wrapper" aria-hidden="true">
            <img className="unwrap-half is-left" src={family.image} alt="" draggable={false} />
            <img className="unwrap-half is-right" src={family.image} alt="" draggable={false} />
          </span>
        </button>

        <div className="unwrap-caption">
          <h2>{family.name}</h2>
          <p>{opened ? family.summary : 'Toca el empaque para abrirlo'}</p>
        </div>
      </div>
    </div>
  )
}
