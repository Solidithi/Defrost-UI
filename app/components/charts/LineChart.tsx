// 'use client'
// import React from 'react'
// import Chart from 'react-apexcharts'
// import { ApexOptions } from 'apexcharts'

// const LineChart: React.FC = () => {
// 	const series = [
// 		{
// 			name: 'Sales',
// 			data: [30, 40, 35, 50, 49, 60, 70, 91],
// 		},
// 	]

// 	// Tell TS this object *is* ApexOptions
// 	const options: ApexOptions = {
// 		chart: {
// 			id: 'basic-line',
// 			toolbar: { show: false },
// 		},
// 		xaxis: {
// 			categories: ['Jan', 'Feb', 'Mar', 'Apur', 'May', 'Jun', 'Jul', 'Aug'],
// 		},
// 		// Now curve is contextually typed as the union,
// 		// so `'smooth'` is accepted as a valid literal.
// 		stroke: {
// 			curve: 'smooth',
// 		},
// 		title: {
// 			text: 'Monthly Sales',
// 			align: 'left',
// 		},
// 		markers: {
// 			size: 0,
// 		},
// 	}

// 	return (
// 		<Chart
// 			options={options}
// 			series={series}
// 			type="line"
// 			height="100%"
// 			width="100%"
// 		/>
// 	)
// }

// export default LineChart

'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/app/lib/utils'
import { ApexOptions } from 'apexcharts'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const tokenData = {
	DOT: [100, 300, 900, 1800, 1600, 1700, 1900, 2500],
	KSM: [200, 400, 700, 1400, 1350, 1400, 1600, 1800],
	ACA: [300, 600, 1000, 1800, 1750, 2000, 3000, 4500],
	GLMR: [50, 100, 250, 300, 500, 700, 850, 1100],
}

const tokens = Object.keys(tokenData)
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

export default function LineChart() {
	const [activeToken, setActiveToken] = useState('ACA')

	const series = [{ name: activeToken, data: tokenData[activeToken] }]

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
			categories,
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
		<div className="relative w-full h-[420px] glass-component-1 rounded-3xl p-6 text-white">
			<h2 className="absolute top-4 right-6 text-2xl font-bold font-orbitron">
				APR
			</h2>

			<div className="w-full h-full pt-10">
				<ApexChart options={options} series={series} type="area" height={350} />
			</div>
		</div>
	)
}
