'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useProjectStore } from '@/app/store/project'
import { useAccount } from 'wagmi'
import { LoadingModal } from '@/app/components/UI/modal/LoadingModal'
import Spinner from '@/app/components/UI/effect/Spinner'
import AlertInfo from '@/app/components/UI/shared/AlertInfo'

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const params = useParams()
	const projectID = params['project-id'].toString()
	const { chainId, address } = useAccount()

	const { isLoading, error, fetchProject, fetchMockProject } = useProjectStore()

	// Fetch project data on mount and when projectId changes or when user change wallet
	useEffect(() => {
		if (!projectID || !chainId || !address) {
			return
		}

		if (false) {
			// fetchMockProject(chainId, projectID, address)
		} else {
			fetchProject(projectID, true)
		}
	}, [projectID, address])

	// Show loading state
	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-[60vh]">
				<LoadingModal
					isOpen={isLoading}
					message="Loading project"
					subMessage="Please wait while we fetch the project data"
				/>
			</div>
		)
	}

	// Show error state
	if (error) {
		return (
			<div className="flex justify-center items-center h-[60vh]">
				<AlertInfo accentColor="red">
					<div>
						<p className="font-semibold mb-2">Error loading project</p>
						<p>{error}</p>
					</div>
				</AlertInfo>
			</div>
		)
	}

	return children
}
