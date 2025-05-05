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
				'group relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all...',
				hasStake ? 'bg-white/15 border-white/30...' : '...'
			)}
		>
			{/* Common layout for all pool types */}
			{/* Image section */}
			<div className="relative h-48 w-full overflow-hidden">
				<Image src={image} alt={name} width={400} height={200} />
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
