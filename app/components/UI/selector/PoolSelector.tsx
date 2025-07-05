import { ChevronDown } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/app/components/UI/shadcn/Dialog'
import { EnrichedProject } from '@/app/types/extended-models/enriched-project'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { useState } from 'react'
import { PoolCard } from '@/app/components/UI/card/PoolCard'

export interface PoolSelectorProps {
	project: EnrichedProject
	initialSelectedPoolAddress?: string
	onPoolSelected: (pool: EnrichedLaunchpool) => void
}

export function PoolSelector({
	project,
	initialSelectedPoolAddress,
	onPoolSelected,
}: PoolSelectorProps) {
	const [selectedPoolAddress, setSelectedPoolAddress] = useState<string | null>(
		initialSelectedPoolAddress ?? null
	)

	// Get all pools from the project (for now just launchpools)
	const allPools = project.launchpools || []

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
					{allPools.map((pool) => {
						const isSelected = selectedPoolAddress === pool.id
						return (
							<PoolCard
								key={pool.id}
								pool={pool}
								isSelected={isSelected}
								tokenSymbol={project.token_symbol || 'Token'}
								onClick={() => onPoolSelected(pool)}
							/>
						)
					})}
				</div>
			</DialogContent>
		</Dialog>
	)
}
