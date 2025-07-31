'use client'

import { createContext, ReactNode, useState } from 'react'
import { createAppKit } from '@reown/appkit'
import { createSiweConfig } from '@/app/lib/auth/appkit-siwe'
import {
	supportedChains,
	defaultChain,
	wagmiAdapter,
	reownProjectId,
} from '@/app/lib/wagmi-adapter'

type WalletModalType = ReturnType<typeof createAppKit>
type OpenWalletModalType = ReturnType<typeof createAppKit>['open']
type CloseWalletModalType = ReturnType<typeof createAppKit>['close']

interface AppKitContextProps {
	walletModal: WalletModalType
	openWalletModal: OpenWalletModalType
	closeWalletModal: CloseWalletModalType
}

// Create AppKit context
export const AppKitContext = createContext<AppKitContextProps | undefined>(
	undefined
)

// Provide AppKit context
export const AppKitProvider = ({ children }: { children: ReactNode }) => {
	if (!reownProjectId) {
		throw new Error('Reown Project ID is not configured')
	}

	const metadata = {
		name: 'Defrost',
		description: 'Defrost Protocol DApp',
		url: 'http://localhost:3000', // origin must match your domain & subdomain
		icons: ['https://avatars.githubusercontent.com/u/179229932'],
	}

	const [connectWalletModal] = useState(
		createAppKit({
			adapters: [wagmiAdapter],
			projectId: reownProjectId,
			networks: supportedChains,
			defaultNetwork: defaultChain,
			metadata: metadata,
			siweConfig: createSiweConfig(supportedChains.map((chain) => chain.id)),
		})
	)

	return (
		<AppKitContext.Provider
			value={{
				walletModal: connectWalletModal,
				openWalletModal: (options) => connectWalletModal.open(),
				closeWalletModal: () => connectWalletModal.close(),
			}}
		>
			{children}
		</AppKitContext.Provider>
	)
}
