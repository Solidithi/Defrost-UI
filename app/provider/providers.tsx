'use client'

import { wagmiAdapter, projectId } from '@/app/lib/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import {
	moonbeam,
	moonbaseAlpha,
	moonriver,
	sepolia,
} from '@reown/appkit/networks'
import { createSiweConfig } from '@/app/lib/auth/appkit-siwe'
import React, { type ReactNode, useEffect, useState } from 'react'
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
	name: 'Defrost',
	description: 'Defrost Protocol DApp',
	url: 'http://localhost:3000', // origin must match your domain & subdomain
	icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

const supportedChains = [moonbeam, moonbaseAlpha, moonriver, sepolia] as [
	typeof moonbeam,
	typeof moonbaseAlpha,
	typeof moonriver,
	typeof sepolia,
]

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

	const [modal, setModal] = useState<ReturnType<typeof createAppKit> | null>(
		null
	)
	useEffect(() => {
		if (!projectId) {
			return
		}
		// Create the appkit modal
		const modalInstance = createAppKit({
			adapters: [wagmiAdapter],
			projectId,
			networks: supportedChains,
			defaultNetwork: moonbaseAlpha,
			metadata: metadata,
			siweConfig: createSiweConfig(supportedChains.map((chain) => chain.id)),
		})
		setModal(modalInstance)
	}, [projectId])

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
