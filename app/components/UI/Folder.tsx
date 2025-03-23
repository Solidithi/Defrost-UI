import React, { useState } from 'react'

interface FolderProps {
	color?: string
	size?: number
	items?: React.ReactNode[]
	className?: string
	isOpen?: boolean
	onOpenChange?: (isOpen: boolean) => void
	autoClose?: boolean
	autoCloseDelay?: number
	maxItems?: 1 | 2 | 3
}

const darkenColor = (hex: string, percent: number): string => {
	let color = hex.startsWith('#') ? hex.slice(1) : hex
	if (color.length === 3) {
		color = color
			.split('')
			.map((c) => c + c)
			.join('')
	}
	const num = parseInt(color, 16)
	let r = (num >> 16) & 0xff
	let g = (num >> 8) & 0xff
	let b = num & 0xff
	r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))))
	g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))))
	b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))))
	return (
		'#' +
		((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
	)
}

const Folder: React.FC<FolderProps> = ({
	color = '#00d8ff',
	size = 1,
	items = [],
	className = '',
	isOpen: controlledOpen,
	onOpenChange,
	autoClose = false,
	autoCloseDelay = 3000,
	maxItems = 3,
}) => {
	// Clamp maxItems between 1 and 3
	const actualMaxItems = Math.min(Math.max(maxItems, 1), 3)

	// Slice and pad items array
	const papers = items.slice(0, actualMaxItems)
	while (papers.length < actualMaxItems) {
		papers.push(null)
	}

	const [internalOpen, setInternalOpen] = useState(false)
	const open = controlledOpen !== undefined ? controlledOpen : internalOpen

	const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
		Array.from({ length: actualMaxItems }, () => ({ x: 0, y: 0 }))
	)

	const folderBackColor = darkenColor(color, 0.08)
	const paper1 = darkenColor('#ffffff', 0.1)
	const paper2 = darkenColor('#ffffff', 0.05)
	const paper3 = '#ffffff'

	const handleClick = () => {
		const newOpenState = !open

		if (controlledOpen === undefined) {
			setInternalOpen(newOpenState)
		}

		if (onOpenChange) {
			onOpenChange(newOpenState)
		}

		if (newOpenState && autoClose) {
			setTimeout(() => {
				if (controlledOpen === undefined) {
					setInternalOpen(false)
				}
				if (onOpenChange) {
					onOpenChange(false)
				}
			}, autoCloseDelay)
		}

		if (!newOpenState) {
			setPaperOffsets(
				Array.from({ length: actualMaxItems }, () => ({ x: 0, y: 0 }))
			)
		}
	}

	const handlePaperMouseMove = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number
	) => {
		if (!open) return
		const rect = e.currentTarget.getBoundingClientRect()
		const centerX = rect.left + rect.width / 2
		const centerY = rect.top + rect.height / 2
		const offsetX = (e.clientX - centerX) * 0.15
		const offsetY = (e.clientY - centerY) * 0.15
		setPaperOffsets((prev) => {
			const newOffsets = [...prev]
			newOffsets[index] = { x: offsetX, y: offsetY }
			return newOffsets
		})
	}

	const handlePaperMouseLeave = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number
	) => {
		setPaperOffsets((prev) => {
			const newOffsets = [...prev]
			newOffsets[index] = { x: 0, y: 0 }
			return newOffsets
		})
	}

	const folderStyle: React.CSSProperties = {
		'--folder-color': color,
		'--folder-back-color': folderBackColor,
		'--paper-1': paper1,
		'--paper-2': paper2,
		'--paper-3': paper3,
	} as React.CSSProperties

	// Outer scale style
	const scaleStyle = { transform: `scale(${size})` }

	const getOpenTransform = (index: number) => {
		// Custom transforms based on maxItems
		if (actualMaxItems === 1) {
			return 'translate(-50%, -100%) rotate(10deg)' // Center single item
		} else if (actualMaxItems === 2) {
			if (index === 0) return 'translate(-105%, -70%) rotate(-15deg)' // Left item
			if (index === 1) return 'translate(5%, -70%) rotate(15deg)' // Right item
		} else {
			// Default 3-item arrangement
			if (index === 0) return 'translate(-120%, -70%) rotate(-15deg)' // Left item
			if (index === 1) return 'translate(10%, -70%) rotate(15deg)' // Right item
			if (index === 2) return 'translate(-50%, -100%) rotate(5deg)' // Center item
		}
		return ''
	}

	// Get size classes based on maxItems
	const getSizeClasses = (index: number) => {
		if (actualMaxItems === 1) {
			return open ? 'w-[80%] h-[80%]' : 'w-[90%] h-[80%]'
		} else if (actualMaxItems === 2) {
			return open ? 'w-[80%] h-[80%]' : 'w-[80%] h-[90%]'
		} else {
			// Original three item sizing
			if (index === 0) return open ? 'w-[70%] h-[80%]' : 'w-[70%] h-[80%]'
			if (index === 1) return open ? 'w-[80%] h-[80%]' : 'w-[80%] h-[70%]'
			if (index === 2) return open ? 'w-[90%] h-[80%]' : 'w-[90%] h-[60%]'
		}
		return ''
	}

	return (
		<div style={scaleStyle} className={className}>
			<div
				className={`group relative transition-all duration-200 ease-in cursor-pointer ${
					!open ? 'hover:-translate-y-2' : ''
				}`}
				style={{
					...folderStyle,
					transform: open ? 'translateY(-8px)' : undefined,
				}}
				onClick={handleClick}
			>
				<div
					className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
					style={{ backgroundColor: folderBackColor }}
				>
					<span
						className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0"
						style={{ backgroundColor: folderBackColor }}
					></span>
					{/* Render papers */}
					{papers.map((item, i) => {
						const sizeClasses = getSizeClasses(i)
						const transformStyle = open
							? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
							: undefined

						// For single item, use paper3 (white)
						// For two items, use paper2 and paper3
						// For three items, use all three paper colors
						const paperColor =
							actualMaxItems === 1
								? paper3
								: actualMaxItems === 2
									? i === 0
										? paper2
										: paper3
									: i === 0
										? paper1
										: i === 1
											? paper2
											: paper3

						return (
							<div
								key={i}
								onMouseMove={(e) => handlePaperMouseMove(e, i)}
								onMouseLeave={(e) => handlePaperMouseLeave(e, i)}
								className={`absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out ${
									!open
										? 'transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0'
										: 'hover:scale-110'
								} ${sizeClasses}`}
								style={{
									...(!open ? {} : { transform: transformStyle }),
									backgroundColor: paperColor,
									borderRadius: '10px',
								}}
							>
								{item}
							</div>
						)
					})}
					<div
						className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
							!open ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]' : ''
						}`}
						style={{
							backgroundColor: color,
							borderRadius: '5px 10px 10px 10px',
							...(open && { transform: 'skew(15deg) scaleY(0.6)' }),
						}}
					></div>
					<div
						className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
							!open ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]' : ''
						}`}
						style={{
							backgroundColor: color,
							borderRadius: '5px 10px 10px 10px',
							...(open && { transform: 'skew(-15deg) scaleY(0.6)' }),
						}}
					></div>
				</div>
			</div>
		</div>
	)
}

export default Folder
