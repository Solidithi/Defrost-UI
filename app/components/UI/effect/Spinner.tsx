export default function BlueSpinner({
	heightWidth = 12,
	className = '',
}: {
	className?: string
	heightWidth?: number
}) {
	return (
		<div
			className={`animate-spin rounded-full h-${heightWidth} w-${heightWidth} border-t-2 border-b-2 ${className}`}
		></div>
	)
}
