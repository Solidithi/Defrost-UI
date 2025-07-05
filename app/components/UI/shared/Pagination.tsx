import React from 'react'
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreHorizontal,
} from 'lucide-react'

interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
	showFirstLast?: boolean
	maxVisiblePages?: number
	className?: string
	size?: 'sm' | 'md' | 'lg'
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	showFirstLast = true,
	maxVisiblePages = 5,
	className = '',
	size = 'md',
}: PaginationProps) {
	// Size configurations
	const sizeConfig = {
		sm: {
			buttonSize: 'w-8 h-8',
			fontSize: 'text-sm',
			iconSize: 14,
		},
		md: {
			buttonSize: 'w-10 h-10',
			fontSize: 'text-sm',
			iconSize: 16,
		},
		lg: {
			buttonSize: 'w-12 h-12',
			fontSize: 'text-base',
			iconSize: 18,
		},
	}

	const config = sizeConfig[size]

	// Calculate which page numbers to show
	const getVisiblePages = () => {
		const pages: (number | 'ellipsis')[] = []

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total is less than max visible
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			// Always show first page
			pages.push(1)

			// Calculate start and end of visible range
			let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
			let end = Math.min(
				totalPages - 1,
				currentPage + Math.floor(maxVisiblePages / 2)
			)

			// Adjust if we're near the beginning or end
			if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
				end = Math.min(totalPages - 1, maxVisiblePages - 1)
			}
			if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
				start = Math.max(2, totalPages - maxVisiblePages + 2)
			}

			// Add ellipsis if needed
			if (start > 2) {
				pages.push('ellipsis')
			}

			// Add middle pages
			for (let i = start; i <= end; i++) {
				pages.push(i)
			}

			// Add ellipsis if needed
			if (end < totalPages - 1) {
				pages.push('ellipsis')
			}

			// Always show last page (if not already included)
			if (totalPages > 1) {
				pages.push(totalPages)
			}
		}

		return pages
	}

	const visiblePages = getVisiblePages()

	if (totalPages <= 1) {
		return null
	}

	const buttonBaseClass = `flex items-center justify-center ${config.buttonSize} ${config.fontSize} rounded-lg border transition-all duration-200 font-medium`
	const normalButtonClass = `${buttonBaseClass} border-white/10 bg-white/5 hover:bg-white/10 text-white hover:border-white/20 hover:shadow-lg hover:shadow-white/5`
	const disabledButtonClass = `${buttonBaseClass} border-white/5 bg-white/5 text-gray-500 cursor-not-allowed`
	const activeButtonClass = `${buttonBaseClass} border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20 hover:bg-blue-500/30`

	return (
		<div className={`flex items-center justify-center space-x-2 ${className}`}>
			{/* First Page Button */}
			{showFirstLast && totalPages > maxVisiblePages && (
				<button
					onClick={() => onPageChange(1)}
					disabled={currentPage === 1}
					className={
						currentPage === 1 ? disabledButtonClass : normalButtonClass
					}
					title="First Page"
				>
					<ChevronsLeft size={config.iconSize} />
				</button>
			)}

			{/* Previous Page Button */}
			<button
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
				className={currentPage === 1 ? disabledButtonClass : normalButtonClass}
				title="Previous Page"
			>
				<ChevronLeft size={config.iconSize} />
			</button>

			{/* Page Numbers */}
			<div className="flex items-center space-x-2">
				{visiblePages.map((page, index) => {
					if (page === 'ellipsis') {
						return (
							<div
								key={`ellipsis-${index}`}
								className={`flex items-center justify-center ${config.buttonSize} text-gray-400`}
							>
								<MoreHorizontal size={config.iconSize} />
							</div>
						)
					}

					const pageNumber = page as number
					const isCurrentPage = pageNumber === currentPage

					return (
						<button
							key={pageNumber}
							onClick={() => onPageChange(pageNumber)}
							className={isCurrentPage ? activeButtonClass : normalButtonClass}
							title={`Page ${pageNumber}`}
						>
							{pageNumber}
						</button>
					)
				})}
			</div>

			{/* Next Page Button */}
			<button
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
				className={
					currentPage === totalPages ? disabledButtonClass : normalButtonClass
				}
				title="Next Page"
			>
				<ChevronRight size={config.iconSize} />
			</button>

			{/* Last Page Button */}
			{showFirstLast && totalPages > maxVisiblePages && (
				<button
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage === totalPages}
					className={
						currentPage === totalPages ? disabledButtonClass : normalButtonClass
					}
					title="Last Page"
				>
					<ChevronsRight size={config.iconSize} />
				</button>
			)}
		</div>
	)
}

// Enhanced Pagination Info Component
export function PaginationInfo({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	className = '',
	showRange = true,
	showTotal = true,
}: {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
	className?: string
	showRange?: boolean
	showTotal?: boolean
}) {
	const startItem = (currentPage - 1) * itemsPerPage + 1
	const endItem = Math.min(currentPage * itemsPerPage, totalItems)

	return (
		<div className={`text-sm text-gray-400 ${className}`}>
			{showRange && (
				<span>
					Showing {startItem} to {endItem}
				</span>
			)}
			{showRange && showTotal && <span> of </span>}
			{showTotal && (
				<span>
					{totalItems} result{totalItems !== 1 ? 's' : ''}
				</span>
			)}
			{totalPages > 1 && (
				<span className="ml-2 text-gray-500">
					(Page {currentPage} of {totalPages})
				</span>
			)}
		</div>
	)
}
