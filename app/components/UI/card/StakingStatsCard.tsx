import type { ReactNode } from 'react'

interface StakingStatsProps {
	title: string
	value: string
	icon: ReactNode
}

export function StakingStatsCard({ title, value, icon }: StakingStatsProps) {
	return (
		<div className="rounded-xl backdrop-blur-xl bg-white/15 border border-white/20 p-4 hover:bg-white/20 transition-colors shadow-lg">
			<div className="flex items-start justify-between mb-2">
				<div className="text-sm text-white/80">{title}</div>
				<div className="p-2 rounded-full bg-white/15">{icon}</div>
			</div>
			<div className="text-2xl font-bold">{value}</div>
		</div>
	)
}
