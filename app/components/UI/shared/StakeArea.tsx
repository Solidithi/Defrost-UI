import Logo from '@/public/Logo.png'
import Image from 'next/image'
import Vector from '@/public/Vector.svg'
import Button from '@/app/components/UI/button/Button'
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalTrigger,
} from '@/app/components/UI/modal/AnimatedModal'
import { useStakeAreaStore } from '@/app/store/launchpool'
const StakeArea = () => {
	const { setStakeAmount } = useStakeAreaStore()

	return (
		<div className="mt-6">
			<div className="glass-enhanced p-4 text-white rounded-lg">
				<div className="glass-enhanced rounded-lg h-36">
					<div className="font-orbitron font-bold text-base mt-6 mb-7 ml-4 text-[#C2C6CC]">
						Number of staked token
					</div>

					<div className="flex flex-row items-center">
						<div className="ml-6 text-white text-2xl font-bold font-comfortaa">
							{/* --USDT */}
							<input
								type="number"
								className="bg-transparent border-none outline-none text-white text-2xl font-bold font-comfortaa w-52"
								onChange={(e) => setStakeAmount(parseFloat(e.target.value))}
								placeholder="--USDT"
							/>
						</div>
						{/* Token choosing */}
						<ModalTrigger className="ml-auto mr-4">
							<div className=" flex glass-enhanced w-20 h-10 rounded-3xl">
								<div className="flex justify-center items-center w-7 h-7 mt-1 ml-2 bg-gray-200 rounded-3xl">
									<Image
										src={Logo}
										alt="Logo"
										className="rounded-full"
										width={30}
										height={30}
									/>
								</div>

								{/* Vector */}
								<div className="flex justify-end items-center w-7 h-7 mt-1 ml-auto mr-3 rounded-3xl">
									<Image
										src={Vector}
										alt="Logo"
										className="rounded-full"
										width={9}
										height={9}
									/>
								</div>
							</div>
						</ModalTrigger>
					</div>
				</div>

				<div className=" flex flex-row gap-2 mt-4">
					{/* stake button */}
					<div className="">
						<Button
							className="w-56 font-extrabold"
							onClick={() => {
								alert('Stake button clicked')
							}}
						>
							Stake
						</Button>
					</div>

					<div className="">
						<button
							onClick={() => {
								alert('Unstake button clicked')
							}}
							className={`
								px-4 py-2 glass-enhanced text-white rounded-full w-28 font-comfortaa font-extrabold
								transition-all duration-300 ease-in-out 
    				hover:opacity-80 hover:shadow-lg hover:scale-105 
    				active:scale-95 active:opacity-90 
        		`}
						>
							Unstake
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StakeArea
