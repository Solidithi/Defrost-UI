'use client'
import { useState } from 'react'
import { PoolTab } from '@/app/components/service/launchpool/ContentTabs'
import { StatCard } from '@/app/components/UI/card/StatCard'
import { TokenInfo } from '@/app/store/staking'
import { BackLight } from '@/app/components/UI/shared/BackLight'
import BarChart from '@/app/components/charts/Barchart'
import DonutChart from '@/app/components/charts/DonutChart'
import LineChart from '@/app/components/charts/LineChart'
import StakedAmountChart from '@/app/components/charts/StatLineChart'
import SideBar from '@/app/components/service-sections/SideBar'
import Tabs from '@/app/components/UI/shared/Tabs'

const Launchpool = () => {
	// vToken filtering state (kept local as requested)
	const [selectedVToken, setSelectedVToken] = useState<TokenInfo | null>(null)

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
		<div className="mt-24 px-4 mb-8">
			<BackLight
				backgroundColor="#020203"
				overlayColor="#8B5CF6"
				opacity={0.1}
			/>
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
