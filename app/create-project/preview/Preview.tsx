'use client'

import Image from 'next/image'
import Logo from '@/public/Logo.png'
import ProjectHeader from '@/app/components/project-detail-sections/ProjectHeader'
import ThumbNailCarousel from '@/app/components/UI/carousel/ThumbnailCarousel'
import ProjectProgress from '@/app/components/UI/project-progress/ProjectProgress'

import {
	Modal,
	ModalBody,
	ModalContent,
} from '@/app/components/UI/modal/AnimatedModal'
import { motion } from 'framer-motion'
import Tabs from '@/app/components/UI/shared/Tabs'
import {
	AllPoolsTab,
	DescriptionTab,
} from '@/app/components/project-detail-sections/ContentTab'
import {
	useAccount,
	useChainId,
	useReadContract,
	useWriteContract,
	useWaitForTransactionReceipt,
} from 'wagmi'
import Button from '@/app/components/UI/button/Button'
import Spinner from '@/app/components/UI/effect/Spinner'

import { abi as ProjectHubABI } from '@/abi/ProjectHubUpgradeable.json'
import { useCreateProjectStore } from '@/app/store/create-project'
import StakeArea from '@/app/components/UI/shared/StakeArea'
import chains from '@/app/config/chains.json'
import { useEffect, useState } from 'react'
import { normalizeAddress } from '@/app/lib/utils'
import { fileToBase64 } from '@/app/lib/utils'

const Preview = () => {
	const createProjectStore = useCreateProjectStore((state) => state)
	const account = useAccount()
	const chainIdStr = account?.chainId?.toString() || ''
	const projectHubProxyAddress = chains[chainIdStr as keyof typeof chains]
		?.deployedContracts?.ProjectHubUpgradeableProxy as `0x${string}`

	const [isWaitingForIndexer, setIsWaitingForIndexer] = useState(false)
	const [isUpdatingDetails, setIsUpdatingDetails] = useState(false)
	const [finalError, setFinalError] = useState<string | null>(null)
	const [isProjectCreated, setIsProjectCreated] = useState(false)

	const {
		writeContract: createProject,
		status: createProjectStatus,
		data: createProjectHash,
	} = useWriteContract()

	const { status: createProjectReceiptStatus, data: createProjectReceipt } =
		useWaitForTransactionReceipt({
			hash: createProjectHash,
		})

	useEffect(() => {
		if (
			createProjectStore.longDescription &&
			createProjectStore.shortDescription &&
			createProjectStore.images.length > 0 &&
			createProjectStore.logo &&
			createProjectStore.name
		) {
			console.log('Setting createProjectStore to complete')
			createProjectStore.setIsComplete(true)
		}
	}, []) // Empty dependency array ensures this runs only once

	useEffect(() => {
		console.log('Receipt Status:', createProjectReceiptStatus)
		console.log('Receipt Data:', createProjectReceipt)

		if (createProjectReceiptStatus === 'success') {
			console.log('Transaction confirmed! Receipt:', createProjectReceipt)
			// --- START POLLING FOR INDEXER HERE ---
			setIsWaitingForIndexer(true)
			setFinalError(null) // Clear previous errors

			const txHash = normalizeAddress(createProjectReceipt.transactionHash)
			pollIndexerStatus(txHash) // Call the polling function (implement below)
		} else if (createProjectReceiptStatus === 'error') {
			console.error('Error waiting for transaction receipt')
			setFinalError('Error confirming transaction on-chain.')
			// Reset other statuses if needed
			setIsWaitingForIndexer(false)
			setIsUpdatingDetails(false)
		}
	}, [createProjectReceiptStatus, createProjectReceipt]) // Depend on status and receipt data

	/** Continual API call to know deteremine whether indexer saved project */
	const pollIndexerStatus = async (txHash: `0x${string}`) => {
		const maxRetries = 20 // e.g., 20 retries * 3 seconds = 1 minute timeout
		const interval = 3000 // 3 seconds
		let retries = 0

		const poll = async () => {
			if (retries >= maxRetries) {
				console.error('Polling timed out waiting for indexer.')
				setFinalError('Indexer did not process the transaction in time.')
				setIsWaitingForIndexer(false)
				return
			}

			try {
				console.log(`Polling indexer... Attempt ${retries + 1}`)
				const response = await fetch(
					`/api/create-project/is-indexed?txHash=${txHash}`
				)
				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}`)
				}
				const { isIndexed } = await response.json()

				if (isIndexed) {
					console.log('Indexer confirmed record exists!')
					setIsWaitingForIndexer(false)
					await updateProjectDetails(txHash)
				} else {
					retries++
					setTimeout(poll, interval)
				}
			} catch (error) {
				console.error('Polling error:', error)
				setFinalError('Error checking indexer status.')
				setIsWaitingForIndexer(false)
				// Optionally retry on specific errors or stop immediately
				// retries++;
				// setTimeout(poll, interval);
				// Or push to queue to handle later
			}
		}

		await poll() // Start the first poll
	}

	const handleCreateProject = () => {
		console.log('handling create project')

		if (!createProjectStore.isComplete) {
			console.error('createProjectStore is not complete')
			console.log('createProjectStore', createProjectStore)
			return
		}

		if (!projectHubProxyAddress) {
			console.error('ProjectHubProxy address is not defined')
			return
		}

		console.log('Creating project with hub address:', projectHubProxyAddress)
		createProject({
			abi: ProjectHubABI,
			address: projectHubProxyAddress,
			functionName: 'createProject',
		})
	}

	// --- Determine Button Text/State ---
	const getButtonState = () => {
		if (createProjectStatus === 'pending')
			return { text: 'Submitting...', loading: true, disabled: true }
		else if (
			createProjectReceiptStatus === 'pending' &&
			createProjectStatus !== 'idle'
		)
			return { text: 'Confirming Tx...', loading: true, disabled: true }
		if (isWaitingForIndexer)
			return { text: 'Waiting for Indexer...', loading: true, disabled: true }
		if (isUpdatingDetails)
			return { text: 'Saving Details...', loading: true, disabled: true }
		if (isProjectCreated)
			return { text: 'Project Created!', loading: false, disabled: true } // Or maybe enable for another action
		if (finalError)
			return { text: 'Error Occurred', loading: false, disabled: false } // Allow retry?
		return {
			text: 'YOLO! (Deploy Project)',
			loading: false,
			disabled: account.isDisconnected || !createProjectStore.isComplete,
		}
	}

	const buttonState = getButtonState()

	// Replace the hardcoded projectDetail with data from the store
	const projectDetail = {
		id: 1,
		name: createProjectStore.name || 'Project Name',
		description:
			createProjectStore.shortDescription || 'No description available.',
		image: createProjectStore.logo
			? URL.createObjectURL(createProjectStore.logo)
			: Logo,
		status: 'Upcoming',
		tokenPools: [
			{
				id: 1,
				name: 'Token Pool 1',
				amount: 1000,
				percentage: 10,
			},
			{
				id: 2,
				name: 'Token Pool 2',
				amount: 2000,
				percentage: 20,
			},
			{
				id: 3,
				name: 'Token Pool 3',
				amount: 3000,
				percentage: 30,
			},
			//Create total 10 pools
			{
				id: 4,
				name: 'Token Pool 4',
				amount: 4000,
				percentage: 40,
			},
			{
				id: 5,
				name: 'Token Pool 5',
				amount: 5000,
				percentage: 50,
			},
			{
				id: 6,
				name: 'Token Pool 6',
				amount: 6000,
				percentage: 60,
			},
			{
				id: 7,
				name: 'Token Pool 7',
				amount: 7000,
				percentage: 70,
			},
			{
				id: 8,
				name: 'Token Pool 8',
				amount: 8000,
				percentage: 80,
			},
			{
				id: 9,
				name: 'Token Pool 9',
				amount: 9000,
				percentage: 90,
			},
		],
	}

	// Update tabs to show the actual long description from the store
	const tabs = [
		{
			title: 'Description',
			value: 'description',
			content: (
				<DescriptionTab description={createProjectStore.longDescription} />
			),
		},

		{
			title: 'All Pools',
			value: 'allPools',
			content: (
				<div className="flex flex-col gap-4">
					<AllPoolsTab
						projectCards={projectDetail.tokenPools.map((pool) => ({
							projectName: pool.name,
							projectShortDescription: `Amount: ${pool.amount}, Percentage: ${pool.percentage}%`,
							projectAPR: `${pool.percentage}%`,
						}))}
					/>
				</div>
			),
		},
	]

	return (
		<Modal>
			<div className="min-h-screen w-full">
				{/* Header */}
				<div className="px-20  pt-48 pb-12">
					<ProjectHeader projectDetail={projectDetail} />
				</div>

				{/* Main Content */}
				<div className="flex items-start justify-center gap-12 m-">
					{/* Left Column */}
					<div className="w-7/12">
						<ThumbNailCarousel
							projectImages={
								createProjectStore.images.length > 0
									? createProjectStore.images.map((file, index) => ({
											src: URL.createObjectURL(file),
											alt: `Project Image ${index + 1}`,
											description: `Project Image ${index + 1}`,
										}))
									: undefined
							}
						/>

						<div className="mb-48">
							<Tabs
								tabs={tabs}
								activeTabClassName="bg-white text-[#59A1EC] dark:bg-zinc-800"
								tabClassName="text-gray-300 rounded-lg px-3 py-2 hover:bg-gray-700 dark:hover:bg-zinc-800"
								containerClassName=" mt-10"
							/>
						</div>
					</div>

					{/* Right Sticky Column */}
					<div className="w-3/12 h-fit sticky top-12 flex flex-col">
						<div className="">
							<ProjectProgress socials={createProjectStore.socials} />
						</div>
						<div className="">
							<StakeArea />
						</div>
						<Button
							onClick={handleCreateProject}
							disabled={buttonState.disabled}
							className="mt-6 mb-4"
						>
							<span className="font-bold">
								{buttonState.text} &nbsp;
								{buttonState.loading && <Spinner heightWidth={5} />}
							</span>
						</Button>
						{finalError && (
							<p className="text-red-500 text-xs text-center mt-2">
								{finalError}
							</p>
						)}
						{isProjectCreated && (
							<p className="text-green-500 text-xs text-center mt-2">
								Project successfully created and details saved!
							</p>
						)}
					</div>
				</div>
				<ModalBody>
					<ModalContent>
						<div className="z-30">
							<div className="mb-9 font-orbitron font-bold text-white text-center text-xl">
								All Pool
							</div>
							<div className="max-h-96 overflow-x-hidden overflow-y-auto px-4">
								{projectDetail.tokenPools.map((pool) => (
									<div key={pool.id}>
										<motion.div
											className="glass-component-1 h-12 mb-6 rounded-xl flex flex-row items-center hover:bg-gray-700 transition-colors duration-300"
											whileHover={{
												scale: 1.05,
												// backgroundColor: '#4B5563',
											}}
											whileTap={{ scale: 0.95 }}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
										>
											{/* Add content inside the glass component if needed */}
											<div className="mx-3 bg-white rounded-full w-8 h-8"></div>
											<div className="text-white font-bold">{pool.name}</div>
										</motion.div>
									</div>
								))}
							</div>
						</div>
					</ModalContent>
				</ModalBody>
			</div>
		</Modal>
	)
}

export default Preview
