import { useMemo, useEffect, useCallback } from 'react'
import { useAccount, useBlockNumber, useBlock } from 'wagmi'
import { getChainFromConfig } from '../utils/chain'

export function useOnChainTime() {
	const { isConnected, chainId } = useAccount()

	const { data: latestBlockNumber } = useBlockNumber({
		chainId: chainId,
		query: {
			enabled: isConnected && !!chainId,
		},
	})

	const { data: latestBlock } = useBlock({
		chainId: chainId,
		blockNumber: latestBlockNumber,
		query: {
			enabled: !!latestBlockNumber,
		},
	})

	useEffect(() => {
		console.log('latest block timestamp is: ', latestBlock?.timestamp)
	}, [latestBlock])

	const chain = useMemo(() => {
		if (!chainId) return
		return getChainFromConfig(chainId)
	}, [chainId])

	/**
	 * @param timestamp Unix timestamp (seconds since 00:00, 1/1/1970)
	 */
	const estimateBlockNumForTimestamp = useCallback(
		(timestamp: number): number => {
			if (!latestBlock) {
				return 0
			}
			const signedTimeDelta = timestamp - Number(latestBlock?.timestamp)
			const signedBlockDelta = Math.ceil(signedTimeDelta / chain!.blockTime)
			return Number(latestBlock.number) + signedBlockDelta
		},
		[latestBlock]
	)

	const estimateBlockNumForDate = useCallback(
		(date: string | Date) => {
			if (typeof date === 'string') {
				date = new Date(date)
			}

			const unixTimeSeconds = Math.floor(date.getTime() / 1000)
			if (isNaN(unixTimeSeconds)) {
				return 0
			}

			return estimateBlockNumForTimestamp(unixTimeSeconds)
		},
		[latestBlock]
	)

	return {
		estimateBlockNumForTimestamp,
		estimateBlockNumForDate,
		latestBlock: Number(latestBlock),
		latestBlockNumber: Number(latestBlockNumber),
		latestBlockTimestamp: latestBlock?.timestamp,
	}
}
