import React from 'react'
import ApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts' // ✅ Quan trọng

const SteplineChart: React.FC = () => {
	const options: ApexOptions = {
		chart: {
			type: 'line',
			height: 350,
			toolbar: {
				show: false,
			},
			foreColor: '#fff',
		},
		stroke: {
			curve: 'stepline',
		},
		dataLabels: {
			enabled: false,
		},
		title: {
			text: 'Total Supply',
			align: 'left',
			style: {
				color: '#fff',
			},
		},
		markers: {
			hover: {
				sizeOffset: 4,
			},
		},
		xaxis: {
			labels: {
				style: {
					colors: '#fff',
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
		legend: {
			labels: {
				colors: '#fff',
			},
		},
		tooltip: {
			theme: 'dark',
		},
	}

	const series = [
		{
			data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58],
		},
	]

	return (
		<div id="chart">
			<ApexChart options={options} series={series} type="line" height={350} />
		</div>
	)
}

export default SteplineChart
