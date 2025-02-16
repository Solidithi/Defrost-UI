import Image from 'next/image'
import HeroSection from './components/Homepage_Sections/heroSection'
import KeyFeatureSection from './components/Homepage_Sections/keyFeatureSection'

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <KeyFeatureSection />
      {/* <FeaturesSection />
      <CTASection /> */}


    </div>
  )
}
