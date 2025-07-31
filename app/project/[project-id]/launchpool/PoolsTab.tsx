'use client'

import {
	useStakingStore,
	TokenInfo,
	useFilteredPoolByStakingToken,
} from '@/app/store/staking'
import { useProjectStore } from '@/app/store/project'
import { useEffect } from 'react'
import { LaunchpoolCard } from '../../../components/UI/card/LaunchpoolCard'
import { useAccount } from 'wagmi'
import { normalizeAddress } from '@/app/utils/address'
import { ProjectOwnerIndicator } from '@/app/components/UI/shared/ProjectOwnerIndicator'
import { Address } from 'viem'
import { CircleArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/app/components/UI/button/Button'

interface PoolsTabProps {
	selectedVToken?: TokenInfo | null
	poolLimit?: number
}

export const PoolsTab = ({ selectedVToken, poolLimit }: PoolsTabProps) => {
	const { currentProject } = useProjectStore()
	const { fetchPoolsOfProject } = useStakingStore()
	const account = useAccount()
	const router = useRouter()

	// Check if current user is project owner
	const isProjectOwner =
		account.address &&
		normalizeAddress(account.address) ===
			normalizeAddress(currentProject?.owner_id as Address)

	// Apply vToken filtering
	const filteredPoolsByVToken = useFilteredPoolByStakingToken(
		selectedVToken || null
	)

	useEffect(() => {
		const projectIDFromContext = currentProject?.id
		if (projectIDFromContext) {
			console.log(`Fetching launchpools for project ${currentProject.id}`)
			// fetch pools of current project and set into store
			fetchPoolsOfProject(projectIDFromContext, {
				fetchLaunchpools: true,
				limit: poolLimit,
			})
		}
	}, [currentProject])

	// Display message when vToken is selected but no pools found
	const showVTokenEmptyState =
		selectedVToken && filteredPoolsByVToken.launchpools.length === 0

	// Display message when no pools exist at all
	const showGeneralEmptyState =
		!selectedVToken && filteredPoolsByVToken.launchpools.length === 0

	return (
		<div>
			<div className="flex justify-between items-center my-10">
				{selectedVToken && (
					<div className="flex items-center gap-4">
						<div className="text-white text-xl font-black tracking-wide">
							Showing pools for
							<span className="ml-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/25 via-blue-500/20 to-pink-500/25 border border-purple-400/40 font-black tracking-wide text-purple-200 shadow-lg shadow-purple-500/30 backdrop-blur-xl">
								{selectedVToken.symbol}
							</span>
						</div>
						<div className="px-4 py-2 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-700/80 text-slate-200 text-sm font-bold border border-purple-400/30 flex items-center backdrop-blur-xl shadow-lg shadow-purple-500/20">
							<span className="mr-2 text-purple-300 font-black text-base">
								{filteredPoolsByVToken.launchpools.length}
							</span>
							pools
						</div>
					</div>
				)}
			</div>
			{/* Empty state when vToken selected but no pools */}
			{showVTokenEmptyState && selectedVToken ? (
				<div className="relative overflow-hidden">
					{/* Background decoration with vibrant gradients */}
					{/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/25 to-pink-900/30 backdrop-blur-xl rounded-3xl" /> */}
					{/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-3xl animate-pulse" /> */}

					<div className="relative glass-enhanced text-white mt-10 p-16 rounded-3xl text-center border border-purple-400/30 shadow-2xl shadow-purple-500/20">
						<div className="max-w-md mx-auto">
							<div className="mb-8">
								<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/25 via-blue-500/20 to-pink-500/25 flex items-center justify-center backdrop-blur-xl border border-purple-400/40 shadow-xl shadow-purple-500/30">
									<div className="text-4xl">🎯</div>
								</div>
								<h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
									No {selectedVToken.symbol} Pools Yet
								</h3>
								<p className="text-slate-300 text-base leading-relaxed mb-8 font-medium">
									There are currently no launchpools available for{' '}
									<span className="text-purple-300 font-bold">
										{selectedVToken.symbol}
									</span>
									.
									{isProjectOwner
										? ' Create the first pool to get started!'
										: ' Check back later or explore other tokens.'}
								</p>
							</div>

							{isProjectOwner && (
								<Button
									className="bg-gradient-to-r from-purple-600/95 via-blue-600/95 to-pink-600/95 hover:from-purple-700/100 hover:via-blue-700/100 hover:to-pink-700/100 text-white font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-500 shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 backdrop-blur-xl border border-purple-400/30 hover:border-purple-300/50"
									onClick={() => {
										router.push(
											`/project/${currentProject?.id}/launchpool/create`
										)
									}}
								>
									<span className="flex items-center gap-3">
										<span>Create First {selectedVToken.symbol} Pool</span>
										<CircleArrowRight size={18} />
									</span>
								</Button>
							)}
						</div>
					</div>
				</div>
			) : showGeneralEmptyState ? (
				<div className="relative overflow-hidden">
					{/* Background decoration with vibrant gradients */}
					<div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/25 to-pink-900/30 backdrop-blur-xl rounded-3xl" />
					{/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-3xl animate-pulse" /> */}

					<div className="relative glass-enhanced text-white mt-10 p-20 rounded-3xl text-center border border-purple-400/30 shadow-2xl shadow-purple-500/20">
						<div className="max-w-lg mx-auto">
							<div className="mb-10">
								<div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500/25 via-blue-500/20 to-pink-500/25 flex items-center justify-center backdrop-blur-xl border border-purple-400/40 shadow-xl shadow-purple-500/30">
									<div className="text-5xl">🚀</div>
								</div>
								<h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
									{isProjectOwner
										? 'Launch Your First Pool'
										: 'No Pools Available'}
								</h3>
								<p className="text-slate-300 text-lg leading-relaxed mb-10 font-medium">
									{isProjectOwner
										? 'Get started by creating your first launchpool. Choose from various staking tokens and configure your emission schedule to attract stakers.'
										: "This project hasn't created any launchpools yet. Launchpools allow users to stake tokens and earn rewards over time."}
								</p>
							</div>

							{isProjectOwner && (
								<div className="space-y-6">
									<Button
										on
										className="bg-gradient-to-r from-purple-600/95 via-blue-600/95 to-pink-600/95 hover:from-purple-700/100 hover:via-blue-700/100 hover:to-pink-700/100 text-white font-black px-10 py-5 rounded-2xl hover:scale-105 transition-all duration-500 shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 backdrop-blur-xl border border-purple-400/30 hover:border-purple-300/50"
									>
										<Link
											href={`/project/${currentProject?.id}/launchpool/create`}
											className="flex items-center gap-3"
										>
											<span>Create Your First Pool</span>
											<CircleArrowRight size={20} />
										</Link>
									</Button>
									<p className="text-sm text-purple-300 font-medium">
										Choose from multiple supported staking tokens
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				/* Enhanced launchpool container with vibrant styling */
				<div className="relative overflow-hidden">
					<div className="relative glass-enhanced text-white mt-10 p-20 rounded-3xl border border-purple-400/30 shadow-2xl shadow-purple-500/20">
						{isProjectOwner && (
							<div className="flex flex-row items-center justify-between mb-8">
								<ProjectOwnerIndicator containerClassName="max-w-xl" />
								<Button className="bg-gradient-to-r from-purple-600/95 via-blue-600/95 to-pink-600/95 hover:from-purple-700/100 hover:via-blue-700/100 hover:to-pink-700/100 text-white font-black hover:scale-105 transition-all duration-500 rounded-2xl flex items-center ml-auto mx-4 shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 backdrop-blur-xl border border-purple-400/30 hover:border-purple-300/50">
									<Link
										href={`/project/${currentProject?.id}/launchpool/create`}
										className="flex items-center gap-3 px-6 py-3"
									>
										<span className="text-white font-black">Create Pool</span>
										<CircleArrowRight size={18} className="font-semibold" />
									</Link>
								</Button>
							</div>
						)}

						{filteredPoolsByVToken.launchpools.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mx-auto mb-8">
								{filteredPoolsByVToken.launchpools.map((launchpool, index) => {
									return (
										<LaunchpoolCard
											launchpool={launchpool}
											key={`LaunchpoolCard-${index}-${Date.now()}`}
										/>
									)
								})}
							</div>
						) : (
							<div className="text-center py-20">
								<div className="text-slate-300 text-lg font-medium">
									{selectedVToken
										? `No pools found for ${selectedVToken.symbol}`
										: 'No pools available'}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
