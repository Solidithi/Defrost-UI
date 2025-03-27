// import Image from 'next/image'
'use client'
import HeroSection from './components/homepage-sections/HeroSection'
import PartnerSection from './components/homepage-sections/PartnersSection'
import OurTeam from './components/homepage-sections/OurTeam'
import FeaturesSection from './components/homepage-sections/FeaturesSection'
import SectionComponent from './components/UI/SectionComponent'
import BenefitSection from './components/homepage-sections/BenefitSection'
import MotivationSection from './components/homepage-sections/MotivationSection'
export default function Home() {
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

			<div>
				<FeaturesSection />
			</div>

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
