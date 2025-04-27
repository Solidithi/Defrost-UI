'use client'
import { AllPoolsTab } from '@/app/components/project-detail-sections/ContentTab'
import SideBar from '@/app/components/service-sections/SideBar'
import Tabs from '@/app/components/UI/shared/Tabs'

const Launchpool = () => {
	const projectDetail = {
		id: 1,
		name: 'Project Name',
		description:
			'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
		image: '/Logo.png',
		status: 'Upcoming',
		tokenPools: [
			{
				id: 1,
				name: 'Token Pool 1	',
				amount: 1000,
				percentage: 10,
			},
			{
				id: 2,
				name: 'Token Pool 2',
				amount: 2000,
				percentage: 20,
			},
			{
				id: 3,
				name: 'Token Pool 3',
				amount: 3000,
				percentage: 30,
			},
			//Create total 10 pools
			{
				id: 4,
				name: 'Token Pool 4',
				amount: 4000,
				percentage: 40,
			},
			{
				id: 5,
				name: 'Token Pool 5',
				amount: 5000,
				percentage: 50,
			},
			{
				id: 6,
				name: 'Token Pool 6',
				amount: 6000,
				percentage: 60,
			},
			{
				id: 7,
				name: 'Token Pool 7',
				amount: 7000,
				percentage: 70,
			},
			{
				id: 8,
				name: 'Token Pool 8',
				amount: 8000,
				percentage: 80,
			},
			{
				id: 9,
				name: 'Token Pool 9',
				amount: 9000,
				percentage: 90,
			},
			{
				id: 10,
				name: 'Token Pool 10',
				amount: 10000,
				percentage: 100,
			},
		],
	}

	const tabs = [
		{
			title: 'Pools',
			value: 'pools',
			content: (
				<div className="">
					<AllPoolsTab
						projectCards={projectDetail.tokenPools.map((pool) => ({
							projectName: pool.name,
							projectShortDescription: `Amount: ${pool.amount}, Percentage: ${pool.percentage}%`,
							projectAPR: `${pool.percentage}%`,
						}))}
					/>
				</div>
			),
		},
		{
			title: 'Analytics',
			value: 'analytics',
			content: <p>Staking Content</p>,
		},
	]

	return (
		<div className="mt-24 px-4">
			<div className="flex items-start justify-start gap-6 min-h-screen">
				<div className="sticky top-32 self-start">
					<SideBar />
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
