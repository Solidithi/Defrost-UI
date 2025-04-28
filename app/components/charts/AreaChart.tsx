'use client'

import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const tokenData = {
	DOT: [100, 300, 900, 1800, 1600, 1700, 1900, 2500],
	KSM: [200, 400, 700, 1400, 1350, 1400, 1600, 1800],
	ACA: [300, 600, 1000, 1800, 1750, 2000, 3000, 4500],
	GLMR: [50, 100, 250, 300, 500, 700, 850, 1100],
}

const categories = [
	'2025-01-01',
	'2025-02-01',
	'2025-03-01',
	'2025-04-01',
	'2025-05-01',
	'2025-06-01',
	'2025-07-01',
	'2025-08-01',
]

export default function StackedTokenAreaChart() {
	const series = Object.entries(tokenData).map(([token, data]) => ({
		name: token,
		data: categories.map((x, idx) => ({
			x: new Date(x).getTime(),
			y: data[idx],
		})),
	}))

	const options: ApexOptions = {
		chart: {
			type: 'area',
			height: 350,
			stacked: true,
			toolbar: { show: false },
			zoom: { enabled: true },
			background: 'transparent',
		},
		colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
		dataLabels: { enabled: false },
		stroke: {
			curve: 'monotoneCubic',
		},
		fill: {
			type: 'gradient',
			gradient: {
				opacityFrom: 0.6,
				opacityTo: 0.8,
			},
		},
		xaxis: {
			type: 'datetime',
			labels: { style: { colors: '#fff' } },
			axisBorder: { color: '#fff' },
			axisTicks: { color: '#fff' },
		},
		yaxis: {
			labels: { style: { colors: '#fff' } },
		},
		legend: {
			position: 'top',
			horizontalAlign: 'left',
			labels: { colors: '#fff' },
		},
		grid: { show: false },
		tooltip: { theme: 'dark' },
	}

	return (
		<div className="w-full max-w-5xl mx-auto h-[400px] bg-gray-900 rounded-2xl p-6">
			<h2 className="text-white text-2xl font-bold mb-4">
				Stacked Area: Token Trends
			</h2>
			<ApexChart options={options} series={series} type="area" height={300} />
		</div>
	)
}
