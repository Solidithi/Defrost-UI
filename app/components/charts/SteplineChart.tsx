import React, { useEffect, useState } from 'react'
import ApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { usePoolStore } from '@/app/store/launchpool'

interface SteplineChartProps {
	poolId?: number // Optional poolId prop
}

const SteplineChart: React.FC<SteplineChartProps> = ({ poolId }) => {
	const { pool, poolData } = usePoolStore()
	const [chartData, setChartData] = useState<
		Record<number, { x: Date; y: number }[]>
	>({})
	const [formattedDates, setFormattedDates] = useState<
		Record<number, string[]>
	>({})
	const [selectedPool, setSelectedPool] = useState<number | null>(null)

	// Use the provided poolId if available, otherwise use the store's selected pool
	useEffect(() => {
		if (poolId !== undefined) {
			setSelectedPool(poolId)
		} else {
			// Reset selected pool if the current selection is no longer available
			if (selectedPool && !pool.includes(selectedPool)) {
				setSelectedPool(pool.length > 0 ? pool[0] : null)
			}
			// Set default selected pool if none is selected
			if (!selectedPool && pool.length > 0) {
				setSelectedPool(pool[0])
			}
		}
	}, [pool, selectedPool, poolId])

	// Function to get phases for the selected pool
	const getSelectedPoolPhases = () => {
		if (!selectedPool) return []
		return poolData[selectedPool]?.phases || []
	}

	useEffect(() => {
		if (pool.length === 0) return

		const newChartData: Record<number, { x: Date; y: number }[]> = {}
		const newFormattedDates: Record<number, string[]> = {}

		// If poolId is provided, only process that specific pool
		const poolsToProcess = poolId !== undefined ? [poolId] : pool

		// Process each pool separately
		poolsToProcess.forEach((currentPoolId) => {
			if (!pool.includes(currentPoolId)) return // Skip if the pool doesn't exist

			const currentPoolData = poolData[currentPoolId]
			if (!currentPoolData || !currentPoolData.tokenSupply) return

			// Get phases for this pool
			const currentPhases = currentPoolData.phases || []

			// Get token supply for this pool
			const tokenSupply = currentPoolData.tokenSupply

			// Sort phases by start date for this pool
			const sortedPhases = [...currentPhases].sort(
				(a, b) => new Date(a.from).getTime() - new Date(a.from).getTime()
			)

			// Create time segments for this pool
			const poolStartDate = currentPoolData?.from
				? new Date(currentPoolData.from)
				: new Date()
			const poolEndDate = currentPoolData?.to
				? new Date(currentPoolData.to)
				: new Date()

			// Collect all timepoints to create segments for this pool
			const timePoints: {
				date: Date
				isPhaseStart?: boolean
				isPhaseEnd?: boolean
				phaseIndex?: number
			}[] = []

			// Add pool start date if not already in a phase
			timePoints.push({
				date: poolStartDate,
				isPhaseStart: false,
				isPhaseEnd: false,
			})

			// Add all phase boundaries as time points for this pool
			sortedPhases.forEach((phase, index) => {
				if (!phase.from || !phase.to) return
				const phaseStartDate = new Date(phase.from)
				const phaseEndDate = new Date(phase.to)

				timePoints.push({
					date: phaseStartDate,
					isPhaseStart: true,
					isPhaseEnd: false,
					phaseIndex: index,
				})

				timePoints.push({
					date: phaseEndDate,
					isPhaseStart: false,
					isPhaseEnd: true,
					phaseIndex: index,
				})
			})

			// Add pool end date if needed and not already in the timepoints
			const lastTimepoint = timePoints[timePoints.length - 1]?.date || null
			if (lastTimepoint && poolEndDate.getTime() > lastTimepoint.getTime()) {
				timePoints.push({
					date: poolEndDate,
					isPhaseStart: false,
					isPhaseEnd: false,
				})
			}

			// Sort all time points chronologically
			timePoints.sort((a, b) => a.date.getTime() - b.date.getTime())

			// Remove duplicates (when phase starts/ends coincide with other time points)
			const uniqueTimePoints = []
			for (let i = 0; i < timePoints.length; i++) {
				const current = timePoints[i]
				// If this is first point or not a duplicate time, add it
				if (
					i === 0 ||
					current.date.getTime() !== timePoints[i - 1].date.getTime()
				) {
					uniqueTimePoints.push(current)
					continue
				}
				// This is a duplicate timestamp, merge with previous point
				const previous = uniqueTimePoints[uniqueTimePoints.length - 1]
				// Preserve phase information when merging
				if (current.isPhaseStart) previous.isPhaseStart = true
				if (current.isPhaseEnd) previous.isPhaseEnd = true
				if (current.phaseIndex !== undefined)
					previous.phaseIndex = current.phaseIndex
			}

			// Define segments and identify which is a phase segment
			const segments: {
				startDate: Date
				endDate: Date
				isPhaseSegment: boolean
				phaseIndex?: number
			}[] = []

			// Improved segment identification logic
			for (let i = 0; i < uniqueTimePoints.length - 1; i++) {
				const current = uniqueTimePoints[i]
				const next = uniqueTimePoints[i + 1]

				// Check if this segment belongs to a phase by comparing with sorted phases
				let matchingPhaseIndex = -1
				for (let j = 0; j < sortedPhases.length; j++) {
					const phaseStart = new Date(sortedPhases[j].from)
					const phaseEnd = new Date(sortedPhases[j].to)

					// If this segment is within a phase
					if (
						current.date.getTime() >= phaseStart.getTime() &&
						next.date.getTime() <= phaseEnd.getTime()
					) {
						matchingPhaseIndex = j
						break
					}
				}

				segments.push({
					startDate: current.date,
					endDate: next.date,
					isPhaseSegment: matchingPhaseIndex !== -1,
					phaseIndex:
						matchingPhaseIndex !== -1 ? matchingPhaseIndex : undefined,
				})
			}

			// Calculate total tokens allocated to phases
			let totalAllocatedToPhases: number = 0
			const phaseTokens: number[] = []

			sortedPhases.forEach((phase) => {
				// Now use emissionRate directly as token amount instead of percentage
				const phaseAmount = phase.tokenAmount
				phaseTokens.push(phaseAmount)
				totalAllocatedToPhases += Number(phaseAmount)
			})
			console.log(
				`Total tokens allocated to phases for pool ${currentPoolId}: ${totalAllocatedToPhases}`
			)
			console.log(typeof tokenSupply, tokenSupply)

			// Calculate remaining tokens for non-phase periods
			const remainingTokens = Math.max(0, tokenSupply - totalAllocatedToPhases)

			// Count non-phase segments
			const nonPhaseSegments = segments.filter(
				(segment) => !segment.isPhaseSegment
			)

			// Calculate tokens per non-phase segment
			const tokenPerNonPhaseSegment =
				nonPhaseSegments.length > 0
					? remainingTokens / nonPhaseSegments.length
					: 0

			// Generate data points for this pool's chart (non-cumulative)
			const dataPoints: { x: Date; y: number }[] = []
			const dates: string[] = []

			segments.forEach((segment) => {
				// Add data point at the start of the segment
				dates.push(formatDate(segment.startDate))

				let segmentTokens = 0
				if (segment.isPhaseSegment && segment.phaseIndex !== undefined) {
					// For phase segments, use the direct token amount
					segmentTokens = phaseTokens[segment.phaseIndex]
				} else {
					// For non-phase segments, use equal distribution of remaining tokens
					segmentTokens = tokenPerNonPhaseSegment
				}

				dataPoints.push({ x: segment.startDate, y: segmentTokens })

				// Add a data point at the end of the last segment
				if (segment === segments[segments.length - 1]) {
					dates.push(formatDate(segment.endDate))
					// Use the value of the last phase or the last non-phase value
					let finalValue =
						segment.isPhaseSegment && segment.phaseIndex !== undefined
							? phaseTokens[segment.phaseIndex] // Use value of the last phase
							: tokenPerNonPhaseSegment // Use non-phase value
					dataPoints.push({ x: segment.endDate, y: finalValue })
				}
			})

			// Store this pool's data
			newChartData[currentPoolId] = dataPoints
			newFormattedDates[currentPoolId] = dates
		})

		setChartData(newChartData)
		setFormattedDates(newFormattedDates)
	}, [pool, poolData, poolId, selectedPool])

	// Format date for display
	const formatDate = (date: Date): string => {
		return (
			date.toLocaleDateString() +
			' ' +
			date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		)
	}

	// Get options for the selected pool
	const getOptions = (poolId: number): ApexOptions => {
		return {
			chart: {
				type: 'line',
				height: 320,
				toolbar: {
					show: true, // Hiển thị thanh công cụ để zoom
				},
				zoom: {
					enabled: true, // Bật tính năng zoom
					type: 'x', // Chỉ zoom theo trục x
					autoScaleYaxis: true, // Tự động điều chỉnh trục y khi zoom
				},
				foreColor: '#fff',
				animations: {
					enabled: true,
					speed: 800,
				},
				background: 'transparent',
			},
			stroke: {
				curve: 'stepline',
				width: 3,
			},
			dataLabels: {
				enabled: true,
				formatter: function (val) {
					return val ? val.toLocaleString() + ' tokens' : '0'
				},
				style: {
					colors: ['#fff'],
					fontWeight: 500,
				},
				background: {
					enabled: true,
					foreColor: '#111',
					borderRadius: 3,
					padding: 4,
					opacity: 0.9,
					borderWidth: 1,
					borderColor: '#555',
				},
			},
			title: {
				text: `Token Emission Schedule - ${poolData[poolId]?.vTokenSymbol || 'Pool ' + poolId}`,
				align: 'left',
				style: {
					color: '#fff',
					fontSize: '16px',
					fontFamily: 'orbitron, sans-serif',
				},
			},
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'dark',
					type: 'horizontal',
					shadeIntensity: 0.5,
					gradientToColors: ['#7C3AED'],
					inverseColors: false,
					opacityFrom: 0.7,
					opacityTo: 0.9,
				},
			},
			markers: {
				size: 6,
				colors: ['#2E93fA'],
				strokeColors: '#fff',
				strokeWidth: 2,
				hover: {
					size: 8,
					sizeOffset: 3,
				},
			},
			xaxis: {
				type: 'category',
				categories: formattedDates[poolId] || [],
				labels: {
					style: {
						colors: '#fff',
						fontSize: '12px',
						fontFamily: 'comfortaa, sans-serif',
					},
					rotate: -45,
					rotateAlways: false,
					trim: true,
				},
				axisBorder: {
					show: true,
					color: '#78909C',
				},
				tooltip: {
					enabled: false,
				},
			},
			yaxis: {
				title: {
					text: 'Token Amount',
					style: {
						color: '#fff',
						fontSize: '14px',
						fontFamily: 'orbitron, sans-serif',
					},
				},
				min: 0,
				max: Number(poolData[poolId]?.tokenSupply) || 0,
				tickAmount: 5,
				forceNiceScale: true, // Force nice round numbers
				labels: {
					style: {
						colors: '#fff',
						fontSize: '12px',
						fontFamily: 'comfortaa, sans-serif',
					},
					formatter: function (val) {
						// Format to a nice number with locale formatting
						return Math.round(val).toLocaleString()
					},
				},
			},
			legend: {
				position: 'top',
				horizontalAlign: 'right',
				labels: {
					colors: '#fff',
				},
			},
			tooltip: {
				theme: 'dark',
				x: {
					format: 'dd MMM yyyy HH:mm',
				},
				y: {
					formatter: function (val) {
						return val.toFixed(0) + ' tokens'
					},
				},
			},
			grid: {
				borderColor: 'rgba(255, 255, 255, 0.1)',
				row: {
					colors: ['transparent', 'rgba(255, 255, 255, 0.05)'],
					opacity: 0.5,
				},
			},
		}
	}

	// Get series for the selected pool
	const getSeries = (poolId: number) => {
		return [
			{
				name: `${poolData[poolId]?.vTokenSymbol || 'Pool ' + poolId} Token Allocation`,
				data: chartData[poolId]?.map((point) => point.y) || [],
			},
		]
	}

	// If no pools available, show a message
	if (pool.length === 0) {
		return (
			<div className="flex items-center justify-center h-64 glass-component-3 rounded-xl p-5 text-white">
				<div className="text-center">
					<p className="font-orbitron text-lg mb-2">No pools available</p>
					<p className="font-comfortaa text-sm opacity-75">
						Please add a pool with token supply and at least one phase with
						emission rate to see the chart
					</p>
				</div>
			</div>
		)
	}

	// If selected pool has no data, show a message
	if (
		!selectedPool ||
		!chartData[selectedPool] ||
		chartData[selectedPool].length === 0 ||
		!poolData[selectedPool]?.tokenSupply
	) {
		return (
			<div className="flex items-center justify-center h-64 glass-component-3 rounded-xl p-5 text-white">
				<div className="text-center">
					<p className="font-orbitron text-lg mb-2">No data to display</p>
					<p className="font-comfortaa text-sm opacity-75">
						Please add a pool with token supply and at least one phase with
						emission rate to see the chart
					</p>
				</div>
			</div>
		)
	}

	return (
		<div
			id="chart"
			className="glass-component-3 rounded-xl py-5 px-4 sm:px-5 lg:px-9"
		>
			{/* Pool selector when multiple pools exist and no specific poolId is provided */}
			{pool.length > 1 && poolId === undefined && (
				<div className="mb-4">
					<label htmlFor="pool-selector" className="font-orbitron text-sm mr-2">
						Select Pool:
					</label>
					<select
						id="pool-selector"
						className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm font-comfortaa"
						value={selectedPool || ''}
						onChange={(e) => setSelectedPool(Number(e.target.value))}
					>
						{pool.map((poolId) => (
							<option key={poolId} value={poolId}>
								{poolData[poolId]?.vTokenSymbol || `Pool ${poolId}`}
							</option>
						))}
					</select>
				</div>
			)}

			{/* Token supply info */}
			<div className="mb-4">
				<span className="font-orbitron text-base sm:text-sm">
					Total Supply: {poolData[selectedPool].tokenSupply.toLocaleString()}{' '}
					{poolData[selectedPool].vTokenSymbol || 'reward tokens'}
				</span>
			</div>

			{/* Chart */}
			<ApexChart
				options={getOptions(selectedPool)}
				series={getSeries(selectedPool)}
				type="line"
				height={280}
			/>

			{/* Phase information */}
			<div className="mt-4 mb-2">
				<h4 className="font-orbitron text-sm text-cyan-400 mb-1">
					Phase Information:
				</h4>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
					{poolData[selectedPool]?.phases?.map((phase, index) => (
						<div
							key={phase.id}
							className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 shadow-sm text-xs text-white"
						>
							<div className="font-bold text-cyan-400">Phase {index + 1}</div>
							<div>{phase.tokenAmount?.toLocaleString() || 0} tokens</div>
							<div className="opacity-70">
								{new Date(phase.from).toLocaleDateString()} –{' '}
								{new Date(phase.to).toLocaleDateString()}
							</div>
						</div>
					))}
					{(!poolData[selectedPool]?.phases ||
						poolData[selectedPool].phases.length === 0) && (
						<div className="text-xs opacity-75 col-span-full">
							No phases defined
						</div>
					)}
				</div>
			</div>

			{/* Chart explanation */}
			<div className="mt-4 text-xs sm:text-[9px] sm:leading-[12px] font-comfortaa opacity-75">
				<p>
					The chart shows token allocation per time segment. Each phase has its
					configured token amount, and remaining tokens are distributed evenly
					across non-phase periods.
				</p>
				<p>
					The y-axis maximum is set to the total token supply (
					{poolData[selectedPool].tokenSupply.toLocaleString()} tokens).
				</p>
			</div>
		</div>
	)
}

export default SteplineChart
