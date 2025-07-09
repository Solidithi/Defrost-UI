interface SubtleBackLightProps {
	backgroundColor?: string
	overlayColor?: string
	opacity?: number
}

export const BackLight = ({
	backgroundColor = '#020203',
	overlayColor,
	opacity = 0.3,
}: SubtleBackLightProps) => {
	return (
		<div className="fixed inset-0 -z-10">
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{
					backgroundColor,
					backgroundImage: "url('/my-project/bg-beam.png')",
				}}
			/>
			{overlayColor && (
				<div
					className="absolute inset-0"
					style={{
						backgroundColor: overlayColor,
						opacity,
					}}
				/>
			)}
		</div>
	)
}
