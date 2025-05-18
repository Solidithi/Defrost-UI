'use client'
import ProjectHeader from '@/app/components/project-detail-sections/ProjectHeader'
import SideBar from '@/app/components/service-sections/SideBar'
import { AcernityCarousel } from '@/app/components/UI/carousel/AcernityCarousel'
import Logo from '@/public/Logo.png'
import Tabs from '@/app/components/UI/shared/Tabs'
import Button from '@/app/components/UI/button/Button'
import { LaunchpoolStakingCard } from '@/app/components/UI/card/LaunchPoolStakingCard'
import PoolTab from '@/app/components/service/launchpool/ContentTabs'
import { AllPoolsTab } from '@/app/components/project-detail-sections/ContentTab'
import { TokenPool } from '@/app/types'
import { LaunchpoolDetail } from '@/app/components/project-detail-sections/LaunchpoolDetail'
import CarouselWithProgress from '@/app/components/UI/carousel/Carousel'
import AnimatedBlobs from '@/app/components/UI/background/AnimatedBlobs'

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

	const slideData = [
		{
			title: 'Mystic Mountains',
			button: 'Explore Component',
			src: 'https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			title: 'Urban Dreams',
			button: 'Explore Component',
			src: 'https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			title: 'Neon Nights',
			button: 'Explore Component',
			src: 'https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			title: 'Desert Whispers',
			button: 'Explore Component',
			src: 'https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
	]

	const tabs = [
		{
			title: 'Launchpool',
			value: 'description',
			content: <LaunchpoolDetail projectDetail={projectDetail} />,
		},

		{
			title: 'Launchpad',
			value: 'allPools',
			content: 'sđscdscdssdcs',
		},

		{
			title: 'NFT',
			value: 'allPools',
			content: 'sđscdscdssdcs',
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
		<div className="my-36 px-16   text-white">
			<AnimatedBlobs />
			<div className="flex items-start justify-start gap-6 min-h-screen relative z-10">
				<div className="sticky self-start">
					<SideBar />
				</div>
				<div className="h-auto w-full rounded-xl glass-component-1 flex flex-wrap flex-col gap-10 justify-center items-center p-20">
					<div className=" self-start">
						<ProjectHeader projectDetail={projectDetail} />
					</div>
					<div className="h-auto w-full ">
						{/* <AcernityCarousel slides={slideData} /> */}
						<CarouselWithProgress />
					</div>
					<div className="relative p-6">
						<span className="content-text block">
							If you have funded this project, we will be in touch to let you
							know when the rewards have started distributing and when you can
							claim them. If you have funded this project, we will be in touch
							to let you know when the rewards have started distributing and
							when you can claim them. If you have funded this project, we will
							be in touch to let you know when the rewards have started
							distributing and when you can claim them.
						</span>

						<div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />

						<div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />

						<div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />

						<div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
					</div>
					<div className="bg-white rounded-full w-full h-[1px]" />

					<div className="flex-1 w-full">
						<Tabs
							tabs={tabs}
							activeTabClassName="bg-white text-[#59A1EC] dark:bg-zinc-800"
							tabClassName="text-gray-300 rounded-lg w-full  text-lg hover:bg-white/10 dark:hover:bg-zinc-800"
							containerClassName=""
							contentClassName="dark:bg-zinc-800  rounded-lg "
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectDetail
