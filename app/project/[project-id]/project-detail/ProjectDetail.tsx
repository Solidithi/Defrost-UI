'use client'
import { AcernityCarousel } from '@/app/components/UI/carousel/AcernityCarousel'
import { LaunchpoolSection } from '@/app/components/project-detail-sections/LaunchpoolSection'
import { useParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { project } from '@prisma/client'
import { BackLight } from '@/app/components/UI/shared/SubtleBackLight'
import CarouselWithProgress from '@/app/components/UI/carousel/Carousel'
import AnimatedBlobs from '@/app/components/UI/background/AnimatedBlobs'
import ProjectHeader from '@/app/components/project-detail-sections/ProjectHeader'
import SideBar from '@/app/components/service-sections/SideBar'
import Logo from '@/public/Logo.png'
import Tabs from '@/app/components/UI/shared/Tabs'
import { ProjectOwnerIndicator } from '@/app/components/UI/shared/ProjectOwnerIndicator'

interface ProjectDetailProps {
	launchpools: EnrichedLaunchpool[] | undefined
	project: project | null
}

const ProjectDetail = ({ launchpools, project }: ProjectDetailProps) => {
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
		<div className="my-36 px-16 text-white">
			<BackLight />
			<AnimatedBlobs />
			<div className="flex items-start justify-start gap-6 min-h-screen relative z-10">
				<div className="sticky self-start">
					<SideBar selectedVToken={null} />
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

export default ProjectDetail
