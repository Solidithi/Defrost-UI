import Image from 'next/image'
import HeroSection from './components/homepage-sections/HeroSection'
import KeyFeatureSection from './components/homepage-sections/KeyFeatureSection'
import OurTeam from './components/homepage-sections/OurTeam'

export default function Home() {
	return (
		<div className="w-full">
			<HeroSection />
			<KeyFeatureSection />
			<OurTeam />
			{/* <FeaturesSection />
      <CTASection /> */}
		</div>
	)
}
