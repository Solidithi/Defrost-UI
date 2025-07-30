'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { LaunchpoolCard } from '../components/UI/card/LaunchpoolCard'
import LaunchpoolTableRow from '@/app/components/pool-specific-rows/LaunchpoolTableRow'
import AnimatedBlobs from '../components/UI/background/AnimatedBlobs'
import { Column } from '../components/UI/shared/DataTable'
import { motion, AnimatePresence } from 'framer-motion'
import { EnrichedProject, EnrichedLaunchpool } from '@/app/types'
import { useProjects } from '@/app/hooks/queries/useProjects'
import { usePaginatedProjects } from '@/app/hooks/queries/usePaginatedProjects'
import { usePlatformMetrics } from '@/app/hooks/queries/usePlatformMetrics'
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { debounce } from '@/app/utils/timing'
import { StatCard, StatCardSkeleton } from '../components/UI/card/StatCard'
import Link from 'next/link'
import Pagination, { PaginationInfo } from '../components/UI/shared/Pagination'
import {
	Filter,
	TrendingUp,
	Zap,
	Target,
	Star,
	Flame,
	Trophy,
	Users,
	ChevronDown,
	Calendar,
	Globe,
	Sparkles,
	ArrowRight,
	BarChart3,
	Activity,
	Coins,
	Shield,
	Layers,
} from 'lucide-react'

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
export default function Home() {
	const [isCardView, setIsCardView] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
	const [selectedProject, setSelectedProject] =
		useState<EnrichedProject | null>(null)
	const [selectedPool, setSelectedPool] = useState<EnrichedLaunchpool | null>(
		null
	)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10) // Fixed items per page

	// Filtering state
	const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
		undefined
	)
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
		undefined
	)
	const [selectedChainId, setSelectedChainId] = useState<number | undefined>(
		undefined
	)
	const [sortBy, setSortBy] = useState<
		'newest' | 'oldest' | 'apy' | 'tvl' | 'participants'
	>('newest')
	const [activeSection, setActiveSection] = useState<
		'overview' | 'projects' | 'launchpools' | 'trending'
	>('overview')

	// Content filtering options
	const quickTagOptions = [
		{ slug: undefined, label: 'All Projects', icon: Globe },
		{ slug: 'trending', label: 'Trending', icon: TrendingUp },
		{ slug: 'featured', label: 'Featured', icon: Star },
		{ slug: 'new', label: 'New Launches', icon: Sparkles },
	]

	const categoryOptions = [
		{ slug: undefined, label: 'All Categories', icon: Layers },
		{ slug: 'defi', label: 'DeFi', icon: Coins },
		{ slug: 'nft', label: 'NFTs', icon: Trophy },
		{ slug: 'gaming', label: 'Gaming', icon: Target },
		{ slug: 'infrastructure', label: 'Infrastructure', icon: Shield },
	]

	const chainOptions = [
		{ chainId: undefined, label: 'All Chains' },
		{ chainId: 1287, label: 'Moonbase Alpha', isTestnet: true },
		{ chainId: 1284, label: 'Moonbeam' },
		{ chainId: 1285, label: 'Moonriver' },
		{ chainId: 787, label: 'Acala' },
		{ chainId: 100, label: 'Polkadot' },
		{ chainId: 101, label: 'Kusama' },
	]

	/**----------------- Handle query change in debounced manner ------------------ */
	const handleDebouncedSearchQuery = debounce(
		(query: string) => setDebouncedSearchQuery(query),
		600
	)

	useEffect(() => {
		handleDebouncedSearchQuery(searchQuery)
		// Reset to page 1 when search query changes
		setCurrentPage(1)
	}, [searchQuery])

	/**----------------- Use infinite query for projects (Card View) ------------------ */
	const {
		data: projectsData,
		isLoading: isLoadingInfinite,
		isError: isErrorInfinite,
		error: errorInfinite,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch: refetchInfinite,
	} = useProjects({
		chainId: selectedChainId,
		category: selectedCategory,
	})

	/**----------------- Use paginated query for projects (Table View) ------------------ */
	const {
		data: paginatedData,
		isLoading: isLoadingPaginated,
		isError: isErrorPaginated,
		error: errorPaginated,
		refetch: refetchPaginated,
	} = usePaginatedProjects(
		currentPage,
		itemsPerPage,
		!isCardView, // Only fetch when in table mode
		{
			chainId: selectedChainId,
			category: selectedCategory,
			search: debouncedSearchQuery,
		}
	)

	/**----------------- Fetch Platform Metrics ------------------ */
	const {
		data: platformMetrics,
		isLoading: isLoadingMetrics,
		error: metricsError,
	} = usePlatformMetrics()

	// Use the appropriate data source based on view mode
	const isLoading = isCardView ? isLoadingInfinite : isLoadingPaginated
	const isError = isCardView ? isErrorInfinite : isErrorPaginated
	const error = isCardView ? errorInfinite : errorPaginated
	const refetch = isCardView ? refetchInfinite : refetchPaginated

	// Enhanced filtering and sorting logic
	const filteredAndSortedProjects = useMemo(() => {
		let projects: EnrichedProject[] = []

		if (isCardView && projectsData?.pages) {
			projects = projectsData.pages.flatMap((page) => page.projects)
		} else if (!isCardView && paginatedData?.projects) {
			projects = paginatedData.projects
		}

		// Apply category filter
		if (selectedCategory !== 'all') {
			projects = projects.filter((project) => {
				// This would need to be implemented based on your project categorization
				return true // Placeholder
			})
		}

		// Apply search filter
		if (debouncedSearchQuery) {
			projects = projects.filter(
				(project) =>
					(project.name || '')
						.toLowerCase()
						.includes(debouncedSearchQuery.toLowerCase()) ||
					(project.short_description || '')
						.toLowerCase()
						.includes(debouncedSearchQuery.toLowerCase())
			)
		}

		// Apply sorting
		switch (sortBy) {
			case 'newest':
				projects.sort(
					(a, b) =>
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				)
				break
			case 'oldest':
				projects.sort(
					(a, b) =>
						new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
				)
				break
			case 'apy':
				projects.sort((a, b) => b.avgApy - a.avgApy)
				break
			case 'tvl':
				projects.sort((a, b) => b.totalStaked - a.totalStaked)
				break
			case 'participants':
				projects.sort((a, b) => b.totalStakers - a.totalStakers)
				break
		}

		return projects
	}, [
		projectsData,
		paginatedData,
		selectedCategory,
		debouncedSearchQuery,
		sortBy,
		isCardView,
	])

	// Extract all launchpools from projects
	const allLaunchpools = useMemo(() => {
		return filteredAndSortedProjects.flatMap(
			(project) =>
				project.launchpools?.map((pool) => ({
					...pool,
					projectName: project.name,
					projectLogo: project.logo,
				})) || []
		)
	}, [filteredAndSortedProjects])

	// Get featured launchpools (top 6 by APY)
	const featuredLaunchpools = useMemo(() => {
		return [...allLaunchpools]
			.sort(
				(a, b) =>
					parseFloat(b.staker_apy?.toString() || '0') -
					parseFloat(a.staker_apy?.toString() || '0')
			)
			.slice(0, 6)
	}, [allLaunchpools])

	// Get trending projects (top 6 by recent activity)
	const trendingProjects = useMemo(() => {
		return [...filteredAndSortedProjects]
			.sort((a, b) => b.totalStakers - a.totalStakers)
			.slice(0, 6)
	}, [filteredAndSortedProjects])

	// Use infinite scroll hook
	const { loadMoreRef } = useInfiniteScroll({
		hasNextPage: hasNextPage || false,
		isFetchingNextPage,
		fetchNextPage,
		threshold: 0.1,
		rootMargin: '100px',
	})

	// Flatten all projects from all pages (for card view)
	const allProjects =
		projectsData?.pages.flatMap((page: any) => page.projects) ||
		([] as EnrichedProject[])

	// Get projects and pagination info based on view mode
	const displayProjects = isCardView
		? allProjects
		: paginatedData?.projects || []

	const totalPages = isCardView
		? 1 // No pagination for card view
		: paginatedData?.totalPages || 1

	const totalItems = isCardView ? allProjects.length : paginatedData?.total || 0

	// Filter projects based on debounced search query (only for card view)
	const filteredProjects = isCardView
		? allProjects.filter((project: EnrichedProject) => {
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
		: displayProjects // For table view, filtering is done server-side

	// Calculate final projects to display
	const paginatedProjects = isCardView
		? filteredProjects // Show filtered projects in card view (client-side pagination via infinite scroll)
		: displayProjects // Show server-paginated projects in table view

	// Handle page change
	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		// Reset selected project when changing pages
		setSelectedProject(null)
	}

	// Handle view toggle (reset pagination when switching between card and table)
	const handleViewToggle = (cardView: boolean) => {
		setIsCardView(cardView)
		if (!cardView) {
			// Reset to first page when switching to table view
			setCurrentPage(1)
		}
		// Reset selected project when switching views
		setSelectedProject(null)
	}

	/**----------------- Use platform metrics (tanstack query) ------------------ */
	const {
		data: platformMetricsData,
		isLoading: isLoadingPlatformMetrics,
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
			value: platformMetricsData?.snapshot?.tokens_distributed.toNumber() || 0, // number for testing
			valuePostfix: ' tokens',
			icon: '/decoration/coin-light.png',
			growthRate:
				platformMetricsData?.growthRates?.tokens_distributed.toNumber() || 0,
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
			value: platformMetricsData?.snapshot?.total_value_locked.toNumber() || 0,
			valuePrefix: '$',
			icon: '/decoration/locker-light.png',
			growthRate:
				platformMetricsData?.growthRates?.total_value_locked.toNumber() || 0,
		},
	]

	const handlePoolSelected = (pool: EnrichedLaunchpool): void => {
		console.log('New pool selected:', pool.id)
		setSelectedPool(pool)
		console.log('Selected pool:', selectedPool?.id)
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
							src={project.logo}
							alt={'Logo'}
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
			header: 'Staked Tokens',
			accessor: (project) => `${project.totalStaked.toLocaleString()} Tokens`,
		},
		{
			header: 'Mean APY%',
			accessor: (project) =>
				project.avgApy ? `${project.avgApy.toFixed(2)}%` : '-',
			className: 'font-bold warm-cool-text',
		},
	]

	// Render appropriate component based on pool type
	const renderPoolComponent = (
		pool: EnrichedLaunchpool,
		project: EnrichedProject
	) => {
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
			default:
				// Future implementation for other pool types
				return (
					<div
						key={pool.id}
						className="bg-black/20 p-4 rounded-xl border border-white/10"
					>
						<p className="text-white">Unknown pool type (coming soon)</p>
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
					{project.launchpools && project.launchpools.length > 0 ? (
						<div className="w-full space-y-6 my-4">
							{/* Find the pool with the highest APR and display it */}
							{project.launchpools
								.sort((a, b) => Number(b.staker_apy) - Number(a.staker_apy))
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
				<div className="pt-32 pb-24 text-center">
					<SplitText
						text="THE DEFROST X-PERIENCE"
						className="text-5xl md:text-6xl text-center font-bold text-white font-orbitron mb-6"
						delay={150}
						animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
						animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
						easing={(t) => 1 - Math.pow(1 - t, 3)}
						threshold={0.2}
						rootMargin="-50px"
					/>
					<div className="text-gray-300 text-xl font-light max-w-4xl mx-auto mb-16 leading-relaxed">
						Explore the complete DeFi ecosystem with launchpools, launchpads,
						NFT collections, and yield farming opportunities
					</div>

					{/* Quick Action Pills - Professional Gradients */}
					<div className="flex flex-wrap justify-center gap-4 mb-12">
						{[
							{
								label: 'High Yield Pools',
								icon: TrendingUp,
								gradient: 'from-slate-600/20 to-slate-700/20',
								border: 'border-slate-500/30',
								textColor: 'text-slate-300',
								hoverGradient: 'hover:from-slate-500/30 hover:to-slate-600/30',
								hoverBorder: 'hover:border-slate-400/50',
								hoverText: 'hover:text-white',
							},
							{
								label: 'New Launches',
								icon: Sparkles,
								gradient: 'from-indigo-600/20 to-indigo-700/20',
								border: 'border-indigo-500/30',
								textColor: 'text-indigo-300',
								hoverGradient:
									'hover:from-indigo-500/30 hover:to-indigo-600/30',
								hoverBorder: 'hover:border-indigo-400/50',
								hoverText: 'hover:text-white',
							},
							{
								label: 'NFT Collections',
								icon: Trophy,
								gradient: 'from-violet-600/20 to-violet-700/20',
								border: 'border-violet-500/30',
								textColor: 'text-violet-300',
								hoverGradient:
									'hover:from-violet-500/30 hover:to-violet-600/30',
								hoverBorder: 'hover:border-violet-400/50',
								hoverText: 'hover:text-white',
							},
							{
								label: 'Trending Projects',
								icon: Flame,
								gradient: 'from-gray-600/20 to-gray-700/20',
								border: 'border-gray-500/30',
								textColor: 'text-gray-300',
								hoverGradient: 'hover:from-gray-500/30 hover:to-gray-600/30',
								hoverBorder: 'hover:border-gray-400/50',
								hoverText: 'hover:text-white',
							},
						].map((action, index) => (
							<button
								key={index}
								className={`
									flex items-center gap-2 px-6 py-3 rounded-full 
									bg-gradient-to-r ${action.gradient} ${action.hoverGradient}
									backdrop-blur-sm transition-all duration-300 font-medium text-sm
									${action.textColor} ${action.hoverText} 
									border ${action.border} ${action.hoverBorder}
									hover:scale-105 group shadow-lg hover:shadow-xl
									overflow-hidden
								`}
								onClick={() =>
									setActiveSection(
										index === 0
											? 'launchpools'
											: index === 1
												? 'projects'
												: index === 2
													? 'overview'
													: 'trending'
									)
								}
							>
								<action.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
								<span>{action.label}</span>
							</button>
						))}
					</div>
				</div>

				<div className="container mx-auto px-8">
					{/* Platform Stats - More Elegant Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
						{isLoadingMetrics
							? Array.from({ length: 3 }).map((_, index) => (
									<StatCardSkeleton key={index} />
								))
							: statCardItems.map((card, index) => (
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

					{/* Secondary Stats - Simplified and More Spacious */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
						<div className="bg-white/3 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300 group">
							<div className="flex items-center justify-between mb-4">
								<Coins className="w-6 h-6 text-blue-400/70 group-hover:text-blue-400 transition-colors" />
								<span className="text-green-400/70 text-sm font-medium">
									+12%
								</span>
							</div>
							<div className="text-3xl font-bold text-white mb-2">
								{allLaunchpools.length}
							</div>
							<div className="text-gray-400 text-sm">Active Pools</div>
						</div>
						<div className="bg-white/3 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300 group">
							<div className="flex items-center justify-between mb-4">
								<Trophy className="w-6 h-6 text-purple-400/70 group-hover:text-purple-400 transition-colors" />
								<span className="text-green-400/70 text-sm font-medium">
									+8%
								</span>
							</div>
							<div className="text-3xl font-bold text-white mb-2">
								{filteredAndSortedProjects.length}
							</div>
							<div className="text-gray-400 text-sm">Total Projects</div>
						</div>
						<div className="bg-white/3 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300 group">
							<div className="flex items-center justify-between mb-4">
								<BarChart3 className="w-6 h-6 text-green-400/70 group-hover:text-green-400 transition-colors" />
								<span className="text-green-400/70 text-sm font-medium">
									+24%
								</span>
							</div>
							<div className="text-3xl font-bold text-white mb-2">
								{featuredLaunchpools.length > 0
									? `${parseFloat(featuredLaunchpools[0]?.staker_apy?.toString() || '0').toFixed(1)}%`
									: '0%'}
							</div>
							<div className="text-gray-400 text-sm">Highest APY</div>
						</div>
						<div className="bg-white/3 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300 group">
							<div className="flex items-center justify-between mb-4">
								<Activity className="w-6 h-6 text-orange-400/70 group-hover:text-orange-400 transition-colors" />
								<span className="text-green-400/70 text-sm font-medium">
									+18%
								</span>
							</div>
							<div className="text-3xl font-bold text-white mb-2">
								{trendingProjects.reduce(
									(sum, project) => sum + project.totalStakers,
									0
								)}
							</div>
							<div className="text-gray-400 text-sm">Total Participants</div>
						</div>
					</div>

					{/* Enhanced Header with Navigation - More Elegant */}
					<div className="flex flex-col lg:flex-row gap-8 mb-20">
						{/* Search Bar */}
						<div className="flex-1">
							<GlowingSearchBar
								value={searchQuery}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setSearchQuery(e.target.value)
								}
								placeholder="Search projects, pools, or tokens..."
							/>
						</div>

						{/* Filter Controls - More Refined */}
						<div className="flex flex-wrap gap-4">
							{/* Category Filter */}
							<div className="relative">
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value as any)}
									className="
										appearance-none bg-white/5 backdrop-blur-sm border border-white/10 
										rounded-xl px-5 py-3 text-white pr-10 focus:outline-none focus:ring-2 
										focus:ring-blue-500/30 min-w-[150px] font-medium
										hover:bg-white/10 hover:border-white/20 transition-all duration-300
									"
								>
									{categoryOptions.map((option) => (
										<option
											key={option.slug}
											value={option.slug}
											className="bg-gray-800 text-white"
										>
											{option.label}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
							</div>

							{/* Chain Filter */}
							<div className="relative">
								<select
									value={selectedChainId}
									onChange={(e) => setSelectedChainId(e.target.value as any)}
									className="
										appearance-none bg-white/5 backdrop-blur-sm border border-white/10 
										rounded-xl px-5 py-3 text-white pr-10 focus:outline-none focus:ring-2 
										focus:ring-blue-500/30 min-w-[130px] font-medium
										hover:bg-white/10 hover:border-white/20 transition-all duration-300
									"
								>
									{chainOptions.map((chain) => (
										<option
											key={chain.chainId}
											value={chain.chainId}
											className="bg-gray-800 text-white"
										>
											{chain.label}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
							</div>

							{/* Sort Filter */}
							<div className="relative">
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value as any)}
									className="
										appearance-none bg-white/5 backdrop-blur-sm border border-white/10 
										rounded-xl px-5 py-3 text-white pr-10 focus:outline-none focus:ring-2 
										focus:ring-blue-500/30 min-w-[130px] font-medium
										hover:bg-white/10 hover:border-white/20 transition-all duration-300
									"
								>
									<option value="newest" className="bg-gray-800">
										Newest
									</option>
									<option value="oldest" className="bg-gray-800">
										Oldest
									</option>
									<option value="apy" className="bg-gray-800">
										Highest APY
									</option>
									<option value="tvl" className="bg-gray-800">
										Highest TVL
									</option>
									<option value="participants" className="bg-gray-800">
										Most Popular
									</option>
								</select>
								<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
							</div>

							{/* View Toggle */}
							<SwitchTableOrCard
								isCard={isCardView}
								setIsCard={handleViewToggle}
							/>
						</div>
					</div>

					{/* Content Tabs */}
					<div className="flex flex-wrap gap-3 mb-16">
						{[
							{ id: 'overview', label: 'Overview', icon: Globe },
							{ id: 'launchpools', label: 'Launchpools', icon: Zap },
							{ id: 'projects', label: 'All Projects', icon: Layers },
							{ id: 'trending', label: 'Trending', icon: TrendingUp },
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveSection(tab.id as any)}
								className={`
									flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium
									${
										activeSection === tab.id
											? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg'
											: 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
									}
								`}
							>
								<tab.icon className="w-5 h-5" />
								{tab.label}
							</button>
						))}
					</div>

					{/* Content Based on Active Section */}
					{activeSection === 'overview' && (
						<div className="space-y-16">
							{/* Featured Launchpools */}
							{featuredLaunchpools.length > 0 && (
								<div>
									<div className="flex items-center justify-between mb-8">
										<div>
											<h3 className="text-2xl font-bold text-white mb-2">
												Featured Launchpools
											</h3>
											<p className="text-gray-400">
												High-yield opportunities selected for you
											</p>
										</div>
										<button
											onClick={() => setActiveSection('launchpools')}
											className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
										>
											View All <ArrowRight className="w-4 h-4" />
										</button>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
										{featuredLaunchpools.slice(0, 6).map((pool, index) => (
											<SectionComponent key={`featured-${pool.id}-${index}`}>
												<LaunchpoolCard launchpool={pool} />
											</SectionComponent>
										))}
									</div>
								</div>
							)}

							{/* Trending Projects */}
							{trendingProjects.length > 0 && (
								<div>
									<div className="flex items-center justify-between mb-8">
										<div>
											<h3 className="text-2xl font-bold text-white mb-2">
												Trending Projects
											</h3>
											<p className="text-gray-400">
												Most popular projects by user activity
											</p>
										</div>
										<button
											onClick={() => setActiveSection('trending')}
											className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
										>
											View All <ArrowRight className="w-4 h-4" />
										</button>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
										{trendingProjects.slice(0, 6).map((project, index) => (
											<SectionComponent key={`trending-${project.id}-${index}`}>
												<AllProjectCard project={project} />
											</SectionComponent>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{activeSection === 'launchpools' && (
						<div>
							<div className="text-center mb-12">
								<h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white mb-4">
									All Launchpools
								</h2>
								<p className="text-gray-300 text-lg max-w-2xl mx-auto">
									Discover high-yield staking opportunities across the ecosystem
								</p>
							</div>
							{allLaunchpools.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
									{allLaunchpools.map((pool, index) => (
										<SectionComponent key={`pool-${pool.id}-${index}`}>
											<LaunchpoolCard launchpool={pool} />
										</SectionComponent>
									))}
								</div>
							) : (
								<div className="text-center py-20">
									<div className="text-gray-400 text-lg">
										No launchpools available
									</div>
								</div>
							)}
						</div>
					)}

					{activeSection === 'projects' && (
						<div>
							<div className="text-center mb-12">
								<h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white mb-4">
									All Projects
								</h2>
								<p className="text-gray-300 text-lg max-w-2xl mx-auto">
									Complete ecosystem of DeFi projects and opportunities
								</p>
							</div>
							{/* Projects Section */}
							<div className="relative">
								{/* Show loading state when initially loading */}
								{isLoading && (
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
												We couldn&apos;t find what you were looking for.
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
									)}
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

										{isCardView ? (
											<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24 relative z-20">
												{paginatedProjects.map(
													(project: EnrichedProject, index: number) => (
														<SectionComponent key={`${project.id}-${index}`}>
															<AllProjectCard project={project} />
														</SectionComponent>
													)
												)}
											</div>
										) : (
											<div className="mb-8 relative z-20">
												<DataTable
													data={paginatedProjects}
													columns={tableColumns}
													keyField="id"
													renderActions={renderTableActions}
													renderExpandableRow={renderExpandableRow}
													onRowClick={(project) =>
														setSelectedProject(
															selectedProject &&
																selectedProject.id === project.id
																? null
																: project
														)
													}
													className="max-w-full"
													noDataMessage="No projects found"
												/>

												{/* Pagination Controls */}
												{totalPages > 1 && (
													<div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
														<PaginationInfo
															currentPage={currentPage}
															totalPages={totalPages}
															totalItems={totalItems}
															itemsPerPage={itemsPerPage}
															className="order-2 sm:order-1"
														/>
														<Pagination
															currentPage={currentPage}
															totalPages={totalPages}
															onPageChange={handlePageChange}
															className="order-1 sm:order-2"
														/>
													</div>
												)}
											</div>
										)}
									</div>
								)}
								{/* Infinite scroll loading trigger - Only for card view */}
								{!debouncedSearchQuery && isCardView && (
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
														End
													</span>
													<div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					)}

					{activeSection === 'trending' && (
						<div>
							<div className="text-center mb-12">
								<h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white mb-4">
									Trending Projects
								</h2>
								<p className="text-gray-300 text-lg max-w-2xl mx-auto">
									Most popular projects based on user activity and engagement
								</p>
							</div>
							{trendingProjects.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
									{trendingProjects.map((project, index) => (
										<SectionComponent
											key={`trending-all-${project.id}-${index}`}
										>
											<AllProjectCard project={project} />
										</SectionComponent>
									))}
								</div>
							) : (
								<div className="text-center py-20">
									<div className="text-gray-400 text-lg">
										No trending projects available
									</div>
								</div>
							)}
						</div>
					)}

					{/* Call to Action Section */}
					<div className="mt-24 mb-16">
						<div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
							<div className="text-center">
								<h3 className="text-2xl font-bold text-white mb-4">
									Ready to Launch Your Project?
								</h3>
								<p className="text-gray-300 mb-6 max-w-2xl mx-auto">
									Join the Defrost ecosystem and launch your own DeFi project
									with our comprehensive platform
								</p>
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
										<Link href="/project/create">Launch Project</Link>
									</button>
									<button className="px-8 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20">
										Learn More
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
