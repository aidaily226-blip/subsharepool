export const SITE_NAME = 'SubSharePool'
export const SITE_URL = 'https://subsharepool.com'
export const SITE_DESCRIPTION = 'Split subscription costs, share trips, discover creators and connect with your community.'

export const SUB_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'streaming', label: '🎬 Streaming' },
  { value: 'ai', label: '🤖 AI Tools' },
  { value: 'design', label: '🎨 Design' },
  { value: 'hosting', label: '🌐 Hosting' },
  { value: 'vpn', label: '🔒 VPN' },
  { value: 'saas', label: '📦 SaaS' },
  { value: 'music', label: '🎵 Music' },
]

export const TRIP_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'carpool', label: '🚗 Carpool' },
  { value: 'hotel', label: '🏨 Hotel' },
  { value: 'flight', label: '✈️ Flight' },
  { value: 'buddy', label: '🧳 Travel Buddy' },
]

export const LINK_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'youtube', label: '🎥 YouTube' },
  { value: 'instagram', label: '📸 Instagram' },
  { value: 'portfolio', label: '💼 Portfolio' },
  { value: 'collab', label: '🤝 Collab' },
  { value: 'referral', label: '🔗 Referral' },
  { value: 'affiliate', label: '💰 Affiliate' },
]

export const FEED_TAGS = [
  { value: 'all', label: 'All' },
  { value: 'deal', label: '🔥 Hot Deals' },
  { value: 'idea', label: '💡 Ideas' },
  { value: 'question', label: '❓ Questions' },
  { value: 'collab', label: '🤝 Collabs' },
]

export const TRIP_TYPE_STYLES: Record<string, string> = {
  carpool: 'bg-amber-50 text-amber-700',
  hotel: 'bg-blue-50 text-blue-700',
  flight: 'bg-purple-50 text-purple-700',
  buddy: 'bg-emerald-50 text-emerald-700',
}

export const FEED_TAG_STYLES: Record<string, string> = {
  deal: 'bg-emerald-50 text-emerald-700',
  idea: 'bg-purple-50 text-purple-700',
  question: 'bg-amber-50 text-amber-700',
  collab: 'bg-blue-50 text-blue-700',
}

export const LINK_TYPE_STYLES: Record<string, string> = {
  youtube: 'bg-red-50 text-red-700',
  instagram: 'bg-pink-50 text-pink-700',
  portfolio: 'bg-purple-50 text-purple-700',
  referral: 'bg-amber-50 text-amber-700',
  collab: 'bg-emerald-50 text-emerald-700',
  affiliate: 'bg-green-50 text-green-700',
}
