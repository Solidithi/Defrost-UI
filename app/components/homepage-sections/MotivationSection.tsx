'use client'

import Threads from '../UI/background/Threads'
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
			<div className="text-center glass-component-3 w-full h-auto text-white flex flex-col justify-center items-center gap-10 p-14 rounded-2xl">
				<span className="font-bold font-orbitron text-5xl ">
					Lorem Ipsum is simply dummy text of the printing and typesetting
				</span>
				<span className="font-comfortaa text-2xl">
					Lorem Ipsum is simply dummy text of the printing and typesettingx`
					industry. Lorem Ipsum has been the industry&apos;s standard dummy text
					ever since the 1500s, Lorem Ipsum is simply dummy text of the printing
					and typesetting industry. Lorem Ipsum has been the industry&apos;s
					standard dummy text ever since the 1500s Lorem Ipsum is simply dummy
					text of the printing and typesetting industry. Lorem Ipsum has been
					the industry&apos;s standard dummy text ever since the 1500s, Lorem
					Ipsum is simply dummy text of the printing and typesetting industry.
					Lorem Ipsum has been the industry&apos;s standard dummy text ever
					since the 1500s Lorem Ipsum is simply dummy text of the printing and
					typesetting industry. Lorem Ipsum has been the industry&apos;s
					standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy
					text of the printing and typesetting industry. Lorem Ipsum has been
					the industry&apos;s standard dummy text ever since the 1500s
				</span>
			</div>
		</section>
	)
}

export default MotivationSection
