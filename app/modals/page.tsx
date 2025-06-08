'use client'

import { ModalsDemo } from '../components/UI/modal/ModalsDemo'
import { ModalsShowcase } from '../components/UI/modal/ModalsShowcase'
import { useState } from 'react'
/**
 * TODO: Showcasing purpose, remove when completed the implementation
 */
export default function ModalsPage() {
	const [activeTab, setActiveTab] = useState('showcase')

	return (
		<div className="w-full min-h-screen bg-black text-white p-6">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-4xl font-bold mb-6 font-orbitron text-center">
					Modal Components
				</h1>
				<p className="text-center mb-8 text-gray-300">
					This page demonstrates the various modal components available for
					providing user feedback.
				</p>

				<div className="flex justify-center mb-10">
					<div className="flex border border-gray-700 rounded-lg overflow-hidden">
						<button
							onClick={() => setActiveTab('showcase')}
							className={`px-6 py-3 text-sm font-medium transition-colors ${
								activeTab === 'showcase'
									? 'bg-blue-600 text-white'
									: 'bg-gray-900 text-gray-300 hover:bg-gray-800'
							}`}
						>
							Interactive Showcase
						</button>
						<button
							onClick={() => setActiveTab('demo')}
							className={`px-6 py-3 text-sm font-medium transition-colors ${
								activeTab === 'demo'
									? 'bg-blue-600 text-white'
									: 'bg-gray-900 text-gray-300 hover:bg-gray-800'
							}`}
						>
							Simple Demo
						</button>
					</div>
				</div>

				<div className="glass-component-3 border border-gray-700/40 rounded-2xl p-8">
					{activeTab === 'showcase' ? <ModalsShowcase /> : <ModalsDemo />}
				</div>
			</div>
		</div>
	)
}
