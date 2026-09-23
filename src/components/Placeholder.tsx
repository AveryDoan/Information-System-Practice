interface PlaceholderProps {
  screenNumber: string
  title: string
  phase: string
}

/**
 * Stand-in for screens not yet built. Keeps every route in the Figma file
 * navigable end-to-end while the remaining build phases are implemented.
 */
export function Placeholder({ screenNumber, title, phase }: PlaceholderProps) {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center gap-2 px-8 pt-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-rust">{screenNumber}</p>
      <h1 className="heading text-2xl text-ink">{title}</h1>
      <p className="text-sm text-muted">Coming in {phase}.</p>
    </div>
  )
}
