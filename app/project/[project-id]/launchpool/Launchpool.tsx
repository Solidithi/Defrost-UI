'use client'
import { useState } from 'react'
import { PoolTab } from '@/app/components/service/launchpool/ContentTabs'
import { StatCard } from '@/app/components/UI/card/StatCard'
import { TokenInfo } from '@/app/store/staking'
import { BackLight } from '@/app/components/UI/shared/BackLight'
import { useProjectStore } from '@/app/store/project'
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
			content: <PoolTab selectedVToken={selectedVToken} />,
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
		<div className="relative mt-24 px-4 mb-8 min-h-screen overflow-hidden">
			{/* Ambient background layers */}
			<div className="fixed inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
				<div className="absolute inset-0 bg-gradient-to-r from-purple-950/20 via-slate-900/30 to-blue-950/20"></div>
				<div
					className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: '8s' }}
				></div>
				<div
					className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: '6s', animationDelay: '2s' }}
				></div>
				<div
					className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-600/3 rounded-full blur-2xl animate-pulse"
					style={{ animationDuration: '10s', animationDelay: '4s' }}
				></div>
			</div>

			{/* Subtle animated particles */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div
					className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping"
					style={{ animationDelay: '0s', animationDuration: '4s' }}
				></div>
				<div
					className="absolute top-3/4 left-3/4 w-1 h-1 bg-blue-400/30 rounded-full animate-ping"
					style={{ animationDelay: '2s', animationDuration: '5s' }}
				></div>
				<div
					className="absolute top-1/2 right-1/4 w-1 h-1 bg-pink-400/20 rounded-full animate-ping"
					style={{ animationDelay: '3s', animationDuration: '6s' }}
				></div>
			</div>

			<BackLight
				backgroundColor="#020203"
				overlayColor="#8B5CF6"
				opacity={0.5}
			/>
			<div className="relative z-10 flex items-start justify-start gap-6 min-h-screen">
				<div className="sticky top-32 self-start">
					<SideBar
						selectedVToken={selectedVToken}
						projectLogo={currentProject?.logo || undefined}
						projectName={currentProject?.name || ''}
						onVTokenSelect={setSelectedVToken}
						socials={mockSocials}
					/>
				</div>
				<div className="flex-1">
					<Tabs
						tabs={tabs}
						activeTabClassName="bg-gradient-to-r from-purple-600/95 via-blue-600/95 to-pink-600/95 text-white font-black shadow-xl shadow-purple-500/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl transition-all duration-500"
						tabClassName="text-slate-300 rounded-2xl w-full px-6 py-4 text-lg font-bold hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-blue-500/20 hover:to-pink-500/20 hover:text-white transition-all duration-500 backdrop-blur-md border border-transparent hover:border-purple-400/30"
						containerClassName="mb-8"
						contentClassName="bg-transparent rounded-2xl"
					/>
				</div>
			</div>
		</div>
	)
}

export default Launchpool
