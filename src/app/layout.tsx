import type { Metadata, Viewport } from 'next'
import { MobileLayout } from '@/components/MobileLayout'
import './globals.css'

export const metadata: Metadata = {
  title: '5_25 Fitness',
  description: 'Mobile-first fitness PWA',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAFAFA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <MobileLayout>{children}</MobileLayout>
      </body>
    </html>
  )
}
