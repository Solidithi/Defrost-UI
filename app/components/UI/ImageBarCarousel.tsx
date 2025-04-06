'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { current } from 'tailwindcss/colors'

interface Image {
	src: string
	alt: string
	description: string
}

interface ImageBarCarouselProps {
	image: Image[]
	currentIndex: number
	goToSlide: (index: number) => void
}

const ImageBarCarousel = ({
	image,
	currentIndex,
	goToSlide,
}: ImageBarCarouselProps) => {
	const getVisibleThumbnails = () => {
		const total = image.length

		// Handle edge cases for first and last items
		if (currentIndex === 0) return image.slice(0, 3)
		if (currentIndex == 1) return image.slice(0, 3)
		if (currentIndex === total - 1) return image.slice(total - 3)

		return image.slice(currentIndex - 1, currentIndex + 2)
	}
	//Current index log
	useEffect(() => {
		console.log('Current index:', currentIndex)
	})

	const visibleThumbnails = getVisibleThumbnails()

	return (
		<div className="w-full flex justify-center mt-6">
			<div className="w-full h-full mx-auto">
				<div className="flex flex-row justify-center gap-4">
					{visibleThumbnails.map((img, index) => {
						// Actual index in the full image list
						const realIndex = image.indexOf(img)
						console.log('Real index:', realIndex)

						return (
							<div
								key={realIndex}
								onClick={() => goToSlide(realIndex)}
								className={`relative cursor-pointer rounded overflow-hidden w-full h-[160px] group transition-all duration-300 ${
									realIndex === currentIndex
										? 'ring-2 ring-blue-500'
										: 'opacity-60 hover:opacity-100'
								}`}
							>
								{realIndex === currentIndex && (
									<motion.div
										layoutId="highlight"
										transition={{ type: 'spring', stiffness: 500, damping: 30 }}
										className="absolute top-0 left-0 w-full h-full z-0 rounded-lg bg-blue-500/20"
									/>
								)}
								<Image
									src={img.src}
									alt={img.alt}
									fill
									className="object-cover z-10 relative"
								/>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default ImageBarCarousel
