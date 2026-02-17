import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Student Programs Admin Panel',
  description: 'Admin panel for managing student referral and rewards program',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
