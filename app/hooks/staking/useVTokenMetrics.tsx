import { useMemo } from 'react'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import chains from '@/app/config/chains.json'

interface useVTokenDataProps {
	chainId: number
	launchpools: EnrichedLaunchpool[]
	// add other pool types later
}

export function useVTokenMetrics({ chainId, launchpools }: useVTokenDataProps) {
	const availableVTokens = useMemo(() => {
		if (!chainId) {
			return []
		}

		const chainIdKey = chainId.toString() as keyof typeof chains
		const chain = chains[chainIdKey]
		if (!chain || !chain.tokens) {
			return []
		}
		return chain.tokens.filter((token) => token.type.toLowerCase() === 'vtoken')
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
