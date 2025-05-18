'use client'
import { StatCardItem } from '@/app/all-project/AllProject'
import BarChart from '@/app/components/charts/Barchart'
import DonutChart from '@/app/components/charts/DonutChart'
import LineChart from '@/app/components/charts/LineChart'
import SidebarLineChart from '@/app/components/charts/SideBarLineChart'
import StakedAmountChart from '@/app/components/charts/StatLineChart'
import { AllPoolsTab } from '@/app/components/project-detail-sections/ContentTab'
import SideBar from '@/app/components/service-sections/SideBar'
import PoolTab from '@/app/components/service/launchpool/ContentTabs'
import Button from '@/app/components/UI/button/Button'
import StatCard from '@/app/components/UI/card/StatCard'
import Tabs from '@/app/components/UI/shared/Tabs'
import { ProjectDetail } from '@/app/types'
import Logo from '@/public/Logo.png'

const Launchpool = () => {
	const projectDetail: ProjectDetail = {
		id: 1,
		name: 'Project Name',
		description:
			'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
		image: Logo,
		status: 'Upcoming',
		tokenPools: [
			{
				id: 1,
				name: 'Token Pool 1',
				amount: 1000,
				percentage: 10,
				poolImage:
					'https://plus.unsplash.com/premium_photo-1685793804465-b12bbd8b7281?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
			},
			{
				id: 2,
				name: 'Token Pool 2',
				amount: 2000,
				percentage: 20,
				poolImage:
					'https://plus.unsplash.com/premium_photo-1685793804465-b12bbd8b7281?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
			},
			{
				id: 3,
				name: 'Token Pool 3',
				amount: 3000,
				percentage: 30,
				poolImage:
					'https://plus.unsplash.com/premium_photo-1685793804465-b12bbd8b7281?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
			},
			//Create total 10 pools
			{
				id: 4,
				name: 'Token Pool 4',
				amount: 4000,
				percentage: 40,
				poolImage:
					'https://plus.unsplash.com/premium_photo-1685793804465-b12bbd8b7281?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
			},
			{
				id: 5,
				name: 'Token Pool 5',
				amount: 5000,
				percentage: 50,
				poolImage:
					'https://plus.unsplash.com/premium_photo-1685793804465-b12bbd8b7281?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
			},
			{
				id: 6,
				name: 'Token Pool 6',
				amount: 6000,
				percentage: 60,
				poolImage:
					'https://plus.unsplash.com/premium_photo-1685793804465-b12bbd8b7281?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
			},
			{
				id: 7,
				name: 'Token Pool 7',
				amount: 7000,
				percentage: 70,
				poolImage:
					'https://plus.unsplash.com/premium_photo-1685793804465-b12bbd8b7281?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
			},
			{
				id: 8,
				name: 'Token Pool 8',
				amount: 8000,
				percentage: 80,
				poolImage:
					'https://plus.unsplash.com/premium_photo-1685793804465-b12bbd8b7281?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
			},
			{
				id: 9,
				name: 'Token Pool 9',
				amount: 9000,
				percentage: 90,
				poolImage:
					'https://plus.unsplash.com/premium_photo-1685793804465-b12bbd8b7281?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D',
			},
		],
		socials: {
			website: 'https://www.example.com',
			twitter: 'https://twitter.com/example',
			telegram: 'https://t.me/example',
			discord: 'https://discord.gg/example',
			github: 'https://github.com/example',
		},
	}

	const statCardItems: StatCardItem[] = [
		{
			type: 'Current number of investors',
			count: 4000,
			label: 'Current number of investors',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
		{
			type: 'Current total staked',
			count: 2657,
			label: 'Current total staked',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8',
		},
		{
			type: 'Highest Total Staked Amount',
			count: 3000,
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
			content: <PoolTab projectDetail={projectDetail}></PoolTab>,
		},
		{
			title: 'Analytics',
			value: 'analytics',
			content: (
				<div className="">
					<div className="grid grid-cols-3 gap-8 w-full mx-auto mt-10 mb-24">
						{statCardItems.map((item, index) => (
							<StatCard
								key={index}
								type={item.type}
								count={item.count}
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
		<div className="mt-24 px-4">
			<div className="flex items-start justify-start gap-6 min-h-screen">
				<div className="sticky top-32 self-start">
					<SideBar socials={projectDetail.socials} />
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
