'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Info, Zap } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/app/components/UI/shadcn/Tooltip'
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
import AlertInfo from '../AlertInfo'
import { UnifiedPool, EnrichedProject } from '@/custom-types'
import { PoolSelector } from './PoolSelector'
import { PoolCard } from './PoolCard'

export interface LaunchpoolTableRowProps {
	project: EnrichedProject
	pool: UnifiedPool
	onPoolSelected: (pool: UnifiedPool) => void
}

// Mock function for accepted tokens
const getAcceptedTokens = (): string[] => {
	return ['vDOT']
}

// Placeholder for actual contract address
const poolAddress = '0xd7667d3f4720ba6cff81f44a14ddef18dce02453'

export default function LaunchpoolTableRow({
	project,
	pool,
	onPoolSelected,
}: LaunchpoolTableRowProps) {
	const account = useAccount()
	const [stakeAmount, setStakeAmount] = useState<string>('')
	const [isStakeInteded, setIsStakeIntended] = useState(false)

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
		if (!isStakeInteded) return

		const onChainStakeAmount = parseUnits(stakeAmount, 18)

		if (
			readAllowanceStatus === 'success' &&
			BigInt(allowance as string) >= BigInt(onChainStakeAmount)
		) {
			stakeAsync({
				abi: launchpoolABI,
				functionName: 'stake',
				address: poolAddress,
				args: [onChainStakeAmount],
			})
			setIsStakeIntended(false)
		} else {
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
		if (!isStakeInteded) return
		switch (approveStatus) {
			case 'idle':
			case 'pending':
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

	// Helper function to format read contract data
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

	// Handle claim action
	const handleClaim = async () => {
		await claimAsync({
			abi: launchpoolABI,
			functionName: 'claimProjectTokens',
			address: poolAddress,
		})
	}

	const handleStake = async () => {
		// Ensure we have a valid amount and account connection
		if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
			alert('Please enter a valid amount to stake')
			return
		}

		setIsStakeIntended(true)
	}

	const tokenSymbol = pool.token_symbol || 'TOKENS'

	return (
		<div className="w-full rounded-xl overflow-hidden backdrop-blur-xl bg-black/30 border border-white/10 shadow-xl">
			<div className="flex flex-col md:flex-row">
				{/* Left panel - Pool info */}
				<div className="w-full md:w-1/3 p-6 backdrop-blur-md bg-black/40 flex flex-col justify-between border-r border-white/5">
					<div>
						{/* Pool type indicator */}
						<div className="mb-6">
							<div className="flex flex-row items-center gap-2 mb-3">
								<Zap className="w-5 h-5 text-blue-400" />
								<span className="font-medium uppercase text-xs text-blue-400">
									{pool.type}
								</span>
								<span className="ml-auto">
									<PoolSelector
										project={project}
										onPoolSelected={onPoolSelected}
										initialSelectedPoolAddress={pool.id}
									/>
								</span>
							</div>

							<div className="rounded-xl p-4 backdrop-blur-md bg-gradient-to-br border from-blue-500/10 to-blue-600/5 border-blue-500/20">
								<PoolCard isSelected={false} pool={pool} />

								{pool.description && (
									<p className="text-xs text-gray-400 mt-1">
										{pool.description}
									</p>
								)}
							</div>

							{/* Display accepted tokens */}
							<div className="mt-3">
								<div className="text-xs text-gray-400 mb-1">
									Accepted tokens:
								</div>
								<div className="flex flex-wrap gap-1">
									{getAcceptedTokens().map((token) => (
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
								{pool?.staker_apy || 0}%
							</div>
						</div>

						<div className="flex justify-between text-sm">
							<div className="text-gray-400">Ends in:</div>
							<div className="font-medium text-white">
								{pool?.duration || 0} days
							</div>
						</div>
					</div>

					<div className="mt-6">
						<button
							className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
							onClick={() => window.open(`/project/${project.name}`, '_blank')}
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
								Whenever you stake or unstake, any pending{' '}
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
									{tokenSymbol}
								</span>
							</div>
						</div>

						{/* Filler to ensure the claim button always stay at bottom of the section*/}
						<div className="flex flex-col h-full"></div>

						<div className="flex-1" />
						<Button
							className="px-4 py-2 bg-white/10 hover:bg-white/35 text-white rounded-full font-comfortaa 
							transition-all duration-300 ease-in-out 
							hover:opacity-80 hover:shadow-lg hover:scale-105 
							active:scale-95 active:opacity-90"
							onClick={handleClaim}
							disabled={!account.isConnected}
						>
							<div className="flex items-center justify-center">
								Claim rewards &nbsp;
								{claimStatus === 'pending' && <Spinner heightWidth={5} />}
							</div>
						</Button>
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
												`${formatUnits((allowance as bigint) ?? 0, 18)} ${tokenSymbol}`
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
												`${formatUnits((userStake as bigint) ?? 0, 18)} ${tokenSymbol}`
											) : (
												<span className="text-gray-400">Loading...</span>
											)}
										</span>
									</div>
								</div>
							)}
						</div>

						<Button onClick={handleStake} disabled={!account.isConnected}>
							<div className="flex items-center justify-center">
								Stake & Earn &nbsp;
								{(approveStatus === 'pending' || stakeStatus === 'pending') && (
									<Spinner heightWidth={5} />
								)}
							</div>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
