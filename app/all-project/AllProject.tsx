'use client'

import { useState, useEffect } from 'react'
import SplitText from '../components/UI/effect/SplitText'
import Spinner from '@/app/components/UI/effect/Spinner'
import GlowingSearchBar from '../components/UI/shared/GlowingSearchBar'
import ScrollFloat from '../components/UI/effect/ScrollFloat'
import SwitchTableOrCard from '../components/UI/button/SwitchTableOrCard'
import SectionComponent from '../components/UI/effect/SectionComponent'
import DataTable from '../components/UI/shared/DataTable'
import Image from 'next/image'
import Particles from '../components/UI/background/Particles'
import CarouselWithProgress from '../components/UI/carousel/Carousel'
import AllProjectCard from '../components/UI/card/AllProjectCard'
import LaunchpoolTableRow from '@/app/components/pool-specific-rows/LaunchpoolTableRow'
import AnimatedBlobs from '../components/UI/background/AnimatedBlobs'
import { Column } from '../components/UI/shared/DataTable'
import { shortenStr } from '@/app/utils/display'
import { motion, AnimatePresence } from 'framer-motion'
import { EnrichedProject } from '@/app/types/extended-models/enriched-project'
import { UnifiedPool } from '@/app/types/extended-models/unified-pool'
import { useProjects } from '@/app/hooks/queries/useProjects'
import { usePlatformMetrics } from '@/app/hooks/queries/useStats'
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { debounce } from '@/app/utils/timing'
import { StatCard, StatCardSkeleton } from '../components/UI/card/StatCard'

// Stable gradient arrays - defined outside component to prevent re-renders
const HEAD_SECTION_GRADIENTS = [
	'from-[#1E40AF] via-[#3B82F6] to-[#06B6D4]', // Deep blue to cyan
	'from-[#0F172A] via-[#1E3A8A] to-[#3B82F6]', // Navy to blue
	'from-[#6366F1] via-[#8B5CF6] to-[#3B82F6]', // Indigo to purple-blue
	'from-[#1E3A8A] via-[#A855F7] to-[#06B6D4]', // Blue to purple to cyan
]

const BODY_SECTION_GRADIENTS = [
	'from-[#1E293B] via-[#1E40AF] to-[#1E3A8A]', // Very subtle dark blue
	'from-[#0F172A] via-[#0C4A6E] to-[#1E40AF]', // Dark navy to blue
	'from-[#1E1B4B] via-[#312E81] to-[#1E3A8A]', // Dark purple-blue mix
	'from-[#0F1419] via-[#1E293B] to-[#0C4A6E]', // Almost black to navy
]

// Define stat card interface
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
		projectsData?.pages.flatMap((page: any) => page.projects) ||
		([] as EnrichedProject[])

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

	/**----------------- Use platform metrics (tanstack query) ------------------ */
	const {
		data: platformMetricsData,
		isLoading: isLoadingMetrics,
		isError: isLoadingMetricsError,
		error: loadingMetricsError,
		refetch: refetchMetrics,
	} = usePlatformMetrics()

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

	// Define stat cards with calculated values and growth rates
	const statCardItems = [
		{
			label: 'Tokens Distributed',
			value: platformMetricsData?.snapshot?.tokens_distributed || 0, // number for testing
			valuePostfix: ' tokens',
			icon: '/decoration/coin-light.png',
			growthRate: platformMetricsData?.growthRates?.tokens_distributed || 0,
		},
		{
			label: 'Active Participants',
			value: platformMetricsData?.snapshot?.count_active_users || 0,
			valuePostfix: ' users',
			icon: '/decoration/user-light.png',
			growthRate: platformMetricsData?.growthRates?.count_active_users || 0,
		},
		{
			label: 'Total Value Locked (TVL)',
			value: platformMetricsData?.snapshot?.total_value_locked || 0,
			valuePrefix: '$',
			icon: '/decoration/locker-light.png',
			growthRate: platformMetricsData?.growthRates?.total_value_locked || 0,
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
			<button className="warm-cool-bg rounded-full px-3 py-1 text-xs font-bold">
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
		<div className="relative min-h-screen">
			{/* Animated Blobs - Head Section (Stats Cards) - Galactic blue-purple mix */}
			<div className="fixed top-0 left-0 right-0 h-[100vh] z-50 pointer-events-none">
				<AnimatedBlobs
					count={2}
					customGradients={HEAD_SECTION_GRADIENTS}
					opacity={0.25}
				/>
			</div>

			{/* Background Particles */}
			<div className="absolute inset-0 h-full w-full z-0">
				<Particles
					particleColors={['#ffffff', '#7f7f7f']}
					particleCount={250}
					particleSpread={7}
					speed={0.02}
					particleBaseSize={100}
					moveParticlesOnHover={false}
					alphaParticles={true}
					disableRotation={false}
				/>
			</div>

			{/* Planet Decoration - Smaller, more subtle, and blurred */}
			<div className="fixed right-0 top-1/2 -translate-y-1/2 z-5 pointer-events-none">
				<div className="relative">
					<Image
						src="/decoration/planet-with-orbit.png"
						alt="Planet decoration"
						width={400}
						height={400}
						className="opacity-15 translate-x-1/4 blur-sm"
						priority={false}
					/>
				</div>
			</div>

			<div className="relative z-10 text-white">
				{/* Hero Section */}
				<div className="pt-36 pb-16 text-center">
					<SplitText
						text="THE DEFROST XPERIENCE"
						className="text-5xl md:text-5xl text-center font-bold text-white font-orbitron mb-4"
						delay={150}
						animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
						animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
						easing={(t) => 1 - Math.pow(1 - t, 3)}
						threshold={0.2}
						rootMargin="-50px"
					/>
					<div className="text-gray-300 text-lg font-light max-w-2xl mx-auto">
						Professional DeFi ecosystem for staking and yield farming
					</div>
				</div>

				<div className="container mx-auto px-8">
					{/* Stat cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
						{isLoadingMetrics
							? // Show skeleton cards while loading
								Array.from({ length: 3 }).map((_, index) => (
									<StatCardSkeleton key={index} />
								))
							: // Show actual stat cards
								statCardItems.map((card, index) => (
									<StatCard
										key={index}
										valuePrefix={card?.valuePrefix}
										valuePostfix={card?.valuePostfix}
										value={card.value}
										label={card.label}
										icon={card.icon}
										growthRate={card.growthRate}
										isLoading={isLoadingMetrics}
									/>
								))}
					</div>

					{/* Yield Ecosystem Section */}
					<div className="mb-12">
						{/* Section Title */}
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white mb-4">
								Yield Ecosystem
							</h2>
							<p className="text-gray-300 text-lg max-w-2xl mx-auto">
								Discover and stake in our curated collection of high-yield DeFi
								projects
							</p>
						</div>

						{/* Search and Controls */}
						<div className="flex flex-col md:flex-row gap-6 mb-12">
							<div className="flex-1">
								<GlowingSearchBar
									value={searchQuery}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setSearchQuery(e.target.value)
									}
									placeholder="Search projects..."
								/>
							</div>
							<div className="flex-shrink-0">
								<SwitchTableOrCard isCard={isCard} setIsCard={setIsCard} />
							</div>
						</div>
						{/* Projects Section */}
						<div className="relative">
							{/* Show loading state when initially loading */}
							{isLoading && allProjects.length === 0 && (
								<div className="flex justify-center items-center py-20">
									<div className="flex items-center space-x-2">
										<Spinner />
										<span className="text-white text-lg">
											Waking up the Yetis...
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
											className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
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
												className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
											>
												Clear Search
											</button>
										</div>
									</div>
								)}{' '}
							{/* Show projects */}
							{filteredProjects.length > 0 && (
								<div className="relative">
									{/* Animated Blobs - Body Section (Project Cards) - Very subtle for table readability */}
									<div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
										<AnimatedBlobs
											count={2}
											customGradients={BODY_SECTION_GRADIENTS}
											opacity={0.08}
										/>
									</div>

									{isCard ? (
										<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24 relative z-20">
											{filteredProjects.map(
												(project: EnrichedProject, index: number) => (
													<SectionComponent key={`${project.id}-${index}`}>
														<AllProjectCard project={project} />
													</SectionComponent>
												)
											)}
										</div>
									) : (
										<div className="mb-24 relative z-20">
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
								</div>
							)}
							{/* Infinite scroll loading trigger */}
							{!debouncedSearchQuery && (
								<div ref={loadMoreRef} className="flex justify-center py-8">
									{isFetchingNextPage && (
										<div className="flex items-center space-x-2">
											<Spinner />
											<span className="text-gray-400">
												Summoning more yetis...
											</span>
										</div>
									)}
									{!hasNextPage && allProjects.length > 0 && (
										<div className="flex items-center justify-center py-12">
											<div className="flex items-center space-x-6">
												<div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
												<span className="text-gray-500 text-sm font-medium tracking-wide">
													End of Projects
												</span>
												<div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
											</div>
										</div>
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
