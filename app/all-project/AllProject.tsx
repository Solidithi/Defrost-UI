'use client'

import { useState } from 'react'
import SplitText from '../components/UI/SplitText'
import CarouselWithProgress from '../components/UI/Carousel'
import GlowingSearchBar from '../components/UI/GlowingSearchBar'
import ScrollFloat from '../components/UI/ScrollFloat'
import ShinyText from '../components/UI/ShinyText'
import StatCard from '../components/UI/StatCard'
import OverviewTrippleCard from '../components/UI/StatCard'
import SwitchTableOrCard from '../components/UI/SwitchTableOrCard'
import { orbitron, comfortaa } from '../lib/font'
import { StaticImageData } from 'next/image'
import AllProjectCard from '../components/UI/AllProjectCard'
import SectionComponent from '../components/UI/SectionComponent'

const AllProject = () => {
	const [isCard, setIsCard] = useState(true)
	// Create 3 projectcards
	const projectCards = Array.from({ length: 9 }, (_, i) => (
		<AllProjectCard key={i} />
	))

	const statCard: {
		type: 'Total Project' | 'Total Staking' | 'Unique Participant'
		count: number
		label: string
		icon: StaticImageData
	}[] = [
		{
			type: 'Total Project',
			count: 10,
			label: 'Total Project',
			icon: 'data:image/png;base64,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',
		},
		{
			type: 'Total Staking',
			count: 100,
			label: 'Total Staking',
			icon: 'data:image/png;base64,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',
		},
		{
			type: 'Unique Participant',
			count: 1000,
			label: 'Unique Participant',
			icon: 'data:image/png;base64,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',
		},
	]

	return (
		<div>
			<div className="text-white mb-20">
				<div className="mt-44 text-center">
					<SplitText
						text="Launchpool"
						className="text-7xl text-center font-bold text-white font-orbitron"
						delay={150}
						animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
						animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
						easing="easeOutCubic"
						threshold={0.2}
						rootMargin="-50px"
					/>
				</div>

				<div className="mx-14">
					<div className="m-20">
						<CarouselWithProgress />
					</div>

					{/* Mapping for the statcards */}
					<div className="grid grid-cols-3 gap-5 w-11/12 mx-auto mb-24">
						{statCard.map((card, index) => (
							<StatCard
								key={index}
								type={card.type}
								count={card.count}
								label={card.label}
								icon={card.icon}
							/>
						))}
					</div>

					<div className="mx-16">
						<ScrollFloat
							animationDuration={1}
							ease="back.inOut(2)"
							scrollStart="center bottom+=50%"
							scrollEnd="bottom bottom-=40%"
							stagger={0.03}
							textClassName="font-orbitron"
						>
							Launchpool
						</ScrollFloat>

						<div className="flex flex-row gap-12">
							<div className="w-full">
								<GlowingSearchBar />
							</div>

							<div className="mb-12">
								<SwitchTableOrCard isCard={isCard} setIsCard={setIsCard} />
							</div>
						</div>

						{/* <div className="">
              <AllProjectCard />
            </div> */}

						{/* Mapping for the project cards */}
						<div className="grid grid-cols-3 gap-8 w-full mx-auto mb-24">
							{projectCards.map((card, index) => (
								<SectionComponent key={index}>
									<AllProjectCard
									// projectName={card.projectName}
									// projectShortDescription={card.projectShortDescription}
									// projectAPR={card.projectAPR}
									/>
								</SectionComponent>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AllProject
