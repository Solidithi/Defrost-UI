import React, { useEffect, useState } from 'react'
import ApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { usePoolStore } from '@/app/store/launchpool'

const SteplineChart: React.FC = () => {
	const { pool, poolData, phase, phaseData } = usePoolStore()
	const [chartData, setChartData] = useState<{ x: Date; y: number }[]>([])
	const [formattedDates, setFormattedDates] = useState<string[]>([])

	useEffect(() => {
		if (pool.length === 0 || phase.length === 0) return

		// Get token supply from the first pool (assuming one pool is used)
		const tokenSupply = poolData[0]?.tokenSupply || 0
		if (!tokenSupply) return

		// Sort phases by start date
		const sortedPhases = [...phaseData].sort(
			(a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()
		)

		// Create time segments - start with pool dates
		const poolStartDate = poolData[0]?.from
			? new Date(poolData[0].from)
			: new Date()
		const poolEndDate = poolData[0]?.to ? new Date(poolData[0].to) : new Date()

		// Collect all timepoints to create segments
		const timePoints: {
			date: Date
			isPhaseStart?: boolean
			isPhaseEnd?: boolean
			phaseIndex?: number
		}[] = []

		// Add all phase boundaries as time points
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

				// If current point's time matches phase start and next point's time matches phase end
				if (
					current.date.getTime() === phaseStart.getTime() &&
					next.date.getTime() === phaseEnd.getTime()
				) {
					matchingPhaseIndex = j
					break
				}
			}

			segments.push({
				startDate: current.date,
				endDate: next.date,
				isPhaseSegment: matchingPhaseIndex !== -1,
				phaseIndex: matchingPhaseIndex !== -1 ? matchingPhaseIndex : undefined,
			})
		}

		// Calculate tokens allocated to phases
		let totalAllocatedToPhases = 0
		const phaseTokens: number[] = []

		sortedPhases.forEach((phase) => {
			if (!phase.emissionRate) return
			const phaseAmount = (tokenSupply * phase.emissionRate) / 100
			phaseTokens.push(phaseAmount)
			totalAllocatedToPhases += phaseAmount
		})

		// Calculate remaining tokens for non-phase periods
		const remainingTokens = tokenSupply - totalAllocatedToPhases

		// Count non-phase segments
		const nonPhaseSegments = segments.filter(
			(segment) => !segment.isPhaseSegment
		)

		// Calculate tokens per non-phase segment
		const tokenPerNonPhaseSegment =
			nonPhaseSegments.length > 0
				? remainingTokens / nonPhaseSegments.length
				: 0

		// Generate data points for the chart (non-cumulative)
		const dataPoints: { x: Date; y: number }[] = []
		const dates: string[] = []

		segments.forEach((segment) => {
			// Add data point at the start of the segment
			dates.push(formatDate(segment.startDate))

			let segmentTokens = 0

			if (segment.isPhaseSegment && segment.phaseIndex !== undefined) {
				// For phase segments, use the emission rate
				segmentTokens = phaseTokens[segment.phaseIndex]
			} else {
				// For non-phase segments, use equal distribution of remaining tokens
				segmentTokens = tokenPerNonPhaseSegment
			}

			dataPoints.push({ x: segment.startDate, y: segmentTokens })

			// Add a data point at the end of the last segment, but not with 0 value
			if (segment === segments[segments.length - 1]) {
				dates.push(formatDate(segment.endDate))

				// Sử dụng giá trị của phase cuối cùng hoặc giá trị không-phase cuối cùng
				let finalValue =
					segment.isPhaseSegment && segment.phaseIndex !== undefined
						? phaseTokens[segment.phaseIndex] // Sử dụng giá trị của phase cuối cùng
						: tokenPerNonPhaseSegment // Sử dụng giá trị của non-phase

				dataPoints.push({ x: segment.endDate, y: finalValue })
			}
		})

		// console.log('Generated data points:', dataPoints)

		setChartData(dataPoints)
		setFormattedDates(dates)
	}, [pool, poolData, phase, phaseData])

	// Format date for display
	const formatDate = (date: Date): string => {
		return (
			date.toLocaleDateString() +
			' ' +
			date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		)
	}

	const options: ApexOptions = {
		chart: {
			type: 'line',
			height: 350,
			toolbar: {
				show: false,
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
			text: 'Token Emission Schedule',
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
			categories: formattedDates,
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
			labels: {
				style: {
					colors: '#fff',
					fontSize: '12px',
					fontFamily: 'comfortaa, sans-serif',
				},
				formatter: function (val) {
					return val.toFixed(0)
				},
			},
			max: poolData[0]?.tokenSupply || undefined,
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

	const series = [
		{
			name: 'Token Allocation',
			data: chartData.map((point) => point.y),
		},
	]

	// If no data, show a message
	if (chartData.length === 0 || !poolData[0]?.tokenSupply) {
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
			className="glass-component-3 rounded-xl py-5 px-4 sm:px-5 lg:px-8 "
		>
			<div className="mb-4">
				<span className="font-orbitron text-base sm:text-sm">
					Total Supply: {poolData[0]?.tokenSupply.toLocaleString()} tokens
				</span>
			</div>
			<ApexChart options={options} series={series} type="line" height={280} />
			<div className="mt-4 text-xs  sm:text-[9px] sm:leading-[12px] font-comfortaa opacity-75">
				<p>
					The chart shows token allocation per time segment. Each phase has its
					configured emission rate, and remaining tokens are distributed evenly
					across non-phase periods.
				</p>
				<p>
					The y-axis maximum is set to the total token supply (
					{poolData[0]?.tokenSupply.toLocaleString()} tokens).
				</p>
			</div>
		</div>
	)
}

export default SteplineChart
