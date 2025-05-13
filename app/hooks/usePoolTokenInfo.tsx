import { useEffect, useMemo } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
// Import other pool types when available
// import { EnrichedFarm } from '@/app/types/extended-models/enriched-farm'
import { useStakingStore } from '@/app/store/my-staking'
import { getTokenInfoFromConfig } from '@/app/utils/chain'
import { formatTokenAmount } from '@/app/utils/display'
import { formatUnits } from 'ethers'
import {
	PoolTokenInfo,
	LaunchpoolTokenInfo,
	FarmTokenInfo,
} from '@/app/store/my-staking'

// Standard ERC20 ABI fragments we need
const erc20AbiFragment = [
	{
		name: 'symbol',
		type: 'function',
		inputs: [],
		outputs: [{ type: 'string' }],
		stateMutability: 'view',
	},
	{
		name: 'decimals',
		type: 'function',
		inputs: [],
		outputs: [{ type: 'uint8' }],
		stateMutability: 'view',
	},
	{
		name: 'name',
		type: 'function',
		inputs: [],
		outputs: [{ type: 'string' }],
		stateMutability: 'view',
	},
]

/**
 * Hook to get token information for launchpools
 * This handles v_asset, native_asset, and project_token
 */
export function useLaunchpoolTokenInfo(pool: EnrichedLaunchpool) {
	const { tokensInfo, setTokensInfo } = useStakingStore()
	const account = useAccount()

	// Check if we already have token info in the store
	// const existingTokenInfo = tokensInfo[pool.id]
	// const typedTokenInfo =
	// 	existingTokenInfo?.poolType === 'launchpool' ? existingTokenInfo : null

	const typedTokenInfo = tokensInfo[pool.id] as LaunchpoolTokenInfo

	// Get tokens from config that we control
	const vTokenInfo = useMemo(
		() => getTokenInfoFromConfig(pool.chain_id, pool.v_asset_address),
		[pool.chain_id, pool.v_asset_address]
	)

	const nativeTokenInfo = useMemo(
		() => getTokenInfoFromConfig(pool.chain_id, pool.native_asset_address),
		[pool.chain_id, pool.native_asset_address]
	)

	// Project token info from blockchain
	const { data: projectTokenSymbol, isLoading: isLoadingSymbol } =
		useReadContract({
			address: pool.project_token_address as `0x${string}`,
			abi: erc20AbiFragment,
			functionName: 'symbol',
			query: {
				enabled:
					!!pool.project_token_address &&
					!typedTokenInfo?.projectTokenInfo?.symbol,
			},
		})

	const { data: projectTokenDecimals, isLoading: isLoadingDecimals } =
		useReadContract({
			address: pool.project_token_address as `0x${string}`,
			abi: erc20AbiFragment,
			functionName: 'decimals',
			query: {
				enabled:
					!!pool.project_token_address &&
					!typedTokenInfo?.projectTokenInfo?.decimals,
			},
		})

	// Handle claimable rewards from contract - with proper account address
	const { data: claimableRewards, isLoading: isLoadingRewards } =
		useReadContract({
			address: pool.id as `0x${string}`,
			abi: [
				{
					name: 'getClaimableProjectToken',
					type: 'function',
					inputs: [{ type: 'address' }],
					outputs: [{ type: 'uint256' }],
					stateMutability: 'view',
				},
			],
			functionName: 'getClaimableProjectToken',
			args: [account.address ?? '0x'],
			query: {
				enabled: !!account.address && !!pool.id,
			},
		})

	// Update the store with fetched token info
	useEffect(() => {
		// Only update if we have necessary info and it's not already in the store
		if (
			!pool.id ||
			!pool.project_token_address ||
			!projectTokenSymbol ||
			projectTokenDecimals === undefined ||
			typedTokenInfo?.projectTokenInfo?.symbol === projectTokenSymbol
		) {
			return
		}

		setTokensInfo(pool.id, {
			poolType: 'launchpool',
			vTokenInfo: {
				symbol: vTokenInfo?.symbol || 'vToken',
				decimals: vTokenInfo?.decimals || 18,
				address: pool.v_asset_address,
				name: vTokenInfo?.name,
			},
			nativeTokenInfo: {
				symbol: nativeTokenInfo?.symbol || 'Native',
				decimals: nativeTokenInfo?.decimals || 18,
				address: pool.native_asset_address,
				name: nativeTokenInfo?.name,
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
		vTokenInfo,
		nativeTokenInfo,
		typedTokenInfo?.projectTokenInfo?.symbol,
	])

	// Update rewards in the store when they change
	useEffect(() => {
		if (claimableRewards && typeof claimableRewards === 'bigint' && pool.id) {
			const projectTokenDecimals =
				typedTokenInfo?.projectTokenInfo?.decimals || 18
			const formattedAmount = Number(
				formatUnits(claimableRewards, projectTokenDecimals)
			)

			useStakingStore
				.getState()
				.setPoolClaimableRewardsFormatted(pool.id, formattedAmount)
		}
	}, [claimableRewards, pool.id, typedTokenInfo?.projectTokenInfo?.decimals])

	// Calculate and format rewards for display
	const formattedRewards = useMemo(() => {
		if (!claimableRewards || !pool.id) return '0.00'

		const projectTokenInfo = typedTokenInfo?.projectTokenInfo
		if (!projectTokenInfo) return '0.00'

		return formatTokenAmount(
			formatUnits(claimableRewards as bigint, projectTokenInfo.decimals),
			{
				symbol: projectTokenInfo.symbol,
				maxDecimals: 6,
				maxChars: 10,
			}
		)
	}, [claimableRewards, pool.id, typedTokenInfo?.projectTokenInfo])

	return {
		isLoading: isLoadingSymbol || isLoadingDecimals || isLoadingRewards,
		tokensInfo: typedTokenInfo || {
			poolType: 'launchpool',
			vTokenInfo: {
				symbol: vTokenInfo?.symbol || 'vToken',
				decimals: vTokenInfo?.decimals || 18,
				address: pool.v_asset_address,
			},
			nativeTokenInfo: {
				symbol: nativeTokenInfo?.symbol || 'Native',
				decimals: nativeTokenInfo?.decimals || 18,
				address: pool.native_asset_address,
			},
			projectTokenInfo: {
				symbol: (projectTokenSymbol as string) || 'PROJECT',
				decimals: Number(projectTokenDecimals) || 18,
				address: pool.project_token_address,
			},
			rewardTokens: [
				{
					symbol: (projectTokenSymbol as string) || 'PROJECT',
					decimals: Number(projectTokenDecimals) || 18,
					address: pool.project_token_address,
				},
			],
		},
		rewards: {
			claimable: claimableRewards as bigint | undefined,
			formatted: formattedRewards,
		},
	}
}

/**
 * Generic factory function to select the right token info hook based on pool type
 */
// export function usePoolTokenInfo(pool: EnrichedLaunchpool | null) {
// 	if (!pool)
// 		return {
// 			isLoading: false,
// 			tokensInfo: null,
// 			rewards: { claimable: undefined, formatted: '0.00' },
// 		}

// 	// Dispatch to specific pool type handler
// 	switch (pool.type) {
// 		case 'launchpool':
// 			return useLaunchpoolTokenInfo(pool)
// 		// Add other pool types here as they become available
// 		// case 'farm':
// 		//   return useFarmTokenInfo(pool as EnrichedFarm)
// 		default:
// 			console.warn(`Unknown pool type: ${pool.type}`)
// 			return {
// 				isLoading: false,
// 				tokensInfo: null,
// 				rewards: { claimable: undefined, formatted: '0.00' },
// 			}
// 	}
// }
