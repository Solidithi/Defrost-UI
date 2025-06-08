import type { Metadata } from 'next'
import { Orbitron, Comfortaa, Permanent_Marker } from 'next/font/google'
import { Providers } from './provider/providers'
import { headers } from 'next/headers'
import './globals.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

export const metadata: Metadata = {
	title: 'Defrost',
	description: 'Defrost',
}
const comfortaa = Comfortaa({
	subsets: ['latin'],
	variable: '--font-comfortaa',
})
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })
const permanentMarker = Permanent_Marker({
	weight: '400',
	subsets: ['latin'],
	variable: '--font-permanent-marker',
})

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body
				className={`${comfortaa.variable} ${orbitron.variable} ${permanentMarker.variable} min-h-screen flex flex-col`}
			>
				<Providers cookies={headers().get('cookie')}>
					<Navbar
						navItems={[
							{ name: 'My Project', link: '/' },
							{ name: 'My Staking', link: '/my-staking' },
							{ name: 'Launchpool', link: '/about' },
							{ name: 'Pre-market', link: '/about' },
							{ name: 'Dashboard', link: '/about' },
						]}
					/>
					<main className="flex-1">{children}</main>
					<Footer />
					<div id="modal-root" />
				</Providers>
			</body>
		</html>
	)
}
