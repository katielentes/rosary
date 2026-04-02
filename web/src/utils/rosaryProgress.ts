import { openingStepCount, type RosaryStep } from '../data/rosary'

export function stepWeight(s: RosaryStep | undefined): number {
  if (!s) return 0
  return s.kind === 'hail_mary_repeat' ? 10 : 1
}

export function totalWeightedUnits(steps: RosaryStep[]): number {
  return steps.reduce((sum, s) => sum + stepWeight(s), 0)
}

/** 0–1 through opening steps only (each step weight 1). */
export function computeIntroProgress(
  steps: RosaryStep[],
  stepIndex: number,
  isComplete: boolean,
): number {
  if (steps.length === 0) return 1
  const n = openingStepCount(steps)
  if (n === 0) return 1
  if (isComplete) return 1
  if (stepIndex >= n) return 1
  return Math.min(1, (stepIndex + 1) / n)
}

/** 0–1 through main loop only (weighted; Hail Mary decade = 10). Returns 0 during opening. */
export function computeRingProgress(
  steps: RosaryStep[],
  stepIndex: number,
  hailMaryIndex: number,
  isComplete: boolean,
): number {
  if (steps.length === 0) return 1
  const n = openingStepCount(steps)
  const ringSteps = steps.slice(n)
  if (ringSteps.length === 0) return 1
  const totalRing = totalWeightedUnits(ringSteps)
  if (totalRing <= 0) return 1
  if (isComplete) return 1
  if (stepIndex < n) return 0

  let u = 0
  for (let i = n; i < stepIndex; i++) {
    u += stepWeight(steps[i])
  }
  const cur = steps[stepIndex]
  if (!cur) return 1
  if (cur.kind === 'hail_mary_repeat') {
    u += hailMaryIndex + 1
  } else {
    u += 1
  }
  return Math.min(1, u / totalRing)
}

/**
 * Legacy: overall session progress (intro + ring, weighted).
 * Kept for diagnostics or future UI.
 */
export function computeRosaryProgress(
  steps: RosaryStep[],
  stepIndex: number,
  hailMaryIndex: number,
  isComplete: boolean,
): number {
  if (steps.length === 0) return 0
  if (isComplete) return 1
  const total = totalWeightedUnits(steps)
  if (total <= 0) return 0

  let u = 0
  for (let i = 0; i < stepIndex; i++) {
    u += stepWeight(steps[i])
  }
  const cur = steps[stepIndex]
  if (!cur) return 1
  if (cur.kind === 'hail_mary_repeat') {
    u += hailMaryIndex + 1
  } else {
    u += 1
  }
  return Math.min(1, u / total)
}
