// import Image from 'next/image'
'use client'
import HeroSection from './components/homepage-sections/HeroSection'
import PartnerSection from './components/homepage-sections/PartnersSection'
import OurTeam from './components/homepage-sections/OurTeam'
import FeaturesSection from './components/homepage-sections/FeaturesSection'
import SectionComponent from './components/UI/SectionComponent'
export default function Home() {
	return (
		<div className="w-full">
			<SectionComponent>
				<HeroSection />
			</SectionComponent>
			<SectionComponent>
				<PartnerSection />
			</SectionComponent>
			<SectionComponent>
				<FeaturesSection />
			</SectionComponent>
			<SectionComponent>
				<OurTeam />
			</SectionComponent>
		</div>
	)
}
