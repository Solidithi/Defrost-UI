'use client'

import { comfortaa, orbitron } from '@/app/lib/font'
import Threads from '@/app/components/UI/background/Threads'
import { motion, useInView } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { useRef } from 'react'
const FeaturesSection = () => {
	const ref = useRef(null)
	const isInView = useInView(ref, { margin: '500px' })
	return (
		<section className="relative text-white min-h-screen w-full flex flex-col justify-center p-5">
			<motion.div
				className="absolute top-[-50px] left-[-200px] h-[600px] w-[600px] rounded-full opacity-20 blur-[5000px] bg-gradient-to-r from-[#427FF6] via-[#AB54F2] to-[#E8499E] z-10"
				animate={{
					x: ['-10vw', '10vw', '-10vw'],
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					repeatType: 'mirror',
					ease: 'easeInOut',
				}}
			/>

			<motion.div
				className="absolute top-[600px] left-[-250px] h-[720px] w-[720px] rounded-full opacity-20 blur-[6000px] bg-gradient-to-r from-[#427FF6] via-[#AB54F2] to-[#E8499E] z-10"
				animate={{
					x: ['0vw', '5vw', '0vw'],
					y: ['0vh', '5vh', '0vh'],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					repeatType: 'mirror',
					ease: 'easeInOut',
				}}
			/>

			<motion.div
				className="absolute top-[500px] left-[900px] h-[680px] w-[680px] rounded-full opacity-20 blur-[5500px] bg-gradient-to-r from-[#427FF6] via-[#AB54F2] to-[#E8499E] z-10"
				animate={{
					x: ['-5vw', '5vw', '-5vw'],
					y: ['-5vh', '5vh', '-5vh'],
				}}
				transition={{
					duration: 7,
					repeat: Infinity,
					repeatType: 'mirror',
					ease: 'easeInOut',
				}}
			/>

			{/* <div className="absolute w-full h-[1000px] top-[600px]">
				<Threads amplitude={3} distance={0} enableMouseInteraction={true} />
			</div> */}
			<div className="relative flex flex-col gap-10 p-5 h-full z-50">
				<div
					style={{ fontFamily: orbitron.style.fontFamily }}
					className="flex flex-col items-start text-7xl gap-5 font-extrabold"
				>
					<motion.span
						ref={ref}
						initial={{ opacity: 0, y: 30 }}
						animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
						transition={{ duration: 0.2, delay: 0.3 }}
					>
						<span className="warm-cool-text">Stake</span> freely
					</motion.span>
					<motion.span
						ref={ref}
						initial={{ opacity: 0, y: 30 }}
						animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
						transition={{ duration: 0.4, delay: 0.3 }}
					>
						<span className="warm-cool-text">Withdraw</span> anytime
					</motion.span>
					<motion.span
						ref={ref}
						initial={{ opacity: 0, y: 30 }}
						animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<span className="warm-cool-text">Maximize</span> your gains
					</motion.span>
				</div>
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					className="flex justify-between items-center  w-full h-auto gap-5"
				>
					<div className="h-full w-1/2 glass-enhanced flex flex-col items-start gap-5 justify-center p-8 rounded-3xl">
						<span
							style={{ fontFamily: comfortaa.style.fontFamily }}
							className="text-xl font-light"
						>
							<span className="font-bold">No-Loss Launchpools:</span> Stake your
							vAssets and earn project tokens while maintaining the ability to
							unstake anytime. Our innovative design leverages Bifrost LST
							technology to ensure you never lose your principal investment.
						</span>

						<span
							style={{ fontFamily: comfortaa.style.fontFamily }}
							className="text-xl font-light"
						>
							<span className="font-bold">Multi-Network Support:</span> Deploy
							your projects across various blockchain networks including
							Polkadot ecosystem networks. Choose the perfect network for your
							project needs with seamless wallet integration.
						</span>
					</div>
					<div className="h-full w-1/2 overflow-hidden">
						<Spline scene="https://prod.spline.design/vR04v2bf9-RKIakO/scene.splinecode" />
					</div>
				</motion.div>

				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					className="flex justify-between items-center  w-full h-auto gap-5"
				>
					<div className="h-full w-1/2 ">
						<Spline scene="https://prod.spline.design/pYJimn-GHYQ9SyUK/scene.splinecode" />{' '}
					</div>

					<div className="h-full w-1/2 glass-enhanced flex flex-col items-start gap-5 justify-center p-8 rounded-3xl">
						<span
							style={{ fontFamily: comfortaa.style.fontFamily }}
							className="text-xl font-light"
						>
							<span className="font-bold">Dynamic Emission Rates:</span> Project
							owners can configure multiple emission phases with different token
							rates. Higher rates in early phases attract early stakers, while
							strategic planning of these rates significantly impacts investor
							participation.
						</span>

						<span
							style={{ fontFamily: comfortaa.style.fontFamily }}
							className="text-xl font-light"
						>
							<span className="font-bold">Transparent & Secure:</span> All
							transactions and project data are stored on-chain, ensuring
							complete transparency. Smart contracts handle fair token
							distribution automatically, building trust between creators and
							investors.
						</span>
					</div>
				</motion.div>
			</div>
		</section>
	)
}

export default FeaturesSection
