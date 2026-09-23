import { Link } from 'react-router-dom'

export function SectionHeader({ title, to }: { title: string; to?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="heading text-lg text-ink">{title}</h2>
      {to && (
        <Link to={to} className="text-xs font-semibold text-rust">
          See all
        </Link>
      )}
    </div>
  )
}
