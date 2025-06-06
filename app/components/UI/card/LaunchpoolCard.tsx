'use client'

import {
	EnrichedLaunchpool,
	LaunchpoolStatus,
} from '@/app/types/extended-models/enriched-launchpool'
import { useState, useMemo } from 'react'
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

	/* ---------------------- Main action button click handler ---------------------- */
	const handleActionButttonClick = () => {
		if (!account.isConnected) {
			return
		}
	}

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
				if (stakingInfo.yourShare > 0) {
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
				spread={40} // Controls how far the glow effect spreads
				glow={true} // Enables glow effect
				disabled={false} // Ensures effect is active
				proximity={64} // Controls how close the cursor needs to be
				inactiveZone={0.01} // Defines the inactive zone
				className="absolute inset-0 rounded-2xl"
			/>
			<div className="rounded-xl overflow-hidden relative group">
				{/* Gradient border effect */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-50 rounded-xl" />

				{/* Card content with glassmorphism */}
				<div className="glass-component-1 relative m-[1px] rounded-xl bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl overflow-hidden">
					{/* Top section with logo and APR */}
					<div className="relative p-4">
						<div className="flex justify-between items-start">
							<div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md flex items-center justify-center">
								<Image
									src={'/placeholder.svg'}
									alt={'whatever'}
									width={80}
									height={80}
									className="object-cover"
								/>

								{/* Token pair badge */}
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-md p-1 text-xs text-center font-medium">
									{tokensInfo.vTokenInfo.symbol} →{' '}
									{tokensInfo.projectTokenInfo.symbol}
								</div>
							</div>

							<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-2 text-center min-w-[100px]">
								<div className="text-xs text-gray-300">APR</div>
								<div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
									{launchpool.staker_apy.toFixed(2)}%
								</div>
							</div>
						</div>
					</div>

					{/* Launchpool info */}
					<div className="p-4 pt-0">
						<h3 className="text-xl font-bold mb-2">{name}</h3>
						<p className="text-sm text-gray-400 mb-4 line-clamp-2">
							{description}
						</p>

						{/* Progress bar - only show when wallet is connected */}
						{account.isConnected && (
							<div className="mb-4">
								<div className="flex justify-between text-xs text-gray-400 mb-1">
									<span>Progress</span>
									<span>{timeRemaining} left</span>
								</div>
								<ProgressBar
									index={millisecsRemaining / 1000}
									total={launchpool.durationSeconds}
									overrideClassName={true}
									barClassName="h2 bg-gray-800"
									colorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
								/>
							</div>
						)}

						{/* Stats row */}
						<div className="grid grid-cols-2 gap-2 mb-4">
							<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-2">
								<div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
									<Clock size={12} />
									<span>Duration</span>
								</div>
								<div className="text-sm font-medium">
									{formatTimeDuration(launchpool.durationSeconds * 1000)}
								</div>
							</div>
							<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-2">
								<div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
									<BarChart3 size={12} />
									<span>Total Staked</span>
								</div>
								<div className="text-sm font-medium">
									{formattedTotalVTokenStake}
								</div>
							</div>
						</div>

						{/* User stats - only show when wallet is connected */}
						{account.isConnected && (
							<div className="grid grid-cols-2 gap-2 mb-4">
								<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-2">
									<div className="text-xs text-gray-400 mb-1">Your Stake</div>
									<div className="text-sm font-medium">
										{formattedWithdrawableVTokens}
									</div>
								</div>
								<div
									className={`${stakingInfo.claimableReward > BigInt(0) ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'} backdrop-blur-md rounded-lg p-2 relative`}
								>
									<div className="text-xs text-gray-400 mb-1">Your Rewards</div>
									<div className="text-sm font-medium">
										{formattedClaimableRewards}
									</div>

									{/* Notification badge for available rewards */}
									{showRewardsBadge && (
										<div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-5 h-5 flex items-center justify-center">
											<Check size={12} />
										</div>
									)}
								</div>
							</div>
						)}

						{/* Main action button */}
						<button
							className={`w-full ${buttonConfig.className} rounded-lg p-2.5 font-medium transition-all duration-200 flex items-center justify-center gap-2`}
							onClick={handleActionButttonClick}
						>
							{buttonConfig.icon}
							{buttonConfig.text}
						</button>
					</div>

					{/* Expandable details section */}
					<div
						className="border-t border-gray-800 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5 transition-colors duration-200"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Details</span>
							{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
						</div>
					</div>

					{/* Expanded content */}
					{isExpanded && (
						<div className="p-4 border-t border-gray-800 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-md">
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">Start Date</span>
									<span className="text-sm">May 10, 2025</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">End Date</span>
									<span className="text-sm">June 10, 2025</span>
								</div>
								{account.isConnected && (
									<>
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-400">
												Your Stake (withdrawable vTokens)
											</span>
											<span className="text-sm">
												{formattedWithdrawableVTokens}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-400">Your Share</span>
											<span className="text-sm">{formattedYourShare}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-400">
												Your Rewards
											</span>
											<span className="text-sm">
												{formattedClaimableRewards}
											</span>
										</div>
									</>
								)}
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">Reward Token</span>
									<span className="text-sm">
										{tokensInfo.projectTokenInfo.symbol}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-400">Stake Token</span>
									<span className="text-sm">
										{tokensInfo.vTokenInfo.symbol}
									</span>
								</div>
								{launchpool.status === 'ended' && (
									<div className="mt-4 p-2 bg-amber-500/20 rounded-lg flex items-center gap-2">
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
		</div>
	)
}
