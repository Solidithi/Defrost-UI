'use client'

import { useMemo } from 'react'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { getChainName, getTokenInfoFromConfig } from '@/app/utils/chain'
import { useLaunchpoolTokenInfo } from './useTokenInfo'

export function useLaunchpoolNameAndDescription(pool: EnrichedLaunchpool) {
	const { tokensInfo } = useLaunchpoolTokenInfo(pool)

	return useMemo(() => {
		if (!pool) {
			return {
				name: 'vToken launchpool',
				description:
					'Stake tokens and earn rewards while maintaining liquidity',
			}
		}

		const chainName = getChainName(pool.chain_id)

		// Get token symbols from tokensInfo or config
		let vTokenSymbol = ''
		let nativeTokenSymbol = ''
		let projectTokenSymbol = ''

		if (tokensInfo?.poolType === 'launchpool') {
			// Use token info from the hook if available
			vTokenSymbol = tokensInfo.vTokenInfo?.symbol || 'vToken'
			nativeTokenSymbol = tokensInfo.nativeTokenInfo?.symbol || 'native tokens'
			projectTokenSymbol =
				tokensInfo.projectTokenInfo?.symbol || 'project tokens'
		} else {
			// Fallback to config for tokens we control
			const vTokenInfo = getTokenInfoFromConfig(
				pool.chain_id,
				pool.v_asset_address
			)
			const nativeTokenInfo = getTokenInfoFromConfig(
				pool.chain_id,
				pool.native_asset_address
			)

			vTokenSymbol = vTokenInfo?.symbol || 'vToken'
			nativeTokenSymbol = nativeTokenInfo?.symbol || 'native tokens'
		}

		const description = `Stake ${vTokenSymbol} and earn ${projectTokenSymbol} while maintaining ${nativeTokenSymbol} liquidity on ${chainName}`
		const name = `${vTokenSymbol} Staking Pool`

		return { name, description }
	}, [
		// Only depend on the specific values we actually use
		pool?.id,
		pool?.chain_id,
		pool?.v_asset_address,
		pool?.native_asset_address,
		tokensInfo?.vTokenInfo?.symbol,
		tokensInfo?.nativeTokenInfo?.symbol,
		tokensInfo?.projectTokenInfo?.symbol,
		tokensInfo?.poolType,
	])
}
