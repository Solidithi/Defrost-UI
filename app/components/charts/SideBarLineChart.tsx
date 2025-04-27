'use client'
import React, { useState, MouseEvent } from 'react'
import { motion } from 'framer-motion'

interface SidebarLineChartProps {
	data: number[]
	/** Chart height in px */
	height?: number
	/** Gradient start color (CSS color) */
	gradientFrom?: string
	/** Gradient end color (CSS color) */
	gradientTo?: string
}

const SidebarLineChart: React.FC<SidebarLineChartProps> = ({
	data,
	height = 60,
	gradientFrom = 'currentColor',
	gradientTo = 'currentColor',
}) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
	const max = Math.max(...data)
	const min = Math.min(...data)

	// Normalize points to 0–100 coordinate space
	const points = data.map((value, idx) => ({
		x: (idx / (data.length - 1)) * 100,
		y: 100 - ((value - min) / (max - min)) * 100,
	}))

	// Paths
	const pathD = points
		.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
		.join(' ')
	const areaD = `${pathD} L 100 100 L 0 100 Z`

	const handleMouseMove = (e: MouseEvent<SVGRectElement>) => {
		const { width: w, left } = e.currentTarget.getBoundingClientRect()
		const relX = e.clientX - left
		const idx = Math.round((relX / w) * (data.length - 1))
		setHoveredIndex(idx >= 0 && idx < data.length ? idx : null)
	}

	return (
		<div className="relative w-full overflow-hidden" style={{ height }}>
			<svg
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				className="w-full h-full"
			>
				<defs>
					{/* Horizontal fill gradient left-to-right */}
					<linearGradient
						id="fillGradient"
						gradientUnits="userSpaceOnUse"
						x1="0"
						y1="0"
						x2="100"
						y2="0"
					>
						<stop offset="0%" stopColor={gradientFrom} stopOpacity="0.2" />
						<stop offset="100%" stopColor={gradientTo} stopOpacity="0" />
					</linearGradient>
					{/* Horizontal stroke gradient left-to-right */}
					<linearGradient
						id="lineGradient"
						gradientUnits="userSpaceOnUse"
						x1="0"
						y1="0"
						x2="100"
						y2="0"
					>
						<stop offset="0%" stopColor={gradientFrom} stopOpacity="1" />
						<stop offset="100%" stopColor={gradientTo} stopOpacity="0.4" />
					</linearGradient>
				</defs>

				{/* Area under line */}
				<motion.path
					d={areaD}
					fill="url(#fillGradient)"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 1.2, ease: 'easeOut' }}
				/>

				{/* Animated line stroke */}
				<motion.path
					d={pathD}
					fill="none"
					stroke="url(#lineGradient)"
					strokeWidth={0.5}
					className="text-gray-200"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 1.2, ease: 'easeOut' }}
				/>

				{/* Hover indicator */}
				{hoveredIndex !== null && (
					<motion.circle
						cx={points[hoveredIndex].x}
						cy={points[hoveredIndex].y}
						r={1.5}
						className="fill-white"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: 'spring', stiffness: 300, damping: 20 }}
					/>
				)}

				{/* Interaction overlay */}
				<rect
					width="100"
					height="100"
					fill="transparent"
					onMouseMove={handleMouseMove}
					onMouseLeave={() => setHoveredIndex(null)}
				/>
			</svg>

			{/* Tooltip */}
			{hoveredIndex !== null && (
				<div
					className="absolute bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap"
					style={{
						left: `calc(${points[hoveredIndex].x}% )`,
						top: `${(points[hoveredIndex].y / 100) * height - 28}px`,
						transform: 'translateX(-50%)',
					}}
				>
					{data[hoveredIndex]}
				</div>
			)}
		</div>
	)
}

export default SidebarLineChart
