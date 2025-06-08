import { ProjectDetail, TokenPool } from '@/app/types'
import Button from '../UI/button/Button'
import { AllPoolsTab } from './ContentTab'
import { StaticImageData } from 'next/image'

export const LaunchpoolDetail = ({ projectDetail }: any) => {
	return (
		<div className="mt-10 flex flex-col gap-10 ">
			<div className="flex flex-col gap-10 items-center">
				<span className="title-text font-orbitron">ABC pool</span>
				<div className="relative p-6">
					<span className="content-text block">
						If you have funded this project, we will be in touch to let you know
						when the rewards have started distributing and when you can claim
						them. If you have funded this project, we will be in touch to let
						you know when the rewards have started distributing and when you can
						claim them. If you have funded this project, we will be in touch to
						let you know when the rewards have started distributing and when you
						can claim them. If you have funded this project, we will be in touch
						to let you know when the rewards have started distributing and when
						you can claim them. If you have funded this project, we will be in
						touch to let you know when the rewards have started distributing and
						when you can claim them. If you have funded this project, we will be
						in touch to let you know when the rewards have started distributing
						and when you can claim them. If you have funded this project, we
						will be in touch to let you know when the rewards have started
						distributing and when you can claim them. If you have funded this
						project, we will be in touch to let you know when the rewards have
						started distributing and when you can claim them. If you have funded
						this project, we will be in touch to let you know when the rewards
						have started distributing and when you can claim them. If you have
						funded this project, we will be in touch to let you know when the
						rewards have started distributing and when you can claim them.
					</span>

					<div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />

					<div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />

					<div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />

					<div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
				</div>
			</div>
			<div className="">
				<div className="flex justify-between">
					<span className="font-orbitron text-4xl font-bold">Launchpool</span>
					<Button className="warm-cool-bg px-16">More Detail</Button>
				</div>
				<div className="w-full">
					{/* <div className="grid grid-cols-3 gap-8 w-full mx-auto mt-10 mb-24">
						<PoolTab projectDetail={projectDetail}></PoolTab>
					</div> */}
					<AllPoolsTab
						projectCards={projectDetail.tokenPools
							.slice(0, 3)
							.map((pool: TokenPool) => ({
								projectName: pool.name,
								projectShortDescription: `Amount: ${pool.amount}, Percentage: ${pool.percentage}%`,
								projectAPR: `${pool.percentage}%`,
								projectImage: pool.poolImage,
							}))}
					/>
				</div>
			</div>
		</div>
	)
}
