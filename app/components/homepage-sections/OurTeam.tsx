import { AnimatedTestimonials } from '@/app/components/UI/AnimatedTestimonials'
import { OUR_TEAM } from '@/app/constants'
import { motion } from 'framer-motion'
import { Boxes } from '../UI/BackgroundBoxes'

const OurTeam = () => {
	const testimonials = OUR_TEAM

	return (
		<section className="relative flex justify-center items-center px-20 pb-20 min-h-screen ">
			<motion.div
				className="absolute top-[-5vh] left-[-20vw] h-[50vh] w-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-20 blur-[100px] bg-gradient-to-r from-[#F05550] via-[#AD7386] to-[#54A4F2] z-10"
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
				className="absolute top-[5vh] left-[40vw] h-[50vh] w-[75vw] max-w-[900px] max-h-[600px] rotate-180 rounded-full opacity-20 blur-[100px] bg-gradient-to-r from-[#F05550] via-[#AD7386] to-[#54A4F2] z-10"
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
			<div className=" z-50 text-left glass-component-3 w-full h-auto text-white flex flex-col justify-center items-center gap-10  rounded-2xl p-16">
				<div className="text-5xl text-white font-bold   text-center font-orbitron">
					Our Team
				</div>
				<AnimatedTestimonials testimonials={testimonials} />
			</div>
		</section>
	)
}

export default OurTeam
