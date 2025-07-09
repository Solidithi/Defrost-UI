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
	const showEmptyState =
		selectedVToken && filteredPoolsByVToken.launchpools.length === 0

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
			{showEmptyState ? (
				<div className="glass-enhanced text-white mt-10 p-12 rounded-lg text-center">
					<div className="mb-4">
						<div className="text-6xl mb-4">🚀</div>
						<h3 className="text-xl font-bold mb-2">
							No pools found for {selectedVToken.symbol}
						</h3>
						<p className="text-gray-400 mb-6">
							There are currently no launchpools available for{' '}
							{selectedVToken.symbol}. Be the first to create one!
						</p>
						<Button
							className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90"
							onClick={() => {
								// Handle create pool click
							}}
						>
							Create First Pool for {selectedVToken.symbol}
						</Button>
					</div>
				</div>
			) : (
				/* The tab inside the launchpool page that shows all project's launchpool */
				<div className="glass-enhanced text-white mt-10 p-6 rounded-lg">
					{isProjectOwner && (
						<div className="flex flex-row items-center justify-between mb-6">
							<ProjectOwnerIndicator containerClassName="max-w-xl" />
							<Button
								className="warm-cool-bg text-white font-orbitron font-bold hover:bg-[#59A1EC]/80 py-4 rounded-2xl flex items-center ml-auto mx-4"
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
					<div className="grid grid-cols-3 gap-8 w-full mx-auto mb-24">
						{filteredPoolsByVToken.launchpools.map((launchpool, index) => {
							return (
								<LaunchpoolCard
									launchpool={launchpool}
									key={`LaunchpoolCard-${index}-${Date.now()}`}
								/>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}
