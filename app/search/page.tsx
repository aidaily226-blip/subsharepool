'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Result {
  id: string
  type: 'subscription' | 'trip' | 'link' | 'feed'
  title: string
  subtitle: string
  badge: string
  userId?: string
}

function SearchResults() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (q) fetchResults()
  }, [q])

  const fetchResults = async () => {
    setLoading(true)
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setResults(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Search results</h1>
      <p className="text-sm text-gray-400 mb-6">Showing results for "{q}"</p>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-16" />)}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No results found for "{q}"</p>
          <p className="text-sm mt-1">Try different keywords</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map(result => (
            <div key={`${result.type}-${result.id}`} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {result.type === 'subscription' ? '📦' : result.type === 'trip' ? '✈️' : result.type === 'link' ? '🔗' : '💬'}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">{result.title}</h3>
                    <p className="text-xs text-gray-400">{result.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-brand text-xs">{result.badge}</span>
                  {result.userId && (
                    <button
                      onClick={() => window.location.href = `/messages?userId=${result.userId}`}
                      className="btn-outline text-xs py-1 px-2"
                    >
                      💬
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}