import type { ReactNode } from 'react'
import type { RosaryStep } from '../data/rosary'
import { DecorativeOrnament } from './DecorativeOrnament'
import './PrayerCard.css'

type Props = {
  step: RosaryStep
  stepNumber: number
  totalSteps: number
  hailMaryIndex?: number
  children?: ReactNode
  /** Only prayer text in the ring; step/title hidden (still in aria-label). */
  variant?: 'default' | 'minimal'
}

export function PrayerCard({
  step,
  stepNumber,
  totalSteps,
  hailMaryIndex,
  children,
  variant = 'default',
}: Props) {
  const ariaLabel = `Step ${stepNumber} of ${totalSteps}: ${step.label}`

  if (variant === 'minimal') {
    return (
      <article className="prayer-card prayer-card--minimal" aria-label={ariaLabel}>
        <div className="prayer-card__body prayer-card__body--minimal">
          <pre className="prayer-card__text prayer-card__text--minimal">{step.text}</pre>
          {step.kind === 'hail_mary_repeat' && hailMaryIndex !== undefined ? (
            <p className="prayer-card__hint prayer-card__hint--minimal" aria-live="polite">
              Say this Hail Mary for bead {hailMaryIndex + 1} of 10.
            </p>
          ) : null}
          {children}
        </div>
      </article>
    )
  }

  return (
    <article className="prayer-card">
      <header className="prayer-card__chrome">
        <DecorativeOrnament subtle />
        <p className="prayer-card__step-count">
          Step {stepNumber} of {totalSteps}
        </p>
        <h2 className="prayer-card__title">{step.label}</h2>
        {step.encouragement ? (
          <p className="prayer-card__encouragement">{step.encouragement}</p>
        ) : null}
      </header>
      <div className="prayer-card__body">
        <pre className="prayer-card__text">{step.text}</pre>
        {step.kind === 'hail_mary_repeat' && hailMaryIndex !== undefined ? (
          <p className="prayer-card__hint" aria-live="polite">
            Say this Hail Mary for bead {hailMaryIndex + 1} of 10.
          </p>
        ) : null}
        {children}
      </div>
    </article>
  )
}
