import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

interface NetworkOption {
	id: string
	name: string
	icon?: string
	address?: string
}

interface NetworkSelectorProps {
	className?: string
	options: NetworkOption[]
	onChange?: (option: NetworkOption) => void
	defaultValue?: string
	onModalStateChange?: (isOpen: boolean) => void
}

const NetworkSelector = ({
	className = '',
	options,
	onChange,
	defaultValue = '',
	onModalStateChange,
}: NetworkSelectorProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption | null>(
		defaultValue
			? options.find((option) => option.name === defaultValue) || null
			: null
	)
	const modalRef = useRef<HTMLDivElement>(null)

	// Animation state
	const [modalAnimation, setModalAnimation] = useState('')

	// Update parent component when modal state changes
	useEffect(() => {
		if (onModalStateChange) {
			onModalStateChange(isModalOpen)
		}
	}, [isModalOpen, onModalStateChange])

	// Close modal when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				closeModalWithAnimation()
			}
		}

		if (isModalOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isModalOpen])

	// Open modal with zoom-in animation
	const openModalWithAnimation = () => {
		setModalAnimation('scale-0')
		setIsModalOpen(true)
		setTimeout(() => {
			setModalAnimation('scale-100 transition-transform duration-300 ease-out')
		}, 10)
	}

	// Close modal with zoom-out animation
	const closeModalWithAnimation = () => {
		setModalAnimation('scale-0 transition-transform duration-300 ease-in')
		setTimeout(() => {
			setIsModalOpen(false)
		}, 300)
	}

	// Handle network selection
	const handleNetworkSelect = (network: NetworkOption) => {
		setSelectedNetwork(network)
		closeModalWithAnimation()

		if (onChange) {
			onChange(network)
		}
	}

	return (
		<div className={`relative ${className}`}>
			{/* Trigger Button */}
			<button
				className={`w-full px-4 py-4 text-center font-comfortaa border rounded-2xl focus:outline-none flex items-center glass-component-2 justify-center space-x-2 text-white ${!selectedNetwork ? 'text-gray-400' : ''}`}
				onClick={openModalWithAnimation}
				type="button"
				aria-haspopup="dialog"
				aria-expanded={isModalOpen}
			>
				{selectedNetwork ? (
					<>
						{selectedNetwork.icon && (
							<Image
								src={selectedNetwork.icon}
								alt={selectedNetwork.name}
								className="w-6 h-6 rounded-full"
							/>
						)}
						<span>{selectedNetwork.name}</span>
					</>
				) : (
					<span>Click here to select network</span>
				)}
			</button>

			{/* Modal Overlay */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
					{/* Modal Content with zoom animation */}
					<div
						ref={modalRef}
						className={`bg-black border border-gray-700 text-white rounded-3xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto transform z-10 ${modalAnimation}`}
					>
						<div className="absolute top-[-50px] left-[200px] h-[600px] w-[600px] rounded-full opacity-20 blur-[5000px] bg-gradient-to-r from-[#F05550] via-[#AD7386] to-[#54A4F2] z-0"></div>
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-comfortaa">Available Networks</h2>
							<button
								onClick={closeModalWithAnimation}
								className="text-gray-500 hover:text-gray-300 focus:outline-none"
							>
								✕
							</button>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{options.map((network) => (
								<div
									key={network.id}
									className={`glass-component-3 hover:bg-gray-600 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 ${
										selectedNetwork && selectedNetwork.id === network.id
											? 'ring-2 ring-blue-500'
											: ''
									}`}
									onClick={() => handleNetworkSelect(network)}
								>
									{network.icon ? (
										<Image
											src={network.icon}
											alt={network.name}
											className="w-10 h-10 rounded-full mb-2"
										/>
									) : (
										<div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E05D5F] to-[#609FE3] mb-2 flex items-center justify-center">
											{network.name.charAt(0)}
										</div>
									)}
									<span className="text-center text-sm font-comfortaa">
										{network.name}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default NetworkSelector
