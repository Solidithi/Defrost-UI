'use client'

import { useState, useEffect } from 'react'
import SplitText from '@/app/components/UI/effect/SplitText'
import Stepper, { Step } from '@/app/components/UI/project-progress/Stepper'
import NetworkSelector from '@/app/components/UI/selector/NetworkSelector'
import Folder from '@/app/components/UI/selector/Folder'
import ImageManager from '@/app/components/UI/shared/ImageManager'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import chains from '@/app/config/chains.json'
import AnimatedBlobs from '@/app/components/UI/background/AnimatedBlobs'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/app/components/UI/shadcn/Tooltip'
import { Info, Edit2 } from 'lucide-react'
import { useProjectStore } from '@/app/store/project'
import { useEditProjectStore } from '@/app/store/edit-project'
import { current } from 'tailwindcss/colors'
import { fileToBase64 } from '@/app/utils/file'
import { resizeAndConvertToBase64 } from '@/app/utils/image'
import { LoadingModal } from '@/app/components/UI/modal/LoadingModal'
import { toast, ToastContainer } from 'react-toastify'
import { ProjectCompletionModal } from '@/app/components/UI/modal/ProjectCompletionModal'

const EditProject = () => {
	const router = useRouter()
	const editProjectStore = useEditProjectStore() // for saving edited project data
	const { currentProject, setIsLoading, isLoading } = useProjectStore() // for retrieving existing project data

	const [selectedNetwork] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [projectLogoPreview, setProjectLogoPreview] = useState<
		string | undefined
	>(undefined)
	const [imageUploadFolderOpen, setImageUploadFolderOpen] = useState(false)
	const [logoUploadFolderOpen, setLogoUploadFolderOpen] = useState(false)
	const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false)

	const [isSavingProject, setIsSavingProject] = useState(false)

	// Add state variables for social media fields
	const [twitter, setTwitter] = useState('')
	const [telegram, setTelegram] = useState('')
	const [discord, setDiscord] = useState('')
	const [website, setWebsite] = useState('')
	const [github, setGithub] = useState('')

	// Transfer existing project data into editProjectStore on component mount
	useEffect(() => {
		if (!currentProject) {
			return
		}

		editProjectStore.setCurrentProjectData(currentProject) // transfer data to edit store
		setProjectLogoPreview(currentProject.logo || undefined) // set logo preview

		// Initialize local social media state from the store
		setTwitter(currentProject.twitter || '')
		setTelegram(currentProject.telegram || '')
		setDiscord(currentProject.discord || '')
		setWebsite(currentProject.website || '')
		setGithub(currentProject.github || '')
	}, [currentProject])

	const availableNetworks = Object.entries(chains).map(([_, chain]) => ({
		id: chain.chainID,
		name: chain.chainName,
		icon: chain.chainIcon,
		isTestnet: chain.isTestnet,
		address: '',
	}))

	const handleComplete = async () => {
		try {
			setIsSavingProject(true)

			// Comment out actual API call for testing frontend UI
			// await editProjectStore.saveCurrentProjectData()

			// For frontend testing, simulate a successful save
			await new Promise((resolve) => setTimeout(resolve, 1000))

			setIsSavingProject(false)
			toast.success('Project data saved successfully!')

			// Show the completion modal
			setIsCompletionModalOpen(true)
		} catch (error) {
			setIsSavingProject(false)
			toast.error('Error saving project data. Please try again later.')
			console.error('Error saving project data:', error)
		}
	}

	const handleViewProjectDetails = () => {
		// Navigate to the project details page
		if (editProjectStore.projectID) {
			router.push(`/project/${editProjectStore.projectID}`)
		} else {
			router.push('/project-details') // replace with the actual path when the page available
		}
	}

	const handleContinueEditing = () => {
		// Close the modal and stay on the current page
		setIsCompletionModalOpen(false)
	}

	// Render image previews for the folder component
	const renderImagePreviews = () => {
		// Take only the first 3 images (or fewer if there aren't 3)
		return editProjectStore.images.slice(0, 3).map((image, index) => (
			<div
				key={index}
				className="w-full h-full flex items-center justify-center"
			>
				<Image
					src={image}
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

	const handleProjectImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files)

			// Check if adding these images would exceed the 3-image limit
			const remainingSlots = 3 - editProjectStore.images.length

			if (remainingSlots <= 0) {
				toast.warning(
					'Maximum of 3 images allowed. Please delete some images before adding more.'
				)
				return
			}

			// Limit the number of files to process based on remaining slots
			const filesToProcess = files.slice(0, remainingSlots)

			// Process each file to get base64 strings with resizing
			const base64Images = await Promise.all(
				filesToProcess.map((file) => resizeAndConvertToBase64(file, false))
			)

			// Add the new images to state
			editProjectStore.setImages([...editProjectStore.images, ...base64Images])

			// Open the folder when files are selected
			setImageUploadFolderOpen(true)

			// Show notification if some files were skipped due to the limit
			if (files.length > remainingSlots) {
				toast.info(
					`Only added ${remainingSlots} image(s). Maximum of 3 images allowed.`
				)
			}
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

			// Convert file to base64 with resizing and set it in the store
			const logoBase64 = await resizeAndConvertToBase64(file, true)
			editProjectStore.setLogo(logoBase64)
			setProjectLogoPreview(logoBase64)

			// Open the folder when file is selected
			setLogoUploadFolderOpen(true)
		}
	}

	const handleLogoDelete = () => {
		editProjectStore.setLogo(undefined)
		setProjectLogoPreview(undefined)
	}

	const handleImageDelete = (deleteIndex: number) => {
		const updatedImages = editProjectStore.images.filter(
			(_, index) => index !== deleteIndex
		)
		editProjectStore.setImages(updatedImages)
	}

	return (
		<>
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
												value={editProjectStore.name}
												onChange={(e) => {
													editProjectStore.setName(e.target.value)
												}}
												placeholder="Enter your project name"
												className="p-4 pr-12 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
											/>
											<span title="Click to edit">
												<Edit2
													size={18}
													className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
												/>
											</span>
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
												value={editProjectStore.shortDescription || ''}
												onChange={(e) => {
													const words = e.target.value.trim().split(/\s+/)
													if (
														words.length <= 100 ||
														e.target.value.length <
															editProjectStore?.shortDescription?.length
													) {
														editProjectStore.setShortDescription(e.target.value)
													}
												}}
												placeholder="Brief overview of your project (100 words max)"
												className="p-4 pr-12 font-comfortaa text-white rounded-lg glass-component-2 h-32 resize-none w-full"
											/>
											<span title="Click to edit">
												<Edit2
													size={18}
													className="absolute right-4 top-8 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
												/>
											</span>
										</div>
										<div className="text-xs text-gray-400 text-right font-comfortaa">
											{
												editProjectStore.shortDescription
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
										<div className="relative w-full">
											<textarea
												id="longDescription"
												value={editProjectStore.longDescription}
												onChange={(e) => {
													editProjectStore.setLongDescription(e.target.value)
												}}
												placeholder="Detailed description of your project"
												className="p-4 pr-12 rounded-lg glass-component-2 text-white font-comfortaa h-56 resize-none w-full"
											/>
											<span title="Click to edit">
												<Edit2
													size={18}
													className="absolute right-4 top-8 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
												/>
											</span>
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
													className="custom-folder select-none"
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
											{editProjectStore.images.length > 0
												? editProjectStore.images.length >= 3
													? 'Maximum images reached. Click manage uploaded images to change.'
													: `${editProjectStore.images.length} image(s) selected. Click to add more.`
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
														<p>
															Only one image can be uploaded as project logo
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<div className="h-20 relative mt-2 overflow-visible">
											<div className="absolute -top-4 left-1/2 -translate-x-1/2">
												<Folder
													size={0.8}
													color="#00d8ff"
													className="custom-folder select-none"
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
											{editProjectStore.logo
												? 'Logo selected. Click to change.'
												: 'Drag & drop your project logo here\nor click to browse'}
										</p>
										<span className="text-cyan-400 font-bold mt-2 text-xs">
											Recommended: 512×512px, PNG (transparent)
										</span>
									</div>
								</div>

								{(editProjectStore.images.length > 0 ||
									editProjectStore.logo) && (
									<div className="w-full mb-6">
										<ImageManager
											images={editProjectStore.images.map((base64, index) => ({
												id: index.toString(),
												base64,
												name: `Image ${index + 1}`,
											}))}
											logo={
												editProjectStore.logo
													? {
															base64: editProjectStore.logo,
															name: 'Project Logo',
														}
													: null
											}
											onDeleteImage={(id) => handleImageDelete(parseInt(id))}
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
											value={editProjectStore.targetAudience}
											onChange={(e) => {
												editProjectStore.setTargetAudience(e.target.value)
											}}
											placeholder="Describe your target audience (e.g., DeFi users, NFT collectors, etc.)"
											className="p-4 pr-12 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
										/>
										<span title="Click to edit">
											<Edit2
												size={18}
												className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
											/>
										</span>
									</div>
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
										<div className="relative w-full">
											<input
												id="website"
												value={website}
												onChange={(e) => {
													setWebsite(e.target.value)
													editProjectStore.setSocials({
														...editProjectStore.socials,
														website: e.target.value,
													})
												}}
												placeholder="https://yourproject.com"
												className="p-4 pr-12 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
											/>
											<span title="Click to edit">
												<Edit2
													size={18}
													className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
												/>
											</span>
										</div>
									</div>

									<div className="flex flex-col space-y-3 w-full">
										<label
											htmlFor="twitter"
											className="text-gray-300 text-xl font-comfortaa"
										>
											Twitter/X
										</label>
										<div className="relative w-full">
											<input
												id="twitter"
												value={twitter}
												onChange={(e) => {
													setTwitter(e.target.value)
													editProjectStore.setSocials({
														...editProjectStore.socials,
														twitter: e.target.value,
													})
												}}
												placeholder="https://twitter.com/yourproject"
												className="p-4 pr-12 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
											/>
											<span title="Click to edit">
												<Edit2
													size={18}
													className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
												/>
											</span>
										</div>
									</div>

									<div className="flex flex-col space-y-3 w-full">
										<label
											htmlFor="telegram"
											className="text-gray-300 text-xl font-comfortaa"
										>
											Telegram
										</label>
										<div className="relative w-full">
											<input
												id="telegram"
												value={telegram}
												onChange={(e) => {
													setTelegram(e.target.value)
													editProjectStore.setSocials({
														...editProjectStore.socials,
														telegram: e.target.value,
													})
												}}
												placeholder="https://t.me/yourproject"
												className="p-4 pr-12 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
											/>
											<span title="Click to edit">
												<Edit2
													size={18}
													className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
												/>
											</span>
										</div>
									</div>

									<div className="flex flex-col space-y-3 w-full">
										<label
											htmlFor="discord"
											className="text-gray-300 text-xl font-comfortaa"
										>
											Discord
										</label>
										<div className="relative w-full">
											<input
												id="discord"
												value={discord}
												onChange={(e) => {
													setDiscord(e.target.value)
													editProjectStore.setSocials({
														...editProjectStore.socials,
														discord: e.target.value,
													})
												}}
												placeholder="https://discord.gg/yourproject"
												className="p-4 pr-12 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
											/>
											<span title="Click to edit">
												<Edit2
													size={18}
													className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
												/>
											</span>
										</div>
									</div>

									<div className="flex flex-col space-y-3 w-full">
										<label
											htmlFor="github"
											className="text-gray-300 text-xl font-comfortaa"
										>
											GitHub
										</label>
										<div className="relative w-full">
											<input
												id="github"
												value={github}
												onChange={(e) => {
													setGithub(e.target.value)
													editProjectStore.setSocials({
														...editProjectStore.socials,
														github: e.target.value,
													})
												}}
												placeholder="https://github.com/yourproject"
												className="p-4 pr-12 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
											/>
											<span title="Click to edit">
												<Edit2
													size={18}
													className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity"
												/>
											</span>
										</div>
									</div>
								</div>

								<div className="mt-4 mb-2 rounded-lg bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-4 border-l-4 border-cyan-500 backdrop-blur-sm">
									<p className="text-gray-300 text-center font-comfortaa max-w-3xl mx-auto leading-relaxed">
										<span className="text-cyan-400 font-bold">
											Connect your community
										</span>{' '}
										by adding links to your social media and community
										platforms. Providing these links helps potential supporters
										find and engage with your project.
									</p>
								</div>
							</div>
						</Step>
					</Stepper>
				</div>
			</div>

			{/* --------------------------------------Toast----------------------------------------------------- */}
			<ToastContainer
				position="top-right"
				autoClose={4000}
				hideProgressBar={true}
			/>

			{/* --------------------------------------Modal to indicate saving project----------------------------------------------- */}
			<LoadingModal
				isOpen={isSavingProject}
				message="Saving project information"
				subMessage="Please wait while we save your project data"
			/>

			{/* --------------------------------------Project Completion Modal----------------------------------------------- */}
			<ProjectCompletionModal
				isOpen={isCompletionModalOpen}
				projectId={editProjectStore.projectID}
				projectName={editProjectStore.name || 'Your Project'}
				onViewDetails={handleViewProjectDetails}
				onContinueEditing={handleContinueEditing}
			/>
		</>
	)
}

export default EditProject
