interface Props {
  page: number
  total: number
  limit: number
  onPage: (page: number) => void
}

export default function Pagination({ page, total, limit, onPage }: Props) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(p =>
    p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>
      <div className="flex gap-1">
        {visiblePages.map((p, i) => {
          const prev = visiblePages[i - 1]
          const showDots = prev && p - prev > 1
          return (
            <div key={p} className="flex items-center gap-1">
              {showDots && <span className="text-gray-400 text-sm px-1">...</span>}
              <button
                onClick={() => onPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-brand text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            </div>
          )
        })}
      </div>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === Math.ceil(total / limit)}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  )
}