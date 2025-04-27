'use client'

import { useState, useRef, useEffect } from 'react'
import SplitText from '../components/UI/effect/SplitText'
import Spinner from '@/app/components/UI/effect/Spinner'
import GlowingSearchBar from '../components/UI/shared/GlowingSearchBar'
import ScrollFloat from '../components/UI/effect/ScrollFloat'
import StatCard from '../components/UI/StatCard'
import SwitchTableOrCard from '../components/UI/button/SwitchTableOrCard'
import { orbitron, comfortaa } from '../lib/font'
import AllProjectCard from '../components/UI/AllProjectCard'
import SectionComponent from '../components/UI/effect/SectionComponent'
import DataTable from '../components/UI/shared/DataTable'
import { Column } from '../components/UI/shared/DataTable'
import Image from 'next/image'
import { shortenStr } from '../lib/utils'
import LaunchpoolTableRow from '@/app/components/pool-specific-rows/LaunchpoolTableRow'
import { motion, AnimatePresence } from 'framer-motion'
import { EnrichedProject } from '@/app/types/extended-models/enriched-project'
import { UnifiedPool } from '@/app/types/extended-models/unified-pool'
import CarouselWithProgress from '../components/UI/carousel/Carousel'

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
	const [selectedProject, setSelectedProject] =
		useState<EnrichedProject | null>(null)
	const [projects, setProjects] = useState<EnrichedProject[]>([])
	const [selectedPool, setSelectedPool] = useState<UnifiedPool | null>(null)

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

	// Fetch projects from the API
	const fetchProjects = async () => {
		try {
			const response = await fetch('/api/all-project')
			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			const data = await response.json()
			setProjects(data.projects)
		} catch (error) {
			console.error('Error fetching projects:', error)
		}
	}

	useEffect(() => {
		fetchProjects()
	}, [])

	const handlePoolSelected = (pool: UnifiedPool): void => {
		console.log('New pool selected:', pool.id)
		setSelectedPool(pool)
		console.log('Selected pool:', selectedPool?.id)
		if (selectedProject) {
			renderExpandableRow(selectedProject)
		}
	}

	// Create 9 project cards
	const projectCards = Array.from({ length: 9 }, (_, i) => (
		<AllProjectCard key={i} />
	))

	// Define table column customization for DataTable
	const tableColumns: Column<EnrichedProject>[] = [
		{
			header: 'Project',
			accessor: (project) => (
				<div className="flex items-center">
					{project.logo ? (
						<img
							src={`data:image/png;base64,${project.logo}`}
							alt={project.name || 'Project logo'}
							className="w-8 h-8 mr-3 rounded-full"
						/>
					) : (
						<div className="w-8 h-8 mr-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full" />
					)}
					<div>
						<div className="text-white font-medium">{project.name}</div>
						<div className="text-sm text-gray-400 truncate max-w-[200px]">
							{project.short_description || 'No description available'}
						</div>
					</div>
				</div>
			),
		},
		{
			header: 'Pools',
			accessor: (project) => project.poolCount,
		},
		{
			header: 'Staked',
			accessor: (project) => `$${project.totalStaked.toLocaleString()}`,
		},
		{
			header: 'Mean APY%',
			accessor: (project) =>
				project.avgApy ? `${project.avgApy.toFixed(2)}%` : '-',
		},
	]

	// Render appropriate component based on pool type
	const renderPoolComponent = (pool: UnifiedPool, project: EnrichedProject) => {
		switch (pool.type) {
			case 'launchpool':
				return (
					<LaunchpoolTableRow
						key={pool.id}
						project={project}
						pool={pool}
						onPoolSelected={handlePoolSelected}
					/>
				)
			case 'farmpool':
				// Future implementation for FarmpoolTableRow
				return (
					<div
						key={pool.id}
						className="bg-black/20 p-4 rounded-xl border border-white/10"
					>
						<p className="text-white">
							Farm pool component will be implemented soon.
						</p>
						<p className="text-gray-400 text-sm mt-2">Pool ID: {pool.id}</p>
					</div>
				)
			case 'launchpad':
				// Future implementation for LaunchpadTableRow
				return (
					<div
						key={pool.id}
						className="bg-black/20 p-4 rounded-xl border border-white/10"
					>
						<p className="text-white">
							Launchpad component will be implemented soon.
						</p>
						<p className="text-gray-400 text-sm mt-2">Pool ID: {pool.id}</p>
					</div>
				)
			default:
				return (
					<div
						key={pool.id}
						className="bg-black/20 p-4 rounded-xl border border-white/10"
					>
						<p className="text-white">Unknown pool type: {pool.type}</p>
					</div>
				)
		}
	}

	// Define actions for DataTable rows
	const renderTableActions = (project: EnrichedProject) => (
		<div className="flex justify-end space-x-2">
			{/* <button className="bg-transparent border border-[#54A4F2] rounded-full px-3 py-1 text-xs font-bold text-[#54A4F2]">
				View
			</button> */}
			<button className="bg-gradient-to-r from-[#F05550] to-[#54A4F2] rounded-full px-3 py-1 text-xs font-bold">
				Stake
			</button>
		</div>
	)

	// Render the expandable row contents with pools
	const renderExpandableRow = (project: EnrichedProject) => (
		<AnimatePresence>
			{selectedProject?.id === project.id && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.3 }}
					className="w-full overflow-hidden"
				>
					{project.unifiedPools && project.unifiedPools.length > 0 ? (
						<div className="w-full space-y-6 my-4">
							{/* Find the pool with the highest APR and display it */}
							{project.unifiedPools
								.sort((a, b) => b.staker_apy - a.staker_apy)
								.slice(0, 1)
								.map((pool) => {
									console.log(
										'Rendering pool component for new pool: ',
										pool.id
									)
									if (!selectedPool) {
										setSelectedPool(pool)
										return renderPoolComponent(pool, project)
									} else {
										return renderPoolComponent(selectedPool, project)
									}
								})}
						</div>
					) : (
						<div className="text-center py-8">
							<p className="text-lg text-gray-400">
								No pools available for this project
							</p>
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	)

	return (
		<div>
			<div className="text-white mb-20">
				<div className="mt-44 text-center">
					<SplitText
						text="Explore & Discover Projects"
						className="text-7xl text-center font-bold text-white font-orbitron"
						delay={150}
						animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
						animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
						easing={(t) => 1 - Math.pow(1 - t, 3)}
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
							Yield Ecosystem
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
													acc +
													Number(project.unifiedPools?.[0]?.total_staked || 0),
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
													acc + (project.unifiedPools?.[0]?.total_stakers || 0),
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
													?.toLowerCase()
													.includes(searchQuery.toLowerCase()) ||
												project.short_description
													?.toLowerCase()
													.includes(searchQuery.toLowerCase()) ||
												project.token_symbol
													?.toLowerCase()
													.includes(searchQuery.toLowerCase())
										)}
										columns={tableColumns}
										keyField="id"
										renderActions={renderTableActions}
										renderExpandableRow={renderExpandableRow}
										onRowClick={(project) =>
											setSelectedProject(
												selectedProject && selectedProject.id === project.id
													? null
													: project
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
