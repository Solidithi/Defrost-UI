'use client'

import { useState } from 'react'
import { ChevronDown, Filter } from 'lucide-react'
import { PoolType } from '@/app/types/extended-models/generic-pool'

export type SortOrderType =
	| 'Highest APY'
	| 'Lowest APY'
	| 'Ending Soon'
	| 'Recently Added'

interface StakingFiltersProps {
	className?: string
	initialPoolTypes?: PoolType[]
	initialSortOrder?: SortOrderType
	onFilterChange?: (params: {
		activePoolTypes: PoolType[]
		activeSortOrder: SortOrderType
	}) => void // Callback function to do something with the selected filters
}

export function StakingFilters({
	initialPoolTypes: initialSelectedPoolTypes = ['launchpool'],
	initialSortOrder = 'Highest APY',
	onFilterChange,
	className = '',
}: StakingFiltersProps) {
	const [showFilters, setShowFilters] = useState(false)
	const [activePoolTypes, setActivePoolTypes] = useState<PoolType[]>(
		initialSelectedPoolTypes
	)
	const [activeSortOrder, setActiveSortOrder] =
		useState<SortOrderType>(initialSortOrder)

	// all available pool types
	const poolTypesLabel: { id: PoolType; label: string }[] = [
		{ id: 'launchpool' as PoolType, label: 'LaunchPool' },
		{ id: 'farm', label: 'Farm Pools' },
		{ id: 'ido', label: 'IDO Launchpad' },
		{ id: 'nft', label: 'NFT Sale' },
	]

	// Toggle pool type selection
	const togglePoolType = (type: PoolType) => {
		setActivePoolTypes((prev) =>
			prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
		)
	}

	// Update sort order
	const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setActiveSortOrder(e.target.value as SortOrderType)
	}

	// Apply filters and notify parent component
	const applyFilters = () => {
		if (onFilterChange) {
			onFilterChange({
				activePoolTypes,
				activeSortOrder,
			})
		}
		setShowFilters(false)
	}

	return (
		<div className={`relative ${className}`}>
			<button
				onClick={() => setShowFilters(!showFilters)}
				className="flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-xl bg-white/15 border border-white/20 text-white hover:bg-white/20 transition-colors"
			>
				<Filter size={18} />
				Filters
				{activePoolTypes.length > 0 && (
					<span className="px-1.5 py-0.5 text-xs bg-blue-500 rounded-full ml-1">
						{activePoolTypes.length}
					</span>
				)}
				<ChevronDown
					size={16}
					className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
				/>
			</button>

			{showFilters && (
				<div className="absolute right-0 mt-2 w-64 rounded-xl glossy-card p-4 z-20 shadow-lg shadow-purple-500/20">
					<div className="mb-4">
						<label className="text-sm text-white/80 block mb-2">
							Pool Type
						</label>
						<div className="space-y-2">
							{poolTypesLabel.map((poolType) => (
								<label key={poolType.id} className="flex items-center gap-2">
									<input
										type="checkbox"
										className="rounded bg-white/15 border-white/30 text-purple-500 focus:ring-purple-500/50"
										checked={activePoolTypes.includes(poolType.id)}
										onChange={() => togglePoolType(poolType.id)}
									/>
									<span>{poolType.label}</span>
								</label>
							))}
						</div>
					</div>

					<div className="mb-4">
						<label className="text-sm text-white/80 block mb-2">Sort By</label>
						<select
							className="w-full px-3 py-2 rounded-lg glossy-input text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
							value={activeSortOrder}
							onChange={handleSortOrderChange}
						>
							<option>Highest APY</option>
							<option>Lowest APY</option>
							<option>Ending Soon</option>
							<option>Recently Added</option>
						</select>
					</div>

					<div className="flex gap-2">
						<button
							onClick={applyFilters}
							className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition shadow-md shadow-purple-500/30"
						>
							Apply
						</button>
						<button
							onClick={() => setShowFilters(false)}
							className="px-3 py-2 rounded-lg backdrop-blur-xl bg-white/15 border border-white/20 text-white font-medium hover:bg-white/20 transition"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
