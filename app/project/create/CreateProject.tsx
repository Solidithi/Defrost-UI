'use client'

import { useState } from 'react'
import SplitText from '@/app/components/UI/effect/SplitText'
import Stepper, { Step } from '@/app/components/UI/project-progress/Stepper'
import NetworkSelector from '@/app/components/UI/selector/NetworkSelector'
import Folder from '@/app/components/UI/selector/Folder'
import ImageManager from '@/app/components/UI/shared/ImageManager'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCreateProjectStore } from '../../store/create-project'
import chains from '@/app/config/chains.json'
import AnimatedBlobs from '@/app/components/UI/background/AnimatedBlobs'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/app/components/UI/shadcn/Tooltip'
import { Info } from 'lucide-react'
import { fileToBase64 } from '@/app/utils/file'
import { resizeAndConvertToBase64 } from '@/app/utils/image'
import { getChainName } from '@/app/utils/chain'

// Define interface for ImageItem to match the new ImageManager component
interface ImageItem {
	id: string
	base64: string
	name?: string
}

const CreateProject = () => {
	// Minimal UI state that doesn't need to be in the store
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [targetAudience, setTargetAudience] = useState('')

	// Social media state
	const [twitter, setTwitter] = useState('')
	const [telegram, setTelegram] = useState('')
	const [discord, setDiscord] = useState('')
	const [website, setWebsite] = useState('')
	const [github, setGithub] = useState('')

	// Use ImageItem[] instead of separate state variables for images and previews
	const [projectImages, setProjectImages] = useState<ImageItem[]>([])
	const [projectLogo, setProjectLogo] = useState<File | null>(null)
	const [projectLogoPreview, setProjectLogoPreview] = useState<string | null>(
		null
	)
	const [imageUploadFolderOpen, setImageUploadFolderOpen] = useState(false)
	const [logoUploadFolderOpen, setLogoUploadFolderOpen] = useState(false)

	// Use Zustand store for all project data
	const createProjectStore = useCreateProjectStore()
	const router = useRouter()

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
			if (!createProjectStore.chainID) {
				alert('Please select a blockchain network')
				return
			}

			if (!createProjectStore.name) {
				alert('Please enter a project name')
				return
			}

			// Save social media links to the store before navigating
			createProjectStore.setSocials({
				twitter,
				telegram,
				discord,
				website,
				github,
			})

			router.push('/project/create/preview')
		} catch (error) {
			console.log('Error:', error)
		}
	}

	// Render image previews for the folder component using images from the store
	const renderImagePreviews = () => {
		// Take only the first 3 images (or fewer if there aren't 3)
		return createProjectStore.images.slice(0, 3).map((base64, index) => (
			<div
				key={index}
				className="w-full h-full flex items-center justify-center"
			>
				<Image
					src={base64}
					alt={`Image ${index + 1}`}
					width={512}
					height={512}
					className="max-w-full max-h-full object-contain rounded"
				/>
			</div>
		))
	}

	const handleNetworkChange = (option: any) => {
		createProjectStore.setChainID(option.id)
	}

	const handleModalStateChange = (isOpen: boolean) => {
		setIsModalOpen(isOpen)
	}

	const handleProjectImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files)

			// Process each file to base64 with resizing
			const base64Images: string[] = await Promise.all(
				files.map((file) => resizeAndConvertToBase64(file, false))
			)

			// Update images in the store
			createProjectStore.setImages([
				...createProjectStore.images,
				...base64Images,
			])

			// Open the folder animation when files are selected
			setImageUploadFolderOpen(true)
		}
	}

	const handleProjectLogoUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]

			// Optional: validate file type
			if (!file.type.match('image.*')) {
				alert('Please upload an image file')
				return
			}

			// Convert to base64 with resizing (true for logo dimensions)
			const base64Logo = await resizeAndConvertToBase64(file, true)
			createProjectStore.setLogo(base64Logo)

			// Open the folder animation when file is selected
			setLogoUploadFolderOpen(true)
		}
	}

	const handleLogoDelete = () => {
		createProjectStore.setLogo(undefined)
	}

	const handleImageDelete = (id: string) => {
		// Convert the ID string to number since our array is index-based
		const index = parseInt(id)
		if (
			!isNaN(index) &&
			index >= 0 &&
			index < createProjectStore.images.length
		) {
			const updatedImages = [
				...createProjectStore.images.slice(0, index),
				...createProjectStore.images.slice(index + 1),
			]
			createProjectStore.setImages(updatedImages)
		}
	}

	return (
		<div className="relative page-container ">
			<AnimatedBlobs count={4} />
			<div
				className={`text-center ${isModalOpen ? 'blur-sm pointer-events-none' : ''}`}
			>
				<SplitText
					text="Fill your project's information"
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
					text="Enter detailed information about your project to help potential stakeholders understand your goals, timeline, and requirements. This comprehensive form is designed to gather all necessary details to showcase your project effectively on our platform"
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
								Select Blockchain Network
							</span>
							<div className="h-full rounded-lg p-4 mt-4">
								<NetworkSelector
									options={availableNetworks}
									onChange={handleNetworkChange}
									onModalStateChange={handleModalStateChange}
									defaultValue={getChainName(createProjectStore.chainID || 0)}
								/>
							</div>
							<div className=""></div>
							<div className="mt-8 mb-2 rounded-lg bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-4 border-l-4 border-cyan-500 backdrop-blur-sm">
								<p className="text-gray-300 text-center font-comfortaa max-w-3xl mx-auto leading-relaxed">
									<span className="text-cyan-400 font-bold">
										Select the blockchain network
									</span>{' '}
									for your project deployment. You can utilize this network for
									various DeFi activities including{' '}
									<span className="text-blue-300">yield farming</span>,{' '}
									<span className="text-blue-300">launchpools</span>,{' '}
									<span className="text-blue-300">token launchpad</span>,{' '}
									<span className="text-blue-300">liquidity provision</span>, or
									any custom protocol integration. Your selection will{' '}
									<span className="italic text-cyan-300">
										shape your project&apos;s ecosystem connectivity
									</span>
									.
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
									<input
										id="projectName"
										value={createProjectStore.name}
										onChange={(e) => {
											createProjectStore.setName(e.target.value)
										}}
										placeholder="Enter your project name"
										className="p-4 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
									/>
								</div>

								<div className="flex flex-col space-y-3 w-full">
									<label
										htmlFor="shortDescription"
										className="text-gray-300 text-2xl font-comfortaa mt-4"
									>
										Short Description (100 words max)
									</label>
									<textarea
										id="shortDescription"
										value={createProjectStore.shortDescription}
										onChange={(e) => {
											const words = e.target.value.trim().split(/\s+/)
											if (
												words.length <= 100 ||
												e.target.value.length <
													createProjectStore.shortDescription.length
											) {
												createProjectStore.setShortDescription(e.target.value)
											}
										}}
										placeholder="Brief overview of your project (100 words max)"
										className="p-4 font-comfortaa text-white rounded-lg glass-component-2 h-32 resize-none w-full"
									/>
									<div className="text-xs text-gray-400 text-right font-comfortaa">
										{
											createProjectStore.shortDescription
												.trim()
												.split(/\s+/)
												.filter(Boolean).length
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
									<textarea
										id="longDescription"
										value={createProjectStore.longDescription}
										onChange={(e) => {
											createProjectStore.setLongDescription(e.target.value)
										}}
										placeholder="Detailed description of your project"
										className="p-4 rounded-lg glass-component-2 text-white font-comfortaa h-56 resize-none w-full"
									/>
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
										{createProjectStore.images.length > 0
											? `${createProjectStore.images.length} image(s) selected. Click to add more.`
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
													createProjectStore.logo
														? [
																<div
																	key="logo"
																	className="w-full h-full flex items-center justify-center"
																>
																	<Image
																		src={createProjectStore.logo}
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
										{createProjectStore.logo
											? 'Logo selected. Click to change.'
											: 'Drag & drop your project logo here\nor click to browse'}
									</p>
									<span className="text-cyan-400 font-bold mt-2 text-xs">
										Recommended: 512×512px, PNG (transparent)
									</span>
								</div>
							</div>

							{(createProjectStore.images.length > 0 ||
								createProjectStore.logo) && (
								<div className="w-full mb-6">
									<ImageManager
										images={createProjectStore.images.map((base64, index) => ({
											id: index.toString(),
											base64,
											name: `Image ${index + 1}`,
										}))}
										logo={
											createProjectStore.logo
												? {
														base64: createProjectStore.logo,
														name: 'Project Logo',
													}
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
								<input
									id="targetAudience"
									value={createProjectStore.targetAudience}
									onChange={(e) =>
										createProjectStore.setTargetAudience(e.target.value)
									}
									placeholder="Describe your target audience (e.g., DeFi users, NFT collectors, etc.)"
									className="p-4 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
								/>
							</div>
						</div>
					</Step>
					<Step>
						<div className="flex flex-col gap-5 items-center w-full">
							<span className="text-3xl font-orbitron text-white mb-8 flex justify-center w-full">
								Social Media & Community Links
							</span>

							<div className="w-full space-y-6">
								<div className="flex flex-col space-y-3 w-full">
									<label
										htmlFor="website"
										className="text-gray-300 text-xl font-comfortaa"
									>
										Website
									</label>
									<input
										id="website"
										value={website}
										onChange={(e) => setWebsite(e.target.value)}
										placeholder="https://yourproject.com"
										className="p-4 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
									/>
								</div>

								<div className="flex flex-col space-y-3 w-full">
									<label
										htmlFor="twitter"
										className="text-gray-300 text-xl font-comfortaa"
									>
										Twitter/X
									</label>
									<input
										id="twitter"
										value={twitter}
										onChange={(e) => setTwitter(e.target.value)}
										placeholder="https://twitter.com/yourproject"
										className="p-4 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
									/>
								</div>

								<div className="flex flex-col space-y-3 w-full">
									<label
										htmlFor="telegram"
										className="text-gray-300 text-xl font-comfortaa"
									>
										Telegram
									</label>
									<input
										id="telegram"
										value={telegram}
										onChange={(e) => setTelegram(e.target.value)}
										placeholder="https://t.me/yourproject"
										className="p-4 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
									/>
								</div>

								<div className="flex flex-col space-y-3 w-full">
									<label
										htmlFor="discord"
										className="text-gray-300 text-xl font-comfortaa"
									>
										Discord
									</label>
									<input
										id="discord"
										value={discord}
										onChange={(e) => setDiscord(e.target.value)}
										placeholder="https://discord.gg/yourproject"
										className="p-4 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
									/>
								</div>

								<div className="flex flex-col space-y-3 w-full">
									<label
										htmlFor="github"
										className="text-gray-300 text-xl font-comfortaa"
									>
										GitHub
									</label>
									<input
										id="github"
										value={github}
										onChange={(e) => setGithub(e.target.value)}
										placeholder="https://github.com/yourproject"
										className="p-4 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
									/>
								</div>
							</div>

							<div className="mt-4 mb-2 rounded-lg bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-4 border-l-4 border-cyan-500 backdrop-blur-sm">
								<p className="text-gray-300 text-center font-comfortaa max-w-3xl mx-auto leading-relaxed">
									<span className="text-cyan-400 font-bold">
										Connect your community
									</span>{' '}
									by adding links to your social media and community platforms.
									Providing these links helps potential supporters find and
									engage with your project.
								</p>
							</div>
						</div>
					</Step>
				</Stepper>
			</div>
		</div>
	)
}

export default CreateProject
