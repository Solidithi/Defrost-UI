'use client'

import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
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
import { useLaunchpoolTokenInfo } from '@/app/hooks/staking/useTokenInfo'
import { formatTimeDuration, formatTokenAmount } from '@/app/utils/display'
import { Address } from 'viem'
import { normalizeAddress } from '@/app/utils/address'
import { useLaunchpoolNameAndDescription } from '@/app/hooks/staking/usePoolNameAndDescription'
import { useLaunchpoolStakingInfo } from '@/app/hooks/staking'
import {
	StakingModal,
	ManageStakeModal,
	ClaimRewardModal,
	WithdrawModal,
	ClaimOwnerInterestModal,
} from '../modal/launchpool-service-modals'
import { getFunctionAbiFromIface } from '@/app/utils/abi'
import { Launchpool__factory } from '@/app/types/typechain'
import Image from 'next/image'

interface LaunchpoolCardProps {
	launchpool: EnrichedLaunchpool
}

export function LaunchpoolCard({ launchpool }: LaunchpoolCardProps) {
	const [isExpanded, setIsExpanded] = useState(false)

	/* ---------------------- Wallet connection state ---------------------- */
	const account = useAccount()

	/* ---------------------- Launchpool token info ---------------------- */
	const { tokensInfo } = useLaunchpoolTokenInfo(launchpool)

	/* ---------------------- Calculate remaining time ---------------------- */
	const launchpoolRemainingTime = useMemo(() => {
		const inMiliseconds = Math.max(
			launchpool.end_date.getTime() - Date.now(),
			0
		)
		return {
			inMiliseconds: inMiliseconds,
			inNaturalLanguage: formatTimeDuration(inMiliseconds),
		}
	}, [launchpool.end_date])

	/* ---------------------- Use launchpool name and description ---------------------- */
	const { name, description } = useLaunchpoolNameAndDescription(launchpool)

	/* ---------------------- Use staking info ---------------------- */
	const stakingInfo = useLaunchpoolStakingInfo(launchpool)

	/* ---------------------- Check if current user is project owner ---------------------- */
	const isProjectOwner = useMemo(() => {
		if (!account.address || !launchpool.project?.owner_id) {
			return false
		}

		return (
			normalizeAddress(account.address) ===
			normalizeAddress(launchpool.project.owner_id as Address)
		)
	}, [account.address, launchpool.project?.owner_id])

	/* ---------------------- Read project owner's claimable interests ---------------------- */
	const { data: ownerInterestAndPlatformFee } = useReadContract({
		abi: getFunctionAbiFromIface(
			Launchpool__factory,
			'getPlatformAndOwnerClaimableVAssets'
		),
		address: launchpool.id as Address,
		functionName: 'getPlatformAndOwnerClaimableVAssets',
		query: {
			enabled: !!launchpool.id && isProjectOwner,
		},
	})

	/* ---------------------- Modal states ---------------------- */
	type ActiveModal =
		| 'stake'
		| 'manageStake'
		| 'withdraw'
		| 'claimReward'
		| 'claimInterest'
		| null
	const [activeModal, setActiveModal] = useState<ActiveModal>(null)

	/* ---------------------- Modal handlers ---------------------- */
	const handleOpenModal = useCallback((modalType: ActiveModal) => {
		setActiveModal(modalType)
	}, [])

	const handleCloseModal = useCallback(() => {
		setActiveModal(null)
	}, [])

	/* ---------------------- Main action button click handler ---------------------- */
	const { open: openWalletModal, close: closeWalletModal } = useAppKit()
	const handleActionButtonClick = useCallback(() => {
		if (!account.isConnected) {
			openWalletModal()
			return
		}

		switch (launchpool.status) {
			case 'upcoming':
				return

			case 'active':
				if (isProjectOwner) {
					handleOpenModal('claimInterest')
				} else if (stakingInfo.claimableReward > BigInt(0)) {
					handleOpenModal('claimReward')
				} else if (stakingInfo.yourShare > 0) {
					handleOpenModal('manageStake')
				} else {
					handleOpenModal('stake')
				}
				break

			case 'ended':
				if (isProjectOwner) {
					handleOpenModal('claimInterest')
				} else {
					handleOpenModal('withdraw')
				}
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
		isProjectOwner,
		handleOpenModal,
	])

	/* ---------------------- Card body click handler ---------------------- */
	const handleCardBodyClick = useCallback(() => {
		if (!account.isConnected) {
			return
		}

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

	// Subtle button configurations with muted gradients
	const getButtonConfig = () => {
		if (!account.isConnected) {
			return {
				text: 'Connect Wallet',
				icon: <Wallet size={16} />,
				className:
					'bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 shadow-lg shadow-slate-700/20 hover:shadow-slate-600/30 backdrop-blur-md border border-slate-500/30',
			}
		}

		switch (launchpool.status) {
			case 'upcoming':
				return {
					text: 'Opening Soon',
					icon: <Clock size={16} />,
					className:
						'bg-gradient-to-r from-slate-600/60 to-slate-700/60 cursor-not-allowed opacity-60 backdrop-blur-md border border-slate-500/20',
				}
			case 'active':
				if (isProjectOwner) {
					return {
						text: 'Claim Interests',
						icon: <Award size={16} />,
						className:
							'bg-gradient-to-r from-amber-600/70 to-orange-600/70 hover:from-amber-600/80 hover:to-orange-600/80 shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 backdrop-blur-md border border-amber-500/30',
					}
				} else if (stakingInfo.claimableReward > BigInt(0)) {
					return {
						text: 'Claim Rewards',
						icon: <Award size={16} />,
						className:
							'bg-gradient-to-r from-emerald-600/70 to-green-600/70 hover:from-emerald-600/80 hover:to-green-600/80 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 backdrop-blur-md border border-emerald-500/30',
					}
				} else if (stakingInfo.yourShare > 0) {
					return {
						text: 'Manage Stake',
						icon: <ArrowRight size={16} />,
						className:
							'bg-gradient-to-r from-blue-600/70 to-purple-600/70 hover:from-blue-600/80 hover:to-purple-600/80 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 backdrop-blur-md border border-blue-500/30',
					}
				} else {
					return {
						text: 'Stake Now',
						icon: <Plus size={16} />,
						className:
							'bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 shadow-lg shadow-slate-700/20 hover:shadow-slate-600/30 backdrop-blur-md border border-slate-500/30',
					}
				}
			case 'ended':
				if (isProjectOwner) {
					return {
						text: 'Claim Interest',
						icon: <Award size={16} />,
						className:
							'bg-gradient-to-r from-amber-600/70 to-orange-600/70 hover:from-amber-600/80 hover:to-orange-600/80 shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 backdrop-blur-md border border-amber-500/30',
					}
				} else {
					return {
						text: 'Withdraw All',
						icon: <ArrowRight size={16} />,
						className:
							'bg-gradient-to-r from-amber-600/70 to-orange-600/70 hover:from-amber-600/80 hover:to-orange-600/80 shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 backdrop-blur-md border border-amber-500/30',
					}
				}
			default:
				return {
					text: 'Stake Now',
					icon: <Plus size={16} />,
					className:
						'bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 shadow-lg shadow-slate-700/20 hover:shadow-slate-600/30 backdrop-blur-md border border-slate-500/30',
				}
		}
	}

	const buttonConfig = getButtonConfig()

	// Determine if we should show the rewards notification badge
	const showRewardsBadge =
		account.isConnected && stakingInfo.claimableReward > BigInt(0)

	return (
		<div className="relative group">
			{/* Enhanced purple-blue hover glow effect */}
			<div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-500/15 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-60 transition-all duration-500 blur-lg" />
			<div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/12 via-blue-400/15 to-purple-400/12 rounded-2xl opacity-0 group-hover:opacity-40 transition-all duration-400 blur-md" />

			{/* Main card container with professional purple-blue transparency */}
			<div className="relative bg-gradient-to-br from-purple-950/25 via-blue-950/30 to-slate-950/25 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-purple-400/35 group-hover:shadow-2xl group-hover:shadow-purple-900/40 group-hover:scale-[1.005] group-hover:bg-gradient-to-br group-hover:from-purple-950/35 group-hover:via-blue-950/40 group-hover:to-slate-950/35">
				{/* Enhanced status indicators with purple-blue theme */}
				{launchpool.status === 'active' && (
					<div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-400/40 rounded-full px-3 py-1.5 flex items-center gap-2 backdrop-blur-xl z-10">
						<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
						<span className="text-emerald-300 font-medium text-sm">Active</span>
					</div>
				)}
				{launchpool.status === 'ended' && (
					<div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-400/40 rounded-full px-3 py-1.5 flex items-center gap-2 backdrop-blur-xl z-10">
						<div className="w-2 h-2 bg-amber-400 rounded-full"></div>
						<span className="text-amber-300 font-medium text-sm">Ended</span>
					</div>
				)}
				{launchpool.status === 'upcoming' && (
					<div className="absolute top-4 right-4 bg-blue-500/20 border border-blue-400/40 rounded-full px-3 py-1.5 flex items-center gap-2 backdrop-blur-xl z-10">
						<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
						<span className="text-blue-300 font-medium text-sm">Soon</span>
					</div>
				)}

				{/* Token and APY section */}
				<div
					className="relative p-6 cursor-pointer transition-all duration-300"
					onClick={handleCardBodyClick}
				>
					<div className="flex justify-between items-start">
						<div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-800/25 to-blue-800/20 backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:from-purple-700/35 group-hover:to-blue-700/30 border border-purple-500/25 group-hover:border-purple-400/40 group-hover:scale-105">
							<Image
								src={tokensInfo.vTokenInfo.icon || ''}
								alt={'Token image'}
								width={80}
								height={80}
								className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
							/>

							{/* Enhanced token pair badge */}
							<div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-800/90 to-blue-800/85 rounded-md px-2 py-1 text-xs font-medium text-slate-200 shadow-lg backdrop-blur-xl border border-purple-500/30">
								{tokensInfo.vTokenInfo.symbol} →{' '}
								{tokensInfo.projectTokenInfo.symbol}
							</div>
						</div>

						<div className="bg-gradient-to-br from-purple-800/25 to-blue-800/20 backdrop-blur-xl rounded-xl p-4 text-center min-w-[110px] border border-purple-500/25 group-hover:border-purple-400/40 transition-all duration-300 group-hover:scale-105 mt-4">
							<div className="text-sm text-purple-300 font-medium mb-1">
								APY
							</div>
							<div className="text-2xl font-bold text-white group-hover:text-purple-100 transition-all duration-300">
								{launchpool.staker_apy.toFixed(2)}%
							</div>
						</div>
					</div>
				</div>

				{/* Refined Project Owner Badge */}
				{isProjectOwner && (
					<div className="mx-6 mb-4 bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30 rounded-xl p-3 backdrop-blur-lg">
						<div className="flex items-center gap-3">
							<div className="relative">
								<div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
								<div className="absolute inset-0 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-75"></div>
							</div>
							<div>
								<span className="text-amber-300 font-semibold text-sm">
									Project Owner
								</span>
								<p className="text-amber-300/70 text-xs mt-1">
									You can claim interests from this pool
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Main content */}
				<div
					className="p-6 pt-0 cursor-pointer space-y-4"
					onClick={handleCardBodyClick}
				>
					<div className="space-y-3">
						<h3 className="text-xl font-bold text-white group-hover:text-slate-100 transition-colors duration-300 leading-tight">
							{name}
						</h3>
						<p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
							{description}
						</p>
					</div>

					{/* Refined progress bar */}
					{account.isConnected && (
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-slate-300">
									Pool Progress
								</span>
								<span className="text-sm font-semibold text-slate-400">
									{launchpoolRemainingTime.inNaturalLanguage} remaining
								</span>
							</div>
							<div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
									style={{
										width: `${Math.min(
											100,
											(1 -
												launchpoolRemainingTime.inMiliseconds /
													(launchpool.durationSeconds * 1000)) *
												100
										)}%`,
									}}
								></div>
							</div>
						</div>
					)}

					{/* Enhanced professional stats grid with purple-blue theme */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-gradient-to-br from-purple-800/20 to-blue-800/15 backdrop-blur-xl rounded-xl p-3 border border-purple-500/25 group-hover:border-purple-400/40 transition-all duration-300">
							<div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
								<Clock size={16} />
								<span className="font-medium">Duration</span>
							</div>
							<div className="text-lg font-semibold text-white group-hover:text-purple-100 transition-all duration-300">
								{formatTimeDuration(launchpool.durationSeconds * 1000)}
							</div>
						</div>
						<div className="bg-gradient-to-br from-purple-800/20 to-blue-800/15 backdrop-blur-xl rounded-xl p-3 border border-purple-500/25 group-hover:border-purple-400/40 transition-all duration-300">
							<div className="flex items-center gap-2 text-sm text-blue-300 mb-2">
								<BarChart3 size={16} />
								<span className="font-medium">Total Staked</span>
							</div>
							<div className="text-lg font-semibold text-white group-hover:text-blue-100 transition-all duration-300">
								{formattedTotalVTokenStake}
							</div>
						</div>
					</div>

					{/* Enhanced user stats with purple-blue theme */}
					{account.isConnected && (
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-gradient-to-br from-purple-800/20 to-blue-800/15 backdrop-blur-xl rounded-xl p-3 border border-purple-500/25 group-hover:border-purple-400/40 transition-all duration-300">
								<div className="text-xs text-purple-300 font-medium mb-1">
									Your Stake
								</div>
								<div className="text-sm font-semibold text-white">
									{formattedWithdrawableVTokens}
								</div>
							</div>
							<div
								className={`${
									stakingInfo.claimableReward > BigInt(0)
										? 'bg-gradient-to-br from-emerald-500/15 to-green-500/10 border-emerald-500/35 group-hover:border-emerald-500/45'
										: 'bg-gradient-to-br from-purple-800/20 to-blue-800/15 border-purple-500/25 group-hover:border-purple-400/40'
								} backdrop-blur-xl rounded-xl p-3 border transition-all duration-300 relative`}
							>
								<div className="text-xs text-blue-300 font-medium mb-1">
									Your Rewards
								</div>
								<div className="text-sm font-semibold text-white">
									{formattedClaimableRewards}
								</div>

								{/* Enhanced notification badge for available rewards */}
								{showRewardsBadge && (
									<div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full w-6 h-6 flex items-center justify-center shadow-xl shadow-emerald-400/50 animate-pulse">
										<Check size={14} className="text-white font-bold" />
									</div>
								)}
							</div>
						</div>
					)}

					{/* Enhanced main action button with vibrant colors */}
					<button
						className={`w-full ${buttonConfig.className} rounded-2xl p-4 font-black text-base transition-all duration-500 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-xl tracking-wide`}
						onClick={(e) => {
							e.stopPropagation()
							handleActionButtonClick()
						}}
					>
						{buttonConfig.icon}
						{buttonConfig.text}
					</button>
				</div>

				{/* Enhanced expandable details section with purple-blue theme */}
				<div
					className="border-t border-purple-800/30 p-4 cursor-pointer transition-all duration-300 hover:bg-purple-900/10"
					onClick={(e) => {
						e.stopPropagation()
						setIsExpanded(!isExpanded)
					}}
				>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
							Details
						</span>
						<div className="text-purple-400 transition-transform duration-300">
							{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
						</div>
					</div>
				</div>

				{/* Enhanced expanded content */}
				{isExpanded && (
					<div className="p-4 border-t border-purple-800/30 bg-gradient-to-br from-purple-900/15 to-blue-900/10 backdrop-blur-xl">
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-sm text-purple-300">Start Date</span>
								<span className="text-sm text-slate-200">
									{formattedDates.startDate}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-purple-300">End Date</span>
								<span className="text-sm text-slate-200">
									{formattedDates.endDate}
								</span>
							</div>
							{account.isConnected && (
								<div className="flex justify-between items-center">
									<span className="text-sm text-purple-300">Your Share</span>
									<span className="text-sm text-slate-200">
										{formattedValues.yourShare}
									</span>
								</div>
							)}
							<div className="flex justify-between items-center">
								<span className="text-sm text-blue-300">Reward Token</span>
								<span className="text-sm text-slate-200">
									{tokensInfo.projectTokenInfo.symbol}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-blue-300">Stake Token</span>
								<span className="text-sm text-slate-200">
									{tokensInfo.vTokenInfo.symbol}
								</span>
							</div>
							{launchpool.status === 'ended' && (
								<div className="mt-4 p-3 bg-amber-500/15 border border-amber-500/30 rounded-lg flex items-center gap-2">
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

			{/* Enhanced manage stake tooltip */}
			{account.isConnected &&
				stakingInfo.withdrawableVTokens &&
				stakingInfo.withdrawableVTokens > BigInt(0) && (
					<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-purple-900/95 to-blue-900/95 text-white text-sm px-3 py-2 rounded-xl pointer-events-none z-10 backdrop-blur-lg border border-purple-400/30 shadow-xl shadow-purple-500/30 font-medium">
						Click to manage stake
					</div>
				)}

			{/* Render modals conditionally */}
			{(() => {
				switch (activeModal) {
					case 'stake':
						return (
							<StakingModal
								open={true}
								onClose={handleCloseModal}
								tokenPair={{
									stake: tokensInfo.vTokenInfo,
									reward: tokensInfo.projectTokenInfo,
								}}
								apy={launchpool.staker_apy.toNumber()}
								balance="1,250 vDOT"
								projectName={name}
								poolAddress={launchpool.id}
							/>
						)

					case 'manageStake':
						return (
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
								withdrawableVTokens={
									stakingInfo.withdrawableVTokens || BigInt(0)
								}
							/>
						)

					case 'claimReward':
						return (
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
						)

					case 'withdraw':
						return (
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
								withdrawableVTokens={
									stakingInfo.withdrawableVTokens || BigInt(0)
								}
							/>
						)

					case 'claimInterest':
						return (
							<ClaimOwnerInterestModal
								open={true}
								onClose={handleCloseModal}
								tokenPair={{
									stake: tokensInfo.vTokenInfo,
									reward: tokensInfo.projectTokenInfo,
								}}
								totalStaked={formattedValues.totalVTokenStake}
								claimableInterests={
									(ownerInterestAndPlatformFee as bigint[])?.[0] || BigInt(0)
								}
								projectName={name}
								poolAddress={launchpool.id}
							/>
						)

					default:
						return null
				}
			})()}
		</div>
	)
}
