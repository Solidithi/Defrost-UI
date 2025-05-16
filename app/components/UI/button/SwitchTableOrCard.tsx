'use client'

import { motion } from 'framer-motion'

interface SwitchTableOrCardProps {
	isCard: boolean
	setIsCard: (isCard: boolean) => void
}

const CardIcon: React.FC<{ color: string }> = ({ color }) => (
	<svg
		width="37"
		height="24"
		viewBox="0 0 37 37"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width="11" height="11" fill={color} />
		<rect y="13" width="11" height="11" fill={color} />
		<rect y="26" width="11" height="11" fill={color} />
		<rect x="13" width="11" height="11" fill={color} />
		<rect x="13" y="13" width="11" height="11" fill={color} />
		<rect x="13" y="26" width="11" height="11" fill={color} />
		<rect x="26" width="11" height="11" fill={color} />
		<rect x="26" y="13" width="11" height="11" fill={color} />
		<rect x="26" y="26" width="11" height="11" fill={color} />
	</svg>
)

const TableIcon: React.FC<{ color: string }> = ({ color }) => (
	<svg
		width="43"
		height="24"
		viewBox="0 0 52 37"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width="11" height="11" fill={color} />
		<rect y="13" width="11" height="11" fill={color} />
		<rect y="26" width="11" height="11" fill={color} />
		<rect x="13" width="39" height="11" fill={color} />
		<rect x="13" y="13" width="39" height="11" fill={color} />
		<rect x="13" y="26" width="39" height="11" fill={color} />
	</svg>
)

const SwitchTableOrCard: React.FC<SwitchTableOrCardProps> = ({
	isCard,
	setIsCard,
}) => {
	const selectedCardColor = isCard ? 'white' : 'gray'
	const selectedTableColor = isCard ? 'gray' : 'white'

	return (
		<div className="relative w-36 h-[52px] glass-component-1 rounded-xl flex items-center px-1">
			{/* Sliding Indicator */}
			<motion.div
				className={
					isCard
						? 'absolute w-10 h-10 warm-cool-bg rounded-xl'
						: 'absolute w-12 h-10 warm-cool-bg rounded-xl'
				}
				initial={false}
				animate={{ x: isCard ? '33%' : '161%' }}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
			/>

			{/* Card Button */}
			<button
				className="relative w-1/2 h-full flex justify-center items-center"
				onClick={() => setIsCard(true)}
			>
				<CardIcon color={selectedCardColor} />
			</button>

			{/* Table Button */}
			<button
				className="relative w-1/2 h-full flex justify-center items-center"
				onClick={() => setIsCard(false)}
			>
				<TableIcon color={selectedTableColor} />
			</button>
		</div>
	)
}

export default SwitchTableOrCard
