import { useEffect, useMemo } from 'react'
import { MYSTERY_SETS, openingStepCount } from './data/rosary'
import { useRosarySession } from './hooks/useRosarySession'
import { computeIntroProgress, computeRingProgress } from './utils/rosaryProgress'
import { BeadProgress } from './components/BeadProgress'
import { MysteryPicker } from './components/MysteryPicker'
import { PrayerCard } from './components/PrayerCard'
import { RosaryLayout } from './components/RosaryLayout'
import { RosaryRing } from './components/RosaryRing'
import { DecorativeOrnament } from './components/DecorativeOrnament'

function App() {
  const {
    mysterySet,
    selectMystery,
    resetSession,
    restartSameMystery,
    steps,
    step,
    stepIndex,
    totalSteps,
    hailMaryIndex,
    isHailMaryRepeat,
    isComplete,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
  } = useRosarySession()

  const openingCount = useMemo(() => openingStepCount(steps), [steps])

  const introProgress = useMemo(
    () => computeIntroProgress(steps, stepIndex, isComplete),
    [steps, stepIndex, isComplete],
  )

  const ringProgress = useMemo(
    () => computeRingProgress(steps, stepIndex, hailMaryIndex, isComplete),
    [steps, stepIndex, hailMaryIndex, isComplete],
  )

  const openingStepIndexForRing =
    stepIndex < openingCount ? stepIndex : null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (canGoNext) {
          e.preventDefault()
          goNext()
        }
      }
      if (e.key === 'ArrowLeft') {
        if (canGoPrev) {
          e.preventDefault()
          goPrev()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canGoNext, canGoPrev, goNext, goPrev])

  if (!mysterySet) {
    return (
      <RosaryLayout
        title="Rosary"
        subtitle="Pick a mystery set, then pray one bead at a time."
      >
        <div className="welcome-card">
          <DecorativeOrnament />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              margin: '0 0 0.5rem',
              color: 'var(--ing-purple)',
              fontSize: '1.35rem',
            }}
          >
            Before we start
          </h2>
          <div className="welcome-card__panel">
            <p>
              Choose the set of mysteries you’re praying today: Joyful, Sorrowful,
              Glorious, or Luminous. Your spot saves in this browser if you need a
              pause.
            </p>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              Prayers get answered; stay a minute, stay honest.
            </p>
          </div>
          <MysteryPicker selected={null} onSelect={selectMystery} />
        </div>
      </RosaryLayout>
    )
  }

  if (isComplete || !step) {
    return (
      <>
        <RosaryRing
          introProgress={1}
          ringProgress={1}
          openingStepIndex={null}
          centerLabel={MYSTERY_SETS[mysterySet].shortLabel}
        />
        <RosaryLayout
          title="Rosary"
          subtitle={MYSTERY_SETS[mysterySet].title}
        >
        <div className="complete-card">
          <DecorativeOrnament />
          <h2>Finished</h2>
          <p>You made it through. Quiet time counts.</p>
          <div className="btn-row btn-row--compact">
            <button type="button" className="btn btn--sm btn--accent-green" onClick={restartSameMystery}>
              Pray again
            </button>
            <button type="button" className="btn btn--sm btn--secondary" onClick={resetSession}>
              Change mystery set
            </button>
          </div>
        </div>
        </RosaryLayout>
      </>
    )
  }

  const displayStepNumber = stepIndex + 1

  return (
    <>
      <RosaryRing
        introProgress={introProgress}
        ringProgress={ringProgress}
        openingStepIndex={openingStepIndexForRing}
        centerLabel={MYSTERY_SETS[mysterySet].shortLabel}
      />
      <RosaryLayout
        className="rosary-layout--prayer-session"
        title="Rosary"
        subtitle={MYSTERY_SETS[mysterySet].title}
      >
        <div className="rosary-layout__session">
          <div className="rosary-layout__center">
            <PrayerCard
              step={step}
              stepNumber={displayStepNumber}
              totalSteps={totalSteps}
              hailMaryIndex={isHailMaryRepeat ? hailMaryIndex : undefined}
            >
              {isHailMaryRepeat ? (
                <BeadProgress current={hailMaryIndex} total={10} label="Hail Mary beads" />
              ) : null}
            </PrayerCard>
          </div>
        </div>
      </RosaryLayout>

      <div className="rosary-controls-dock" role="region" aria-label="Prayer navigation">
        <div className="rosary-controls-dock__inner">
          <div className="btn-row btn-row--compact">
            <button type="button" className="btn btn--sm btn--secondary" onClick={goPrev} disabled={!canGoPrev}>
              Back
            </button>
            <button
              type="button"
              className="btn btn--sm btn--accent-purple"
              onClick={goNext}
              disabled={!canGoNext}
            >
              {isHailMaryRepeat && hailMaryIndex < 9 ? 'Next bead' : 'Next'}
            </button>
          </div>

          <p className="kbd-hint kbd-hint--compact">
            <kbd>Space</kbd> or <kbd>→</kbd> next · <kbd>←</kbd> back
          </p>

          <div className="btn-row btn-row--compact">
            <button type="button" className="btn btn--sm btn--ghost" onClick={resetSession}>
              Start over
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
