import VerticalProgressBar from './VerticalProgressBar'
import SocialLinks from '../shared/SocialLinks'

interface ProjectProgressProps {
	projectProgress?: number
	steps?: number
	currentStep?: number
	socials?: {
		website?: string
		twitter?: string
		telegram?: string
		discord?: string
		github?: string
	}
}

interface ProgressBarProps {
	steps: { name: string }[]
	currentStep: number
}

const ProjectProgress = ({ socials }: ProjectProgressProps) => {
	const steps = [{ name: 'Upcoming' }, { name: 'Ongoing' }, { name: 'Ended' }]
	const currentStep = 2

	// Only show socials if they exist and aren't empty strings
	const hasSocialLinks =
		socials &&
		Object.values(socials).some(
			(link) => typeof link === 'string' && link.trim() !== ''
		)

	return (
		<div className="border rounded-xl glass-component-3 text-white w-full h-full">
			<div className="xl:flex-col flex items-stretch justify-between md:flex-col md:gap-5 sm:flex-col smL:gap-5">
				<div className="p-8">
					<div className="text-xl font-bold font-orbitron mb-4 bg-gradient-to-r bg-white bg-clip-text text-transparent">
						Project Progress
					</div>
					<p className="text-gray-300 text-sm font-comfortaa mb-6 w-64">
						If you have funded this project, we will be in touch to let you know
						when the rewards have started distributing and when you can claim
						them.
					</p>

					{hasSocialLinks && (
						<div className="text-gray-300 text-sm">
							<p className="mb-3 font-semibold">Follow us on:</p>
							<SocialLinks socials={socials} iconSize="medium" align="start" />
						</div>
					)}
				</div>
				{/* <div className="border-l border-gray-400 self-stretch mx-8"></div> */}
				<div className="px-8 pb-[92px]">
					<VerticalProgressBar steps={steps} currentStep={currentStep} />
				</div>
			</div>
		</div>
	)
}

export default ProjectProgress
