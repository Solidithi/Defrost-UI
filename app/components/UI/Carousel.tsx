'use client'
import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/css'
import Logo from '@/public/Logo.png'

interface Image {
	src: string
	alt: string
	description: string
}

const images: Image[] = [
	{
		src: 'https://i.pinimg.com/736x/2e/3d/68/2e3d6845011de0d24c13dd1e1028a2ff.jpg',
		alt: 'Beautiful Landscape 1',
		description: 'Description 01',
	},
	{
		src: 'https://i.pinimg.com/474x/05/6d/d3/056dd39fccee614d4e46d77ef8814bf8.jpg',
		alt: 'Beautiful Landscape 2',
		description: 'Description 02',
	},
	{
		src: 'https://i.pinimg.com/474x/ef/78/99/ef7899d792526a5d10f33c30ad250617.jpg',
		alt: 'Beautiful Landscape 3',
		description: 'Description 03',
	},
]

const progress = 100 / images.length

const ImageCarousel: React.FC = () => {
	return (
		<section
			id="image-carousel"
			className="splide w-full max-w-4xl mx-auto"
			aria-label="Beautiful Images"
		>
			<Splide
				options={{
					type: 'loop',
					perPage: 1,
					gap: '1rem',
					breakpoints: {
						640: { perPage: 1 },
					},
					heightRatio: 0.5,
				}}
				aria-labelledby="image-carousel"
			>
				{images.map((image, index) => (
					<SplideSlide key={index} className="relative">
						<img
							src={image.src}
							alt={image.alt}
							className="w-full h-full object-cover rounded-lg shadow-md"
						/>
						<div className="absolute bottom-0 bg-black bg-opacity-50 text-white text-center p-2 w-full">
							{image.description}
						</div>
					</SplideSlide>
				))}
			</Splide>
		</section>
	)
}

export default ImageCarousel
