'use client'
import React, { useState } from 'react'
import SplitText from '../components/UI/SplitText'
import Stepper, { Step } from '../components/UI/Stepper'
import Button from '../components/UI/Button'
import { motion } from 'framer-motion'
import Modal from '../components/UI/Modal'
import SteplineChart from '../components/UI/SteplineChart'
import { toast, ToastContainer } from 'react-toastify'
import { red } from 'tailwindcss/colors'
import AnimatedBlobs from '../components/UI/Background/AnimatedBlobs'
interface FormDataType {
	chain: string
	token: string
	tokenSupply: string
	maxStake: string
	from: string
	to: string
	emissionRate: string
}

interface PhaseDataType {
	emissionRate: string
	from: string
	to: string
}

const CreatePool = () => {
	const [tokenAddress, setTokenAddress] = useState('')

	const [forms, setForms] = useState<number[]>([])
	const [formsData, setFormsData] = useState<FormDataType[]>(
		forms.map(() => ({
			chain: '',
			token: '',
			tokenSupply: '',
			maxStake: '',
			from: '',
			to: '',
			emissionRate: '',
		}))
	)
	const [isConfirming, setIsConfirming] = useState<{
		open: boolean
		id: number | null
	}>({
		open: false,
		id: null,
	})
	const [isOpenEmissionRate, setIsOpenEmissionRate] = useState(false)
	const [phase, setPhase] = useState<number[]>([])
	const [phaseData, setPhaseData] = useState<PhaseDataType[]>(
		phase.map(() => ({
			emissionRate: '',
			from: '',
			to: '',
		}))
	)

	/* --------------------------------------Handle Add Form----------------------------------------------------- */

	const addForm = () => {
		setForms((prevForms) => {
			const newForms = [...prevForms, Date.now()]
			setFormsData((prevData) => [
				...prevData,
				{
					chain: '',
					token: '',
					tokenSupply: '',
					maxStake: '',
					from: '',
					to: '',
					emissionRate: '',
				},
			])
			return newForms
		})
	}

	/* --------------------------------------Handle Close Modal----------------------------------------------------- */
	const handleOpenConfirmModal = (id: number) => {
		setIsConfirming({ open: true, id })
	}

	const handleCloseConfirmModal = () => {
		setIsConfirming({ open: false, id: null })
	}

	const handleConfirmRemoveForm = () => {
		if (isConfirming.id !== null) {
			setForms((prev) => prev.filter((id) => id !== isConfirming.id))
		}
		handleCloseConfirmModal()
	}

	/* -----------------------------------------Handle Open and Close Emission Rate Pop Up-------------------------------------------------- */

	const handleOpenEmissionRateModal = () => {
		setIsOpenEmissionRate(true)
	}

	const handleCloseEmissionRateModal = () => {
		setIsOpenEmissionRate(false)
	}

	const addPhase = () => {
		if (phase.length >= 3) {
			toast.warning('You must add only 3 phases.', {
				style: { backgroundColor: red[500], color: 'white' },
				icon: undefined,
			})
			return
		}

		setPhase((prevPhase) => {
			const newPhase = [...prevPhase, Date.now()]
			setPhaseData((prevData) => [
				...prevData,
				{ emissionRate: '', from: '', to: '' },
			])
			return newPhase
		})
	}

	const handleConfirmRemovePhase = () => {
		if (isConfirming.id !== null) {
			setPhase((prev) => prev.filter((id) => id !== isConfirming.id))
		}
		handleCloseConfirmModal()
	}

	/* ------------------------------------------------------------------------------------------- */

	const handleChange = (
		index: number,
		field: keyof FormDataType,
		value: string
	) => {
		setFormsData((prev) => {
			if (!prev[index]) return prev
			const updated = [...prev]
			updated[index] = { ...updated[index], [field]: value }
			return updated
		})
	}

	const handleChangeEmissionRate = (
		index: number,
		field: keyof PhaseDataType,
		value: string
	) => {
		setPhaseData((prev) => {
			if (!prev[index]) return prev
			const updated = [...prev]
			updated[index] = { ...updated[index], [field]: value }
			return updated
		})
	}

	return (
		<div className="relative page-container overflow-hidden">
			<AnimatedBlobs count={4} />
			{/* --------------------------------------Title & Subtitle----------------------------------------------------- */}
			<div className=" text-center">
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
			<div className="mt-[30px] text-center max-w-5xl mx-auto">
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
				className={`mt-14 w-[1200px] h-auto glass-component-3 rounded-2xl p-8 transition-all duration-300`}
			>
				<Stepper
					className="w-full"
					initialStep={1}
					// onFinalStepCompleted={() => console.log('All steps completed!')}
					backButtonText="Previous"
					nextButtonText="Next"
				>
					{/* --------------------------------------Token Address----------------------------------------------------- */}
					<Step>
						<div className="flex flex-col items-center justify-center w-full gap-5">
							<span className="text-3xl font-orbitron text-white mb-4 flex justify-center w-full">
								Token address
							</span>
							<input
								id="projectName"
								value={tokenAddress}
								onChange={(e) => setTokenAddress(e.target.value)}
								placeholder="Enter your token address"
								className="p-4 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full"
							/>
						</div>
					</Step>

					{/* --------------------------------------Create pool form----------------------------------------------------- */}

					<Step>
						<div className="glass-component-3 w-full h--full p-10 rounded-xl text-white flex flex-col gap-5">
							<span className="text-xl font-orbitron  flex justify-start w-full">
								Select staking token
							</span>
							<Button
								onClick={addForm}
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
										stroke-width="5"
										stroke-linecap="round"
									/>
									<path
										d="M3 23L43 23"
										stroke="white"
										stroke-width="5"
										stroke-linecap="round"
									/>
								</svg>
							</Button>

							<div className="flex flex-wrap gap-3 w-full">
								{forms.map((formId, index) => (
									<motion.div
										key={formId}
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.2, duration: 0.5 }}
										className="glass-component-3 h-auto p-4 pt-10 rounded-xl flex items-center justify-center flex-col gap-5"
										style={{ width: 'calc(50% - 0.375rem)' }}
									>
										<Button
											onClick={() => handleOpenConfirmModal(formId)}
											className="absolute top-5 right-5 glass-component-3 px-3 py-1"
										>
											X
										</Button>

										<div className="w-full flex items-center justify-between p-2 gap-3">
											<div className="w-1/2 flex flex-col gap-3 relative">
												<span className="font-orbitron text-lg">Chain</span>
												<div className="relative group">
													<select
														value={formsData[index]?.chain || ''}
														onChange={(e) =>
															handleChange(index, 'chain', e.target.value)
														}
														className="p-3 pr-10 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none cursor-pointer"
													>
														<option value="" disabled>
															Select your chain
														</option>
														<option value="Moonbeam">Moonbeam</option>
														<option value="Moonriver">Moonriver</option>
													</select>
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
														value={formsData[index]?.token || ''}
														onChange={(e) =>
															handleChange(index, 'token', e.target.value)
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
											<div className="flex gap-5">
												<input
													type="number"
													value={formsData[index]?.tokenSupply || ''}
													onChange={(e) => {
														const value = e.target.value
														if (/^\d*$/.test(value)) {
															handleChange(index, 'tokenSupply', value)
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
													className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    																[&::-webkit-inner-spin-button]:appearance-none 
    																[&::-webkit-outer-spin-button]:appearance-none"
												/>

												<Button className="glass-component-3 rounded-xl">
													Check
												</Button>
											</div>
										</div>

										<div className="w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron text-lg">
												Max stake per investor
											</span>
											<input
												type="number"
												value={formsData[index]?.maxStake || ''}
												onChange={(e) => {
													const value = e.target.value
													if (/^\d*$/.test(value)) {
														handleChange(index, 'maxStake', value)
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
											/>
										</div>

										<div className="w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron text-lg">From</span>
											<input
												type="datetime-local"
												value={formsData[index]?.from || ''}
												onChange={(e) =>
													handleChange(index, 'from', e.target.value)
												}
												placeholder="Enter start date"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm"
											/>
										</div>

										<div className="w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron text-lg">To</span>
											<input
												type="datetime-local"
												value={formsData[index]?.to || ''}
												onChange={(e) =>
													handleChange(index, 'to', e.target.value)
												}
												placeholder="Enter end date"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm"
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
												onClick={() => handleOpenEmissionRateModal()}
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

					<Step>vdfb</Step>
				</Stepper>
			</div>

			{/* --------------------------------------Emission Rate Modal----------------------------------------------------- */}
			<Modal
				className="w-[1000px] "
				open={isOpenEmissionRate}
				onClose={handleCloseEmissionRateModal}
			>
				<div className="h-full w-full p-5 text-white">
					<div>
						<SteplineChart />
					</div>
					<div className="flex flex-col gap-5">
						<Button
							onClick={addPhase}
							className="h-16 w-16 rounded-full glass-component-3 flex items-center justify-center"
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
							{phase.map((phaseId, index) => (
								<motion.div
									key={phaseId}
									initial={{ opacity: 0, y: 50 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
									className="glass-component-3 h-auto p-4 pt-10 rounded-xl flex items-center justify-center flex-col gap-2 relative"
									style={{ width: 'calc(33% - 0.375rem)' }}
								>
									<Button
										onClick={() => handleOpenConfirmModal(phaseId)}
										className="absolute top-5 right-5 glass-component-3 px-3 py-1"
									>
										X
									</Button>

									<div className="w-full flex flex-col gap-3 p-2">
										<span className="font-orbitron text-lg">Emission Rate</span>
										<div className="relative w-full">
											<input
												type="number"
												value={phaseData[index]?.emissionRate || ''}
												onChange={(e) =>
													handleChangeEmissionRate(
														index,
														'emissionRate',
														e.target.value
													)
												}
												placeholder="Enter emission rate"
												className="p-3 pr-10 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm"
											/>
											<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-sm">
												%
											</span>
										</div>
									</div>

									<div className="w-full flex flex-col gap-3 p-2">
										<span className="font-orbitron text-lg">From</span>
										<input
											type="datetime-local"
											value={phaseData[index]?.from || ''}
											onChange={(e) =>
												handleChangeEmissionRate(index, 'from', e.target.value)
											}
											placeholder="Enter start date"
											className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm"
										/>
									</div>

									<div className="w-full flex flex-col gap-3 p-2">
										<span className="font-orbitron text-lg">To</span>
										<input
											type="datetime-local"
											value={phaseData[index]?.to || ''}
											onChange={(e) =>
												handleChangeEmissionRate(index, 'to', e.target.value)
											}
											placeholder="Enter end date"
											className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm"
										/>
									</div>
								</motion.div>
							))}
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
					Do you want to delete this form?
				</h3>
				<div className="flex justify-between mt-4">
					<Button
						onClick={handleCloseConfirmModal}
						className="bg-gray-500 text-white px-4 py-2 rounded-full"
					>
						No
					</Button>
					<Button
						onClick={handleConfirmRemoveForm}
						className="warm-cool-bg text-white px-4 py-2 rounded-full"
					>
						Yes
					</Button>
				</div>
			</Modal>

			<ToastContainer
				position="top-right"
				autoClose={4000}
				hideProgressBar={true}
			/>
		</div>
	)
}

export default CreatePool
