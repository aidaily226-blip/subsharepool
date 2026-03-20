import { Link as LinkType } from '@/lib/types'
import { LINK_TYPE_STYLES } from '@/lib/constants'
import { getInitials } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  youtube: '🎥 YouTube',
  instagram: '📸 Instagram',
  portfolio: '💼 Portfolio',
  referral: '🔗 Referral',
  collab: '🤝 Collab',
  affiliate: '💰 Affiliate',
}

const BTN_LABELS: Record<string, string> = {
  youtube: 'Visit',
  instagram: 'Visit',
  portfolio: 'Visit',
  referral: 'Get link',
  collab: 'Connect',
  affiliate: 'See deals',
}

const AVATAR_COLORS: Record<string, { bg: string; color: string }> = {
  youtube: { bg: '#FCEBEB', color: '#A32D2D' },
  instagram: { bg: '#FBEAF0', color: '#993556' },
  portfolio: { bg: '#EEEDFE', color: '#534AB7' },
  referral: { bg: '#FAEEDA', color: '#854F0B' },
  collab: { bg: '#E1F5EE', color: '#0F6E56' },
  affiliate: { bg: '#EAF3DE', color: '#3B6D11' },
}

export default function LinkCard({ link }: { link: LinkType }) {
  const av = AVATAR_COLORS[link.type]

  return (
    <div className="card">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
          style={{ background: av.bg, color: av.color }}
        >
          {getInitials(link.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{link.name}</div>
          <div className="text-xs text-gray-400 truncate">{link.handle}</div>
        </div>
        <span className={`badge shrink-0 ${LINK_TYPE_STYLES[link.type]}`}>
          {TYPE_LABELS[link.type]}
        </span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed mb-3">{link.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{link.stat}</span>
        <button className="btn-primary text-xs px-3 py-1.5">{BTN_LABELS[link.type]}</button>
      </div>
    </div>
  )
}
