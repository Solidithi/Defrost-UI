'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { permanentMarker } from '@/app/lib/font'
import { TokenInfo } from '@/app/store/staking'
import { useVTokenData } from '@/app/hooks/staking/useVTokenData'
import SocialLinks from '../shared/SocialLinks'
import SidebarLineChart from '../../charts/SideBarLineChart'
import DefrostLogo from '@/public/Logo.png'

interface VTokenSidebarProps {
	selectedVToken: TokenInfo | null
	onVTokenSelect: (vToken: TokenInfo | null) => void
	socials?: {
		website?: string
		twitter?: string
		telegram?: string
		discord?: string
		github?: string
	}
}

export function VTokenSidebar({
	selectedVToken,
	onVTokenSelect,
	socials,
}: VTokenSidebarProps) {
	const { availableVTokens, poolCountByVToken, totalStakedByVToken } =
		useVTokenData()
	const [collapsed, setCollapsed] = useState(false)
	const [hovering, setHovering] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) {
				setCollapsed(true)
			} else {
				setCollapsed(false)
			}
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const isExpanded = hovering || !collapsed

	// Only show socials if they exist and aren't empty strings
	const hasSocialLinks =
		socials &&
		Object.values(socials).some(
			(link) => typeof link === 'string' && link.trim() !== ''
		)

	// Mock APR data for the selected vToken
	const selectedVTokenAPR = selectedVToken ? '12.5' : '0'

	return (
		<div
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			className={`transition-all duration-300 ease-in-out ${isExpanded ? 'w-[280px]' : 'w-[80px]'}`}
		>
			<div
				className={`glass-component-1 rounded-xl p-5 relative ${isExpanded ? '' : 'flex flex-col items-center'}`}
			>
				{/* Title area */}
				<div className="w-full mb-4">
					{!isExpanded ? (
						<div className="flex justify-center">
							<button
								className="bg-white rounded-full p-1 shadow-md"
								onClick={() => setCollapsed(!collapsed)}
							>
								<ChevronLeft size={16} className="rotate-180" />
							</button>
						</div>
					) : (
						<div className="flex justify-between items-center">
							<div className="flex items-center">
								<Image src={DefrostLogo} alt="Logo" className="h-7 w-7 mr-2" />
								<Link href={'/'}>
									<span
										style={{ fontFamily: permanentMarker.style.fontFamily }}
										className="text-2xl tracking-tight text-white font-bold"
									>
										Defrost
									</span>
								</Link>
							</div>
							<button
								className="bg-white rounded-full p-1 shadow-md"
								onClick={() => setCollapsed(!collapsed)}
							>
								<ChevronLeft size={16} />
							</button>
						</div>
					)}
				</div>

				{/* Selected vToken APR Display */}
				{isExpanded && selectedVToken && (
					<div className="mt-6 glass-component-1 rounded-xl">
						<div className="flex">
							<div className="p-3 text-center w-1/2 text-white font-orbitron font-bold">
								APR
								<div className="mt-2 text-xl">{selectedVTokenAPR}%</div>
								<div className="text-xs text-gray-400 mt-1">
									{selectedVToken.symbol}
								</div>
							</div>
							<div className="w-1/2 p-2">
								<SidebarLineChart
									data={[
										10, 20, 30, 24, 35, 40, 35, 60, 57, 80, 48, 67, 79, 95,
									]}
									height={60}
									gradientFrom="#F05550"
									gradientTo="#54A4F2"
								/>
							</div>
						</div>
					</div>
				)}

				{/* vToken Selection */}
				{isExpanded && (
					<div className="mt-4">
						<div className="text-white text-sm font-medium mb-3">
							Select vToken
						</div>
						<div className="space-y-2">
							{/* All vTokens option */}
							<button
								onClick={() => onVTokenSelect(null)}
								className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
									!selectedVToken
										? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
										: 'bg-white/5 hover:bg-white/10 border border-transparent'
								}`}
							>
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
										<BarChart3 size={16} className="text-white" />
									</div>
									<div className="text-left">
										<div className="text-white font-medium">All vTokens</div>
										<div className="text-gray-400 text-xs">
											{availableVTokens.length} pools total
										</div>
									</div>
								</div>
							</button>

							{/* Individual vTokens */}
							{availableVTokens.map((vToken) => {
								const poolCount =
									poolCountByVToken[vToken.address.toLowerCase()] || 0
								const totalStaked =
									totalStakedByVToken[vToken.address.toLowerCase()] || '0'
								const isSelected =
									selectedVToken?.address.toLowerCase() ===
									vToken.address.toLowerCase()

								return (
									<button
										key={vToken.address}
										onClick={() => onVTokenSelect(vToken)}
										className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
											isSelected
												? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
												: 'bg-white/5 hover:bg-white/10 border border-transparent'
										}`}
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
												<Image
													src={vToken.icon || '/token-logos/default.png'}
													alt={vToken.symbol}
													width={24}
													height={24}
													className="rounded-full"
												/>
											</div>
											<div className="text-left">
												<div className="text-white font-medium">
													{vToken.symbol}
												</div>
												<div className="text-gray-400 text-xs">
													{poolCount} pools • {totalStaked} staked
												</div>
											</div>
										</div>
										{isSelected && (
											<div className="w-2 h-2 rounded-full bg-blue-500"></div>
										)}
									</button>
								)
							})}
						</div>
					</div>
				)}

				{/* Collapsed vToken icons */}
				{!isExpanded && (
					<div className="flex flex-col gap-2 mt-4">
						{/* All option */}
						<button
							onClick={() => onVTokenSelect(null)}
							className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
								!selectedVToken
									? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-500/50'
									: 'bg-white/10 hover:bg-white/20'
							}`}
						>
							<BarChart3 size={20} className="text-white" />
						</button>

						{/* Individual vTokens */}
						{availableVTokens.map((vToken) => {
							const isSelected =
								selectedVToken?.address.toLowerCase() ===
								vToken.address.toLowerCase()

							return (
								<button
									key={vToken.address}
									onClick={() => onVTokenSelect(vToken)}
									className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
										isSelected
											? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-500/50'
											: 'bg-white/10 hover:bg-white/20'
									}`}
								>
									<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
										<Image
											src={vToken.icon || '/token-logos/default.png'}
											alt={vToken.symbol}
											width={20}
											height={20}
											className="rounded-full"
										/>
									</div>
								</button>
							)
						})}
					</div>
				)}

				{/* Social Media Links */}
				{isExpanded && hasSocialLinks && (
					<div className="mt-8 border-t border-gray-600/40 pt-4">
						<SocialLinks socials={socials} />
					</div>
				)}
			</div>
		</div>
	)
}
