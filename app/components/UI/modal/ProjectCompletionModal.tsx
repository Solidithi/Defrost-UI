'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Edit3 } from 'lucide-react'

interface ProjectCompletionModalProps {
	isOpen: boolean
	projectId?: string
	projectName: string
	onViewDetails: () => void
	onContinueEditing: () => void
}

export function ProjectCompletionModal({
	isOpen,
	projectId,
	projectName,
	onViewDetails,
	onContinueEditing,
}: ProjectCompletionModalProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	if (!mounted) return null

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center"
				>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.7 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-black/80 backdrop-blur-sm"
					/>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className="relative z-50 w-full max-w-md rounded-xl bg-gradient-to-b from-gray-900/90 to-black/95 p-6 shadow-2xl border border-cyan-500/20"
					>
						<div className="absolute -top-12 left-1/2 -translate-x-1/2">
							<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 border border-gray-800 shadow-xl">
								<div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md" />
								<div className="relative">
									<Check className="h-8 w-8 text-emerald-500" />
								</div>
							</div>
						</div>

						<div className="mt-6 text-center">
							<h3 className="text-xl font-medium text-white">Success!</h3>
							<p className="mt-2 text-sm text-gray-400">
								Your project{' '}
								<span className="text-cyan-400 font-medium">{projectName}</span>{' '}
								has been {projectId ? 'updated' : 'created'} successfully.
							</p>
						</div>

						<div className="mt-6 flex flex-col space-y-3">
							<button
								onClick={onViewDetails}
								className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-sm font-medium text-white transition-colors hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
							>
								View Project Details
								<ChevronRight className="h-4 w-4 ml-2" />
							</button>
							<button
								onClick={onContinueEditing}
								className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
							>
								Continue Editing
								<Edit3 className="h-4 w-4 ml-2" />
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
