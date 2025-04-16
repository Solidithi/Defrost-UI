'use client'
import React, { useState, useEffect } from 'react'
import {
	motion,
	AnimatePresence,
	// useScroll,
	// useMotionValueEvent,
} from 'framer-motion'
import { cn } from '../lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import DefrostLogo from '../../public/Logo.png'
import { Menu, X } from 'lucide-react'
import { orbitron, comfortaa, permanentMarker } from '../lib/font'
// import ConnectButton, { useNavbarVisibility } from './ConnectButton'
import ConnectButton from './ConnectButton'

const Navbar = ({
	navItems,
	className,
}: {
	navItems: {
		name: string
		link: string
		icon?: JSX.Element
	}[]
	className?: string
}) => {
	const [toggle, setToggle] = useState(false)
	const toggleNavbar = () => setToggle(!toggle)

	// const { scrollY } = useScroll()
	const [visible, setVisible] = useState(true)

	useEffect(() => {
		let lastScrollY = window.scrollY

		const handleScroll = () => {
			const currentScrollY = window.scrollY

			if (currentScrollY < 50) {
				setVisible(true)
			} else if (currentScrollY > lastScrollY) {
				setVisible(false)
			} else {
				setVisible(true)
			}

			lastScrollY = currentScrollY
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 1, y: 0 }}
				animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
				transition={{ duration: 0.2 }}
				style={{ fontFamily: orbitron.style.fontFamily }}
				className={cn(
					'fixed top-0 inset-x-0 mx-auto z-[5000] max-w-fit rounded-full  shadow-lg px-5 py-2 space-x-4 mt-10 glass-component-1 ',
					className
				)}
			>
				<div className="flex justify-between items-center gap-36">
					<div className="flex items-center flex-shrink-0 transition-transform transform hover:-translate-y-1 duration-300 p-3">
						<Image src={DefrostLogo} alt="Logo" className="h-10 w-10 mr-2" />
						<Link href={'/'}>
							<span
								style={{ fontFamily: permanentMarker.style.fontFamily }}
								className="text-3xl tracking-tight text-white font-bold "
							>
								Defrost
							</span>
						</Link>
					</div>
					<div className="hidden lg:flex items-center space-x-4 gap-5 ">
						{navItems.map((navItem, idx) => (
							<Link
								key={`link=${idx}`}
								href={navItem.link}
								className="relative dark:text-neutral-50 flex items-center space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
							>
								<span className="block sm:hidden">{navItem.icon}</span>
								<span
									style={{ fontFamily: comfortaa.style.fontFamily }}
									className="hidden sm:block text-md hover:text-[#B2423F] duration-150 text-white active:text-[#F05550] "
								>
									{navItem.name}
								</span>
							</Link>
						))}
					</div>

					<ConnectButton />

					<div className="lg:hidden md:flex flex-col justify-end">
						<button onClick={toggleNavbar}>
							{toggle ? (
								<X size={24} color="white" />
							) : (
								<Menu size={24} color="white" />
							)}
						</button>
					</div>
				</div>

				{toggle && (
					<div className="fixed right-0 z-20 bg-[#000626] w-full p-12 flex flex-col justify-center items-center lg:hidden">
						<div className="py-5 flex flex-col items-center space-y-5">
							{navItems.map((navItem, idx) => (
								<Link
									key={`link=${idx}`}
									href={navItem.link}
									className="relative dark:text-neutral-50 flex items-center space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
								>
									<span className="block sm:hidden">{navItem.icon}</span>
									<span
										style={{ fontFamily: comfortaa.style.fontFamily }}
										className="hidden sm:block text-md hover:text-[#B2423F] duration-150 active:text-[#F05550]"
									>
										{navItem.name}
									</span>
								</Link>
							))}
						</div>

						<button className="bg-gradient-to-r from-[#F05550] to-[#54A4F2] text-white px-5 rounded-full h-10">
							<span className="text-md font-bold relative">Connect Wallet</span>
						</button>
					</div>
				)}
			</motion.div>
		</AnimatePresence>
	)
}

export default Navbar
