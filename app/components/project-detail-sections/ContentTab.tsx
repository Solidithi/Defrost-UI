import { Key } from 'react'
import SectionComponent from '../UI/SectionComponent'
import CardInModal from '../UI/CardInModal'

const DescriptionTab = () => {
	return (
		<div className="">
			<div className="glass-component-1 text-white mt-10 p-6 rounded-lg">
				<p>
					{Array(20)
						.fill(
							'If you have funded this project, we will be in touch to let you know when the rewards have started distributing and when you can claim them.'
						)
						.join(' ')}
				</p>
			</div>
		</div>
	)
}

const AllPoolsTab = ({ projectCards }: { projectCards: any[] }) => {
	return (
		<div className="">
			<div className="glass-component-1 text-white mt-10 p-6 rounded-lg">
				<div className="grid grid-cols-3 gap-8 w-full mx-auto mb-24">
					{projectCards.map((card: any, index: Key | null | undefined) => (
						<SectionComponent key={index}>
							<CardInModal
							// projectName={card.projectName}
							// projectShortDescription={card.projectShortDescription}
							// projectAPR={card.projectAPR}
							/>
						</SectionComponent>
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
