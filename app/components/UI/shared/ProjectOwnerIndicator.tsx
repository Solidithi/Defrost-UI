interface ProjectOwnerIndicatorProps {
	displayTitle?: string
	displaySubtitle?: string
	containerClassName?: string
}

export const ProjectOwnerIndicator = ({
	displayTitle,
	displaySubtitle,
	containerClassName,
}: ProjectOwnerIndicatorProps) => {
	const defaultTitlte = 'Project Owner.'
	const defaultSubtitle =
		'You can manage all launchpools, claim interests generated from pools.'
	return (
		<div
			className={`${containerClassName} mb-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/20 rounded-xl p-4 glass-enhanced`}
		>
			<div className="flex items-center gap-3">
				<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
				<div>
					<h3 className="text-emerald-400 font-medium text-sm font-orbitron">
						{displayTitle ?? defaultTitlte}
					</h3>
					<p className="text-emerald-200/70 text-xs">
						{displaySubtitle ?? defaultSubtitle}
					</p>
				</div>
			</div>
		</div>
	)
}
