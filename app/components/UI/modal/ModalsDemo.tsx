'use client'

import { useState } from 'react'
import { ErrorModal } from './ErrorModal'
import { WarningModal } from './WarningModal'
import { SpinnerModal } from './SpinnerModal'
import { LoadingModal } from './LoadingModal'
import Button from '../button/Button'

/**
 * TODO: Showcasing purpose, remove when completed the implementation
 */
export function ModalsDemo() {
	// State for controlling the visibility of various modals
	const [showError, setShowError] = useState(false)
	const [showWarning, setShowWarning] = useState(false)
	const [showSpinner, setShowSpinner] = useState(false)
	const [showLoading, setShowLoading] = useState(false)

	// Demo error for the error modal
	const sampleError = new Error(
		'This is a sample error message with technical details.'
	)

	// Function to simulate an async operation with the spinner
	const simulateOperation = () => {
		setShowSpinner(true)
		// Auto hide after 2 seconds for demo purposes
		setTimeout(() => {
			setShowSpinner(false)
		}, 2000)
	}

	// Function to simulate a longer operation with the loading modal
	const simulateLongerOperation = () => {
		setShowLoading(true)
		// Auto hide after 3 seconds for demo purposes
		setTimeout(() => {
			setShowLoading(false)
		}, 3000)
	}

	// Function to handle warning confirmation
	const handleWarningConfirm = () => {
		console.log('Warning confirmed')
		// Additional action can be performed here
	}

	return (
		<div className="p-6 space-y-10">
			<h1 className="text-2xl font-bold mb-6">Modal Components Demo</h1>

			<div className="space-y-6">
				<div>
					<h2 className="text-xl mb-3">Error Modal</h2>
					<p className="mb-3 text-sm text-gray-300">
						Displays error messages with an option to show technical details
					</p>
					<Button onClick={() => setShowError(true)}>Show Error Modal</Button>
					<ErrorModal
						isOpen={showError}
						title="Operation Failed"
						message="We couldn't complete your request due to an error."
						error={sampleError}
						showDetails={true}
						onClose={() => setShowError(false)}
					/>
				</div>

				<div>
					<h2 className="text-xl mb-3">Warning Modal</h2>
					<p className="mb-3 text-sm text-gray-300">
						Alerts users about potential issues and allows them to proceed or
						cancel
					</p>
					<Button onClick={() => setShowWarning(true)}>
						Show Warning Modal
					</Button>
					<WarningModal
						isOpen={showWarning}
						title="Are you sure?"
						message="This action cannot be undone. Please confirm if you want to proceed."
						onClose={() => setShowWarning(false)}
						onConfirm={handleWarningConfirm}
						confirmText="Yes, proceed"
					/>
				</div>

				<div>
					<h2 className="text-xl mb-3">Spinner Modal</h2>
					<p className="mb-3 text-sm text-gray-300">
						Simple loading spinner overlay for quick operations
					</p>
					<Button onClick={simulateOperation}>Show Spinner Modal</Button>
					<SpinnerModal isOpen={showSpinner} message="Loading..." />
				</div>

				<div>
					<h2 className="text-xl mb-3">Loading Modal</h2>
					<p className="mb-3 text-sm text-gray-300">
						Detailed loading indicator for longer operations
					</p>
					<Button onClick={simulateLongerOperation}>Show Loading Modal</Button>
					<LoadingModal
						isOpen={showLoading}
						message="Processing Transaction"
						subMessage="This may take a few moments to complete"
					/>
				</div>
			</div>
		</div>
	)
}
