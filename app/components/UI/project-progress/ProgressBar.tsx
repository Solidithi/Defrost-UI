'use client'
import { useEffect, useState } from 'react'

interface ProgressBarProps {
	index: number
	total: number
	duration?: number
	overrideClassName?: boolean
	barClassName?: string
	colorClassName?: string
}
const ProgressBar = ({
	index,
	total,
	duration = 2000,
	overrideClassName = false,
	barClassName,
	colorClassName,
}: ProgressBarProps) => {
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		// Ensure values are numbers before calculation
		const numericIndex = Number(index)
		const numericTotal = Number(total)

		if (!isNaN(numericIndex) && !isNaN(numericTotal) && numericTotal > 0) {
			const targetProgress = (numericIndex / numericTotal) * 100
			setProgress(targetProgress)
		} else {
			setProgress(0)
		}
	}, [index, total])

	const barStyles = overrideClassName ? barClassName : 'w-full max-w-xs mx-auto'
	const colorStyles = overrideClassName ? colorClassName : 'bg-white'

	return (
		<div className={`relative ${barStyles}`}>
			<div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
				<div
					className={`h-full ${colorStyles} transition-all ease-out duration-700 rounded-full`}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	)
}

export default ProgressBar
