'use client'

import HeroSection from './HeroSection'
import PartnerSection from './PartnersSection'
import OurTeam from './OurTeam'
import FeaturesSection from './FeaturesSection'
import SectionComponent from '@/app/components/UI/effect/SectionComponent'
import BenefitSection from './BenefitSection'
import MotivationSection from './MotivationSection'

export default function Landing() {
	return (
		<div className="w-full flex flex-col justify-center  overflow-visible">
			<div>
				<HeroSection />
			</div>
			<div>
				<SectionComponent>
					<PartnerSection />
				</SectionComponent>
			</div>

			<div>{/* <FeaturesSection /> */}</div>

			<div>
				<BenefitSection />
			</div>

			<div>
				<SectionComponent>
					<MotivationSection />
				</SectionComponent>
			</div>

			<div>
				<SectionComponent>
					<OurTeam />
				</SectionComponent>
			</div>
		</div>
	)
}
