'use client'

import type React from 'react'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { useAccount, useReadContract } from 'wagmi'
import { ethers, formatUnits } from 'ethers'
import { useEffect } from 'react'
import { BaseStakingCard } from './BaseStakingCard'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { abi as launchpoolABI } from '@/abi/Launchpool.json'
import { useStakingStore, LaunchpoolTokenInfo } from '@/app/store/staking'
import {
	useLaunchpoolTokenInfo,
	useLaunchpoolStakingInfo,
	useLaunchpoolNameAndDescription,
} from '@/app/hooks/staking'

interface LaunchpoolStakingCardProps {
	pool: EnrichedLaunchpool
	onSelect: () => void
}

export function LaunchpoolStakingCard({
	pool,
	onSelect,
}: LaunchpoolStakingCardProps) {
	/* ---------------------- Handle detail modal toggle ---------------------- */
	const [expanded, setExpanded] = useState(false)
	const toggleExpand = (e: React.MouseEvent) => {
		e.stopPropagation()
		setExpanded(!expanded)
	}

	/* ---------------------- Access staking store ---------------------- */
	const {
		setTokensInfo,
		setPoolClaimableRewardsFormatted: setUserClaimableRewards,
		stakingInfo,
	} = useStakingStore()
	// let poolStakingInfo = stakingInfo[pool.id as `0x${string}`]

	// Fetch new staking info if not available or outdated
	// if (!poolStakingInfo || Date.now() - poolStakingInfo.updatedAt > 3000) {
	const poolStakingInfo = useLaunchpoolStakingInfo(pool)
	// }

	/* ---------------------- Get staking info from contract ---------------------- */

	// Use the hook for all token info
	const { tokensInfo } = useLaunchpoolTokenInfo(pool)
	const launchpoolTokenInfo = tokensInfo as LaunchpoolTokenInfo

	/* ---------------------- Read from contract ---------------------- */
	const account = useAccount()

	/* ---------------------- Get tokens info from config and chain ---------------------- */
	// Get vToken and native token info from config
	const { data: projectTokenDecimals } = useReadContract({
		address: pool.project_token_address as `0x${string}`,
		abi: [
			{
				name: 'decimals',
				type: 'function',
				inputs: [],
				outputs: [{ type: 'uint8' }],
				stateMutability: 'view',
			},
		],
		functionName: 'decimals',
		query: {
			enabled: !!pool.project_token_address,
		},
	})

	// Get project token symbol if address is available
	const { data: projectTokenSymbol } = useReadContract({
		address: pool.project_token_address as `0x${string}`,
		abi: [
			{
				name: 'symbol',
				type: 'function',
				inputs: [],
				outputs: [{ type: 'string' }],
				stateMutability: 'view',
			},
		],
		functionName: 'symbol',
		query: {
			enabled: !!pool.project_token_address,
		},
	})

	// Update staking store with token info
	useEffect(() => {
		if (
			!pool.id ||
			!pool.project_token_address ||
			!projectTokenSymbol ||
			!projectTokenDecimals
		) {
			return
		}

		// Create token info object for store
		setTokensInfo(pool.id as `0x${string}`, {
			poolType: 'launchpool',
			vTokenInfo: {
				symbol: 'vDOT', // Replace with actual symbol from config
				decimals: 18, // Replace with actual decimals from config
				address: pool.v_asset_address,
			},
			nativeTokenInfo: {
				symbol: 'DOT', // Replace with actual symbol from config
				decimals: 18, // Replace with actual decimals from config
				address: pool.native_asset_address,
			},
			projectTokenInfo: {
				symbol: projectTokenSymbol as string,
				decimals: Number(projectTokenDecimals),
				address: pool.project_token_address,
			},
			rewardTokens: [
				{
					symbol: projectTokenSymbol as string,
					decimals: Number(projectTokenDecimals),
					address: pool.project_token_address,
				},
			],
		})
	}, [
		pool.id,
		pool.project_token_address,
		projectTokenSymbol,
		projectTokenDecimals,
		setTokensInfo,
	])

	const { data: claimableRewards } = useReadContract({
		abi: launchpoolABI,
		address: pool.id as `0x${string}`,
		functionName: 'getClaimableProjectToken',
		args: [account.address],
	})

	// Update StakingStore's user claimable rewards
	useEffect(() => {
		if (claimableRewards && typeof claimableRewards === 'bigint') {
			Number(
				setUserClaimableRewards(
					pool.id,
					Number(
						formatUnits(
							claimableRewards as bigint,
							Number(launchpoolTokenInfo.vTokenInfo?.decimals || 18)
						)
					)
				)
			)
		}
	}, [claimableRewards])

	const hasStake = Boolean(poolStakingInfo.yourNativeStake)

	// For backwards compatibility until all components are updated to use store
	const tokensInfoFromConfig = {
		vTokenInfo: {
			decimals: 18,
			symbol: 'vDOT',
		},
		nativeTokenInfo: {
			decimals: 18,
			symbol: 'DOT',
		},
	}

	/**----------------- Get derived pool name and description ------------------ */
	const { name, description } = useLaunchpoolNameAndDescription(pool)

	return (
		<BaseStakingCard
			hasStake={hasStake}
			image="/placeholders/card-thumbnail-1.png"
			name={name}
			description={description || ''}
			onClick={onSelect}
		>
			<div className="flex justify-between items-center mb-4">
				<div>
					<div className="text-sm text-white/80">APY</div>
					<div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
						{pool.staker_apy.toString()}%
					</div>
				</div>
				<div className="text-right">
					<div className="text-sm text-white/80">Duration</div>
					<div className="text-md font-medium">
						{pool.durationSeconds / 86400} days
					</div>
				</div>
			</div>

			{/* Stake Info */}
			<div className="mb-4">
				<div className="flex justify-between items-center mb-1">
					<div className="text-sm text-white/80">Withdrawable vTokens</div>
					<div className="text-md font-medium">
						{/* @TODO: Improve this */}
						{ethers.formatUnits(
							poolStakingInfo.withdrawableVTokens ?? BigInt(0),
							tokensInfoFromConfig.vTokenInfo.decimals
						)}{' '}
						{tokensInfoFromConfig.vTokenInfo.symbol}
					</div>
				</div>
				<div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
						style={{
							width: poolStakingInfo.yourShare
								? `${poolStakingInfo.yourShare}%`
								: '0%',
						}}
					></div>
				</div>
				<div className="flex justify-between items-center mt-1">
					<div className="text-xs text-white/60">
						Pool Total:{' '}
						{ethers.formatUnits(
							poolStakingInfo.totalVTokenStake ?? 0,
							tokensInfoFromConfig.vTokenInfo.decimals
						)}
					</div>
					<div className="text-xs text-white/60">
						Your Share: {poolStakingInfo.yourShare.toFixed(2)}%
					</div>
				</div>
			</div>

			{/* Expanded Content */}
			{expanded && (
				<div className="mt-4 pt-4 border-t border-white/20">
					<div className="grid grid-cols-2 gap-4 mb-4">
						<div>
							<div className="text-sm text-white/80">Accepted Tokens</div>
							<div className="text-md font-medium">
								{tokensInfoFromConfig.vTokenInfo.symbol}
							</div>
						</div>
						<div>
							<div className="text-sm text-white/80">Status</div>
							<div
								className={cn(
									'text-md font-medium',
									pool.status === 'active' ? 'text-green-400' : 'text-gray-400'
								)}
							>
								{pool.status === 'active' ? 'Active' : 'Ended'}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex gap-2 mt-4">
				<button
					className={cn(
						'flex-1 px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-1',
						hasStake
							? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 shadow-md shadow-purple-500/30'
							: 'backdrop-blur-xl bg-white/15 border border-white/20 text-white hover:bg-white/20'
					)}
				>
					{hasStake ? 'Manage Stake' : 'Stake Now'}
				</button>
				<button
					onClick={toggleExpand}
					className="p-2 rounded-xl backdrop-blur-xl bg-white/15 border border-white/20 hover:bg-white/20 transition-colors"
				>
					{expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
				</button>
			</div>
		</BaseStakingCard>
	)
}
