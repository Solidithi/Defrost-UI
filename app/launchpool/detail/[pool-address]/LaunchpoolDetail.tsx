'use client'

import Image, { StaticImageData } from 'next/image'
import Logo from '@/public/Logo.png'
import ProjectHeader, {
	ProjectHeaderProps,
} from '@/app/components/project-detail-sections/ProjectHeader'
import ThumbNailCarousel from '@/app/components/UI/carousel/ThumbnailCarousel'
import ProjectProgress from '@/app/components/UI/project-progress/ProjectProgress'
import StakeArea from '@/app/components/UI/shared/StakeArea'
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalProvider,
	useModal,
} from '@/app/components/UI/modal/AnimatedModal'
import { motion } from 'framer-motion'
import Tabs from '@/app/components/UI/shared/Tabs'
import {
	AllPoolsTab,
	DescriptionTab,
} from '@/app/components/project-detail-sections/ContentTab'
import AnimatedBlobs from '@/app/components/UI/background/AnimatedBlobs'
import { useEffect, useMemo, useState } from 'react'
import type { ProjectDetail } from '@/app/types'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Address } from 'viem'
import { useApproveAndeDepositToken } from '@/app/hooks/useApproveAndSendToken'
import { getFunctionAbiFromIface } from '@/app/components/UI/modal/launchpool-service-modals'
import { Launchpool__factory } from '@/app/types/typechain'
import { useStakeAreaStore } from '@/app/store/launchpool'
import { parseUnits } from 'ethers'
import { TokenInfo, useFilteredPoolByStakingToken } from '@/app/store/staking'
import { useLaunchpoolTokenInfo, useVTokenData } from '@/app/hooks/staking'

function PoolList({
	pools,
	onPoolClick,
}: {
	pools: ProjectDetail['pools']
	onPoolClick: (pool: ProjectDetail['pools'][number]) => void
}) {
	const { setOpen } = useModal()
	return (
		<>
			{pools.map((pool) => (
				<div key={pool.id}>
					<motion.div
						className="glass-enhanced h-12 mb-6 rounded-xl flex items-center hover:bg-gray-700 transition-colors duration-300"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						onClick={() => {
							setTimeout(() => {
								setOpen(false)
								onPoolClick?.(pool)
								// console.log('Pool clicked:', pool)
							}, 250)
						}}
					>
						<div className="mx-3 bg-white rounded-full w-8 h-8" />
						<div className="text-white font-bold">{pool.name}</div>
					</motion.div>
				</div>
			))}
		</>
	)
}

const ProjectDetail = () => {
	const params = useParams()
	const poolAddress = params['pool-address']
	const [projectDetail, setProjectDetailData] = useState<
		ProjectDetail | undefined
	>()
	const [headerProp, setProjectHeaderProp] = useState<
		ProjectHeaderProps | undefined
	>()
	// const [tokenPair, setTokenPair] = useState<TokenInfo | undefined>()
	const projectId = params['project-id']
	const { stakeAmount } = useStakeAreaStore()
	const { availableVTokens } = useVTokenData()
	console.log('Available VTokens:', availableVTokens)
	const filteredPools = useFilteredPoolByStakingToken(
		availableVTokens[0] || null
	)
	console.log('Filtered Pools:', filteredPools)
	const tokenPair = useLaunchpoolTokenInfo(filteredPools[0])
	console.log('Token Pair:', tokenPair)
	const tokenPairVToken = tokenPair.tokensInfo.vTokenInfo

	const parsedStakeAmount = useMemo(() => {
		if (!stakeAmount) return BigInt(0)
		return parseUnits(stakeAmount.toString(), tokenPairVToken.decimals)
	}, [stakeAmount, tokenPairVToken.decimals])

	const { deposit } = useApproveAndeDepositToken({
		depositFunctionABI: getFunctionAbiFromIface(Launchpool__factory, 'stake'),
		depositFunctionName: 'stake',
		depositFunctionArgs: [parsedStakeAmount],
		amount: parsedStakeAmount,
		recipientAddress: poolAddress as `0x${string}`,
		tokenAddress: tokenPairVToken.address as `0x${string}`,
	})

	// const headerProp: ProjectHeaderProps = {
	// 	id: 1,
	// 	name: 'Project Name',
	// 	description:
	// 		'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
	// 	image: Logo,
	// 	status: 'Upcoming',
	// }
	// const projectDetail: ProjectDetail = {
	// 	id: 1,
	// 	name: 'Project Name',
	// 	description:
	// 		'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
	// 	logoImage: Logo,
	// 	projectImages: [
	// 		{
	// 			src: 'https://i.pinimg.com/736x/2e/3d/68/2e3d6845011de0d24c13dd1e1028a2ff.jpg',
	// 			// alt: 'Beautiful Landscape 1',
	// 			// description: 'Description 01',
	// 		},
	// 		{
	// 			src: 'https://i.pinimg.com/474x/05/6d/d3/056dd39fccee614d4e46d77ef8814bf8.jpg',
	// 			// alt: 'Beautiful Landscape 2',
	// 			// description: 'Description 02',
	// 		},
	// 		{
	// 			src: 'https://i.pinimg.com/474x/ef/78/99/ef7899d792526a5d10f33c30ad250617.jpg',
	// 			// alt: 'Beautiful Landscape 3',
	// 			//description: 'Description 03',
	// 		},
	// 		{
	// 			src: 'https://i.pinimg.com/474x/f3/d7/c4/f3d7c40d3d574efc7f7a03db93a3c8a2.jpg',
	// 			// alt: 'Something',
	// 			// description: 'Something',
	// 		},
	// 	],
	// 	status: 'Upcoming',
	// 	pools: [
	// 		{
	// 			id: 1,
	// 			name: 'Token Pool 1',
	// 			amount: 1000,
	// 			v_asset_address: '0x1234567890abcdef1234567890abcdef12345678',
	// 			percentage: 10,
	// 		},
	// 		{
	// 			id: 2,
	// 			name: 'Token Pool 2',
	// 			amount: 2000,
	// 			v_asset_address: '0xabcdef1234567890abcdef1234567890abcdef12',
	// 			percentage: 20,
	// 		},
	// 		{
	// 			id: 3,
	// 			name: 'Token Pool 3',
	// 			amount: 3000,
	// 			v_asset_address: '0x7890abcdef1234567890abcdef1234567890abcd',
	// 			percentage: 30,
	// 		},
	// 		//Create total 10 pools
	// 		{
	// 			id: 4,
	// 			name: 'Token Pool 4',
	// 			amount: 4000,
	// 			v_asset_address: '0x4567890abcdef1234567890abcdef1234567890',
	// 			percentage: 40,
	// 		},
	// 		{
	// 			id: 5,
	// 			name: 'Token Pool 5',
	// 			amount: 5000,
	// 			v_asset_address: '0xabcdef1234567890abcdef1234567890abcdef34',
	// 			percentage: 50,
	// 		},
	// 		{
	// 			id: 6,
	// 			name: 'Token Pool 6',
	// 			amount: 6000,
	// 			v_asset_address: '0x1234567890abcdef1234567890abcdef12345690',
	// 			percentage: 60,
	// 		},
	// 		{
	// 			id: 7,
	// 			name: 'Token Pool 7',
	// 			amount: 7000,
	// 			v_asset_address: '0x7890abcdef1234567890abcdef12345678901234',
	// 			percentage: 70,
	// 		},
	// 		{
	// 			id: 8,
	// 			name: 'Token Pool 8',
	// 			amount: 8000,
	// 			v_asset_address: '0x4567890abcdef1234567890abcdef1234567890ab',
	// 			percentage: 80,
	// 		},
	// 		{
	// 			id: 9,
	// 			name: 'Token Pool 9',
	// 			amount: 9000,
	// 			v_asset_address: '0xabcdef1234567890abcdef1234567890abcdef56',
	// 			percentage: 90,
	// 		},
	// 	],
	// 	socials: {
	// 		website: 'https://www.example.com',
	// 		twitter: 'https://twitter.com/example',
	// 		telegram: 'https://t.me/example',
	// 		discord: 'https://discord.gg/example',
	// 		github: 'https://github.com/example',
	// 	},
	// }

	const tabs = [
		{
			title: 'Description',
			value: 'description',
			content: <DescriptionTab description={projectDetail?.longDescription} />,
		},

		{
			title: 'All Pools',
			value: 'allPools',
			content: (
				<div className="flex flex-col gap-4">
					<AllPoolsTab
						projectCards={
							projectDetail?.pools?.map((pool) => ({
								projectName: pool.name,
								projectShortDescription: `Amount: ${pool.amount}, Percentage: ${pool.percentage}%`,
								projectAPR: `${pool.percentage}%`,
							})) ?? []
						}
					/>
				</div>
			),
		},
		// {
		// 	title: 'Pools',
		// 	value: 'pools',
		// 	content: (
		// 		<div className="flex flex-col gap-4">
		// 			{/* Add content for Pools tab */}
		// 			<p>Pools Content</p>
		// 		</div>
		// 	),
		// },
	]

	const handleDeposit = (poolAddress: Address) => {}

	useEffect(() => {
		const fetchProjectDetail = async () => {
			try {
				const response = await axios.get('/api/project-launchpool', {
					params: { projectId: poolAddress },
				})
				if (!response) {
					throw new Error('No data found for the project')
				}

				console.log('Response:', response.data)
				const data: ProjectDetail = response.data.projectDetails
				console.log('Project Detail Data:', data)
				setProjectDetailData(data)
				setProjectHeaderProp({
					id: data.id,
					name: data.name,
					description: data.shortDescription,
					image: data.logoImage as StaticImageData,
					// status: data.status,
					status: 'Upcoming', // Placeholder, replace with actual status logic
				})
			} catch (error) {
				console.error('Error fetching project detail:', error)
			}
		}
		fetchProjectDetail()
	}, [poolAddress])

	return (
		<ModalProvider>
			<Modal>
				<div className="min-h-screen w-full">
					<AnimatedBlobs count={5} />
					{/* Header */}
					<div className="px-20  pt-48 pb-12">
						{headerProp && <ProjectHeader {...headerProp} />}
					</div>

					{/* Main Content */}
					<div className="flex items-start justify-center gap-12 mb-10">
						{/* Left Column */}
						<div className="w-7/12">
							<ThumbNailCarousel projectImages={projectDetail?.projectImages} />

							{/* Long content to allow scrolling */}
							{/* <div className="glass-enhanced text-white mt-10 p-6 rounded-lg">
							<p>
								{Array(20)
									.fill(
										'If you have funded this project, we will be in touch to let you know when the rewards have started distributing and when you can claim them.'
									)
									.join(' ')}
							</p>
						</div> */}

							<div className="mb-28">
								{/* <Tabs
								tabs={tabs}
								activeTabClassName="bg-white text-white dark:bg-zinc-800"
								tabClassName="text-white hover:bg-gray-700 dark:hover:bg-zinc-800"
								containerClassName=" mt-10"
								contentClassName=""
								// onTabClick={handleTabClick}
							></Tabs> */}
								<Tabs
									tabs={tabs}
									activeTabClassName="bg-white text-[#59A1EC] dark:bg-zinc-800"
									tabClassName="text-gray-300 rounded-lg px-3 py-2 hover:bg-gray-700 dark:hover:bg-zinc-800 z-10"
									containerClassName=" mt-10"
									// contentClassName="bg-gray-800 dark:bg-zinc-800 rounded-lg p-6"
								/>
							</div>
						</div>

						{/* Right Sticky Column */}
						<div className="w-3/12 h-fit sticky top-12 flex flex-col">
							<div className="">
								<ProjectProgress socials={projectDetail?.socials} />
							</div>
							<div className="">
								<StakeArea />
							</div>
						</div>
					</div>
					<ModalBody>
						<ModalContent>
							<div className="z-30">
								<div className="mb-9 font-orbitron font-bold text-white text-center text-xl">
									All Pool
								</div>
								<div className="max-h-96 overflow-x-hidden overflow-y-auto px-4">
									<PoolList
										pools={projectDetail?.pools ?? []}
										onPoolClick={(pool) => setTokenPair(pool)}
									/>
									{/* {projectDetail.pools.map((pool) => (
										<div key={pool.id}>
											<motion.div
												className="glass-enhanced h-12 mb-6 rounded-xl flex flex-row items-center hover:bg-gray-700 transition-colors duration-300"
												whileHover={{
													scale: 1.05,
													// backgroundColor: '#4B5563',
												}}
												whileTap={{ scale: 0.95 }}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3 }}
												onClick={() => setOpen(false)}
											>
												{/* Add content inside the glass component if needed */}
									{/* <div className="mx-3 bg-white rounded-full w-8 h-8"></div> */}
									{/* <div className="text-white font-bold">{pool.name}</div> */}
									{/* </motion.div> */}
									{/* </div> */}
									{/* ))} */}
								</div>
							</div>
						</ModalContent>
					</ModalBody>
				</div>
			</Modal>
		</ModalProvider>
	)
}

export default ProjectDetail
