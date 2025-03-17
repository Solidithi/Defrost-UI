'use client'

import { comfortaa, orbitron } from '@/app/lib/font'
import Threads from '@/app/components/UI/Threads'
import { motion } from 'framer-motion'
const FeaturesSection = () => {
	return (
		<section className="relative text-white h-screen w-full overflow-hidden p-5 ">
			<div className="absolute top-[-50px] left-[-200px] h-[600px] w-[600px] rounded-full opacity-20 blur-[5000px] bg-gradient-to-r from-[#F05550] via-[#AD7386] to-[#54A4F2] z-10"></div>
			<div className="absolute top-[600px] left-[-250px] h-[720px] w-[720px] rounded-full opacity-20 blur-[6000px] bg-gradient-to-r from-[#AD7386] via-[#54A4F2] to-[#F05550] z-10"></div>
			<div className="absolute top-[500px] left-[900px] h-[680px] w-[680px] rounded-full opacity-20 blur-[5500px] bg-gradient-to-r from-[#54A4F2] via-[#F05550] to-[#AD7386] z-10"></div>
			<div className="absolute w-full h-[1000px] top-[600px]">
				<Threads amplitude={3} distance={0} enableMouseInteraction={true} />
			</div>
			<div className="absolute flex flex-col gap-10 p-5 h-full z-50">
				<div
					style={{ fontFamily: orbitron.style.fontFamily }}
					className="flex flex-col items-start text-7xl p-5 gap-5 font-extrabold"
				>
					<motion.span
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<span className="bg-gradient-to-r from-[#E05D5F] to-[#609FE3] text-transparent bg-clip-text">
							Stake
						</span>{' '}
						freely
					</motion.span>
					<motion.span
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
					>
						<span className="bg-gradient-to-r from-[#E05D5F] to-[#609FE3] text-transparent bg-clip-text">
							Withdraw
						</span>{' '}
						anytime
					</motion.span>
					<motion.span
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.3 }}
					>
						<span className="bg-gradient-to-r from-[#E05D5F] to-[#609FE3] text-transparent bg-clip-text">
							Maximize
						</span>{' '}
						your gains
					</motion.span>
				</div>
				<div className="flex justify-between items-center  p-5 w-full h-auto gap-5">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.5 }}
						className="h-full w-1/2 glass-component-3 flex flex-col items-start gap-5 justify-center p-8 rounded-3xl"
					>
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
					</motion.div>
					<div className="h-full w-1/2 "></div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.5 }}
					className="flex justify-between items-center  p-5 w-full h-auto gap-5"
				>
					<div className="h-full w-1/2 "></div>

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
