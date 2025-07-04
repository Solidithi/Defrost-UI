'use client'

import { useMemo } from 'react'
import ProjectDetail from './ProjectDetail'
import { useStakingStore } from '@/app/store/staking'
import { useProjectStore } from '@/app/store/project'

const ProjectDetailPage = () => {
	const { pools } = useStakingStore()
	const { currentProject } = useProjectStore()
	console.log('poolssssssssssssssssssssssssss:', pools)
	const launchpools = useMemo(() => {
		if (!pools || !pools.launchpools || !pools.launchpools.length) {
			return undefined
		}
		return pools.launchpools
	}, [pools.launchpools])

	console.log('ProjectDetailPage - launchpools:', launchpools)

	return (
		<>
			{currentProject ? (
				<div>
					<ProjectDetail launchpools={launchpools} project={currentProject} />
				</div>
			) : (
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<h2 className="text-xl font-semibold text-gray-800 mb-2">
							Project Not Found
						</h2>
						<p className="text-gray-600">
							The project you are looking for could not be found.
						</p>
					</div>
				</div>
			)}
		</>
	)
}

export default ProjectDetailPage
