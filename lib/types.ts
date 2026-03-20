// ─── User ───────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: 'user' | 'admin'
  blocked: boolean
  created_at: string
}

// ─── Subscription ────────────────────────────────────────
export interface Subscription {
  id: string
  user_id: string
  icon: string
  icon_bg: string
  name: string
  description: string
  price: number | null
  total_slots: number
  filled_slots: number
  category: 'streaming' | 'ai' | 'design' | 'hosting' | 'vpn' | 'saas' | 'music' | 'other'
  featured: boolean
  contact_info?: string
  created_at: string
  user?: User
}

// ─── Trip ────────────────────────────────────────────────
export interface Trip {
  id: string
  user_id: string
  title: string
  type: 'carpool' | 'hotel' | 'flight' | 'buddy'
  from_location: string
  to_location: string
  date: string
  total_seats: number
  filled_seats: number
  price: string
  description: string
  vehicle?: string
  created_at: string
  user?: User
}

// ─── Link ────────────────────────────────────────────────
export interface Link {
  id: string
  user_id: string
  name: string
  handle: string
  type: 'youtube' | 'instagram' | 'portfolio' | 'referral' | 'collab' | 'affiliate'
  description: string
  url: string
  stat?: string
  created_at: string
  user?: User
}

// ─── Feed Post ───────────────────────────────────────────
export interface FeedPost {
  id: string
  user_id: string
author?: string
  body: string
  tag: 'deal' | 'idea' | 'question' | 'collab'
  likes: number
replies?: number
  link_title?: string
  link_url?: string
  link_icon?: string
  created_at: string
  user?: User
}

// ─── Blog ────────────────────────────────────────────────
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image?: string
  published: boolean
  author_id: string
  created_at: string
  updated_at: string
  author?: User
}

// ─── Message ─────────────────────────────────────────────
export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  body: string
  read: boolean
  created_at: string
  sender?: User
  receiver?: User
}

export interface Conversation {
  user: User
  last_message: Message
  unread_count: number
}
