import { BackgroundBeamsWithCollision } from '../UI/BackgroundBeamsWithCollision'
import { TextHoverEffect } from '../UI/TextHoverEffect'
import circle from '../../../public/Subtract.png'
import bg from '../../../public/universe.jpg'
import Image from 'next/image'
import SplitText from '../SplitText'
const HeroSection = () => {
	return (
		<section className="relative overflow-hidden h-screen">
			{/* <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src={bg}
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div> */}
			<BackgroundBeamsWithCollision>
				<div className="absolute top-0 left-0 w-full flex items-center justify-center text-white opacity-20">
					<TextHoverEffect text="Launchpool" />
				</div>

				<div className="h-screen flex flex-col justify-center items-center bg-[#0A0641] text-white gap-10 pt-20">
					{/* <h1 className="text-5xl font-bold">Egalitarian Investing</h1> */}
					<SplitText
						text="Egalitarian Investing"
						className="text-5xl font-bold"
						delay={75}
						animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
						animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
						// easing="easeOutCubic"
						threshold={0.2}
						rootMargin="-50px"
						// onLetterAnimationComplete={handleAnimationComplete}
					/>
					<span className="text-center text-lg w-2/3">
						Launchpool{' '}
						<span className="font-extralight">
							believe all project stakeholders are as important as each other.
							Investment funds and communities should work side by side on
							projects, on the same terms, towards the same goals. Launchpool
							 harnesses their strengths, and aligns their incentives, so that
							the sum is greater than its constituent parts.
						</span>
					</span>

					<button className=" bg-gradient-to-r from-[#F509B5] to-[#5253B9] text-white px-5 rounded-full h-10 w-48">
						<span className="text-md font-bold relative">Start now !!!</span>
					</button>
				</div>
			</BackgroundBeamsWithCollision>
		</section>
	)
}
export default HeroSection
