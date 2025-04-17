'use client'

import Image from 'next/image'
import Logo from '@/public/Logo.png'
import { useState } from 'react'
import { GlowingEffect } from './GlowingEffect'

const AllProjectCard = () => {
	const [projectAPR, setProjectAPR] = useState(0)
	const [projectName, setProjectName] = useState('Project Name')
	const [projectShortDescription, setProjectShortDescription] = useState(
		'Lorem ipsum iba daba doo Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has'
	)

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
		<div className="relative shadow-lg">
			{/* Apply GlowingEffect */}
			<GlowingEffect
				spread={40} // Controls how far the glow effect spreads
				glow={true} // Enables glow effect
				disabled={false} // Ensures effect is active
				proximity={64} // Controls how close the cursor needs to be
				inactiveZone={0.01} // Defines the inactive zone
				className="absolute inset-0 rounded-2xl"
			/>

			<div className="glass-component-3 w-full h-full rounded-xl ">
				{/* Image */}
				<div className="relative rounded-lg overflow-hidden">
					<div className="flex justify-center items-center">
						<Image
							src=""
							alt="Picture of the author"
							width={300}
							height={180}
							className="m-4 border border-gray-300 rounded-xl"
						/>
					</div>
					<span
						className="absolute bottom-4 left-1/2 transform
           -translate-x-1/2 bg-white 
           text-black text-sm text-center font-extrabold font-comfortaa
            px-3 py-1 pt-1 pb-1 rounded-tl-xl rounded-tr-xl w-2/6"
					>
						APR: {projectAPR}%
					</span>
				</div>

				{/* Title */}
				<div className="flex justify-center items-center mt-3">
					<h2 className="text-white text-2xl font-orbitron font-bold">
						{projectName}
					</h2>
				</div>

				{/* Short Description */}
				<div className="flex justify-center items-center mt-5">
					<p className="px-10 text-white text-sm font-comfortaa text-center">
						{projectShortDescription}
					</p>
				</div>

				{/* Button */}
				<div className="flex justify-center items-center m-6">
					<button
						className=" text-white font-comfortaa text-sm font-bold p-2 px-6
           border border-white rounded-3xl"
					>
						Connect Wallet
					</button>
				</div>

				{/* Line */}
				<div className="mb-6">
					<div className="flex justify-center items-center">
						<div className="w-full h-[1px] bg-white"></div>
					</div>
				</div>

				<div className="mt-2 m-8 flex justify-end items-center">
					<span className="text-base font-comfortaa">Detail</span>

					<button className="ml-2">
						<DetailDownIcon />
					</button>
				</div>
			</div>
		</div>
	)
}

export default AllProjectCard
//230x570
