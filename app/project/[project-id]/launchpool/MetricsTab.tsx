'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { StatCard } from '@/app/components/UI/card/StatCard'
import { useProjectStore } from '@/app/store/project'
import { useProjectLaunchpoolMetrics } from '@/app/hooks/queries/useProjectLaunchpoolMetrics'

// Dynamically import chart components to avoid SSR issues
const BarChart = dynamic(() => import('@/app/components/charts/Barchart'), {
	ssr: false,
	loading: () => (
		<div className="h-64 bg-gray-800/20 rounded-lg animate-pulse" />
	),
})

const DonutChart = dynamic(() => import('@/app/components/charts/DonutChart'), {
	ssr: false,
	loading: () => (
		<div className="h-64 bg-gray-800/20 rounded-lg animate-pulse" />
	),
})

const LineChart = dynamic(() => import('@/app/components/charts/LineChart'), {
	ssr: false,
	loading: () => (
		<div className="h-64 bg-gray-800/20 rounded-lg animate-pulse" />
	),
})

const StakedAmountChart = dynamic(
	() => import('@/app/components/charts/StatLineChart'),
	{
		ssr: false,
		loading: () => (
			<div className="h-64 bg-gray-800/20 rounded-lg animate-pulse" />
		),
	}
)

export const MetricsTab = () => {
	const { currentProject, isLoading: isProjectLoading } = useProjectStore()
	const {
		data: projectMetrics,
		isLoading: isLoadingMetrics,
		error: metricsError,
	} = useProjectLaunchpoolMetrics()

	const stakedAmountChartData = useMemo(() => {
		if (!projectMetrics?.stakeAmountTimeSeriesData)
			return {
				legends: [],
				xAxisValues: [],
				timeSeriesData2d: {},
			}

		const legends: string[] = Object.keys(
			projectMetrics.stakeAmountTimeSeriesData[0].breakdown
		)

		const legendIcons = legends.map((tokenSymbol) => {
			switch (tokenSymbol) {
				case 'vDOT':
					return '/token-logos/vDOT.avif'
				default:
					return tokenSymbol // Fallback to just the symbol if no logo
			}
		})
		const xAxisValues: string[] = []
		const timeSeriesData2d: Record<string, number[]> = {}

		for (const dateStakeData of projectMetrics.stakeAmountTimeSeriesData) {
			const date = new Date(dateStakeData.date)
			const formattedDateStr = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
			xAxisValues.push(formattedDateStr)

			for (const [tokenSymbol, stakeAmount] of Object.entries(
				dateStakeData.breakdown
			)) {
				if (!timeSeriesData2d[tokenSymbol]) {
					timeSeriesData2d[tokenSymbol] = []
				}
				timeSeriesData2d[tokenSymbol].push(stakeAmount)
			}
		}

		return {
			legends,
			legendIcons,
			xAxisValues,
			timeSeriesData2d,
		}
	}, [projectMetrics?.stakeAmountTimeSeriesData])

	// Define stat cards with project-specific metrics data
	const statCardItems = [
		{
			value: projectMetrics?.totalParticipants || 0,
			label: 'Active Investors',
			icon: '/decoration/user-light.png',
			valuePostfix: ' investors',
			// No growth rate since we don't have reliable historical data
		},
		{
			value: projectMetrics?.totalLaunchpools || 0,
			label: 'Active Launchpools',
			icon: '/decoration/locker-light.png',
			valuePostfix: ' pools',
			// No growth rate - this is a count metric
		},
		{
			value: projectMetrics?.averageApr || 0,
			label: 'Average Staking APY',
			icon: '/decoration/coin-light.png',
			valuePostfix: '%',
			// No growth rate - APR is volatile and doesn't need trend comparison
		},
	]

	// Extract chart data from project metrics
	const barData = projectMetrics?.vAssetBreakdown.map(
		(item) => item.amount
	) || [4500, 5300, 3600, 1500]
	const barLabels = projectMetrics?.vAssetBreakdown.map(
		(item) => item.asset
	) || ['vASTR', 'vDOT', 'vGLMR', 'vKSM']

	const donutData = projectMetrics
		? [
				projectMetrics.tokenDistribution.remainingTokens,
				projectMetrics.tokenDistribution.distributedTokens,
			]
		: [0, 0]
	const donutLabels = ['Remaining tokens', 'Distributed tokens']
	return (
		<div>
			{/* Show loading message when no project is selected */}
			{!currentProject && (
				<div className="text-center py-20">
					<div className="text-gray-400 text-lg">
						Please select a project to view metrics
					</div>
				</div>
			)}

			{/* Show error message if metrics failed to load */}
			{metricsError && (
				<div className="text-center py-20">
					<div className="text-red-400 text-lg">
						Failed to load project metrics. Please try again.
					</div>
				</div>
			)}

			{/* Main content */}
			{currentProject && (
				<>
					<div className="grid grid-cols-3 gap-8 w-full mx-auto mt-10 mb-24">
						{statCardItems.map((item, index) => (
							<StatCard
								key={index}
								value={item.value}
								label={item.label}
								icon={item.icon}
								valuePostfix={item.valuePostfix}
								isLoading={isLoadingMetrics}
							/>
						))}
					</div>
					<div className="grid grid-cols-2 gap-8">
						<div className="">
							<StakedAmountChart {...stakedAmountChartData} />
						</div>
						<div className="">
							<BarChart data={barData} label={barLabels} />
						</div>
						<div className="">
							<LineChart />
						</div>
						<div className="">
							<DonutChart
								title="Token Distribution"
								series={donutData}
								labels={donutLabels}
							/>
						</div>
					</div>
					<div className="w-full mt-8">
						<LineChart />
					</div>
				</>
			)}
		</div>
	)
}
