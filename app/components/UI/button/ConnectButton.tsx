'use client'

import { useAppKit } from '@/app/hooks/useAppKit'
import { useAccount, useDisconnect, useEnsName } from 'wagmi'

export default function ConnectButton() {
	const { openWalletModal } = useAppKit()
	const { address, isConnected } = useAccount()
	const { disconnect } = useDisconnect()
	const { data: ensName } = useEnsName({ address })

	const truncateAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`
	}

	if (isConnected && address) {
		return (
			<div className="flex items-center gap-2">
				<div className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-[1px]">
					<button
						className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900"
						onClick={() => openWalletModal()}
					>
						{ensName || truncateAddress(address)}
					</button>
				</div>
				<button
					className="rounded-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
					onClick={() => disconnect()}
				>
					Disconnect
				</button>
			</div>
		)
	}

	return (
		<button
			className="rounded-full purple-blue-gradient text-white px-6 py-3 font-semibold focus:outline-none focus:ring-[#6D64F7]"
			onClick={() => openWalletModal()}
		>
			Connect Wallet
		</button>
	)
}
