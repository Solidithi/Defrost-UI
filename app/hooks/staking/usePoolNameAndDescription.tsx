'use client'

import { useState, useEffect } from 'react'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { getChainName, getTokenInfoFromConfig } from '@/app/utils/chain'
import { useLaunchpoolTokenInfo } from './useTokenInfo'

export function useLaunchpoolNameAndDescription(pool: EnrichedLaunchpool) {
	const [name, setName] = useState('vToken launchpool')
	const [description, setDescription] = useState<string>(
		'Stake tokens and earn rewards while maintaining liquidity'
	)

	const { tokensInfo } = useLaunchpoolTokenInfo(pool)

	useEffect(() => {
		if (!pool) return

		const chainName = getChainName(pool.chain_id)

		// Get token symbols from tokensInfo or config
		let vTokenSymbol = ''
		let nativeTokenSymbol = ''
		let projectTokenSymbol = ''

		if (tokensInfo?.poolType === 'launchpool') {
			// Use token info from the hook if available
			vTokenSymbol = tokensInfo.vTokenInfo.symbol
			nativeTokenSymbol = tokensInfo.nativeTokenInfo.symbol
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

		setDescription(
			`Stake ${vTokenSymbol} and earn ${projectTokenSymbol || 'project tokens'} while maintaining ${nativeTokenSymbol} liquidity on ${chainName}`
		)
		setName(`${vTokenSymbol} Staking Pool`)
	}, [pool, tokensInfo])

	return { name, description }
}
