export function SelectPill({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-colors ${
        selected ? 'border-teal bg-teal text-white' : 'border-border-card bg-white text-ink'
      }`}
    >
      {label}
    </button>
  )
}
