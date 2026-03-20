import { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to SubSharePool with your Google account.',
}

export default function LoginPage() {
  return <LoginClient />
}
