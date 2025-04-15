'use client'

import { useState, useRef } from 'react'
import SplitText from '../components/UI/SplitText'
import CarouselWithProgress from '../components/UI/Carousel'
import GlowingSearchBar from '../components/UI/GlowingSearchBar'
import ScrollFloat from '../components/UI/ScrollFloat'
import ShinyText from '../components/UI/ShinyText'
import StatCard from '../components/UI/StatCard'
import OverviewTrippleCard from '../components/UI/StatCard'
import SwitchTableOrCard from '../components/UI/SwitchTableOrCard'
import { orbitron, comfortaa } from '../lib/font'
import AllProjectCard from '../components/UI/AllProjectCard'
import SectionComponent from '../components/UI/SectionComponent'
import DataTable from '../components/UI/DataTable'
import { Column } from '../components/UI/DataTable'
import Image from 'next/image'
import { shortenStr } from '../lib/utils'
import StakingInTable from './StakingTableRow'
import { motion, AnimatePresence } from 'framer-motion'
import { Pool } from './StakingTableRow'

// Define project interface for DataTable
interface Project {
	id: string
	name: string
	logo?: string
	short_description: string
	token_symbol: string
	project_owner: string
	pool?: Pool[]
	token_address?: string
	created_at: Date
}

// Define stat card interface
interface StatCardItem {
	type: 'Total Project' | 'Total Staking' | 'Unique Participant'
	count: number
	label: string
	icon: string // Using string for icon URL instead of StaticImageData
}

const AllProject = () => {
	const [isCard, setIsCard] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [expandedRow, setExpandedRow] = useState<string | null>(null)

	// Define stat cards
	const statCardItems: StatCardItem[] = [
		{
			type: 'Total Project',
			count: 10,
			label: 'Total Project',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
		{
			type: 'Total Staking',
			count: 100,
			label: 'Total Staking',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
		{
			type: 'Unique Participant',
			count: 1000,
			label: 'Unique Participant',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
	]

	// Mock project data for demonstration
	const projects: Project[] = [
		{
			id: '1',
			name: 'Project Alpha',
			short_description:
				'A decentralized finance protocol focused on yield optimization',
			token_symbol: 'ALPHA',
			project_owner: '0xfd48761638e3a8c368abaefa9859cf6baa6c3c27',
			pool: [
				{
					id: 'pool1',
					type: 'launchpool' as const,
					staker_apy: 3.13,
					duration: 77,
					earned: 900,
					tokenSymbol: 'TOKEN',
					total_staked: BigInt(250000),
					total_stakers: 1500,
					description:
						'Stake tokens with no lock period. Withdraw anytime with lower APR.',
				},
				{
					id: 'pool2',
					type: 'launchpad' as const,
					staker_apy: 5.25,
					duration: 30,
					earned: 450,
					tokenSymbol: 'TOKEN',
					total_staked: BigInt(250000),
					total_stakers: 1500,
					description:
						'Stake to participate in upcoming token launches and IDOs.',
				},
				{
					id: 'pool3',
					// name: 'Yield Farming',
					type: 'farm' as const,
					staker_apy: 8.75,
					duration: 90,
					earned: 0,
					tokenSymbol: 'TOKEN',
					total_staked: BigInt(250000),
					total_stakers: 1500,
					description:
						'Provide liquidity and earn farming rewards with higher APR.',
				},
				{
					id: 'pool4',
					// name: 'Premium Launchpad',
					type: 'launchpad' as const,
					staker_apy: 12.5,
					duration: 180,
					earned: 0,
					tokenSymbol: 'TOKEN',
					total_stakers: 1500,
					total_staked: BigInt(250000),
					description:
						'Premium tier for early access to token sales with guaranteed allocation.',
				},
				{
					id: 'pool5',
					// name: 'High Yield Farm',
					type: 'farm' as const,
					staker_apy: 18.25,
					duration: 365,
					earned: 0,
					tokenSymbol: 'TOKEN',
					total_staked: BigInt(250000),
					total_stakers: 1500,
					description:
						'Long-term farming with boosted rewards and governance rights.',
				},
			],
			token_address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
			created_at: new Date('2023-06-15'),
		},
		{
			id: '2',
			name: 'Beta Chain',
			short_description:
				'Next generation blockchain with high throughput and low fees',
			token_symbol: 'BETA',
			project_owner: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			token_address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
			created_at: new Date('2023-08-22'),
		},
		{
			id: '3',
			name: 'Gamma Protocol',
			short_description:
				'Cross-chain interoperability solution for DeFi applications',
			token_symbol: 'GAMMA',
			project_owner: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			token_address: '0x6b175474e89094c44da98b954eedeac495271d0f',
			created_at: new Date('2024-01-10'),
		},
		{
			id: '4',
			name: 'Delta Finance',
			short_description: 'Automated market maker with innovative tokenomics',
			token_symbol: 'DELTA',
			project_owner: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
			token_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			created_at: new Date('2022-11-05'),
		},
		{
			id: '5',
			name: 'Epsilon Network',
			short_description: 'Layer 2 scaling solution with zero-knowledge proofs',
			token_symbol: 'EPS',
			project_owner: '0xe41d2489571d322189246dafa5ebde1f4699f498',
			token_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
			created_at: new Date('2023-12-01'),
		},
	]

	// Create 9 project cards
	const projectCards = Array.from({ length: 9 }, (_, i) => (
		<AllProjectCard key={i} />
	))

	// Define columns for DataTable
	const tableColumns: Column<Project>[] = [
		{
			header: 'Project',
			accessor: (project: Project) => (
				<div className="flex items-center">
					{project.logo ? (
						<div className="h-8 w-8 mr-3 rounded-full flex items-center justify-center overflow-hidden">
							<img
								src={`data:image/png;base64,${project.logo}`}
								alt={`${project.name} logo`}
								className="w-full h-full object-cover"
							/>
						</div>
					) : (
						<div className="h-8 w-8 mr-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
					)}
					<div>
						<div className="font-medium">{project.name}</div>
						<div className="text-xs text-gray-400">
							{project.short_description.length > 40
								? project.short_description.substring(0, 40) + '...'
								: project.short_description}
						</div>
					</div>
				</div>
			),
		},
		{
			header: 'Token',
			accessor: (project: Project) => project.token_symbol,
		},
		{
			header: 'Owner',
			accessor: (project: Project) => shortenStr(project.project_owner, 10),
		},
		{
			header: 'APR',
			accessor: (project: Project) =>
				project?.pool?.[0]?.staker_apy
					? `${project.pool[0].staker_apy}%`
					: 'N/A',
		},
		{
			header: 'Total Staked',
			accessor: (project: Project) =>
				project.pool?.[0]?.total_staked
					? project.pool[0].total_staked.toLocaleString()
					: 'N/A',
		},
		{
			header: 'Total Stakers',
			accessor: (project: Project) =>
				project.pool?.[0]?.total_stakers
					? project.pool[0].total_stakers.toLocaleString()
					: 'N/A',
		},
		{
			header: 'Created',
			accessor: (project: Project) =>
				new Date(project.created_at).toLocaleDateString(),
		},
	]

	// Define actions for DataTable rows
	const renderTableActions = (project: Project) => (
		<div className="flex justify-end space-x-2">
			<button className="bg-transparent border border-[#54A4F2] rounded-full px-3 py-1 text-xs font-bold text-[#54A4F2]">
				View
			</button>
			<button className="bg-gradient-to-r from-[#F05550] to-[#54A4F2] rounded-full px-3 py-1 text-xs font-bold">
				Stake
			</button>
		</div>
	)

	// Define expandable row content of DataTable
	const renderExpandableRow = (project: Project) => (
		<AnimatePresence>
			{expandedRow === project.id && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.3 }}
					className="w-full overflow-hidden"
				>
					<StakingInTable
						pools={project.pool as Pool[]}
						projectName={`${project.name}`}
						isWalletConnected={false}
						onConnectWallet={() => {}}
						onHarvest={() => {}}
						onStake={() => {}}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	)

	return (
		<div>
			<div className="text-white mb-20">
				<div className="mt-44 text-center">
					<SplitText
						text="Launchpool"
						className="text-7xl text-center font-bold text-white font-orbitron"
						delay={150}
						animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
						animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
						easing="easeOutCubic"
						threshold={0.2}
						rootMargin="-50px"
					/>
				</div>

				<div className="mx-14">
					<div className="m-20">
						<CarouselWithProgress />
					</div>

					{/* Mapping for the statcards */}
					<div className="grid grid-cols-3 gap-5 w-11/12 mx-auto mb-24">
						{statCardItems.map((card, index) => (
							<StatCard
								key={index}
								type={card.type}
								count={card.count}
								label={card.label}
								icon={card.icon}
							/>
						))}
					</div>

					<div className="mx-16">
						<ScrollFloat
							animationDuration={1}
							ease="back.inOut(2)"
							scrollStart="center bottom+=50%"
							scrollEnd="bottom bottom-=40%"
							stagger={0.03}
							textClassName="font-orbitron"
						>
							Launchpool
						</ScrollFloat>

						<div className="flex flex-row gap-12">
							<div className="w-full">
								<div className="relative">
									<GlowingSearchBar
									// TODO: Implement search functionality
									// value={searchQuery}
									// onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>

							<div className="mb-12">
								<SwitchTableOrCard isCard={isCard} setIsCard={setIsCard} />
							</div>
						</div>

						{/* Project Stats Summary */}
						<div className="glass-component-3 rounded-2xl p-6 mb-8 mx-auto">
							<div className="absolute inset-0 border-[0.5px] border-white border-opacity-20 rounded-2xl pointer-events-none"></div>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
								<div className="text-center">
									<div className="text-sm text-gray-300">Total Projects</div>
									<div className="text-2xl font-orbitron font-bold mt-1">
										{projects.length}
									</div>
								</div>
								<div className="text-center">
									<div className="text-sm text-gray-300">Total Staked</div>
									<div className="text-2xl font-orbitron font-bold mt-1">
										{projects
											.reduce(
												(acc, project) =>
													acc + Number(project.pool?.[0]?.total_staked || 0),
												0
											)
											.toLocaleString()}
									</div>
								</div>
								<div className="text-center">
									<div className="text-sm text-gray-300">
										Total Participants
									</div>
									<div className="text-2xl font-orbitron font-bold mt-1">
										{projects
											.reduce(
												(acc, project) =>
													acc + (project.pool?.[0]?.total_stakers || 0),
												0
											)
											.toLocaleString()}
									</div>
								</div>
							</div>
						</div>

						{/* Mapping for the project cards */}
						<div>
							{isCard ? (
								<div className="grid grid-cols-3 gap-8 w-full mx-auto mb-24">
									{projectCards.map((card, index) => (
										<SectionComponent key={index}>
											<AllProjectCard
											// projectName={card.projectName}
											// projectShortDescription={card.projectShortDescription}
											// projectAPR={card.projectAPR}
											/>
										</SectionComponent>
									))}
								</div>
							) : (
								<div className="w-full mx-auto mb-24">
									<DataTable
										data={projects.filter(
											(project) =>
												project.name
													.toLowerCase()
													.includes(searchQuery.toLowerCase()) ||
												project.short_description
													.toLowerCase()
													.includes(searchQuery.toLowerCase()) ||
												project.token_symbol
													.toLowerCase()
													.includes(searchQuery.toLowerCase())
										)}
										columns={tableColumns}
										keyField="id"
										renderActions={renderTableActions}
										renderExpandableRow={renderExpandableRow}
										onRowClick={(project) =>
											setExpandedRow(
												expandedRow === project.id ? null : project.id
											)
										}
										className="max-w-full"
										noDataMessage="No projects found"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AllProject
