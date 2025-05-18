'use client'
import Image, { StaticImageData } from 'next/image'
interface ProjectHeaderProps {
	projectDetail: {
		id: number
		name: string
		description: string
		image: StaticImageData
		status: string
	}
}
const ProjectHeader = ({ projectDetail }: ProjectHeaderProps) => {
	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'upcoming':
				return 'bg-yellow-500 text-black'
			case 'on-going':
				return 'bg-[#102821] text-[#0E9A36]'
			case 'ended':
				return 'bg-red-500 text-white'
			default:
				return 'bg-gray-500 text-white' // Default color for unknown status
		}
	}

	return (
		<div>
			<div className="text-white">
				<div className="flex justify-between px-8 w-full">
					<div className="flex flex-row gap-5">
						<div className=" w-32">
							<Image
								src={projectDetail.image}
								alt="Project Logo"
								width={64}
								height={64}
								className="rounded-full object-cover items-center h-28 w-28 bg-slate-700 "
							/>
						</div>

						<div className="flex flex-col">
							<div className="flex ">
								<span className="text-2xl font-orbitron font-bold">
									{projectDetail.name}
								</span>

								<div
									className={`flex ml-14 justify-center items-center rounded-xl
                  text-xs font-semibold px-5 py-1 {} ${getStatusColor(
										projectDetail.status
									)}`}
								>
									{projectDetail.status.charAt(0).toUpperCase() +
										projectDetail.status.slice(1)}
								</div>
							</div>

							<div className="text-[#CACACA] font-comfortaa w-2/3  mt-2">
								{projectDetail.description}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectHeader
