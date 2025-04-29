import Modal from '@/app/components/UI/modal/Modal'
import Button from '@/app/components/UI/button/Button'
import Spinner from '@/app/components/UI/effect/Spinner'
import { motion } from 'framer-motion'

/* ---------------------- UI component to display transacation status ---------------------- */
export const TransactionStatusModal = ({
	isOpen,
	onClose,
	isTransactionPending,
	isWaitingForIndexer,
	isLaunchpoolCreated,
	finalError,
	txHash,
}: {
	isOpen: boolean
	onClose: () => void
	isTransactionPending: boolean
	isWaitingForIndexer: boolean
	isLaunchpoolCreated: boolean
	finalError: string | null
	txHash: string | null
}) => {
	return (
		<Modal
			className="w-[600px] relative overflow-hidden backdrop-blur-lg rounded-xl bg-opacity-80 bg-gradient-to-r from-transparent via-blue-900/50 to-transparent border border-blue-800/40 shadow-2xl animate-pulse-slow shadow-[0_0_15px_rgba(30,64,175,0.5),0_0_40px_rgba(30,64,175,0.3)]"
			open={isOpen}
			onClose={onClose}
		>
			<div className="flex flex-col items-center p-8 text-white">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="w-full"
				>
					<h2 className="font-orbitron text-2xl text-center mb-6">
						Transaction Status
					</h2>

					<div className="glass-component-1 p-6 rounded-2xl bg-gradient-to-br from-blue-950/80 via-purple-950/70 to-indigo-950/80">
						{/* Transaction Pending State */}
						{isTransactionPending && (
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								className="flex flex-col items-center"
							>
								<div className="mb-4">
									<Spinner heightWidth={10} className="border-blue-500" />
								</div>
								<h3 className="text-xl text-blue-400 font-bold mb-2">
									Processing Transaction
								</h3>
								<p className="text-gray-300 text-center mb-3">
									Your launchpool creation transaction is being processed on the
									blockchain.
								</p>
								<p className="text-gray-400 text-sm text-center">
									Please keep this window open until the process completes.
								</p>
							</motion.div>
						)}

						{/* Indexer Waiting State */}
						{isWaitingForIndexer && (
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								className="flex flex-col items-center"
							>
								<div className="mb-4 relative">
									<h3 className="text-xl text-blue-400 font-bold mb-2">
										Syncing Data
									</h3>
								</div>
								<p className="text-gray-300 text-center mb-3">
									Transaction confirmed! Our indexer is now processing your
									launchpool data.
								</p>
								{txHash && (
									<div className="bg-gray-800 p-2 rounded-lg text-xs font-mono mb-3 overflow-hidden text-ellipsis w-full text-center">
										{txHash}
									</div>
								)}
								<p className="text-gray-400 text-sm text-center">
									This usually takes less than a minute to complete.
								</p>
							</motion.div>
						)}

						{/* Success State */}
						{isLaunchpoolCreated && (
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								className="flex flex-col items-center"
							>
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{
										type: 'spring',
										stiffness: 200,
										damping: 20,
									}}
									className="mb-4 bg-green-500 p-4 rounded-full"
								>
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="3"
											d="M5 13l4 4L19 7"
										></path>
									</svg>
								</motion.div>
								<h3 className="text-xl text-green-400 font-bold mb-2">
									Launchpool Created!
								</h3>
								<p className="text-gray-300 text-center mb-3">
									Your launchpool has been successfully created and is now live
									on the platform.
								</p>
								{txHash && (
									<div className="bg-gray-800 p-2 rounded-lg text-xs font-mono mb-3 overflow-hidden text-ellipsis w-full text-center">
										{txHash}
									</div>
								)}
								<Button
									onClick={onClose}
									className="mt-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
								>
									<span className="font-bold">View My Launchpools</span>
								</Button>
							</motion.div>
						)}

						{/* Error State */}
						{finalError && (
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								className="flex flex-col items-center"
							>
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{
										type: 'spring',
										stiffness: 200,
										damping: 20,
									}}
									className="mb-4 bg-red-500 p-4 rounded-full"
								>
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								</motion.div>
								<h3 className="text-xl text-red-400 font-bold mb-2">
									Transaction Failed
								</h3>
								<p className="text-red-300 text-center mb-3">{finalError}</p>
								<Button
									onClick={onClose}
									className="mt-4 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600"
								>
									<span className="font-bold">Try Again</span>
								</Button>
							</motion.div>
						)}

						{/* Transaction Progress Bar */}
						{(isTransactionPending || isWaitingForIndexer) && (
							<div className="mt-8 w-full">
								<div className="relative pt-1">
									<div className="flex mb-2 items-center justify-between">
										<div>
											<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-blue-500">
												{isTransactionPending ? 'Step 1 of 2' : 'Step 2 of 2'}
											</span>
										</div>
										<div className="text-right">
											<span className="text-xs font-semibold inline-block text-white">
												{isTransactionPending ? '50%' : '90%'}
											</span>
										</div>
									</div>
									<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
										<motion.div
											initial={{ width: isTransactionPending ? '0%' : '50%' }}
											animate={{ width: isTransactionPending ? '50%' : '90%' }}
											transition={{ duration: 0.5 }}
											className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500"
										></motion.div>
									</div>
								</div>
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</Modal>
	)
}
