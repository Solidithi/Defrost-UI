import { ProjectDetail, TokenPool } from '@/app/types'
import { AllPoolsTab } from '../../project-detail-sections/ContentTab'
import Button from '@/app/components/UI/button/Button'

const PoolTab = (projectDetail) => {
	return (
		<div className="">
			<div className="flex justify-end my-10">
				<Button
					className="bg-[#59A1EC] text-white font-orbitron font-bold  hover:bg-[#59A1EC]/80  py-4 rounded-2xl flex items-center"
					onClick={() => {
						// Handle button click
					}}
				>
					<span className="">Create New Pool</span>
					{/* <Plus size={16} /> */}
				</Button>
			</div>
			<AllPoolsTab
				projectCards={projectDetail.projectDetail.tokenPools.map(
					(pool: TokenPool) => ({
						projectName: pool.name,
						projectShortDescription: `Amount: ${pool.amount}, Percentage: ${pool.percentage}%`,
						projectAPR: `${pool.percentage}%`,
					})
				)}
			/>
		</div>
	)
}

export default PoolTab
