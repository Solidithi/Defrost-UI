// 'use client'

// import { useState } from 'react'
// import dynamic from 'next/dynamic'
// import { cn } from '@/app/lib/utils'
// import { ApexOptions } from 'apexcharts'

// const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

// const tokenData = {
// 	DOT: [100, 300, 900, 1800, 1600, 1700, 1900, 2500],
// 	KSM: [200, 400, 700, 1400, 1350, 1400, 1600, 1800],
// 	ACA: [300, 600, 1000, 1800, 1750, 2000, 3000, 4500],
// 	GLMR: [50, 100, 250, 300, 500, 700, 850, 1100],
// }

// const tokens = Object.keys(tokenData)
// const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

// export default function StakedAmountChart() {
// 	const [activeToken, setActiveToken] = useState('ACA')
// 	const data = tokenData[activeToken]

// 	const options: ApexOptions = {
// 		dataLabels: {
// 			enabled: false,
// 		},

// 		chart: {
// 			type: 'area',
// 			toolbar: { show: false },
// 			zoom: { enabled: true },
// 			background: 'transparent',
// 		},
// 		stroke: {
// 			width: 3,
// 			curve: 'straight',
// 			colors: ['#fffff'],
// 		},
// 		fill: {
// 			type: 'gradient',
// 			gradient: {
// 				shadeIntensity: 1,
// 				opacityFrom: 0.5,
// 				opacityTo: 0,
// 				stops: [0, 90, 100],
// 				colorStops: [
// 					[
// 						{
// 							offset: 0,
// 							color: '#3b82f6',
// 							opacity: 0.7,
// 						},
// 						{
// 							offset: 100,
// 							color: '#ef4444',
// 							opacity: 0.6,
// 						},
// 					],
// 				],
// 			},
// 		},
// 		xaxis: {
// 			categories,
// 			labels: { style: { colors: '#fff' } },
// 			axisBorder: { color: '#fff' },
// 			axisTicks: { color: '#fff' },
// 		},
// 		yaxis: {
// 			labels: { style: { colors: '#fff' } },
// 		},
// 		grid: {
// 			show: false,
// 		},
// 		tooltip: {
// 			theme: 'dark',
// 		},
// 		colors: ['#3b82f6'],
// 	}

// 	const series = [
// 		{
// 			name: activeToken,
// 			data,
// 		},
// 	]

// 	return (
// 		<div className="">
// 			<div className="relative w-full max-w-4xl h-[400px] bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white">
// 				<div className="absolute top-4 left-4 flex gap-3 bg-white/10 px-4 py-2 rounded-full">
// 					{tokens.map((t) => (
// 						<button
// 							key={t}
// 							className={cn(
// 								'w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition',
// 								activeToken === t && 'ring-2 ring-white'
// 							)}
// 							onClick={() => setActiveToken(t)}
// 						>
// 							<span className="text-xs font-bold">{t[0]}</span>
// 						</button>
// 					))}
// 					<button
// 						className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition"
// 						onClick={() => setActiveToken('DEFAULT')}
// 					>
// 						<span className="text-sm font-bold">D</span>
// 					</button>
// 				</div>

// 				<h2 className="absolute top-4 right-6 text-3xl font-bold">
// 					Staked Amount
// 				</h2>

// 				<div className="w-full h-full pt-10">
// 					<ApexChart
// 						options={options}
// 						series={series}
// 						type="area"
// 						height={300}
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

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

export default function StakedAmountChart() {
	const [activeToken, setActiveToken] = useState('ACA')

	const isDefault = activeToken === 'DEFAULT'

	const series = isDefault
		? Object.entries(tokenData).map(([name, data]) => ({ name, data }))
		: [{ name: activeToken, data: tokenData[activeToken] }]

	const options: ApexOptions = {
		chart: {
			type: 'area',
			stacked: isDefault,
			background: 'transparent',
			toolbar: { show: false },
			zoom: { enabled: true },
		},
		colors: isDefault ? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] : ['ffff'],
		dataLabels: { enabled: false },
		stroke: {
			curve: isDefault ? 'monotoneCubic' : 'straight',
			width: isDefault ? 3 : 0,
			colors: isDefault ? undefined : ['transparent'],
		},
		fill: {
			type: isDefault ? 'solid' : 'gradient',
			gradient: isDefault
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
			categories,
			labels: { style: { colors: '#fff' } },
			axisBorder: { color: '#fff' },
			axisTicks: { color: '#fff' },
		},
		yaxis: {
			labels: { style: { colors: '#fff' } },
		},
		legend: {
			show: isDefault,
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
				{tokens.map((t) => (
					<button
						key={t}
						className={cn(
							'w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition',
							activeToken === t && 'ring-2 ring-white'
						)}
						onClick={() => setActiveToken(t)}
					>
						<span className="text-xs font-bold">{t[0]}</span>
					</button>
				))}
				<button
					className={cn(
						'w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition',
						isDefault && 'ring-2 ring-white'
					)}
					onClick={() => setActiveToken('DEFAULT')}
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
