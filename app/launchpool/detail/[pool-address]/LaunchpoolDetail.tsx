'use client'

import Image from 'next/image'
import Logo from '@/public/Logo.png'
import ProjectHeader from '@/app/components/project-detail-sections/ProjectHeader'
import ThumbNailCarousel from '@/app/components/UI/carousel/ThumbnailCarousel'
import ProjectProgress from '@/app/components/UI/project-progress/ProjectProgress'
import StakeArea from '@/app/components/UI/shared/StakeArea'
import {
	Modal,
	ModalBody,
	ModalContent,
} from '@/app/components/UI/modal/AnimatedModal'
import { motion } from 'framer-motion'
import Tabs from '@/app/components/UI/shared/Tabs'
import {
	AllPoolsTab,
	DescriptionTab,
} from '@/app/components/project-detail-sections/ContentTab'

const ProjectDetail = () => {
	const projectDetail = {
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
		],
	}

	const tabs = [
		{
			title: 'Description',
			value: 'description',
			content: <DescriptionTab />,
		},

		{
			title: 'All Pools',
			value: 'allPools',
			content: (
				<div className="flex flex-col gap-4">
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
		// {
		// 	title: 'Pools',
		// 	value: 'pools',
		// 	content: (
		// 		<div className="flex flex-col gap-4">
		// 			{/* Add content for Pools tab */}
		// 			<p>Pools Content</p>
		// 		</div>
		// 	),
		// },
	]

	return (
		<Modal>
			<div className="min-h-screen w-full">
				{/* Header */}
				<div className="px-20  pt-48 pb-12">
					<ProjectHeader projectDetail={projectDetail} />
				</div>

				{/* Main Content */}
				<div className="flex items-start justify-center gap-12 m-">
					{/* Left Column */}
					<div className="w-7/12">
						<ThumbNailCarousel />

						{/* Long content to allow scrolling */}
						{/* <div className="glass-component-1 text-white mt-10 p-6 rounded-lg">
							<p>
								{Array(20)
									.fill(
										'If you have funded this project, we will be in touch to let you know when the rewards have started distributing and when you can claim them.'
									)
									.join(' ')}
							</p>
						</div> */}

						<div className="">
							{/* <Tabs
								tabs={tabs}
								activeTabClassName="bg-white text-white dark:bg-zinc-800"
								tabClassName="text-white hover:bg-gray-700 dark:hover:bg-zinc-800"
								containerClassName=" mt-10"
								contentClassName=""
								// onTabClick={handleTabClick}
							></Tabs> */}
							<Tabs
								tabs={tabs}
								activeTabClassName="bg-white text-[#59A1EC] dark:bg-zinc-800"
								tabClassName="text-gray-300 rounded-lg px-3 py-2 hover:bg-gray-700 dark:hover:bg-zinc-800"
								containerClassName=" mt-10"
								// contentClassName="bg-gray-800 dark:bg-zinc-800 rounded-lg p-6"
							/>
						</div>
					</div>

					{/* Right Sticky Column */}
					<div className="w-3/12 h-fit sticky top-12 flex flex-col">
						<div className="">
							<ProjectProgress />
						</div>
						<div className="">
							<StakeArea />
						</div>
					</div>
				</div>
				<ModalBody>
					<ModalContent>
						<div className="z-30">
							<div className="mb-9 font-orbitron font-bold text-white text-center text-xl">
								All Pool
							</div>
							<div className="max-h-96 overflow-x-hidden overflow-y-auto px-4">
								{projectDetail.tokenPools.map((pool) => (
									<div key={pool.id}>
										<motion.div
											className="glass-component-1 h-12 mb-6 rounded-xl flex flex-row items-center hover:bg-gray-700 transition-colors duration-300"
											whileHover={{
												scale: 1.05,
												// backgroundColor: '#4B5563',
											}}
											whileTap={{ scale: 0.95 }}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
										>
											{/* Add content inside the glass component if needed */}
											<div className="mx-3 bg-white rounded-full w-8 h-8"></div>
											<div className="text-white font-bold">{pool.name}</div>
										</motion.div>
									</div>
								))}
							</div>
						</div>
					</ModalContent>
				</ModalBody>
			</div>
		</Modal>
	)
}

export default ProjectDetail
