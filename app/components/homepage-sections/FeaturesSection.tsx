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
					className="flex flex-col items-start text-7xl p-5 gap-5 font-extrabold"
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
					className="flex justify-between items-center  p-5 w-full h-auto gap-5"
				>
					<div className="h-full w-1/2 glass-component-3 flex flex-col items-start gap-5 justify-center p-8 rounded-3xl">
						<span
							style={{ fontFamily: comfortaa.style.fontFamily }}
							className="text-2xl font-light"
						>
							<span className="font-bold">Key feature 1:</span> Lorem Ipsum is
							simply dummy text of the printing and typesetting industry. Lorem
							Ipsum Lorem Ipsum is simply dummy text of the printing and
							typesetting industry. Lorem Ipsum{' '}
						</span>

						<span
							style={{ fontFamily: comfortaa.style.fontFamily }}
							className="text-2xl font-light"
						>
							<span className="font-bold">Key feature 1:</span> Lorem Ipsum is
							simply dummy text of the printing and typesetting industry. Lorem
							Ipsum Lorem Ipsum is simply dummy text of the printing and
							typesetting industry. Lorem Ipsum{' '}
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
					className="flex justify-between items-center  p-5 w-full h-auto gap-5"
				>
					<div className="h-full w-1/2 ">
						<Spline scene="https://prod.spline.design/pYJimn-GHYQ9SyUK/scene.splinecode" />{' '}
					</div>

					<div className="h-full w-1/2 glass-component-3 flex flex-col items-start gap-5 justify-center p-8 rounded-3xl">
						<span
							style={{ fontFamily: comfortaa.style.fontFamily }}
							className="text-2xl font-light"
						>
							<span className="font-bold">Key feature 1:</span> Lorem Ipsum is
							simply dummy text of the printing and typesetting industry. Lorem
							Ipsum Lorem Ipsum is simply dummy text of the printing and
							typesetting industry. Lorem Ipsum{' '}
						</span>

						<span
							style={{ fontFamily: comfortaa.style.fontFamily }}
							className="text-2xl font-light"
						>
							<span className="font-bold">Key feature 1:</span> Lorem Ipsum is
							simply dummy text of the printing and typesetting industry. Lorem
							Ipsum Lorem Ipsum is simply dummy text of the printing and
							typesetting industry. Lorem Ipsum{' '}
						</span>
					</div>
				</motion.div>
			</div>
		</section>
	)
}

export default FeaturesSection
