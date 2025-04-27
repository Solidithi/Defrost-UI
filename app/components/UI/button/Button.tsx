import React from 'react'

interface ButtonProps {
	children: React.ReactNode
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
	className?: string
	disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	className,
	disabled = false,
}) => {
	return (
		<button
			onClick={onClick}
			className={
				disabled
					? 'cursor-not-allowed rounded-full font-comfortaa bg-white/10 opacity-50 text-white px-4 py-2'
					: `px-4 py-2 text-white rounded-full font-comfortaa transition-all duration-300 ease-in-out 
					hover:opacity-80 hover:shadow-lg hover:scale-105 
					active:scale-95 active:opacity-90 ${className}
        `
			}
			disabled={disabled}
		>
			{children}
		</button>
	)
}

export default Button
