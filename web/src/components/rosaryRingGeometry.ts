/**
 * Main loop: rounded rect of beads only (no crucifix on loop).
 * Intro tail: crucifix + 7 beads on the right, vertically centered, disconnected from loop.
 */

export const RING_BEAD_COUNT = 59
export const INTRO_STATION_COUNT = 8

/** Wider than loop (0–116) so intro tail fits on the right */
const VB_W = 128
const VB_H = 118

/** Horizontal inset from viewBox edge; smaller ⇒ bead loop uses more width at same pixel size */
const L = 4
const R = 116
const T = 12
const B = 82
const RC = 7.5

const CX = (L + R) / 2
const CY = (T + B) / 2

const iL = L + RC
const iR = R - RC
const iT = T + RC
const iB = B - RC

/** Intro tail: vertical chain on the right; crucifix at bottom of chain (larger y) */
const TAIL_X = 122
/** Vertically centered span (midpoint = CY) */
const TAIL_SPAN = 28
const CRUCIFIX_Y = CY + TAIL_SPAN / 2
const TAIL_TOP_BEAD_Y = CY - TAIL_SPAN / 2
const TAIL_STEP = (CRUCIFIX_Y - TAIL_TOP_BEAD_Y) / 7

export const RING_VIEW = {
  vbW: VB_W,
  vbH: VB_H,
  cx: CX,
  cy: CY,
  l: L,
  r: R,
  t: T,
  b: B,
  rc: RC,
  tailX: TAIL_X,
}

type Seg =
  | {
      kind: 'line'
      x0: number
      y0: number
      x1: number
      y1: number
      len: number
    }
  | {
      kind: 'arc'
      cx: number
      cy: number
      r: number
      a0: number
      a1: number
      len: number
    }

function dist(x0: number, y0: number, x1: number, y1: number): number {
  return Math.hypot(x1 - x0, y1 - y0)
}

/**
 * Loop path order: bottom center → … → right edge (down) → … (closed).
 * Sampling adds RING_ARC_OFFSET so bead 0 is at right-edge center.
 */
function buildLoopSegments(): { segments: Seg[]; total: number } {
  const midX = (iL + iR) / 2
  const segments: Seg[] = []

  segments.push({
    kind: 'line',
    x0: midX,
    y0: B,
    x1: iL,
    y1: B,
    len: dist(midX, B, iL, B),
  })

  segments.push({
    kind: 'arc',
    cx: iL,
    cy: iB,
    r: RC,
    a0: Math.PI / 2,
    a1: Math.PI,
    len: (Math.PI / 2) * RC,
  })

  segments.push({
    kind: 'line',
    x0: L,
    y0: iB,
    x1: L,
    y1: iT,
    len: dist(L, iB, L, iT),
  })

  segments.push({
    kind: 'arc',
    cx: iL,
    cy: iT,
    r: RC,
    a0: Math.PI,
    a1: (3 * Math.PI) / 2,
    len: (Math.PI / 2) * RC,
  })

  segments.push({
    kind: 'line',
    x0: iL,
    y0: T,
    x1: iR,
    y1: T,
    len: dist(iL, T, iR, T),
  })

  segments.push({
    kind: 'arc',
    cx: iR,
    cy: iT,
    r: RC,
    a0: (3 * Math.PI) / 2,
    a1: 2 * Math.PI,
    len: (Math.PI / 2) * RC,
  })

  segments.push({
    kind: 'line',
    x0: R,
    y0: iT,
    x1: R,
    y1: iB,
    len: dist(R, iT, R, iB),
  })

  segments.push({
    kind: 'arc',
    cx: iR,
    cy: iB,
    r: RC,
    a0: 0,
    a1: Math.PI / 2,
    len: (Math.PI / 2) * RC,
  })

  segments.push({
    kind: 'line',
    x0: iR,
    y0: B,
    x1: midX,
    y1: B,
    len: dist(iR, B, midX, B),
  })

  const total = segments.reduce((s, g) => s + g.len, 0)
  return { segments, total }
}

const LOOP_CACHE = buildLoopSegments()

/**
 * Distance along the loop from the legacy origin (bottom center) to the point where
 * the decade should begin: midpoint of the right vertical edge (by the intro tail).
 */
function computeRingArcOffsetFromBottomCenter(): number {
  const rightMidY = (iT + iB) / 2
  const { segments } = LOOP_CACHE
  let acc = 0
  for (const seg of segments) {
    if (seg.kind === 'line') {
      const onRightEdge =
        Math.abs(seg.x0 - R) < 1e-6 &&
        Math.abs(seg.x1 - R) < 1e-6 &&
        Math.abs(seg.y1 - seg.y0) > 1e-6
      if (onRightEdge) {
        const yLo = Math.min(seg.y0, seg.y1)
        const yHi = Math.max(seg.y0, seg.y1)
        if (rightMidY >= yLo - 1e-6 && rightMidY <= yHi + 1e-6) {
          const t = (rightMidY - seg.y0) / (seg.y1 - seg.y0)
          return acc + t * seg.len
        }
      }
    }
    acc += seg.len
  }
  return 0
}

/** Added to arc length before walking segments so bead 0 sits at right center, not bottom center */
const RING_ARC_OFFSET = computeRingArcOffsetFromBottomCenter()

function pointOnSegment(seg: Seg, u: number): { x: number; y: number } {
  if (seg.kind === 'line') {
    const t = Math.min(1, Math.max(0, u))
    return {
      x: seg.x0 + (seg.x1 - seg.x0) * t,
      y: seg.y0 + (seg.y1 - seg.y0) * t,
    }
  }
  const t = Math.min(1, Math.max(0, u))
  const a = seg.a0 + (seg.a1 - seg.a0) * t
  return {
    x: seg.cx + seg.r * Math.cos(a),
    y: seg.cy + seg.r * Math.sin(a),
  }
}

/** Point along main loop; s=0 at right-edge center (first ring bead after intro) */
export function pointAtArcLength(s: number): { x: number; y: number } {
  const { segments, total } = LOOP_CACHE
  let distLeft = ((s + RING_ARC_OFFSET) % total + total) % total
  for (const seg of segments) {
    if (distLeft <= seg.len + 1e-9) {
      const u = seg.len > 0 ? distLeft / seg.len : 0
      return pointOnSegment(seg, u)
    }
    distLeft -= seg.len
  }
  return pointOnSegment(segments[segments.length - 1], 1)
}

export function ringPathTotalLength(): number {
  return LOOP_CACHE.total
}

export function roundedRectChainPathD(): string {
  const { l, r, t, b, rc } = RING_VIEW
  const il = l + rc
  const ir = r - rc
  const it = t + rc
  const ib = b - rc
  return [
    `M ${il} ${t}`,
    `L ${ir} ${t}`,
    `A ${rc} ${rc} 0 0 1 ${r} ${it}`,
    `L ${r} ${ib}`,
    `A ${rc} ${rc} 0 0 1 ${ir} ${b}`,
    `L ${il} ${b}`,
    `A ${rc} ${rc} 0 0 1 ${l} ${ib}`,
    `L ${l} ${it}`,
    `A ${rc} ${rc} 0 0 1 ${il} ${t}`,
    'Z',
  ].join(' ')
}

/** Dashed line along intro tail (does not touch main loop) */
export function introTailChainPathD(): string {
  return `M ${TAIL_X} ${TAIL_TOP_BEAD_Y} L ${TAIL_X} ${CRUCIFIX_Y}`
}

export type IntroStation = { x: number; y: number; kind: 'crucifix' | 'bead'; index: number }

/** index 0 = crucifix (bottom of tail); 1–7 = beads upward along the right */
export function getIntroTailStations(): IntroStation[] {
  const out: IntroStation[] = []
  out.push({ x: TAIL_X, y: CRUCIFIX_Y, kind: 'crucifix', index: 0 })
  for (let i = 1; i < INTRO_STATION_COUNT; i++) {
    const y = CRUCIFIX_Y - TAIL_STEP * i
    out.push({ x: TAIL_X, y, kind: 'bead', index: i })
  }
  return out
}
