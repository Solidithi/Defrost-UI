import { useMemo } from 'react'
import { useStakingStore } from '@/app/store/staking'
import { useChainId } from 'wagmi'
import chains from '@/app/config/chains.json'

export function useVTokenData() {
	const { pools } = useStakingStore()
	const chainId = useChainId()

	const availableVTokens = useMemo(() => {
		const chainIdKey = chainId.toString() as keyof typeof chains
		return chains[chainIdKey].tokens.filter(
			(token) => token.type.toLowerCase() === 'vtoken'
		)
	}, [chainId])

	// Calculate pool count by vToken
	const poolCountByVToken = useMemo(() => {
		const counts: Record<string, number> = {}

		pools.launchpools.forEach((pool) => {
			const vTokenAddress = pool.v_asset_address?.toLowerCase()
			if (vTokenAddress) {
				counts[vTokenAddress] = (counts[vTokenAddress] || 0) + 1
			}
		})

		return counts
	}, [pools.launchpools])

	// Calculate total staked by vToken (mock data for now)
	const totalStakedByVToken = useMemo(() => {
		const staked: Record<string, string> = {}

		pools.launchpools.forEach((pool) => {
			const vTokenAddress = pool.v_asset_address?.toLowerCase()
			if (vTokenAddress) {
				// Mock calculation - replace with real staking data
				const mockStaked = Math.floor(Math.random() * 1000000)
				staked[vTokenAddress] = `${mockStaked.toLocaleString()}`
			}
		})

		return staked
	}, [pools.launchpools])

	return {
		availableVTokens,
		poolCountByVToken,
		totalStakedByVToken,
	}
}
