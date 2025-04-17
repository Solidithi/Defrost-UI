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
	const [accentClassName, setAccentClassName] = useState('')

	let bgColorClass = ''
	let borderColorClass = ''
	let textColorClass = ''

	switch (accentColor) {
		case 'blue':
			bgColorClass = 'bg-gradient-to-r from-blue-900/70 to-blue-700/40'
			borderColorClass = 'border-blue-400/30'
			textColorClass = 'text-blue-300'
			break
		case 'purple':
			bgColorClass = 'bg-gradient-to-r from-purple-900/70 to-purple-700/40'
			borderColorClass = 'border-purple-400/30'
			textColorClass = 'text-purple-300'
			break
		default:
			break
	}

	return (
		<div>
			{/* vToken yield-bearing explanation */}
			{showVTokenNotice && (
				<div className="mb-4">
					<div
						className={`flex items-start border ${bgColorClass} ${borderColorClass} rounded-lg p-3 relative shadow-lg`}
					>
						<AlertCircle
							className={`w-5 h-5 mr-2 mt-0.5 ${textColorClass} flex-shrink-0`}
						/>
						{children}
						<button
							className={`ml-3 ${textColorClass} hover:text-purple-100 transition`}
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
