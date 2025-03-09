import { AnimatedTestimonials } from '@/app/components/UI/AnimatedTestimonials'
import { OUR_TEAM } from '@/app/constants'
import CircularText from '../UI/circular-text'

const OurTeamSection = () => {
	const testimonials = OUR_TEAM

	return (
		<div className="pt-36 pb-24">
			<div className="text-4xl text-white font-bold  pb-5 text-center">
				Our Team
			</div>
			<AnimatedTestimonials testimonials={testimonials} />;
			{/* <CircularText
                text="DEFROST🔥SQUAD❄"
                onHover="speedUp"
                spinDuration={20}
                className="custom-class" 
            /> */}{' '}
			{/*This is in animated testimonials*/}
		</div>
	)
}

export default OurTeamSection
