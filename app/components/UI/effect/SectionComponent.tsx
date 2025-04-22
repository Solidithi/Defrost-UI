import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

import { ReactNode } from 'react'

const SectionComponent = ({ children }: { children: ReactNode }) => {
	const ref = useRef(null)
	const isInView = useInView(ref, { margin: '-200px' })

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.8, ease: 'easeOut' }}
		>
			{children}
		</motion.div>
	)
}
export default SectionComponent
