import { ProjectDetail, TokenPool } from '@/app/types'
import Button from '../UI/button/Button'
import { project, launchpool } from '@prisma/client'
import { PoolDataType } from '@/app/types/input/create-launchpool'
import { PoolTab } from '../service/launchpool/ContentTabs'
import { EnrichedLaunchpool } from '@/app/types/extended-models/enriched-launchpool'
import { ExplorePoolTab } from './ExplorePoolTab'
import { useParams, useRouter } from 'next/navigation'
import { useStakingStore } from '@/app/store/staking'
import { useMemo } from 'react'

export const LaunchpoolSection = () => {
	const { pools } = useStakingStore()
	const launchpools = useMemo(() => {
		if (!pools || !pools.launchpools || !pools.launchpools.length) {
			return undefined
		}
		return pools.launchpools
	}, [pools.launchpools])

	const param = useParams()
	const projectID = param['project-id']
	const route = useRouter()

	const handleClick = () => {
		route.push('/project/' + projectID + '/launchpool')
	}

	return (
		<>
			{launchpools ? (
				<div className="mt-10 flex flex-col gap-10 ">
					<div className="flex flex-col gap-10 items-start">
						<span className="title-text font-orbitron text-left">
							Stake vTokens, <br />
							Earn High Rewards
						</span>
						<div className="relative p-6">
							<span>
								Amplify your earning potential. Our launchpool allows you to
								stake Bifrost vTokens, enabling you to earn valuable project
								token rewards while your original assets remain liquid and
								productive. This pioneering approach, a first for the Polkadot
								ecosystem, unlocks a new layer of liquidity and utility. By
								staking, you secure early access to promising projects and
								contribute to a more vibrant, interconnected DeFi landscape.
								Maximize your rewards and join the future of staking.
							</span>

							<div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />

							<div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />

							<div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />

							<div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
						</div>
					</div>
					<div className="">
						<div className="flex justify-between">
							<span className="font-orbitron text-4xl font-bold">
								High-yield Launchpools
							</span>
							<Button onClick={handleClick} className="warm-cool-bg px-16">
								More like this
							</Button>
						</div>
						<div className="w-full">
							{/* <PoolTab selectedVToken={null} poolLimit={3} /> */}
							<ExplorePoolTab selectedVToken={null} poolLimit={3} />
						</div>
					</div>
				</div>
			) : (
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<h2 className="text-xl font-semibold text-white mb-2">
							No Launchpools Found
						</h2>
						<p className="text-gray-600">
							The project does not have any launchpools at the moment.
						</p>
					</div>
				</div>
			)}
		</>
	)
}
