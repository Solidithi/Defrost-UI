import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/app/components/UI/shadcn/Dialog'
import { Award, AlertCircle } from 'lucide-react'
import { Input } from '@/app/components/UI/shadcn/Input'
import { useState, useMemo, useEffect } from 'react'
import { TokenInfo } from '@/app/store/staking'
import {
	useAccount,
	useBalance,
	useWriteContract,
	useWaitForTransactionReceipt,
} from 'wagmi'
import { parseUnits, formatUnits } from 'ethers'
import { Launchpool__factory } from '@/app/types/typechain'
import { useApproveAndeDepositToken } from '@/app/hooks/useApproveAndSendToken'
import { toast, ToastContainer } from 'react-toastify'
import Spinner from '../effect/Spinner'
import { cn } from '@/app/lib/utils'

function getFunctionAbiFromIface(factory: any, functionName: string): any {
	return [factory.abi.find((f: any) => f.name === functionName)]
}

interface StakingModalProps {
	open: boolean
	onClose: () => void
	tokenPair: {
		stake: TokenInfo
		reward: TokenInfo
	}
	apr: number
	balance: string
	projectName: string
	poolAddress: string
}

export function StakingModal({
	open,
	onClose,
	tokenPair,
	apr,
	balance,
	projectName,
	poolAddress,
}: StakingModalProps) {
	const [amount, setAmount] = useState('')
	const account = useAccount()

	// Get user's token balance
	const { data: tokenBalance } = useBalance({
		address: account.address,
		token: tokenPair.stake.address as `0x${string}`,
		query: {
			enabled: !!account.address && !!tokenPair.stake.address,
		},
	})

	const parsedStakeAmount = useMemo(() => {
		if (!amount) return BigInt(0)
		return parseUnits(amount, tokenPair.stake.decimals)
	}, [amount, tokenPair.stake.decimals])

	// Handle stake with approval
	const { deposit, approval } = useApproveAndeDepositToken({
		depositFunctionABI: getFunctionAbiFromIface(Launchpool__factory, 'stake'),
		depositFunctionName: 'stake',
		depositFunctionArgs: [parsedStakeAmount],
		amount: parsedStakeAmount,
		recipientAddress: poolAddress as `0x${string}`,
		tokenAddress: tokenPair.stake.address as `0x${string}`,
	})

	const handleStake = async () => {
		if (!amount || parseFloat(amount) <= 0) return

		try {
			await deposit.deposit()
			setAmount('')
		} catch (error) {
			console.error('Error staking:', error)
		}
	}

	// Handle set max amount
	const handleSetMax = () => {
		if (tokenBalance) {
			setAmount(formatUnits(tokenBalance.value, tokenBalance.decimals))
		}
	}

	// Show success/error toasts
	useEffect(() => {
		if (deposit.depositConfirmStatus === 'success') {
			toast.success('Staking successful!', {
				position: 'top-right',
				autoClose: 5000,
			})
			onClose()
		} else if (deposit.depositConfirmStatus === 'error') {
			toast.error('Staking failed!', {
				position: 'top-right',
				autoClose: 5000,
			})
		}
	}, [deposit.depositConfirmStatus, onClose])

	const isButtonDisabled = useMemo(() => {
		const disabled =
			!amount ||
			parseFloat(amount) <= 0 ||
			!tokenBalance ||
			parseFloat(amount) >
				parseFloat(formatUnits(tokenBalance.value, tokenBalance.decimals)) ||
			approval.approveStatus === 'pending' ||
			approval.isConfirmingApproval ||
			deposit.depositStatus === 'pending'

		console.log('StakingModal - isButtonDisabled:', disabled, {
			amount,
			tokenBalance: tokenBalance
				? formatUnits(tokenBalance.value, tokenBalance.decimals)
				: null,
			approveStatus: approval.approveStatus,
			depositStatus: deposit.depositStatus,
			isConfirmingApproval: approval.isConfirmingApproval,
		})

		return disabled
	}, [
		amount,
		tokenBalance,
		approval.approveStatus,
		approval.isConfirmingApproval,
		deposit.depositStatus,
	])

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 text-white max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						Stake {tokenPair.stake.symbol}
					</DialogTitle>
					<DialogDescription className="text-gray-400">
						Stake your {tokenPair.stake.symbol} tokens to earn{' '}
						{tokenPair.reward.symbol} rewards in the {projectName}.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-400">APR</span>
						<span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
							{apr}%
						</span>
					</div>

					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-400">Available Balance</span>
						<span>
							{tokenBalance
								? `${formatUnits(tokenBalance.value, tokenBalance.decimals)} ${tokenPair.stake.symbol}`
								: `0.00 ${tokenPair.stake.symbol}`}
						</span>
					</div>

					<div className="space-y-2">
						<label htmlFor="amount" className="text-sm text-gray-400">
							Amount to Stake
						</label>
						<div className="relative">
							<Input
								id="amount"
								type="text"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="bg-gray-800 border-gray-700 text-white pr-20"
								placeholder="0.0"
							/>
							<button
								className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 px-2 py-1 rounded text-xs"
								onClick={handleSetMax}
							>
								MAX
							</button>
						</div>
					</div>

					<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-3 rounded-lg">
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-400">Estimated Rewards</span>
							<span>
								{amount
									? `${((Number.parseFloat(amount.replace(/,/g, '')) * apr) / 100).toFixed(2)} ${tokenPair.reward.symbol}`
									: `0 ${tokenPair.reward.symbol}`}
							</span>
						</div>
					</div>
				</div>

				<DialogFooter>
					<button
						onClick={onClose}
						className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-2 rounded"
					>
						Cancel
					</button>
					<button
						onClick={handleStake}
						disabled={isButtonDisabled}
						className={cn(
							'px-4 py-2 rounded transition-all duration-200',
							isButtonDisabled
								? 'bg-gray-600 text-gray-400 cursor-not-allowed'
								: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
						)}
					>
						<span className="flex items-center justify-center">
							{approval.approveStatus === 'pending' ? (
								<>
									Approving...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : approval.isConfirmingApproval ? (
								<>
									Confirming approval...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : deposit.depositStatus === 'pending' &&
							  deposit.isDepositStarted ? (
								<>
									Staking...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : deposit.depositStatus === 'success' &&
							  deposit.depositConfirmStatus === 'pending' ? (
								<>
									Confirming transaction...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : (
								'Stake'
							)}
						</span>
					</button>
				</DialogFooter>
			</DialogContent>
			<ToastContainer />
		</Dialog>
	)
}

interface ManageStakeModalProps {
	open: boolean
	onClose: () => void
	tokenPair: {
		stake: TokenInfo
		reward: TokenInfo
	}
	apr: number
	staked: string
	rewards: string
	balance: string
	projectName: string
	poolAddress: string
	withdrawableVTokens: bigint
}

export function ManageStakeModal({
	open,
	onClose,
	tokenPair,
	apr,
	staked,
	rewards,
	balance,
	projectName,
	poolAddress,
	withdrawableVTokens,
}: ManageStakeModalProps) {
	const [action, setAction] = useState<'stake' | 'unstake'>('stake')
	const [amount, setAmount] = useState('')
	const account = useAccount()

	// Get user's token balance for staking
	const { data: tokenBalance } = useBalance({
		address: account.address,
		token: tokenPair.stake.address as `0x${string}`,
		query: {
			enabled: !!account.address && !!tokenPair.stake.address,
		},
	})

	const parsedAmount = useMemo(() => {
		if (!amount) return BigInt(0)
		return parseUnits(amount, tokenPair.stake.decimals)
	}, [amount, tokenPair.stake.decimals])

	// Handle stake with approval (for stake more)
	const { deposit, approval } = useApproveAndeDepositToken({
		depositFunctionABI: getFunctionAbiFromIface(Launchpool__factory, 'stake'),
		depositFunctionName: 'stake',
		depositFunctionArgs: [parsedAmount],
		amount: parsedAmount,
		recipientAddress: poolAddress as `0x${string}`,
		tokenAddress: tokenPair.stake.address as `0x${string}`,
	})

	// Handle unstake
	const {
		writeContractAsync: unstake,
		data: unstakeTxHash,
		status: unstakeStatus,
	} = useWriteContract()

	const { status: unstakeConfirmStatus } = useWaitForTransactionReceipt({
		hash: unstakeTxHash,
	})

	// Handle claim rewards
	const {
		writeContract: claimRewards,
		status: claimRewardsStatus,
		data: claimRewardsTxHash,
	} = useWriteContract()

	const { status: claimRewardsConfirmStatus } = useWaitForTransactionReceipt({
		hash: claimRewardsTxHash,
	})

	const handleAction = async () => {
		if (!amount || parseFloat(amount) <= 0) return

		console.log('ManageStakeModal - handleAction called:', {
			action,
			amount,
			parsedAmount: parsedAmount.toString(),
		})

		try {
			if (action === 'stake') {
				await deposit.deposit()
			} else {
				await unstake({
					abi: getFunctionAbiFromIface(Launchpool__factory, 'unstake'),
					address: poolAddress as `0x${string}`,
					functionName: 'unstake',
					args: [parsedAmount],
				})
			}
			setAmount('')
		} catch (error) {
			console.error(`Error ${action}ing:`, error)
		}
	}

	const handleClaimRewards = () => {
		console.log('ManageStakeModal - handleClaimRewards called')
		claimRewards({
			abi: getFunctionAbiFromIface(Launchpool__factory, 'claimProjectTokens'),
			address: poolAddress as `0x${string}`,
			functionName: 'claimProjectTokens',
			args: [],
		})
	}

	const handleSetMax = () => {
		if (action === 'stake' && tokenBalance) {
			setAmount(formatUnits(tokenBalance.value, tokenBalance.decimals))
		} else if (
			action === 'unstake' &&
			withdrawableVTokens &&
			withdrawableVTokens > BigInt(0)
		) {
			setAmount(formatUnits(withdrawableVTokens, tokenPair.stake.decimals))
		}
	}

	// Show success/error toasts
	useEffect(() => {
		if (deposit.depositConfirmStatus === 'success') {
			toast.success('Staking successful!', {
				position: 'top-right',
				autoClose: 5000,
			})
		} else if (deposit.depositConfirmStatus === 'error') {
			toast.error('Staking failed!', { position: 'top-right', autoClose: 5000 })
		}
	}, [deposit.depositConfirmStatus])

	useEffect(() => {
		if (unstakeConfirmStatus === 'success') {
			toast.success('Unstaking successful!', {
				position: 'top-right',
				autoClose: 5000,
			})
		} else if (unstakeConfirmStatus === 'error') {
			toast.error('Unstaking failed!', {
				position: 'top-right',
				autoClose: 5000,
			})
		}
	}, [unstakeConfirmStatus])

	useEffect(() => {
		if (claimRewardsConfirmStatus === 'success') {
			toast.success('Claiming rewards successful!', {
				position: 'top-right',
				autoClose: 5000,
			})
		} else if (claimRewardsConfirmStatus === 'error') {
			toast.error('Claiming rewards failed!', {
				position: 'top-right',
				autoClose: 5000,
			})
		}
	}, [claimRewardsConfirmStatus])

	const isActionButtonDisabled = useMemo(() => {
		console.log('Amount = ', amount)
		console.log('parseFloat(amount) = ', parseFloat(amount))
		if (!amount || parseFloat(amount) <= 0) {
			console.log(
				'ManageStakeModal - Button disabled: No amount or amount <= 0'
			)
			return true
		}

		console.log('ManageStakeModal - isActionButtonDisabled check:', {
			amount: parseFloat(amount),
			action,
			withdrawableVTokens: withdrawableVTokens
				? parseFloat(formatUnits(withdrawableVTokens, tokenPair.stake.decimals))
				: 0,
			tokenBalance: tokenBalance
				? parseFloat(formatUnits(tokenBalance.value, tokenBalance.decimals))
				: null,
		})

		if (action === 'stake') {
			const disabled =
				!tokenBalance ||
				parseFloat(amount) >
					parseFloat(formatUnits(tokenBalance.value, tokenBalance.decimals)) ||
				approval.approveStatus === 'pending' ||
				approval.isConfirmingApproval ||
				deposit.depositStatus === 'pending'

			console.log('ManageStakeModal - Stake button disabled:', disabled)
			return disabled
		} else {
			const disabled =
				!withdrawableVTokens ||
				withdrawableVTokens === BigInt(0) ||
				parseFloat(amount) >
					parseFloat(
						formatUnits(withdrawableVTokens, tokenPair.stake.decimals)
					) ||
				unstakeStatus === 'pending' ||
				(unstakeTxHash && unstakeConfirmStatus === 'pending')

			console.log('ManageStakeModal - Unstake button disabled:', disabled, {
				hasWithdrawableVTokens: !!withdrawableVTokens,
				withdrawableVTokensValue: withdrawableVTokens
					? withdrawableVTokens.toString()
					: 'null',
				amountVsWithdrawable: withdrawableVTokens
					? parseFloat(amount) <=
						parseFloat(
							formatUnits(withdrawableVTokens, tokenPair.stake.decimals)
						)
					: false,
				unstakeStatus,
				unstakeConfirmStatus,
				unstakeTxHash: !!unstakeTxHash,
			})
			return disabled
		}
	}, [
		amount,
		action,
		tokenBalance,
		withdrawableVTokens,
		approval.approveStatus,
		approval.isConfirmingApproval,
		deposit.depositStatus,
		unstakeStatus,
		unstakeConfirmStatus,
		unstakeTxHash,
		tokenPair.stake.decimals,
	])

	const isClaimButtonDisabled = useMemo(() => {
		return (
			parseFloat(rewards.replace(/[^0-9.]/g, '')) <= 0 ||
			claimRewardsStatus === 'pending' ||
			(claimRewardsTxHash && claimRewardsConfirmStatus === 'pending')
		)
	}, [
		rewards,
		claimRewardsStatus,
		claimRewardsConfirmStatus,
		claimRewardsTxHash,
	])

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 text-white max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						Manage Your Stake
					</DialogTitle>
					<DialogDescription className="text-gray-400">
						Manage your {tokenPair.stake.symbol} tokens in the {projectName}.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4 mb-4">
						<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Currently Staked</div>
							<div className="text-lg font-medium">{staked}</div>
						</div>
						<div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-md rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Current Rewards</div>
							<div className="text-lg font-medium">{rewards}</div>
						</div>
					</div>

					<div className="flex border border-gray-800 rounded-lg overflow-hidden">
						<button
							className={`flex-1 py-2 ${
								action === 'stake'
									? 'bg-gradient-to-r from-blue-500 to-purple-500'
									: 'bg-gray-800'
							}`}
							onClick={() => setAction('stake')}
						>
							Stake More
						</button>
						<button
							className={`flex-1 py-2 ${
								action === 'unstake'
									? 'bg-gradient-to-r from-blue-500 to-purple-500'
									: 'bg-gray-800'
							}`}
							onClick={() => setAction('unstake')}
						>
							Unstake
						</button>
					</div>

					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-400">
							{action === 'stake' ? 'Available Balance' : 'Staked Amount'}
						</span>
						<span>
							{action === 'stake'
								? tokenBalance
									? `${formatUnits(tokenBalance.value, tokenBalance.decimals)} ${tokenPair.stake.symbol}`
									: `0.00 ${tokenPair.stake.symbol}`
								: `${formatUnits(withdrawableVTokens, tokenPair.stake.decimals)} ${tokenPair.stake.symbol}`}
						</span>
					</div>

					<div className="space-y-2">
						<label htmlFor="amount" className="text-sm text-gray-400">
							Amount to {action === 'stake' ? 'Stake' : 'Unstake'}
						</label>
						<div className="relative">
							<Input
								id="amount"
								type="text"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="bg-gray-800 border-gray-700 text-white pr-20"
								placeholder="0.0"
							/>
							<button
								className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 px-2 py-1 rounded text-xs"
								onClick={handleSetMax}
							>
								MAX
							</button>
						</div>
					</div>

					<div className="flex justify-between items-center">
						<button
							className={cn(
								'px-3 py-2 rounded border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200',
								isClaimButtonDisabled && 'opacity-50 cursor-not-allowed'
							)}
							onClick={handleClaimRewards}
							disabled={isClaimButtonDisabled}
						>
							<span className="flex items-center justify-center">
								{claimRewardsStatus === 'pending' ? (
									<>
										Claiming...&emsp;
										<Spinner heightWidth={4} />
									</>
								) : claimRewardsStatus === 'success' &&
								  claimRewardsConfirmStatus === 'pending' ? (
									<>
										Confirming...&emsp;
										<Spinner heightWidth={4} />
									</>
								) : (
									'Claim Rewards'
								)}
							</span>
						</button>
						<span className="text-sm text-gray-400">{rewards} available</span>
					</div>
				</div>

				<DialogFooter>
					<button
						onClick={onClose}
						className="px-4 py-2 rounded border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
					>
						Cancel
					</button>
					<button
						onClick={handleAction}
						disabled={isActionButtonDisabled}
						className={cn(
							'px-4 py-2 rounded transition-all duration-200',
							isActionButtonDisabled
								? 'bg-gray-600 text-gray-400 cursor-not-allowed'
								: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
						)}
					>
						<span className="flex items-center justify-center">
							{action === 'stake' ? (
								approval.approveStatus === 'pending' ? (
									<>
										Approving...&emsp;
										<Spinner heightWidth={4} />
									</>
								) : approval.isConfirmingApproval ? (
									<>
										Confirming approval...&emsp;
										<Spinner heightWidth={4} />
									</>
								) : deposit.depositStatus === 'pending' &&
								  deposit.isDepositStarted ? (
									<>
										Staking...&emsp;
										<Spinner heightWidth={4} />
									</>
								) : deposit.depositStatus === 'success' &&
								  deposit.depositConfirmStatus === 'pending' ? (
									<>
										Confirming transaction...&emsp;
										<Spinner heightWidth={4} />
									</>
								) : (
									'Stake'
								)
							) : unstakeStatus === 'pending' ? (
								<>
									Unstaking...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : unstakeStatus === 'success' &&
							  unstakeConfirmStatus === 'pending' ? (
								<>
									Confirming transaction...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : (
								'Unstake'
							)}
						</span>
					</button>
				</DialogFooter>
			</DialogContent>
			<ToastContainer />
		</Dialog>
	)
}

// Claim Rewards Dialog Component
interface ClaimRewardModalProps {
	open: boolean
	onClose: () => void
	tokenPair: {
		stake: TokenInfo
		reward: TokenInfo
	}
	staked: string
	rewards: string
	projectName: string
	poolAddress: string
}

export function ClaimRewardModal({
	open,
	onClose,
	tokenPair,
	staked,
	rewards,
	projectName,
	poolAddress,
}: ClaimRewardModalProps) {
	const {
		writeContract: claimRewards,
		status: claimRewardsStatus,
		data: claimRewardsTxHash,
	} = useWriteContract()

	const { status: claimRewardsConfirmStatus } = useWaitForTransactionReceipt({
		hash: claimRewardsTxHash,
	})

	const handleClaim = () => {
		claimRewards({
			abi: getFunctionAbiFromIface(Launchpool__factory, 'claimProjectTokens'),
			address: poolAddress as `0x${string}`,
			functionName: 'claimProjectTokens',
			args: [],
		})
	}

	useEffect(() => {
		if (claimRewardsConfirmStatus === 'success') {
			toast.success('Claiming rewards successful!', {
				position: 'top-right',
				autoClose: 5000,
			})
			onClose()
		} else if (claimRewardsConfirmStatus === 'error') {
			toast.error('Claiming rewards failed!', {
				position: 'top-right',
				autoClose: 5000,
			})
		}
	}, [claimRewardsConfirmStatus, onClose])

	const isClaimButtonDisabled = useMemo(() => {
		return (
			parseFloat(rewards.replace(/[^0-9.]/g, '')) <= 0 ||
			claimRewardsStatus === 'pending' ||
			(claimRewardsTxHash && claimRewardsConfirmStatus === 'pending')
		)
	}, [
		rewards,
		claimRewardsStatus,
		claimRewardsConfirmStatus,
		claimRewardsTxHash,
	])

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 text-white max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">Claim Rewards</DialogTitle>
					<DialogDescription className="text-gray-400">
						Claim your earned {tokenPair.reward.symbol} rewards from the{' '}
						{projectName}.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4 mb-4">
						<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Currently Staked</div>
							<div className="text-lg font-medium">{staked}</div>
						</div>
						<div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-md rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">
								Available Rewards
							</div>
							<div className="text-lg font-medium">{rewards}</div>
						</div>
					</div>

					<div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-lg flex items-start gap-3">
						<Award size={24} className="text-emerald-400 mt-0.5" />
						<div>
							<h4 className="font-medium text-emerald-400">
								Rewards Ready to Claim
							</h4>
							<p className="text-sm text-gray-300 mt-1">
								You have {rewards} {tokenPair.reward.symbol} tokens ready to be
								claimed. You can claim your rewards while keeping your stake
								active.
							</p>
						</div>
					</div>

					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-400">Reward Token</span>
						<span>{tokenPair.reward.symbol}</span>
					</div>

					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-400">Amount to Claim</span>
						<span>{rewards}</span>
					</div>
				</div>

				<DialogFooter className="flex flex-col sm:flex-row gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
					>
						Cancel
					</button>
					<button
						onClick={handleClaim}
						disabled={isClaimButtonDisabled}
						className={cn(
							'px-4 py-2 rounded w-full sm:w-auto transition-all duration-200',
							isClaimButtonDisabled
								? 'bg-gray-600 text-gray-400 cursor-not-allowed'
								: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
						)}
					>
						<span className="flex items-center justify-center">
							{claimRewardsStatus === 'pending' ? (
								<>
									Claiming...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : claimRewardsStatus === 'success' &&
							  claimRewardsConfirmStatus === 'pending' ? (
								<>
									Confirming...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : (
								'Claim Rewards'
							)}
						</span>
					</button>
				</DialogFooter>
			</DialogContent>
			<ToastContainer />
		</Dialog>
	)
}

// Withdraw Dialog Component
interface WithdrawModalProps {
	open: boolean
	onClose: () => void
	tokenPair: {
		stake: TokenInfo
		reward: TokenInfo
	}
	staked: string
	rewards: string
	projectName: string
	poolAddress: string
	withdrawableVTokens: bigint
}

export function WithdrawModal({
	open,
	onClose,
	tokenPair,
	staked,
	rewards,
	projectName,
	poolAddress,
	withdrawableVTokens,
}: WithdrawModalProps) {
	const {
		writeContractAsync: withdrawAll,
		data: withdrawTxHash,
		status: withdrawStatus,
	} = useWriteContract()

	const { status: withdrawConfirmStatus } = useWaitForTransactionReceipt({
		hash: withdrawTxHash,
	})

	const handleWithdraw = async () => {
		try {
			// Unstake all tokens
			await withdrawAll({
				abi: getFunctionAbiFromIface(Launchpool__factory, 'unstake'),
				address: poolAddress as `0x${string}`,
				functionName: 'unstake',
				args: [withdrawableVTokens],
			})
		} catch (error) {
			console.error('Error withdrawing:', error)
		}
	}

	useEffect(() => {
		if (withdrawConfirmStatus === 'success') {
			toast.success('Withdrawal successful!', {
				position: 'top-right',
				autoClose: 5000,
			})
			onClose()
		} else if (withdrawConfirmStatus === 'error') {
			toast.error('Withdrawal failed!', {
				position: 'top-right',
				autoClose: 5000,
			})
		}
	}, [withdrawConfirmStatus, onClose])

	const isWithdrawButtonDisabled = useMemo(() => {
		return (
			!withdrawableVTokens ||
			withdrawableVTokens === BigInt(0) ||
			withdrawStatus === 'pending' ||
			(withdrawTxHash && withdrawConfirmStatus === 'pending')
		)
	}, [
		withdrawableVTokens,
		withdrawStatus,
		withdrawConfirmStatus,
		withdrawTxHash,
	])

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 text-white max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">Withdraw All</DialogTitle>
					<DialogDescription className="text-gray-400">
						Withdraw your stake and rewards from the {projectName}.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 rounded-lg flex items-start gap-3">
						<AlertCircle size={24} className="text-amber-400 mt-0.5" />
						<div>
							<h4 className="font-medium text-amber-400">Pool Has Ended</h4>
							<p className="text-sm text-gray-300 mt-1">
								This pool has ended. You can now withdraw your stake and claim
								all rewards.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 mb-4">
						<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Your Stake</div>
							<div className="text-lg font-medium">{staked}</div>
						</div>
						<div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-md rounded-lg p-3">
							<div className="text-xs text-gray-400 mb-1">Your Rewards</div>
							<div className="text-lg font-medium">{rewards}</div>
						</div>
					</div>

					<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm text-gray-400">Stake to Withdraw</span>
							<span>
								{staked} {tokenPair.stake.symbol}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-400">Rewards to Claim</span>
							<span>
								{rewards} {tokenPair.reward.symbol}
							</span>
						</div>
					</div>
				</div>

				<DialogFooter>
					<button
						onClick={onClose}
						className="px-4 py-2 rounded border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
					>
						Cancel
					</button>
					<button
						onClick={handleWithdraw}
						disabled={isWithdrawButtonDisabled}
						className={cn(
							'px-4 py-2 rounded transition-all duration-200',
							isWithdrawButtonDisabled
								? 'bg-gray-600 text-gray-400 cursor-not-allowed'
								: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
						)}
					>
						<span className="flex items-center justify-center">
							{withdrawStatus === 'pending' ? (
								<>
									Processing...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : withdrawStatus === 'success' &&
							  withdrawConfirmStatus === 'pending' ? (
								<>
									Confirming...&emsp;
									<Spinner heightWidth={4} />
								</>
							) : (
								'Withdraw All'
							)}
						</span>
					</button>
				</DialogFooter>
			</DialogContent>
			<ToastContainer />
		</Dialog>
	)
}
