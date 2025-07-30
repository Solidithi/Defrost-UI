'use client'

import { useState } from 'react'
import { PoolsTab } from '@/app/project/[project-id]/launchpool/PoolsTab'
import { StatCard } from '@/app/components/UI/card/StatCard'
import { TokenInfo } from '@/app/store/staking'
import { BackLight } from '@/app/components/UI/shared/BackLight'
import { useProjectStore } from '@/app/store/project'
import AnimatedBlobs from '@/app/components/UI/background/AnimatedBlobs'
import BarChart from '@/app/components/charts/Barchart'
import DonutChart from '@/app/components/charts/DonutChart'
import LineChart from '@/app/components/charts/LineChart'
import StakedAmountChart from '@/app/components/charts/StatLineChart'
import SideBar from '@/app/components/service-sections/SideBar'
import Tabs from '@/app/components/UI/shared/Tabs'

const Launchpool = () => {
	// vToken filtering state (kept local as requested)
	const [selectedVToken, setSelectedVToken] = useState<TokenInfo | null>(null)
	const { currentProject } = useProjectStore()

	const mockSocials = {
		website: 'https://www.example.com',
		twitter: 'https://twitter.com/example',
		telegram: 'https://t.me/example',
		discord: 'https://discord.gg/example',
		github: 'https://github.com/example',
	}

	const statCardItems = [
		{
			type: 'Current number of investors',
			value: 4000,
			label: 'Current number of investors',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
		{
			type: 'Current total staked',
			value: 2657,
			label: 'Current total staked',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
		{
			type: 'Highest Total Staked Amount',
			value: 3000,
			label: 'Highest Total Staked Amount',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
	]

	const barData = [4500, 5300, 3600, 1500]
	const barLabels = ['vASTR', 'vDOT', 'vGLMR', 'vKSM']
	const donutData = [6000, 4000]
	const donutLabels = ['Remaining tokens', 'Owned tokens']

	const tabs = [
		{
			title: 'Pools',
			value: 'pools',
			content: <PoolsTab selectedVToken={selectedVToken} />,
		},
		{
			title: 'Analytics',
			value: 'analytics',
			content: (
				<div>
					<div className="grid grid-cols-3 gap-8 w-full mx-auto mt-10 mb-24">
						{statCardItems.map((item, index) => (
							<StatCard
								key={index}
								// type={item.type}
								value={item.value}
								label={item.label}
								icon={item.icon}
							/>
						))}
					</div>
					<div className="grid grid-cols-2 gap-8">
						<div className="">
							{/* <SidebarLineChart
								data={barData}
								height={500}
								gradientFrom="#F05550"
								gradientTo="#54A4F2"
							/> */}
							<StakedAmountChart />
						</div>
						<div className="">
							<BarChart data={barData} label={barLabels} />
						</div>
						<div className="">
							<LineChart />
						</div>
						<div className="">
							<DonutChart
								title="Remaining token"
								series={donutData}
								labels={donutLabels}
							/>
						</div>
					</div>
					<div className="w-full mt-8">
						<LineChart />
					</div>
				</div>
			),
		},
	]

	return (
		<div className="mt-24 px-4 mb-8">
			{/* Ambient background layers */}
			<div className="fixed inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
				<div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/15 via-slate-900/20 to-purple-950/15"></div>
				<div
					className="absolute top-1/4 left-1/5 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: '9s' }}
				></div>
				<div
					className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-purple-600/6 rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: '7s', animationDelay: '1s' }}
				></div>
				<div
					className="absolute top-2/3 left-2/3 w-64 h-64 bg-blue-600/4 rounded-full blur-2xl animate-pulse"
					style={{ animationDuration: '11s', animationDelay: '3s' }}
				></div>
				<div
					className="absolute top-1/6 right-1/3 w-32 h-32 bg-pink-600/3 rounded-full blur-xl animate-pulse"
					style={{ animationDuration: '5s', animationDelay: '2s' }}
				></div>
			</div>

			{/* Subtle floating elements */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div
					className="absolute top-1/5 left-1/3 w-0.5 h-0.5 bg-indigo-400/40 rounded-full animate-ping"
					style={{ animationDelay: '1s', animationDuration: '4s' }}
				></div>
				<div
					className="absolute top-2/3 left-1/5 w-0.5 h-0.5 bg-purple-400/30 rounded-full animate-ping"
					style={{ animationDelay: '0s', animationDuration: '5s' }}
				></div>
				<div
					className="absolute top-1/2 right-1/6 w-0.5 h-0.5 bg-blue-400/25 rounded-full animate-ping"
					style={{ animationDelay: '2.5s', animationDuration: '6s' }}
				></div>
				<div
					className="absolute bottom-1/4 right-2/5 w-0.5 h-0.5 bg-pink-400/20 rounded-full animate-ping"
					style={{ animationDelay: '4s', animationDuration: '7s' }}
				></div>
			</div>

			<BackLight
				backgroundColor="#020203"
				overlayColor="#8B5CF6"
				opacity={0.03}
			/>
			<AnimatedBlobs />
			<div className="flex items-start justify-start gap-6 min-h-screen">
				<div className="sticky top-32 self-start">
					<SideBar
						selectedVToken={selectedVToken}
						onVTokenSelect={setSelectedVToken}
						// socials={{
						// 	website: currentProject?.website || '',
						// 	twitter: currentProject?.twitter || '',
						// 	telegram: currentProject?.telegram || '',
						// 	discord: currentProject?.discord || '',
						// 	github: currentProject?.github || '',
						// }}
						projectChainId={currentProject?.chain_id || 0}
						projectName={currentProject?.name || ''}
						projectLogo={currentProject?.logo || ''}
						socials={mockSocials}
					/>
				</div>
				<div className="flex-1">
					<Tabs
						tabs={tabs}
						activeTabClassName="bg-white text-[#59A1EC] dark:bg-zinc-800"
						tabClassName="text-gray-300 rounded-lg w-full px-3 py-4 text-lg hover:bg-gray-700 dark:hover:bg-zinc-800"
						containerClassName=""
						contentClassName="dark:bg-zinc-800 rounded-lg"
					/>
				</div>
			</div>
		</div>
	)
}

export default Launchpool
