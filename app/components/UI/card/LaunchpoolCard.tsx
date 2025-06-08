'use client'

import {
	EnrichedLaunchpool,
	LaunchpoolStatus,
} from '@/app/types/extended-models/enriched-launchpool'
import { useState, useMemo, useCallback } from 'react'
import { useAccount } from 'wagmi'
import {
	ChevronDown,
	ChevronUp,
	BarChart3,
	Clock,
	Wallet,
	Award,
	Plus,
	ArrowRight,
	Check,
	AlertCircle,
} from 'lucide-react'
import { useStakingStore } from '@/app/store/staking'
import { useLaunchpoolTokenInfo } from '@/app/hooks/staking/useTokenInfo'
import { PoolsTab } from '../../project-detail-sections/ContentTab'
import { formatTimeDuration, formatTokenAmount } from '@/app/utils/display'
import { useLaunchpoolNameAndDescription } from '@/app/hooks/staking/usePoolNameAndDescription'
import { useLaunchpoolStakingInfo } from '@/app/hooks/staking'
import { GlowingEffect } from '../effect/GlowingEffect'
import Image from 'next/image'
import ProgressBar from '../project-progress/ProgressBar'
import { isAddress } from 'ethers'
import {
	StakingModal,
	ManageStakeModal,
	ClaimRewardModal,
	WithdrawModal,
} from '../modal/launchpool-service-modals'
import { Address } from 'viem'

// interface LaunchpoolCardProps {
// 	projectName: string
// 	tokenPair: {
// 		stake: string
// 		reward: string
// 	}
// 	apr: number
// 	description: string
// 	duration: string
// 	totalStaked: string
// 	yourStake: string
// 	yourRewards?: string
// 	logo: string
// 	state: PoolState
// 	account.isConnected: boolean
// 	onStake: () => void
// 	timeRemaining: string
// 	progress: number
// 	yourShare?: string
// }

interface LaunchpoolCardProps {
	launchpool: EnrichedLaunchpool
}

export function LaunchpoolCard({ launchpool }: LaunchpoolCardProps) {
	// projectName,
	// tokenPair,
	// apr,
	// description,
	// duration,
	// totalStaked,
	// yourStake,
	// yourRewards = '0',
	// logo,
	// state,
	// account.isConnected,
	// onStake,
	// timeRemaining,
	// progress,
	// yourShare = '0%',
	// }: LaunchpoolCardProps) {
	const [isExpanded, setIsExpanded] = useState(false)

	/* ---------------------- Wallet connection state ---------------------- */
	const account = useAccount()

	/* ---------------------- Launchpool token info ---------------------- */
	const { tokensInfo } = useLaunchpoolTokenInfo(launchpool)

	/* ---------------------- Calculate remaining time ---------------------- */
	const millisecsRemaining = Math.min(
		(launchpool.end_date.getTime() - Date.now()) / 1000,
		0
	)
	const timeRemaining = formatTimeDuration(millisecsRemaining)

	/* ---------------------- Use launchpool name and description ---------------------- */
	const { name, description } = useLaunchpoolNameAndDescription(launchpool)

	/* ---------------------- Use staking info ---------------------- */
	const stakingInfo = useLaunchpoolStakingInfo(launchpool)

	/* ---------------------- Modal states ---------------------- */
	type ActiveModal = 'stake' | 'manageStake' | 'withdraw' | 'claimReward' | null
	const [activeModal, setActiveModal] = useState<ActiveModal>(null)

	/* ---------------------- Modal handlers ---------------------- */
	const handleOpenModal = useCallback((modalType: ActiveModal) => {
		setActiveModal(modalType)
	}, [])

	const handleCloseModal = useCallback(() => {
		setActiveModal(null)
	}, [])

	/* ---------------------- Main action button click handler ---------------------- */
	const handleActionButtonClick = useCallback(() => {
		if (!account.isConnected) {
			return
		}

		switch (launchpool.status) {
			case 'upcoming':
				return

			case 'active':
				if (stakingInfo.claimableReward > BigInt(0)) {
					handleOpenModal('claimReward')
				} else if (stakingInfo.yourShare > 0) {
					handleOpenModal('manageStake')
				} else {
					handleOpenModal('stake')
				}
				break

			case 'ended':
				handleOpenModal('withdraw')
				break

			default:
				handleOpenModal('stake')
				break
		}
	}, [
		account.isConnected,
		launchpool.status,
		stakingInfo.claimableReward,
		stakingInfo.yourShare,
		handleOpenModal,
	])

	/* ---------------------- Card body click handler ---------------------- */
	const handleCardBodyClick = useCallback(() => {
		if (!account.isConnected) {
			return
		}

		// Only open manage stake modal if user has stake in the pool
		if (
			stakingInfo.withdrawableVTokens &&
			stakingInfo.withdrawableVTokens > BigInt(0)
		) {
			handleOpenModal('manageStake')
		}
	}, [account.isConnected, stakingInfo.withdrawableVTokens, handleOpenModal])

	/* ---------------------- Formatted values ---------------------- */
	const formattedTotalVTokenStake = useMemo(() => {
		return formatTokenAmount(stakingInfo.totalVTokenStake, {
			decimals: tokensInfo.vTokenInfo.decimals,
			symbol: tokensInfo.vTokenInfo.symbol,
		})
	}, [
		stakingInfo.totalVTokenStake,
		tokensInfo.vTokenInfo.decimals,
		tokensInfo.vTokenInfo.symbol,
	])

	const formattedYourNativeStake = useMemo(() => {
		return formatTokenAmount(stakingInfo.yourNativeStake, {
			decimals: tokensInfo.nativeTokenInfo.decimals,
			symbol: tokensInfo.nativeTokenInfo.symbol,
		})
	}, [
		stakingInfo.yourNativeStake,
		tokensInfo.nativeTokenInfo.decimals,
		tokensInfo.nativeTokenInfo.symbol,
	])

	const formattedWithdrawableVTokens = useMemo(() => {
		if (
			!stakingInfo.withdrawableVTokens ||
			stakingInfo.withdrawableVTokens === BigInt(0)
		) {
			return `0.00 ${tokensInfo.vTokenInfo.symbol}`
		}
		return formatTokenAmount(stakingInfo.withdrawableVTokens, {
			decimals: tokensInfo.vTokenInfo.decimals,
			symbol: tokensInfo.vTokenInfo.symbol,
		})
	}, [
		stakingInfo.withdrawableVTokens,
		tokensInfo.vTokenInfo.decimals,
		tokensInfo.vTokenInfo.symbol,
	])
	const formattedClaimableRewards = useMemo(() => {
		return formatTokenAmount(stakingInfo.claimableReward, {
			decimals: tokensInfo.projectTokenInfo.decimals,
			symbol: tokensInfo.projectTokenInfo.symbol,
		})
	}, [stakingInfo.claimableReward])

	const formattedYourShare = useMemo(() => {
		return `${stakingInfo.yourShare.toFixed(2)}%`
	}, [stakingInfo.yourShare])

	const formattedValues = useMemo(
		() => ({
			totalVTokenStake: formattedTotalVTokenStake,
			withdrawableVTokens: formattedWithdrawableVTokens,
			claimableRewards: formattedClaimableRewards,
			yourShare: formattedYourShare,
		}),
		[
			formattedTotalVTokenStake,
			formattedWithdrawableVTokens,
			formattedClaimableRewards,
			formattedYourShare,
		]
	)

	const formattedDates = useMemo(
		() => ({
			startDate: launchpool.start_date.toLocaleDateString(),
			endDate: launchpool.end_date.toLocaleDateString(),
		}),
		[launchpool.start_date, launchpool.end_date]
	)

	// Determine button text and style based on state
	const getButtonConfig = () => {
		if (!account.isConnected) {
			return {
				text: 'Connect Wallet',
				icon: <Wallet size={16} />,
				className:
					'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
			}
		}

		switch (launchpool.status) {
			case 'upcoming':
				return {
					text: 'Opening Soon',
					icon: <Clock size={16} />,
					className:
						'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 cursor-not-allowed',
				}
			case 'active':
				if (stakingInfo.claimableReward > BigInt(0)) {
					return {
						text: 'Claim Rewards',
						icon: <Award size={16} />,
						className:
							'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
					}
				} else if (stakingInfo.yourShare > 0) {
					return {
						text: 'Manage Stake',
						icon: <ArrowRight size={16} />,
						className:
							'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
					}
				} else {
					return {
						text: 'Stake Now',
						icon: <Plus size={16} />,
						className:
							'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
					}
				}
			// return {
			// 	text: 'Claim Rewards',
			// 	icon: <Award size={16} />,
			// 	className:
			// 		'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
			// }
			case 'ended':
				return {
					text: 'Withdraw All',
					icon: <ArrowRight size={16} />,
					className:
						'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
				}
			default:
				return {
					text: 'Stake Now',
					icon: <Plus size={16} />,
					className:
						'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
				}
		}
	}

	const buttonConfig = getButtonConfig()

	// Determine if we should show the rewards notification badge
	const showRewardsBadge =
		account.isConnected && stakingInfo.claimableReward > BigInt(0)

	return (
		<div className="relative">
			{/* Apply Border GlowingEffect */}
			<GlowingEffect
				spread={40}
				glow={true}
				disabled={false}
				proximity={64}
				inactiveZone={0.01}
				className="absolute inset-0 rounded-2xl"
			/>
			<div className="rounded-xl overflow-hidden relative group">
				{/* Card content with glassmorphism */}
				<div className="glass-component-1 relative m-[1px] rounded-xl bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-800/95 hover:to-black/95 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
					{/* Top section with logo and APR */}
					<div
						className="relative p-4 cursor-pointer transition-all duration-300"
						onClick={handleCardBodyClick}
					>
						<div className="flex justify-between items-start">
							<div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:from-blue-500/30 group-hover:to-purple-500/30">
								<Image
									src={tokensInfo.vTokenInfo.icon || ''}
									alt={'Token image'}
									width={80}
									height={80}
									className="object-cover transition-transform duration-300 group-hover:scale-110"
								/>

								{/* Token pair badge */}
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-md p-1 text-xs text-center font-medium transition-all duration-300 group-hover:from-blue-600/90 group-hover:to-purple-600/90">
									{tokensInfo.vTokenInfo.symbol} →{' '}
									{tokensInfo.projectTokenInfo.symbol}
								</div>
							</div>

							<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-2 text-center min-w-[100px] transition-all duration-300 group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:scale-105">
								<div className="text-xs text-gray-300">APR</div>
								<div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-300 group-hover:to-pink-400">
									{launchpool.staker_apy.toFixed(2)}%
								</div>
							</div>
						</div>
					</div>

					{/* Launchpool info */}
					<div
						className="p-4 pt-0 cursor-pointer transition-all duration-300"
						onClick={handleCardBodyClick}
					>
						<h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-white">
							{name}
						</h3>
						<p className="text-sm text-gray-400 mb-4 line-clamp-2 transition-colors duration-300 group-hover:text-gray-300">
							{description}
						</p>

						{/* Progress bar - only show when wallet is connected */}
						{account.isConnected && (
							<div className="mb-4">
								<div className="flex justify-between text-xs text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
									<span>Progress</span>
									<span>{timeRemaining} left</span>
								</div>
								<ProgressBar
									index={millisecsRemaining / 1000}
									total={launchpool.durationSeconds}
									overrideClassName={true}
									barClassName="h2 bg-gray-800 transition-colors duration-300 group-hover:bg-gray-700"
									colorClassName="bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:from-blue-400 group-hover:to-purple-400"
								/>
							</div>
						)}

						{/* Stats row */}
						<div className="grid grid-cols-2 gap-2 mb-4">
							<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-2 transition-all duration-300 group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:scale-105">
								<div className="flex items-center gap-1 text-xs text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
									<Clock size={12} />
									<span>Duration</span>
								</div>
								<div className="text-sm font-medium transition-colors duration-300 group-hover:text-white">
									{formatTimeDuration(launchpool.durationSeconds * 1000)}
								</div>
							</div>
							<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-2 transition-all duration-300 group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:scale-105">
								<div className="flex items-center gap-1 text-xs text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
									<BarChart3 size={12} />
									<span>Total Staked</span>
								</div>
								<div className="text-sm font-medium transition-colors duration-300 group-hover:text-white">
									{formattedTotalVTokenStake}
								</div>
							</div>
						</div>

						{/* User stats - only show when wallet is connected */}
						{account.isConnected && (
							<div className="grid grid-cols-2 gap-2 mb-4">
								<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-2 transition-all duration-300 group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:scale-105">
									<div className="text-xs text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
										Your Stake
									</div>
									<div className="text-sm font-medium transition-colors duration-300 group-hover:text-white">
										{formattedWithdrawableVTokens}
									</div>
								</div>
								<div
									className={`${stakingInfo.claimableReward > BigInt(0) ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30' : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20'} backdrop-blur-md rounded-lg p-2 relative transition-all duration-300 group-hover:scale-105`}
								>
									<div className="text-xs text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
										Your Rewards
									</div>
									<div className="text-sm font-medium transition-colors duration-300 group-hover:text-white">
										{formattedClaimableRewards}
									</div>

									{/* Notification badge for available rewards */}
									{showRewardsBadge && (
										<div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-500/50">
											<Check size={12} />
										</div>
									)}
								</div>
							</div>
						)}

						{/* Main action button */}
						<button
							className={`w-full ${buttonConfig.className} rounded-lg p-2.5 font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95`}
							onClick={(e) => {
								e.stopPropagation() // Prevent card body click when button is clicked
								handleActionButtonClick()
							}}
						>
							{buttonConfig.icon}
							{buttonConfig.text}
						</button>
					</div>

					{/* Expandable details section */}
					<div
						className="border-t border-gray-800 p-4 cursor-pointer transition-all duration-200 group-hover:border-gray-700"
						onClick={(e) => {
							e.stopPropagation() // Prevent card body click when expanding details
							setIsExpanded(!isExpanded)
						}}
					>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium transition-colors duration-300 group-hover:text-white">
								Details
							</span>
							<div className="transition-transform duration-300 group-hover:scale-110">
								{isExpanded ? (
									<ChevronUp size={16} />
								) : (
									<ChevronDown size={16} />
								)}
							</div>
						</div>
					</div>

					{/* Expanded content */}
					{isExpanded && (
						<div className="p-4 border-t border-gray-800 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-md transition-all duration-300 group-hover:from-blue-900/20 group-hover:to-purple-900/20 group-hover:border-gray-700">
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
										Start Date
									</span>
									<span className="text-sm transition-colors duration-300 group-hover:text-white">
										{formattedDates.startDate}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
										End Date
									</span>
									<span className="text-sm transition-colors duration-300 group-hover:text-white">
										{formattedDates.endDate}
									</span>
								</div>
								{account.isConnected && (
									<>
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
												Your Share
											</span>
											<span className="text-sm transition-colors duration-300 group-hover:text-white">
												{formattedValues.yourShare}
											</span>
										</div>
									</>
								)}
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
										Reward Token
									</span>
									<span className="text-sm transition-colors duration-300 group-hover:text-white">
										{tokensInfo.projectTokenInfo.symbol}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
										Stake Token
									</span>
									<span className="text-sm transition-colors duration-300 group-hover:text-white">
										{tokensInfo.vTokenInfo.symbol}
									</span>
								</div>
								{launchpool.status === 'ended' && (
									<div className="mt-4 p-2 bg-amber-500/20 rounded-lg flex items-center gap-2 transition-all duration-300 group-hover:bg-amber-500/30">
										<AlertCircle size={16} className="text-amber-400" />
										<span className="text-sm text-amber-400">
											This pool has ended. Withdraw your stake and rewards.
										</span>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Show cursor pointer hint when user has stake */}
			{account.isConnected &&
				stakingInfo.withdrawableVTokens &&
				stakingInfo.withdrawableVTokens > BigInt(0) && (
					<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white text-xs px-2 py-1 rounded-md pointer-events-none z-10">
						Click to manage stake
					</div>
				)}

			{/* Render modals conditionally */}
			{activeModal === 'stake' && (
				<StakingModal
					open={true}
					onClose={handleCloseModal}
					tokenPair={{
						stake: tokensInfo.vTokenInfo,
						reward: tokensInfo.projectTokenInfo,
					}}
					apr={launchpool.staker_apy.toNumber()}
					balance="1,250 vDOT"
					projectName={name}
					poolAddress={launchpool.id}
				/>
			)}

			{activeModal === 'manageStake' && (
				<ManageStakeModal
					open={true}
					onClose={handleCloseModal}
					tokenPair={{
						stake: tokensInfo.vTokenInfo,
						reward: tokensInfo.projectTokenInfo,
					}}
					apr={launchpool.staker_apy.toNumber()}
					staked={formattedValues.withdrawableVTokens}
					rewards={formattedValues.claimableRewards}
					balance="750 vKSM"
					projectName={name}
					poolAddress={launchpool.id}
					withdrawableVTokens={stakingInfo.withdrawableVTokens || BigInt(0)}
				/>
			)}

			{activeModal === 'claimReward' && (
				<ClaimRewardModal
					open={true}
					onClose={handleCloseModal}
					tokenPair={{
						stake: tokensInfo.vTokenInfo,
						reward: tokensInfo.projectTokenInfo,
					}}
					staked={formattedValues.withdrawableVTokens}
					rewards={formattedValues.claimableRewards}
					projectName={name}
					poolAddress={launchpool.id}
				/>
			)}

			{activeModal === 'withdraw' && (
				<WithdrawModal
					open={true}
					onClose={handleCloseModal}
					tokenPair={{
						stake: tokensInfo.vTokenInfo,
						reward: tokensInfo.projectTokenInfo,
					}}
					staked={formattedValues.withdrawableVTokens}
					rewards={formattedValues.claimableRewards}
					projectName={name}
					poolAddress={launchpool.id}
					withdrawableVTokens={stakingInfo.withdrawableVTokens || BigInt(0)}
				/>
			)}
		</div>
	)
}
