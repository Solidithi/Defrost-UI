import Image from 'next/image'
import HeroSection from './components/Homepage_Sections/heroSection'
import KeyFeatureSection from './components/Homepage_Sections/keyFeatureSection'
import PartnerSection from './components/Homepage_Sections/partnerSection'
import OurTeamSection from './components/Homepage_Sections/ourTeamSection'

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <KeyFeatureSection />
      {/* <PartnerSection/> */}
      <OurTeamSection />
      {/* <FeaturesSection />
      <CTASection /> */}


    </div>
  )
}
