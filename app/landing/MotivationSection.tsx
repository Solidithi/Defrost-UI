'use client'

import Threads from '../components/UI/background/Threads'
import { motion } from 'framer-motion'
const MotivationSection = () => {
	return (
		<section className="relative flex justify-center items-center px-20 min-h-screen ">
			<motion.div
				className="absolute top-[-5vh] left-[-20vw] h-[50vh] w-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-20 blur-[100px] bg-gradient-to-r from-[#427FF6] via-[#AB54F2] to-[#E8499E] z-10"
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
				className="absolute top-[5vh] left-[40vw] h-[50vh] w-[75vw] max-w-[900px] max-h-[600px] rotate-180 rounded-full opacity-20 blur-[100px] bg-gradient-to-r from-[#427FF6] via-[#AB54F2] to-[#E8499E] z-10"
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
			<div className="absolute w-full h-[1000px] top-[50px] opacity-45">
				<Threads amplitude={3} distance={0} enableMouseInteraction={true} />
			</div>
			<div className="text-center glass-enhanced w-full h-auto text-white flex flex-col justify-center items-center gap-10 p-14 rounded-2xl">
				<span className="font-bold font-orbitron text-5xl ">
					Revolutionizing Blockchain Project Funding with Egalitarian Innovation
				</span>
				<span className="font-comfortaa text-2xl">
					Defrost is a decentralized platform that connects blockchain project
					creators and startups with potential funders and investors, providing
					a transparent and efficient way to showcase and support innovative
					blockchain initiatives. Our comprehensive project management system
					allows creators to present their ideas with detailed information,
					media assets, and social links while enabling supporters to discover
					and fund promising projects through a clean, intuitive interface.
					Operating fully on the blockchain ensures transparency and security
					for all transactions and project data, supporting multiple parachain
					networks to give project creators the flexibility they need to
					succeed.
				</span>
			</div>
		</section>
	)
}

export default MotivationSection
