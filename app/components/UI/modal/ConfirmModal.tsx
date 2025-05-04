'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Check, X } from 'lucide-react'

interface ConfirmModalProps {
	isOpen: boolean
	title: string
	description: string
	onConfirm: () => void
	onCancel: () => void
	confirmText?: string
	cancelText?: string
	type?: 'warning' | 'info' | 'success'
}

export function ConfirmModal({
	isOpen,
	title,
	description,
	onConfirm,
	onCancel,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	type = 'warning',
}: ConfirmModalProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	if (!mounted) return null

	const getIconColor = () => {
		switch (type) {
			case 'warning':
				return 'text-amber-500'
			case 'success':
				return 'text-emerald-500'
			default:
				return 'text-cyan-500'
		}
	}

	const getIcon = () => {
		switch (type) {
			case 'warning':
				return <AlertTriangle className={`h-8 w-8 ${getIconColor()}`} />
			case 'success':
				return <Check className={`h-8 w-8 ${getIconColor()}`} />
			default:
				return <AlertTriangle className={`h-8 w-8 ${getIconColor()}`} />
		}
	}

	const getButtonColor = () => {
		switch (type) {
			case 'warning':
				return 'bg-amber-500 hover:bg-amber-600'
			case 'success':
				return 'bg-emerald-500 hover:bg-emerald-600'
			default:
				return 'bg-cyan-500 hover:bg-cyan-600'
		}
	}

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
						onClick={onCancel}
					/>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className="relative z-50 w-full max-w-md rounded-xl bg-gradient-to-b from-gray-900/90 to-black/95 p-6 shadow-2xl border border-cyan-500/20"
					>
						<div className="absolute -top-12 left-1/2 -translate-x-1/2">
							<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 border border-gray-800 shadow-xl">
								<div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md" />
								<div className="relative">{getIcon()}</div>
							</div>
						</div>

						<div className="mt-6 text-center">
							<h3 className="text-xl font-medium text-white">{title}</h3>
							<p className="mt-2 text-sm text-gray-400">{description}</p>
						</div>

						<div className="mt-6 flex space-x-3">
							<button
								onClick={onCancel}
								className="flex-1 rounded-lg border border-gray-700 bg-gray-800/50 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
							>
								{cancelText}
							</button>
							<button
								onClick={onConfirm}
								className={`flex-1 rounded-lg py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${getButtonColor()}`}
							>
								{confirmText}
							</button>
						</div>

						<button
							onClick={onCancel}
							className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
						>
							<X className="h-4 w-4" />
						</button>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
