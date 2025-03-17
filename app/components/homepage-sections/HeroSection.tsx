'use client'
// import { BackgroundBeamsWithCollision } from '../UI/BackgroundBeamsWithCollision'
// import { TextHoverEffect } from '../UI/TextHoverEffect'
// import circle from '../../../public/Subtract.png'
// import bg from '../../../public/universe.jpg'
import Image from 'next/image'
// import SplitText from '../SplitText'
import Logo from '../../../public/Logo.png'
import { orbitron, comfortaa } from '../../lib/font'
import { Boxes } from '@/app/components/UI/BackgroundBoxes'
// import SplitText from '../SplitText'
import { motion } from 'framer-motion'
import { useState } from 'react'

const textAnimation = {
	hidden: { opacity: 0, y: 50 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.1, ease: 'easeOut' },
	}),
}

const HeroSection = () => {
	const [isTitleDone, setIsTitleDone] = useState(false)
	const title = 'Fast & Secure Platform made for'
	const highlight = 'Egalitarian Investing'
	return (
		<section className="relative overflow-hidden h-screen">
			{/* <div className="absolute top-[700px] left-[850px]  h-64 w-[800px] rounded-full opacity-25 blur-[100px] bg-[#F05550]"></div> */}
			<Boxes />
			<div className="flex w-full z-50">
				<div className="bg-white h-screen w-1/2 glass-component-2">
					<div className="flex flex-col items-start h-full gap-10 justify-center px-16">
						<motion.span
							initial="hidden"
							animate="visible"
							className="text-[55px] font-bold text-white"
							style={{ fontFamily: orbitron.style.fontFamily }}
							onAnimationComplete={() => setIsTitleDone(true)}
						>
							{title.split('').map((char, index) => (
								<motion.span
									key={index}
									variants={textAnimation}
									custom={index}
								>
									{char}
								</motion.span>
							))}
							<br />
							{isTitleDone && (
								<motion.span
									initial="hidden"
									animate="visible"
									style={{ fontFamily: orbitron.style.fontFamily }}
									className="text-[55px] font-bold bg-gradient-to-r from-[#F05550] via-[#AD7386] to-[#54A4F2] bg-clip-text text-transparent"
								>
									{highlight.split('').map((char, index) => (
										<motion.span
											key={index}
											variants={textAnimation}
											custom={index}
										>
											{char}
										</motion.span>
									))}
								</motion.span>
							)}
						</motion.span>

						<motion.span
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="text-white text-xl"
							style={{ fontFamily: comfortaa.style.fontFamily }}
						>
							Launchpool believe all project stakeholders are as important as
							each other.
						</motion.span>

						<motion.button
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.6 }}
							className="bg-gradient-to-r from-[#F05550] via-[#AD7386] to-[#54A4F2] text-white rounded-full w-48 h-12 text-xl"
							style={{ fontFamily: comfortaa.style.fontFamily }}
						>
							Start Now
						</motion.button>
					</div>
				</div>
				<div className="flex justify-center items-center w-1/2 h-screen">
					{/* <div className="absolute top-[700px] left-[850px]  h-64 w-[800px] rounded-full opacity-25 blur-[100px] bg-[#F05550]"></div> */}

					{/* <Image
						className="absolute animate-spin duration-[1ms] ease-linear"
						src={Logo}
						alt="Logo"
					/> */}
					<motion.img
						src={Logo.src}
						alt="Logo"
						className="absolute hover:animate-spin hover:duration-[1ms] hover:ease-linear"
						// initial={{ opacity: 0, scale: 0.5, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
						transition={{
							duration: 2,
							ease: 'easeOut',
							repeat: Infinity,
						}}
					/>
					{/* <Image
						className="absolute hover:animate-pulse"
						src={Logo}
						alt="Logo"
					/> */}

					{/* <Image
						className="absolute animate-bounce duration-[3000ms] ease-in-out"
						src={Logo}
						alt="Logo"
					/> */}

					{/* <Image className="absolute" src={Logo} alt="Logo" /> */}
				</div>
			</div>
		</section>
	)
}
export default HeroSection
