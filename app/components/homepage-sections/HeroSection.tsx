'use client'

import Image from 'next/image'
import Logo from '../../../public/Logo.png'
import { orbitron, comfortaa } from '../../lib/font'
import { Boxes } from '@/app/components/UI/background/BackgroundBoxes'
// import SplitText from '../SplitText'
import { motion } from 'framer-motion'
import { useState } from 'react'
// Removed incorrect Router import
import { useRouter } from 'next/navigation'
import Button from '../UI/button/Button'

const HeroSection = () => {
	const router = useRouter()

	const textAnimation = {
		hidden: { opacity: 0, y: 50 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: i * 0.1, ease: 'easeOut' },
		}),
	}

	const handleSubmit = () => {
		router.push('/all-project')
	}

	const [isTitleDone, setIsTitleDone] = useState(false)
	const title = 'Fast & Secure Platform made for'
	const highlight = 'Egalitarian Investing'
	return (
		<section className="relative overflow-hidden min-h-screen">
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
									className="text-[55px] font-bold warm-cool-text"
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

						{/* <motion.button
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.6 }}
							className="bg-gradient-to-r from-[#F05550] via-[#AD7386] to-[#54A4F2] text-white rounded-full w-48 h-12 text-xl"
							style={{ fontFamily: comfortaa.style.fontFamily }}
							onClick={handleSubmit}
						>
							Start Now
						</motion.button> */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.6 }}
						>
							<Button
								className="w-48 h-12 text-xl warm-cool-bg"
								onClick={handleSubmit}
							>
								Start Now
							</Button>
						</motion.div>
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
						// initial={{ opacity: 0, scale: 0.5, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
						transition={{
							duration: 2,
							ease: 'easeOut',
							repeat: Infinity,
						}}
						className=" md:h-1/5 md:w-1/5 lg:h-2/5 lg:w-2/5 xl:h-3/5 xl:w-3/5"
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
