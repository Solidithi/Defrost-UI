'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/app/components/UI/shadcn/Tabs'
import { Info, Zap, Award } from 'lucide-react'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { parseUnits, formatUnits } from 'ethers'
import {
	useAccount,
	useBalance,
	useWaitForTransactionReceipt,
	useWriteContract,
} from 'wagmi'
import { Launchpool__factory } from '@/app/types/typechain'
import { formatTokenAmount, formatUsdValue } from '@/app/utils/display'
import { cn } from '@/app/lib/utils'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/app/components/UI/shadcn/Tooltip'
import { useApproveAndeDepositToken } from '@/app/hooks/useApproveAndSendToken'
import Spinner from '../effect/Spinner'
import { toast, ToastContainer } from 'react-toastify'
import { useLaunchpoolNameAndDescription } from '@/app/hooks/staking/usePoolNameAndDescription'
import { useLaunchpoolTokenInfo } from '@/app/hooks/staking/useTokenInfo'

function getFunctionAbiFromIface(factory: any, functionName: string): any {
	return [factory.abi.find((f: any) => f.name === functionName)]
}

interface LaunchppolStakingDetailsModalProps {
	pool: EnrichedLaunchpool
	yourStakePercent?: number
	withdrawableVTokens?: bigint
	yourNativeStake?: bigint
	totalStakedVTokens?: bigint
	onClose: () => void
}

export function LaunchpoolStakingDetailsModal({
	pool,
	yourStakePercent = 0,
	yourNativeStake = BigInt(0),
	withdrawableVTokens = BigInt(0),
	totalStakedVTokens = BigInt(0),
	onClose,
}: LaunchppolStakingDetailsModalProps) {
	const [activeTab, setActiveTab] = useState('overview')
	const account = useAccount()

	// Get token info from the store
	// const tokensInfo = useSelectedPoolTokensInfo()
	const { tokensInfo, rewards } = useLaunchpoolTokenInfo(pool)

	const hasStake = yourStakePercent > 0

	// Use safe fallbacks if tokensInfo is not loaded yet
	const safeTokensInfo =
		tokensInfo?.poolType === 'launchpool'
			? tokensInfo
			: {
					vTokenInfo: {
						decimals: 18,
						symbol: 'vToken',
						address: pool.v_asset_address || '0x',
					},
					nativeTokenInfo: {
						decimals: 18,
						symbol: 'Native',
						address: pool.native_asset_address || '0x',
					},
					projectTokenInfo: {
						decimals: 18,
						symbol: 'PROJECT',
						address: pool.project_token_address || '0x',
					},
					rewardTokens: [
						{
							decimals: 18,
							symbol: 'PROJECT',
							address: pool.project_token_address || '0x',
						},
					],
					poolType: 'launchpool' as const,
				}

	// Get user's vToken balance
	const { data: vTokenBalance } = useBalance({
		address: account.address,
		token: safeTokensInfo.vTokenInfo.address as `0x${string}`,
		query: {
			enabled: !!account.address && !!safeTokensInfo.vTokenInfo.address,
		},
	})

	/* ---------------------- Handle pending rewards ---------------------- */
	// const { data: pendingRewards } = useReadContract({
	// 	address: pool.id as `0x${string}`,
	// 	abi: getFunctionAbiFromIface(
	// 		Launchpool__factory,
	// 		'getClaimableProjectToken'
	// 	),
	// 	functionName: 'getClaimableProjectToken',
	// 	args: [account.address!],
	// 	query: {
	// 		enabled: !!account.address && !!pool.id && hasStake,
	// 	},
	// })

	// Format pending rewards with proper decimals and abbreviation
	// const formattedPendingRewards = pendingRewards
	// 	? formatTokenAmount(
	// 			formatUnits(
	// 				pendingRewards as bigint,
	// 				safeTokensInfo.projectTokenInfo.decimals
	// 			),
	// 			{
	// 				symbol: safeTokensInfo.projectTokenInfo.symbol,
	// 				maxDecimals: 6,
	// 				maxChars: 10,
	// 			}
	// 		)
	// 	: '0.00'
	const formattedPendingRewards = rewards.formatted

	// Calculate estimated rewards based on APY and stake amount
	const calculateRewards = (amount: string, apy: number, period: number) => {
		if (!amount || isNaN(parseFloat(amount))) return '0.00'

		// For daily, divide by 365; weekly, divide by 52; monthly, divide by 12
		const periodicReturn = (parseFloat(amount) * (apy / 100)) / period
		return periodicReturn.toFixed(6)
	}

	/* ---------------------- Handle claim rewards ---------------------- */
	const {
		writeContract: claimRewards,
		status: claimRewardsStatus,
		data: claimRewardsTxHash,
	} = useWriteContract()

	const { status: claimRewardsConfirmStatus } = useWaitForTransactionReceipt({
		hash: claimRewardsTxHash,
	})

	const handleClaimRewards = () => {
		claimRewards({
			abi: getFunctionAbiFromIface(Launchpool__factory, 'claimProjectTokens'),
			address: pool.id as `0x${string}`,
			functionName: 'claimProjectTokens',
			args: [],
		})
	}

	useEffect(() => {
		if (claimRewardsConfirmStatus === 'success') {
			toast.success('Claiming rewards successful!', {
				position: 'top-right',
				autoClose: 5000,
			})
		} else if (claimRewardsConfirmStatus === 'error') {
			toast.error('Claiming rewards failed!', {
				position: 'top-right',
				autoClose: 5000,
			})
		}
	}, [claimRewardsConfirmStatus])

	const isClaimButtonDisabled = useMemo(() => {
		return (
			!rewards.claimable ||
			BigInt(rewards.claimable.toString()) === BigInt(0) ||
			claimRewardsStatus === 'pending' ||
			(claimRewardsStatus === 'success' &&
				claimRewardsConfirmStatus === 'pending')
		)
	}, [formattedPendingRewards, claimRewardsStatus, claimRewardsConfirmStatus])

	/* ---------------------- Handle stake amount change ---------------------- */
	const [stakeAmount, setStakeAmount] = useState('')

	const handleStakeAmountChange = (value: string) => {
		// Allow only numbers and decimal point
		const regex = /^[0-9]*\.?[0-9]*$/
		if (regex.test(value) || value === '') {
			setStakeAmount(value)
		}
	}

	// Set max amount handler
	const handleSetMaxStake = () => {
		if (vTokenBalance) {
			setStakeAmount(formatUnits(vTokenBalance.value, vTokenBalance.decimals))
		}
	}

	const parsedStakeAmount = useMemo(() => {
		if (!stakeAmount) return BigInt(0)

		return parseUnits(stakeAmount, safeTokensInfo.vTokenInfo.decimals)
	}, [stakeAmount])

	/* ---------------------- Handle stake ---------------------- */
	const { deposit, approval } = useApproveAndeDepositToken({
		depositFunctionABI: getFunctionAbiFromIface(Launchpool__factory, 'stake'),
		depositFunctionName: 'stake',
		depositFunctionArgs: [parsedStakeAmount],
		amount: parsedStakeAmount,
		recipientAddress: pool.id as `0x${string}`,
		tokenAddress: pool.v_asset_address as `0x${string}`,
	})

	const handleStake = async () => {
		if (!stakeAmount || parseFloat(stakeAmount) <= 0) return

		try {
			// Start the deposit process
			await deposit.deposit()
			setStakeAmount('')
		} catch (error) {
			console.error('Error staking:', error)
		}
	}

	useEffect(() => {
		if (deposit.depositConfirmStatus === 'success') {
			toast.success('Staking successful!', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			})
		} else if (deposit.depositConfirmStatus === 'error') {
			toast.error('Staking failed!', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			})
		}
	}, [deposit.depositConfirmStatus])

	/* ---------------------- Handle unstake amount change ---------------------- */
	const [unstakeAmount, setUnstakeAmount] = useState('')

	// Set max unstake amount handler
	const handleSetMaxUnstake = () => {
		if (withdrawableVTokens) {
			setUnstakeAmount(
				formatUnits(
					BigInt(withdrawableVTokens),
					safeTokensInfo.vTokenInfo.decimals
				)
			)
		}
	}

	const parsedUnstakeAmount = useMemo(() => {
		if (!unstakeAmount) return BigInt(0)

		return parseUnits(unstakeAmount, safeTokensInfo.vTokenInfo.decimals)
	}, [unstakeAmount])

	/* ---------------------- Handle unstake ---------------------- */
	const {
		writeContractAsync: unstake,
		data: unstakeTxHash,
		status: unstakeStatus,
		error: unstakeError,
	} = useWriteContract({})

	const { status: unstakeConfirmStatus } = useWaitForTransactionReceipt({
		hash: unstakeTxHash,
	})

	const handleUnstake = async () => {
		if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return

		unstake({
			abi: getFunctionAbiFromIface(Launchpool__factory, 'unstake'),
			address: pool.id as `0x${string}`,
			functionName: 'unstake',
			args: [parsedUnstakeAmount],
		})
	}

	useEffect(() => {
		if (unstakeConfirmStatus === 'success') {
			toast.success('Unstaking successful!', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			})
		} else if (unstakeConfirmStatus === 'error') {
			toast.error('Unstaking failed!', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			})
		}
	}, [unstakeConfirmStatus])

	/* ---------------------- Get derived pool name and description ---------------------- */
	const { name, description } = useLaunchpoolNameAndDescription(pool)

	/* ---------------------- User interface ---------------------- */
	return (
		<div className="text-white">
			<div className="flex items-center gap-4 mb-6">
				<div className="relative w-16 h-16 rounded-xl overflow-hidden">
					<Image
						// src={pool.image || '/placeholder.svg'}
						src="/token-logos/vdot.webp"
						alt={name}
						width={64}
						height={64}
						className="w-full h-full object-cover"
					/>
				</div>
				<div>
					<h2 className="text-2xl font-bold">{name}</h2>
					<p className="text-white/80">{description}</p>
				</div>
			</div>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="w-full backdrop-blur-xl bg-white/15 p-1 rounded-xl">
					<TabsTrigger
						value="overview"
						className="data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
						onClick={() => setActiveTab('overview')}
					>
						Overview
					</TabsTrigger>
					<TabsTrigger
						value="stake"
						className="data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
						onClick={() => setActiveTab('stake')}
					>
						Stake
					</TabsTrigger>
					<TabsTrigger
						value="unstake"
						className="data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
						onClick={() => setActiveTab('unstake')}
					>
						Unstake
					</TabsTrigger>
					<TabsTrigger
						value="rewards"
						className="data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
						onClick={() => setActiveTab('rewards')}
					>
						Rewards
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-6">
							<div className="rounded-xl glossy-card p-6">
								<h3 className="text-lg font-medium mb-4">Pool Information</h3>
								<div className="space-y-4">
									<div className="flex justify-between">
										<span className="text-white/80">Pool Type</span>
										<span className="font-medium flex items-center gap-1">
											<Zap size={14} className="text-pink-400" />
											{pool.type === 'launchpool' ? 'LaunchPool' : pool.type}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-white/80">APY</span>
										<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
											{pool.staker_apy.toFixed(2)}%
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-white/80">Duration</span>
										<span>{pool.durationSeconds / 86400} days</span>
									</div>
									<div className="flex justify-between">
										<span className="text-white/80">Accepted Token</span>
										<span>{safeTokensInfo.vTokenInfo.symbol}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-white/80">Status</span>
										<span
											className={
												pool.status === 'active'
													? 'text-green-400'
													: 'text-gray-400'
											}
										>
											{pool.status === 'active' ? 'Active' : 'Ended'}
										</span>
									</div>
								</div>
							</div>

							<div className="rounded-xl glossy-card p-6">
								<h3 className="text-lg font-medium mb-4">
									Important Information
								</h3>
								<div className="space-y-4 text-sm">
									<div className="flex gap-3">
										<Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
										<p className="text-white/80">
											Your stake is tracked in{' '}
											<span className="font-medium text-white">
												{safeTokensInfo.nativeTokenInfo.symbol}
											</span>{' '}
											(native tokens), ensuring your share and rewards remain
											consistent regardless of vToken changes.
										</p>
									</div>
									<div className="flex gap-3">
										<Info size={18} className="text-pink-400 shrink-0 mt-0.5" />
										<p className="text-white/80">
											<span className="font-medium text-white">
												{safeTokensInfo.vTokenInfo.symbol}
											</span>{' '}
											are yield-bearing tokens - as they gain value over time,
											the withdrawable {safeTokensInfo.vTokenInfo.symbol} amount
											will decrease while representing the same{' '}
											{safeTokensInfo.nativeTokenInfo.symbol} value.
										</p>
									</div>
									<div className="flex gap-3">
										<Info
											size={18}
											className="text-purple-400 shrink-0 mt-0.5"
										/>
										<p className="text-white/80">
											Your rewards are calculated based on your{' '}
											{safeTokensInfo.nativeTokenInfo.symbol} value, not the
											changing {safeTokensInfo.vTokenInfo.symbol} amount,
											ensuring fair and consistent returns.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<div className="rounded-xl glossy-card p-6">
								<h3 className="text-lg font-medium mb-4">Your Position</h3>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4 mb-2">
										<div>
											<div className="text-white/80 text-sm mb-1">
												Original Native Stake
											</div>
											<div className="font-bold">
												{formatTokenAmount(
													formatUnits(
														yourNativeStake,
														safeTokensInfo.nativeTokenInfo.decimals
													),
													{
														symbol: safeTokensInfo.nativeTokenInfo.symbol,
														maxDecimals: 4,
													}
												)}
											</div>
										</div>
										<div>
											<div className="text-white/80 text-sm mb-1 flex gap-1 justify-end">
												<div className="group relative inline-block">
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<div className="inline-flex cursor-help">
																	<Info size={14} className="text-white/60" />
																</div>
															</TooltipTrigger>
															<TooltipContent
																side="top"
																className="bg-black/90 border border-white/20 text-white max-w-[250px]"
															>
																This amount decreases over time as each vToken
																becomes worthy of more native tokens
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
												Withdrawable vTokens
											</div>
											<div className="font-bold text-right">
												{formatTokenAmount(
													formatUnits(
														BigInt(withdrawableVTokens || '0'),
														safeTokensInfo.vTokenInfo.decimals
													),
													{
														symbol: safeTokensInfo.vTokenInfo.symbol,
														maxDecimals: 4,
													}
												)}
											</div>
										</div>
									</div>

									<div className="px-4 py-3 bg-white/5 rounded-lg border border-white/10 mb-2">
										<div className="flex justify-between text-sm">
											<span>Exchange Rate:</span>
											<span>
												1 {safeTokensInfo.vTokenInfo.symbol} ={' '}
												{formatTokenAmount(withdrawableVTokens, {
													symbol: safeTokensInfo.nativeTokenInfo.symbol,
													maxDecimals: 4,
												})}
											</span>
										</div>
									</div>

									<div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
											style={{
												width: `${yourStakePercent}%`,
											}}
										></div>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-white/60">
											Pool Total:{' '}
											{formatTokenAmount(
												formatUnits(
													BigInt(totalStakedVTokens || '0'),
													safeTokensInfo.vTokenInfo.decimals
												),
												{
													maxDecimals: 2,
												}
											)}
										</span>
										<span className="text-white/60">
											Your Share: {yourStakePercent.toFixed(2)}%
										</span>
									</div>
								</div>
							</div>

							<div className="rounded-xl glossy-card p-6">
								<h3 className="text-lg font-medium mb-4">Rewards History</h3>
								{hasStake ? (
									<div className="text-center py-8">
										<p className="text-white/80 mb-2">No rewards claimed yet</p>
										<button className="px-4 py-2 rounded-lg backdrop-blur-xl bg-white/15 border border-white/20 text-white text-sm hover:bg-white/20 transition">
											View All Transactions
										</button>
									</div>
								) : (
									<div className="text-center py-8">
										<p className="text-white/80">
											Stake tokens to earn rewards
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="stake" className="mt-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="rounded-xl glossy-card p-6">
							<h3 className="text-lg font-medium mb-4">Stake Tokens</h3>
							<div className="space-y-4">
								<div>
									<label className="text-sm text-white/80 block mb-2">
										Amount to Stake
									</label>
									<div className="relative">
										<input
											type="text"
											value={stakeAmount}
											onChange={(e) => handleStakeAmountChange(e.target.value)}
											placeholder="0.00"
											className="w-full px-4 py-3 pr-20 rounded-xl glossy-input text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
										/>
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
											<button
												onClick={handleSetMaxStake}
												className="text-xs text-pink-400 hover:text-pink-300"
											>
												MAX
											</button>
											<span className="text-white/80">
												{safeTokensInfo.vTokenInfo.symbol}
											</span>
										</div>
									</div>
									<div className="flex justify-between mt-2 text-sm">
										<span className="text-white/60">
											Balance:{' '}
											{vTokenBalance
												? formatTokenAmount(
														formatUnits(
															vTokenBalance.value,
															vTokenBalance.decimals
														),
														{ symbol: safeTokensInfo.vTokenInfo.symbol }
													)
												: `0.00 ${safeTokensInfo.vTokenInfo.symbol}`}
										</span>
										<span className="text-white/60">
											≈{' '}
											{formatUsdValue(
												vTokenBalance
													? formatUnits(
															vTokenBalance.value,
															vTokenBalance.decimals
														)
													: '0.00'
											)}
										</span>
									</div>
								</div>

								<div className="pt-4 border-t border-white/20 mt-4">
									<div className="flex justify-between mb-2">
										<span className="text-white/80">Staking Fee</span>
										<span className="font-medium">
											0.00 {safeTokensInfo.nativeTokenInfo.symbol}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-white/80">You Will Receive</span>
										<span className="font-medium">
											{stakeAmount
												? formatTokenAmount(
														calculateRewards(
															stakeAmount,
															pool.staker_apy.toNumber(),
															365
														),
														{ maxDecimals: 6 }
													)
												: '0.00'}{' '}
											{safeTokensInfo.projectTokenInfo.symbol}/day
										</span>
									</div>
								</div>

								<button
									className={cn(
										'w-full mt-4 px-4 py-3 rounded-xl font-medium transition shadow-md shadow-purple-500/30',
										stakeAmount &&
											parseFloat(stakeAmount) > 0 &&
											vTokenBalance &&
											parseFloat(stakeAmount) <=
												parseFloat(
													formatUnits(
														vTokenBalance.value,
														vTokenBalance.decimals
													)
												)
											? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90'
											: 'bg-white/15 border border-white/20 text-white/60'
									)}
									disabled={
										!stakeAmount ||
										parseFloat(stakeAmount) <= 0 ||
										!vTokenBalance ||
										parseFloat(stakeAmount) >
											parseFloat(
												formatUnits(vTokenBalance.value, vTokenBalance.decimals)
											)
									}
									onClick={handleStake}
								>
									<span className="flex items-center justify-center">
										{approval.approveStatus === 'pending' ? (
											<>
												Waiting for approval...&emsp;
												<Spinner heightWidth={4} />
											</>
										) : approval.isConfirmingApproval ? (
											<>
												Confirming approval...&emsp;
												<Spinner heightWidth={4} />
											</>
										) : deposit.depositStatus === 'pending' &&
										  deposit.isDepositStarted ? (
											<>
												Staking...&emsp;
												<Spinner heightWidth={4} />
											</>
										) : deposit.depositStatus === 'success' &&
										  deposit.depositConfirmStatus === 'pending' ? (
											<>
												Confirming transaction...&emsp;
												<Spinner heightWidth={4} />
											</>
										) : (
											<>Stake Now</>
										)}
									</span>
								</button>
							</div>
						</div>

						<div className="space-y-6">
							<div className="rounded-xl glossy-card p-6">
								<h3 className="text-lg font-medium mb-4">
									Staking Information
								</h3>
								<div className="space-y-4 text-sm">
									<div className="flex gap-3">
										<Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
										<p className="text-white/80">
											When you stake {safeTokensInfo.vTokenInfo.symbol},
											you&apos;re dedicating your tokens to the pool in exchange
											for {safeTokensInfo.projectTokenInfo.symbol} tokens.
										</p>
									</div>
									<div className="flex gap-3">
										<Info size={18} className="text-pink-400 shrink-0 mt-0.5" />
										<p className="text-white/80">
											Your staked {safeTokensInfo.vTokenInfo.symbol} tokens will
											earn project tokens instead of their normal yield.
										</p>
									</div>
									<div className="flex gap-3">
										<Info
											size={18}
											className="text-purple-400 shrink-0 mt-0.5"
										/>
										<p className="text-white/80">
											You can unstake at any time with no lock-up period.
										</p>
									</div>
								</div>
							</div>

							<div className="rounded-xl glossy-card p-6">
								<h3 className="text-lg font-medium mb-4">Estimated Returns</h3>
								<div className="space-y-4">
									<div className="flex justify-between">
										<span className="text-white/80">Daily</span>
										<span>
											{formatTokenAmount(
												calculateRewards(
													stakeAmount,
													pool.staker_apy.toNumber(),
													365
												),
												{
													symbol: safeTokensInfo.projectTokenInfo.symbol,
													maxDecimals: 6,
												}
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-white/80">Weekly</span>
										<span>
											{formatTokenAmount(
												calculateRewards(
													stakeAmount,
													pool.staker_apy.toNumber(),
													52
												),
												{
													symbol: safeTokensInfo.projectTokenInfo.symbol,
													maxDecimals: 6,
												}
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-white/80">Monthly</span>
										<span>
											{formatTokenAmount(
												calculateRewards(
													stakeAmount,
													pool.staker_apy.toNumber(),
													12
												),
												{
													symbol: safeTokensInfo.projectTokenInfo.symbol,
													maxDecimals: 6,
												}
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-white/80">Yearly</span>
										<span>
											{formatTokenAmount(
												calculateRewards(
													stakeAmount,
													pool.staker_apy.toNumber(),
													1
												),
												{
													symbol: safeTokensInfo.projectTokenInfo.symbol,
													maxDecimals: 6,
												}
											)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Unstake tab */}
				<TabsContent value="unstake" className="mt-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="rounded-xl glossy-card p-6">
							<h3 className="text-lg font-medium mb-4">Unstake Tokens</h3>
							{hasStake ? (
								<div className="space-y-4">
									<div>
										<label className="text-sm text-white/80 block mb-2">
											Amount to Unstake
										</label>
										<div className="relative">
											<input
												type="text"
												value={unstakeAmount}
												onChange={(e) => setUnstakeAmount(e.target.value)}
												placeholder="0.00"
												className="w-full px-4 py-3 pr-20 rounded-xl glossy-input text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
											/>
											<div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
												<button
													onClick={handleSetMaxUnstake}
													className="text-xs text-pink-400 hover:text-pink-300"
												>
													MAX
												</button>
												<span className="text-white/80">
													{safeTokensInfo.vTokenInfo.symbol}
												</span>
											</div>
										</div>
										<div className="flex justify-between mt-2 text-sm">
											<span className="text-white/60">
												Max:{' '}
												{formatTokenAmount(
													formatUnits(
														BigInt(withdrawableVTokens || '0'),
														safeTokensInfo.vTokenInfo.decimals
													),
													{ symbol: safeTokensInfo.vTokenInfo.symbol }
												)}
											</span>
											<span className="text-white/60">
												≈{' '}
												{formatUsdValue(
													formatUnits(
														BigInt(withdrawableVTokens || '0'),
														safeTokensInfo.vTokenInfo.decimals
													)
												)}
											</span>
										</div>
									</div>

									<div className="pt-4 border-t border-white/20 mt-4">
										<div className="flex justify-between mb-2">
											<span className="text-white/80">Unstaking Fee</span>
											<span className="font-medium">
												0.00 {safeTokensInfo.nativeTokenInfo.symbol}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-white/80">You Will Receive</span>
											<span className="font-medium">
												{unstakeAmount
													? formattedPendingRewards
													: `0.00 ${safeTokensInfo.vTokenInfo.symbol}`}
											</span>
										</div>
									</div>

									<button
										className={`w-full mt-4 px-4 py-3 rounded-xl ${
											unstakeAmount &&
											parseFloat(unstakeAmount) > 0 &&
											parseFloat(unstakeAmount) <=
												parseFloat(
													formatUnits(
														BigInt(withdrawableVTokens || '0'),
														safeTokensInfo.vTokenInfo.decimals
													)
												)
												? 'backdrop-blur-xl bg-white/15 border border-white/20 text-white hover:bg-white/20'
												: 'bg-white/15 border border-white/20 text-white/60'
										} font-medium transition`}
										disabled={
											!unstakeAmount ||
											parseFloat(unstakeAmount) <= 0 ||
											parseFloat(unstakeAmount) >
												parseFloat(
													formatUnits(
														BigInt(withdrawableVTokens),
														safeTokensInfo.vTokenInfo.decimals
													)
												)
										}
										onClick={handleUnstake}
									>
										<span className="flex items-center justify-center">
											{unstakeStatus === 'pending' ? (
												<>
													Unstaking...&emsp;
													<Spinner heightWidth={4} />
												</>
											) : unstakeStatus == 'success' &&
											  unstakeConfirmStatus === 'pending' ? (
												<>
													Confirming transaction...&emsp;
													<Spinner heightWidth={4} />
												</>
											) : (
												<>Unstake Now</>
											)}
										</span>
									</button>
								</div>
							) : (
								<div className="text-center py-8">
									<p className="text-white/80 mb-4">
										You don&apos;t have any staked tokens in this pool
									</p>
									<button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition shadow-md shadow-purple-500/30">
										Stake Now
									</button>
								</div>
							)}
						</div>

						<div className="rounded-xl glossy-card p-6">
							<h3 className="text-lg font-medium mb-4">
								Unstaking Information
							</h3>
							<div className="space-y-4 text-sm">
								<div className="flex gap-3">
									<Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
									<p className="text-white/80">
										When you unstake, you&apos;ll withdraw your vTokens from the
										pool and stop earning project tokens.
									</p>
								</div>
								<div className="flex gap-3">
									<Info size={18} className="text-pink-400 shrink-0 mt-0.5" />
									<p className="text-white/80">
										Your vTokens will resume earning their full yield rate after
										unstaking from this pool.
									</p>
								</div>
								<div className="flex gap-3">
									<Info size={18} className="text-purple-400 shrink-0 mt-0.5" />
									<p className="text-white/80">
										There is no unstaking fee for this pool.
									</p>
								</div>
								<div className="flex gap-3">
									<Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
									<p className="text-white/80">
										Unstaking will automatically claim any pending project token
										rewards.
									</p>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="rewards" className="mt-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="rounded-xl glossy-card p-6">
							<h3 className="text-lg font-medium mb-4">Your Rewards</h3>
							{hasStake ? (
								<div className="space-y-6">
									<div className="space-y-4">
										<div className="flex justify-between">
											<span className="text-white/80">Pending Rewards</span>
											<span className="font-bold">
												{formattedPendingRewards}{' '}
												{safeTokensInfo.projectTokenInfo.symbol}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-white/80">Claimed Rewards</span>
											<span>0.00 {safeTokensInfo.projectTokenInfo.symbol}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-white/80">Total Rewards</span>
											<span>
												{formattedPendingRewards}{' '}
												{safeTokensInfo.projectTokenInfo.symbol}
											</span>
										</div>
									</div>

									<button
										className={cn(
											'w-full px-4 py-3 rounded-xl',
											isClaimButtonDisabled
												? 'bg-white/15 border border-white/20 text-white/60'
												: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white',
											'font-medium hover:opacity-90 transition flex items-center justify-center gap-2 shadow-md shadow-purple-500/30'
										)}
										disabled={isClaimButtonDisabled}
										onClick={handleClaimRewards}
									>
										<span className="flex items-center justify-center">
											{claimRewardsStatus === 'pending' ? (
												<>
													Claiming rewards...&emsp;
													<Spinner heightWidth={4} />
												</>
											) : claimRewardsStatus == 'success' &&
											  claimRewardsConfirmStatus === 'pending' ? (
												<>
													Confirming transaction...&emsp;
													<Spinner heightWidth={4} />
												</>
											) : (
												<>
													<Award size={18} />
													Claim Rewards
												</>
											)}
										</span>
									</button>
								</div>
							) : (
								<div className="text-center py-8">
									<p className="text-white/80 mb-4">
										Stake tokens to earn rewards
									</p>
									<button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition shadow-md shadow-purple-500/30">
										Stake Now
									</button>
								</div>
							)}
						</div>

						<div className="rounded-xl glossy-card p-6">
							<h3 className="text-lg font-medium mb-4">Rewards History</h3>
							<div className="text-center py-8">
								<p className="text-white/80 mb-2">No rewards claimed yet</p>
								<button className="px-4 py-2 rounded-lg backdrop-blur-xl bg-white/15 border border-white/20 text-white text-sm hover:bg-white/20 transition">
									View All Transactions
								</button>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			{/* Toast */}
			<ToastContainer />
		</div>
	)
}
