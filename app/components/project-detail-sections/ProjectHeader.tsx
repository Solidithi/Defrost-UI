'use client'
import Image, { StaticImageData } from 'next/image'
import { useAccount } from 'wagmi'

interface ProjectHeaderProps {
	id: number
	name: string
	short_description: string
	logo: StaticImageData | string
	owner_id?: string
	// status: string
}
const ProjectHeader = ({
	id,
	name,
	short_description,
	logo,
	owner_id,
}: ProjectHeaderProps) => {
	const account = useAccount()

	// Check if current user is project owner
	const isProjectOwner =
		account.address &&
		owner_id &&
		account.address.toLowerCase() === owner_id.toLowerCase()

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'upcoming':
				return 'bg-yellow-500 text-black'
			case 'on-going':
				return 'bg-[#102821] text-[#0E9A36]'
			case 'ended':
				return 'bg-red-500 text-white'
			default:
				return 'bg-gray-500 text-white'
		}
	}

	return (
		<div>
			<div className="text-white">
				<div className="flex justify-between px-8 w-full">
					<div className="flex flex-row gap-5">
						<div className=" w-32">
							<Image
								src={logo}
								alt="Project Logo"
								width={64}
								height={64}
								className="rounded-full object-cover items-center h-28 w-28 bg-slate-700 "
							/>
						</div>

						<div className="flex flex-col">
							<div className="flex ">
								<span className="text-2xl font-orbitron font-bold">{name}</span>

								{/* <div
									className={`flex ml-14 justify-center items-center rounded-xl
                  text-xs font-semibold px-5 py-1 {} ${getStatusColor(
										projectDetail.status
									)}`}
								>
									{projectDetail.status.charAt(0).toUpperCase() +
										projectDetail.status.slice(1)}
								</div> */}
							</div>

							<div className="text-[#CACACA] font-comfortaa w-2/3 mt-2">
								{short_description}
							</div>

							{/* Project Owner Indicator - Compact */}
							{account.isConnected && isProjectOwner && (
								<div className="mt-4 w-fit bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/20 rounded-lg px-3 py-2 glass-enhanced">
									<div className="flex items-center gap-2">
										<div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
										<div>
											<h3 className="text-emerald-400 font-medium text-xs font-orbitron">
												Project Owner
											</h3>
											<p className="text-emerald-200/70 text-xs">
												Manage pools & claim rewards
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectHeader
