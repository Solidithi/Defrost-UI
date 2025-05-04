'use client'
import React from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import Image from 'next/image'

export interface BarChartProps {
	data: number[]
	label: string[]
}

const BarChart: React.FC<BarChartProps> = ({ data, label }) => {
	const series = [
		{
			name: 'Stake',
			data: data,
		},
	]

	const options: ApexOptions = {
		chart: {
			type: 'bar',
			height: 350,
			background: 'transparent',
			toolbar: { show: false },
		},
		plotOptions: {
			bar: {
				borderRadius: 10,
				columnWidth: '45%',
				distributed: false, // ✅ Set this to false
			},
		},
		dataLabels: {
			enabled: true,
			style: {
				colors: ['#fff'],
				fontSize: '14px',
			},
		},
		xaxis: {
			categories: label,
			labels: {
				style: {
					colors: '#fff',
					fontFamily: 'Orbitron',
					fontWeight: 500,
				},
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: '#fff',
				},
			},
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'light',
				type: 'vertical',
				gradientToColors: ['#4e8eff'],
				stops: [0, 100],
			},
		},
		colors: ['#ff5e5e'],
		theme: {
			mode: 'dark',
		},
		grid: {
			borderColor: '#fff',
		},
	}

	return (
		<div className="relative w-full bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white">
			<Chart options={options} series={series} type="bar" height={400} />
			{/* {label.map((item, index) => {
				const percentLeft = ((index + 0.55) / label.length) * 100
				return (
					<Image
						key={index}
						src=""
						alt=""
						className="absolute w-6 h-6 rounded-full bg-white"
						style={{
							top: 0,
							left: `${percentLeft}%`,
							transform: 'translateX(-50%)',
						}}
					/>
				)
			})} */}
		</div>
	)
}

export default BarChart
