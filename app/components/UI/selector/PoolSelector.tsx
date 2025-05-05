import { ChevronDown, Zap, Rocket, Sprout } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/app/components/UI/shadcn/Dialog'
import { EnrichedProject, UnifiedPool } from '@/app/types'
import { useState } from 'react'
import Spinner from '@/app/components/UI/effect/Spinner'
import { formatUnits } from 'ethers'
import { PoolCard } from '@/app/components/UI/card/PoolCard'

export const formatReadContract = (
	data: string,
	status: 'idle' | 'pending' | 'success' | 'error',
	error: unknown,
	loadingComponent?: React.ReactNode
) => {
	if (!loadingComponent) {
		loadingComponent = <Spinner heightWidth={5} />
	}

	if (status === 'success') {
		return data
	} else if (status === 'error') {
		console.error('Error :', error)
		return '0'
	} else if (status === 'pending') {
		return loadingComponent
	}
}

export interface PoolSelectorProps {
	project: EnrichedProject
	initialSelectedPoolAddress?: string
	onPoolSelected: (pool: UnifiedPool) => void
}

export function PoolSelector({
	project,
	initialSelectedPoolAddress,
	onPoolSelected,
}: PoolSelectorProps) {
	const [selectedPoolAddress, setSelectedPoolId] = useState<string | null>(
		initialSelectedPoolAddress ?? null
	)
	const [claimables, setClaimables] = useState<bigint | null>(BigInt(0))

	const selectedPool = project.unifiedPools.find(
		(pool) => pool.address === selectedPoolAddress
	)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="h-9 px-3 py-2 flex flex-row items-center border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white">
					<span className="mr-2">Select Pool</span>
					<ChevronDown size={16} />
				</button>
			</DialogTrigger>
			<DialogContent className="bg-black/80 backdrop-blur-xl border-white/10 text-white max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-medium text-white mb-4">
						Select Staking Pool
					</DialogTitle>
				</DialogHeader>
				<div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
					{project.unifiedPools.map((pool) => {
						const isSelected = selectedPoolAddress === pool.address
						return (
							<PoolCard
								key={pool.address}
								isSelected={isSelected}
								pool={pool}
								onClick={() => onPoolSelected(pool)}
							/>
						)
					})}
				</div>
			</DialogContent>
		</Dialog>
	)
}
