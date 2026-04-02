import type { ReactNode } from 'react'
import './RosaryLayout.css'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function RosaryLayout({ title, subtitle, children }: Props) {
  return (
    <div className="rosary-layout">
      <div className="rosary-layout__cloud rosary-layout__cloud--tl" aria-hidden="true" />
      <div className="rosary-layout__cloud rosary-layout__cloud--br" aria-hidden="true" />
      <div className="rosary-layout__stars" aria-hidden="true">
        <svg width="72" height="72" viewBox="0 0 72 72" className="rosary-layout__star-svg">
          <polygon
            fill="currentColor"
            points="36,4 44,26 68,26 48,40 56,62 36,48 16,62 24,40 4,26 28,26"
          />
        </svg>
      </div>
      <header className="rosary-layout__header">
        <p className="rosary-layout__eyebrow">Pray at your pace</p>
        <h1 className="rosary-layout__title">{title}</h1>
        {subtitle ? <p className="rosary-layout__subtitle">{subtitle}</p> : null}
      </header>
      <main className="rosary-layout__main">{children}</main>
    </div>
  )
}
