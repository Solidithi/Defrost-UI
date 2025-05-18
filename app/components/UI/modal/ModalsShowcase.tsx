'use client'

import { useState } from 'react'
import { ErrorModal } from './ErrorModal'
import { WarningModal } from './WarningModal'
import { SpinnerModal } from './SpinnerModal'
import { LoadingModal } from './LoadingModal'
import Button from '../button/Button'
import { AlertTriangle, Info, AlertCircle, Loader2 } from 'lucide-react'
/**
 * TODO: Showcasing purpose, remove when completed the implementation
 */
export function ModalsShowcase() {
	// States for controlling modal visibility
	const [showError, setShowError] = useState(false)
	const [showWarning, setShowWarning] = useState(false)
	const [showSpinner, setShowSpinner] = useState(false)
	const [showLoading, setShowLoading] = useState(false)

	// Configuration states for modals
	const [errorTitle, setErrorTitle] = useState('Operation Failed')
	const [errorMessage, setErrorMessage] = useState(
		"We couldn't complete your request due to an error."
	)
	const [showErrorDetails, setShowErrorDetails] = useState(true)

	const [warningTitle, setWarningTitle] = useState('Are you sure?')
	const [warningMessage, setWarningMessage] = useState(
		'This action cannot be undone. Please confirm if you want to proceed.'
	)
	const [confirmText, setConfirmText] = useState('Yes, proceed')

	const [spinnerMessage, setSpinnerMessage] = useState('Loading...')
	const [spinnerSize, setSpinnerSize] = useState(12)
	const [spinnerColor, setSpinnerColor] = useState('border-blue-500')

	const [loadingTitle, setLoadingTitle] = useState('Processing Transaction')
	const [loadingSubtitle, setLoadingSubtitle] = useState(
		'This may take a few moments to complete'
	)

	// Sample error for ErrorModal
	const sampleError = new Error(
		'This is a detailed technical error message that would normally only be shown to developers. It contains stack traces and other useful debugging information.'
	)

	// Functions to simulate operations
	const simulateSpinnerOperation = () => {
		setShowSpinner(true)
		setTimeout(() => setShowSpinner(false), 3000)
	}

	const simulateLoadingOperation = () => {
		setShowLoading(true)
		setTimeout(() => setShowLoading(false), 4000)
	}

	// Function to handle warning confirmation
	const handleWarningConfirm = () => {
		console.log('Warning confirmed')
		// You could add additional actions here
	}

	const Card = ({ title, icon, children, className = '' }) => (
		<div
			className={`bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 ${className}`}
		>
			<div className="flex items-center gap-3 mb-4">
				{icon}
				<h3 className="text-xl font-bold">{title}</h3>
			</div>
			{children}
		</div>
	)

	const FormField = ({ label, children }) => (
		<div className="mb-4">
			<label className="block text-sm text-gray-400 mb-1">{label}</label>
			{children}
		</div>
	)

	const Input = ({ value, onChange, placeholder = '' }) => (
		<input
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
			placeholder={placeholder}
		/>
	)

	const Select = ({ value, onChange, options }) => (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	)

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
			<Card
				title="Error Modal"
				icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
			>
				<FormField label="Title">
					<Input value={errorTitle} onChange={setErrorTitle} />
				</FormField>
				<FormField label="Message">
					<Input value={errorMessage} onChange={setErrorMessage} />
				</FormField>
				<FormField label="Show Technical Details">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={showErrorDetails}
							onChange={(e) => setShowErrorDetails(e.target.checked)}
							className="form-checkbox h-4 w-4 text-blue-500"
						/>
						<span className="text-sm text-gray-300">Show Error Details</span>
					</label>
				</FormField>
				<Button onClick={() => setShowError(true)} className="mt-4 w-full">
					Show Error Modal
				</Button>
				<ErrorModal
					isOpen={showError}
					title={errorTitle}
					message={errorMessage}
					error={sampleError}
					showDetails={showErrorDetails}
					onClose={() => setShowError(false)}
				/>
			</Card>

			<Card
				title="Warning Modal"
				icon={<AlertCircle className="h-6 w-6 text-amber-500" />}
			>
				<FormField label="Title">
					<Input value={warningTitle} onChange={setWarningTitle} />
				</FormField>
				<FormField label="Message">
					<Input value={warningMessage} onChange={setWarningMessage} />
				</FormField>
				<FormField label="Confirm Button Text">
					<Input value={confirmText} onChange={setConfirmText} />
				</FormField>
				<Button onClick={() => setShowWarning(true)} className="mt-4 w-full">
					Show Warning Modal
				</Button>
				<WarningModal
					isOpen={showWarning}
					title={warningTitle}
					message={warningMessage}
					onClose={() => setShowWarning(false)}
					onConfirm={handleWarningConfirm}
					confirmText={confirmText}
				/>
			</Card>

			<Card
				title="Spinner Modal"
				icon={<Loader2 className="h-6 w-6 text-blue-500 animate-spin" />}
			>
				<FormField label="Message">
					<Input value={spinnerMessage} onChange={setSpinnerMessage} />
				</FormField>
				<FormField label="Size">
					<input
						type="range"
						min="6"
						max="20"
						value={spinnerSize}
						onChange={(e) => setSpinnerSize(parseInt(e.target.value))}
						className="w-full"
					/>
					<div className="text-xs text-gray-400 mt-1">{spinnerSize}px</div>
				</FormField>
				<FormField label="Color">
					<Select
						value={spinnerColor}
						onChange={setSpinnerColor}
						options={[
							{ value: 'border-blue-500', label: 'Blue' },
							{ value: 'border-red-500', label: 'Red' },
							{ value: 'border-green-500', label: 'Green' },
							{ value: 'border-amber-500', label: 'Amber' },
							{ value: 'border-purple-500', label: 'Purple' },
							{ value: 'border-cyan-500', label: 'Cyan' },
						]}
					/>
				</FormField>
				<Button onClick={simulateSpinnerOperation} className="mt-4 w-full">
					Show Spinner Modal
				</Button>
				<SpinnerModal
					isOpen={showSpinner}
					message={spinnerMessage}
					size={spinnerSize}
					color={spinnerColor}
				/>
			</Card>

			<Card
				title="Loading Modal"
				icon={<Info className="h-6 w-6 text-cyan-500" />}
			>
				<FormField label="Title">
					<Input value={loadingTitle} onChange={setLoadingTitle} />
				</FormField>
				<FormField label="Subtitle">
					<Input value={loadingSubtitle} onChange={setLoadingSubtitle} />
				</FormField>
				<Button onClick={simulateLoadingOperation} className="mt-4 w-full">
					Show Loading Modal
				</Button>
				<LoadingModal
					isOpen={showLoading}
					message={loadingTitle}
					subMessage={loadingSubtitle}
				/>
			</Card>
		</div>
	)
}
