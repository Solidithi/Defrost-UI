import { permanentMarker } from '@/app/lib/font'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { useVTokenData } from '@/app/hooks/staking/useVTokenData'
import { TokenInfo, useAveragePoolAPYByStakingToken } from '@/app/store/staking'
import Link from 'next/link'
import Image from 'next/image'
import SocialLinks from '../UI/shared/SocialLinks'
import DefrostLogo from '@/public/Logo.png'
import SidebarLineChart from '../charts/SideBarLineChart'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/app/components/UI/shadcn/Tooltip'

interface SideBarProps {
	selectedVToken: TokenInfo | null
	onVTokenSelect?: (vToken: TokenInfo | null) => void
	socials?: {
		website?: string
		twitter?: string
		telegram?: string
		discord?: string
		github?: string
	}
}

const SideBar = ({ selectedVToken, onVTokenSelect, socials }: SideBarProps) => {
	const { availableVTokens, poolCountByVToken } = useVTokenData()

	// Only show socials if they exist and aren't empty strings
	const hasSocialLinks =
		socials &&
		Object.values(socials).some(
			(link) => typeof link === 'string' && link.trim() !== ''
		)

	const sections = [
		{
			id: 1,
			name: 'General',
			icon: '/sidebar/general.png',
		},
		{
			id: 2,
			name: 'Launchpool',
			icon: '/sidebar/launchpool.png',
		},
		{
			id: 3,
			name: 'Launchpad',
			icon: '/sidebar/launchpad.png',
		},
		{
			id: 4,
			name: 'NFT',
			icon: '/sidebar/nft.png',
		},
	]

	const [collapsed, setCollapsed] = useState(false)
	// const [hovering, setHovering] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) {
				setCollapsed(true)
			} else {
				setCollapsed(false)
			}
		}
		handleResize() // Initial check
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const isExpanded = !collapsed

	// Pool APY by selected vToken
	const { launchpoolAvgAPY } = useAveragePoolAPYByStakingToken(selectedVToken)

	return (
		<div
			// onMouseEnter={() => setHovering(true)}
			// onMouseLeave={() => setHovering(false)}
			className={`transition-all duration-300 ease-in-out ${isExpanded ? 'w-[250px]' : 'w-[80px]'}`}
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

				{/* Glass APY Stat */}
				{isExpanded && (
					<div className="mt-6 glass-component-1 rounded-xl">
						<div className="flex items-center">
							<div className="p-3 m-2 text-center w-1/2 flex flex-col justify-center items-center text-white font-orbitron font-bold">
								<span>APY</span>
								<div className="mt-2 text-xl">
									{launchpoolAvgAPY.toFixed(2)}%
								</div>
								{selectedVToken && (
									<div className="text-xs text-gray-400 mt-1">
										{selectedVToken.symbol}
									</div>
								)}
							</div>
							<div className="w-1/2 p-2 flex items-center">
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

				{/* vToken Selector  */}
				{isExpanded && onVTokenSelect && (
					<TooltipProvider>
						<div className="flex justify-center flex-wrap gap-x-2 gap-y-2 mt-4">
							{/* All vTokens option */}
							{availableVTokens.length > 0 && (
								<Tooltip>
									<TooltipTrigger asChild>
										<div
											onClick={() => onVTokenSelect(null)}
											className={`flex justify-center items-center glass-component-1 rounded-xl w-12 h-12 cursor-pointer transition-all duration-200 hover:scale-105 ${
												!selectedVToken
													? 'ring-2 ring-purple-500 bg-purple-500/20'
													: 'hover:bg-white/10'
											}`}
										>
											<div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 flex items-center justify-center w-8 h-8">
												<span className="text-white text-xs font-bold">
													ALL
												</span>
											</div>
										</div>
									</TooltipTrigger>
									<TooltipContent className="bg-black/80 border-white/10 text-white">
										<p>Show all vTokens</p>
									</TooltipContent>
								</Tooltip>
							)}
							{/* Available vToken options */}
							{availableVTokens.map((vToken) => {
								const isSelected =
									selectedVToken?.address.toLowerCase() ===
									vToken.address.toLowerCase()
								const poolCount =
									poolCountByVToken[vToken.address.toLowerCase()] || 0

								return (
									<Tooltip key={vToken.address}>
										<TooltipTrigger asChild>
											<div
												onClick={() => onVTokenSelect(vToken)}
												className={`flex justify-center items-center glass-component-1 rounded-xl w-12 h-12 cursor-pointer transition-all duration-200 hover:scale-105 ${
													isSelected
														? 'ring-2 ring-blue-500 bg-blue-500/20'
														: 'hover:bg-white/10'
												}`}
											>
												<div className="rounded-full p-0.5 w-8 h-8 flex items-center justify-center">
													<Image
														src={vToken.icon || '/token-logos/default.png'}
														alt={vToken.symbol}
														className="w-full h-full rounded-full"
														width={32}
														height={32}
													/>
												</div>
											</div>
										</TooltipTrigger>
										<TooltipContent className="bg-black/80 border-white/10 text-white">
											<p>
												{vToken.symbol} - {poolCount} pools
											</p>
										</TooltipContent>
									</Tooltip>
								)
							})}
						</div>
					</TooltipProvider>
				)}

				{/* Collapsed vToken icons */}
				{!isExpanded && onVTokenSelect && (
					<TooltipProvider>
						<div className="flex flex-col gap-2 mt-4">
							{/* 'All' option */}
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										onClick={() => onVTokenSelect(null)}
										className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
											!selectedVToken
												? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 ring-2 ring-purple-500/50'
												: 'bg-white/10 hover:bg-white/20'
										}`}
									>
										<span className="text-white text-xs font-bold">ALL</span>
									</button>
								</TooltipTrigger>
								<TooltipContent className="bg-black/80 border-white/10 text-white">
									<p>Show all vTokens</p>
								</TooltipContent>
							</Tooltip>

							{/* Other vTokens options */}
							{availableVTokens.slice(0, 4).map((vToken) => {
								const isSelected =
									selectedVToken?.address.toLowerCase() ===
									vToken.address.toLowerCase()
								const poolCount =
									poolCountByVToken[vToken.address.toLowerCase()] || 0

								return (
									<Tooltip key={vToken.address}>
										<TooltipTrigger asChild>
											<button
												onClick={() => onVTokenSelect(vToken)}
												className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
													isSelected
														? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 ring-2 ring-blue-500/50'
														: 'bg-white/10 hover:bg-white/20'
												}`}
											>
												<div className="w-8 h-8 rounded-full flex items-center justify-center">
													<Image
														src={vToken.icon || '/token-logos/default.png'}
														alt={vToken.symbol}
														width={32}
														height={32}
														className="w-full h-full rounded-full"
													/>
												</div>
											</button>
										</TooltipTrigger>
										<TooltipContent className="bg-black/80 border-white/10 text-white">
											<p>
												{vToken.symbol} - {poolCount} pools
											</p>
										</TooltipContent>
									</Tooltip>
								)
							})}
						</div>
					</TooltipProvider>
				)}

				{/* Navigation sections */}
				<div className="">
					{sections.map((section) => (
						<Link
							href={`/${section.name.toLowerCase()}`}
							key={section.id}
							className={`text-white font-orbitron font-bold text-base hover:bg-white/10 p-2 rounded-xl flex items-center ${isExpanded ? 'mt-14' : 'mt-4'}`}
						>
							<div className="flex justify-start items-center gap-4">
								<div className="w-10 h-10 rounded-full flex justify-center items-center">
									<Image
										src={section.icon}
										alt=""
										className="w-6 h-6"
										width={24}
										height={24}
									/>
								</div>
								{isExpanded && section.name}
							</div>
						</Link>
					))}
				</div>

				{/* Social Media Links */}
				{isExpanded && hasSocialLinks && (
					<div className="mt-14 border-t border-gray-600/40 pt-4">
						<SocialLinks socials={socials} />
					</div>
				)}
			</div>
		</div>
	)
}

export default SideBar
