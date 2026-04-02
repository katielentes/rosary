import type { MysterySetId } from '../data/rosary'
import { MYSTERY_SETS } from '../data/rosary'
import './MysteryPicker.css'

type Props = {
  selected: MysterySetId | null
  onSelect: (id: MysterySetId) => void
}

const ORDER: MysterySetId[] = ['joyful', 'sorrowful', 'glorious', 'luminous']

export function MysteryPicker({ selected, onSelect }: Props) {
  return (
    <div className="mystery-picker" role="radiogroup" aria-label="Choose mystery set">
      {ORDER.map((id) => {
        const m = MYSTERY_SETS[id]
        const isSel = selected === id
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isSel}
            className={`mystery-picker__btn${isSel ? ' mystery-picker__btn--selected' : ''}`}
            onClick={() => onSelect(id)}
          >
            <span className="mystery-picker__short">{m.shortLabel}</span>
            <span className="mystery-picker__full">{m.title}</span>
          </button>
        )
      })}
    </div>
  )
}
