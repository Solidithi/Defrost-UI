'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/app/lib/utils'
import { ApexOptions } from 'apexcharts'
import { shortenStr } from '@/app/utils/display'
import Image from 'next/image'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

// This is an example of 2d time series data for different tokens

interface StatLineChartProps {
	legends: string[]
	legendIcons?: string[]
	xAxisValues: string[]
	timeSeriesData2d: Record<string, number[]>
}

/**
 *
 * @param legends - Array of legend labels for the chart
 * @example const legends = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
 * @param yAxisValues - Array of y-axis values for the chart
 * @example const yAxisValues = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
 * @param timeSeriesData2d - 2D array of time series data for each token
 * @example
 * const tokenData = {
	DOT: [100, 300, 900, 1800, 1600, 1700, 1900, 2500],
	KSM: [200, 400, 700, 1400, 1350, 1400, 1600, 1800],
	ACA: [300, 600, 1000, 1800, 1750, 2000, 3000, 4500],
	GLMR: [50, 100, 250, 300, 500, 700, 850, 1100],
}
	@param legendIcons - Array of legend icon URLs for the chart
 * @returns
 */
export default function StatLineChart({
	legends,
	xAxisValues,
	timeSeriesData2d,
	legendIcons,
}: StatLineChartProps) {
	const [activeLegend, setActiveLegend] = useState<string>('ALL')

	console.log('StatLineChart data:', {
		legends,
		xAxisValues,
		timeSeriesData2d,
		activeLegend,
	})

	const showAllLegends = activeLegend === 'ALL'

	const series = showAllLegends
		? Object.entries(timeSeriesData2d).map(([name, data]) => ({ name, data }))
		: [
				{
					name: activeLegend,
					data: timeSeriesData2d[activeLegend as keyof typeof timeSeriesData2d],
				},
			]

	const options: ApexOptions = {
		chart: {
			type: 'area',
			stacked: showAllLegends,
			background: 'transparent',
			toolbar: { show: false },
			zoom: { enabled: true },
		},
		colors: showAllLegends
			? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
			: ['ffff'],
		dataLabels: { enabled: false },
		stroke: {
			curve: showAllLegends ? 'monotoneCubic' : 'straight',
			width: showAllLegends ? 3 : 0,
			colors: showAllLegends ? undefined : ['transparent'],
		},
		fill: {
			type: showAllLegends ? 'solid' : 'gradient',
			gradient: showAllLegends
				? {
						opacityFrom: 0.6,
						opacityTo: 0.8,
					}
				: {
						shadeIntensity: 1,
						opacityFrom: 0.5,
						opacityTo: 0,
						stops: [0, 90, 100],
						colorStops: [
							[
								{ offset: 45, color: '#3b82f6', opacity: 0.9 },
								{ offset: 100, color: '#ef4444', opacity: 0.9 },
							],
						],
					},
		},
		xaxis: {
			categories: xAxisValues,
			labels: { style: { colors: '#fff' } },
			axisBorder: { color: '#fff' },
			axisTicks: { color: '#fff' },
		},
		yaxis: {
			labels: { style: { colors: '#fff' } },
		},
		legend: {
			show: showAllLegends,
			position: 'top',
			horizontalAlign: 'left',
			labels: { colors: '#fff' },
		},
		grid: { show: false },
		tooltip: { theme: 'dark' },
	}

	return (
		<div className="relative w-full max-w-4xl h-[420px] bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white">
			<div className="absolute top-4 left-4 flex gap-3 bg-white/10 px-4 py-2 rounded-full">
				{legends.map((legend, index) => (
					<button
						key={legend}
						className={cn(
							'w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition',
							activeLegend === legend && 'ring-2 ring-white'
						)}
						onClick={() => setActiveLegend(legend)}
					>
						{legendIcons && legendIcons[index] ? (
							<Image
								src={legendIcons[index]}
								alt={legend}
								width={24}
								height={24}
								className="rounded-full w-full h-full"
							/>
						) : (
							<span className="text-xs font-bold">{legend}</span>
						)}
					</button>
				))}
				<button
					className={cn(
						'w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition',
						showAllLegends && 'ring-2 ring-white'
					)}
					onClick={() => setActiveLegend('ALL')}
				>
					<span className="text-sm font-bold">D</span>
				</button>
			</div>

			<h2 className="absolute top-4 right-6 text-2xl font-bold font-orbitron">
				Staked Amount
			</h2>

			<div className="w-full h-full pt-10">
				<ApexChart options={options} series={series} type="area" height={350} />
			</div>
		</div>
	)
}
