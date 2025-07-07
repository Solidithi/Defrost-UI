'use client'

import Image from 'next/image'
import Logo from '@/public/Logo.png'
import { useState } from 'react'
import { GlowingEffect } from '@/app/components/UI/effect/GlowingEffect'
import { EnrichedProject } from '@/app/types'

interface AllProjectCardProps {
	project: EnrichedProject
}

const AllProjectCard = ({ project }: AllProjectCardProps) => {
	const DetailDownIcon = () => {
		return (
			<svg
				width="35"
				height="35"
				viewBox="0 0 43 43"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M32.25 16.125L21.5 26.875L10.75 16.125" stroke="white" />
			</svg>
		)
	}

	return (
		<div className="relative shadow-lg card-hover-glow">
			{/* Apply GlowingEffect */}
			<GlowingEffect
				spread={50} // Increased spread for more dramatic effect
				glow={true}
				disabled={false}
				proximity={80} // Increased proximity for better interaction
				inactiveZone={0.01}
				className="absolute inset-0 rounded-2xl"
			/>

			<div className="glass-enhanced w-full h-full rounded-xl relative overflow-hidden">
				{/* Animated gradient overlay for visual appeal */}
				<div className="absolute inset-0 animated-gradient-bg rounded-xl"></div>

				{/* Image */}
				<div className="relative rounded-lg overflow-hidden">
					<div className="flex justify-center items-center">
						<Image
							src={
								project.images[0] ||
								project.logo ||
								'/placeholders/card-thumbnail-1.png'
							}
							alt="Picture of the author"
							width={300}
							height={180}
							className="m-4 border border-white/20 rounded-xl w-[300px] h-[180px] object-cover relative z-10"
						/>
					</div>
					<span
						className="absolute bottom-4 left-1/2 transform
           -translate-x-1/2 warm-cool-bg
           text-white text-sm text-center font-extrabold font-comfortaa
            px-3 py-1 pt-1 pb-1 rounded-tl-xl rounded-tr-xl w-2/6 z-10 shadow-lg"
					>
						APR: {project.avgApy.toFixed(2)}%
					</span>
				</div>

				{/* Title */}
				<div className="flex justify-center items-center mt-3 relative z-10">
					<h2 className="text-white text-2xl font-orbitron font-bold">
						{project.name || 'Unnamed Project'}
					</h2>
				</div>

				{/* Short Description */}
				<div className="flex justify-center items-center mt-5 relative z-10">
					<p className="px-10 text-white/90 text-sm font-comfortaa text-center">
						{project.short_description}
					</p>
				</div>

				{/* Button */}
				<div className="flex justify-center items-center m-6 relative z-10">
					<button
						className="text-white font-comfortaa text-sm font-bold p-2 px-6
           border border-white/30 rounded-3xl hover:warm-cool-bg hover:border-transparent
           transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
					>
						Connect Wallet
					</button>
				</div>

				{/* Line */}
				<div className="mb-6 relative z-10">
					<div className="flex justify-center items-center">
						<div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
					</div>
				</div>

				<div className="mt-2 m-8 flex justify-end items-center relative z-10">
					<span className="text-base font-comfortaa text-white/80">Detail</span>

					<button className="ml-2 hover:scale-110 transition-transform duration-300 text-white/80 hover:text-white">
						<DetailDownIcon />
					</button>
				</div>
			</div>
		</div>
	)
}

export default AllProjectCard
//230x570
