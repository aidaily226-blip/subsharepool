interface HeroProps {
  title: string
  description: string
  stats: { value: string; label: string }[]
  primaryBtn: string
  secondaryBtn: string
  onPrimary?: () => void
  onSecondary?: () => void
}

export default function Hero({ title, description, stats, primaryBtn, secondaryBtn, onPrimary, onSecondary }: HeroProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 leading-tight">{title}</h1>
        <p className="text-sm text-gray-400 leading-relaxed max-w-md mb-4">{description}</p>
        <div className="flex flex-wrap gap-4 sm:gap-6">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-base font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex sm:flex-col gap-2 sm:min-w-[130px]">
        <button onClick={onPrimary} className="btn-primary flex-1 sm:flex-none text-center">{primaryBtn}</button>
        <button onClick={onSecondary} className="btn-outline flex-1 sm:flex-none text-center">{secondaryBtn}</button>
      </div>
    </div>
  )
}
