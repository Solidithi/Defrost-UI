'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ErrorModalProps {
	isOpen: boolean
	title?: string
	message: string
	onClose: () => void
	error?: Error | string | null
	showDetails?: boolean
}

export function ErrorModal({
	isOpen,
	title = 'Error Occurred',
	message,
	onClose,
	error = null,
	showDetails = false,
}: ErrorModalProps) {
	const [mounted, setMounted] = useState(false)
	const [showErrorDetails, setShowErrorDetails] = useState(false)

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	if (!mounted) return null

	// Format error details if they exist
	const errorDetails = error
		? error instanceof Error
			? error.message
			: error
		: null

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
						onClick={onClose}
					/>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className="relative z-50 w-full max-w-md rounded-xl bg-gradient-to-b from-red-900/40 to-black/95 p-6 shadow-2xl border border-red-500/20"
					>
						<button
							onClick={onClose}
							className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
						>
							<X className="h-4 w-4" />
						</button>

						<div className="flex flex-col items-center justify-center space-y-6 text-center">
							<div className="relative">
								{/* Outer glow effect */}
								<div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" />

								{/* Error icon with red glow */}
								<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 p-2">
									<motion.div
										initial={{ scale: 0.5 }}
										animate={{ scale: 1 }}
										transition={{
											type: 'spring',
											stiffness: 200,
											damping: 20,
										}}
									>
										<AlertTriangle className="h-10 w-10 text-red-500" />
									</motion.div>
								</div>
							</div>

							<div className="space-y-2">
								<h3 className="text-xl font-medium text-white">{title}</h3>
								<p className="text-sm text-red-300/80">{message}</p>
							</div>

							{showDetails && errorDetails && (
								<div className="w-full">
									<button
										onClick={() => setShowErrorDetails(!showErrorDetails)}
										className="text-xs text-red-400 hover:text-red-300 underline"
									>
										{showErrorDetails ? 'Hide' : 'Show'} Error Details
									</button>

									{showErrorDetails && (
										<div className="mt-2 p-2 bg-black/50 rounded-md text-left">
											<pre className="text-xs text-red-300/90 whitespace-pre-wrap break-all">
												{errorDetails}
											</pre>
										</div>
									)}
								</div>
							)}

							<button
								onClick={onClose}
								className="w-full px-4 py-2 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
							>
								Close
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
