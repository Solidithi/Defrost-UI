'use client'

import { useEffect } from 'react'
import { Search, Zap, BarChart3, Clock, Award } from 'lucide-react'
import { LaunchpoolStakingCard } from '@/app/components/UI/card/LaunchPoolStakingCard'
import { StakingStatsCard } from '@/app/components/UI/card/StakingStatsCard'
import { StakingFilters } from '@/app/components/UI/filter/StakingFilter'
import { LaunchpoolStakingDetailsModal } from '@/app/components/UI/modal/LaunchpoolStakingDetailsModal'
import { cn } from '@/app/lib/utils'
import {
	useStakingStore,
	useFilteredPools,
	useSelectedPool,
	useTotalClaimableRewardsFormatted,
} from '@/app/store/my-staking'
import { useAccount, useReadContract } from 'wagmi'
import { abi as launchpoolABI } from '@/abi/Launchpool.json' // @TODO: optimize this later
import { useNavBarControl } from '../provider/navbar-control'

export function MyStakingPage() {
	const {
		activeTab,
		setActiveTab,
		activeFilters,
		setActiveFilters,
		showDetailsModal,
		closeDetailsModal,
		selectPool,
		fetchPools,
		isLoading,
	} = useStakingStore()

	const filteredPools = useFilteredPools()
	const selectedPool = useSelectedPool()
	// const selectedTokensInfo = useSelectedPoolTokensInfo()
	const account = useAccount()

	// Fetch pools when component mounts or when account changes
	useEffect(() => {
		if (!account.isConnected || !account.address || !account.chainId) {
			return
		}
		fetchPools(account.address, account.chainId)
	}, [fetchPools, account.address, account.chainId])

	// Read staking data for selected pool
	const { data: yourNativeStake, status: readStakerNativeAmountStatus } =
		useReadContract({
			abi: launchpoolABI,
			address: selectedPool?.id as `0x${string}` | undefined,
			functionName: 'getStakerNativeAmount',
			args: [account.address],
			query: {
				enabled: !!account.address && !!selectedPool?.id,
			},
		})

	const { data: totalVTokensStake, status: readTotalStakedVTokensStatus } =
		useReadContract({
			abi: launchpoolABI,
			address: selectedPool?.id as `0x${string}` | undefined,
			functionName: 'getTotalStakedVTokens',
			query: {
				enabled: !!account.address && !!selectedPool?.id,
			},
		})

	const { data: withdrawableVTokens, status: readWithdrawableVTokensStatus } =
		useReadContract({
			abi: launchpoolABI,
			address: selectedPool?.id as `0x${string}` | undefined,
			functionName: 'getWithdrawableVTokens',
			args: [BigInt((yourNativeStake as string) || 0)],
			query: {
				enabled: !!account.address && !!selectedPool?.id && !!yourNativeStake,
			},
		})

	const { data: totalNativeStake, status: readTotalNativeStakeStatus } =
		useReadContract({
			abi: launchpoolABI,
			address: selectedPool?.id as `0x${string}` | undefined,
			functionName: 'totalNativeStake',
			query: {
				enabled: !!selectedPool?.id,
			},
		})

	// Calculate user's pool share percentage
	const yourPoolSharePercent =
		!totalNativeStake ||
		!yourNativeStake ||
		BigInt((totalNativeStake as string) || '0') === BigInt(0)
			? 0
			: Number(
					(BigInt(yourNativeStake.toString()) * BigInt(10000)) /
						BigInt(totalNativeStake.toString())
				) / 100

	// Calculate total staked value across all pools
	// const totalStaked = filteredPools.launchpools.reduce(
	// 	(acc, pool) => acc + Number(pool.yourStake || 0),
	// 	0
	// )
	const totalStaked = 135000
	const totalRewardsFormatted = useTotalClaimableRewardsFormatted()

	// Calculate total active and ended pools
	const activePoolsCount = filteredPools.launchpools.filter(
		(pool) => pool.status === 'active'
	).length

	const endedPoolsCount = filteredPools.launchpools.filter(
		(pool) => pool.status === 'ended'
	).length

	// Calculate total filtered pools count for pagination
	const filteredPoolsCount = Object.values(filteredPools).reduce(
		(acc, pools) => acc + pools.length,
		0
	)

	const { setIsNavbarShown } = useNavBarControl()
	useEffect(() => {
		setIsNavbarShown(!showDetailsModal)
	}, [showDetailsModal])

	return (
		<div className="min-h-screen bg-black text-white overflow-hidden relative">
			{/* Beam effects */}
			<div className="beam beam-1"></div>
			<div className="beam beam-2"></div>
			<div className="beam beam-3"></div>

			{/* Grid background */}
			<div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>

			{/* Gradient orbs */}
			<div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-blue-500/15 filter blur-[100px] pointer-events-none"></div>
			<div className="absolute bottom-40 right-1/4 w-96 h-96 rounded-full bg-pink-500/15 filter blur-[100px] pointer-events-none"></div>
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-500/10 filter blur-[120px] pointer-events-none"></div>

			{/* Header */}
			{/* Filler */}
			<div className="mb-32"></div>
			{/* <header className="relative z-10 border-b border-white/20 backdrop-blur-xl bg-white/10 shadow-lg">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-8">
						<div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
							My Staking
						</div>
						<nav className="hidden md:flex space-x-6">
							<a href="#" className="text-white/80 hover:text-white transition">
								Dashboard
							</a>
							<a
								href="#"
								className="text-white hover:text-white transition border-b-2 border-purple-500"
							>
								My Staking
							</a>
							<a href="#" className="text-white/80 hover:text-white transition">
								Discover Pools
							</a>
							<a href="#" className="text-white/80 hover:text-white transition">
								Analytics
							</a>
						</nav>
					</div>
					<div className="flex items-center space-x-4">
						<button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition shadow-lg shadow-purple-500/30">
							{account.isConnected
								? `${account.address?.slice(0, 6)}...${account.address?.slice(-4)}`
								: 'Connect Wallet'}
						</button>
					</div>
				</div>
			</header> */}

			{/* Main Content */}
			<main className="relative z-10 container mx-auto px-4 py-8">
				{/* Hero Section */}
				<div className="mb-8 relative overflow-hidden rounded-2xl glossy-card p-6 md:p-8">
					<div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-15"></div>
					<div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-15"></div>

					<div className="grid md:grid-cols-2 gap-8 items-center">
						<div>
							<h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
								Your Staking Portfolio
							</h1>
							<p className="text-white/80 mb-6">
								Track and manage all your staking activities across multiple
								pools. Earn rewards and maximize your yield with vToken staking.
							</p>
							<div className="flex flex-wrap gap-4">
								<button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-purple-500/30">
									<Zap size={18} />
									Stake Now
								</button>
								<button className="px-6 py-3 rounded-full backdrop-blur-xl bg-white/15 border border-white/20 text-white font-medium hover:bg-white/20 transition flex items-center gap-2">
									<Award size={18} />
									Claim All Rewards
								</button>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<StakingStatsCard
								title="Total Staked Value"
								value={`${totalStaked.toLocaleString()} Tokens`}
								icon={<BarChart3 className="text-blue-400" />}
							/>
							<StakingStatsCard
								title="Active Pools"
								value={activePoolsCount.toString()}
								icon={<Zap className="text-pink-400" />}
							/>
							<StakingStatsCard
								title="Total Rewards"
								value={totalRewardsFormatted}
								icon={<Award className="text-purple-400" />}
							/>
							<StakingStatsCard
								title="Ended Pools"
								value={endedPoolsCount.toString()}
								icon={<Clock className="text-gray-400" />}
							/>
						</div>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
					<div className="relative w-full md:w-96">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
							size={18}
						/>
						<input
							type="text"
							placeholder="Search pools..."
							className="w-full pl-10 pr-4 py-3 rounded-xl glossy-input text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
						/>
					</div>

					<StakingFilters
						initialPoolTypes={activeFilters.activePoolTypes}
						initialSortOrder={activeFilters.activeSortOrder}
						onFilterChange={setActiveFilters}
					/>
				</div>

				{/* Tabs */}
				<div className="mb-6 flex border-b border-white/20">
					<button
						onClick={() => setActiveTab('all')}
						className={cn(
							'px-6 py-3 font-medium transition-colors relative',
							activeTab === 'all'
								? 'text-white'
								: 'text-white/60 hover:text-white/90'
						)}
					>
						All Pools
						{activeTab === 'all' && (
							<span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></span>
						)}
					</button>
					<button
						onClick={() => setActiveTab('active')}
						className={cn(
							'px-6 py-3 font-medium transition-colors relative',
							activeTab === 'active'
								? 'text-white'
								: 'text-white/60 hover:text-white/90'
						)}
					>
						Active
						{activeTab === 'active' && (
							<span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></span>
						)}
					</button>
					<button
						onClick={() => setActiveTab('ended')}
						className={cn(
							'px-6 py-3 font-medium transition-colors relative',
							activeTab === 'ended'
								? 'text-white'
								: 'text-white/60 hover:text-white/90'
						)}
					>
						Ended
						{activeTab === 'ended' && (
							<span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></span>
						)}
					</button>
				</div>

				{/* Loading State */}
				{isLoading ? (
					<div className="flex justify-center items-center py-20">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
					</div>
				) : (
					<>
						{/* Staking Pools Grid */}
						{filteredPools.launchpools.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredPools.launchpools.map((pool) => (
									<LaunchpoolStakingCard
										key={pool.id}
										pool={pool}
										onSelect={() => selectPool(pool.id, 'launchpool')}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-16">
								<p className="text-white/80 mb-4">
									No pools found matching your criteria
								</p>
								<button
									onClick={() => {
										setActiveTab('all')
										setActiveFilters({
											activePoolTypes: ['launchpool'],
											activeSortOrder: 'Highest APY',
										})
									}}
									className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-white/20 text-white hover:from-blue-500/40 hover:via-purple-500/40 hover:to-pink-500/40 transition"
								>
									Reset Filters
								</button>
							</div>
						)}

						{/* Show More Button */}
						{filteredPoolsCount > 6 && (
							<div className="mt-8 flex justify-center">
								<button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-white/20 text-white font-medium hover:from-blue-500/40 hover:via-purple-500/40 hover:to-pink-500/40 transition">
									Show More
								</button>
							</div>
						)}
					</>
				)}

				{/* Pool Details Modal */}
				{showDetailsModal && selectedPool && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
						<div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl glossy-card p-6 shadow-xl shadow-purple-500/20">
							<button
								onClick={closeDetailsModal}
								className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 transition"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-x"
								>
									<path d="M18 6 6 18" />
									<path d="m6 6 12 12" />
								</svg>
							</button>
							{selectedPool.type === 'launchpool' && (
								<LaunchpoolStakingDetailsModal
									pool={selectedPool}
									yourStakePercent={yourPoolSharePercent}
									yourNativeStake={yourNativeStake as bigint}
									withdrawableVTokens={withdrawableVTokens as bigint}
									totalStakedVTokens={totalVTokensStake as bigint}
									onClose={closeDetailsModal}
								/>
							)}
						</div>
					</div>
				)}
			</main>
		</div>
	)
}
