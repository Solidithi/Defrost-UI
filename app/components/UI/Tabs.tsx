// 'use client'

// import { useState } from 'react'
// import { motion } from 'motion/react'
// import { cn } from '@/app/lib/utils'

// type Tab = {
// 	title: string
// 	value: string
// 	content?: string | React.ReactNode | any
// }

// export const Tabs = ({
// 	tabs: propTabs,
// 	containerClassName,
// 	activeTabClassName,
// 	tabClassName,
// 	contentClassName,
// }: {
// 	tabs: Tab[]
// 	containerClassName?: string
// 	activeTabClassName?: string
// 	tabClassName?: string
// 	contentClassName?: string
// }) => {
// 	const [active, setActive] = useState<Tab>(propTabs[0])
// 	const [tabs, setTabs] = useState<Tab[]>(propTabs)

// 	const moveSelectedTabToTop = (idx: number) => {
// 		const newTabs = [...propTabs]
// 		const selectedTab = newTabs.splice(idx, 1)
// 		newTabs.unshift(selectedTab[0])
// 		setTabs(newTabs)
// 		setActive(newTabs[0])
// 	}

// 	const [hovering, setHovering] = useState(false)

// 	return (
// 		<>
// 			<div
// 				className={cn(
// 					'flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full',
// 					containerClassName
// 				)}
// 			>
// 				{propTabs.map((tab, idx) => (
// 					<button
// 						key={tab.title}
// 						onClick={() => {
// 							moveSelectedTabToTop(idx)
// 						}}
// 						onMouseEnter={() => setHovering(true)}
// 						onMouseLeave={() => setHovering(false)}
// 						className={cn('relative px-4 py-2 rounded-full', tabClassName)}
// 						style={{
// 							transformStyle: 'preserve-3d',
// 						}}
// 					>
// 						{active.value === tab.value && (
// 							<motion.div
// 								layoutId="clickedbutton"
// 								transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
// 								className={cn(
// 									'absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full ',
// 									activeTabClassName
// 								)}
// 							/>
// 						)}

// 						<span
// 							className={cn(
// 								'relative block',
// 								active.value === tab.value
// 									? 'text-[#59A1EC] dark:text-gray-200'
// 									: 'text-white dark:text-white'
// 							)}
// 						>
// 							{tab.title}
// 						</span>
// 					</button>
// 				))}
// 			</div>
// 			<FadeInDiv
// 				tabs={tabs}
// 				active={active}
// 				key={active.value}
// 				hovering={hovering}
// 				className={cn('mt-32', contentClassName)}
// 			/>
// 		</>
// 	)
// }

// export const FadeInDiv = ({
// 	className,
// 	tabs,
// 	hovering,
// }: {
// 	className?: string
// 	key?: string
// 	tabs: Tab[]
// 	active: Tab
// 	hovering?: boolean
// }) => {
// 	const isActive = (tab: Tab) => {
// 		return tab.value === tabs[0].value
// 	}
// 	return (
// 		<div className="relative w-full h-full">
// 			{tabs.map((tab, idx) => (
// 				<motion.div
// 					key={tab.value}
// 					layoutId={tab.value}
// 					style={{
// 						scale: 1 - idx * 0.1,
// 						top: hovering ? idx * -50 : 0,
// 						zIndex: -idx,
// 						opacity: idx < 3 ? 1 - idx * 0.1 : 0,
// 					}}
// 					animate={{
// 						y: isActive(tab) ? [0, 40, 0] : 0,
// 					}}
// 					className={cn('w-full h-full absolute top-0 left-0', className)}
// 				>
// 					{tab.content}
// 				</motion.div>
// 			))}
// 		</div>
// 	)
// }

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
	containerClassName = 'w-full',
	tabListClassName = 'flex',
	tabClassName = 'px-4 py-2 cursor-pointer transition-colors',
	activeTabClassName = 'border-b-2 border-blue-500 text-blue-500',
	contentClassName = 'py-4',
}) => {
	const [activeIndex, setActiveIndex] = useState(0)

	return (
		<div className={containerClassName}>
			<div role="tablist" className={tabListClassName}>
				{tabs.map((tab, idx) => (
					<button
						key={idx}
						role="tab"
						aria-selected={activeIndex === idx}
						className={`focus:outline-none
							rounded-xl px-4 py-2 w-36 mr-2 font-orbitron font-bold cursor-pointer transition-all duration-300 
							${tabClassName} ${
								activeIndex === idx
									? `border-b-2 border-blue-500  !text-[#59A1EC] 
									backdrop-blur-md border bg-gradient-to-br border-blue-500/10 from-[#ffffff] to-[#ffffff]`
									: 'text-white hover:text-[#59A1EC]'
							}`}
						onClick={() => setActiveIndex(idx)}
					>
						{tab.title}
					</button>
				))}
			</div>

			<div className={contentClassName}>
				<AnimatePresence mode="wait">
					<motion.div
						key={activeIndex}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
					>
						{tabs[activeIndex]?.content}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	)
}

export default Tabs
