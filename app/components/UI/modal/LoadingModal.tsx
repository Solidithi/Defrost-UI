'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingModalProps {
	isOpen: boolean
	message?: string
	subMessage?: string
}

export function LoadingModal({
	isOpen,
	message = 'Transaction in progress',
	subMessage = 'Please wait while we process your request',
}: LoadingModalProps) {
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
						<div className="flex flex-col items-center justify-center space-y-6 text-center">
							<div className="relative">
								{/* Outer glow effect */}
								<div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl" />

								{/* Spinner with cyan glow */}
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										duration: 2,
										repeat: Number.POSITIVE_INFINITY,
										ease: 'linear',
									}}
									className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 p-2"
								>
									<Loader2 className="h-10 w-10 text-cyan-400" />
								</motion.div>
							</div>

							<div className="space-y-2">
								<h3 className="text-xl font-medium text-white">{message}</h3>
								<p className="text-sm text-cyan-300/80">{subMessage}</p>
							</div>

							{/* Progress indicator */}
							<div className="w-full space-y-2">
								<div className="h-1 w-full overflow-hidden rounded-full bg-gray-800">
									<motion.div
										initial={{ x: '-100%' }}
										animate={{ x: '100%' }}
										transition={{
											repeat: Number.POSITIVE_INFINITY,
											duration: 1.5,
											ease: 'linear',
										}}
										className="h-full bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"
									/>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
