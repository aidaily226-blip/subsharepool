import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AuthProvider from '@/components/layout/AuthProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  metadataBase: new URL('https://subsharepool.com'),
  title: {
    default: 'SubSharePool — Share Subscriptions, Trips & More',
    template: '%s | SubSharePool',
  },
  description: 'Split subscription costs, share trips, discover creators and connect with your community. Save money by sharing with SubSharePool.',
  keywords: ['subscription sharing', 'split netflix', 'trip sharing', 'carpooling', 'share spotify', 'save money'],
  authors: [{ name: 'SubSharePool' }],
  creator: 'SubSharePool',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://subsharepool.com',
    siteName: 'SubSharePool',
    title: 'SubSharePool — Share Subscriptions, Trips & More',
    description: 'Split subscription costs, share trips, discover creators and connect with your community.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SubSharePool' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SubSharePool — Share Subscriptions, Trips & More',
    description: 'Split subscription costs, share trips, discover creators and connect with your community.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7F77DD',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-cream min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
