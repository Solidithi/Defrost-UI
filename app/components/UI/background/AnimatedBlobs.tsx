'use client'
import { motion } from 'framer-motion'
import { useMemo, useEffect, useState } from 'react'

const getRandomVW = (min: number, max: number) =>
	`${Math.random() * (max - min) + min}vw`

const gradients = [
	'from-[#427FF6] via-[#AB54F2] to-[#E8499E]',
	'from-[#3B82F6] via-[#A855F7] to-[#EC4899]',
	'from-[#3B82F6] via-[#EC4899] to-[#A855F7]',
]

const AnimatedBlobs = ({ count = 3 }: { count?: number }) => {
	const [windowHeight, setWindowHeight] = useState(0)

	useEffect(() => {
		// Lấy chiều cao trang khi mount
		setWindowHeight(document.documentElement.scrollHeight)
	}, [])

	const blobs = useMemo(() => {
		if (windowHeight === 0) return []

		const getRandomVH = (minRatio: number, maxRatio: number) => {
			const topPx =
				Math.random() * (maxRatio - minRatio) * windowHeight +
				minRatio * windowHeight
			return `${topPx}px`
		}

		return Array.from({ length: count }).map(() => ({
			top: getRandomVH(0, 0.5),
			left: getRandomVW(-30, 50),
			width: `${35 + Math.random() * 5}vw`,
			height: `${35 + Math.random() * 5}vw`,
			blur: `${15 + Math.random()}vw`,
			duration: 6 + Math.random() * 4,
			dx: 5 + Math.random() * 10,
			dy: Math.random() > 0.5 ? 5 : 0,
			gradient: gradients[Math.floor(Math.random() * gradients.length)],
		}))
	}, [count, windowHeight])

	return (
		<>
			{blobs.map((blob, index) => (
				<motion.div
					key={index}
					className={`absolute rounded-full opacity-20 z-10 bg-gradient-to-r ${blob.gradient}`}
					style={{
						top: blob.top,
						left: blob.left,
						width: blob.width,
						height: blob.height,
						filter: `blur(${blob.blur})`,
					}}
					animate={{
						x: [`-${blob.dx}vw`, `${blob.dx}vw`, `-${blob.dx}vw`],
						y:
							blob.dy > 0
								? [`-${blob.dy}vh`, `${blob.dy}vh`, `-${blob.dy}vh`]
								: undefined,
					}}
					transition={{
						duration: blob.duration,
						repeat: Infinity,
						repeatType: 'mirror',
						ease: 'easeInOut',
					}}
				/>
			))}
		</>
	)
}

export default AnimatedBlobs
