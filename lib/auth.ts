import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        // Check if user already exists
        const { data: existing } = await supabase
          .from('users')
          .select('id, country, signup_ip')
          .eq('email', user.email)
          .single()

        if (!existing) {
          // New user — get country from IP
          let country = null
          let city = null
          let timezone = null

          try {
            const geoRes = await fetch('https://ipapi.co/json/')
            const geo = await geoRes.json()
            country = geo.country_code || null
            city = geo.city || null
            timezone = geo.timezone || null
          } catch {}

          // Insert new user with all details
          await supabase.from('users').insert({
            email: user.email,
            name: user.name,
            image: user.image,
            country,
            city,
            timezone,
            language: 'en',
            last_seen: new Date().toISOString(),
          })
        } else {
          // Existing user — just update last_seen
          await supabase
            .from('users')
            .update({ last_seen: new Date().toISOString() })
            .eq('email', user.email)
        }
      } catch (error) {
        console.error('Auth signIn error:', error)
      }

      return true
    },

    async session({ session, token }) {
      if (session.user?.email) {
        const { data: user } = await supabase
          .from('users')
          .select('id, role, username, country, city, suspended')
          .eq('email', session.user.email)
          .single()

        if (user) {
          // Block suspended users
          if (user.suspended) return null as any

          ;(session.user as any).id = user.id
          ;(session.user as any).role = user.role
          ;(session.user as any).username = user.username
          ;(session.user as any).country = user.country
          ;(session.user as any).city = user.city
        }
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
      }
      return token
    },
  },
})
