'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import SplitText from '@/app/components/UI/effect/SplitText'
import Stepper, { Step } from '@/app/components/UI/project-progress/Stepper'
import NetworkSelector from '@/app/components/UI/selector/NetworkSelector'
import Folder from '@/app/components/UI/selector/Folder'
import ImageManager from '@/app/components/UI/shared/ImageManager'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCreateProjectStore } from '@/app/store/create-project'
import chains from '@/app/config/chains.json'
import AnimatedBlobs from '@/app/components/UI/background/AnimatedBlobs'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/app/components/UI/shadcn/Tooltip'
import { Info, Edit2 } from 'lucide-react'

interface ImageItem {
	id: string
	url: string
	file: File
}

const EditProject = () => {
	const router = useRouter()
	const createProjectStore = useCreateProjectStore()

	// Load data from store
	const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
	const [name, setName] = useState(createProjectStore.name || '')
	const [shortDescription, setShortDescription] = useState(
		createProjectStore.shortDescription || ''
	)
	const [longDescription, setLongDescription] = useState(
		createProjectStore.longDescription || ''
	)
	const [targetAudience, setTargetAudience] = useState(
		createProjectStore.targetAudience || ''
	)
	const [isModalOpen, setIsModalOpen] = useState(false)

	// Use ImageItem[] instead of separate state variables for images and previews
	const [projectImages, setProjectImages] = useState<ImageItem[]>([])
	const [projectLogo, setProjectLogo] = useState<File | null>(
		createProjectStore.logo || null
	)
	const [projectLogoPreview, setProjectLogoPreview] = useState<string | null>(
		null
	)
	const [imageUploadFolderOpen, setImageUploadFolderOpen] = useState(false)
	const [logoUploadFolderOpen, setLogoUploadFolderOpen] = useState(false)

	// Effect to load network from chainID
	useEffect(() => {
		// Find the network in chains based on chainID from the store
		if (createProjectStore.chainID) {
			const networkInfo = Object.values(chains).find(
				(chain) => chain.chainID === createProjectStore.chainID
			)
			if (networkInfo) {
				setSelectedNetwork(networkInfo.chainName)
			}
		}

		// Load project logo preview if logo exists
		if (createProjectStore.logo) {
			const reader = new FileReader()
			reader.onload = (event) => {
				setProjectLogoPreview(event.target?.result as string)
			}
			reader.readAsDataURL(createProjectStore.logo)
		}

		// Load project images if they exist
		if (createProjectStore.images && createProjectStore.images.length > 0) {
			const loadedImages: ImageItem[] = []

			createProjectStore.images.forEach((file) => {
				const reader = new FileReader()
				reader.onload = (event) => {
					if (event.target?.result) {
						const newImage: ImageItem = {
							id: uuidv4(),
							url: event.target.result as string,
							file: file,
						}
						loadedImages.push(newImage)
						setProjectImages((prev) => [...prev, newImage])
					}
				}
				reader.readAsDataURL(file)
			})
		}
	}, [
		createProjectStore.chainID,
		createProjectStore.logo,
		createProjectStore.images,
	])

	// const availableNetworks = Objec(chains as ChainConfig)
	const availableNetworks = Object.entries(chains).map(([_, chain]) => ({
		id: chain.chainID,
		name: chain.chainName,
		icon: chain.chainIcon,
		isTestnet: chain.isTestnet,
		address: '',
	}))

	const handleComplete = () => {
		try {
			// Check if all required fields are filled
			if (!selectedNetwork) {
				alert('Please select a blockchain network')
				return
			}
			if (!name) {
				alert('Please enter a project name')
				return
			}
			if (!shortDescription) {
				alert('Please enter a short description')
				return
			}

			// Set data to store before navigating
			createProjectStore.setName(name)
			createProjectStore.setShortDescription(shortDescription)
			createProjectStore.setLongDescription(longDescription)
			createProjectStore.setTargetAudience(targetAudience)

			router.push('/create-project/preview')
		} catch (error) {
			console.log('Error:', error)
		}
	}

	// Render image previews for the folder component
	const renderImagePreviews = () => {
		// Take only the first 3 images (or fewer if there aren't 3)
		return projectImages.slice(0, 3).map((image, index) => (
			<div
				key={image.id}
				className="w-full h-full flex items-center justify-center"
			>
				<Image
					src={image.url}
					alt={`Preview ${index}`}
					width={512}
					height={512}
					className="max-w-full max-h-full object-contain rounded"
				/>
			</div>
		))
	}

	const handleNetworkChange = (option: any) => {
		// Network is read-only in edit mode
		console.log(`Network selection is read-only in edit mode`)
	}

	const handleModalStateChange = (isOpen: boolean) => {
		setIsModalOpen(isOpen)
	}

	const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files)

			// Process each file
			const imageFiles: File[] = []

			files.forEach((file) => {
				const reader = new FileReader()
				reader.onload = (event) => {
					if (event.target?.result) {
						const newImage: ImageItem = {
							id: uuidv4(), // Generate a unique ID
							url: event.target.result as string,
							file: file,
						}

						imageFiles.push(newImage.file)
						setProjectImages((prev) => [...prev, newImage])
					}
				}
				reader.readAsDataURL(file)
			})
			// Add the new image to state
			createProjectStore.setImages([
				...createProjectStore.images,
				...imageFiles,
			])

			// Open the folder when files are selected
			setImageUploadFolderOpen(true)
		}
	}

	const handleProjectLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]

			// Optional: validate file type
			if (!file.type.match('image.*')) {
				alert('Please upload an image file')
				return
			}

			setProjectLogo(file)
			createProjectStore.setLogo(file)

			// Open the folder when file is selected
			setLogoUploadFolderOpen(true)

			// Create image preview for the folder item
			const reader = new FileReader()
			reader.onload = (event) => {
				setProjectLogoPreview(event.target?.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleLogoDelete = () => {
		setProjectLogo(null)
		setProjectLogoPreview(null)
		createProjectStore.setLogo(null)
	}

	const handleImageDelete = (imageId: string) => {
		const updatedImages = projectImages.filter((image) => image.id !== imageId)
		setProjectImages(updatedImages)

		// Update the store with just the file objects
		const imageFiles = updatedImages.map((img) => img.file)
		createProjectStore.setImages(imageFiles)
	}

	return (
		<div className="relative page-container ">
			<AnimatedBlobs count={4} />
			<div
				className={`text-center ${isModalOpen ? 'blur-sm pointer-events-none' : ''}`}
			>
				<SplitText
					text="Edit your project's information"
					className="text-7xl text-center font-bold text-white font-orbitron z-20"
					delay={50}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>

			<div
				className={`mt-[30px] text-center max-w-5xl mx-auto ${
					isModalOpen ? 'blur-sm pointer-events-none' : ''
				}`}
			>
				<SplitText
					text="Update your project information to better represent your goals and progress. The network your project was created on cannot be changed."
					className="text-lg text-center text-gray-300 font-comfortaa z-20"
					delay={10}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div
				className={`mt-8 w-2/3 h-auto glass-component-3 rounded-2xl p-8 transition-all duration-300 z-20`}
			>
				<Stepper
					className="w-full z-20"
					initialStep={1}
					onStepChange={(step: any) => {
						console.log(step)
					}}
					onFinalStepCompleted={() => handleComplete()}
					backButtonText="Previous"
					nextButtonText="Next"
				>
					<Step>
						<div className="">
							<span className="text-3xl font-orbitron text-white mb-4 flex justify-center w-full">
								Blockchain Network
							</span>
							<div className="h-full rounded-lg p-4 mt-4">
								{/* Disabled NetworkSelector with disabled prop */}
								<NetworkSelector
									options={availableNetworks}
									onChange={handleNetworkChange}
									onModalStateChange={handleModalStateChange}
									defaultValue={selectedNetwork || undefined}
									disabled={true}
								/>
							</div>
							<div className=""></div>
							<div className="mt-8 mb-2 rounded-lg bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-4 border-l-4 border-cyan-500 backdrop-blur-sm">
								<p className="text-gray-300 text-center font-comfortaa max-w-3xl mx-auto leading-relaxed">
									<span className="text-cyan-400 font-bold">
										The blockchain network
									</span>{' '}
									for your project cannot be changed after creation. This
									network is used for various DeFi activities including{' '}
									<span className="text-blue-300">yield farming</span>,{' '}
									<span className="text-blue-300">launchpools</span>,{' '}
									<span className="text-blue-300">token launchpad</span>, and{' '}
									<span className="text-blue-300">liquidity provision</span>.
								</p>
							</div>
						</div>
					</Step>
					<Step>
						<div className="">
							<span className="text-3xl font-orbitron text-white mb-4 flex justify-center w-full">
								Project Information
							</span>
							<div className="w-full space-y-8 flex flex-col items-center p-4">
								<div className="flex flex-col space-y-3 w-full">
									<label
										htmlFor="projectName"
										className="text-gray-300 text-2xl font-comfortaa"
									>
										Project Name
									</label>
									<div className="relative w-full">
										<input
											id="projectName"
											value={name}
											onChange={(e) => {
												setName(e.target.value)
												createProjectStore.setName(e.target.value)
											}}
											placeholder="Enter your project name"
											className="p-4 pr-12 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
										/>
										<Edit2
											size={18}
											className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
											title="Click to edit"
										/>
									</div>
								</div>

								<div className="flex flex-col space-y-3 w-full">
									<label
										htmlFor="shortDescription"
										className="text-gray-300 text-2xl font-comfortaa mt-4"
									>
										Short Description (100 words max)
									</label>
									<div className="relative w-full">
										<textarea
											id="shortDescription"
											value={shortDescription}
											onChange={(e) => {
												const words = e.target.value.trim().split(/\s+/)
												if (
													words.length <= 100 ||
													e.target.value.length < shortDescription.length
												) {
													setShortDescription(e.target.value)
													createProjectStore.setShortDescription(e.target.value)
												}
											}}
											placeholder="Brief overview of your project (100 words max)"
											className="p-4 pr-12 font-comfortaa text-white rounded-lg glass-component-2 h-32 resize-none w-full"
										/>
										<Edit2
											size={18}
											className="absolute right-4 top-8 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
											title="Click to edit"
										/>
									</div>
									<div className="text-xs text-gray-400 text-right font-comfortaa">
										{
											shortDescription.trim().split(/\s+/).filter(Boolean)
												.length
										}
										/100 words
									</div>
								</div>

								<div className="flex flex-col space-y-3 w-full">
									<label
										htmlFor="longDescription"
										className="text-gray-300 text-2xl font-comfortaa"
									>
										Full Description
									</label>
									<div className="relative w-full">
										<textarea
											id="longDescription"
											value={longDescription}
											onChange={(e) => {
												createProjectStore.setLongDescription(e.target.value)
												setLongDescription(e.target.value)
											}}
											placeholder="Detailed description of your project"
											className="p-4 pr-12 rounded-lg glass-component-2 text-white font-comfortaa h-56 resize-none w-full"
										/>
										<Edit2
											size={18}
											className="absolute right-4 top-8 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
											title="Click to edit"
										/>
									</div>
								</div>
							</div>
						</div>
					</Step>
					<Step>
						<div className="flex flex-col gap-5 items-center w-full">
							<span className="text-3xl font-orbitron text-white mb-8 flex justify-center w-full">
								Project Media & Audience
							</span>

							<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								{/* Project Images Upload */}
								<div className="w-full h-48 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-400 transition-all duration-300 relative overflow-visible">
									<input
										type="file"
										id="projectImageUpload"
										onChange={handleProjectImageUpload}
										accept="image/*"
										multiple
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										title=""
									/>
									<div className="h-20 relative mt-2 overflow-visible">
										<div className="absolute -top-4 left-1/2 -translate-x-1/2">
											<Folder
												size={0.8}
												color="#00d8ff"
												className="custom-folder"
												isOpen={imageUploadFolderOpen}
												onOpenChange={setImageUploadFolderOpen}
												autoClose={true}
												autoCloseDelay={1500}
												maxItems={3}
												items={renderImagePreviews()}
											/>
										</div>
									</div>
									<p className="text-gray-300 font-comfortaa text-center">
										{projectImages.length > 0
											? `${projectImages.length} image(s) selected. Click to add more.`
											: 'Drag & drop your project images here\nor click to browse'}
									</p>
									<span className="text-cyan-400 font-bold mt-2 text-xs">
										Recommended: 1200×630px, PNG or JPG
									</span>
								</div>

								{/* Project Logo Upload */}
								<div className="w-full h-48 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-400 transition-all duration-300 relative overflow-visible">
									<input
										type="file"
										id="projectLogoUpload"
										onChange={handleProjectLogoUpload}
										accept="image/*"
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										title=""
									/>
									{/* Tooltip positioned in the top right corner */}
									<div className="absolute top-2 right-2 z-10">
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger>
													<Info
														size={16}
														className="text-gray-400 hover:text-cyan-400 transition-colors"
													/>
												</TooltipTrigger>
												<TooltipContent className="bg-black/80 border-white/10 text-white">
													<p>Only one image can be uploaded as project logo</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
									<div className="h-20 relative mt-2 overflow-visible">
										<div className="absolute -top-4 left-1/2 -translate-x-1/2">
											<Folder
												size={0.8}
												color="#00d8ff"
												className="custom-folder"
												maxItems={1}
												isOpen={logoUploadFolderOpen}
												onOpenChange={setLogoUploadFolderOpen}
												autoClose={true}
												autoCloseDelay={1500}
												items={
													projectLogoPreview
														? [
																<div
																	key="logo"
																	className="w-full h-full flex items-center justify-center"
																>
																	<Image
																		src={projectLogoPreview}
																		alt="Logo Preview"
																		width={512}
																		height={512}
																		className="max-w-full max-h-full object-contain rounded"
																	/>
																</div>,
															]
														: []
												}
											/>
										</div>
									</div>
									<p className="text-gray-300 font-comfortaa text-center">
										{projectLogo
											? 'Logo selected. Click to change.'
											: 'Drag & drop your project logo here\nor click to browse'}
									</p>
									<span className="text-cyan-400 font-bold mt-2 text-xs">
										Recommended: 512×512px, PNG (transparent)
									</span>
								</div>
							</div>

							{(projectImages.length > 0 || projectLogo) && (
								<div className="w-full mb-6">
									<ImageManager
										images={projectImages}
										logo={
											projectLogo
												? { url: projectLogoPreview || '', file: projectLogo }
												: null
										}
										onDeleteImage={handleImageDelete}
										onDeleteLogo={handleLogoDelete}
										title="Manage Project Media"
										buttonText="Manage Uploaded Images"
										emptyText="No images uploaded yet"
										showLogoTab={true}
									/>
								</div>
							)}

							{/* Target Audience Input */}
							<div className="flex flex-col space-y-3 w-full">
								<label
									htmlFor="targetAudience"
									className="text-gray-300 text-2xl font-comfortaa"
								>
									Target Audience
								</label>
								<div className="relative w-full">
									<input
										id="targetAudience"
										value={targetAudience}
										onChange={(e) => {
											setTargetAudience(e.target.value)
											createProjectStore.setTargetAudience(e.target.value)
										}}
										placeholder="Describe your target audience (e.g., DeFi users, NFT collectors, etc.)"
										className="p-4 pr-12 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
									/>
									<Edit2
										size={18}
										className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
										title="Click to edit"
									/>
								</div>
							</div>
						</div>
					</Step>
				</Stepper>
			</div>
		</div>
	)
}

export default EditProject
