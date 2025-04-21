import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
interface ModalProps {
	open: boolean
	onClose: () => void
	children: React.ReactNode
	className?: string
}

const Modal: React.FC<ModalProps> = ({
	open,
	onClose,
	children,
	className = '',
}) => {
	const [visible, setVisible] = useState(false)
	const [animateClass, setAnimateClass] = useState('scale-0')

	useEffect(() => {
		if (open) {
			setVisible(true)
			setTimeout(() => {
				setAnimateClass('scale-100 transition-transform duration-300 ease-out')
			}, 10)
		} else {
			setAnimateClass('scale-0 transition-transform duration-200 ease-in')
			setTimeout(() => setVisible(false), 200)
		}
	}, [open])

	if (!visible) return null

	return createPortal(
		<div
			className="fixed inset-0 bg-gray-500 z-[9999] bg-opacity-50 flex justify-center items-center"
			onClick={onClose}
		>
			<div
				className={`bg-black p-6 rounded-lg shadow-lg transform 	 ${animateClass} ${className}`}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>,
		document.body // Specify the container element for the portal
		// document.getElementById('modal-root')!
	)
}

export default Modal
