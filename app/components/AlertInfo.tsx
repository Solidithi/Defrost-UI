import { ReactNode, useState } from 'react'
import {
	ChevronDown,
	Info,
	Zap,
	Rocket,
	Sprout,
	AlertCircle,
} from 'lucide-react'

interface AlertInfoProps {
	accentColor?: 'blue' | 'purple' | 'green' | 'red'
	children?: ReactNode
}

export default function AlertInfo({
	accentColor = 'blue',
	children,
}: AlertInfoProps) {
	const [showVTokenNotice, setShowVTokenNotice] = useState(true)

	let bgColorClass = ''
	let borderColorClass = ''
	let textColorClass = ''
	let shadowClass = ''

	switch (accentColor) {
		case 'blue':
			bgColorClass = 'bg-gradient-to-r from-blue-900/30 to-blue-800/20'
			borderColorClass = 'border-blue-400/20'
			textColorClass = 'text-blue-300'
			shadowClass = 'shadow-blue-400/20'
			break
		case 'purple':
			bgColorClass = 'bg-gradient-to-r from-purple-900/30 to-purple-800/20'
			borderColorClass = 'border-purple-400/20'
			textColorClass = 'text-purple-300'
			shadowClass = 'shadow-purple-400/20'
			break
		case 'green':
			bgColorClass = 'bg-gradient-to-r from-green-900/30 to-green-800/20'
			borderColorClass = 'border-green-400/20'
			textColorClass = 'text-green-300'
			shadowClass = 'shadow-green-400/20'
			break
		case 'red':
			bgColorClass = 'bg-gradient-to-r from-red-900/30 to-red-800/20'
			borderColorClass = 'border-red-400/20'
			textColorClass = 'text-red-300'
			shadowClass = 'shadow-red-400/20'
			break
		default:
			bgColorClass = 'bg-gradient-to-r from-blue-900/30 to-blue-800/20'
			borderColorClass = 'border-blue-400/20'
			textColorClass = 'text-blue-300'
			shadowClass = 'shadow-blue-400/20'
			break
	}

	return (
		<div className="flex justify-center w-full">
			{/* vToken yield-bearing explanation */}
			{showVTokenNotice && (
				<div className="mb-4 w-full max-w-3xl">
					<div
						className={`flex items-start border ${bgColorClass} ${borderColorClass} rounded-lg p-4 relative backdrop-blur-sm ${shadowClass} shadow-lg`}
						style={{
							backdropFilter: 'blur(8px)',
							WebkitBackdropFilter: 'blur(8px)',
						}}
					>
						<AlertCircle
							className={`w-5 h-5 mr-3 mt-0.5 ${textColorClass} flex-shrink-0`}
						/>
						<div className={`flex-1 ${textColorClass}`}>{children}</div>
						<button
							className={`ml-3 ${textColorClass} hover:opacity-75 transition-opacity`}
							onClick={() => setShowVTokenNotice(false)}
							aria-label="Dismiss"
						>
							&times;
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
