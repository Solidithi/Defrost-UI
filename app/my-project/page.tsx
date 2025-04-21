'use client'

import { useState, useEffect } from 'react'
import { shortenStr } from '../lib/utils'
import { EnrichedProject } from '@/custom-types/project'
import SwitchTableOrCard from '@/app/components/UI/SwitchTableOrCard'
import DataTable from '@/app/components/UI/DataTable'
import { Column } from '@/app/components/UI/DataTable'
import Head from 'next/head'
import Image from 'next/image'
import Spinner from '../components/UI/Spinner'

export default function MyProject() {
	const [sortOption, setSortOption] = useState('newest')
	const [filterCriteria, setFilterCriteria] = useState('all')
	const [projects, setProjects] = useState<EnrichedProject[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isCardView, setIsCardView] = useState(true)

	const fetchProjects = async () => {
		setIsLoading(true)
		fetch(
			'/api/my-project?' +
				new URLSearchParams({
					address: '0xfd48761638e3a8c368abaefa9859cf6baa6c3c27',
				}).toString(),
			{
				method: 'GET',
			}
		)
			.then((raw) => raw.json())
			.catch((error) => console.error('Error fetching projects:', error))
			.then((res) => {
				console.log('fetched projects: ', res.projects)
				setProjects(res.projects || [])
				setIsLoading(false)
			})
	}

	useEffect(() => {
		fetchProjects()
	}, [])

	// Filter projects based on selected criteria
	const filteredProjects = projects
		.filter((project) => {
			// First apply search filter
			if (
				searchQuery !== '' &&
				!project.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!project.short_description
					?.toLowerCase()
					.includes(searchQuery.toLowerCase())
			) {
				return false
			}

			// Then apply category filter
			switch (filterCriteria) {
				case 'all':
					return true
				case 'has-pools':
					return project.unifiedPools && project.unifiedPools.length > 0
				case 'no-pools':
					return !project.unifiedPools || project.unifiedPools.length === 0
				case 'high-apy':
					return project.unifiedPools?.some((pool) => pool.staker_apy > 10) // APY > 10%
				case 'active-stakers':
					return project.unifiedPools?.some((pool) => pool.total_stakers > 5) // More than 5 stakers
				default:
					return true
			}
		})
		.sort((a, b) => {
			if (sortOption === 'newest') {
				return (
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				)
			} else if (sortOption === 'oldest') {
				return (
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
				)
			} else if (sortOption === 'alphabetical') {
				return (a.name || '').localeCompare(b.name || '')
			} else if (sortOption === 'most-staked') {
				return b.totalStaked - a.totalStaked
			}
			return 0
		})

	// Define columns for the DataTable
	const tableColumns: Column<EnrichedProject>[] = [
		{
			header: 'Project',
			accessor: (project: EnrichedProject) => (
				<div className="flex items-center">
					{project.logo ? (
						<div className="h-8 w-8 mr-3 rounded-full flex items-center justify-center overflow-hidden">
							<img
								src={`data:image/png;base64,${project.logo}`}
								alt={`${project.name} logo`}
								className="w-full h-full object-cover"
							/>
						</div>
					) : (
						<div className="h-8 w-8 mr-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
					)}
					<div>
						<div className="font-medium">{project.name}</div>
						<div className="text-xs text-gray-400">
							{shortenStr(project.owner_id || '')}
						</div>
					</div>
				</div>
			),
		},
		{
			header: 'Pools',
			accessor: (project: EnrichedProject) => project.poolCount,
		},
		{
			header: 'Total Staked',
			accessor: (project: EnrichedProject) =>
				project.totalStaked.toLocaleString(),
		},
		{
			header: 'APY',
			accessor: (project: EnrichedProject) =>
				project.avgApy > 0 ? `${project.avgApy.toFixed(2)}%` : '-',
		},
		{
			header: 'Created',
			accessor: (project: EnrichedProject) =>
				new Date(project.created_at).toLocaleDateString(),
		},
	]

	// Define actions for DataTable rows
	const renderTableActions = (project: EnrichedProject) => (
		<div className="flex justify-end space-x-2">
			<button className="bg-transparent border border-[#54A4F2] rounded-full px-3 py-1 text-xs font-bold text-[#54A4F2]">
				View
			</button>
			<button className="bg-gradient-to-r from-[#F05550] to-[#54A4F2] rounded-full px-3 py-1 text-xs font-bold">
				Edit
			</button>
		</div>
	)

	return (
		<div className="min-h-screen relative">
			{/* Background layer - fixed position */}
			<div className="fixed inset-0 bg-[#020203] bg-[url('/my-project/bg-beam.png')] bg-cover bg-center z-0"></div>

			{/* Content layer - with padding/margin for offset */}
			<div className="relative z-10 min-h-screen text-white mt-44 mb-16">
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
						width={1200}
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

					{/* Project Control Panel */}
					<div className="glass-component-3 rounded-2xl p-3 mb-8 mx-auto select-none">
						{/* White stroke */}
						<div className="absolute inset-0 border-[0.5px] border-white border-opacity-20 rounded-2xl pointer-events-none"></div>

						<div className="flex flex-wrap justify-between items-center p-2 font-comfortaa">
							{/* Filter Criteria */}
							<div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
								{[
									{ id: 'all', label: 'All Projects' },
									{ id: 'has-pools', label: 'With Pools' },
									{ id: 'no-pools', label: 'Without Pools' },
									{ id: 'high-apy', label: 'High APY' },
									{ id: 'active-stakers', label: 'Active Stakers' },
								].map((filter) => (
									<button
										key={filter.id}
										className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-all ${
											filterCriteria === filter.id
												? 'bg-gradient-to-r from-[#F05550] to-[#54A4F2] text-white'
												: 'bg-black bg-opacity-30 text-gray-300 hover:bg-opacity-40'
										}`}
										onClick={() => setFilterCriteria(filter.id)}
									>
										{filter.label}
									</button>
								))}
							</div>

							{/* Controls */}
							<div className="flex items-center space-x-3 mt-2 sm:mt-0">
								<div className="flex items-center">
									<span className="text-xs text-gray-300 mr-2">Sort:</span>
									<select
										className="bg-black bg-opacity-30 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
										value={sortOption}
										onChange={(e) => setSortOption(e.target.value)}
									>
										<option value="newest">Newest</option>
										<option value="oldest">Oldest</option>
										<option value="alphabetical">A-Z</option>
										<option value="most-staked">Most Staked</option>
									</select>
								</div>

								{/* View Type Toggle - Card/Table */}
								<SwitchTableOrCard
									isCard={isCardView}
									setIsCard={setIsCardView}
								></SwitchTableOrCard>
							</div>
						</div>
					</div>

					<div className="flex justify-between items-center mb-8">
						<div>
							<h2 className="text-2xl font-orbitron font-bold mb-1">
								Your Projects
							</h2>
							<p className="text-sm text-gray-400">
								{filteredProjects.length} projects found
							</p>
						</div>
						<div className="relative">
							<input
								type="text"
								placeholder="Search project"
								className="glass-component-3 rounded-lg py-3 px-10 text-md font-orbitron focus:outline-none focus:ring-0"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
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

					{/* Project Stats Summary */}
					<div className="glass-component-3 rounded-2xl p-6 mb-8 mx-auto">
						<div className="absolute inset-0 border-[0.5px] border-white border-opacity-20 rounded-2xl pointer-events-none"></div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
							<div className="text-center">
								<div className="text-sm text-gray-300">Total Projects</div>
								<div className="text-2xl font-orbitron font-bold mt-1">
									{projects.length}
								</div>
							</div>
							<div className="text-center">
								<div className="text-sm text-gray-300">Total Pools</div>
								<div className="text-2xl font-orbitron font-bold mt-1">
									{projects.reduce(
										(acc, project) => acc + project.poolCount,
										0
									)}
								</div>
							</div>
							<div className="text-center">
								<div className="text-sm text-gray-300">Total Value Staked</div>
								<div className="text-2xl font-orbitron font-bold mt-1">
									{projects
										.reduce((acc, project) => acc + project.totalStaked, 0)
										.toLocaleString()}
								</div>
							</div>
						</div>
					</div>

					{/* Project list */}
					{isLoading ? (
						<div className="glass-component-3 w-full max-w-6xl rounded-[26px] p-8 flex flex-col items-center justify-center mx-auto">
							{/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div> */}
							<Spinner className="border-blue-500" />
							<div className="text-xl font-orbitron">Loading projects...</div>
						</div>
					) : (
						<div className="space-y-10 mb-16 flex flex-col items-center font-comfortaa">
							{filteredProjects.length === 0 ? (
								<div className="glass-component-3 w-full max-w-6xl rounded-[26px] p-8 flex flex-col items-center justify-center">
									<div className="text-xl font-orbitron mb-4">
										No projects found
									</div>
									<div className="text-sm text-gray-400 mb-6">
										Create your first project or adjust your search criteria
									</div>
									<button className="bg-gradient-to-r from-[#F05550] to-[#54A4F2] rounded-full px-6 py-2 text-sm font-bold">
										Create New Project
									</button>
								</div>
							) : (
								<>
									{isCardView ? (
										filteredProjects.map((project) => (
											<div
												key={project.id}
												className="glass-component-3 w-full max-w-6xl rounded-[26px] p-4 flex items-center relative"
											>
												{/* White stroke */}
												<div className="absolute inset-0 border-[0.5px] border-white border-opacity-20 rounded-[26px] pointer-events-none"></div>

												{/* Project logo */}
												{project.logo ? (
													<div className="h-10 w-10 mr-4 rounded-full flex items-center justify-center overflow-hidden">
														<img
															src={`data:image/png;base64,${project.logo}`}
															alt={`${project.name} logo`}
															className="w-full h-full object-cover"
															onError={(e) => {
																e.currentTarget.onerror = null
																e.currentTarget.src =
																	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
																e.currentTarget.parentElement?.classList.add(
																	'bg-gradient-to-br',
																	'from-purple-500',
																	'to-blue-500'
																)
															}}
														/>
													</div>
												) : (
													<div className="h-10 w-10 mr-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
														<div className="h-3 w-3 bg-white rounded-full" />
													</div>
												)}

												<div className="flex-1">
													<div className="font-bold font-orbitron">
														{project.name}
													</div>
													<div className="text-xs text-gray-400">
														{project.short_description}
													</div>
												</div>

												<div className="flex-1">
													<div className="text-sm">
														{project.tokenAddress ? (
															<>Token: {shortenStr(project.tokenAddress)}</>
														) : (
															<>Pools: {project.poolCount}</>
														)}
													</div>
													<div className="text-xs text-gray-400">
														Total staked: {project.totalStaked.toLocaleString()}{' '}
														{project.token_symbol || 'tokens'}
													</div>
												</div>

												<div className="flex-1">
													<div className="text-sm">
														{project.avgApy > 0 ? (
															<>Average APY: {project.avgApy.toFixed(2)}%</>
														) : (
															<>Stakers: {project.totalStakers}</>
														)}
													</div>
													<div className="text-xs text-gray-400">
														Created:&nbsp;
														{new Date(project.created_at).toLocaleDateString()}
													</div>
												</div>

												<div className="flex space-x-2">
													<button className="bg-transparent border border-[#54A4F2] rounded-full px-4 py-1 text-sm font-bold text-[#54A4F2] hover:bg-[#54A4F2] hover:bg-opacity-10 transition-colors">
														View
													</button>
													<button className="bg-gradient-to-r from-[#F05550] to-[#54A4F2] bg-opacity-70 rounded-full px-4 py-1 text-sm font-bold">
														Edit
													</button>
												</div>
											</div>
										))
									) : (
										<DataTable
											data={filteredProjects}
											columns={tableColumns}
											keyField="id"
											renderActions={renderTableActions}
											className="max-w-6xl"
											noDataMessage="No projects found"
										/>
									)}
								</>
							)}
						</div>
					)}

					{filteredProjects.length > 10 && (
						<div className="flex justify-center mt-6 select-none">
							<button className="bg-gradient-to-r from-[#F05550] to-[#54A4F2] rounded-full px-8 py-2 text-sm font-bold">
								Show more
							</button>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
