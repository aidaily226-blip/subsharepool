import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-brand mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/blog" className="btn-outline">
            Read Blog
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Subscriptions', href: '/?tab=subs', icon: '📦' },
            { label: 'Trip Sharing', href: '/?tab=trips', icon: '✈️' },
            { label: 'Social Links', href: '/?tab=links', icon: '🔗' },
            { label: 'Community', href: '/?tab=feed', icon: '💬' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-gray-100 rounded-xl p-3 text-center hover:border-brand transition-colors"
            >
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className="text-xs text-gray-600">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}