import './BeadProgress.css'

type Props = {
  current: number
  total: number
  label?: string
}

export function BeadProgress({ current, total, label }: Props) {
  const safeTotal = Math.max(1, total)
  const idx = Math.min(Math.max(current, 0), safeTotal - 1)

  return (
    <div className="bead-progress" role="group" aria-label={label ?? 'Decade progress'}>
      <div className="bead-progress__track">
        {Array.from({ length: safeTotal }, (_, i) => (
          <span
            key={i}
            className={`bead-progress__bead${i <= idx ? ' bead-progress__bead--done' : ''}${i === idx ? ' bead-progress__bead--active' : ''}`}
          />
        ))}
      </div>
      <p className="bead-progress__caption">
        Hail Mary <strong>{idx + 1}</strong> of {safeTotal}
      </p>
    </div>
  )
}
