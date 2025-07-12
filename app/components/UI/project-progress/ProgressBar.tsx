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

	const barStyles = overrideClassName
		? barClassName
		: 'w-1/2 m-6 glass-enhanced rounded-lg h-1 relative overflow-hidden w-full'
	const colorStyles = overrideClassName
		? colorClassName
		: 'warm-cool-bg h-full transition-all ease-out duration-700'

	return (
		<div className="flex justify-center">
			<div className={`relative overflow-hidden rounded-lg ${barStyles}`}>
				<div
					className={`h-full ${colorStyles}`}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	)
}

export default ProgressBar
