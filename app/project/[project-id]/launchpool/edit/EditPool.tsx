'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import { red } from 'tailwindcss/colors'
import { Edit2, Link } from 'lucide-react'

// Components
import AnimatedBlobs from '@/app/components/UI/background/AnimatedBlobs'
import Button from '@/app/components/UI/button/Button'
import SplitText from '@/app/components/UI/effect/SplitText'
import Stepper, { Step } from '@/app/components/UI/project-progress/Stepper'
import SteplineChart from '@/app/components/charts/SteplineChart'
import Modal from '@/app/components/UI/modal/Modal'
import { TransactionStatusModal } from '@/app/components/UI/shared/TransactionStatusModal'
import { AccessLockedModal } from '@/app/components/UI/shared/AccessLockedModal'

// Store
import { usePoolStore } from '@/app/store/launchpool'
import { useProjectStore } from '@/app/store/project'

const EditPool = () => {
	const {
		tokenAddress,
		setTokenAddress,
		pool,
		poolData,
		addPool,
		removePool,
		updatePoolItem,
		addPhase,
		removePhase,
		updatePhase,
		isConfirming,
		setIsConfirming,
		isOpenEmissionRate,
		setIsOpenEmissionRate,
	} = usePoolStore()

	// Current selected pool for emission rate modal
	const [selectedPoolId, setSelectedPoolId] = useState(null)

	/* ---------------------- Editable State ---------------------- */
	const [editableFields, setEditableFields] = useState<Record<string, boolean>>(
		{}
	)
	const toggleEditable = (fieldKey: string) => {
		setEditableFields((prev) => ({
			...prev,
			[fieldKey]: !prev[fieldKey],
		}))
	}

	/* ---------------------- Add pool ---------------------- */
	const handleAddPool = () => {
		addPool()
		console.log('After addPool - poolData:', poolData)
	}

	/* ---------------------- Add phase ---------------------- */
	const handleAddPhase = (poolId: number) => {
		if (!poolId) return

		// Get current phases for this pool
		const currentPhases = poolData[poolId]?.phases || []
		if (currentPhases.length >= 3) {
			toast.warning('You can add only 3 phases.', {
				style: { backgroundColor: red[500], color: 'white' },
			})
			return
		}

		addPhase(poolId)
		console.log('After addPhase - poolData:', poolData)
	}

	/* ---------------------- Handle delete pool/phase ---------------------- */
	const handleConfirmRemove = () => {
		if (isConfirming.id !== null) {
			if (isConfirming.type === 'pool') {
				removePool(isConfirming.id)
			} else if (isConfirming.type === 'phase') {
				if (selectedPoolId) {
					removePhase(selectedPoolId, isConfirming.id)
				}
			}
		}
		setIsConfirming({ open: false, id: null, type: null })
	}

	/* ---------------------- Validate Pool Dates ---------------------- */
	const validatePoolDates = (poolId: number, field: string, value: string) => {
		const now = new Date()
		const fromDate =
			field === 'from'
				? new Date(value)
				: new Date(poolData[poolId]?.from || '')
		const toDate =
			field === 'to' ? new Date(value) : new Date(poolData[poolId]?.to || '')

		if (fromDate < now) {
			toast.error('Start date cannot be in the past.')
			return false
		}

		if (toDate <= fromDate) {
			toast.error('End date must be after the start date.')
			return false
		}

		return true
	}

	/* ---------------------- Validate Phase Dates ---------------------- */
	const validatePhaseDates = (
		poolId: number,
		phaseId: number,
		field: string,
		value: string
	) => {
		const now = new Date()
		const phases = poolData[poolId]?.phases || []
		const phaseIndex = phases.findIndex((p) => p.id === phaseId)

		if (phaseIndex === -1) return false

		const fromDate =
			field === 'from'
				? new Date(value)
				: new Date(phases[phaseIndex]?.from || '')

		const toDate =
			field === 'to' ? new Date(value) : new Date(phases[phaseIndex]?.to || '')

		// Convert pool's `from` date to a Date object for comparison
		const poolFromDate = new Date(poolData[poolId]?.from || '')

		// Check if the first phase's `from` matches the pool's `from`
		if (
			phaseIndex === 0 &&
			field === 'from' &&
			fromDate.getTime() !== poolFromDate.getTime()
		) {
			toast.error('The first phase must start at the same time as the pool.')
			return false
		}

		// Ensure no past dates
		if (fromDate < now) {
			toast.error('Start date cannot be in the past.')
			return false
		}

		// Ensure `to` is after `from`
		if (toDate <= fromDate) {
			toast.error('End date must be after the start date.')
			return false
		}

		// Ensure dates are contiguous
		if (phaseIndex > 0) {
			const prevPhaseTo = new Date(phases[phaseIndex - 1]?.to || '')
			if (field === 'from' && fromDate.getTime() !== prevPhaseTo.getTime()) {
				toast.error(
					'Phase start date must be contiguous with the previous phase.'
				)
				return false
			}
		}

		return true
	}

	/* ---------------------- Handle Change Pool ---------------------- */
	const handleChangePool = (poolId: number, field: string, value: string) => {
		if (field === 'from' || field === 'to') {
			if (!validatePoolDates(poolId, field, value)) return
		}
		updatePoolItem(poolId, { [field]: value })
	}

	/* ---------------------- Handle Change EmissionRate ---------------------- */
	const handleChangeEmissionRate = (
		poolId: number,
		phaseId: number,
		field: string,
		value: string
	) => {
		if (field === 'from' || field === 'to') {
			if (!validatePhaseDates(poolId, phaseId, field, value)) return
		}
		updatePhase(poolId, phaseId, { [field]: value })
	}

	/* ---------------------- Open and Close Confirm Modal ---------------------- */
	const handleOpenConfirmModal = (id: number, type: 'pool' | 'phase') => {
		setIsConfirming({ open: true, id, type })
	}

	const handleCloseConfirmModal = () => {
		setIsConfirming({ open: false, id: null, type: null })
	}

	/* ---------------------- Open and Close EmissionRate Modal ---------------------- */
	const handleOpenEmissionRateModal = (poolId: any) => {
		setSelectedPoolId(poolId)
		setIsOpenEmissionRate(true)
	}

	const handleCloseEmissionRateModal = () => {
		setIsOpenEmissionRate(false)
		setSelectedPoolId(null)
	}

	/* ---------------------- Format DateTime for Input ---------------------- */
	const formatDateTimeLocal = (dateString: string) => {
		if (!dateString) return ''
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${year}-${month}-${day}T${hours}:${minutes}`
	}

	return (
		<div className="relative page-container ">
			<AnimatedBlobs count={4} />
			<div className=" text-center z-20">
				<SplitText
					text="Unleash Your Web3-Native Launchpool"
					className="title-text"
					delay={50}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div className="mt-[30px] text-center max-w-5xl mx-auto z-20">
				<SplitText
					text="Provide the key details—goals, timeline, and requirements—to bring your Web3-native launchpool to life for stakeholders. This form collects everything needed to showcase your pool with impact on our platform."
					className="content-text text-gray-300"
					delay={10}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>

			{/* -------------------------------------------Form------------------------------------------------ */}
			<div
				className={`mt-14 w-[1200px] h-auto glass-component-3 rounded-2xl p-8 transition-all duration-300 z-20`}
			>
				<Stepper
					className="w-full"
					initialStep={1}
					backButtonText="Previous"
					nextButtonText="Next"
				>
					{/* --------------------------------------Token Input And Token Validation----------------------------------------------------- */}
					<Step>
						<div className="flex flex-col items-center justify-center w-full gap-5">
							<span className="text-3xl font-orbitron text-white mb-4 flex justify-center w-full">
								Token address
							</span>
							<div className="relative w-full">
								<input
									id="projectName"
									value={tokenAddress}
									onChange={(e) => setTokenAddress(e.target.value)}
									placeholder="Enter your token address"
									className={`p-4 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full`}
								/>
							</div>
						</div>
					</Step>

					{/* --------------------------------------Create pool form----------------------------------------------------- */}
					<Step>
						<div className="glass-component-3 w-full h--full p-10 rounded-xl text-white flex flex-col gap-5">
							<span className="text-xl font-orbitron flex justify-start w-full">
								Select staking token
							</span>
							<Button
								onClick={handleAddPool}
								className="h-16 w-16 rounded-full glass-component-3 flex items-center justify-center "
							>
								<svg
									width="36"
									height="36"
									viewBox="0 0 46 46"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M23 3V43"
										stroke="white"
										strokeWidth="5"
										strokeLinecap="round"
									/>
									<path
										d="M3 23L43 23"
										stroke="white"
										strokeWidth="5"
										strokeLinecap="round"
									/>
								</svg>
							</Button>
							<div className="flex flex-wrap gap-3 w-full">
								{pool.map((poolId) => (
									<motion.div
										key={poolId}
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="glass-component-3 h-auto p-4 pt-10 rounded-xl flex items-center justify-center flex-col gap-5"
										style={{ width: 'calc(50% - 0.375rem)' }}
									>
										<Button
											onClick={() => handleOpenConfirmModal(poolId, 'pool')}
											className="absolute top-5 right-5 glass-component-3 px-3 py-1"
										>
											X
										</Button>
										<div className="w-full flex items-center justify-between p-2 gap-3">
											{/* Chain indicator */}
											<div className="w-1/2 flex flex-col gap-3 relative">
												<span className="font-orbitron text-lg">Chain</span>
												<div className="relative group">
													<select
														value={poolData[poolId]?.chain || ''}
														onChange={(e) =>
															handleChangePool(poolId, 'chain', e.target.value)
														}
														className="p-3 pr-10 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none cursor-pointer"
													>
														<option value="" disabled>
															Select chain
														</option>
														<option value="Ethereum">Ethereum</option>
														<option value="Polkadot">Polkadot</option>
														<option value="BSC">BSC</option>
													</select>
													{/* Custom dropdown arrow */}
													<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-transform duration-300 group-hover:translate-y-0.5">
														<svg
															className="w-5 h-5 text-white opacity-80"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 9l-7 7-7-7"
															/>
														</svg>
													</div>
												</div>
											</div>
											<div className="w-1/2 flex flex-col gap-3 relative">
												<span className="font-orbitron text-lg">Token</span>
												<div className="relative group">
													<select
														value={poolData[poolId]?.token || ''}
														onChange={(e) =>
															handleChangePool(poolId, 'token', e.target.value)
														}
														className="p-3 pr-10 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none cursor-pointer"
													>
														<option value="" disabled>
															Select your token
														</option>
														<option value="vDOT">vDOT</option>
														<option value="vGLMR">vGLMR</option>
													</select>
													{/* Custom dropdown arrow */}
													<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-transform duration-300 group-hover:translate-y-0.5">
														<svg
															className="w-5 h-5 text-white opacity-80"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 9l-7 7-7-7"
															/>
														</svg>
													</div>
												</div>
											</div>
										</div>
										<div className="w-full flex flex-col p-2 gap-3">
											<span className="font-orbitron text-lg">
												Project token supply
											</span>
											<div className="relative flex gap-5">
												<input
													type="number"
													value={poolData[poolId]?.tokenSupply || ''}
													onChange={(e) => {
														const value = e.target.value
														if (/^\d*$/.test(value)) {
															handleChangePool(poolId, 'tokenSupply', value)
														}
													}}
													onKeyDown={(e) => {
														const invalidChars = ['e', 'E', '+', '-', '.', ',']
														if (
															invalidChars.includes(e.key) ||
															(e.key.length === 1 && isNaN(Number(e.key)))
														) {
															e.preventDefault()
														}
													}}
													placeholder="Enter project token supply"
													className={`p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
                                        [&::-webkit-inner-spin-button]:appearance-none 
                                        [&::-webkit-outer-spin-button]:appearance-none`}
													disabled={!editableFields[`tokenSupply-${poolId}`]}
												/>
												<Edit2
													size={18}
													className="absolute right-28 top-5 transform -translate-y-[53px] text-cyan-400 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
													onClick={() =>
														toggleEditable(`tokenSupply-${poolId}`)
													}
												/>
												<Button className="glass-component-3 rounded-xl">
													Check
												</Button>
											</div>
										</div>
										<div className="relative w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron text-lg">
												Max stake per investor
											</span>
											<input
												type="number"
												value={poolData[poolId]?.maxStake || ''}
												onChange={(e) => {
													const value = e.target.value
													if (/^\d*$/.test(value)) {
														handleChangePool(poolId, 'maxStake', value)
													}
												}}
												onKeyDown={(e) => {
													const invalidChars = ['e', 'E', '+', '-', '.', ',']
													if (
														invalidChars.includes(e.key) ||
														(e.key.length === 1 && isNaN(Number(e.key)))
													) {
														e.preventDefault()
													}
												}}
												placeholder="Enter max stake"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
                                      [&::-webkit-inner-spin-button]:appearance-none 
                                      [&::-webkit-outer-spin-button]:appearance-none"
												disabled={!editableFields[`maxStake-${poolId}`]}
											/>
											<Edit2
												size={18}
												className="absolute right-4 top-5 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
												onClick={() => toggleEditable(`maxStake-${poolId}`)}
											/>
										</div>
										<div className="relative w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron text-lg">From</span>
											<input
												type="datetime-local"
												value={
													formatDateTimeLocal(poolData[poolId]?.from) || ''
												}
												onChange={(e) =>
													handleChangePool(poolId, 'from', e.target.value)
												}
												placeholder="Enter start date"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm"
												disabled={!editableFields[`from-${poolId}`]}
											/>
											<Edit2
												size={18}
												className="absolute right-4 top-5 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
												onClick={() => toggleEditable(`from-${poolId}`)}
											/>
										</div>
										<div className="relative w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron text-lg">To</span>
											<input
												type="datetime-local"
												value={formatDateTimeLocal(poolData[poolId]?.to) || ''}
												onChange={(e) =>
													handleChangePool(poolId, 'to', e.target.value)
												}
												placeholder="Enter end date"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm"
												disabled={!editableFields[`to-${poolId}`]}
											/>
											<Edit2
												size={18}
												className="absolute right-4 top-5 transform -translate-y-1/2 text-cyan-400 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
												onClick={() => toggleEditable(`to-${poolId}`)}
											/>
										</div>
										<div className=" w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron flex text-lg  items-center gap-2">
												<span>Emission Rate</span>
												<div className="relative group cursor-pointer">
													<svg
														width="20"
														height="20"
														viewBox="0 0 27 27"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M13.5 18V13.5M13.5 9H13.5113M24.75 13.5C24.75 19.7132 19.7132 24.75 13.5 24.75C7.2868 24.75 2.25 19.7132 2.25 13.5C2.25 7.2868 7.2868 2.25 13.5 2.25C19.7132 2.25 24.75 7.2868 24.75 13.5Z"
															stroke="#F3F3F3"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
													<div className="absolute w-64 -left-[127px] top-1/2 -translate-y-28 ml-2 bg-white text-black text-xs px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 font-comfortaa pointer-events-none">
														Lorem Ipsum is simply dummy text of the printing and
														typesetting industry. Lorem Ipsum has been the
														industry standard dummy text ever since the 1500s.
													</div>
												</div>
											</span>
											<Button
												onClick={() => handleOpenEmissionRateModal(poolId)}
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm flex justify-center items-center"
											>
												<svg
													width="29"
													height="28"
													viewBox="0 0 47 46"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M43.3516 2.83008H17.4766C16.7148 2.83232 15.9848 3.13593 15.4461 3.67462C14.9074 4.2133 14.6038 4.94327 14.6016 5.70508V25.8301C14.6038 26.5919 14.9074 27.3219 15.4461 27.8605C15.9848 28.3992 16.7148 28.7028 17.4766 28.7051H43.3516C44.1134 28.7028 44.8433 28.3992 45.382 27.8605C45.9207 27.3219 46.2243 26.5919 46.2266 25.8301V5.70508C46.2243 4.94327 45.9207 4.2133 45.382 3.67462C44.8433 3.13593 44.1134 2.83232 43.3516 2.83008ZM43.3516 25.8301H17.4766V5.70508H43.3516V25.8301Z"
														fill="white"
													/>
													<path
														d="M28.7969 34.7734H8.67188V20.3984H11.5469V17.5234H8.67188C7.91007 17.5257 7.1801 17.8293 6.64141 18.368C6.10273 18.9067 5.79911 19.6366 5.79688 20.3984V34.7734C5.79911 35.5352 6.10273 36.2652 6.64141 36.8039C7.1801 37.3426 7.91007 37.6462 8.67188 37.6484H28.7969C29.5587 37.6462 30.2887 37.3426 30.8273 36.8039C31.366 36.2652 31.6696 35.5352 31.6719 34.7734V31.8984H28.7969V34.7734Z"
														fill="white"
													/>
												</svg>
											</Button>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</Step>

					{/* --------------------------------------Launch Your Pool----------------------------------------------------- */}
					<Step>
						<div className="flex flex-col items-center justify-center w-full gap-8">
							<span className="text-3xl font-orbitron text-white mb-4">
								Launch Your Pool
							</span>
							<div className="glass-component-3 p-8 rounded-2xl w-3/4">
								<p className="text-gray-200 text-center mb-8">
									You&apos;re about to create a new launchpool on the
									blockchain. This action is irreversible and will require a
									transaction signature with your connected wallet.
								</p>
								<div className="mb-8 flex flex-col gap-4">
									<h4 className="text-white font-orbitron text-xl">
										Transaction Summary
									</h4>
									<div className="glass-component-2 p-4 rounded-xl">
										<div className="flex justify-between text-gray-300 mb-2">
											<span>Token Address:</span>
											<span className="font-mono text-blue-400">
												{tokenAddress.substring(0, 12)}...
												{tokenAddress.substring(tokenAddress.length - 6)}
											</span>
										</div>
										<div className="flex justify-between text-gray-300 mb-2">
											<span>Pools Created:</span>
											<span>{pool.length}</span>
										</div>
										<div className="flex justify-between text-gray-300 mb-2">
											<span>Emission Phases:</span>
											<span>
												{Object.values(poolData).reduce(
													(total, pool) => total + (pool.phases?.length || 0),
													0
												)}
											</span>
										</div>
									</div>
								</div>
								{(() => {
									return (
										<>
											<div className="w-full"></div>
										</>
									)
								})()}
							</div>
						</div>
					</Step>
				</Stepper>
			</div>

			{/* --------------------------------------Emission Rate Modal----------------------------------------------------- */}

			<Modal
				className="w-full max-w-[1200px] sm:max-w-[1000px] px-4 sm:px-6 mx-5"
				open={isOpenEmissionRate}
				onClose={handleCloseEmissionRateModal}
			>
				<div className="h-full w-full p-3 sm:p-5 text-white overflow-y-auto max-h-[80vh]">
					<div>
						{selectedPoolId && <SteplineChart poolId={selectedPoolId} />}
					</div>
					<div className="flex flex-col gap-3 sm:gap-5 mt-3 sm:mt-5">
						<Button
							onClick={() => selectedPoolId && handleAddPhase(selectedPoolId)}
							className="h-12 w-12 sm:h-16 sm:w-16 rounded-full glass-component-3 flex items-center justify-center mx-auto sm:mx-0"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 46 46"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="sm:w-9 sm:h-9"
							>
								<path
									d="M23 3V43"
									stroke="white"
									strokeWidth="5"
									strokeLinecap="round"
								/>
								<path
									d="M3 23L43 23"
									stroke="white"
									strokeWidth="5"
									strokeLinecap="round"
								/>
							</svg>
						</Button>
						<div className="flex flex-wrap gap-2 sm:gap-3 w-full">
							{selectedPoolId && poolData[selectedPoolId]?.phases ? (
								poolData[selectedPoolId].phases.map((phase, index) => (
									<motion.div
										key={phase.id}
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="glass-component-3 h-auto p-3 sm:p-4 pt-8 sm:pt-10 rounded-xl flex items-center justify-center flex-col gap-2 relative w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)]"
									>
										<Button
											onClick={() => handleOpenConfirmModal(phase.id, 'phase')}
											className="absolute top-2 sm:top-5 right-2 sm:right-5 glass-component-3 px-2 sm:px-3 py-1 text-sm sm:text-base"
										>
											X
										</Button>
										<div className="w-full flex flex-col gap-2 sm:gap-3 p-1 sm:p-2">
											<span className="font-orbitron text-base sm:text-lg">
												Emission Rate
											</span>
											<div className="relative w-full">
												<input
													type="number"
													value={phase.emissionRate || ''}
													onChange={(e) =>
														handleChangeEmissionRate(
															selectedPoolId,
															phase.id,
															'emissionRate',
															e.target.value
														)
													}
													placeholder="Enter emission rate"
													className="p-2 sm:p-3   rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
												/>
												{/* <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-xs sm:text-sm">
													%
												</span> */}
											</div>
										</div>
										<div className="w-full flex flex-col gap-2 sm:gap-3 p-1 sm:p-2">
											<span className="font-orbitron text-base sm:text-lg">
												From
											</span>
											<input
												type="datetime-local"
												value={formatDateTimeLocal(phase.from) || ''}
												onChange={(e) =>
													handleChangeEmissionRate(
														selectedPoolId,
														phase.id,
														'from',
														e.target.value
													)
												}
												placeholder="Enter start date"
												className="p-2 sm:p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
											/>
										</div>
										<div className="w-full flex flex-col gap-2 sm:gap-3 p-1 sm:p-2">
											<span className="font-orbitron text-base sm:text-lg">
												To
											</span>
											<input
												type="datetime-local"
												value={formatDateTimeLocal(phase.to) || ''}
												onChange={(e) =>
													handleChangeEmissionRate(
														selectedPoolId,
														phase.id,
														'to',
														e.target.value
													)
												}
												placeholder="Enter end date"
												className="p-2 sm:p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
											/>
										</div>
									</motion.div>
								))
							) : (
								<div className="w-full text-center py-6">
									<p className="font-comfortaa text-white opacity-70">
										No phases created yet. Click the plus button to add a phase.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</Modal>

			{/* --------------------------------------Confirm Modal----------------------------------------------------- */}

			<Modal
				className=""
				open={isConfirming.open}
				onClose={handleCloseConfirmModal}
			>
				<h3 className="text-lg font-semibold text-white">
					Do you want to delete this{' '}
					{isConfirming.type === 'pool' ? 'pool' : 'phase'}?
				</h3>
				<div className="flex justify-between mt-4">
					<Button
						onClick={handleCloseConfirmModal}
						className="bg-gray-500 text-white px-4 py-2 rounded-full"
					>
						No
					</Button>
					<Button
						onClick={handleConfirmRemove}
						className="warm-cool-bg text-white px-4 py-2 rounded-full"
					>
						Yes
					</Button>
				</div>
			</Modal>

			{/* --------------------------------------Toast----------------------------------------------------- */}
			<ToastContainer
				position="top-right"
				autoClose={4000}
				hideProgressBar={true}
			/>
		</div>
	)
}

export default EditPool
