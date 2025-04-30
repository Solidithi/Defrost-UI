import VerticalProgressBar from './VerticalProgressBar'

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
							<div className="flex gap-4">
								{socials?.website && socials.website.trim() !== '' && (
									<a
										href={socials.website}
										target="_blank"
										rel="noopener noreferrer"
										className="text-white hover:text-gray-400 transition-colors"
										title="Website"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											fill="currentColor"
											viewBox="0 0 16 16"
										>
											<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.615.338-2.5H8.5zM5.145 12c.138.386.295.744.47 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
										</svg>
									</a>
								)}

								{socials?.twitter && socials.twitter.trim() !== '' && (
									<a
										href={socials.twitter}
										target="_blank"
										rel="noopener noreferrer"
										className="text-white hover:text-gray-400 transition-colors"
										title="X (Twitter)"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
										</svg>
									</a>
								)}

								{socials?.telegram && socials.telegram.trim() !== '' && (
									<a
										href={socials.telegram}
										target="_blank"
										rel="noopener noreferrer"
										className="text-white hover:text-gray-400 transition-colors"
										title="Telegram"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											fill="currentColor"
											viewBox="0 0 16 16"
										>
											<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
										</svg>
									</a>
								)}

								{socials?.discord && socials.discord.trim() !== '' && (
									<a
										href={socials.discord}
										target="_blank"
										rel="noopener noreferrer"
										className="text-white hover:text-gray-400 transition-colors"
										title="Discord"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="22"
											height="22"
											fill="currentColor"
											viewBox="0 0 16 16"
										>
											<path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
										</svg>
									</a>
								)}

								{socials?.github && socials.github.trim() !== '' && (
									<a
										href={socials.github}
										target="_blank"
										rel="noopener noreferrer"
										className="text-white hover:text-gray-400 transition-colors"
										title="GitHub"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											fill="currentColor"
											viewBox="0 0 16 16"
										>
											<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
										</svg>
									</a>
								)}
							</div>
						</div>
					)}

					{!hasSocialLinks && (
						<p className="text-gray-400 text-sm">
							Follow us on
							<a href="#" className="text-blue-400 underline mx-1">
								Twitter
							</a>
							or
							<a href="#" className="text-blue-400 underline mx-1">
								Telegram
							</a>
							to keep updated.
						</p>
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
