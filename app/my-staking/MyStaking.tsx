'use client'

import { useState } from 'react'
import { Search, Zap, BarChart3, Clock, Award } from 'lucide-react'
import { StakingCard } from './staking-card'
import { StakingStats } from './staking-stats'
import { StakingFilters } from './staking-filters'
import { StakingPoolDetails } from './staking-pool-details'
import { cn } from '@/lib/utils'

export function MyStakingPage() {
	const [activeTab, setActiveTab] = useState('all')
	const [selectedPool, setSelectedPool] = useState<string | null>(null)
	const [showDetails, setShowDetails] = useState(false)

	// Mock data for demonstration
	const stakingPools = [
		{
			id: '1',
			type: 'launchpool',
			name: 'vDOT Flexible Staking',
			description: 'Liquid staking for Polkadot with flexible redemption',
			image: '/placeholder.svg?height=200&width=200',
			apy: '245837.23%',
			duration: '69445 days',
			acceptedTokens: ['vDOT'],
			yourStake: '1069.0',
			poolTotal: '1069000.0',
			yourShare: '0.1%',
			status: 'active',
		},
		{
			id: '2',
			type: 'launchpool',
			name: 'vKSM Flexible Staking',
			description: 'Liquid staking for Kusama with flexible redemption',
			image: '/placeholder.svg?height=200&width=200',
			apy: '187432.56%',
			duration: '69445 days',
			acceptedTokens: ['vKSM'],
			yourStake: '532.5',
			poolTotal: '890000.0',
			yourShare: '0.06%',
			status: 'active',
		},
		{
			id: '3',
			type: 'launchpool',
			name: 'vBNC Flexible Staking',
			description: 'Liquid staking for Bifrost with flexible redemption',
			image: '/placeholder.svg?height=200&width=200',
			apy: '98765.43%',
			duration: '69445 days',
			acceptedTokens: ['vBNC'],
			yourStake: '2500.0',
			poolTotal: '5000000.0',
			yourShare: '0.05%',
			status: 'active',
		},
		{
			id: '4',
			type: 'launchpool',
			name: 'vGLMR Flexible Staking',
			description: 'Liquid staking for Moonbeam with flexible redemption',
			image: '/placeholder.svg?height=200&width=200',
			apy: '76543.21%',
			duration: '69445 days',
			acceptedTokens: ['vGLMR'],
			yourStake: '0.0',
			poolTotal: '3000000.0',
			yourShare: '0%',
			status: 'active',
		},
		{
			id: '5',
			type: 'launchpool',
			name: 'vMOVR Flexible Staking',
			description: 'Liquid staking for Moonriver with flexible redemption',
			image: '/placeholder.svg?height=200&width=200',
			apy: '54321.98%',
			duration: '69445 days',
			acceptedTokens: ['vMOVR'],
			yourStake: '0.0',
			poolTotal: '2000000.0',
			yourShare: '0%',
			status: 'ended',
		},
		{
			id: '6',
			type: 'launchpool',
			name: 'vASTR Flexible Staking',
			description: 'Liquid staking for Astar with flexible redemption',
			image: '/placeholder.svg?height=200&width=200',
			apy: '43210.87%',
			duration: '69445 days',
			acceptedTokens: ['vASTR'],
			yourStake: '0.0',
			poolTotal: '1500000.0',
			yourShare: '0%',
			status: 'ended',
		},
	]

	const filteredPools = stakingPools.filter((pool) => {
		if (activeTab === 'all') return true
		if (activeTab === 'active') return pool.status === 'active'
		if (activeTab === 'ended') return pool.status === 'ended'
		return true
	})

	const handlePoolSelect = (id: string) => {
		setSelectedPool(id)
		setShowDetails(true)
	}

	const totalStaked = stakingPools.reduce(
		(acc, pool) => acc + Number.parseFloat(pool.yourStake),
		0
	)
	const activePoolsCount = stakingPools.filter(
		(pool) => pool.status === 'active'
	).length
	const endedPoolsCount = stakingPools.filter(
		(pool) => pool.status === 'ended'
	).length

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
			<header className="relative z-10 border-b border-white/20 backdrop-blur-xl bg-white/10 shadow-lg">
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
							Connect Wallet
						</button>
					</div>
				</div>
			</header>

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
							<StakingStats
								title="Total Staked Value"
								value={`${totalStaked.toLocaleString()} Tokens`}
								icon={<BarChart3 className="text-blue-400" />}
							/>
							<StakingStats
								title="Active Pools"
								value={activePoolsCount.toString()}
								icon={<Zap className="text-pink-400" />}
							/>
							<StakingStats
								title="Total Rewards"
								value="Coming Soon"
								icon={<Award className="text-purple-400" />}
							/>
							<StakingStats
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

					<StakingFilters />
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

				{/* Staking Pools Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredPools.map((pool) => (
						<StakingCard
							key={pool.id}
							pool={pool}
							onSelect={() => handlePoolSelect(pool.id)}
						/>
					))}
				</div>

				{/* Show More Button */}
				{filteredPools.length > 6 && (
					<div className="mt-8 flex justify-center">
						<button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-white/20 text-white font-medium hover:from-blue-500/40 hover:via-purple-500/40 hover:to-pink-500/40 transition">
							Show More
						</button>
					</div>
				)}

				{/* Pool Details Modal */}
				{showDetails && selectedPool && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
						<div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl glossy-card p-6 shadow-xl shadow-purple-500/20">
							<button
								onClick={() => setShowDetails(false)}
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

							<StakingPoolDetails
								pool={stakingPools.find((p) => p.id === selectedPool)!}
								onClose={() => setShowDetails(false)}
							/>
						</div>
					</div>
				)}
			</main>
		</div>
	)
}
