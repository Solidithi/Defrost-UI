'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'

interface WarningModalProps {
	isOpen: boolean
	title?: string
	message: string
	onClose: () => void
	onConfirm?: () => void
	confirmText?: string
	showCancel?: boolean
}

export function WarningModal({
	isOpen,
	title = 'Warning',
	message,
	onClose,
	onConfirm,
	confirmText = 'Proceed',
	showCancel = true,
}: WarningModalProps) {
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
						onClick={onClose}
					/>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className="relative z-50 w-full max-w-md rounded-xl bg-gradient-to-b from-amber-900/40 to-black/95 p-6 shadow-2xl border border-amber-500/20"
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
								<div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl" />

								{/* Warning icon with amber glow */}
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
										<AlertCircle className="h-10 w-10 text-amber-500" />
									</motion.div>
								</div>
							</div>

							<div className="space-y-2">
								<h3 className="text-xl font-medium text-white">{title}</h3>
								<p className="text-sm text-amber-300/80">{message}</p>
							</div>

							<div className="w-full flex flex-col sm:flex-row gap-3">
								{showCancel && (
									<button
										onClick={onClose}
										className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
									>
										Cancel
									</button>
								)}

								{onConfirm && (
									<button
										onClick={() => {
											onConfirm()
											onClose()
										}}
										className="w-full px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
									>
										{confirmText}
									</button>
								)}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
