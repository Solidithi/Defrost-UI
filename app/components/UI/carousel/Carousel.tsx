'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/css'
import Logo from '@/public/Logo.png'
import ProgressBar from '../project-progress/ProgressBar'
import Image from 'next/image'

export interface Image {
	src: string
	alt: string
}

interface CarouselWithProgressProps {
	images: Image[]
}

// const images: Image[] = [
// 	{
// 		src: 'https://i.pinimg.com/736x/2e/3d/68/2e3d6845011de0d24c13dd1e1028a2ff.jpg',
// 		alt: 'Beautiful Landscape 1',
// 		// description: 'Description 01',
// 	},
// 	{
// 		src: 'https://i.pinimg.com/474x/05/6d/d3/056dd39fccee614d4e46d77ef8814bf8.jpg',
// 		alt: 'Beautiful Landscape 2',
// 		// description: 'Description 02',
// 	},
// 	{
// 		src: 'https://i.pinimg.com/474x/ef/78/99/ef7899d792526a5d10f33c30ad250617.jpg',
// 		alt: 'Beautiful Landscape 3',
// 		// description: 'Description 03',
// 	},
// ]

// const progress = 100 / images.length

const CarouselWithProgress = ({ images }: CarouselWithProgressProps) => {
	const [index, setIndex] = useState(0)
	const ref = useRef<Splide>(null)

	useEffect(() => {
		if (ref.current && ref.current.splide) {
			const splideInstance = ref.current.splide

			// Listen for slide move events
			splideInstance.on('move', (newIndex: number) => {
				setIndex(newIndex)
			})

			return () => {
				splideInstance.destroy()
			}
		}
	}, [])

	return (
		<div className="relative w-full">
			{/* Minimal elegant container */}
			<section
				id="image-carousel"
				className="relative w-full max-w-5xl mx-auto"
				aria-label="Beautiful Images"
			>
				{/* Simple content container */}
				<div className="relative">
					<Splide
						options={{
							type: 'loop',
							perPage: 1,
							perMove: 1,
							gap: '0',
							padding: '0',
							width: '100%',
							fixedWidth: false,
							fixedHeight: false,
							heightRatio: 0.55,
							arrows: true,
							pagination: false,
							autoplay: false,
							speed: 600,
							focus: 'center',
							trimSpace: false,
							easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
							classes: {
								arrows: 'splide__arrows carousel-arrows',
								arrow: 'splide__arrow carousel-arrow',
								prev: 'splide__arrow--prev carousel-arrow-prev',
								next: 'splide__arrow--next carousel-arrow-next',
							},
						}}
						aria-labelledby="image-carousel"
						ref={ref}
					>
						{images.map((image, idx) => (
							<SplideSlide key={idx} className="relative group w-full">
								{/* Clean image container */}
								<div className="relative w-full">
									{/* Main image with elegant styling */}
									<div
										className="relative w-full overflow-hidden rounded-3xl shadow-lg"
										style={{ aspectRatio: '16/9' }}
									>
										<Image
											src={image.src}
											alt={image.alt}
											className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.01]"
											width={800}
											height={450}
											priority={idx === 0}
										/>

										{/* Subtle overlay on hover */}
										<div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
									</div>
								</div>
							</SplideSlide>
						))}
					</Splide>
				</div>
			</section>

			{/* Progress indicators */}
			<div className="mt-6 flex flex-col items-center space-y-4">
				{/* Progress bar */}
				<ProgressBar index={index + 1} total={images.length} duration={1000} />

				{/* Simple dot indicators */}
				<div className="flex space-x-2">
					{Array.from({ length: images.length }, (_, i) => (
						<div
							key={i}
							className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
								i === index ? 'bg-white scale-110' : 'bg-white/30'
							}`}
						/>
					))}
				</div>

				{/* Slide counter */}
				{images.length > 0 && (
					<div className="text-center">
						<span className="text-white/60 text-sm font-light tracking-wider">
							{index + 1} / {images.length}
						</span>
					</div>
				)}
			</div>

			{/* Elegant arrow styling */}
			<style jsx global>{`
				.splide {
					width: 100% !important;
				}

				.splide__track {
					border-radius: 24px;
					width: 100% !important;
				}

				.splide__list {
					width: 100% !important;
				}

				.splide__slide {
					width: 100% !important;
					flex-shrink: 0 !important;
					transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
				}

				.carousel-arrows {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 100%;
					pointer-events: none;
					z-index: 10;
				}

				.carousel-arrow {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 48px;
					height: 48px;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.9);
					border: none;
					cursor: pointer;
					pointer-events: auto;
					transition: all 0.2s ease;
					box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
					display: flex;
					align-items: center;
					justify-content: center;
					backdrop-filter: blur(10px);
				}

				.carousel-arrow:hover {
					transform: translateY(-50%) scale(1.05);
					background: rgba(255, 255, 255, 1);
					box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
				}

				.carousel-arrow-prev {
					left: -24px;
				}

				.carousel-arrow-next {
					right: -24px;
				}

				.carousel-arrow svg {
					width: 20px;
					height: 20px;
					fill: rgba(0, 0, 0, 0.7);
					transition: fill 0.2s ease;
				}

				.carousel-arrow:hover svg {
					fill: rgba(0, 0, 0, 0.9);
				}
			`}</style>
		</div>
	)
}

export default CarouselWithProgress
