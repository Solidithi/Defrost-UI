'use client'

import { wagmiAdapter, projectId } from '@/app/config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import {
	moonbeam,
	moonbaseAlpha,
	moonriver,
	sepolia,
} from '@reown/appkit/networks'
import { createSiweConfig } from '@/app/lib/appkit-siwe'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { NavBarControlProvider } from './navbar-control'
import '@/app/lib/superjson-init'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
	throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
	name: 'defrost-dapp',
	description: 'Defrost Protocol DApp',
	url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
	icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

const supportedChains = [moonbeam, moonbaseAlpha, moonriver, sepolia] as [
	typeof moonbeam,
	typeof moonbaseAlpha,
	typeof moonriver,
	typeof sepolia,
]

// Create the modal
const modal = createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: supportedChains,
	defaultNetwork: moonbaseAlpha,
	metadata: metadata,
	features: {
		analytics: true, // Optional
	},
	siweConfig: createSiweConfig(supportedChains.map((chain) => chain.id)),
})

export function Providers({
	children,
	cookies,
}: {
	children: ReactNode
	cookies: string | null
}) {
	const initialState = cookieToInitialState(
		wagmiAdapter.wagmiConfig as Config,
		cookies
	)

	return (
		<WagmiProvider
			config={wagmiAdapter.wagmiConfig as Config}
			initialState={initialState}
		>
			<QueryClientProvider client={queryClient}>
				<NavBarControlProvider>{children}</NavBarControlProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
