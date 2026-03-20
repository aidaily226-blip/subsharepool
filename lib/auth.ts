import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Upsert user into Supabase on every login
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
      // Attach user id + role from Supabase to session
      if (session.user?.email) {
        const { data } = await supabaseAdmin
          .from('users')
          .select('id, role, blocked')
          .eq('email', session.user.email)
          .single()

        if (data) {
          session.user.id = data.id
          session.user.role = data.role
          if (data.blocked) return {} as typeof session // block access
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
