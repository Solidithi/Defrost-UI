'use client'

import { useState } from 'react'
import { ChevronDown, Info, Zap, Rocket, Sprout } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/app/components/UI/shadcn/Tooltip'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/app/components/UI/shadcn/Dialog'
import Button from '../Button'

// Define pool types
type PoolType = 'launchpool' | 'launchpad' | 'farm'

export interface Pool {
	id: string
	type: PoolType
	staker_apy: number
	total_staked: bigint
	total_stakers: number
	duration: number
	earned: number
	tokenSymbol: string
	description?: string
}

// Adding Project interface
// interface Project {
// 	id: string
// 	name: string
// 	logo?: string
// 	short_description: string
// 	token_symbol: string
// 	project_owner: string
// 	pool?: {
// 		staker_apy: number | string
// 		total_staked: number | string
// 		total_stakers: number
// 	}[]
// 	token_address?: string
// 	created_at: Date
// }

interface StakingComponentProps {
	// project: Project
	projectName: string
	pools: Pool[]
	onHarvest: (poolId: string) => void
	onConnectWallet: () => void
	isWalletConnected: boolean
	onStake: (poolId: string, amount: number) => void
}

// Helper function to get pool icon based on type
const getPoolIcon = (type: PoolType) => {
	switch (type) {
		case 'launchpool':
			return <Zap className="w-5 h-5 text-blue-400" />
		case 'launchpad':
			return <Rocket className="w-5 h-5 text-purple-400" />
		case 'farm':
			return <Sprout className="w-5 h-5 text-green-400" />
	}
}

// Helper function to get pool color based on type
const getPoolColors = (type: PoolType) => {
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

// Mock func
const getAcceptedTokens = (pool: Pool): string[] => {
	switch (pool.type) {
		case 'launchpool':
		// return ['vDOT']
		default:
			return ['vDOT']
	}
}

export default function StakingRow({
	projectName,
	pools,
	onHarvest,
	onConnectWallet,
	isWalletConnected = false,
	onStake,
}: StakingComponentProps) {
	const [selectedPoolId, setSelectedPoolId] = useState<string>(
		pools[0]?.id || ''
	)
	const [stakeAmount, setStakeAmount] = useState<string>('')

	// Handle wallet connection
	const handleConnectWallet = () => {
		console.log('Connecting wallet for project', projectName)
		alert('Wallet connection feature will be implemented soon')
	}

	// Handle harvest action
	const handleHarvest = (poolId: string) => {
		console.log(`Harvesting from pool ${poolId} for project ${projectName}`)
		alert('Harvest feature will be implemented soon')
	}

	// Convert project to pools format
	// const pools = convertProjectToPools(project)

	const selectedPool =
		pools.find((pool) => pool.id === selectedPoolId) || pools[0]
	const poolColors = selectedPool
		? getPoolColors(selectedPool.type)
		: getPoolColors('launchpool')

	const handlePoolChange = (value: string) => {
		setSelectedPoolId(value)
	}

	const handleStake = () => {
		if (isWalletConnected && selectedPool) {
			onStake(selectedPool.id, Number(stakeAmount))
			console.log(
				`Staking ${stakeAmount} in pool ${selectedPoolId} for project ${projectName}`
			)
			alert(
				`Staking ${stakeAmount} ${selectedPool.tokenSymbol} tokens in ${projectName}`
			)
		} else {
			onConnectWallet()
		}
	}

	return (
		<div className="w-full rounded-xl overflow-hidden backdrop-blur-xl bg-black/30 border border-white/10 shadow-xl">
			<div className="flex flex-col md:flex-row">
				{/* Left panel - Pool info */}
				<div className="w-full md:w-1/3 p-6 backdrop-blur-md bg-black/40 flex flex-col justify-between border-r border-white/5">
					<div>
						{/* Pool selector with popup */}
						<div className="mb-6">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-lg font-medium text-white">Pool</h3>
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
											{pools.map((pool) => {
												const colors = getPoolColors(pool.type)
												const isSelected = selectedPoolId === pool.id

												return (
													<div
														key={pool.id}
														className={`p-4 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-md
                              border bg-gradient-to-br ${colors.bg} ${colors.border}
                              ${
																isSelected
																	? 'shadow-lg border-white/30 bg-opacity-100 from-blue-500/20 to-blue-600/10 brightness-125'
																	: 'hover:brightness-110 hover:border-white/20'
															}`}
														onClick={() => {
															handlePoolChange(pool.id)
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
															<div
																className={
																	isSelected
																		? 'text-opacity-100 brightness-125'
																		: ''
																}
															>
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
																	isSelected
																		? 'text-green-300 brightness-125'
																		: 'text-green-400'
																}`}
															>
																{pool.staker_apy}% APR
															</span>
														</div>

														{pool.description && (
															<p className="text-xs text-gray-400 mt-1 mb-2">
																{pool.description}
															</p>
														)}

														<div className="flex justify-between items-center mt-2 text-xs text-gray-400">
															<span>Duration: {pool.duration} days</span>
															<span>
																Earned: {pool.earned} {pool.tokenSymbol}
															</span>
														</div>

														{/* Display selected tokens */}
														<div className="mt-3">
															<div className="text-xs text-gray-400 mb-1">
																Accepted tokens:
															</div>
															<div className="flex flex-wrap gap-1">
																{getAcceptedTokens(selectedPool).map(
																	(token) => (
																		<div
																			key={token}
																			className="bg-white/10 rounded-full px-2 py-0.5 text-xs"
																		>
																			{token}
																		</div>
																	)
																)}
															</div>
														</div>
													</div>
												)
											})}
										</div>
									</DialogContent>
								</Dialog>
							</div>

							{/* Display selected pool info */}
							{selectedPool && (
								<div
									className={`rounded-xl p-4 backdrop-blur-md bg-gradient-to-br border
                    ${poolColors.bg} ${poolColors.border}`}
								>
									<div className="flex items-center gap-2 mb-2">
										{getPoolIcon(selectedPool.type)}
										<span
											className={`font-medium uppercase text-xs ${poolColors.text}`}
										>
											{selectedPool.type}
										</span>
									</div>

									<div className="flex justify-between items-center">
										<span className="font-medium text-white">
											{getPoolNameFromType(selectedPool.type)}
										</span>
										<span className="text-green-400 font-medium">
											{selectedPool.staker_apy}% APR
										</span>
									</div>

									{selectedPool.description && (
										<p className="text-xs text-gray-400 mt-1">
											{selectedPool.description}
										</p>
									)}
								</div>
							)}

							{/* Display accepted tokens */}
							<div className="mt-3">
								<div className="text-xs text-gray-400 mb-1">
									Accepted tokens:
								</div>
								<div className="flex flex-wrap gap-1">
									{getAcceptedTokens(selectedPool).map((token) => (
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

						<div className="flex justify-between mb-2 text-sm">
							<div className="text-gray-400">APR:</div>
							<div className="font-medium text-white">
								{selectedPool?.staker_apy || 0}%
							</div>
						</div>

						<div className="flex justify-between text-sm">
							<div className="text-gray-400">Ends in:</div>
							<div className="font-medium text-white">
								{selectedPool?.duration || 0} days
							</div>
						</div>
					</div>

					<div className="mt-6">
						<button
							className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
							onClick={() => window.open(`/project/${projectName}`, '_blank')}
						>
							View Project Detail
						</button>
					</div>
				</div>

				{/* Right panel - Earned and Staking */}
				<div className="w-full md:w-2/3 flex flex-col md:flex-row">
					{/* Earned section */}
					<div className="w-full md:w-1/2 p-6 backdrop-blur-md bg-black/20 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
						<div>
							<h2 className="text-xl font-medium mb-6 text-white">EARNED</h2>
							<div className="text-2xl font-bold mb-2 text-white">
								{selectedPool?.earned || 0}
								<span className="text-sm text-gray-400 ml-1">
									{selectedPool?.tokenSymbol}
								</span>
							</div>
						</div>
						<button
							// className="backdrop-blur-md bg-white/10 hover:bg-white/15 text-black py-2 px-4 w-full mt-4 transition-colors"
							className="px-4 py-2 bg-white/10 hover:bg-white/35 text-white rounded-full font-comfortaa 
    transition-all duration-300 ease-in-out 
    hover:opacity-80 hover:shadow-lg hover:scale-105 
    active:scale-95 active:opacity-90"
							onClick={() => onHarvest(selectedPool?.id || '')}
						>
							Claim rewards
						</button>
					</div>

					{/* Start staking section */}
					<div className="w-full md:w-1/2 p-6 backdrop-blur-md bg-black/20 flex flex-col justify-between">
						<div>
							<h2 className="text-xl font-medium mb-6 text-white">
								START STAKING
							</h2>

							{isWalletConnected && (
								<div className="mb-4">
									<div className="flex items-center justify-between mb-1">
										<label className="text-sm text-gray-400">Amount</label>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger>
													<Info size={16} className="text-gray-400" />
												</TooltipTrigger>
												<TooltipContent className="bg-black/80 border-white/10">
													<p>Enter the amount you want to stake</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
									<input
										type="number"
										value={stakeAmount}
										onChange={(e) => setStakeAmount(e.target.value)}
										placeholder="0.0"
										className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-white backdrop-blur-md"
									/>
								</div>
							)}
						</div>

						<Button
							// className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white py-3 px-4 rounded-md w-full mt-4 transition-colors"
							onClick={handleStake}
						>
							{isWalletConnected ? 'Stake Now' : 'Connect Wallet'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

// Alternative component that accepts a Project object
// interface StakingInTableProps {
// 	project: Project
// }

const getPoolNameFromType = (type: PoolType) => {
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

// Convert a project to pools format expected by original component
// const convertProjectToPools = (project: Project): Pool[] => {
// 	if (!project.pool || project.pool.length === 0) {
// 		// Create a default pool if none exists
// 		return [
// 			{
// 				id: 'default',
// 				name: `${project.name} Pool`,
// 				type: 'launchpool',
// 				apr:
// 					typeof project.pool?.[0]?.staker_apy === 'number'
// 						? project.pool[0].staker_apy
// 						: 0,
// 				duration: 30, // default duration in days
// 				earned: 0, // default earned amount
// 				tokenSymbol: project.token_symbol,
// 			},
// 		]
// 	}

// 	return project.pool.map((pool, index) => ({
// 		id: index.toString(),
// 		name: `${project.name} Pool ${index + 1}`,
// 		type: 'launchpool' as PoolType,
// 		apr:
// 			typeof pool.staker_apy === 'number'
// 				? pool.staker_apy
// 				: parseFloat(pool.staker_apy.toString()),
// 		duration: 30, // default duration in days
// 		earned: 0, // default earned amount
// 		tokenSymbol: project.token_symbol,
// 		description: `Stake ${project.token_symbol} tokens to earn rewards`,
// 	}))
// }
