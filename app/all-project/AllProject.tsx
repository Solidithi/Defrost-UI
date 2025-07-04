'use client'

import { useState, useEffect } from 'react'
import SplitText from '../components/UI/effect/SplitText'
import Spinner from '@/app/components/UI/effect/Spinner'
import GlowingSearchBar from '../components/UI/shared/GlowingSearchBar'
import ScrollFloat from '../components/UI/effect/ScrollFloat'
import SwitchTableOrCard from '../components/UI/button/SwitchTableOrCard'
import { orbitron, comfortaa } from '../lib/font'
import SectionComponent from '../components/UI/effect/SectionComponent'
import DataTable from '../components/UI/shared/DataTable'
import { Column } from '../components/UI/shared/DataTable'
import Image from 'next/image'
import { shortenStr } from '@/app/utils/display'
import LaunchpoolTableRow from '@/app/components/pool-specific-rows/LaunchpoolTableRow'
import { motion, AnimatePresence } from 'framer-motion'
import { EnrichedProject } from '@/app/types/extended-models/enriched-project'
import { UnifiedPool } from '@/app/types/extended-models/unified-pool'
import { useProjects } from '../hooks/queries/useProjects'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { debounce } from '@/app/utils/timing'
import CarouselWithProgress from '../components/UI/carousel/Carousel'
import AllProjectCard from '../components/UI/card/AllProjectCard'
import StatCard from '../components/UI/card/StatCard'
import AnimatedBlobs from '../components/UI/background/AnimatedBlobs'

// Define stat card interface
export interface StatCardItem {
	type:
		| 'Total Project'
		| 'Total Staking'
		| 'Unique Participant'
		| 'Current number of investors'
		| 'Current total staked'
		| 'Highest Total Staked Amount'
	count: number
	label: string
	icon: string
}

const AllProject = () => {
	const [isCard, setIsCard] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
	const [selectedProject, setSelectedProject] =
		useState<EnrichedProject | null>(null)
	const [selectedPool, setSelectedPool] = useState<UnifiedPool | null>(null)

	/**----------------- Handle query change in debounced manner ------------------ */
	const handleDebouncedSearchQuery = debounce(
		(query: string) => setDebouncedSearchQuery(query),
		600
	)

	useEffect(() => {
		handleDebouncedSearchQuery(searchQuery)
	}, [searchQuery])

	/**----------------- Use infinite query for projects ------------------ */
	const {
		data: projectsData,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useProjects()

	// Use infinite scroll hook
	const { loadMoreRef } = useInfiniteScroll({
		hasNextPage: hasNextPage || false,
		isFetchingNextPage,
		fetchNextPage,
		threshold: 0.1,
		rootMargin: '100px',
	})

	// Flatten all projects from all pages
	const allProjects =
		projectsData?.pages.flatMap((page: any) => page.projects) || []

	// Filter projects based on debounced search query
	const filteredProjects = allProjects.filter((project: EnrichedProject) => {
		// If no search query, show all projects
		if (!debouncedSearchQuery.trim()) {
			return true
		}

		// Otherwise, filter based on search query
		const searchLower = debouncedSearchQuery.toLowerCase()
		return (
			project.name?.toLowerCase().includes(searchLower) ||
			project.short_description?.toLowerCase().includes(searchLower) ||
			project.token_symbol?.toLowerCase().includes(searchLower)
		)
	})

	// Calculate total stats from all loaded projects
	const totalStats = allProjects.reduce(
		(acc: any, project: EnrichedProject) => {
			return {
				totalProjects: acc.totalProjects + 1,
				totalStaked: acc.totalStaked + project.totalStaked,
				totalStakers: acc.totalStakers + project.totalStakers,
			}
		},
		{ totalProjects: 0, totalStaked: 0, totalStakers: 0 }
	)

	// Remove the old intersection observer effect since we're using the custom hook
	// useEffect(() => { ... }, [hasNextPage, isFetchingNextPage, fetchNextPage])

	// Error state
	if (isError) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<p className="text-red-500 mb-4">Error loading projects</p>
					<button
						onClick={() => refetch()}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Try Again
					</button>
				</div>
			</div>
		)
	}

	// Define stat cards with calculated values
	const statCardItems: StatCardItem[] = [
		{
			type: 'Total Project',
			count: totalStats.totalProjects,
			label: 'Total Project',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
		{
			type: 'Total Staking',
			count: totalStats.totalStaked,
			label: 'Total Staking',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
		{
			type: 'Unique Participant',
			count: totalStats.totalStakers,
			label: 'Unique Participant',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
	]

	const handlePoolSelected = (pool: UnifiedPool): void => {
		console.log('New pool selected:', pool.address)
		setSelectedPool(pool)
		console.log('Selected pool:', selectedPool?.address)
		if (selectedProject) {
			renderExpandableRow(selectedProject)
		}
	}

	// Create 9 project cards
	// const projectCards = Array.from({ length: 9 }, (_, i) => (
	// 	<AllProjectCard key={i} />
	// ))

	// Define table column customization for DataTable
	const tableColumns: Column<EnrichedProject>[] = [
		{
			header: 'Project',
			accessor: (project) => (
				<div className="flex items-center">
					{project.logo ? (
						<Image
							src={`data:image/png;base64,${project.logo}`}
							alt={project.name || 'Project logo'}
							width={32}
							height={32}
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
						key={pool.address}
						project={project}
						pool={pool}
						onPoolSelected={handlePoolSelected}
					/>
				)
			case 'farmpool':
				// Future implementation for FarmpoolTableRow
				return (
					<div
						key={pool.address}
						className="bg-black/20 p-4 rounded-xl border border-white/10"
					>
						<p className="text-white">
							Farm pool component will be implemented soon.
						</p>
						<p className="text-gray-400 text-sm mt-2">
							Pool ID: {pool.address}
						</p>
					</div>
				)
			case 'launchpad':
				// Future implementation for LaunchpadTableRow
				return (
					<div
						key={pool.address}
						className="bg-black/20 p-4 rounded-xl border border-white/10"
					>
						<p className="text-white">
							Launchpad component will be implemented soon.
						</p>
						<p className="text-gray-400 text-sm mt-2">
							Pool ID: {pool.address}
						</p>
					</div>
				)
			default:
				return (
					<div
						key={pool.address}
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
										pool.address
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
			<AnimatedBlobs count={3} />
			<div className="relative z-10 text-white mb-20 ">
				<div className="mt-44 text-center">
					<SplitText
						text="DEFROST ECOSYSTEM"
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
					<div className="m-20">{/* <CarouselWithProgress /> */}</div>

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
						</ScrollFloat>{' '}
						<div className="flex flex-row gap-12">
							<div className="w-full">
								<div className="relative">
									<GlowingSearchBar
										value={searchQuery}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setSearchQuery(e.target.value)
										}
										placeholder="Search projects..."
									/>
								</div>
							</div>

							<div className="mb-12">
								<SwitchTableOrCard isCard={isCard} setIsCard={setIsCard} />
							</div>
						</div>
						{/* Project Stats Summary */}
						{/* <div className="glass-enhanced rounded-2xl p-6 mb-8 mx-auto">
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
						</div> */}
						{/* Mapping for the project cards */}
						<div>
							{/* Show loading state when initially loading */}
							{isLoading && allProjects.length === 0 && (
								<div className="flex justify-center items-center py-20">
									<div className="flex items-center space-x-2">
										<Spinner />
										<span className="text-white text-lg">
											Loading projects...
										</span>
									</div>
								</div>
							)}

							{/* Show empty state when no projects */}
							{!isLoading && allProjects.length === 0 && (
								<div className="flex justify-center items-center py-20">
									<div className="text-center">
										<p className="text-gray-400 text-lg mb-4">
											No projects found
										</p>
										<button
											onClick={() => refetch()}
											className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
										>
											Refresh
										</button>
									</div>
								</div>
							)}

							{/* Show filtered empty state */}
							{!isLoading &&
								allProjects.length > 0 &&
								filteredProjects.length === 0 && (
									<div className="flex justify-center items-center py-20">
										<div className="text-center">
											<p className="text-gray-400 text-lg mb-4">
												No projects match your search: &ldquo;
												{debouncedSearchQuery}&ldquo;
											</p>
											<button
												onClick={() => setSearchQuery('')}
												className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
											>
												Clear Search
											</button>
										</div>
									</div>
								)}

							{/* Show projects */}
							{filteredProjects.length > 0 && (
								<>
									{isCard ? (
										<div className="grid grid-cols-3 gap-8 w-full mx-auto mb-24">
											{filteredProjects.map(
												(project: EnrichedProject, index: number) => (
													<SectionComponent key={`${project.id}-${index}`}>
														<AllProjectCard project={project} />
													</SectionComponent>
												)
											)}
										</div>
									) : (
										<div className="w-full mx-auto mb-24">
											<DataTable
												data={filteredProjects}
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
								</>
							)}

							{/* Infinite scroll loading trigger */}
							{!debouncedSearchQuery && ( // Only show infinite scroll when not searching
								<div ref={loadMoreRef} className="flex justify-center py-8">
									{isFetchingNextPage && (
										<div className="flex items-center space-x-2">
											<Spinner />
											<span className="text-gray-400">
												Loading more projects...
											</span>
										</div>
									)}
									{!hasNextPage && allProjects.length > 0 && (
										<p className="text-gray-500">No more projects to load</p>
									)}
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
