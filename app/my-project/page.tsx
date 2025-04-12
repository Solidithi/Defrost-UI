'use client'

import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

export default function MyProject() {
	const [activeTab, setActiveTab] = useState('On-going')
	const projectData = [
		{
			id: 1,
			name: "Project's name",
			shortDesc: 'Short desc goes here',
			token: 'BNB',
			staked: 492.92,
			apr: 3.13,
			days: 77,
		},
		{
			id: 2,
			name: "Project's name",
			shortDesc: 'Short desc goes here',
			token: 'BNB',
			staked: 492.92,
			apr: 3.13,
			days: 77,
		},
		{
			id: 3,
			name: "Project's name",
			shortDesc: 'Short desc goes here',
			token: 'BNB',
			staked: 492.92,
			apr: 3.13,
			days: 77,
		},
		{
			id: 4,
			name: "Project's name",
			shortDesc: 'Short desc goes here',
			token: 'BNB',
			staked: 492.92,
			apr: 3.13,
			days: 77,
		},
		{
			id: 5,
			name: "Project's name",
			shortDesc: 'Short desc goes here',
			token: 'BNB',
			staked: 492.92,
			apr: 3.13,
			days: 77,
		},
		{
			id: 6,
			name: "Project's name",
			shortDesc: 'Short desc goes here',
			token: 'BNB',
			staked: 492.92,
			apr: 3.13,
			days: 77,
		},
	]

	return (
		<div className="min-h-screen relative">
			{/* Background layer - fixed position */}
			<div className="fixed inset-0 bg-[#020203] bg-[url('/my-project/bg-beam.png')] bg-cover bg-center z-0"></div>

			{/* Content layer - with padding/margin for offset */}
			<div className="relative z-10 min-h-screen text-white mt-44">
				<Head>
					<title>DeFi Dashboard</title>
					<meta name="description" content="DeFi Project Dashboard" />
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<div className="max-w-full w-full mb-8">
					<Image
						src="/my-project/banner.png"
						alt="Banner"
						layout="responsive"
						width={1200} // Example width, adjust for aspect ratio
						height={675}
					/>
				</div>

				<main className="max-w-7xl mx-auto my-auto">
					{/* Floating badge for decoration */}
					<div className="flex items-center mb-8">
						<div className="h-12 w-12 relative">
							<div className="absolute inset-0 bg-blue-400 opacity-70 rounded-full" />
							<div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
								<div className="h-8 w-8 bg-gradient-to-br from-blue-300 to-purple-500 rounded-full" />
							</div>
							<div className="absolute top-0 left-0 h-full w-full">
								<div className="h-4 w-2 bg-purple-400 absolute top-0 left-5 transform -translate-x-1/2 rotate-45" />
								<div className="h-4 w-2 bg-blue-400 absolute bottom-0 left-5 transform -translate-x-1/2 -rotate-45" />
								<div className="h-4 w-2 bg-purple-400 absolute top-0 right-3 transform translate-x-1/2 -rotate-45" />
								<div className="h-4 w-2 bg-blue-400 absolute bottom-0 right-3 transform translate-x-1/2 rotate-45" />
								<div className="h-2 w-4 bg-purple-400 absolute left-0 top-5 transform -translate-y-1/2 rotate-90" />
								<div className="h-2 w-4 bg-blue-400 absolute right-0 top-5 transform -translate-y-1/2 -rotate-90" />
							</div>
						</div>
					</div>

					{/* Tabs */}
					<div className="glass-component-3 rounded-2xl p-3 mb-8 mx-auto select-none">
						{/* White stroke */}
						<div className="absolute inset-0 border-[0.5px] border-white border-opacity-20 rounded-2xl pointer-events-none"></div>
						<div className="text-lg flex justify-around font-comfortaa">
							{['All Projects', 'Upcoming', 'On-going', 'Ended'].map((tab) => (
								<button
									key={tab}
									className={`px-4 py-2 text relative ${
										activeTab === tab ? 'text-[#F05550] font-bold' : ''
									}`}
									onClick={() => setActiveTab(tab)}
								>
									{tab}
									{/* Underline for selected */}
									<div
										className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#F05550] transition-opacity ${
											activeTab === tab ? 'opacity-100' : 'opacity-0'
										}`}
									></div>
								</button>
							))}
						</div>
					</div>

					<div className="flex justify-between items-center mb-16">
						<h2 className="text-2xl font-orbitron font-bold">Your Project</h2>
						<div className="relative">
							<input
								type="text"
								placeholder="Search project"
								className="glass-component-3 rounded-lg py-3 px-10 text-md font-orbitron focus:outline-none focus:ring-0"
							/>
							<svg
								className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					</div>

					{/* Project list */}
					<div className="space-y-10 flex flex-col items-center font-comfortaa">
						{projectData.map((project) => (
							<div
								key={project.id}
								className="glass-component-3 w-full max-w-6xl rounded-[26px] p-4 flex items-center relative"
							>
								{/* White stroke */}
								<div className="absolute inset-0 border-[0.5px] border-white border-opacity-20 rounded-[26px] pointer-events-none"></div>

								<div className="h-10 w-10 mr-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
									<div className="h-3 w-3 bg-white rounded-full" />
								</div>

								<div className="flex-1">
									<div className="font-bold font-orbitron">{project.name}</div>
									<div className="text-xs text-gray-400">
										{project.shortDesc}
									</div>
								</div>

								<div className="flex-1">
									<div className="text-sm">Token: {project.token}</div>
									<div className="text-xs text-gray-400">
										Total staked: {project.staked} {project.token}
									</div>
								</div>

								<div className="flex-1">
									<div className="text-sm">APR: {project.apr}%</div>
									<div className="text-xs text-gray-400">
										Ends in: {project.days} days
									</div>
								</div>

								<button className="bg-gradient-to-r from-[#F05550] to-[#54A4F2] bg-opacity-70 rounded-full px-4 py-1 text-sm font-bold">
									Edit
								</button>
							</div>
						))}
					</div>

					<div className="flex justify-center mt-6">
						<button className="bg-gradient-to-r from-[#F05550] to-[#54A4F2] rounded-full px-8 py-2 text-sm font-bold">
							Show more
						</button>
					</div>
				</main>
			</div>
		</div>
	)
}
