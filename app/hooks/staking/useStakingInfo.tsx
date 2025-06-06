'use client'

import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { useAccount, useReadContract } from 'wagmi'
import { useMemo } from 'react'
import { abi as launchpoolABI } from '@/abi/Launchpool.json'
import { useStakingStore } from '@/app/store/staking'

const REFRESH_INTERVAL_MS = 6000

export function useLaunchpoolStakingInfo(pool: EnrichedLaunchpool) {
	// Always call hooks at the top level
	const { address } = useAccount()

	// Contract reads with Wagmi's built-in caching
	const { data: yourNativeStake, status: readYourNativeStakeStatus } =
		useReadContract({
			abi: launchpoolABI,
			address: pool?.id as `0x${string}`,
			functionName: 'getStakerNativeAmount',
			args: [address],
			query: {
				enabled: !!address && !!pool?.id,
				refetchInterval: REFRESH_INTERVAL_MS,
				staleTime: REFRESH_INTERVAL_MS,
				gcTime: REFRESH_INTERVAL_MS * 5,
			},
		})

	const { data: totalVTokenStake, status: readTotalVTokenStakeStatus } =
		useReadContract({
			abi: launchpoolABI,
			address: pool?.id as `0x${string}`,
			functionName: 'getTotalStakedVTokens',
			query: {
				enabled: !!pool?.id,
				refetchInterval: REFRESH_INTERVAL_MS,
				staleTime: REFRESH_INTERVAL_MS,
				gcTime: REFRESH_INTERVAL_MS * 5,
			},
		})

	const { data: withdrawableVTokens, status: readWithdrawableVTokensStatus } =
		useReadContract({
			abi: launchpoolABI,
			address: pool?.id as `0x${string}`,
			functionName: 'getWithdrawableVTokens',
			args: [BigInt((yourNativeStake as string) || 0)],
			query: {
				enabled: !!yourNativeStake && !!pool?.id,
				refetchInterval: REFRESH_INTERVAL_MS,
				staleTime: REFRESH_INTERVAL_MS,
				gcTime: REFRESH_INTERVAL_MS * 5,
			},
		})

	const { data: totalNativeStake, status: readTotalNativeStakeStatus } =
		useReadContract({
			abi: launchpoolABI,
			address: pool?.id as `0x${string}`,
			functionName: 'totalNativeStake',
			query: {
				enabled: !!pool?.id,
				refetchInterval: REFRESH_INTERVAL_MS,
				staleTime: REFRESH_INTERVAL_MS,
				gcTime: REFRESH_INTERVAL_MS * 5,
			},
		})

	const { data: claimableReward, status: readClaimableRewardStatus } =
		useReadContract({
			abi: launchpoolABI,
			address: pool?.id as `0x${string}`,
			functionName: 'getClaimableProjectToken',
			args: [address],
			query: {
				enabled: !!address && !!pool?.id,
				refetchInterval: REFRESH_INTERVAL_MS,
				staleTime: REFRESH_INTERVAL_MS,
				gcTime: REFRESH_INTERVAL_MS * 5,
			},
		})

	/* ---------------------- Calculate user's share of stake ---------------------- */
	const yourShare = useMemo(() => {
		if (
			!totalNativeStake ||
			!yourNativeStake ||
			BigInt(totalNativeStake as string) === BigInt(0)
		) {
			return 0
		}
		const percentage =
			(BigInt(yourNativeStake.toString()) * BigInt(10000)) /
			BigInt(totalNativeStake.toString())
		return Number(percentage) / 100
	}, [yourNativeStake, totalNativeStake])

	// Return computed data object
	return {
		totalVTokenStake: totalVTokenStake as bigint,
		totalNativeStake: totalNativeStake as bigint,
		yourNativeStake: yourNativeStake as bigint,
		withdrawableVTokens: withdrawableVTokens as bigint,
		yourShare,
		claimableReward: claimableReward as bigint,
		updatedAt: Date.now(), // Include this for compatibility

		readTotalNativeStakeStatus,
		readYourNativeStakeStatus,
		readTotalVTokenStakeStatus,
		readWithdrawableVTokensStatus,
		readClaimableRewardStatus,
	}
}
