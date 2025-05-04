'use client'

import React from 'react'
import { shortenStr } from '@/app/utils/display'

// Generic type for column definition
export interface Column<T> {
	header: string
	accessor: keyof T | ((item: T) => React.ReactNode)
	alignment?: 'left' | 'right' | 'center'
	className?: string
}

// Props for the DataTable component
export interface DataTableProps<T> {
	data: T[]
	columns: Column<T>[]
	keyField: keyof T
	className?: string
	noDataMessage?: string
	renderActions?: (item: T) => React.ReactNode
	isLoading?: boolean
	renderExpandableRow?: (item: T) => React.ReactNode
	onRowClick?: (item: T | any) => void
}

// Generic DataTable component
const DataTable = <T extends {}>({
	data,
	columns,
	keyField,
	className = '',
	noDataMessage = 'No data available',
	renderActions,
	isLoading = false,
	renderExpandableRow,
	onRowClick,
}: DataTableProps<T>) => {
	// Helper to safely get a value using an accessor
	const getValue = (item: T, accessor: Column<T>['accessor']) => {
		if (typeof accessor === 'function') {
			return accessor(item)
		}
		const value = item[accessor]
		// Ensure the value is a valid ReactNode (string, number, etc.)
		return value !== null && value !== undefined ? String(value) : ''
	}

	// Get alignment class
	const getAlignmentClass = (alignment: Column<T>['alignment']) => {
		switch (alignment) {
			case 'right':
				return 'text-right'
			case 'center':
				return 'text-center'
			default:
				return 'text-left'
		}
	}

	if (isLoading) {
		return (
			<div className="glass-component-3 w-full rounded-[26px] p-8 flex flex-col items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
				<div className="text-xl font-orbitron">Loading data...</div>
			</div>
		)
	}

	if (data.length === 0) {
		return (
			<div className="glass-component-3 w-full rounded-[26px] p-8 flex flex-col items-center justify-center">
				<div className="text-xl font-orbitron mb-4">{noDataMessage}</div>
			</div>
		)
	}

	return (
		<div
			className={`glass-component-3 w-full rounded-[26px] overflow-hidden ${className}`}
		>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-white border-opacity-10">
							{columns.map((column, index) => (
								<th
									key={index}
									className={`${getAlignmentClass(column.alignment)} p-4 ${column.className || ''}`}
								>
									{column.header}
								</th>
							))}
							{renderActions && <th className="text-right p-4">Actions</th>}
						</tr>
					</thead>
					<tbody>
						{data.map((item) => (
							<React.Fragment key={String(item[keyField])}>
								<tr
									className={`border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 ${onRowClick ? 'cursor-pointer' : ''}`}
									onClick={() => onRowClick && onRowClick(item)}
								>
									{columns.map((column, index) => (
										<td
											key={index}
											className={`${getAlignmentClass(column.alignment)} p-4 ${column.className || ''}`}
										>
											{getValue(item, column.accessor)}
										</td>
									))}
									{renderActions && (
										<td className="p-4 text-right">{renderActions(item)}</td>
									)}
								</tr>
								{renderExpandableRow && (
									<tr className="w-full border-b border-white border-opacity-10">
										<td
											colSpan={columns.length + (renderActions ? 1 : 0)}
											className="p-0 overflow-hidden"
										>
											{renderExpandableRow(item)}
										</td>
									</tr>
								)}
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default DataTable
