import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
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
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        await supabaseAdmin.from('users').upsert({
          email: user.email,
          name: user.name,
          image: user.image,
        }, { onConflict: 'email' })
      }
      return true
    },
    async session({ session }) {
      if (session.user?.email) {
        const { data } = await supabaseAdmin
          .from('users')
          .select('id, role, blocked')
          .eq('email', session.user.email)
          .single()

        if (data) {
          session.user.id = data.id
          session.user.role = data.role
          if (data.blocked) return {} as typeof session
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
