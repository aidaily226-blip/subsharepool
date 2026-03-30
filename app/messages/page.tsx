import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Messages' }

const MOCK_CONVOS = [
  { id: 'u1', name: 'Aryan Kapoor', initials: 'AK', lastMsg: 'Hey, is the Netflix slot still available?', time: '2m ago', unread: 2 },
  { id: 'u2', name: 'Sanya Mehta', initials: 'SM', lastMsg: 'Sure! I can add you to the plan tonight.', time: '1h ago', unread: 0 },
  { id: 'u3', name: 'Rohan Verma', initials: 'RV', lastMsg: 'What payment method do you prefer?', time: '3h ago', unread: 1 },
]

export default function MessagesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {MOCK_CONVOS.map((convo, i) => (
          <div key={convo.id} className={`flex items-center gap-3 px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${i < MOCK_CONVOS.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-brand-light text-brand-dark text-sm font-medium flex items-center justify-center shrink-0">{convo.initials}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-medium text-gray-900">{convo.name}</span>
                <span className="text-xs text-gray-400">{convo.time}</span>
              </div>
              <p className="text-xs text-gray-400 truncate">{convo.lastMsg}</p>
            </div>
            {convo.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center shrink-0">{convo.unread}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
