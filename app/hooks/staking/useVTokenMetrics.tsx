import { useMemo } from 'react'
import { useChainId } from 'wagmi'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import chains from '@/app/config/chains.json'

interface useVTokenDataProps {
	launchpools: EnrichedLaunchpool[]
	// add other pool types later
}

export function useVTokenMetrics({ launchpools }: useVTokenDataProps) {
	const chainId = useChainId()

	const availableVTokens = useMemo(() => {
		const chainIdKey = chainId.toString() as keyof typeof chains
		// const chainIdKey = 1287
		return chains[chainIdKey].tokens.filter(
			(token) => token.type.toLowerCase() === 'vtoken'
		)
	}, [chainId])

	// Calculate pool count by vToken
	const poolCountByVToken = useMemo(() => {
		const counts: Record<string, number> = {}

		launchpools.forEach((pool) => {
			const vTokenAddress = pool.v_asset_address?.toLowerCase()
			if (vTokenAddress) {
				counts[vTokenAddress] = (counts[vTokenAddress] || 0) + 1
			}
		})

		return counts
	}, [launchpools])

	// Calculate total staked by vToken (mock data for now)
	const totalStakedByVToken = useMemo(() => {
		const staked: Record<string, string> = {}

		launchpools.forEach((pool) => {
			const vTokenAddress = pool.v_asset_address?.toLowerCase()
			if (vTokenAddress) {
				// Mock calculation - replace with real staking data
				const mockStaked = Math.floor(Math.random() * 1000000)
				staked[vTokenAddress] = `${mockStaked.toLocaleString()}`
			}
		})

		return staked
	}, [launchpools])

	return {
		availableVTokens,
		poolCountByVToken,
		totalStakedByVToken,
	}
}
