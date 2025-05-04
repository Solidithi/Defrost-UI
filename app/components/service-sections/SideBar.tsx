import { permanentMarker } from '@/app/lib/font'
import Link from 'next/link'
import Image from 'next/image'
import DefrostLogo from '@/public/Logo.png'
import SidebarLineChart from '../charts/SideBarLineChart'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useHoverSideBarIndexStore } from '@/app/store/launchpool'
import SocialLinks from '../UI/shared/SocialLinks'

interface SideBarProps {
	socials?: {
		website?: string
		twitter?: string
		telegram?: string
		discord?: string
		github?: string
	}
}

const SideBar = ({ socials }: SideBarProps) => {
	const { hoveredData, setHoveredData } = useHoverSideBarIndexStore()

	// Only show socials if they exist and aren't empty strings
	const hasSocialLinks =
		socials &&
		Object.values(socials).some(
			(link) => typeof link === 'string' && link.trim() !== ''
		)

	const availableNetworks = [
		{
			id: 1,
			name: 'Ethereum',
			chainId: 1,
			chain: 'ETH',
		},
		{
			id: 2,
			name: 'Binance Smart Chain',
			chainId: 56,
			chain: 'BSC',
		},
		{
			id: 3,
			name: 'Polygon',
			chainId: 137,
			chain: 'MATIC',
		},
		// {
		// 	id: 4,
		// 	name: 'Avalanche',
		// 	chainId: 43114,
		// 	chain: 'AVAX',
		// },
		// {
		// 	id: 5,
		// 	name: 'Fantom',
		// 	chainId: 250,
		// 	chain: 'FTM',
		// },
		// {
		// 	id: 6,
		// 	name: 'Arbitrum',
		// 	chainId: 42161,
		// 	chain: 'ARB',
		// },
		// {
		// 	id: 7,
		// 	name: 'Optimism',
		// 	chainId: 10,
		// 	chain: 'OP',
		// },
		// {
		// 	id: 8,
		// 	name: 'Solana',
		// 	chainId: 501,
		// 	chain: 'SOL',
		// },
		// {
		// 	id: 9,
		// 	name: 'Cardano',
		// 	chainId: 201,
		// 	chain: 'ADA',
		// },
	]

	const sections = [
		{
			id: 1,
			name: 'General',
			icon: '/icons/staking.svg',
		},
		{
			id: 2,
			name: 'Launchpool',
			icon: '/icons/farming.svg',
		},
		{
			id: 3,
			name: 'Launchpad',
			icon: '/icons/liquidity.svg',
		},
		{
			id: 4,
			name: 'NFT',
			icon: '/icons/nft.svg',
		},
		// {
		// 	id: 5,
		// 	name: 'Marketplace',
		// 	icon: '/icons/marketplace.svg',
		// },
		// {
		// 	id: 6,
		// 	name: 'Wallet',
		// 	icon: '/icons/wallet.svg',
		// },
		// {
		// 	id: 7,
		// 	name: 'Bridge',
		// 	icon: '/icons/bridge.svg',
		// },
		// {
		// 	id: 8,
		// 	name: 'Staking',
		// 	icon: '/icons/staking.svg',
		// },
	]

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
		handleResize() // Initial check
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const isExpanded = hovering || !collapsed

	return (
		<div
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
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
				{/* Glass APR Stat */}
				{isExpanded && (
					<div className="mt-6 glass-component-1 rounded-xl">
						<div className="flex">
							<div className="p-3 text-center w-1/2 text-white font-orbitron font-bold">
								APR
								<div className="mt-2 text-xl">{hoveredData}%</div>
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
				{/* Hide available networks when collapsed */}
				{isExpanded && (
					<div className="flex justify-center flex-wrap gap-x-8 gap-y-2 mt-4">
						{availableNetworks.map((network) => (
							<div
								key={network.id}
								className=" flex justify-center items-center glass-component-1 rounded-xl w-12 h-12"
							>
								<div className=" bg-white rounded-full">
									<Image
										src={DefrostLogo}
										alt=""
										className="w-9 h-9"
										width={32}
										height={32}
									/>
								</div>
							</div>
						))}
					</div>
				)}
				<div className="">
					{sections.map((section) => (
						<Link
							href={`/${section.name.toLowerCase()}`}
							key={section.id}
							className={`text-white font-orbitron font-bold text-base hover:bg-white/10 p-2 rounded-xl flex items-center ${isExpanded ? 'mt-14' : 'mt-4'}`}
						>
							<div className="flex justify-start items-center gap-4">
								<div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
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
