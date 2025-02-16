import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Defrost',
  description: 'Defrost',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar navItems=
          {[{ name: 'My Project', link: '/' }, { name: 'My Staking', link: '/about' }, { name: 'Launchpool', link: '/about' }, { name: 'Pre-market', link: '/about' }, { name: 'Dashboard', link: '/about' }]} />
        {children}
        <Footer />
      </body>
    </html>
  )
}
