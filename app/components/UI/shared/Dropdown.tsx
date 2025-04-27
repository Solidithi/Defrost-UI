import { useState, useRef, useEffect } from 'react'

interface DropdownOption {
	id: string
	name: string
	address?: string
}

interface CustomDropdownProps {
	className?: string
	options: DropdownOption[]
	placeholder?: string
	onChange?: (option: DropdownOption) => void
	defaultValue?: string
	darkMode?: boolean
}

const CustomDropdown = ({
	className = '',
	options,
	placeholder = 'Select an option',
	onChange,
	defaultValue,
	darkMode = true, // Default to dark mode for your UI
}: CustomDropdownProps) => {
	// Initialize state
	const [isOpen, setIsOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(
		defaultValue || placeholder
	)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Update selection if defaultValue changes
	useEffect(() => {
		if (defaultValue && defaultValue !== selectedOption) {
			setSelectedOption(defaultValue)
		}
	}, [defaultValue, selectedOption])

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	// Handle option selection
	const handleOptionSelect = (option: DropdownOption) => {
		setSelectedOption(option.name)
		setIsOpen(false)

		// Call onChange callback if provided
		if (onChange) {
			onChange(option)
		}
	}

	// Styling based on theme
	const buttonStyles = darkMode
		? 'bg-gray-800 border-gray-700 text-white'
		: 'bg-[#f3f3f3] border-gray-300 text-gray-800'

	const dropdownMenuStyles = darkMode
		? 'bg-gray-800 border-gray-700 text-white'
		: 'bg-white border-gray-300'

	const hoverStyles = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			{/* Dropdown Button */}
			<button
				className={`w-full px-4 py-4 text-center border rounded-3xl focus:outline-none ${buttonStyles}`}
				onClick={() => setIsOpen(!isOpen)}
				type="button"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
			>
				<span>{selectedOption}</span>
			</button>

			{/* Dropdown Menu - Increased z-index to ensure it appears above other elements */}
			{isOpen && (
				<div
					className={`absolute w-full border rounded-3xl shadow-lg mt-2 z-[100] max-h-72 overflow-y-auto ${dropdownMenuStyles}`}
					role="listbox"
					style={{ position: 'absolute' }} // Explicitly set position
				>
					{options.map((option) => (
						<div
							key={option.id}
							className={`px-4 py-3 text-center cursor-pointer ${hoverStyles}`}
							onClick={() => handleOptionSelect(option)}
							role="option"
							aria-selected={selectedOption === option.name}
						>
							<span>{option.name}</span>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default CustomDropdown
