import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Tab {
	title: string
	content: React.ReactNode
}

interface TabsProps {
	tabs: Tab[]
	containerClassName?: string
	tabListClassName?: string
	tabClassName?: string
	activeTabClassName?: string
	contentClassName?: string
}

const Tabs: React.FC<TabsProps> = ({
	tabs,
	containerClassName = 'w-full relative z-10',
	tabListClassName = 'flex gap-1 mb-6 w-4/5 mx-auto',
	tabClassName = 'px-4 py-2.5 cursor-pointer transition-all duration-300',
	contentClassName = 'relative z-10',
}) => {
	const [activeIndex, setActiveIndex] = useState(0)

	return (
		<div className={containerClassName}>
			{/* Tab navigation */}
			<div role="tablist" className={`${tabListClassName} relative`}>
				{/* Background track */}
				<div className="absolute inset-0 bg-slate-800/40 glass-enhanced border border-slate-700/30 shadow-lg rounded-xl"></div>

				{tabs.map((tab: Tab, idx: number) => (
					<button
						key={idx}
						role="tab"
						aria-selected={activeIndex === idx}
						className={`
							relative z-10 px-3 py-2 font-medium text-sm font-orbitron
							rounded-lg transition-all duration-300 ease-in-out
							focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800
							min-w-[80px] text-center overflow-hidden
							${tabClassName}
							${
								activeIndex === idx
									? `text-white shadow-lg shadow-purple-500/20 
									border-0 transform scale-105`
									: `text-slate-300 hover:text-white hover:bg-slate-700/50 
									hover:shadow-md hover:transform hover:scale-102 hover:border-slate-600/50
									border border-transparent rounded-lg`
							}
						`}
						onClick={() => setActiveIndex(idx)}
					>
						{/* Active tab indicator - positioned behind text */}
						{activeIndex === idx && (
							<motion.div
								layoutId="activeTab"
								className="absolute inset-0 warm-cool-bg rounded-lg shadow-lg shadow-purple-500/20"
								initial={false}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 30,
								}}
								style={{
									mask: 'linear-gradient(90deg, transparent 0%, black 2%, black 98%, transparent 100%)',
									WebkitMask:
										'linear-gradient(90deg, transparent 0%, black 2%, black 98%, transparent 100%)',
								}}
							/>
						)}

						<span className="relative z-20">{tab.title}</span>
					</button>
				))}
			</div>

			{/* Content area */}
			<div className={`${contentClassName} relative z-10 mt-6`}>
				<AnimatePresence mode="wait">
					<motion.div
						key={activeIndex}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{
							duration: 0.3,
							ease: 'easeInOut',
						}}
						className="min-h-[200px]"
					>
						{tabs[activeIndex]?.content}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	)
}

export default Tabs
