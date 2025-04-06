'use client'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { useRef, useState, useEffect } from 'react'
import '@splidejs/splide/css'
import ImageBarCarousel from './ImageBarCarousel'
import Image from 'next/image'

interface Image {
	src: string
	alt: string
	description: string
}

const ImageCarousel: React.FC = () => {
	const [index, setIndex] = useState(0)
	const ref = useRef<Splide>(null)

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

		{
			src: 'https://i.pinimg.com/474x/f3/d7/c4/f3d7c40d3d574efc7f7a03db93a3c8a2.jpg',
			alt: 'Something',
			description: 'Something',
		},
	]

	useEffect(() => {
		if (ref.current && ref.current.splide) {
			const splideInstance = ref.current.splide

			splideInstance.on('move', (newIndex: number) => {
				setIndex(newIndex)
			})

			return () => {
				splideInstance.destroy()
			}
		}
	}, [])

	const goToSlide = (i: number) => {
		ref.current?.splide?.go(i)
	}

	return (
		<div className="w-full">
			<div className="flex flex-col items-center">
				<section
					id="image-carousel"
					className="splide w-full max-w-full mx-auto"
					aria-label="Beautiful Images"
				>
					<Splide
						options={{
							type: 'loop',
							perPage: 1,
							gap: '1rem',
							heightRatio: 0.5,
						}}
						ref={ref}
					>
						{images.map((image, index) => (
							<SplideSlide key={index} className="relative">
								<Image
									src={image.src}
									alt={image.alt}
									width={956}
									height={478}
									className="w-full h-full object-cover rounded-lg shadow-md"
								/>
								<div className="absolute bottom-0 bg-black bg-opacity-50 text-white text-center p-2 w-full">
									{image.description}
								</div>
							</SplideSlide>
						))}
					</Splide>
				</section>

				<ImageBarCarousel
					image={images}
					currentIndex={index}
					goToSlide={goToSlide}
				/>
			</div>
		</div>
	)
}

export default ImageCarousel
