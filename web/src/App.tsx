import { useEffect } from 'react'
import { MYSTERY_SETS } from './data/rosary'
import { useRosarySession } from './hooks/useRosarySession'
import { BeadProgress } from './components/BeadProgress'
import { MysteryPicker } from './components/MysteryPicker'
import { PrayerCard } from './components/PrayerCard'
import { RosaryLayout } from './components/RosaryLayout'
import { DecorativeOrnament } from './components/DecorativeOrnament'

function App() {
  const {
    mysterySet,
    selectMystery,
    resetSession,
    restartSameMystery,
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
              Choose the set of mysteries you’re praying today — Joyful, Sorrowful,
              Glorious, or Luminous. Your spot saves in this browser if you need a
              pause.
            </p>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              Prayers get answered — stay a minute, stay honest.
            </p>
          </div>
          <MysteryPicker selected={null} onSelect={selectMystery} />
        </div>
      </RosaryLayout>
    )
  }

  if (isComplete || !step) {
    return (
      <RosaryLayout
        title="Rosary"
        subtitle={MYSTERY_SETS[mysterySet].title}
      >
        <div className="complete-card">
          <DecorativeOrnament />
          <h2>Finished</h2>
          <p>You made it through — quiet time counts.</p>
          <div className="btn-row">
            <button type="button" className="btn btn--accent-green" onClick={restartSameMystery}>
              Pray again
            </button>
            <button type="button" className="btn btn--secondary" onClick={resetSession}>
              Change mystery set
            </button>
          </div>
        </div>
      </RosaryLayout>
    )
  }

  const displayStepNumber = stepIndex + 1

  return (
    <RosaryLayout
      title="Rosary"
      subtitle={MYSTERY_SETS[mysterySet].title}
    >
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

      <div className="btn-row">
        <button type="button" className="btn btn--secondary" onClick={goPrev} disabled={!canGoPrev}>
          Back
        </button>
        <button
          type="button"
          className="btn btn--accent-purple"
          onClick={goNext}
          disabled={!canGoNext}
        >
          {isHailMaryRepeat && hailMaryIndex < 9 ? 'Next bead' : 'Next'}
        </button>
      </div>

      <p className="kbd-hint">
        <kbd>Space</kbd> or <kbd>→</kbd> next · <kbd>←</kbd> back
      </p>

      <div className="btn-row" style={{ marginTop: '0.5rem' }}>
        <button type="button" className="btn btn--ghost" onClick={resetSession}>
          Start over
        </button>
      </div>
    </RosaryLayout>
  )
}

export default App
