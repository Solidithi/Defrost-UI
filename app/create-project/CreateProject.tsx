'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import SplitText from '../components/UI/SplitText'
import Stepper, { Step } from '../components/UI/Stepper'
import NetworkSelector from '../components/UI/NetworkSelector'
import Folder from '../components/UI/Folder'
import ImageManager from '../components/UI/ImageManager'
import Image from 'next/image'

interface ImageItem {
	id: string
	url: string
	file: File
}

const CreateProject = () => {
	const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
	const [name, setName] = useState('')
	const [shortDescription, setShortDescription] = useState('')
	const [longDescription, setLongDescription] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [targetAudience, setTargetAudience] = useState('')

	// Use ImageItem[] instead of separate state variables for images and previews
	const [projectImages, setProjectImages] = useState<ImageItem[]>([])
	const [projectLogo, setProjectLogo] = useState<File | null>(null)
	const [projectLogoPreview, setProjectLogoPreview] = useState<string | null>(
		null
	)
	const [imageUploadFolderOpen, setImageUploadFolderOpen] = useState(false)
	const [logoUploadFolderOpen, setLogoUploadFolderOpen] = useState(false)

	const availableNetworks = [
		{
			id: 'moonbeam',
			name: 'Moonbeam',
		},
		{
			id: 'astar',
			name: 'Astar',
		},
		{
			id: 'polkadot',
			name: 'Polkadot',
		},
		{
			id: 'kusama',
			name: 'Kusama',
		},
	]

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
		setSelectedNetwork(option.name)
		// console.log(`Selected network: ${option.name}`)
	}

	const handleModalStateChange = (isOpen: boolean) => {
		setIsModalOpen(isOpen)
	}

	const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files)

			// Process each file
			files.forEach((file) => {
				const reader = new FileReader()
				reader.onload = (event) => {
					if (event.target?.result) {
						const newImage: ImageItem = {
							id: uuidv4(), // Generate a unique ID
							url: event.target.result as string,
							file: file,
						}

						// Add the new image to state
						setProjectImages((prev) => [...prev, newImage])
					}
				}
				reader.readAsDataURL(file)
			})

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

	const handleImageDelete = (imageId: string) => {
		setProjectImages((prevImages) =>
			prevImages.filter((image) => image.id !== imageId)
		)
	}

	return (
		<div className="p-10 flex flex-col items-center justify-center ">
			<div
				className={`mt-44 text-center ${isModalOpen ? 'blur-sm pointer-events-none' : ''}`}
			>
				<SplitText
					text="Fill your project's information"
					className="text-7xl text-center font-bold text-white font-orbitron"
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
					className="text-lg text-center text-gray-300 font-comfortaa"
					delay={10}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div
				className={`mt-8 w-2/3 h-auto glass-component-3 rounded-2xl p-8 transition-all duration-300`}
			>
				<Stepper
					className="w-full"
					initialStep={1}
					onStepChange={(step: any) => {
						console.log(step)
					}}
					onFinalStepCompleted={() => console.log('All steps completed!')}
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
								/>
							</div>
							<div className=""></div>
							<p className="text-gray-300 text-center mt-4 font-comfortaa">
								Choose the blockchain network where your launchpool will be
								deployed
							</p>
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
										value={name}
										onChange={(e) => setName(e.target.value)}
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
										value={shortDescription}
										onChange={(e) => {
											const words = e.target.value.trim().split(/\s+/)
											if (
												words.length <= 100 ||
												e.target.value.length < shortDescription.length
											) {
												setShortDescription(e.target.value)
											}
										}}
										placeholder="Brief overview of your project (100 words max)"
										className="p-4 font-comfortaa text-white rounded-lg glass-component-2 h-32 resize-none w-full"
									/>
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
									<textarea
										id="longDescription"
										value={longDescription}
										onChange={(e) => setLongDescription(e.target.value)}
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
										{projectImages.length > 0
											? `${projectImages.length} image(s) selected. Click to add more.`
											: 'Drag & drop your project images here\nor click to browse'}
									</p>
									<p className="text-xs text-gray-400 mt-2">
										Recommended: 1200×630px, PNG or JPG
									</p>
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
									<p className="text-xs text-gray-400 mt-2">
										Recommended: 512×512px, PNG (transparent)
									</p>
								</div>
							</div>

							{projectImages.length > 0 && (
								<div className="w-full mb-6">
									<ImageManager
										images={projectImages}
										onDelete={handleImageDelete}
										title="Manage Project Images"
										buttonText="Manage Uploaded Images"
										emptyText="No images uploaded yet"
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
									value={targetAudience}
									onChange={(e) => setTargetAudience(e.target.value)}
									placeholder="Describe your target audience (e.g., DeFi users, NFT collectors, etc.)"
									className="p-4 rounded-lg font-comfortaa text-white glass-component-2 focus:outline-none w-full"
								/>
							</div>
						</div>
					</Step>
				</Stepper>
			</div>
		</div>
	)
}

export default CreateProject
