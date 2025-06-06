'use client'

import { ProjectDetail, TokenPool } from '@/app/types'
import { AllPoolsTab } from '../../project-detail-sections/ContentTab'
import Button from '@/app/components/UI/button/Button'
import { useStakingStore } from '@/app/store/staking'
import { useProjectStore } from '@/app/store/project'
import { useEffect } from 'react'
import { LaunchpoolCard } from '../../UI/card/LaunchpoolCard'

// interface PoolTabProps {}

export const PoolTab = () => {
	const { currentProject } = useProjectStore()
	const { fetchPoolsOfProject, pools } = useStakingStore()

	useEffect(() => {
		const projectIDFromContext = currentProject?.id
		if (projectIDFromContext) {
			console.log(`Fetching launchpools for project ${currentProject.id}`)
			// fetch & set
			fetchPoolsOfProject(projectIDFromContext, {
				fetchLaunchpools: true,
			})
		}
	}, [currentProject])

	return (
		<div className="">
			<div className="flex justify-end my-10">
				<Button
					className="bg-[#59A1EC] text-white font-orbitron font-bold  hover:bg-[#59A1EC]/80  py-4 rounded-2xl flex items-center"
					onClick={() => {
						// Handle button click
					}}
				>
					<span className="">Create New Pool</span>
					{/* <Plus size={16} /> */}
				</Button>
			</div>

			{/* <AllPoolsTab
				projectCards={projectDetail.projectDetail.tokenPools.map(
					(pool: TokenPool) => ({
						projectName: pool.name,
						projectShortDescription: `Amount: ${pool.amount}, Percentage: ${pool.percentage}%`,
						projectAPR: `${pool.percentage}%`,
					})
				)}

			/> */}
			{/* The tab inside the launchpool page that shows all project's launchpool */}
			<div className="glass-component-1 text-white mt-10 p-6 rounded-lg">
				<div className="grid grid-cols-3 gap-8 w-full mx-auto mb-24">
					{pools.launchpools.map((launchpool, index) => {
						return (
							<LaunchpoolCard
								launchpool={launchpool}
								key={`LaunchpoolCard-${index}-${Date.now()}`}
							/>
						)
					})}
				</div>
			</div>

			{/* Display launchpool */}
		</div>
	)
}
