'use client'

import ProjectGeneral from './ProjectGeneral'
import { useProjectStore } from '@/app/store/project'

const ProjectDetailPage = () => {
	const { currentProject } = useProjectStore()

	return (
		<>
			{currentProject ? (
				<div>
					<ProjectGeneral project={currentProject} />
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
