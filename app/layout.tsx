import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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
  keywords: ['subscription sharing', 'split netflix', 'trip sharing', 'carpooling', 'save money', 'subscription split'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'SubSharePool',
    title: 'SubSharePool — Share Subscriptions, Trips & More',
    description: 'Split subscription costs, share trips, discover creators and connect with your community.',
    images: ['https://subsharepool.com/android-chrome-512x512.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SubSharePool — Share Subscriptions, Trips & More',
    description: 'Split subscription costs, share trips, discover creators and connect with your community.',
    images: ['https://subsharepool.com/android-chrome-512x512.png'],
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CEKZRX67XV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CEKZRX67XV');
          `}
        </Script>
      </head>
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
