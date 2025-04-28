'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AccessLockedModalProps {
	/**
	 * Whether to show the wallet requirement modal
	 */
	isOpen: boolean

	/**
	 * Title of the modal
	 * @default "Wallet Connection Required"
	 */
	title?: string

	/**
	 * Description text explaining why wallet connection is needed
	 * @default "Please connect your wallet using the wallet button in the navigation bar. This allows us to verify your wallet and handle token transactions."
	 */
	description?: string | ReactNode

	/**
	 * Custom icon component to display
	 * If not provided, a default lock icon will be used
	 */
	icon?: ReactNode

	/**
	 * Z-index for the modal overlay
	 * @default 50
	 */
	zIndex?: number

	/**
	 * Additional CSS classes to apply to the modal container
	 */
	className?: string
}

/**
 * A reusable modal component that indicates wallet connection is required
 * to access certain features of the application.
 */
export function AccessLockedModal({
	isOpen: isShowing,
	title = 'Wallet Connection Required',
	description = 'Please connect your wallet using the wallet button in the navigation bar. This allows us to verify your wallet and handle token transactions.',
	icon,
	zIndex = 50,
	className = '',
}: AccessLockedModalProps) {
	if (!isShowing) return null

	return (
		<div
			className={`absolute inset-0 backdrop-blur-sm flex items-center justify-center`}
			style={{ zIndex }}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className={`glass-component-3 max-w-lg p-8 rounded-2xl shadow-2xl border border-gray-700/50 ${className}`}
			>
				<div className="flex flex-col items-center text-center">
					<div className="mb-4 p-4 rounded-full bg-gray-800/80">
						{icon || (
							<svg
								className="w-12 h-12 text-cyan-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						)}
					</div>
					<h2 className="text-2xl font-orbitron text-white mb-3">{title}</h2>
					<div className="text-gray-300">{description}</div>
				</div>
			</motion.div>
		</div>
	)
}
