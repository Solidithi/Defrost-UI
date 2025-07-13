'use client'
import { AcernityCarousel } from '@/app/components/UI/carousel/AcernityCarousel'
import { LaunchpoolSection } from '@/app/components/project-detail-sections/LaunchpoolSection'
import { useParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { project } from '@prisma/client'
import { BackLight } from '@/app/components/UI/shared/BackLight'
import { ProjectOwnerIndicator } from '@/app/components/UI/shared/ProjectOwnerIndicator'
import { useProjectStore } from '@/app/store/project'
import CarouselWithProgress from '@/app/components/UI/carousel/Carousel'
import AnimatedBlobs from '@/app/components/UI/background/AnimatedBlobs'
import ProjectHeader from '@/app/components/project-detail-sections/ProjectHeader'
import SideBar from '@/app/components/service-sections/SideBar'
import Logo from '@/public/Logo.png'
import Tabs from '@/app/components/UI/shared/Tabs'

interface ProjectDetailProps {
	project: project | null
}

const ProjectGeneral = ({ project }: ProjectDetailProps) => {
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

	const { currentProject } = useProjectStore()

	const params = useParams()
	const projectId = params['project-id']

	// Wallet connection
	const account = useAccount()

	// Check if current user is project owner
	const isProjectOwner =
		account.address &&
		project?.owner_id &&
		account.address.toLowerCase() === project.owner_id.toLowerCase()
	// const [projectDetails, setProjectDetails] = useState()
	// const { project } = useProjectStore()

	// const { poolData, pool, fetchLaunchpoolData } = usePoolStore()

	// useEffect(() => {
	// 	if (projectId && typeof projectId === 'string') {
	// 		fetchProject(projectId)
	// 		// fetchLaunchpoolData(projectId)
	// 	}

	// 	// return () => {
	// 	// 	clearProject()
	// 	// }
	// }, [projectId])
	console.log('Project ID:', projectId)
	console.log('Current Project:', project)
	// console.log('Pool:', pool)
	// console.log('PoolData:', poolData)
	const tabs = [
		{
			title: 'Launchpool',
			value: 'description',
			content: <LaunchpoolSection />,
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
		<div className="relative px-16 text-white min-h-screen overflow-hidden">
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

			{/* <BackLight /> */}
			<AnimatedBlobs />
			<div className="relative z-10  my-36 flex items-start justify-start gap-6 min-h-screen">
				<div className="sticky self-start">
					<SideBar
						selectedVToken={null}
						projectLogo={currentProject?.logo || undefined}
						projectName={currentProject?.name || ''}
					/>
				</div>
				<div className="h-auto w-full rounded-xl glass-enhanced flex flex-wrap flex-col gap-10 justify-center items-center p-20">
					<div className=" self-start">
						{/* <ProjectHeader projectDetail={project} /> */}
						{project && (
							<ProjectHeader
								id={Number(project.id)}
								name={project.name ?? 'Unnamed'}
								short_description={project.short_description ?? ''}
								logo={project.logo ?? '/placeholder.png'}
							/>
						)}
					</div>

					{/* Project Owner Indicator */}
					{account.isConnected && isProjectOwner && (
						<ProjectOwnerIndicator containerClassName="w-full" />
					)}
					<div className="h-auto w-full ">
						{/* <AcernityCarousel slides={slideData} /> */}
						{/* <CarouselWithProgress images={project.images} /> */}
						{/* {project?.images && (
							<CarouselWithProgress images={project.images} />
						)} */}
						<CarouselWithProgress
							images={
								project?.images.map((url) => ({
									src: url,
									alt: 'Project image',
								})) ?? []
							}
						/>
					</div>
					<div className="relative p-6">
						<span className="content-text block">
							{/* If you have funded this project, we will be in touch to let you
							know when the rewards have started distributing and when you can
							claim them. If you have funded this project, we will be in touch
							to let you know when the rewards have started distributing and
							when you can claim them. If you have funded this project, we will
							be in touch to let you know when the rewards have started
							distributing and when you can claim them. */}
							{project?.long_description}
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

export default ProjectGeneral
