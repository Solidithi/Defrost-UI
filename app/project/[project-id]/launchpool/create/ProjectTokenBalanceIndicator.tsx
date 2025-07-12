import { ProjectTokenMetadata } from '@/app/types/input/create-launchpool'
import { formatTokenAmount } from '@/app/utils/display'

interface ProjectTokenBalanceIndicatorProps {
	isShown: boolean
	hasEnoughProjectTokenBalance: boolean
	projectTokenBalance?: bigint
	totalProjectTokenSupply?: bigint
	projectTokenMetadata: ProjectTokenMetadata
}

// Token balance alert for project owner, showing actual balance vs required
export const ProjectTokenBalanceIndicator = ({
	isShown,
	hasEnoughProjectTokenBalance,
	projectTokenBalance,
	totalProjectTokenSupply,
	projectTokenMetadata,
}: ProjectTokenBalanceIndicatorProps) => {
	return (
		isShown && (
			<div className="w-full flex justify-center mt-4">
				<div
					className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors duration-200
											${
												hasEnoughProjectTokenBalance
													? 'bg-green-800/10 text-green-400'
													: 'bg-yellow-800/10 text-yellow-400'
											}
										`}
					style={{ maxWidth: '340px' }}
				>
					{/* Icon for context */}
					{hasEnoughProjectTokenBalance ? (
						<svg
							className="w-4 h-4 text-green-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					) : (
						<svg
							className="w-4 h-4 text-yellow-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 8v4m0 4h.01M6.938 20h10.124c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					)}
					<span>
						{hasEnoughProjectTokenBalance
							? 'Balance sufficient'
							: 'Balance insufficient'}
						<span className="ml-2 text-gray-300 font-normal">
							(
							{projectTokenBalance != undefined
								? formatTokenAmount(projectTokenBalance, {
										decimals: projectTokenMetadata.decimals,
										maxDecimals: 4,
										symbol: projectTokenMetadata.symbol,
									})
								: '--'}
							{' / '}
							{totalProjectTokenSupply
								? formatTokenAmount(totalProjectTokenSupply, {
										decimals: projectTokenMetadata.decimals,
										maxDecimals: 4,
										symbol: projectTokenMetadata.symbol,
									})
								: '--'}
							)
						</span>
					</span>
				</div>
			</div>
		)
	)
}
