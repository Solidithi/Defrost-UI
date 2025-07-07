'use client'
import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { GlowingEffect } from '@/app/components/UI/effect/GlowingEffect'
import CountUp from '@/app/components/UI/effect/Countup'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatNumber } from '@/app/utils/format'

interface StatCardProps {
	value: number
	label: string
	icon: string
	valuePrefix?: string
	valuePostfix?: string
	growthRate?: number
	isLoading?: boolean
}

export const StatCard = ({
	value = 0,
	label,
	icon,
	valuePrefix = '',
	valuePostfix = '',
	growthRate,
	isLoading = false,
}: StatCardProps) => {
	// Determine trend direction and color
	const getTrendConfig = (rate?: number) => {
		if (!rate || rate === 0) {
			return {
				icon: Minus,
				color: 'text-gray-400',
				bgColor: 'bg-gray-400/10',
				text: 'No change',
			}
		}

		if (rate > 0) {
			return {
				icon: TrendingUp,
				color: 'text-emerald-400',
				bgColor: 'bg-emerald-400/10',
				text: `+${Math.abs(rate).toFixed(1)}%`,
			}
		}

		return {
			icon: TrendingDown,
			color: 'text-red-400',
			bgColor: 'bg-red-400/10',
			text: `-${Math.abs(rate).toFixed(1)}%`,
		}
	}

	const trendConfig = getTrendConfig(growthRate)
	const TrendIcon = trendConfig.icon

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative group"
		>
			{/* Enhanced Glowing Effect */}
			<GlowingEffect
				spread={60}
				glow={true}
				disabled={false}
				proximity={80}
				inactiveZone={0.01}
				className="absolute inset-0 rounded-2xl"
			/>

			{/* Main Card with enhanced heated glassmorphism */}
			<div className="relative overflow-hidden rounded-2xl glass-heated transition-all duration-300 group-hover:glass-heated">
				{/* Enhanced background pattern with heated effects */}
				<div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-pink-500/5 to-cyan-400/3 opacity-60" />

				{/* Content */}
				<div className="relative p-6">
					{/* Header with Icon and Trend */}
					<div className="flex items-start justify-between mb-4">
						<div className="relative">
							{/* Enhanced heated border effect */}
							<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 via-cyan-400 to-purple-500 p-0.5 opacity-70">
								<div className="w-full h-full bg-black/20 rounded-xl" />
							</div>

							{/* Enhanced pulsing glow ring */}
							<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-cyan-400/30 animate-pulse blur-sm scale-110" />

							{/* Main container with heated effects */}
							<div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-600/35 via-pink-500/30 via-purple-600/35 via-violet-500/30 via-indigo-600/35 to-cyan-500/20 backdrop-blur-sm border border-white/25 shadow-2xl overflow-hidden">
								{/* Enhanced animated gradient overlay */}
								<div className="absolute inset-0 bg-gradient-to-tr from-purple-400/35 via-pink-500/30 via-purple-500/35 via-violet-400/30 to-cyan-400/25 animate-pulse opacity-95" />

								{/* Secondary animated layer */}
								<div
									className="absolute inset-0 bg-gradient-to-bl from-yellow-400/10 via-pink-500/20 via-purple-600/15 to-cyan-400/20 animate-pulse"
									style={{ animationDelay: '0.5s' }}
								/>

								{/* Dot patterns */}
								<div className="absolute inset-0 opacity-30">
									<div className="absolute top-1 left-1 w-1 h-1 bg-pink-400 rounded-full animate-pulse" />
									<div
										className="absolute top-2 right-2 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse"
										style={{ animationDelay: '0.2s' }}
									/>
									<div
										className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-pulse"
										style={{ animationDelay: '0.4s' }}
									/>
									<div
										className="absolute bottom-1 right-1 w-1 h-1 bg-purple-400 rounded-full animate-pulse"
										style={{ animationDelay: '0.6s' }}
									/>
								</div>

								{/* Techno connecting lines */}
								<div className="absolute inset-0 opacity-20">
									<div className="absolute top-2 left-2 w-4 h-px bg-gradient-to-r from-pink-400 to-transparent" />
									<div className="absolute bottom-2 right-2 w-4 h-px bg-gradient-to-l from-cyan-400 to-transparent" />
									<div className="absolute top-4 right-1 w-px h-3 bg-gradient-to-b from-purple-400 to-transparent" />
								</div>

								{/* Icon with enhanced effects */}
								<div className="relative z-10">
									<Image
										src={icon}
										alt={label}
										width={32}
										height={32}
										className="w-8 h-8 object-contain drop-shadow-2xl filter brightness-110 contrast-110"
									/>
								</div>
							</div>
						</div>

						{/* Trend Indicator */}
						{growthRate !== undefined && (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
								className={clsx(
									'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
									trendConfig.bgColor,
									trendConfig.color
								)}
							>
								<TrendIcon className="w-3 h-3" />
								<span>{trendConfig.text}</span>
							</motion.div>
						)}
					</div>

					{/* Main Value */}
					<div className="mb-2">
						<div className="flex items-baseline gap-1">
							{valuePrefix && (
								<span className="text-sm font-medium text-gray-300">
									{valuePrefix}
								</span>
							)}

							{isLoading ? (
								<div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
							) : (
								<CountUp
									from={0}
									to={value}
									separator=","
									direction="up"
									duration={2}
									className="text-3xl font-bold font-orbitron text-white"
								/>
							)}

							{valuePostfix && (
								<span className="text-sm font-medium text-gray-300 ml-1">
									{valuePostfix}
								</span>
							)}
						</div>
					</div>

					{/* Label */}
					<p className="text-gray-300 text-sm font-medium leading-relaxed">
						{label}
					</p>

					{/* Growth Rate Details */}
					{growthRate !== undefined && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="mt-3 pt-3 border-t border-white/10"
						>
							<div className="flex items-center justify-between text-xs">
								<span className="text-gray-400">24h trend</span>
								<span className={clsx('font-medium', trendConfig.color)}>
									{growthRate > 0 ? '+' : ''}
									{growthRate?.toFixed(2)}%
								</span>
							</div>
						</motion.div>
					)}
				</div>

				{/* Hover Effect Overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
			</div>
		</motion.div>
	)
}

export const StatCardSkeleton = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative group"
		>
			{/* Main Card */}
			<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 shadow-2xl">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />

				{/* Content */}
				<div className="relative p-6">
					{/* Header with Icon and Trend */}
					<div className="flex items-start justify-between mb-4">
						<div className="relative">
							<div className="p-3 rounded-xl bg-gradient-to-br from-fuchsia-500/25 via-purple-600/25 via-violet-500/25 to-indigo-600/25 backdrop-blur-sm border border-white/10 shadow-lg relative overflow-hidden">
								{/* Animated gradient overlay */}
								<div className="absolute inset-0 bg-gradient-to-tr from-pink-400/20 via-purple-500/20 to-cyan-400/20 animate-pulse opacity-75" />
								{/* Polkadot-inspired accent */}
								<div className="absolute inset-0 bg-gradient-to-bl from-transparent via-fuchsia-400/10 to-purple-600/20" />
								<div className="w-8 h-8 bg-white/10 rounded animate-pulse relative z-10" />
							</div>
						</div>

						{/* Trend Indicator Skeleton */}
						<div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10">
							<div className="w-3 h-3 bg-white/20 rounded animate-pulse" />
							<div className="w-8 h-3 bg-white/20 rounded animate-pulse" />
						</div>
					</div>

					{/* Main Value Skeleton */}
					<div className="mb-2">
						<div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
					</div>

					{/* Label Skeleton */}
					<div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-3" />

					{/* Growth Rate Details Skeleton */}
					<div className="pt-3 border-t border-white/10">
						<div className="flex items-center justify-between">
							<div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
							<div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
