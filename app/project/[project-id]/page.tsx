'use client'

import { redirect } from 'next/navigation'
import { useParams } from 'next/navigation'

export default function ProjectPage() {
	const params = useParams()
	const projectId = params['project-id']
	redirect(`/project/${projectId}/general`)
}
