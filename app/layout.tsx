import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AuthProvider from '@/components/layout/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://subsharepool.com'),
  title: {
    default: 'SubSharePool — Share Subscriptions, Trips & More',
    template: '%s | SubSharePool',
  },
  description: 'Split subscription costs, share trips, discover creators and connect with your community.',
  keywords: ['subscription sharing', 'split netflix', 'trip sharing', 'carpooling'],
  openGraph: {
    type: 'website',
    siteName: 'SubSharePool',
    title: 'SubSharePool — Share Subscriptions, Trips & More',
    description: 'Split subscription costs, share trips, discover creators and connect with your community.',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'PNtWbjSYlnfDY0I1Xu_QDv2Gr6W34X2MWwGJ4zJ_10k',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7F77DD',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
