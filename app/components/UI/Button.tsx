import React from 'react'

interface ButtonProps {
	children: React.ReactNode
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
	className?: string
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
	return (
		<button
			onClick={onClick}
			className={`
            px-4 py-2  text-white rounded-full font-comfortaa 
    transition-all duration-300 ease-in-out 
    hover:opacity-80 hover:shadow-lg hover:scale-105 
    active:scale-95 active:opacity-90 
    ${className}
        `}
		>
			{children}
		</button>
	)
}

export default Button
