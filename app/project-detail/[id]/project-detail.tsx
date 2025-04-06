'use client'

import Image from 'next/image'
import Logo from '@/public/Logo.png'
import ProjectHeader from '@/app/components/project-detail-sections/ProjectHeader'
import ThumbNailCarousel from '@/app/components/UI/ThumbnailCarousel'
import ProjectProgress from '@/app/components/UI/ProjectProgress/ProjectProgress'
import StakeArea from '@/app/components/UI/StakeArea'

const ProjectDetail = () => {
	const projectDetail = {
		id: 1,
		name: 'Project Name',
		description:
			'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
		image: Logo,
		status: 'Upcoming',
	}

	return (
		<div className="min-h-screen w-full">
			{/* Header */}
			<div className="px-10  pt-48 pb-12">
				<ProjectHeader projectDetail={projectDetail} />
			</div>

			{/* Main Content */}
			<div className="flex items-start justify-center gap-10 px-10">
				{/* Left Column */}
				<div className="w-7/12">
					<ThumbNailCarousel />

					{/* Long content to allow scrolling */}
					<div className="glass-component-1 text-white mt-10 p-6 rounded-lg">
						{/* <p>
              {Array(20)
                .fill(
                  "If you have funded this project, we will be in touch to let you know when the rewards have started distributing and when you can claim them."
                )
                .join(" ")}
            </p> */}
					</div>
				</div>

				{/* Right Sticky Column */}
				<div className="w-3/12 h-fit sticky top-12 flex ">
					<div className="">
						<ProjectProgress />
					</div>
					<div className="">
						<StakeArea />
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectDetail
