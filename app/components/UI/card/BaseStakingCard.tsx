import { cn } from '@/app/lib/utils'
import Image from 'next/image'

interface BaseStakingCardProps {
	children: React.ReactNode
	hasStake: boolean
	image: string
	name: string
	description: string
	onClick: () => void
}

export function BaseStakingCard({
	children,
	hasStake,
	image,
	name,
	description,
	onClick,
}: BaseStakingCardProps) {
	return (
		<div
			onClick={onClick}
			className={cn(
				'group relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer',
				hasStake
					? 'bg-white/15 border-white/30 hover:border-white/40 gradient-border'
					: 'bg-white/10 border-white/20 hover:border-white/30',
				hasStake ? 'shadow-lg shadow-purple-500/20' : ''
			)}
		>
			{/* Common layout for all pool types */}
			{/* Image section */}
			<div className="relative h-48 w-full overflow-hidden">
				<Image
					src={image}
					alt={name}
					width={400}
					height={200}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				<div className="absolute bottom-4 left-4 z-20">
					<h3 className="text-xl font-bold text-white">{name}</h3>
					<p className="text-white/80 text-sm">{description}</p>
				</div>
			</div>

			{/* Children will be specialized content for each pool type */}
			<div className="p-4">{children}</div>
		</div>
	)
}
