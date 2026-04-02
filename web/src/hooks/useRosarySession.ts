import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type MysterySetId,
  type PersistedSession,
  type RosaryStep,
  STORAGE_KEY,
  buildSteps,
} from '../data/rosary'

function loadPersisted(): PersistedSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as PersistedSession
    if (!p || typeof p.stepIndex !== 'number') return null
    return p
  } catch {
    return null
  }
}

function savePersisted(s: PersistedSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* ignore quota */
  }
}

export function useRosarySession() {
  const initial = loadPersisted()
  const [mysterySet, setMysterySet] = useState<MysterySetId | null>(
    initial?.mysterySet ?? null,
  )
  const [stepIndex, setStepIndex] = useState(initial?.stepIndex ?? 0)
  const [hailMaryIndex, setHailMaryIndex] = useState(initial?.hailMaryIndex ?? 0)

  const steps: RosaryStep[] = useMemo(
    () => (mysterySet ? buildSteps(mysterySet) : []),
    [mysterySet],
  )

  const totalSteps = steps.length

  useEffect(() => {
    if (totalSteps === 0) return
    setStepIndex((i) => Math.min(Math.max(i, 0), totalSteps))
  }, [mysterySet, totalSteps])

  const prevStepIndexRef = useRef<number | null>(null)
  useEffect(() => {
    if (totalSteps === 0) return
    if (prevStepIndexRef.current === null) {
      prevStepIndexRef.current = stepIndex
      return
    }
    if (prevStepIndexRef.current === stepIndex) return
    prevStepIndexRef.current = stepIndex
    const s = steps[stepIndex]
    if (s?.kind === 'hail_mary_repeat') setHailMaryIndex(0)
  }, [stepIndex, steps, totalSteps])

  const step = steps[stepIndex]
  const isHailMaryRepeat = step?.kind === 'hail_mary_repeat'
  const isComplete = mysterySet !== null && totalSteps > 0 && stepIndex >= totalSteps

  useEffect(() => {
    if (!mysterySet || totalSteps === 0) return
    savePersisted({
      mysterySet,
      stepIndex: Math.min(Math.max(stepIndex, 0), totalSteps),
      hailMaryIndex: isHailMaryRepeat ? hailMaryIndex : 0,
    })
  }, [mysterySet, stepIndex, hailMaryIndex, totalSteps, isHailMaryRepeat])

  const selectMystery = useCallback((id: MysterySetId) => {
    setMysterySet(id)
    setStepIndex(0)
    setHailMaryIndex(0)
    savePersisted({ mysterySet: id, stepIndex: 0, hailMaryIndex: 0 })
  }, [])

  const resetSession = useCallback(() => {
    setMysterySet(null)
    setStepIndex(0)
    setHailMaryIndex(0)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const restartSameMystery = useCallback(() => {
    if (!mysterySet) return
    setStepIndex(0)
    setHailMaryIndex(0)
    savePersisted({ mysterySet, stepIndex: 0, hailMaryIndex: 0 })
  }, [mysterySet])

  const goNext = useCallback(() => {
    if (!step || totalSteps === 0) return
    if (step.kind === 'hail_mary_repeat') {
      if (hailMaryIndex < 9) {
        setHailMaryIndex((h) => h + 1)
        return
      }
      setHailMaryIndex(0)
    }
    setStepIndex((i) => Math.min(i + 1, totalSteps))
  }, [step, hailMaryIndex, totalSteps])

  const goPrev = useCallback(() => {
    if (!step || totalSteps === 0) return
    if (step.kind === 'hail_mary_repeat' && hailMaryIndex > 0) {
      setHailMaryIndex((h) => h - 1)
      return
    }
    if (step.kind === 'hail_mary_repeat' && hailMaryIndex === 0) {
      setStepIndex((i) => Math.max(i - 1, 0))
      return
    }
    setStepIndex((i) => Math.max(i - 1, 0))
    setHailMaryIndex(0)
  }, [step, hailMaryIndex, totalSteps])

  const canGoNext = Boolean(step && !isComplete)
  const canGoPrev =
    Boolean(step) &&
    (stepIndex > 0 || (isHailMaryRepeat && hailMaryIndex > 0))

  return {
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
  }
}
