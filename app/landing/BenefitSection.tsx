'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const BenefitSection = () => {
	const ref = useRef(null)
	const isInView = useInView(ref, { margin: '100px' })
	return (
		<section className="relative text-white min-h-screen w-full p-10 ">
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

			<div className="h-full w-full z-50 flex flex-row justify-center items-start gap-10 ">
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 80 } : { opacity: 0, y: 110 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="flex flex-col items-start justify-center gap-16 glass-enhanced rounded-2xl p-10 font-comfortaa text-xl translate-y-0"
				>
					<span className="font-bold font-orbitron text-3xl warm-cool-text">
						For Stakers
					</span>
					<span className="">
						Earn continuous rewards with vAsset LST technology while maintaining
						flexibility to stake and unstake at your convenience. Access diverse
						token opportunities with zero principal loss risk through our
						innovative no-loss launchpool mechanism.
					</span>
					<span className="font-bold font-orbitron text-4xl text-gray-600">
						01
					</span>
				</motion.div>
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.4, delay: 0.1 }}
				>
					<svg
						width="62"
						height="943"
						viewBox="0 0 62 943"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M1 0V484.41C1 492.412 4.19678 500.082 9.87964 505.716L52.1204 547.589C57.8032 553.223 61 560.893 61 568.895V943"
							stroke="url(#paint0_linear_1300_3193)"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_1300_3193"
								x1="31"
								y1="0"
								x2="31"
								y2="943"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#FCABAD" />
								<stop offset="1" stop-color="#9BB6E0" />
							</linearGradient>
						</defs>
					</svg>
				</motion.div>
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 120 } : { opacity: 0, y: 150 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="flex flex-col items-start justify-center gap-16 glass-enhanced rounded-2xl p-10 font-comfortaa text-xl translate-y-[100px]"
				>
					<span className="font-bold font-orbitron text-3xl warm-cool-text">
						For Project Owners
					</span>
					<span className="">
						Build a loyal investor community through fair and transparent reward
						systems. Enhanced liquidity opportunities and decentralized systems
						ensure fair token distribution while increasing trust in your
						project.
					</span>
					<span className="font-bold font-orbitron text-4xl text-gray-600">
						02
					</span>
				</motion.div>
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.4, delay: 0.1 }}
				>
					<svg
						width="2"
						height="942"
						viewBox="0 0 2 942"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M1 0V942" stroke="url(#paint0_linear_1300_3195)" />
						<defs>
							<linearGradient
								id="paint0_linear_1300_3195"
								x1="1.5"
								y1="0"
								x2="1.5"
								y2="942"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#FCABAD" />
								<stop offset="1" stop-color="#9BB6E0" />
							</linearGradient>
						</defs>
					</svg>
				</motion.div>
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 160 } : { opacity: 0, y: 190 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="flex flex-col items-start justify-center gap-16 glass-enhanced rounded-2xl p-10 font-comfortaa text-xl translate-y-[200px]"
				>
					<span className="font-bold font-orbitron text-3xl warm-cool-text">
						For Ecosystem
					</span>
					<span className="">
						Encourages greater use of Polkadot and Kusama networks while
						showcasing PolkaVM capabilities. Attracts more developers and
						projects to the parachain ecosystem, boosting overall value and
						growth.
					</span>
					<span className="font-bold font-orbitron text-4xl text-gray-600">
						03
					</span>
				</motion.div>
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.4, delay: 0.1 }}
				>
					<svg
						width="62"
						height="943"
						viewBox="0 0 62 943"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M1 0V484.41C1 492.412 4.19678 500.082 9.87964 505.716L52.1204 547.589C57.8032 553.223 61 560.893 61 568.895V943"
							stroke="url(#paint0_linear_1300_3193)"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_1300_3193"
								x1="31"
								y1="0"
								x2="31"
								y2="943"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#FCABAD" />
								<stop offset="1" stop-color="#9BB6E0" />
							</linearGradient>
						</defs>
					</svg>
				</motion.div>
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 200 } : { opacity: 0, y: 230 }}
					transition={{ duration: 1.1, delay: 0.2 }}
					className="flex flex-col items-start justify-center gap-16 glass-enhanced rounded-2xl p-10 font-comfortaa text-xl  translate-y-[300px]"
				>
					<span className="font-bold font-orbitron text-3xl warm-cool-text">
						For Bifrost
					</span>
					<span className="">
						Expands vAsset use cases, increasing adoption and liquidity. Adds
						value to the Bifrost platform by integrating with DeFi opportunities
						while strengthening connections within the broader Polkadot
						ecosystem.
					</span>
					<span className="font-bold font-orbitron text-4xl text-gray-600">
						04
					</span>
				</motion.div>
			</div>
		</section>
	)
}

export default BenefitSection
