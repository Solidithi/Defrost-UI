import React, {
	useState,
	Children,
	useRef,
	useLayoutEffect,
	ReactNode,
	FC,
	ButtonHTMLAttributes,
} from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

interface StepIndicatorProps {
	step: number
	currentStep: number
	onClickStep: (step: number) => void
	disableStepIndicators?: boolean
}

interface StepConnectorProps {
	isComplete: boolean
}

interface SlideTransitionProps {
	children: ReactNode
	direction: number
	onHeightReady: (height: number) => void
}

interface StepContentWrapperProps {
	isCompleted: boolean
	currentStep: number
	direction: number
	children: ReactNode
	className?: string
}

interface StepProps {
	children: ReactNode
	canGoToNextStep?: boolean
}

interface StepperProps {
	children: ReactNode
	initialStep?: number
	onStepChange?: (step: number) => void
	onFinalStepCompleted?: () => void
	stepCircleContainerClassName?: string
	stepContainerClassName?: string
	contentClassName?: string
	footerClassName?: string
	backButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>
	nextButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>
	backButtonText?: string
	nextButtonText?: string
	disableStepIndicators?: boolean
	renderStepIndicator?: (props: {
		step: number
		currentStep: number
		onStepClick: (step: number) => void
	}) => ReactNode
	[key: string]: any
}

export default function Stepper({
	children,
	initialStep = 1,
	onStepChange = () => {},
	onFinalStepCompleted = () => {},
	stepCircleContainerClassName = '',
	stepContainerClassName = '',
	contentClassName = '',
	footerClassName = '',
	backButtonProps = {},
	nextButtonProps = {},
	backButtonText = 'Back',
	nextButtonText = 'Continue',
	disableStepIndicators = false,
	renderStepIndicator,
	...rest
}: StepperProps) {
	const [currentStep, setCurrentStep] = useState(initialStep)
	const [direction, setDirection] = useState(0)
	const stepsArray = Children.toArray(children)
	const totalSteps = stepsArray.length
	const isCompleted = currentStep > totalSteps
	const isLastStep = currentStep === totalSteps

	const currentStepElement = stepsArray[
		currentStep - 1
	] as React.ReactElement<StepProps>
	const canGoToNextStep = currentStepElement.props.canGoToNextStep !== false // Default to true if not specified

	const updateStep = (newStep: number) => {
		setCurrentStep(newStep)
		if (newStep > totalSteps) onFinalStepCompleted()
		else onStepChange(newStep)
	}

	const handleBack = () => {
		if (currentStep > 1) {
			setDirection(1)
			updateStep(currentStep - 1)
		}
	}

	const handleNext = () => {
		// Only proceed if the current step is valid
		if (!isLastStep && canGoToNextStep) {
			setDirection(-1)
			updateStep(currentStep + 1)
		}
	}

	const handleComplete = () => {
		// Only complete if the last step is valid
		if (canGoToNextStep) {
			setDirection(1)
			updateStep(totalSteps + 1)
		}
	}

	return (
		<div
			className="flex min-h-full flex-1 flex-col items-center justify-center p-4"
			{...rest}
		>
			<div className={`w-full rounded-4xl ${stepCircleContainerClassName}`}>
				<div
					className={`${stepContainerClassName} flex w-full items-center p-8`}
				>
					{stepsArray.map((_, index) => {
						const stepNumber = index + 1
						const isNotLastStep = index < totalSteps - 1
						return (
							<React.Fragment key={stepNumber}>
								{renderStepIndicator ? (
									renderStepIndicator({
										step: stepNumber,
										currentStep,
										onStepClick: (clicked) => {
											setDirection(clicked > currentStep ? 1 : -1)
											updateStep(clicked)
										},
									})
								) : (
									<StepIndicator
										step={stepNumber}
										disableStepIndicators={disableStepIndicators}
										currentStep={currentStep}
										onClickStep={(clicked) => {
											setDirection(clicked > currentStep ? 1 : -1)
											updateStep(clicked)
										}}
									/>
								)}
								{isNotLastStep && (
									<StepConnector isComplete={currentStep > stepNumber} />
								)}
							</React.Fragment>
						)
					})}
				</div>
				<StepContentWrapper
					isCompleted={isCompleted}
					currentStep={currentStep}
					direction={direction}
					className={`space-y-2 px-8 ${contentClassName}`}
				>
					{stepsArray[currentStep - 1]}
				</StepContentWrapper>
				{!isCompleted && (
					<div className={`px-8 pb-8 ${footerClassName}`}>
						<div
							className={`mt-10 flex ${
								currentStep !== 1 ? 'justify-between' : 'justify-end'
							}`}
						>
							{currentStep !== 1 && (
								<button
									onClick={handleBack}
									className="min-w-[100px] rounded-full px-4 py-1.5 font-comfortaa font-medium tracking-tight transition-all duration-300 bg-white/10 text-gray-200 hover:bg-white/20 hover:text-white border border-white/20 backdrop-blur-sm"
									{...backButtonProps}
								>
									{backButtonText}
								</button>
							)}
							<button
								onClick={isLastStep ? handleComplete : handleNext}
								disabled={!canGoToNextStep}
								className={`min-w-[100px] flex items-center justify-center rounded-full bg-gradient-to-r from-[#F05550] via-[#AD7386] to-[#54A4F2] py-1.5 px-3.5 font-comfortaa font-medium tracking-tight text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(84,164,242,0.6)] hover:brightness-110 active:brightness-90 relative after:absolute after:inset-0 after:rounded-full after:opacity-0 after:bg-gradient-to-r after:from-[#F05550]/30 after:via-[#AD7386]/30 after:to-[#54A4F2]/30 after:blur-md hover:after:opacity-100 after:transition-opacity ${
									!canGoToNextStep
										? 'opacity-50 cursor-not-allowed hover:shadow-none hover:brightness-100 hover:after:opacity-0'
										: ''
								}`}
								{...nextButtonProps}
							>
								{isLastStep ? 'Complete' : nextButtonText}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

function StepContentWrapper({
	isCompleted,
	currentStep,
	direction,
	children,
	className,
}: StepContentWrapperProps) {
	const [parentHeight, setParentHeight] = useState(0)

	return (
		<motion.div
			style={{ position: 'relative', overflow: 'hidden' }}
			animate={{ height: isCompleted ? 0 : parentHeight }}
			transition={{ type: 'spring', duration: 0.4 }}
			className={className}
		>
			<AnimatePresence initial={false} mode="sync" custom={direction}>
				{!isCompleted && (
					<SlideTransition
						key={currentStep}
						direction={direction}
						onHeightReady={(h) => setParentHeight(h)}
					>
						{children}
					</SlideTransition>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

function SlideTransition({
	children,
	direction,
	onHeightReady,
}: SlideTransitionProps) {
	const containerRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		if (containerRef.current) onHeightReady(containerRef.current.offsetHeight)
	}, [children, onHeightReady])

	return (
		<motion.div
			ref={containerRef}
			custom={direction}
			variants={stepVariants}
			initial="enter"
			animate="center"
			exit="exit"
			transition={{ duration: 0.4 }}
			style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
		>
			{children}
		</motion.div>
	)
}

const stepVariants: Variants = {
	enter: (dir) => ({
		x: dir >= 0 ? '-100%' : '100%',
		opacity: 0,
	}),
	center: {
		x: '0%',
		opacity: 1,
	},
	exit: (dir) => ({
		x: dir >= 0 ? '50%' : '-50%',
		opacity: 0,
	}),
}

export const Step: FC<StepProps> = ({ children, canGoToNextStep = true }) => {
	return <div className="px-8">{children}</div>
}

function StepIndicator({
	step,
	currentStep,
	onClickStep,
	disableStepIndicators,
}: StepIndicatorProps) {
	const status =
		currentStep === step
			? 'active'
			: currentStep < step
				? 'inactive'
				: 'complete'

	const handleClick = () => {
		if (step !== currentStep && !disableStepIndicators) onClickStep(step)
	}

	return (
		<motion.div
			onClick={handleClick}
			className="relative cursor-pointer outline-none focus:outline-none"
			animate={status}
			initial={false}
		>
			<motion.div
				variants={{
					inactive: { scale: 1, backgroundColor: '#222', color: '#a3a3a3' },
					active: { scale: 1, backgroundColor: '#54A4F2', color: '#00d8ff' },
					complete: { scale: 1, backgroundColor: '#54A4F2', color: '#3b82f6' },
				}}
				transition={{ duration: 0.3 }}
				className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
			>
				{status === 'complete' ? (
					<CheckIcon className="h-4 w-4 text-black" />
				) : status === 'active' ? (
					<div className="h-3 w-3 rounded-full bg-[#060606]" />
				) : (
					<span className="text-sm">{step}</span>
				)}
			</motion.div>
		</motion.div>
	)
}

function StepConnector({ isComplete }: StepConnectorProps) {
	const lineVariants = {
		incomplete: { width: 0, backgroundColor: 'transparent' },
		complete: { width: '100%', backgroundColor: '#54A4F2' },
	}

	return (
		<div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-neutral-600">
			<motion.div
				className="absolute left-0 top-0 h-full"
				variants={lineVariants}
				initial={false}
				animate={isComplete ? 'complete' : 'incomplete'}
				transition={{ duration: 0.4 }}
			/>
		</div>
	)
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
	return (
		<svg
			{...props}
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			viewBox="0 0 24 24"
		>
			<motion.path
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{
					delay: 0.1,
					type: 'tween',
					ease: 'easeOut',
					duration: 0.3,
				}}
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M5 13l4 4L19 7"
			/>
		</svg>
	)
}
