'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode, useEffect, useState } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { NavBarControlProvider } from './navbar-control'
import { AppKitProvider } from './appkit'
import { wagmiAdapter } from '@/app/lib/wagmi-adapter'
import '@/app/lib/superjson-init'

export function Providers({
	children,
	cookies,
}: {
	children: ReactNode
	cookies: string | null
}) {
	const queryClient = new QueryClient()

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
				<AppKitProvider>
					<NavBarControlProvider>{children}</NavBarControlProvider>
				</AppKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
