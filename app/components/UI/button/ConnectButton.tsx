import { useAppKit } from '@/app/hooks/useAppKit'

export default function ConnectButton() {
	const { openWalletModal } = useAppKit()

	return (
		<button
			className="rounded-full purple-blue-gradient text-white px-6 py-3 font-semibold focus:outline-none focus:ring-[#6D64F7]"
			onClick={() => openWalletModal()}
		>
			Connect Wallet
		</button>
	)
}
