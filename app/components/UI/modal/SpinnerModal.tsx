'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Spinner from '../effect/Spinner'

interface SpinnerModalProps {
	isOpen: boolean
	message?: string
	backdropOpacity?: number
	size?: number
	color?: string
}

export function SpinnerModal({
	isOpen,
	message,
	backdropOpacity = 0.5,
	size = 10,
	color = 'border-blue-500',
}: SpinnerModalProps) {
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
						animate={{ opacity: backdropOpacity }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-black backdrop-blur-sm"
					/>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						className="relative z-50 flex flex-col items-center justify-center gap-4"
					>
						<Spinner heightWidth={size} className={color} />

						{message && (
							<motion.p
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="text-white font-medium text-center text-sm px-4 py-2 rounded-full bg-gray-900/70 backdrop-blur-sm border border-gray-700/30"
							>
								{message}
							</motion.p>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
