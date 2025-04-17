'use client'

import { useState, useEffect } from 'react'
import {
	ChevronDown,
	Info,
	Zap,
	Rocket,
	Sprout,
	AlertCircle,
} from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/app/components/UI/shadcn/Tooltip'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/app/components/UI/shadcn/Dialog'
import Spinner from '@/app/components/UI/Spinner'
import Button from '@/app/components/UI/Button'
import {
	useAccount,
	useReadContract,
	useWriteContract,
	useWaitForTransactionReceipt,
} from 'wagmi'
import { abi as launchpoolABI } from '@/abi/Launchpool.json'
import { abi as ERC20ABI } from '@/abi/ERC20.json'
import { parseUnits, formatUnits } from 'ethers'
import AlertInfo from './AlertInfo'

// Define pool types
type PoolType = 'launchpool' | 'launchpad' | 'farm'

export interface Pool {
	id: string
	type: PoolType
	staker_apy: number
	total_staked: bigint
	total_stakers: number
	duration: number
	earned: number
	tokenSymbol: string
	description?: string
}

interface StakingTableRowProps {
	projectName: string
	pools: Pool[]
	onHarvest: (poolId: string) => void
	onConnectWallet: () => void
	isWalletConnected: boolean
	onStake: (poolId: string, amount: number) => void
}

// Helper function to get pool icon based on type
const getPoolIcon = (type: PoolType) => {
	switch (type) {
		case 'launchpool':
			return <Zap className="w-5 h-5 text-blue-400" />
		case 'launchpad':
			return <Rocket className="w-5 h-5 text-purple-400" />
		case 'farm':
			return <Sprout className="w-5 h-5 text-green-400" />
	}
}

// Helper function to get pool color based on type
const getPoolColors = (type: PoolType) => {
	switch (type) {
		case 'launchpool':
			return {
				bg: 'from-blue-500/10 to-blue-600/5',
				border: 'border-blue-500/20',
				highlight: 'bg-blue-500/10',
				text: 'text-blue-400',
			}
		case 'launchpad':
			return {
				bg: 'from-purple-500/10 to-purple-600/5',
				border: 'border-purple-500/20',
				highlight: 'bg-purple-500/10',
				text: 'text-purple-400',
			}
		case 'farm':
			return {
				bg: 'from-green-500/10 to-green-600/5',
				border: 'border-green-500/20',
				highlight: 'bg-green-500/10',
				text: 'text-green-400',
			}
		default:
			return {
				bg: 'from-blue-500/10 to-blue-600/5',
				border: 'border-blue-500/20',
				highlight: 'bg-blue-500/10',
				text: 'text-blue-400',
			}
	}
}

const getPoolNameFromType = (type: PoolType) => {
	switch (type) {
		case 'launchpool':
			return 'Flexible Staking'
		case 'launchpad':
			return 'IDO participation'
		case 'farm':
			return 'Yield farming'
		default:
			return 'Unknown Pool'
	}
}

const formatReadContract = (
	data: string,
	status: 'idle' | 'pending' | 'success' | 'error',
	error: unknown,
	loadingComponent?: React.ReactNode
) => {
	if (!loadingComponent) {
		loadingComponent = <Spinner heightWidth={5} />
	}

	if (status === 'success') {
		return data
	} else if (status === 'error') {
		console.error('Error :', error)
		return '0'
	} else if (status === 'pending') {
		return loadingComponent
	}
}

// Mock func
const getAcceptedTokens = (pool: Pool): string[] => {
	switch (pool.type) {
		case 'launchpool':
		// return ['vDOT']
		default:
			return ['vDOT']
	}
}

const poolAddress = '0x3A4da384f189f132A8806Be91b17f38DA42375f3'

export default function StakingTableRow({
	projectName,
	pools,
	onConnectWallet,
	isWalletConnected,
	onStake,
}: StakingTableRowProps) {
	const account = useAccount()
	const [selectedPoolId, setSelectedPoolId] = useState<string>(
		pools[0]?.id || ''
	)
	const [stakeAmount, setStakeAmount] = useState<string>('')
	const [isStakeInteded, setIsStakeIntended] = useState(false)
	const [showAutoClaimNotice, setShowAutoClaimNotice] = useState(true)
	const [showVTokenNotice, setShowVTokenNotice] = useState(true)

	// Contract read operations
	const {
		data: allowance,
		error: readAllowanceError,
		status: readAllowanceStatus,
	} = useReadContract({
		abi: ERC20ABI,
		functionName: 'allowance',
		address: '0xD02D73E05b002Cb8EB7BEf9DF8Ed68ed39752465',
		args: [account.address, poolAddress],
		query: { refetchInterval: 500 },
	})

	const {
		data: claimables,
		status: readClaimablesStatus,
		error: readClaimablesError,
	} = useReadContract({
		abi: launchpoolABI,
		functionName: 'getClaimableProjectToken',
		address: poolAddress,
		args: [account.address],
		query: {
			refetchInterval: 1000,
		},
	})

	// Read user's staked balance in the pool
	const {
		data: userStake,
		status: readUserStakedStatus,
		error: readUserStakedError,
	} = useReadContract({
		abi: launchpoolABI,
		functionName: 'getStakerNativeAmount',
		address: poolAddress,
		args: [account.address],
		query: { refetchInterval: 1000 },
	})

	// Contract write operations
	const {
		data: approveHash,
		writeContractAsync: approveAsync,
		status: approveStatus,
	} = useWriteContract()

	const { writeContractAsync: stakeAsync, status: stakeStatus } =
		useWriteContract()

	const { writeContractAsync: claimAsync, status: claimStatus } =
		useWriteContract()

	// Handle staking intent
	useEffect(() => {
		console.log('isStakeInteded changed value to: ', isStakeInteded)
		if (!isStakeInteded) return

		const onChainStakeAmount = parseUnits(stakeAmount, 18)

		if (
			readAllowanceStatus === 'success' &&
			BigInt(allowance as string) >= BigInt(onChainStakeAmount)
		) {
			console.log('Allowance is sufficient, proceeding to stake')
			stakeAsync({
				abi: launchpoolABI,
				functionName: 'stake',
				address: poolAddress,
				args: [onChainStakeAmount],
			})
			setIsStakeIntended(false)
		} else {
			console.log('Allowance is insufficient, proceeding to approve')
			approveAsync({
				abi: ERC20ABI,
				functionName: 'approve',
				address: '0xD02D73E05b002Cb8EB7BEf9DF8Ed68ed39752465',
				args: [poolAddress, onChainStakeAmount],
			})
		}
	}, [isStakeInteded])

	// Handle approval derived from a stake intent
	useEffect(() => {
		console.log('Approve status changed value to: ', approveStatus)
		if (!isStakeInteded) return
		switch (approveStatus) {
			case 'idle':
			case 'pending':
				console.log('Approve status is either idle or pending, skipping...')
				return

			case 'success':
				stakeAsync({
					abi: launchpoolABI,
					functionName: 'stake',
					address: poolAddress,
					args: [parseUnits(stakeAmount, 18)],
				})
				break

			case 'error':
				alert('Approval failed. Cannot stake. Please try again.')
				break

			default:
				break
		}

		setIsStakeIntended(false)
	}, [approveStatus])

	// Handle claim action
	const handleClaim = async () => {
		console.log(`Claiming rewards for pool ${selectedPool.id}`)
		await claimAsync({
			abi: launchpoolABI,
			functionName: 'claimProjectTokens',
			address: poolAddress,
		})
	}

	const selectedPool =
		pools.find((pool) => pool.id === selectedPoolId) || pools[0]
	const poolColors = selectedPool
		? getPoolColors(selectedPool.type)
		: getPoolColors('launchpool')

	const handlePoolChange = (value: string) => {
		setSelectedPoolId(value)
	}

	const handleStake = async () => {
		// Ensure we have a valid amount and account connection
		if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
			alert('Please enter a valid amount to stake')
			return
		}

		if (!account.isConnected || !selectedPool) {
			alert('Connect wallet first')
			return
		}

		setIsStakeIntended(true)
	}

	return (
		<div className="w-full rounded-xl overflow-hidden backdrop-blur-xl bg-black/30 border border-white/10 shadow-xl">
			<div className="flex flex-col md:flex-row">
				{/* Left panel - Pool info */}
				<div className="w-full md:w-1/3 p-6 backdrop-blur-md bg-black/40 flex flex-col justify-between border-r border-white/5">
					<div>
						{/* Pool selector with popup */}
						<div className="mb-6">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-lg font-medium text-white">Pool</h3>
								<Dialog>
									<DialogTrigger asChild>
										<button className="h-9 px-3 py-2 flex flex-row items-center border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white">
											<span className="mr-2">Select Pool</span>
											<ChevronDown size={16} />
										</button>
									</DialogTrigger>
									<DialogContent className="bg-black/80 backdrop-blur-xl border-white/10 text-white max-w-md">
										<DialogHeader>
											<DialogTitle className="text-xl font-medium text-white mb-4">
												Select Staking Pool
											</DialogTitle>
										</DialogHeader>
										<div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
											{pools.map((pool) => {
												const colors = getPoolColors(pool.type)
												const isSelected = selectedPoolId === pool.id

												return (
													<div
														key={pool.id}
														className={`p-4 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-md
                              border bg-gradient-to-br ${colors.bg} ${colors.border}
                              ${
																isSelected
																	? 'shadow-lg border-white/30 bg-opacity-100 from-blue-500/20 to-blue-600/10 brightness-125'
																	: 'hover:brightness-110 hover:border-white/20'
															}`}
														onClick={() => {
															handlePoolChange(pool.id)
															// Close the dialog after selection
															const closeButton = document.querySelector(
																'[data-state="open"] button[data-state="closed"]'
															)
															if (closeButton) {
																;(closeButton as HTMLButtonElement).click()
															}
														}}
													>
														<div className="flex items-center gap-2 mb-2">
															<div
																className={
																	isSelected
																		? 'text-opacity-100 brightness-125'
																		: ''
																}
															>
																{getPoolIcon(pool.type)}
															</div>
															<span
																className={`font-medium uppercase text-xs ${colors.text}
                                  ${isSelected ? 'text-opacity-100 brightness-125' : ''}`}
															>
																{pool.type}
															</span>
														</div>

														<div className="flex justify-between items-center">
															<span
																className={`font-medium ${isSelected ? 'text-white brightness-125' : 'text-white'}`}
															>
																{getPoolNameFromType(pool.type)}
															</span>
															<span
																className={`font-medium ${
																	isSelected
																		? 'text-green-300 brightness-125'
																		: 'text-green-400'
																}`}
															>
																{pool.staker_apy}% APR
															</span>
														</div>

														{pool.description && (
															<p className="text-xs text-gray-400 mt-1 mb-2">
																{pool.description}
															</p>
														)}

														<div className="flex flex-row justify-between items-center mt-2 text-xs text-gray-400">
															<span>Duration: {pool.duration} days</span>
															<span className="flex items-center">
																Earned:&nbsp;
																<span className="truncate max-w-[100px] overflow-hidden whitespace-nowrap inline-block align-bottom">
																	{formatReadContract(
																		formatUnits(
																			(claimables as bigint) ?? '0',
																			18
																		),
																		readClaimablesStatus,
																		readClaimablesError
																	)}
																</span>
																&nbsp;{pool.tokenSymbol}
															</span>
														</div>

														{/* Display selected tokens */}
														<div className="mt-3">
															<div className="text-xs text-gray-400 mb-1">
																Accepted tokens:
															</div>
															<div className="flex flex-wrap gap-1">
																{getAcceptedTokens(selectedPool).map(
																	(token) => (
																		<div
																			key={token}
																			className="bg-white/10 rounded-full px-2 py-0.5 text-xs"
																		>
																			{token}
																		</div>
																	)
																)}
															</div>
														</div>
													</div>
												)
											})}
										</div>
									</DialogContent>
								</Dialog>
							</div>

							{/* Display selected pool info */}
							{selectedPool && (
								<div
									className={`rounded-xl p-4 backdrop-blur-md bg-gradient-to-br border
                    ${poolColors.bg} ${poolColors.border}`}
								>
									<div className="flex items-center gap-2 mb-2">
										{getPoolIcon(selectedPool.type)}
										<span
											className={`font-medium uppercase text-xs ${poolColors.text}`}
										>
											{selectedPool.type}
										</span>
									</div>

									<div className="flex justify-between items-center">
										<span className="font-medium text-white">
											{getPoolNameFromType(selectedPool.type)}
										</span>
										<span className="text-green-400 font-medium">
											{selectedPool.staker_apy}% APR
										</span>
									</div>

									{selectedPool.description && (
										<p className="text-xs text-gray-400 mt-1">
											{selectedPool.description}
										</p>
									)}
								</div>
							)}

							{/* Display accepted tokens */}
							<div className="mt-3">
								<div className="text-xs text-gray-400 mb-1">
									Accepted tokens:
								</div>
								<div className="flex flex-wrap gap-1">
									{getAcceptedTokens(selectedPool).map((token) => (
										<div
											key={token}
											className="bg-white/10 rounded-full px-2 py-0.5 text-xs"
										>
											{token}
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="flex justify-between mb-2 text-sm">
							<div className="text-gray-400">APR:</div>
							<div className="font-medium text-white">
								{selectedPool?.staker_apy || 0}%
							</div>
						</div>

						<div className="flex justify-between text-sm">
							<div className="text-gray-400">Ends in:</div>
							<div className="font-medium text-white">
								{selectedPool?.duration || 0} days
							</div>
						</div>
					</div>

					<div className="mt-6">
						<button
							className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
							onClick={() => window.open(`/project/${projectName}`, '_blank')}
						>
							View Project Detail
						</button>
					</div>
				</div>

				{/* Right panel - Earned and Staking */}
				<div className="w-full md:w-2/3 flex flex-col md:flex-row">
					{/* Earned section */}
					<div className="md:w-1/2 p-6 backdrop-blur-md bg-black/20 flex flex-col justify-normal border-b md:border-b-0 md:border-r border-white/5">
						{/* Auto-claim notification */}
						<AlertInfo accentColor="blue">
							<div className="flex-1 text-xs font-medium">
								whenever you stake or unstake, any pending{' '}
								<span className="font-bold text-blue-100">
									claimable project tokens
								</span>{' '}
								will be{' '}
								<span className="font-bold text-green-200">
									automatically sent to your wallet
								</span>
								.<br />
								<span className="text-blue-300">
									your claimable amount will reset to 0 after staking or
									unstaking.
								</span>
							</div>
						</AlertInfo>

						<div>
							<h2 className="text-xl font-medium mb-6 text-white">EARNED</h2>
							<div className="flex flex-row justify-start items-center text-2xl font-bold font-orbitron mb text-white">
								{/* This is to trim amount if too long */}
								<span className="truncate block overflow-hidden whitespace-nowrap">
									{formatReadContract(
										formatUnits((claimables as bigint) ?? '0', 18),
										readClaimablesStatus,
										readClaimablesError
									)}
								</span>
								<span className="text-sm text-gray-400 ml-1 flex-shrink-0">
									{selectedPool?.tokenSymbol}
								</span>
							</div>
						</div>

						{/* Filler to ensure the claim button always stay at bottom of the section*/}
						<div className="flex flex-col h-full"></div>

						<div className="flex-1" />
						<button
							className="px-4 py-2 bg-white/10 hover:bg-white/35 text-white rounded-full font-comfortaa 
							transition-all duration-300 ease-in-out 
							hover:opacity-80 hover:shadow-lg hover:scale-105 
							active:scale-95 active:opacity-90"
							onClick={handleClaim}
						>
							<div className="flex items-center justify-center">
								Claim rewards &nbsp;
								{claimStatus === 'pending' && <Spinner heightWidth={5} />}
							</div>
						</button>
					</div>

					{/* Start staking section */}
					<div className="w-full md:w-1/2 p-6 backdrop-blur-md bg-black/20 flex flex-col justify-between">
						<div>
							{/* Show vToken yield-bearing explanation */}
							<AlertInfo accentColor="purple">
								<div className="flex-1 text-xs font-medium">
									Your staked amount is shown in{' '}
									<span className="font-bold text-purple-100">
										native tokens
									</span>{' '}
									(not vTokens).
									<br />
									Because{' '}
									<span className="font-bold text-green-200">
										vTokens are yield-bearing
									</span>
									, the amount of vTokens needed to represent the same native
									token value{' '}
									<span className="font-bold text-purple-100">
										decreases over time
									</span>{' '}
									as the exchange rate changes.
									<br />
									<span className="text-purple-300">
										This is normal and does{' '}
										<span className="font-bold">not</span> mean your stake is
										lost or reduced.
									</span>
								</div>
							</AlertInfo>

							<h2 className="text-xl font-medium font-orbitron mb-6 text-white">
								START STAKING
							</h2>
							{account.isConnected && (
								<div className="mb-4">
									<div className="flex items-center justify-between mb-1">
										<label className="text-sm text-gray-400">Amount</label>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger>
													<Info size={16} className="text-gray-400" />
												</TooltipTrigger>
												<TooltipContent className="bg-black/80 border-white/10 text-white">
													<p>Enter the amount you want to stake</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
									<input
										type="number"
										value={stakeAmount}
										onChange={(e) => setStakeAmount(e.target.value)}
										placeholder="0.0"
										className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-4 text-white backdrop-blur-md focus:outline-none focus:ring-0 focus:border-white/20"
									/>
									<div className="mt-2 flex items-center gap-2 text-xs font-orbitron">
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<span className="inline-flex items-center cursor-help">
														<span className="uppercase tracking-widest text-cyan-400/80 mr-1">
															Allowance
														</span>
														<Info size={13} className="text-cyan-400/60" />
													</span>
												</TooltipTrigger>
												<TooltipContent className="bg-black/80 border-white/10 text-xs text-white">
													<p>
														The maximum amount you can stake without another
														approval.
														<br />
														Increase allowance by staking or approving more.
													</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										<span
											className="bg-gradient-to-r from-cyan-400/20 to-blue-500/10 border border-cyan-400/20 rounded px-2 py-0.5 text-cyan-200 font-bold tracking-wide shadow-inner"
											style={{ fontVariantNumeric: 'tabular-nums' }}
										>
											{readAllowanceStatus === 'success' ? (
												`${formatUnits((allowance as bigint) ?? 0, 18)} ${selectedPool?.tokenSymbol}`
											) : (
												<span className="text-gray-400">Loading...</span>
											)}
										</span>
									</div>

									{/* Total Staked by User */}
									<div className="mt-2 flex items-center gap-2 text-xs font-orbitron">
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<span className="inline-flex items-center cursor-help">
														<span className="uppercase tracking-widest text-green-400/80 mr-1">
															Your Stake (DOT)
														</span>
														<Info size={13} className="text-green-400/60" />
													</span>
												</TooltipTrigger>
												<TooltipContent className="bg-black/80 border-white/10 text-xs text-white">
													<p>
														Total amount of tokens you have staked in this pool.
													</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										<span
											className="bg-gradient-to-r from-green-400/20 to-blue-500/10 border border-green-400/20 rounded px-2 py-0.5 text-green-200 font-bold tracking-wide shadow-inner"
											style={{ fontVariantNumeric: 'tabular-nums' }}
										>
											{readUserStakedStatus === 'success' ? (
												`${formatUnits((userStake as bigint) ?? 0, 18)} ${selectedPool?.tokenSymbol}`
											) : (
												<span className="text-gray-400">Loading...</span>
											)}
										</span>
									</div>
								</div>
							)}
						</div>

						<Button onClick={handleStake}>
							{account.isConnected ? (
								<div className="flex items-center justify-center">
									Stake & Earn &nbsp;
									{(approveStatus === 'pending' ||
										stakeStatus === 'pending') && <Spinner heightWidth={5} />}
								</div>
							) : (
								'Connect Wallet'
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
