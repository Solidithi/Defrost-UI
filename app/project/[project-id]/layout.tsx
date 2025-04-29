'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useProjectStore } from '@/app/store/project'
import { useAccount } from 'wagmi'
import Spinner from '@/app/components/UI/effect/Spinner'
import AlertInfo from '@/app/components/UI/shared/AlertInfo'

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const params = useParams()
	const projectID = params['project-id'].toString()
	const { chainId, isConnected, address } = useAccount()

	const { currentProject, isLoading, error, fetchProject, fetchMockProject } =
		useProjectStore()

	// Fetch project data on mount and when projectId changes or when user change wallet
	useEffect(() => {
		if (!projectID || !chainId || !address) {
			return
		}

		if (process.env.NODE_ENV === 'development') {
			fetchMockProject(chainId, projectID, address)
		} else {
			fetchProject(projectID)
		}
	}, [projectID, address])

	// Show loading state
	if (isLoading && !currentProject) {
		return (
			<div className="flex justify-center items-center h-[60vh]">
				<Spinner heightWidth={12} className="border-blue-400" />
			</div>
		)
	}

	// Show error state
	if (error) {
		return (
			<div className="max-w-3xl mx-auto mt-12">
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
