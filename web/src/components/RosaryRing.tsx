import { useMemo } from 'react'
import {
  SIMPLE_CROSS_HEIGHT,
  SIMPLE_CROSS_ORIGIN_X,
  SIMPLE_CROSS_ORIGIN_Y,
  SIMPLE_CROSS_PATH_24,
  SIMPLE_CROSS_TARGET_H,
} from './crucifixSimpleCross'
import {
  RING_BEAD_COUNT,
  RING_VIEW,
  getIntroTailStations,
  introTailChainPathD,
  pointAtArcLength,
  ringPathTotalLength,
  roundedRectChainPathD,
} from './rosaryRingGeometry'
import './RosaryRing.css'

const crucifixScale = SIMPLE_CROSS_TARGET_H / SIMPLE_CROSS_HEIGHT

type Props = {
  introProgress: number
  ringProgress: number
  /** 0..7 during opening, null after */
  openingStepIndex: number | null
  centerLabel?: string
}

export function RosaryRing({
  introProgress,
  ringProgress,
  openingStepIndex,
  centerLabel,
}: Props) {
  const ip = Math.min(1, Math.max(0, introProgress))
  const rp = Math.min(1, Math.max(0, ringProgress))
  const totalLen = ringPathTotalLength()

  const introStations = useMemo(() => getIntroTailStations(), [])

  const ringBeads = useMemo(() => {
    const litBoundary = rp * RING_BEAD_COUNT
    return Array.from({ length: RING_BEAD_COUNT }, (_, i) => {
      const s = (i / RING_BEAD_COUNT) * totalLen
      const pos = pointAtArcLength(s)
      const lit = i < Math.floor(litBoundary)
      const current =
        openingStepIndex === null &&
        rp < 1 &&
        i === Math.floor(litBoundary)
      return { ...pos, lit, current, i }
    })
  }, [rp, totalLen, openingStepIndex])

  const medalText = centerLabel ? centerLabel.slice(0, 3).toUpperCase() : '✦'
  const { vbW, vbH, cx, cy } = RING_VIEW

  const introLit = (idx: number) => {
    if (openingStepIndex === null) return true
    return idx < openingStepIndex
  }

  const introCurrent = (idx: number) => {
    return openingStepIndex !== null && openingStepIndex === idx
  }

  return (
    <div className="rosary-ring" aria-hidden="true">
      <svg
        className="rosary-ring__svg"
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="rosary-bead-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3cac" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <linearGradient id="rosary-crucifix-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <title>Rosary progress</title>

        <path className="rosary-ring__chain" d={roundedRectChainPathD()} fill="none" />
        <path
          className="rosary-ring__chain rosary-ring__chain--tail"
          d={introTailChainPathD()}
          fill="none"
          style={{ opacity: 0.4 + 0.6 * ip }}
        />

        <circle cx={cx} cy={cy} r={9} className="rosary-ring__medal" />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          className="rosary-ring__medal-text"
        >
          {medalText}
        </text>

        {ringBeads.map((s) => (
          <circle
            key={`ring-${s.i}`}
            cx={s.x}
            cy={s.y}
            r={s.current ? 2.1 : 1.55}
            className={`rosary-ring__bead${s.lit ? ' rosary-ring__bead--lit' : ''}${s.current ? ' rosary-ring__bead--current' : ''}${openingStepIndex !== null && !s.lit ? ' rosary-ring__bead--pending' : ''}`}
            fill={s.lit ? 'url(#rosary-bead-gradient)' : undefined}
          />
        ))}

        {introStations.map((st) => {
          const lit = introLit(st.index)
          const cur = introCurrent(st.index)
          if (st.kind === 'crucifix') {
            return (
              <g
                key="intro-crucifix"
                className="rosary-ring__intro-crucifix"
                transform={`translate(${st.x}, ${st.y + 3})`}
              >
                {cur ? <circle r={7} className="rosary-ring__pulse" /> : null}
                <g
                  transform={`scale(${crucifixScale}) translate(${-SIMPLE_CROSS_ORIGIN_X}, ${-SIMPLE_CROSS_ORIGIN_Y})`}
                >
                  <path
                    d={SIMPLE_CROSS_PATH_24}
                    className="rosary-ring__crucifix-path"
                    fill={lit ? 'url(#rosary-crucifix-gradient)' : undefined}
                  />
                </g>
              </g>
            )
          }
          return (
            <circle
              key={`intro-bead-${st.index}`}
              cx={st.x}
              cy={st.y}
              r={cur ? 2.1 : 1.55}
              className={`rosary-ring__bead${lit ? ' rosary-ring__bead--lit' : ''}${cur ? ' rosary-ring__bead--current' : ''}`}
              fill={lit ? 'url(#rosary-bead-gradient)' : undefined}
            />
          )
        })}
      </svg>
    </div>
  )
}
