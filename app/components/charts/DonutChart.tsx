'use client'

import React from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

interface DonutChartProps {
	title?: string
	series: number[]
	labels: string[]
}

const DonutChart: React.FC<DonutChartProps> = ({ title, series, labels }) => {
	;<div className="bg-[#a8a8a8]"></div>
	const options: ApexOptions = {
		chart: {
			type: 'donut',
			background: 'transparent',
		},
		labels: labels,
		colors: ['#ef4444', '#a8a8a8'], // 🔥 Slice 1: red, Slice 2: light gray
		dataLabels: {
			enabled: false,
		},
		legend: {
			position: 'bottom',
			labels: {
				colors: '#E5E7EB',
			},
		},
		fill: {
			type: 'solid', // ❌ No more gradient
		},
		stroke: {
			show: false,
		},
		plotOptions: {
			pie: {
				donut: {
					size: '85%',
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '20px',
							color: '#ffffff',
							offsetY: -10,
						},
						value: {
							show: true,
							fontSize: '16px',
							color: '#ffffff',
							offsetY: 10,
							formatter: function (val: string) {
								return `${val} units`
							},
						},
						total: {
							show: true,
							label: 'Total',
							fontSize: '18px',
							fontFamily: 'Orbitron',
							color: '#ffffff',
							formatter: function (w) {
								return (
									w.globals.seriesTotals.reduce(
										(a: number, b: number) => a + b,
										0
									) + ' tokens'
								)
							},
						},
					},
				},
			},
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: 300,
					},
					legend: {
						position: 'bottom',
					},
				},
			},
		],
	}

	return (
		<div className=" mx-auto glass-component-1 h-[420px] dark:bg-gray-900 p-4 rounded-2xl shadow-md">
			<h2 className="text-xl font-semibold text-center mb-4 text-white dark:text-white font-orbitron">
				{title}
			</h2>
			<Chart options={options} series={series} type="donut" height={350} />
		</div>
	)
}

export default DonutChart
