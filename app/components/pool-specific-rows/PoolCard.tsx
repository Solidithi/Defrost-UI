import { UnifiedPool } from '@/custom-types'
import { Zap, Rocket, Sprout } from 'lucide-react'

export const getPoolColors = (type: string) => {
	switch (type) {
		case 'launchpool':
			return {
				bg: 'from-blue-500/10 to-blue-600/5',
				border: 'border-blue-500/20',
				highlight: 'bg-blue-500/10',
				text: 'text-blue-400',
			}
		case 'launchpad':
			return {
				bg: 'from-purple-500/10 to-purple-600/5',
				border: 'border-purple-500/20',
				highlight: 'bg-purple-500/10',
				text: 'text-purple-400',
			}
		case 'farm':
			return {
				bg: 'from-green-500/10 to-green-600/5',
				border: 'border-green-500/20',
				highlight: 'bg-green-500/10',
				text: 'text-green-400',
			}
		default:
			return {
				bg: 'from-blue-500/10 to-blue-600/5',
				border: 'border-blue-500/20',
				highlight: 'bg-blue-500/10',
				text: 'text-blue-400',
			}
	}
}

export const getPoolNameFromType = (type: string) => {
	switch (type) {
		case 'launchpool':
			return 'Flexible Staking'
		case 'launchpad':
			return 'IDO participation'
		case 'farm':
			return 'Yield farming'
		default:
			return 'Unknown Pool'
	}
}

export const getPoolIcon = (type: string) => {
	switch (type) {
		case 'launchpool':
			return <Zap className="w-5 h-5 text-blue-400" />
		case 'launchpad':
			return <Rocket className="w-5 h-5 text-purple-400" />
		case 'farm':
			return <Sprout className="w-5 h-5 text-green-400" />
	}
}

// Mock func
export const getAcceptedTokens = (pool: UnifiedPool): string[] => {
	switch (pool.type) {
		case 'launchpool':
		default:
			return ['vDOT']
	}
}

interface PoolCardProps {
	isSelected: boolean
	pool: UnifiedPool
	onClick?: (...args: any) => any
}

export function PoolCard({ isSelected, pool, onClick }: PoolCardProps) {
	const colors = getPoolColors(pool.type)

	return (
		<div
			className={`p-4 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-md
									border bg-gradient-to-br ${colors.bg} ${colors.border}
									${
										isSelected
											? 'shadow-lg border-white/30 bg-opacity-100 from-blue-500/20 to-blue-600/10 brightness-125'
											: 'hover:brightness-110 hover:border-white/20'
									}`}
			onClick={() => {
				if (onClick) {
					onClick()
				}

				// Close the dialog after selection
				const closeButton = document.querySelector(
					'[data-state="open"] button[data-state="closed"]'
				)
				if (closeButton) {
					;(closeButton as HTMLButtonElement).click()
				}
			}}
		>
			<div className="flex items-center gap-2 mb-2">
				<div className={isSelected ? 'text-opacity-100 brightness-125' : ''}>
					{getPoolIcon(pool.type)}
				</div>
				<span
					className={`font-medium uppercase text-xs ${colors.text}
											${isSelected ? 'text-opacity-100 brightness-125' : ''}`}
				>
					{pool.type}
				</span>
			</div>

			<div className="flex justify-between items-center">
				<span
					className={`font-medium ${isSelected ? 'text-white brightness-125' : 'text-white'}`}
				>
					{getPoolNameFromType(pool.type)}
				</span>
				<span
					className={`font-medium ${
						isSelected ? 'text-green-300 brightness-125' : 'text-green-400'
					}`}
				>
					{pool.staker_apy}% APR
				</span>
			</div>

			{pool.description && (
				<p className="text-xs text-gray-400 mt-1 mb-2">{pool.description}</p>
			)}

			<div className="flex flex-row justify-between items-center mt-2 text-xs text-gray-400">
				<span>Duration: {pool.duration} days</span>
				<span className="flex items-center">
					Earned:&nbsp;
					<span className="truncate max-w-[100px] overflow-hidden whitespace-nowrap inline-block align-bottom">
						{/* {formatReadContract(
						formatUnits((claimables as bigint) ?? '0', 18),
						readClaimablesStatus,
						readClaimablesError
					)} */}
						{/* {claimables} */}
					</span>
					&nbsp;{pool.token_symbol}
				</span>
			</div>

			{/* Display selected tokens */}
			<div className="mt-3">
				<div className="text-xs text-gray-400 mb-1">Accepted tokens:</div>
				<div className="flex flex-wrap gap-1">
					{getAcceptedTokens(pool).map((token) => (
						<div
							key={token}
							className="bg-white/10 rounded-full px-2 py-0.5 text-xs"
						>
							{token}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
