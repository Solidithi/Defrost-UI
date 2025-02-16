import Image from 'next/image'
import HeroSection from './components/Homepage_Sections/heroSection'
import KeyFeatureSection from './components/Homepage_Sections/keyFeatureSection'
import OurTeam from './components/Homepage_Sections/ourTeam'

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
