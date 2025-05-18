import { Key } from 'react'
import SectionComponent from '../UI/effect/SectionComponent'
import CardInModal from '../UI/modal/CardInModal'

interface DescriptionTabProps {
	description?: string
}

const DescriptionTab = ({ description }: DescriptionTabProps) => {
	return (
		<div className="">
			<div className="glass-component-1 text-white mt-10 p-6 rounded-lg">
				{description ? (
					<p className="whitespace-pre-wrap">{description}</p>
				) : (
					<p>
						{Array(20)
							.fill(
								'If you have funded this project, we will be in touch to let you know when the rewards have started distributing and when you can claim them.'
							)
							.join(' ')}
					</p>
				)}
			</div>
		</div>
	)
}

const AllPoolsTab = ({ projectCards }: { projectCards: any[] }) => {
	return (
		<div className="">
			<div className=" text-white mt-10 p-6 rounded-lg">
				<div className="grid grid-cols-3 gap-8 w-full mx-auto ">
					{projectCards.map((card: any, index: Key | null | undefined) => (
						// <SectionComponent key={index}>
						<CardInModal
							key={index}
							// projectName={card.projectName}
							// projectShortDescription={card.projectShortDescription}
							// projectAPR={card.projectAPR}
						/>
						// </SectionComponent>
					))}
				</div>
			</div>
		</div>
	)
}

const PoolsTab = () => {
	return <div className=""></div>
}

export { DescriptionTab, AllPoolsTab, PoolsTab }
