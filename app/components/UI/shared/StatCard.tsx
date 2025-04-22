'use client'
import React from 'react'
import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import { GlowingEffect } from '@/app/components/UI/effect/GlowingEffect'
import CountUp from './effect/Countup'

interface StatCardProps {
	type: 'Total Project' | 'Total Staking' | 'Unique Participant'
	count: number
	label: string
	icon: string
}

const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
	return (
		<div className="relative">
			{/* Apply GlowingEffect */}
			<GlowingEffect
				spread={40} // Controls how far the glow effect spreads
				glow={true} // Enables glow effect
				disabled={false} // Ensures effect is active
				proximity={64} // Controls how close the cursor needs to be
				inactiveZone={0.01} // Defines the inactive zone
				className="absolute inset-0 rounded-2xl"
			/>

			<div
				className={clsx(
					'relative flex flex-1 flex-col gap-6 rounded-2xl bg-cover p-6 pt-3 shadow-lg h-[118px] glass-component-2 text-white'
					// {
					//   " text-white glass-component-2": type === "Total Project",
					//   "bg-gradient-to-r from-[#549DE2] to-[#E45A5C] text-white":
					//     type === "Total Staking",
					//   "bg-gradient-to-r from-[#E15B5F] to-[#973D41] text-white":
					//     type === "Unique Participant",
					// }
				)}
			>
				<div className="flex items-center justify-between gap-4">
					<Image
						src={icon}
						alt={label}
						width={60}
						height={60}
						className="rounded-full mt-6"
					/>
					<div className="text-right">
						<p className="text-[18px] leading-[29px] font-bold font-orbitron mb-4">
							{label}
						</p>
						<CountUp
							from={0}
							to={count}
							separator=","
							direction="up"
							duration={1}
							className="mt-4 text-[20px] leading-[26px] font-comfortaa count-up-next"
						></CountUp>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StatCard
