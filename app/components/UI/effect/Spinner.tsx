export default function Spinner({
	heightWidth = 12,
	className = '',
}: {
	className?: string
	heightWidth?: number
}) {
	const baseSize = `w-${heightWidth} h-${heightWidth}`
	const innerSize = `w-${Math.max(2, heightWidth - 2)} h-${Math.max(2, heightWidth - 2)}`

	return (
		<div className={`relative ${baseSize} ${className}`}>
			{/* Outer ethereal glow */}
			<div
				className={`absolute inset-0 ${baseSize} rounded-full animate-spin`}
				style={{
					animation: 'spin 3s linear infinite',
					background:
						'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.2) 85%, transparent 100%)',
					filter: 'blur(2px)',
					opacity: 0.6,
				}}
			/>

			{/* Main elegant ring */}
			<div
				className={`absolute inset-0 ${baseSize} rounded-full animate-spin`}
				style={{
					animation: 'spin 2s linear infinite',
					background:
						'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.8) 25%, rgba(200,200,200,0.6) 50%, transparent 75%)',
					maskImage: 'radial-gradient(circle, transparent 60%, black 70%)',
					WebkitMaskImage:
						'radial-gradient(circle, transparent 60%, black 70%)',
				}}
			/>

			{/* Subtle counter ring */}
			<div
				className={`absolute inset-1 ${innerSize} rounded-full animate-spin`}
				style={{
					animation: 'spin 1.5s linear infinite reverse',
					background:
						'conic-gradient(from 180deg, transparent 60%, rgba(240,240,240,0.4) 80%, transparent 100%)',
					maskImage: 'radial-gradient(circle, transparent 50%, black 60%)',
					WebkitMaskImage:
						'radial-gradient(circle, transparent 50%, black 60%)',
				}}
			/>

			{/* Central ethereal glow */}
			<div
				className={`absolute inset-0 ${baseSize} rounded-full flex items-center justify-center`}
			>
				<div
					className="w-1 h-1 bg-white rounded-full"
					style={{
						opacity: 0.8,
						boxShadow:
							'0 0 4px rgba(255,255,255,0.6), 0 0 8px rgba(255,255,255,0.3)',
						animation: 'pulse 2s ease-in-out infinite',
					}}
				/>
			</div>

			{/* Orbital accent */}
			<div
				className={`absolute inset-0 ${baseSize} rounded-full animate-spin`}
				style={{ animation: 'spin 4s linear infinite' }}
			>
				<div
					className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-gray-300 rounded-full opacity-50"
					style={{ filter: 'blur(0.3px)' }}
				/>
			</div>
		</div>
	)
}
