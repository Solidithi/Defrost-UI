'use client'

import {
	useStakingStore,
	TokenInfo,
	useFilteredPoolByStakingToken,
} from '@/app/store/staking'
import { useProjectStore } from '@/app/store/project'
import { useEffect } from 'react'
import { LaunchpoolCard } from '../../UI/card/LaunchpoolCard'
import { useAccount } from 'wagmi'
import { normalizeAddress } from '@/app/utils/address'
import { ProjectOwnerIndicator } from '@/app/components/UI/shared/ProjectOwnerIndicator'
import { Address } from 'viem'
import { CircleArrowRight } from 'lucide-react'
import Link from 'next/link'
import Button from '@/app/components/UI/button/Button'

interface PoolTabProps {
	selectedVToken?: TokenInfo | null
	poolLimit?: number
}

export const PoolTab = ({ selectedVToken, poolLimit }: PoolTabProps) => {
	const { currentProject } = useProjectStore()
	const { fetchPoolsOfProject } = useStakingStore()
	const account = useAccount()

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

	const handleCreatePoolClick = () => {}

	return (
		<div>
			<div className="flex justify-between items-center my-10">
				{selectedVToken && (
					<div className="flex items-center gap-3">
						<div className="text-white text-lg font-semibold tracking-wide">
							Showing pools for
							<span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-500 ml-2 font-bold tracking-wide px-2 py-0.5 rounded-md">
								{selectedVToken.symbol}
							</span>
						</div>
						<div className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-400/30 flex items-center">
							<span className="mr-1 text-blue-200 font-bold">
								{filteredPoolsByVToken.launchpools.length}
							</span>
							pools
						</div>
					</div>
				)}
			</div>
			{/* Show empty state when vToken selected but no pools */}
			{showVTokenEmptyState && selectedVToken ? (
				<div className="glass-enhanced text-white mt-10 p-12 rounded-2xl text-center border border-white/10">
					<div className="max-w-md mx-auto">
						<div className="mb-6">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
								<div className="text-3xl">🎯</div>
							</div>
							<h3 className="text-xl font-bold font-orbitron mb-3 text-gray-100">
								No {selectedVToken.symbol} Pools Yet
							</h3>
							<p className="text-gray-400 text-sm leading-relaxed mb-6">
								There are currently no launchpools available for{' '}
								<span className="text-blue-300 font-medium">
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
								className="warm-cool-bg text-white font-medium px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
								onClick={() => {
									// Handle create pool click
								}}
							>
								<Link
									href={`/project/${currentProject?.id}/launchpool/create`}
									className="flex items-center gap-2"
								>
									<span>Create First {selectedVToken.symbol} Pool</span>
									<CircleArrowRight size={16} />
								</Link>
							</Button>
						)}
					</div>
				</div>
			) : showGeneralEmptyState ? (
				<div className="glass-enhanced text-white mt-10 p-16 rounded-2xl text-center border border-white/10">
					<div className="max-w-lg mx-auto">
						<div className="mb-8">
							<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
								<div className="text-4xl">🚀</div>
							</div>
							<h3 className="text-2xl font-bold font-orbitron mb-4 text-gray-100">
								{isProjectOwner
									? 'Launch Your First Pool'
									: 'No Pools Available'}
							</h3>
							<p className="text-gray-400 leading-relaxed mb-8">
								{isProjectOwner
									? 'Get started by creating your first launchpool. Choose from various staking tokens and configure your emission schedule to attract stakers.'
									: "This project hasn't created any launchpools yet. Launchpools allow users to stake tokens and earn rewards over time."}
							</p>
						</div>

						{isProjectOwner && (
							<div className="space-y-4">
								<Button
									className="warm-cool-bg text-white font-medium px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
									onClick={handleCreatePoolClick}
								>
									<Link
										href={`/project/${currentProject?.id}/launchpool/create`}
										className="flex items-center gap-2"
									>
										<span>Create Your First Pool</span>
										<CircleArrowRight size={18} />
									</Link>
								</Button>
								<p className="text-xs text-gray-500 mt-3">
									Choose from {/* Add dynamic count if available */} supported
									staking tokens
								</p>
							</div>
						)}
					</div>
				</div>
			) : (
				/* The tab inside the launchpool page that shows all project's launchpool */
				<div className="glass-enhanced text-white mt-10 p-6 rounded-2xl border border-white/10">
					{isProjectOwner && (
						<div className="flex flex-row items-center justify-between mb-6">
							<ProjectOwnerIndicator containerClassName="max-w-xl" />
							<Button
								className="warm-cool-bg text-white font-orbitron font-bold hover:scale-105 transition-transform duration-200 rounded-2xl flex items-center ml-auto mx-4 shadow-lg"
								onClick={handleCreatePoolClick}
							>
								<Link
									href={`/project/${currentProject?.id}/launchpool/create`}
									className="flex items-center gap-2"
								>
									<span className="text-white bg-clip-text font-semibold">
										Create Pool
									</span>
									<CircleArrowRight size={17} className="font-semibold" />
								</Link>
							</Button>
						</div>
					)}

					{filteredPoolsByVToken.launchpools.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto mb-8">
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
						<div className="text-center py-12">
							<div className="text-gray-400 text-sm">
								{selectedVToken
									? `No pools found for ${selectedVToken.symbol}`
									: 'No pools available'}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
