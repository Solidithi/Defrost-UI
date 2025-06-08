import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

interface ImageItem {
	id: string
	base64: string
	name?: string // Optional name for display purposes
}

interface LogoItem {
	base64: string
	name?: string // Optional name for display purposes
}

interface ImageManagerProps {
	className?: string
	images: ImageItem[]
	logo?: LogoItem | null
	onDeleteImage: (id: string) => void
	onDeleteLogo?: () => void
	title?: string
	buttonText?: string
	emptyText?: string
	showLogoTab?: boolean
}

const ImageManager = ({
	className = '',
	images = [],
	logo = null,
	onDeleteImage,
	onDeleteLogo,
	title = 'Manage Images',
	buttonText = 'Manage Images',
	emptyText = 'No images uploaded yet',
	showLogoTab = false,
}: ImageManagerProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [activeTab, setActiveTab] = useState<'images' | 'logo'>('images')
	const modalRef = useRef<HTMLDivElement>(null)
	const [modalAnimation, setModalAnimation] = useState('')

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

	// Handle image deletion
	const handleImageDelete = (id: string) => {
		onDeleteImage(id)
	}

	// Handle logo deletion
	const handleLogoDelete = () => {
		if (onDeleteLogo) {
			onDeleteLogo()
		}
	}

	return (
		<div className={`relative ${className}`}>
			{/* Trigger Button */}
			<button
				className="w-full px-4 py-2 text-center font-comfortaa border rounded-md focus:outline-none flex items-center glass-component-2 justify-center space-x-2 text-white hover:bg-gray-700/30 transition-colors"
				onClick={openModalWithAnimation}
				type="button"
				aria-haspopup="dialog"
				aria-expanded={isModalOpen}
			>
				<span>
					{buttonText} ({images.length + (logo ? 1 : 0)})
				</span>
			</button>

			{/* Modal Overlay */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
					{/* Modal Content with zoom animation */}
					<div
						ref={modalRef}
						className={`bg-black border border-gray-700 text-white rounded-3xl max-w-4xl w-full p-6 transform z-10 ${modalAnimation}`}
						style={{ maxHeight: '85vh' }}
					>
						<div className="absolute top-[-50px] left-[200px] h-[600px] w-[600px] rounded-full opacity-20 blur-[5000px] bg-gradient-to-r from-[#427FF6] via-[#AB54F2] to-[#E8499E] z-0"></div>
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-comfortaa">{title}</h2>
							<button
								onClick={closeModalWithAnimation}
								className="text-gray-500 hover:text-gray-300 focus:outline-none"
							>
								✕
							</button>
						</div>

						{showLogoTab && (
							<div className="flex justify-center border-b border-gray-700 mb-8 sticky top-0 bg-black z-10 pb-0">
								<button
									className={`px-8 py-4 font-comfortaa text-base transition-all duration-200 relative ${
										activeTab === 'images'
											? 'text-blue-400 font-medium'
											: 'text-gray-400 hover:text-gray-300'
									}`}
									onClick={() => setActiveTab('images')}
									style={{
										zIndex: 20,
										outline: 'none',
									}}
								>
									Project Images
									{activeTab === 'images' && (
										<div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-400"></div>
									)}
								</button>
								<button
									className={`px-8 py-4 font-comfortaa text-base transition-all duration-200 relative ${
										activeTab === 'logo'
											? 'text-blue-400 font-medium'
											: 'text-gray-400 hover:text-gray-300'
									}`}
									onClick={() => setActiveTab('logo')}
									style={{
										zIndex: 20,
										outline: 'none',
									}}
								>
									Project Logo
									{activeTab === 'logo' && (
										<div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-400"></div>
									)}
								</button>
							</div>
						)}

						<div
							className="overflow-y-auto"
							style={{ maxHeight: 'calc(85vh - 150px)' }}
						>
							{activeTab === 'images' && (
								<>
									{images.length > 0 ? (
										<div
											className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${
												images.length <= 4
													? ''
													: 'pr-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-blue-500/50 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:bg-blue-500/70'
											}`}
										>
											{images.map((image) => (
												<div
													key={image.id}
													className="group glass-component-3 rounded-xl p-2 flex flex-col items-center relative"
												>
													<div className="w-full aspect-square overflow-hidden rounded-lg mb-2 relative">
														<Image
															src={image.base64}
															alt={`Image ${image.id}`}
															width={800}
															height={800}
															className="w-full h-full object-cover"
														/>
														<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
															<button
																onClick={() => handleImageDelete(image.id)}
																className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 transform scale-90 hover:scale-100"
																aria-label="Delete image"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
																	/>
																</svg>
															</button>
														</div>
													</div>
													<span className="text-xs text-gray-300 truncate w-full text-center">
														{image.name || `Image ${image.id}`}
													</span>
												</div>
											))}
										</div>
									) : (
										<div className="text-center p-10 text-gray-400 font-comfortaa">
											{emptyText}
										</div>
									)}
								</>
							)}

							{activeTab === 'logo' && (
								<>
									{logo ? (
										<div className="flex flex-col items-center">
											<div className="w-48 h-48 glass-component-3 rounded-xl p-2 mb-4 relative group">
												<Image
													src={logo.base64}
													alt="Project Logo"
													width={800}
													height={800}
													className="w-full h-full object-contain rounded-lg"
												/>
												<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
													<button
														onClick={handleLogoDelete}
														className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 transform scale-90 hover:scale-100"
														aria-label="Delete logo"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
													</button>
												</div>
											</div>
											<span className="text-sm text-gray-300 mb-2">
												{logo.name || 'Project Logo'}
											</span>
											<p className="text-xs text-gray-400 text-center">
												Your project logo should be 512×512px, PNG format
												(transparent background recommended)
											</p>
										</div>
									) : (
										<div className="text-center p-10 text-gray-400 font-comfortaa">
											No logo uploaded yet. Click the logo upload area to add
											your project logo.
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default ImageManager
