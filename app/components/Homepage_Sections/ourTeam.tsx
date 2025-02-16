import { AnimatedTestimonials } from "@/app/components/UI/animated-testimonials";
import { OUR_TEAM } from "@/app/constants";

const OurTeam = () => {
    const testimonials = OUR_TEAM;

    
    return (
        <div>
            <div className="text-4xl text-white font-bold pt-36 pb-5 text-center">
                Our Team
            </div>
            <AnimatedTestimonials testimonials={testimonials} />;
        </div>
    )
}

export default OurTeam;