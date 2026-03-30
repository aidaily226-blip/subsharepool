import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-base font-bold text-gray-900 mb-3">
              Sub<span className="text-brand">Share</span>Pool
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Share anything. Save everything.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Explore</p>
            <div className="flex flex-col gap-2">
              <Link href="/?tab=subs" className="text-xs text-gray-400 hover:text-gray-600">Subscriptions</Link>
              <Link href="/?tab=trips" className="text-xs text-gray-400 hover:text-gray-600">Trip Sharing</Link>
              <Link href="/?tab=links" className="text-xs text-gray-400 hover:text-gray-600">Social & Links</Link>
              <Link href="/?tab=feed" className="text-xs text-gray-400 hover:text-gray-600">Community Feed</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Company</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog" className="text-xs text-gray-400 hover:text-gray-600">Blog</Link>
              <Link href="/about" className="text-xs text-gray-400 hover:text-gray-600">About</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Legal</p>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© 2024 SubSharePool. All rights reserved.</p>
          <p className="text-xs text-gray-400">Made with ❤️ for the sharing community</p>
        </div>
      </div>
    </footer>
  )
}
