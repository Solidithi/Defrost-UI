'use client'

import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface LineChartProps {
	yAxisValues: number[]
	xAxisValues: string[]
}

export default function LineChart({
	xAxisValues,
	yAxisValues,
}: LineChartProps) {
	const series = [
		{
			name: 'data',
			data: yAxisValues,
		},
	]

	const options: ApexOptions = {
		chart: {
			type: 'area',
			background: 'transparent',
			toolbar: { show: false },
			zoom: { enabled: true },
		},
		colors: ['#3b82f6'],
		dataLabels: { enabled: false },
		stroke: {
			curve: 'straight',
			width: 3,
		},
		fill: {
			type: 'gradient',
			gradient: {
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
		legend: { show: false },
		grid: { show: false },
		tooltip: { theme: 'dark' },
	}

	return (
		<div className="relative w-full h-[420px] glass-enhanced rounded-3xl p-6 text-white">
			<h2 className="absolute top-4 right-6 text-2xl font-bold font-orbitron">
				APR
			</h2>

			<div className="w-full h-full pt-10">
				<ApexChart options={options} series={series} type="area" height={350} />
			</div>
		</div>
	)
}
